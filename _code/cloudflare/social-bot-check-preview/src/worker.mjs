import { parseBluesky } from '../../../../tools/social-bot-check/providers/bluesky.js';
import { parseMastodon } from '../../../../tools/social-bot-check/providers/mastodon.js';
import { publicOrigin } from '../../../../tools/social-bot-check/common.js';

const PAGE = 'https://tedt.org/tools/social-bot-check.html';
const PATH = new URL(PAGE).pathname;
const PROFILE_TIMEOUT = 2000;
const MAX_PROFILE_BYTES = 262144;

function avatarUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    publicOrigin(value);
    const url = new URL(value);
    if (/\/avatars\/(?:original|static)\/missing\.[a-z0-9]+$/i.test(url.pathname)) return null;
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

function image(avatar, label) {
  return avatar ? {
    image: avatar,
    alt: `${String(label).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 180)} profile picture`,
  } : null;
}

const previews = new Map([
  ['bluesky', {
    parse: parseBluesky,
    endpoint(target) {
      const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile');
      url.searchParams.set('actor', target.actor);
      return url;
    },
    image(profile) {
      if (typeof profile?.did !== 'string' || typeof profile.handle !== 'string') return null;
      if (profile.handle.startsWith('did:') || parseBluesky(profile.handle).actor !== profile.handle.toLowerCase()) return null;
      return image(avatarUrl(profile.avatar), `@${profile.handle} on Bluesky`);
    },
  }],
  ['mastodon', {
    parse: parseMastodon,
    endpoint(target) {
      const url = new URL('/api/v1/accounts/lookup', target.origin);
      url.searchParams.set('acct', target.username);
      return url;
    },
    image(profile, target) {
      if (!/^\d+$/.test(profile?.id || '') || typeof profile.acct !== 'string') return null;
      const avatar = avatarUrl(profile.avatar_static) || avatarUrl(profile.avatar);
      const handle = profile.acct.includes('@') ? profile.acct : `${profile.acct}@${new URL(target.origin).hostname}`;
      parseMastodon(`@${handle}`);
      return image(avatar, `@${handle} on Mastodon`);
    },
  }],
]);

function accountFromUrl(url) {
  const user = (url.searchParams.get('user') || '').trim();
  const platform = url.searchParams.get('platform') || 'bluesky';
  const adapter = previews.get(platform);
  if (!user || user.length > 300 || !adapter) return null;
  try {
    const target = adapter.parse(user);
    const endpoint = adapter.endpoint(target);
    const link = new URL(PAGE);
    link.searchParams.set('platform', platform);
    link.searchParams.set('user', user);
    const limit = url.searchParams.get('limit');
    if (['100', '500', '1000'].includes(limit)) link.searchParams.set('limit', limit);
    return { adapter, target, endpoint, link };
  } catch {
    return null;
  }
}

async function profileJson(response) {
  if (!response.ok || !/\bapplication\/(?:[a-z0-9.+-]*\+)?json\b/i.test(response.headers.get('content-type') || '')) {
    await response.body?.cancel();
    throw new Error('The public profile API did not return JSON.');
  }
  if (Number(response.headers.get('content-length')) > MAX_PROFILE_BYTES) {
    await response.body?.cancel();
    throw new Error('The public profile response is too large.');
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_PROFILE_BYTES) {
        await reader.cancel();
        throw new Error('The public profile response is too large.');
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

async function lookupImage(account, ctx) {
  const key = new URL('/__social-bot-check-preview-cache/v1', PAGE);
  key.searchParams.set('profile', account.endpoint.href);
  const cacheKey = new Request(key);
  const cache = caches.default;
  try {
    const cached = await cache.match(cacheKey);
    if (cached) return await cached.json();
  } catch { /* An unavailable cache must not prevent a public profile lookup. */ }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROFILE_TIMEOUT);
  let preview = null;
  try {
    const response = await fetch(account.endpoint, {
      signal: controller.signal,
      redirect: 'manual',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    });
    const profile = await profileJson(response);
    preview = account.adapter.image(profile, account.target);
  } catch { /* A missing picture or unavailable API retains the generated logo. */ }
  finally { clearTimeout(timer); }

  const cached = Response.json(preview, {
    headers: { 'Cache-Control': `public, max-age=${preview ? 600 : 60}` },
  });
  ctx.waitUntil(cache.put(cacheKey, cached).catch(() => {}));
  return preview;
}

function rewriteMetadata(response, account, preview) {
  const values = new Map([
    ['og:url', account.link.href],
    ['twitter:url', account.link.href],
  ]);
  if (preview) {
    values.set('og:image', preview.image);
    values.set('og:image:secure_url', preview.image);
    values.set('og:image:alt', preview.alt);
    values.set('twitter:image', preview.image);
    values.set('twitter:image:src', preview.image);
    values.set('twitter:image:alt', preview.alt);
    values.set('twitter:card', 'summary');
  }
  const rewritten = new HTMLRewriter().on('head meta', {
    element(element) {
      const key = element.getAttribute('property') || element.getAttribute('name');
      if (preview && ['og:image:width', 'og:image:height', 'og:image:type', 'twitter:image:width', 'twitter:image:height'].includes(key)) {
        element.remove();
      } else if (values.has(key)) {
        // HTMLRewriter escapes attribute values; API data never becomes HTML.
        element.setAttribute('content', values.get(key));
      }
    },
  }).transform(response);
  const headers = new Headers(rewritten.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Social-Bot-Check-Preview', preview ? 'avatar' : 'fallback');
  for (const name of ['ETag', 'Last-Modified', 'Content-Length', 'Content-MD5', 'Age', 'Expires']) headers.delete(name);
  return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
}

export default {
  async fetch(request, env, ctx) {
    ctx.passThroughOnException();
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== new URL(PAGE).origin || url.pathname !== PATH) return fetch(request);
    const account = accountFromUrl(url);
    if (!account) return fetch(request);

    // Fetch the static origin without account variants or conditional 304/206
    // responses; every crawler needs a complete HTML head for this account.
    const headers = new Headers(request.headers);
    for (const name of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) headers.delete(name);
    const response = await fetch(new Request(PAGE, { method: 'GET', headers, redirect: 'manual' }));
    if (response.status !== 200 || !/^text\/html\b/i.test(response.headers.get('content-type') || '')) return response;
    const preview = await lookupImage(account, ctx);
    return rewriteMetadata(response, account, preview);
  },
};
