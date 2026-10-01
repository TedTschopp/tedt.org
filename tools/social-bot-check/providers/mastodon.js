import { htmlText, httpsUrl, mapConcurrent, parseTime, publicOrigin, textLength } from '../common.js';

const PARENT_BUDGET = 40;

export function parseMastodon(raw) {
  const value = raw.trim();
  let origin;
  let username;
  if (/^https?:\/\//i.test(value)) {
    origin = publicOrigin(value);
    const url = new URL(value);
    const match = /^\/(?:@([^/]+)|users\/([^/]+))(?:\/|$)/.exec(url.pathname);
    if (!match) throw new Error('Use a Mastodon profile URL such as https://mastodon.social/@name.');
    username = decodeURIComponent(match[1] || match[2]);
  } else {
    const match = /^@?([^@\s]+)@([^@\s/]+)$/.exec(value);
    if (!match) throw new Error('Include the Mastodon server: @name@mastodon.social.');
    origin = publicOrigin(`https://${match[2]}`);
    username = match[1];
  }
  if (!/^[a-z0-9_.-]+$/i.test(username)) throw new Error('That Mastodon username is not valid.');
  return { origin, username };
}

export function normalizeMastodon(status) {
  const view = status.reblog || status;
  const text = [view.spoiler_text, htmlText(view.content)].filter(Boolean).join('\n\n');
  return {
    id: status.id, url: httpsUrl(view.url) || httpsUrl(view.uri), text,
    time: parseTime(status.created_at), rawTimestamp: status.created_at || '',
    authorId: view.account?.id, isBoost: Boolean(status.reblog),
    isReply: !status.reblog && Boolean(status.in_reply_to_id),
    parentId: !status.reblog ? status.in_reply_to_id || null : null,
    parentAuthorId: !status.reblog ? status.in_reply_to_account_id || null : null,
    parent: null, prompted: null, delayMs: null, delaySource: null,
    length: textLength(text), hasMedia: Boolean(view.media_attachments?.length), hasQuote: Boolean(view.quote),
    hasQuestion: /[?？]/.test(text), timestampStandard: null, hasLanguage: Boolean(view.language),
    likes: view.favourites_count || 0, replies: view.replies_count || 0, boosts: view.reblogs_count || 0,
    application: view.application?.name || null, edited: Boolean(view.edited_at),
    contentWarning: view.spoiler_text || (view.sensitive ? 'Sensitive post' : null),
  };
}

export const mastodon = {
  id: 'mastodon', label: 'Mastodon', placeholder: '@Ted@tschopp.net or https://server/@name',
  example: '@Ted@tschopp.net', inputHelp: 'Enter the full @name@server address or a profile URL. The account’s home server is queried.',
  parse: parseMastodon,
  sources: [{ label: 'Mastodon account API', url: 'https://docs.joinmastodon.org/methods/accounts/' },
    { label: 'Mastodon status API', url: 'https://docs.joinmastodon.org/methods/statuses/' }],
  async scan(target, { client, limit, signal, progress }) {
    const api = path => new URL(path, target.origin);
    const lookup = api('/api/v1/accounts/lookup');
    lookup.searchParams.set('acct', target.username);
    progress('Looking up the Mastodon profile…');
    const rawProfile = await client.get(lookup.href);
    if (!/^\d+$/.test(rawProfile.id || '')) throw new Error('This server did not return a Mastodon account ID.');
    const profile = {
      id: rawProfile.id, handle: `@${rawProfile.acct || target.username}${rawProfile.acct?.includes('@') ? '' : `@${new URL(target.origin).hostname}`}`,
      name: rawProfile.display_name || rawProfile.username || target.username,
      url: httpsUrl(rawProfile.url) || `${target.origin}/@${encodeURIComponent(target.username)}`,
      avatar: httpsUrl(rawProfile.avatar_static || rawProfile.avatar), bio: htmlText(rawProfile.note),
      createdAt: parseTime(rawProfile.created_at), followers: rawProfile.followers_count ?? null,
      following: rawProfile.following_count ?? null, postsCount: rawProfile.statuses_count ?? null,
      declaredBot: typeof rawProfile.bot === 'boolean' ? rawProfile.bot : null,
    };
    const posts = [];
    const seen = new Set();
    const cursors = new Set();
    const warnings = [];
    let maxId;
    let exhausted = false;
    let pages = 0;
    let ownCount = 0;
    while (ownCount < limit && pages < 50) {
      signal.throwIfAborted();
      const url = api(`/api/v1/accounts/${profile.id}/statuses`);
      url.searchParams.set('limit', '40');
      url.searchParams.set('exclude_replies', 'false');
      url.searchParams.set('exclude_reblogs', 'false');
      if (maxId) url.searchParams.set('max_id', maxId);
      let data;
      try {
        data = await client.get(url.href);
        if (!Array.isArray(data)) throw new Error('This server returned an unexpected statuses response.');
      } catch (error) {
        signal.throwIfAborted();
        if (!posts.length) throw error;
        warnings.push(`The scan stopped early: ${error.message}`);
        break;
      }
      pages++;
      if (!data.length) { exhausted = true; break; }
      for (const status of data) {
        if (!/^\d+$/.test(status.id || '') || seen.has(status.id)) continue;
        seen.add(status.id);
        if (!status.reblog && status.account?.id !== profile.id) continue;
        const post = normalizeMastodon(status);
        posts.push(post);
        if (!post.isBoost) ownCount++;
        if (ownCount === limit) break;
      }
      progress(`Read ${ownCount} of up to ${limit} posts and replies…`);
      // Derive pagination locally. Never follow arbitrary API-supplied Link URLs.
      maxId = data.filter(status => /^\d+$/.test(status.id || '')).map(status => status.id)
        .sort((a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0)[0];
      if (!maxId || cursors.has(maxId)) { warnings.push('The server repeated a pagination cursor; the scan stopped.'); break; }
      cursors.add(maxId);
    }
    if (pages === 50 && ownCount < limit && !exhausted) warnings.push('The 50-page request budget was reached.');

    const parentIds = [...new Set(posts.filter(post => post.isReply && post.parentAuthorId !== profile.id && /^\d+$/.test(post.parentId || '')).map(post => post.parentId))];
    const parents = new Map();
    let checked = 0;
    let rateLimited = false;
    await mapConcurrent(parentIds.slice(0, PARENT_BUDGET), async id => {
      if (rateLimited) return;
      try { parents.set(id, await client.get(api(`/api/v1/statuses/${id}`).href)); }
      catch (error) {
        signal.throwIfAborted();
        if (error.status === 429) { rateLimited = true; warnings.push('Parent lookups stopped at the server’s request limit.'); }
      }
      checked++;
      progress(`Checking reply context… ${checked} of ${Math.min(parentIds.length, PARENT_BUDGET)} parent posts.`);
    }, signal);
    for (const post of posts) {
      if (!post.isReply) continue;
      const parent = parents.get(post.parentId);
      if (!parent?.account?.id) continue;
      post.parentAuthorId = parent.account.id;
      post.parent = { text: htmlText(parent.content), time: parseTime(parent.created_at),
        url: httpsUrl(parent.url) || httpsUrl(parent.uri), handle: parent.account.acct || '' };
      post.prompted = parent.in_reply_to_account_id === profile.id || Boolean(parent.mentions?.some(mention => mention.id === profile.id));
      if (!post.edited && post.time != null && post.parent.time != null && post.time >= post.parent.time) {
        post.delayMs = post.time - post.parent.time;
        post.delaySource = 'server creation';
      }
    }
    if (parentIds.length > PARENT_BUDGET) warnings.push(`Reply context was limited to the ${PARENT_BUDGET} most recent unique parent posts.`);
    return { profile, posts, coverage: { exhausted, pages, limit, warnings, parentBudget: PARENT_BUDGET,
      source: { label: new URL(target.origin).hostname, url: target.origin },
      parentsRequested: checked, parentsAvailable: parents.size } };
  },
};
