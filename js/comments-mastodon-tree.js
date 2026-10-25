/* Public Mastodon discussions. Authentication and reactions stay on Mastodon. */
(() => {
  'use strict';

  const allowedTags = new Set(['P', 'BR', 'A', 'SPAN', 'EM', 'STRONG', 'B', 'I', 'U', 'S', 'DEL', 'BLOCKQUOTE', 'CODE', 'PRE', 'UL', 'OL', 'LI']);
  const droppedTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'LINK', 'META']);

  function safeURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function link(url, text) {
    const node = element('a', '', text);
    node.href = safeURL(url) || '#comments';
    node.rel = 'external nofollow noopener noreferrer';
    return node;
  }

  function safeContent(html) {
    const parsed = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const output = document.createDocumentFragment();
    function append(source, parent) {
      if (source.nodeType === Node.TEXT_NODE) {
        parent.append(document.createTextNode(source.textContent));
        return;
      }
      if (source.nodeType !== Node.ELEMENT_NODE || droppedTags.has(source.tagName)) return;
      if (source.tagName === 'IMG') {
        parent.append(document.createTextNode(source.getAttribute('alt') || ''));
        return;
      }
      const target = allowedTags.has(source.tagName) ? element(source.tagName.toLowerCase()) : document.createDocumentFragment();
      if (source.tagName === 'A') {
        const url = safeURL(source.getAttribute('href'));
        if (url) {
          target.href = url;
          target.rel = 'external nofollow noopener noreferrer';
        }
      }
      for (const child of source.childNodes) append(child, target);
      parent.append(target);
    }
    for (const child of parsed.body.childNodes) append(child, output);
    return output;
  }

  function counter(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }

  function card(status) {
    const post = element('article', 'mastodon-post');
    const account = status.account || {};
    const name = account.display_name || account.username || 'Mastodon user';
    const header = element('header', 'mastodon-post-author');
    const avatarURL = safeURL(account.avatar_static || account.avatar);
    if (avatarURL) {
      const image = element('img', 'mastodon-post-avatar');
      image.src = avatarURL;
      image.alt = '';
      image.width = image.height = 40;
      image.loading = 'lazy';
      header.append(image);
    }
    const identity = element('div');
    identity.append(link(account.url, name));
    identity.append(element('p', 'mastodon-post-handle', `@${account.acct || account.username || 'unknown'}`));
    header.append(identity);
    const date = new Date(status.created_at);
    if (!Number.isNaN(date.valueOf())) {
      const time = element('time', 'mastodon-post-date', date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
      time.dateTime = date.toISOString();
      const dateLink = link(status.url, '');
      dateLink.append(time);
      header.append(dateLink);
    }
    post.append(header);
    if (status.spoiler_text) post.append(element('p', 'mastodon-post-warning', status.spoiler_text));
    const content = element('div', 'mastodon-post-content');
    content.append(safeContent(status.content));
    post.append(content);
    const attachments = element('div', 'mastodon-post-media');
    for (const media of Array.isArray(status.media_attachments) ? status.media_attachments : []) {
      const url = safeURL(media.url);
      if (!url) continue;
      const description = media.description || 'Mastodon attachment';
      const attachment = link(url, media.type === 'image' ? '' : `Open attachment: ${description}`);
      if (media.type === 'image') {
        const image = element('img');
        image.src = safeURL(media.preview_url) || url;
        image.alt = description;
        image.loading = 'lazy';
        attachment.append(image);
      }
      attachments.append(attachment);
    }
    if (attachments.childNodes.length) post.append(attachments);
    const footer = element('footer', 'mastodon-post-footer');
    footer.append(element('span', '', `${counter(status.replies_count)} replies · ${counter(status.reblogs_count)} boosts · ${counter(status.favourites_count)} favourites`));
    footer.append(link(status.url, 'Reply or react on Mastodon'));
    post.append(footer);
    return post;
  }

  function publicReply(status) {
    return status && typeof status.id === 'string' && /^\d+$/.test(status.id)
      && ['public', 'unlisted'].includes(status.visibility) && safeURL(status.url);
  }

  function replies(rootID, descendants) {
    const container = element('div', 'mastodon-replies');
    const rows = [...new Map(descendants.filter(publicReply).filter(row => row.id !== rootID).map(row => [row.id, row])).values()]
      .sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0));
    if (!rows.length) {
      container.append(element('p', '', 'No public replies yet.'));
      return container;
    }
    const parents = new Map();
    const identifiers = new Set(rows.map(row => row.id));
    for (const row of rows) {
      const parent = identifiers.has(row.in_reply_to_id) && row.in_reply_to_id !== row.id ? row.in_reply_to_id : rootID;
      if (!parents.has(parent)) parents.set(parent, []);
      parents.get(parent).push(row);
    }
    const visited = new Set();
    function branch(parent, depth) {
      const list = element('ol', 'mastodon-reply-list');
      for (const row of parents.get(parent) || []) {
        if (visited.has(row.id)) continue;
        visited.add(row.id);
        const item = element('li');
        item.append(card(row));
        // Bound visual nesting; additional replies remain visible in the flat pass.
        if (depth < 6 && parents.has(row.id)) item.append(branch(row.id, depth + 1));
        list.append(item);
      }
      return list;
    }
    container.append(branch(rootID, 0));
    for (const row of rows) {
      if (!visited.has(row.id)) container.append(card(row));
    }
    return container;
  }

  async function getJSON(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'omit', signal: controller.signal });
      if (!response.ok) {
        const error = new Error('Mastodon request failed');
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } finally { window.clearTimeout(timeout); }
  }

  function initialize(root) {
    if (root.dataset.discussionInitialized) return;
    root.dataset.discussionInitialized = 'true';
    const state = root.querySelector('[data-discussion-state]');
    const retry = root.querySelector('[data-discussion-retry]');
    const thread = root.querySelector('[data-discussion-thread]');
    async function load() {
      retry.hidden = true;
      thread.hidden = true;
      thread.replaceChildren();
      state.textContent = 'Loading the discussion…';
      try {
        const url = new URL(root.dataset.statusUrl);
        const match = /^\/(?:@[^/]+\/|users\/[^/]+\/statuses\/)(\d+)\/?$/.exec(url.pathname);
        if (!safeURL(url.href) || !match) throw new Error('Invalid discussion URL');
        const endpoint = `${url.origin}/api/v1/statuses/${match[1]}`;
        const status = await getJSON(endpoint);
        if (!publicReply(status) || status.id !== match[1]) throw new Error('Invalid discussion response');
        thread.append(card(status));
        thread.hidden = false;
        let context;
        try { context = await getJSON(`${endpoint}/context`); }
        catch {
          state.textContent = 'The original post loaded, but replies are temporarily unavailable. You can read them on Mastodon or retry.';
          retry.hidden = false;
          return;
        }
        if (!Array.isArray(context.descendants)) throw new Error('Invalid replies response');
        const replyContainer = replies(status.id, context.descendants);
        replyContainer.id = `${root.id}-mastodon-replies`;
        if (context.descendants.filter(publicReply).length) {
          const toggle = element('button', 'btn btn-outline-secondary mastodon-replies-toggle', 'Hide replies');
          toggle.type = 'button';
          toggle.setAttribute('aria-expanded', 'true');
          toggle.setAttribute('aria-controls', replyContainer.id);
          toggle.addEventListener('click', () => {
            replyContainer.hidden = !replyContainer.hidden;
            toggle.setAttribute('aria-expanded', String(!replyContainer.hidden));
            toggle.textContent = replyContainer.hidden ? 'Show replies' : 'Hide replies';
          });
          thread.append(toggle);
        }
        thread.append(replyContainer);
        state.textContent = 'Discussion loaded.';
      } catch (error) {
        thread.hidden = true;
        thread.replaceChildren();
        state.textContent = [404, 410].includes(error.status)
          ? 'The original Mastodon thread is unavailable. Its discussion link will be updated when a replacement is published.'
          : 'Comments are temporarily unavailable. You can open the discussion on Mastodon or retry.';
        retry.hidden = false;
      }
    }
    retry.addEventListener('click', load);
    load();
  }

  const start = () => document.querySelectorAll('[data-mastodon-discussion]').forEach(initialize);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
