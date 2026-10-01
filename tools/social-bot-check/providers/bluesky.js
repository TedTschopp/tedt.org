import { HOUR, httpsUrl, parseTime, textLength } from '../common.js';

const API = 'https://public.api.bsky.app/xrpc/';
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const actorFromUri = uri => /^at:\/\/([^/]+)\//.exec(uri || '')?.[1] || null;

export function parseBluesky(raw) {
  let actor = raw.trim();
  if (/^https?:\/\//i.test(actor)) {
    const url = new URL(actor);
    if (url.hostname !== 'bsky.app' || url.username || url.password || url.port) {
      throw new Error('Use a bsky.app profile or post URL, a Bluesky handle, or a DID.');
    }
    const match = /^\/profile\/([^/]+)/.exec(url.pathname);
    if (!match) throw new Error('That Bluesky URL does not contain an account.');
    actor = decodeURIComponent(match[1]);
  } else if (actor.startsWith('at://')) {
    actor = actorFromUri(actor) || '';
  }
  actor = actor.replace(/^@/, '');
  if (/^did:(plc:[a-z0-9]+|web:[a-z0-9._:%-]+)$/i.test(actor)) return { actor };
  if (!actor.includes('.')) actor += '.bsky.social';
  if (!/^(?=.{3,253}$)[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(actor)) {
    throw new Error('Enter a Bluesky handle such as tedt.org or name.bsky.social.');
  }
  return { actor: actor.toLowerCase() };
}

function endpoint(method, params) {
  const url = new URL(API + method);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) url.searchParams.set(key, value);
  });
  return url.href;
}

function postUrl(post) {
  const key = (post.uri || '').split('/').pop();
  return key && post.author?.handle ? `https://bsky.app/profile/${encodeURIComponent(post.author.handle)}/post/${encodeURIComponent(key)}` : null;
}

function removeFacetLinks(record) {
  const bytes = new TextEncoder().encode(record.text || '');
  const ranges = (record.facets || []).filter(facet =>
    facet.features?.some(feature => feature.$type === 'app.bsky.richtext.facet#link') &&
    Number.isInteger(facet.index?.byteStart) && Number.isInteger(facet.index?.byteEnd)
  ).map(facet => facet.index).sort((a, b) => a.byteStart - b.byteStart);
  let position = 0;
  let text = '';
  const decoder = new TextDecoder();
  for (const range of ranges) {
    if (range.byteStart < position || range.byteEnd < range.byteStart || range.byteEnd > bytes.length) continue;
    text += decoder.decode(bytes.slice(position, range.byteStart));
    position = range.byteEnd;
  }
  return text + decoder.decode(bytes.slice(position));
}

export function normalizeBluesky(item, profileId) {
  const view = item.post;
  const record = view.record || {};
  const isBoost = item.reason?.$type === 'app.bsky.feed.defs#reasonRepost';
  const parentView = item.reply?.parent;
  const parentRecord = parentView?.record;
  const time = parseTime(isBoost ? item.reason.indexedAt : record.createdAt) ?? parseTime(view.indexedAt);
  const ownCreated = parseTime(record.createdAt);
  const ownIndexed = parseTime(view.indexedAt);
  const parentCreated = parseTime(parentRecord?.createdAt);
  const parentIndexed = parseTime(parentView?.indexedAt);
  const timelyIndex = (created, indexed) => created != null && indexed != null && indexed - created >= 0 && indexed - created <= HOUR;
  let delayMs = null;
  let delaySource = null;
  if (!isBoost && record.reply && parentRecord) {
    if (timelyIndex(ownCreated, ownIndexed) && timelyIndex(parentCreated, parentIndexed)) {
      delayMs = ownIndexed - parentIndexed;
      delaySource = 'server index';
    } else if (ownCreated != null && parentCreated != null) {
      delayMs = ownCreated - parentCreated;
      delaySource = 'record creation';
    }
    // Negative delays are unknown, rather than instantaneous replies.
    if (delayMs < 0) { delayMs = null; delaySource = null; }
  }
  const parentId = record.reply?.parent?.uri || null;
  const parentAuthorId = parentView?.author?.did || actorFromUri(parentId);
  const mentioned = parentRecord?.facets?.some(facet => facet.features?.some(feature => feature.did === profileId)) || false;
  const conversation = actorFromUri(record.reply?.root?.uri) === profileId || item.reply?.grandparentAuthor?.did === profileId;
  const embedTypes = JSON.stringify([record.embed?.$type, view.embed?.$type, record.embed?.media?.$type]);
  return {
    id: isBoost ? `boost:${view.uri}:${item.reason.indexedAt}` : view.uri,
    url: postUrl(view), text: record.text || '', time, rawTimestamp: record.createdAt || '',
    authorId: view.author?.did, isBoost, isReply: !isBoost && Boolean(record.reply),
    parentId, parentAuthorId, parent: parentRecord ? {
      text: parentRecord.text || '', url: postUrl(parentView), time: parentCreated,
      handle: parentView.author?.handle || '',
    } : null,
    prompted: mentioned || conversation, delayMs, delaySource,
    length: textLength(removeFacetLinks(record)),
    hasMedia: /images|video/.test(embedTypes), hasQuote: /record/.test(embedTypes),
    hasQuestion: /[?？]/.test(record.text || ''),
    timestampStandard: TIMESTAMP.test(record.createdAt || ''),
    hasLanguage: Array.isArray(record.langs) && record.langs.length > 0,
    likes: view.likeCount || 0, replies: view.replyCount || 0,
    boosts: view.repostCount || 0, application: null,
  };
}

export const bluesky = {
  id: 'bluesky', label: 'Bluesky', placeholder: '@tedt.org, bsky.app/profile/…, or a DID',
  example: 'tedt.org', inputHelp: 'Enter a handle, profile URL, post URL, or DID. A short name uses .bsky.social.',
  parse: parseBluesky,
  sources: [{ label: 'Bluesky public API', url: 'https://public.api.bsky.app/' }],
  async scan(target, { client, limit, signal, progress }) {
    progress('Looking up the Bluesky profile…');
    const rawProfile = await client.get(endpoint('app.bsky.actor.getProfile', { actor: target.actor }));
    if (!rawProfile.did || !rawProfile.handle) throw new Error('Bluesky returned an incomplete profile.');
    const profile = {
      id: rawProfile.did, handle: rawProfile.handle, name: rawProfile.displayName || rawProfile.handle,
      url: `https://bsky.app/profile/${encodeURIComponent(rawProfile.handle)}`,
      avatar: httpsUrl(rawProfile.avatar), bio: rawProfile.description || '',
      createdAt: parseTime(rawProfile.createdAt), followers: rawProfile.followersCount ?? null,
      following: rawProfile.followsCount ?? null, postsCount: rawProfile.postsCount ?? null, declaredBot: null,
    };
    const posts = [];
    const seen = new Set();
    const cursors = new Set();
    const warnings = [];
    let cursor;
    let exhausted = false;
    let pages = 0;
    let ownCount = 0;
    while (ownCount < limit && pages < 30) {
      signal.throwIfAborted();
      let data;
      try {
        data = await client.get(endpoint('app.bsky.feed.getAuthorFeed', {
          actor: profile.id, filter: 'posts_with_replies', limit: 100, cursor,
        }));
        if (!Array.isArray(data.feed)) throw new Error('Bluesky returned an unexpected feed response.');
      } catch (error) {
        signal.throwIfAborted();
        if (!posts.length) throw error;
        warnings.push(`The scan stopped early: ${error.message}`);
        break;
      }
      pages++;
      for (const item of data.feed) {
        if (!item.post?.uri || !item.post.author?.did) continue;
        const post = normalizeBluesky(item, profile.id);
        if ((!post.isBoost && post.authorId !== profile.id) || seen.has(post.id)) continue;
        seen.add(post.id);
        posts.push(post);
        if (!post.isBoost) ownCount++;
        if (ownCount === limit) break;
      }
      progress(`Read ${ownCount} of up to ${limit} posts and replies…`);
      if (!data.cursor || !data.feed.length) { exhausted = ownCount < limit; break; }
      if (cursors.has(data.cursor)) { warnings.push('The API repeated a pagination cursor; the scan stopped.'); break; }
      cursors.add(data.cursor);
      cursor = data.cursor;
    }
    if (pages === 30 && ownCount < limit && !exhausted) warnings.push('The 30-page request budget was reached.');
    return { profile, posts, coverage: { exhausted, pages, limit, warnings, parentBudget: null,
      source: { label: 'Bluesky public API', url: 'https://public.api.bsky.app/' } } };
  },
};
