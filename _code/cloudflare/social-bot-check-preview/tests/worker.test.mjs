import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

const PAGE = 'https://tedt.org/tools/social-bot-check.html';
const LOGO = 'https://tedt.org/img/Site-Logo.webp';
const BLUE_API = 'https://public.api.bsky.app';
const BLUE_AVATAR = 'https://cdn.bsky.app/img/avatar/plain/did:plc:ted/photo@jpeg';
const MASTO_AVATAR = 'https://tschopp.net/system/accounts/avatars/001/002/003/original/avatar.png';
const BODY = '<main id="checker">Public Account Patterns</main><script type="module" src="/tools/social-bot-check/app.js"></script>';
const PUBLISHER = `<script type="application/ld+json">{"@type":"Person","name":"Ted Tschopp","image":"${LOGO}"}</script>`;
const HTML = `<!doctype html><html><head>
  <title>Social Bot Check — Ted’s Tools</title>
  <link rel="canonical" href="${PAGE}">
  <meta property="og:url" content="${PAGE}">
  <meta property="og:image" content="${LOGO}">
  <meta property="og:image:secure_url" content="${LOGO}">
  <meta property="og:image:alt" content="Ted Tschopp’s site logo">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/webp">
  <meta name="twitter:url" content="${PAGE}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${LOGO}">
  <meta name="twitter:image:alt" content="Ted Tschopp’s site logo">
  ${PUBLISHER}
</head><body>${BODY}</body></html>`;

let worker;
const replies = [];
const unexpected = [];

async function outbound(request) {
  const index = replies.findIndex(item => item.url === request.url && item.method === request.method);
  if (index < 0) {
    unexpected.push(request.url);
    return new Response('Unexpected outbound request', { status: 500 });
  }
  const item = replies.splice(index, 1)[0];
  if (new URL(request.url).hostname !== 'tedt.org') {
    assert.equal(request.headers.get('cookie'), null);
    assert.equal(request.headers.get('authorization'), null);
    assert.equal(request.headers.get('referer'), null);
  }
  if (item.delay) await new Promise(resolve => setTimeout(resolve, item.delay));
  return new Response(request.method === 'HEAD' ? null : item.body, { status: item.status, headers: item.headers });
}

before(() => {
  worker = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    modulesRoot: fileURLToPath(new URL('../../../../', import.meta.url)),
    scriptPath: fileURLToPath(new URL('../.wrangler/build/worker.js', import.meta.url)),
    compatibilityDate: '2026-10-01',
    outboundService: outbound,
  }));
});

after(async () => {
  await worker?.dispose();
  assert.deepEqual(unexpected, [], 'every outbound request was expected; no real API traffic');
  assert.equal(replies.length, 0, 'all profile and origin fixtures were requested');
});

function origin(path = '/tools/social-bot-check.html', options = {}) {
  replies.push({ url: 'https://tedt.org' + path, method: options.method || 'GET',
    status: options.status || 200, body: options.body || HTML,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'max-age=600', ETag: '"static-page"',
        'Last-Modified': 'Thu, 01 Oct 2026 00:00:00 GMT',
        ...options.headers,
      },
    });
}

function blue(actor, profile = {}, options = {}) {
  replies.push({ url: `${BLUE_API}/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(actor)}`,
    method: 'GET', status: options.status || 200, body: options.body ?? JSON.stringify({
    did: 'did:plc:ted', handle: actor, avatar: BLUE_AVATAR, ...profile,
    }), headers: { 'Content-Type': 'application/json', ...options.headers }, delay: options.delay });
}

function masto(name, profile = {}, options = {}) {
  replies.push({ url: `https://tschopp.net/api/v1/accounts/lookup?acct=${name}`, method: 'GET',
    status: options.status || 200, body: JSON.stringify({
      id: '12345', acct: name, avatar_static: MASTO_AVATAR,
      avatar: 'https://tschopp.net/animated.gif', ...profile,
    }), headers: { 'Content-Type': 'application/json' } });
}

async function fetchPage(query = '', init = {}) {
  const response = await worker.dispatchFetch(PAGE + query, init);
  return { response, html: await response.text() };
}

function content(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<meta (?:property|name)="${escaped}" content="([^"]*)"`).exec(html)?.[1];
}

function unchangedContent(html) {
  assert.ok(html.includes(BODY), 'the checker body and app script are intact');
  assert.ok(html.includes(PUBLISHER), 'the publisher keeps its own image');
  assert.ok(html.includes(`<link rel="canonical" href="${PAGE}">`), 'search canonical stays stable');
}

test('a crawler without JavaScript receives the Bluesky avatar in initial HTML', async () => {
  origin();
  blue('tedt.org');
  const { response, html } = await fetchPage('?platform=bluesky&user=tedt.org&limit=100', {
    headers: { 'User-Agent': 'Twitterbot/1.0', Cookie: 'private=never-forward', Authorization: 'Bearer visitor' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Social-Bot-Check-Preview'), 'avatar');
  assert.equal(content(html, 'og:image'), BLUE_AVATAR);
  assert.equal(content(html, 'twitter:image'), BLUE_AVATAR);
  assert.equal(content(html, 'og:image:alt'), '@tedt.org on Bluesky profile picture');
  assert.equal(content(html, 'twitter:image:alt'), '@tedt.org on Bluesky profile picture');
  assert.equal(content(html, 'twitter:card'), 'summary');
  assert.match(content(html, 'og:url'), /user=tedt\.org(?:&amp;|&)limit=100/);
  assert.equal(content(html, 'twitter:url'), content(html, 'og:url'));
  assert.equal(content(html, 'og:image:width'), undefined);
  assert.equal(content(html, 'og:image:height'), undefined);
  assert.equal(content(html, 'og:image:type'), undefined);
  assert.equal(response.headers.get('ETag'), null);
  assert.equal(response.headers.get('Last-Modified'), null);
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  unchangedContent(html);
});

test('Mastodon uses the static account avatar', async () => {
  origin();
  masto('Ted');
  const { html } = await fetchPage('?platform=mastodon&user=%40Ted%40tschopp.net');
  assert.equal(content(html, 'og:image'), MASTO_AVATAR);
  assert.equal(content(html, 'twitter:image'), MASTO_AVATAR);
  assert.equal(content(html, 'og:image:alt'), '@Ted@tschopp.net on Mastodon profile picture');
  unchangedContent(html);
});

test('a different account gets a different image and social URL', async () => {
  origin();
  const avatar = 'https://cdn.bsky.app/img/avatar/other.jpg';
  blue('other.bsky.social', { avatar });
  const { html } = await fetchPage('?user=other.bsky.social');
  assert.equal(content(html, 'og:image'), avatar);
  assert.match(content(html, 'og:url'), /user=other\.bsky\.social/);
});

test('no account keeps the original metadata and requires no profile lookup', async () => {
  origin();
  const { response, html } = await fetchPage();
  assert.equal(html, HTML);
  assert.equal(content(html, 'og:image'), LOGO);
  assert.equal(content(html, 'twitter:image'), LOGO);
  assert.equal(response.headers.get('ETag'), '"static-page"');
});

test('missing Bluesky and default Mastodon avatars retain all original image fields', async () => {
  origin();
  blue('no-picture.bsky.social', { avatar: undefined });
  let result = await fetchPage('?user=no-picture.bsky.social');
  assert.equal(content(result.html, 'og:image'), LOGO);
  assert.equal(content(result.html, 'twitter:card'), 'summary_large_image');
  assert.equal(content(result.html, 'og:image:alt'), 'Ted Tschopp’s site logo');
  assert.equal(result.response.headers.get('X-Social-Bot-Check-Preview'), 'fallback');
  origin();
  masto('NoPicture', { avatar_static: 'https://tschopp.net/avatars/original/missing.png', avatar: 'https://tschopp.net/avatars/original/missing.png' });
  result = await fetchPage('?platform=mastodon&user=%40NoPicture%40tschopp.net');
  assert.equal(content(result.html, 'og:image'), LOGO);
  assert.equal(content(result.html, 'twitter:image'), LOGO);
});

test('API errors, redirects, malformed JSON and oversized responses keep the logo', async () => {
  for (const [index, options] of [
    { status: 404 },
    { status: 429 },
    { status: 302, headers: { Location: 'https://private.invalid/' } },
    { body: '{"broken":' },
    { body: '<html>Error</html>', headers: { 'Content-Type': 'text/html' } },
    { body: JSON.stringify({ padding: 'x'.repeat(262145) }) },
  ].entries()) {
    origin();
    blue(`failure-${index}.bsky.social`, {}, options);
    const { response, html } = await fetchPage(`?user=failure-${index}.bsky.social`);
    assert.equal(response.status, 200);
    assert.equal(content(html, 'og:image'), LOGO);
    unchangedContent(html);
  }
});

test('invalid targets never reach a profile API', async () => {
  for (const query of [
    '?user=', '?platform=unknown&user=tedt.org', '?user=https%3A%2F%2Fevil.invalid%2Fprofile%2Ftedt.org',
    '?platform=mastodon&user=%40Ted%40127.0.0.1', '?platform=mastodon&user=%40Ted%40localhost',
    '?platform=mastodon&user=https%3A%2F%2Fname%3Apassword%40tschopp.net%2F%40Ted',
  ]) {
    origin(`/tools/social-bot-check.html${query}`);
    const { html } = await fetchPage(query);
    assert.equal(html, HTML);
  }
});

test('unsafe avatar URLs never become sharing images', async () => {
  for (const [index, avatar] of [
    'javascript:alert(1)', 'data:image/svg+xml,<svg></svg>', 'http://tschopp.net/avatar.png',
    'https://name:password@tschopp.net/avatar.png', 'https://127.0.0.1/avatar.png', 'https://server.local/avatar.png',
  ].entries()) {
    origin();
    blue(`unsafe-${index}.bsky.social`, { avatar });
    const { html } = await fetchPage(`?user=unsafe-${index}.bsky.social`);
    assert.equal(content(html, 'og:image'), LOGO);
    assert.equal(content(html, 'twitter:image'), LOGO);
  }
});

test('malformed API account names cannot inject markup', async () => {
  origin();
  blue('hostile.bsky.social', {
    handle: 'hostile\"/><script>alert(1)</script>',
    avatar: 'https://cdn.bsky.app/avatar.jpg?q=\"/><img src=x onerror=alert(1)>',
  });
  const { html } = await fetchPage('?user=hostile.bsky.social');
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.equal(content(html, 'og:image'), LOGO);
  unchangedContent(html);
});

test('conditional requests still get complete account metadata', async () => {
  origin();
  blue('conditional.bsky.social');
  const { response, html } = await fetchPage('?user=conditional.bsky.social', {
    headers: { 'If-None-Match': '"static-page"', 'If-Modified-Since': 'Thu, 01 Oct 2026 00:00:00 GMT', Range: 'bytes=0-99' },
  });
  assert.equal(response.status, 200);
  assert.equal(content(html, 'og:image'), BLUE_AVATAR);
  unchangedContent(html);
});

test('profile cache is shared across scan limits but not accounts or platforms', async () => {
  origin();
  blue('cached.bsky.social');
  let result = await fetchPage('?user=cached.bsky.social&limit=100');
  assert.equal(content(result.html, 'og:image'), BLUE_AVATAR);
  // No second API fixture means a cache miss fails this assertion.
  origin();
  result = await fetchPage('?user=cached.bsky.social&limit=1000');
  assert.equal(content(result.html, 'og:image'), BLUE_AVATAR);
  assert.match(content(result.html, 'og:url'), /limit=1000/);
  origin();
  blue('cache-other.bsky.social', { avatar: 'https://cdn.bsky.app/different.jpg' });
  result = await fetchPage('?user=cache-other.bsky.social');
  assert.equal(content(result.html, 'og:image'), 'https://cdn.bsky.app/different.jpg');
});

test('a slow profile API is bounded and returns the usable original page', async () => {
  origin();
  blue('slow.bsky.social', {}, { delay: 3000 });
  const start = Date.now();
  const { response, html } = await fetchPage('?user=slow.bsky.social');
  assert.equal(response.status, 200);
  assert.equal(content(html, 'og:image'), LOGO);
  assert.ok(Date.now() - start < 2800, 'the two-second timeout bounds the lookup');
  unchangedContent(html);
});

test('other paths, HEAD requests and origin errors pass through', async () => {
  origin('/tools/social-bot-check.html/extra?user=tedt.org');
  let response = await worker.dispatchFetch(`${PAGE}/extra?user=tedt.org`);
  // The exact path check preserves the original query for pass-through requests.
  assert.equal(response.headers.get('X-Social-Bot-Check-Preview'), null);
  origin('/tools/social-bot-check.html?user=tedt.org', { method: 'HEAD' });
  response = await worker.dispatchFetch(`${PAGE}?user=tedt.org`, { method: 'HEAD' });
  assert.equal(response.headers.get('X-Social-Bot-Check-Preview'), null);
  origin('/tools/social-bot-check.html', { status: 503, body: '<h1>Origin unavailable</h1>' });
  const result = await fetchPage('?user=origin-error.bsky.social');
  assert.equal(result.response.status, 503);
  assert.equal(result.html, '<h1>Origin unavailable</h1>');
});
