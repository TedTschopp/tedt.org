import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

const META = 'https://indiekey.id/.well-known/oauth-authorization-server/s/crse2y91vtsd5q0r';
const SITE = 'site-publisher-test-secret-'.repeat(3);
const MEDIA = 'media-publisher-test-secret-'.repeat(3);
const issuer = 'https://indiekey.id/s/crse2y91vtsd5q0r/';
let worker, db;
const scope = 'create update delete undelete media';
async function outbound(request) {
  if (request.url === META) return Response.json({ issuer, introspection_endpoint: 'https://indiekey.id/introspect', jwks_uri: 'https://indiekey.id/jwks' });
  assert.equal(request.url, 'https://indiekey.id/introspect', 'no unexpected or real outbound traffic');
  assert.equal(request.headers.get('authorization'), 'Bearer test-introspection');
  const token = new URLSearchParams(await request.text()).get('token');
  if (token === 'inactive') return Response.json({ active: false });
  if (token === 'outage') return new Response('Unavailable', { status: 503 });
  const claims = { active: true, iss: issuer, sub: 'https://tedt.org/', aud: 'https://tedt.org/micropub', me: 'https://tedt.org/', scope, exp: Math.floor(Date.now() / 1000) + 3600, client_id: 'https://client.example/' };
  if (token === 'foreign') claims.me = claims.sub = 'https://another.example/';
  if (token === 'wrong-audience') claims.aud = 'https://another.example/micropub';
  if (token === 'wrong-issuer') claims.iss = 'https://indiekey.id/s/another/';
  if (token === 'expired') claims.exp = 1;
  if (token === 'create-only') claims.scope = 'create';
  if (token === 'reader') claims.scope = 'read follow';
  return Response.json(claims);
}
before(async () => {
  worker = new Miniflare(convertV4MiniflareOptions({ workers: [
    {
      name: 'main', modules: true, scriptPath: fileURLToPath(new URL('../.wrangler/build/worker.js', import.meta.url)),
      compatibilityDate: '2026-10-01', d1Databases: { DB: 'shared-test-db' }, outboundService: outbound,
      serviceBindings: { UPLOADS: 'buffer' },
      bindings: { PUBLISHER_TOKEN: SITE, MEDIA_PUBLISHER_TOKEN: MEDIA, INDIEAUTH_METADATA_URL: META, INDIEAUTH_INTROSPECTION_SECRET: 'test-introspection' },
    },
    {
      name: 'buffer', modules: true, scriptPath: fileURLToPath(new URL('../.wrangler/buffer/upload-buffer.js', import.meta.url)),
      compatibilityDate: '2026-10-01', d1Databases: { DB: 'shared-test-db' }, bindings: { PUBLISHER_TOKEN: MEDIA },
    },
  ] }));
  db = await worker.getD1Database('DB', 'main');
  let schema = readFileSync(new URL('../migrations/0001_publishing.sql', import.meta.url), 'utf8').replace(/^--.*$/gm, '');
  const triggers = [...schema.matchAll(/CREATE TRIGGER[\s\S]*?END;/g)].map(m => m[0]);
  schema = schema.replace(/CREATE TRIGGER[\s\S]*?END;/g, '');
  for (const sql of [...schema.split(';').filter(s => s.trim()), ...triggers]) await db.prepare(sql).run();
});
after(async () => { await worker?.dispose(); });
function call(data, token = 'valid', options = {}) {
  return worker.dispatchFetch('https://tedt.org/micropub', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, body: JSON.stringify(data) });
}
function create(properties, token = 'valid', options = {}) { return call({ type: ['h-entry'], properties }, token, options); }
function admin(action, fields = {}, token = SITE) {
  return worker.dispatchFetch('https://tedt.org/micropub/publisher', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...fields }) });
}
async function source(url, token = 'valid') {
  return worker.dispatchFetch(`https://tedt.org/micropub?q=source&url=${encodeURIComponent(url)}`, { headers: { Authorization: `Bearer ${token}` } });
}
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFOsAAAAASUVORK5CYII=', 'base64');
async function upload(data = png, type = 'image/png') {
  const form = new FormData(); form.set('file', new File([data], 'untrusted-name.txt', { type }));
  const request = new Request('https://tedt.org/micropub/media', { method: 'POST', headers: { Authorization: 'Bearer valid' }, body: form });
  return worker.dispatchFetch(request.url, { method: 'POST', headers: Object.fromEntries(request.headers), body: await request.arrayBuffer() });
}

test('full private authoring and publication boundaries', async t => {
  t.afterEach(async () => { await db.prepare('UPDATE entries SET applied_revision=revision').run(); });
  await t.test('missing, inactive, expired, foreign, wrong-resource and reader-only tokens cannot write', async () => {
    for (const token of [null, 'inactive', 'expired', 'foreign', 'wrong-audience', 'wrong-issuer', 'reader']) {
      const result = await create({ content: ['must not save'] }, token);
      assert.ok([401, 403].includes(result.status), `${token}: ${result.status}`);
    }
    assert.equal((await db.prepare('SELECT count(*) AS n FROM entries').first()).n, 0);
  });
  await t.test('provider outage fails closed without accepting content', async () => {
    const result = await create({ content: ['must not save'] }, 'outage');
    assert.equal(result.status, 503); assert.match((await result.json()).error_description, /Nothing was saved/);
    assert.equal((await db.prepare('SELECT count(*) AS n FROM entries').first()).n, 0);
  });
  await t.test('all twelve common post types retain their source', async () => {
    const fixtures = [
      ['article', { name: ['Article'], content: [{ html: '<p>Article</p>' }] }],
      ['note', { content: ['A short note'] }],
      ['photo', { photo: [{ value: 'https://example.com/photo.jpg', alt: 'Mountain' }] }],
      ['reply', { 'in-reply-to': ['https://example.com/post'], content: ['A reply'] }],
      ['like', { 'like-of': ['https://example.com/post'] }],
      ['repost', { 'repost-of': ['https://example.com/post'] }],
      ['bookmark', { 'bookmark-of': ['https://example.com/post'], name: ['Saved article'] }],
      ['rsvp', { 'in-reply-to': ['https://example.com/event'], rsvp: ['yes'] }],
      ['audio', { audio: ['https://example.com/audio.mp3'] }],
      ['video', { video: ['https://example.com/video.mp4'] }],
      ['event', { name: ['Meetup'], start: ['2027-01-01T12:00:00Z'], end: ['2027-01-01T14:00:00Z'] }],
      ['checkin', { checkin: [{ type: ['h-card'], properties: { name: ['Library'], latitude: ['34.1'], longitude: ['-117.8'] } }] }],
    ];
    for (const [type, properties] of fixtures) {
      const result = await call({ type: [type === 'event' ? 'h-event' : 'h-entry'], properties });
      assert.equal(result.status, 201, type);
      assert.match(result.headers.get('location'), /^https:\/\/tedt.org\/updates\//);
      const restored = await source(result.headers.get('location'));
      assert.equal(restored.status, 200);
      const body = await restored.json();
      for (const [key, value] of Object.entries(properties)) assert.deepEqual(body.properties[key], value, `${type}: ${key}`);
      assert.ok(body.properties.published[0]);
    }
  });
  await t.test('native form encoding and body tokens work', async () => {
    const result = await worker.dispatchFetch('https://tedt.org/micropub', { method: 'POST', body: new URLSearchParams({ h: 'entry', content: 'Native form note', access_token: 'valid' }) });
    assert.equal(result.status, 201);
    const body = await (await source(result.headers.get('location'))).json();
    assert.deepEqual(body.properties.content, ['Native form note']);
  });
  await t.test('unsupported properties, unknown nested data and invalid targets reject the whole request', async () => {
    const before = (await db.prepare('SELECT count(*) AS n FROM entries').first()).n;
    for (const properties of [{ content: ['x'], secret: ['unsupported'] }, { content: [{ html: 'x', unrecognized: true }] }, { 'like-of': ['http://127.0.0.1/private'] }, { photo: ['javascript:alert(1)'] }, { checkin: [{ type: ['h-card'], properties: { name: ['x'], script: ['x'] } }] }, { content: ['x'], visibility: ['private'] }]) {
      assert.equal((await create(properties)).status, 400);
    }
    assert.equal((await db.prepare('SELECT count(*) AS n FROM entries').first()).n, before);
  });
  await t.test('drafts remain queryable to the owner but never export their content', async () => {
    const result = await create({ content: ['PRIVATE DRAFT SENTINEL'], 'post-status': ['draft'] });
    const url = result.headers.get('location');
    assert.equal((await result.json()).publication_status, 'draft');
    assert.deepEqual((await (await source(url)).json()).properties.content, ['PRIVATE DRAFT SENTINEL']);
    const pending = await (await admin('pending')).json();
    assert.ok(pending.entries.some(row => row.url === url && row.publish === false));
    assert.ok(!JSON.stringify(pending).includes('PRIVATE DRAFT SENTINEL'));
    assert.equal((await source(url, 'reader')).status, 403);
  });
  await t.test('a private draft can be retimed before its first publication without changing its URL', async () => {
    const url = (await create({ content: ['Private draft'], 'post-status': ['draft'] })).headers.get('location');
    const result = await call({ action: 'update', url, replace: { published: ['2026-10-24T10:00:00Z'], 'post-status': ['published'] } });
    assert.equal(result.status, 204);
    const body = await (await source(url)).json(); assert.equal(body.properties.published[0], '2026-10-24T10:00:00Z');
    const row = await db.prepare('SELECT * FROM entries WHERE url=?').bind(url).first();
    await admin('applied', { id: row.id, revision: row.revision, commit_sha: 'a'.repeat(40) });
    await admin('live', { id: row.id, revision: row.revision });
    await call({ action: 'update', url, replace: { 'post-status': ['draft'] } });
    assert.equal((await call({ action: 'update', url, replace: { published: ['2026-10-23T10:00:00Z'] } })).status, 400);
  });
  await t.test('configuration exposes only implemented types and the existing syndication identity', async () => {
    const result = await worker.dispatchFetch('https://tedt.org/micropub?q=config', { headers: { Authorization: 'Bearer valid' } });
    const body = await result.json();
    assert.equal(body['post-types'].length, 12);
    assert.equal(body['media-endpoint'], 'https://tedt.org/micropub/media');
    assert.equal(body['syndicate-to'][0].uid, 'https://tschopp.net/@Ted');
  });
  await t.test('idempotent create survives retries and refuses changed payloads', async () => {
    const headers = { 'Idempotency-Key': 'stable-test-key-123' };
    const first = await create({ content: ['one'] }, 'valid', { headers });
    const second = await create({ content: ['one'] }, 'valid', { headers });
    assert.equal(first.status, 201); assert.equal(second.status, 201);
    assert.equal(first.headers.get('location'), second.headers.get('location'));
    assert.equal((await create({ content: ['different'] }, 'valid', { headers })).status, 409);
  });
  await t.test('replace/add/remove source changes preserve creation identity', async () => {
    const url = (await create({ content: ['before'], category: ['one'] })).headers.get('location');
    const original = await (await source(url)).json();
    const result = await call({ action: 'update', url, replace: { content: ['after'] }, add: { category: ['two'] }, delete: { category: ['one'] } });
    assert.equal(result.status, 204);
    const current = await (await source(url)).json();
    assert.deepEqual(current.properties.content, ['after']); assert.deepEqual(current.properties.category, ['two']);
    assert.deepEqual(current.properties.published, original.properties.published);
    assert.equal((await call({ action: 'update', url, replace: { published: ['2020-01-01T00:00:00Z'] } })).status, 400);
    assert.equal((await call({ action: 'update', url, replace: { content: ['x'] } }, 'create-only')).status, 403);
  });
  await t.test('concurrent edits cannot silently overwrite the same source revision', async () => {
    const url = (await create({ content: ['before'] })).headers.get('location');
    const results = await Promise.all(['first', 'second'].map(value => call({ action: 'update', url, replace: { content: [value] } }, 'valid', { headers: { 'If-Match': '"1"' } })));
    assert.equal(results.filter(r => r.status === 204).length, 1);
    assert.ok(results.some(r => [409, 412].includes(r.status)));
  });
  await t.test('delete, duplicate delete, and undelete retain source privately and queue the right public state', async () => {
    const url = (await create({ content: ['recoverable'] })).headers.get('location');
    assert.equal((await call({ action: 'delete', url })).status, 204);
    assert.equal((await call({ action: 'delete', url })).status, 204);
    assert.equal((await call({ action: 'update', url, replace: { content: ['x'] } })).status, 410);
    const rows = (await (await admin('pending')).json()).entries;
    const deleted = await db.prepare('SELECT * FROM entries WHERE url=?').bind(url).first();
    assert.equal(deleted.deleted, 1); assert.ok(deleted.properties.includes('recoverable'));
    if (rows.some(r => r.url === url)) assert.equal(rows.find(r => r.url === url).properties, undefined);
    assert.equal((await call({ action: 'undelete', url })).status, 204);
    assert.equal((await (await source(url)).json()).properties.content[0], 'recoverable');
  });
  await t.test('media uses hashes, ignores filenames, is private until referenced, and then gates publication', async () => {
    const uploaded = await upload(); assert.equal(uploaded.status, 201, await uploaded.clone().text());
    const value = await uploaded.json(); const id = value.canonical_url.split('/').pop();
    assert.match(id, /^[0-9a-f]{64}\.png$/);
    assert.equal(value.publication_status, 'queued');
    assert.match(value.url, /signature=/);
    const preview = await worker.dispatchFetch(value.url); assert.equal(preview.status, 200); assert.deepEqual(Buffer.from(await preview.arrayBuffer()), png);
    const range = await worker.dispatchFetch(value.url, { headers: { Range: 'bytes=0-3' } }); assert.equal(range.status, 206); assert.deepEqual(Buffer.from(await range.arrayBuffer()), png.subarray(0, 4));
    const invalidPreview = new URL(value.url); invalidPreview.searchParams.set('signature', 'a'.repeat(64));
    assert.equal((await worker.dispatchFetch(invalidPreview.href)).status, 403);
    assert.equal((await (await admin('pending', {}, MEDIA)).json()).media.length, 0);
    const sourceUrl = (await create({ photo: [{ value: value.url, alt: 'A dot' }] })).headers.get('location');
    const entry = await db.prepare('SELECT * FROM entries WHERE url=?').bind(sourceUrl).first();
    assert.ok(!entry.properties.includes('signature='));
    assert.ok(entry.properties.includes(value.canonical_url));
    const editable = await (await source(sourceUrl)).json();
    assert.match(editable.properties.photo[0].value, /signature=/);
    assert.ok(!JSON.stringify(await (await admin('pending')).json()).includes('signature='));
    assert.equal((await (await admin('pending', {}, MEDIA)).json()).media.length, 0, 'the trusted serializer must approve the public reference first');
    await admin('media-references', { id: entry.id, revision: entry.revision, ids: [id] });
    const pending = (await (await admin('pending', {}, MEDIA)).json()).media;
    assert.equal(pending.length, 1);
    const content = await admin('content', { id }, MEDIA);
    assert.deepEqual(Buffer.from(await content.arrayBuffer()), png);
    assert.equal((await admin('pending', {}, 'wrong')).status, 401);
    assert.equal((await admin('applied', { id: 'x' }, MEDIA)).status, 400);
    assert.equal((await admin('content', { id }, SITE)).status, 400);
    await admin('published', { id }, MEDIA);
    assert.equal((await db.prepare('SELECT count(*) AS n FROM media_chunks WHERE media_id=?').bind(id).first()).n, 0);
    assert.equal((await (await upload()).json()).publication_status, 'published');
  });
  await t.test('bad signatures, active media formats and over-limit uploads are rejected', async () => {
    assert.equal((await upload(Buffer.from('<script>bad()</script>'), 'image/png')).status, 400);
    assert.equal((await upload(Buffer.from('<svg></svg>'), 'image/svg+xml')).status, 400);
    assert.equal((await upload(Buffer.alloc(5 * 1024 * 1024 + 1), 'image/png')).status, 413);
  });
  await t.test('a full 5 MiB upload uses bounded private chunks and remains private', async () => {
    const bytes = Buffer.alloc(5 * 1024 * 1024); png.copy(bytes);
    const response = await upload(bytes); assert.equal(response.status, 201, await response.clone().text());
    const value = await response.json(); const id = value.canonical_url.split('/').pop();
    const lengths = (await db.prepare('SELECT length(data) AS n FROM media_chunks WHERE media_id=?').bind(id).all()).results;
    assert.equal(lengths.length, 40); assert.ok(lengths.every(row => row.n === 131072));
    assert.ok(!(await (await admin('pending', {}, MEDIA)).json()).media.some(row => row.id === id));
  });
  await t.test('quota enforcement is atomic and never enables paid capacity', async () => {
    assert.equal((await admin('quota', { external_bytes: 750 * 1024 * 1024 }, MEDIA)).status, 200);
    const alternate = Buffer.concat([png, Buffer.from('another hash')]);
    const result = await upload(alternate);
    assert.equal(result.status, 507); assert.match((await result.json()).error_description, /No paid upgrade/);
    await admin('quota', { external_bytes: 0 }, MEDIA);
  });
  await t.test('a commit does not claim that an entry is published; live confirmation is separate', async () => {
    const url = (await create({ content: ['Lifecycle status'] })).headers.get('location');
    const row = await db.prepare('SELECT * FROM entries WHERE url=?').bind(url).first();
    const status = async () => (await (await worker.dispatchFetch(`https://tedt.org/micropub?q=status&url=${encodeURIComponent(url)}`, { headers: { Authorization: 'Bearer valid' } })).json()).publication_status;
    assert.equal(await status(), 'queued');
    await admin('applied', { id: row.id, revision: 1, commit_sha: 'a'.repeat(40) });
    assert.equal(await status(), 'awaiting_deployment');
    await admin('live', { id: row.id, revision: 1 });
    assert.equal(await status(), 'published');
    const stale = await admin('live', { id: row.id, revision: 2 });
    assert.equal((await stale.json()).acknowledged, false);
  });
  await t.test('CORS is usable by clients; tokens in query strings and unsupported methods fail', async () => {
    const preflight = await worker.dispatchFetch('https://tedt.org/micropub', { method: 'OPTIONS' });
    assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('access-control-allow-origin'), '*');
    assert.equal((await worker.dispatchFetch('https://tedt.org/micropub?q=config&access_token=valid')).status, 400);
    assert.equal((await worker.dispatchFetch('https://tedt.org/micropub', { method: 'PUT' })).status, 405);
  });
});
