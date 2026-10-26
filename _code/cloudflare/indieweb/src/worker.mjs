import { OWNER, ENDPOINT, MEDIA_ORIGIN, MAX_POST, MAX_UPLOAD, POST_TYPES, ProtocolError, invalid, validateProperties, formPayload, patchProperties, mediaFormat, ownedMedia } from './protocol.mjs';
const encoder = new TextEncoder();
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Idempotency-Key, If-Match, Range', 'Access-Control-Expose-Headers': 'Location, ETag, Link, Accept-Ranges, Content-Range', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const idPattern = /^[0-9a-f-]{36}$/;
const mediaPattern = /^[0-9a-f]{64}\.(?:jpg|png|gif|webp|avif|mp3|ogg|wav|m4a|mp4|webm|vtt)$/;
function json(data, status = 200, headers = {}) { return new Response(data === null ? null : JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', ...headers } }); }
async function limitedBody(request, max) {
  if (Number(request.headers.get('Content-Length')) > max) throw new ProtocolError(413, 'invalid_request', 'Request body is too large.');
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader(); const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > max) { await reader.cancel(); throw new ProtocolError(413, 'invalid_request', 'Request body is too large.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}
async function requestPayload(request) {
  const body = await limitedBody(request, MAX_POST + 4096);
  const mime = (request.headers.get('Content-Type') || '').split(';')[0].toLowerCase();
  try {
    if (mime === 'application/json') return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body));
    if (mime === 'application/x-www-form-urlencoded') return formPayload(new URLSearchParams(new TextDecoder('utf-8', { fatal: true }).decode(body)));
    if (mime === 'multipart/form-data') return formPayload(await new Response(body, { headers: { 'Content-Type': request.headers.get('Content-Type') } }).formData());
  } catch (e) { if (e instanceof ProtocolError) throw e; invalid('Malformed request body.'); }
  throw new ProtocolError(415, 'invalid_request', 'Use Micropub JSON, form encoding, or multipart form data.');
}
function bearer(request, bodyToken) {
  if (new URL(request.url).searchParams.has('access_token')) invalid('Access tokens must not appear in URLs.');
  const header = request.headers.get('Authorization');
  if (header && !/^Bearer [A-Za-z0-9._~+\/-]+=*$/i.test(header)) throw new ProtocolError(401, 'invalid_token', 'Use an Authorization: Bearer token.');
  const value = header ? header.slice(7) : bodyToken;
  if (header && bodyToken && value !== bodyToken) invalid('Conflicting access tokens.');
  if (typeof value !== 'string' || !value || value.length > 8192) throw new ProtocolError(401, 'unauthorized', 'An IndieAuth access token is required.');
  return value;
}
function providerUrl(value) {
  const u = new URL(value);
  if (u.origin !== 'https://indiekey.id' || u.username || u.password || u.hash) throw new Error('Invalid identity provider configuration');
  return u.href;
}
async function providerJson(url, options = {}, http = fetch) {
  const response = await http(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json', ...options.headers } });
  if (!response.ok) throw new Error('Identity provider unavailable');
  const bytes = await limitedBody(response, 65536);
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function authenticate(request, env, needed, bodyToken, http = fetch) {
  const token = bearer(request, bodyToken); let claims;
  try {
    if (env.INDIEAUTH_METADATA_URL) {
      const metadata = await providerJson(providerUrl(env.INDIEAUTH_METADATA_URL), {}, http);
      const issuer = providerUrl(metadata.issuer);
      if (env.INDIEAUTH_INTROSPECTION_SECRET) {
        claims = await providerJson(providerUrl(metadata.introspection_endpoint || 'https://indiekey.id/introspect'), {
          method: 'POST', headers: { Authorization: `Bearer ${env.INDIEAUTH_INTROSPECTION_SECRET}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token }),
        }, http);
        if (claims.active !== true) throw new ProtocolError(401, 'invalid_token', 'The access token is inactive.');
      } else {
        // IndieKey documents signed resource-server JWTs as its other verification mode.
        // Verify every claim and signature; never decode a token and treat it as trusted.
        const parts = token.split('.');
        if (parts.length !== 3 || parts.some(p => p.length > 16384)) throw new ProtocolError(401, 'invalid_token', 'Invalid access token.');
        const decode = p => Uint8Array.from(atob(p.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        let header;
        try { header = JSON.parse(new TextDecoder().decode(decode(parts[0]))); claims = JSON.parse(new TextDecoder().decode(decode(parts[1]))); }
        catch { throw new ProtocolError(401, 'invalid_token', 'Invalid access token.'); }
        if (header.alg !== 'RS256' || header.typ !== 'at+jwt' || typeof header.kid !== 'string') throw new ProtocolError(401, 'invalid_token', 'Unsupported access token signature.');
        const jwks = await providerJson(providerUrl(metadata.jwks_uri), {}, http);
        const jwk = jwks.keys?.find(k => k.kid === header.kid && k.kty === 'RSA' && (!k.use || k.use === 'sig') && (!k.alg || k.alg === 'RS256'));
        if (!jwk) throw new ProtocolError(401, 'invalid_token', 'Unknown signing key.');
        const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
        if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), encoder.encode(`${parts[0]}.${parts[1]}`))) throw new ProtocolError(401, 'invalid_token', 'Invalid token signature.');
      }
      const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
      // Media uploads use the same Micropub resource and media scope.
      if (claims.iss !== issuer || !audiences.includes(ENDPOINT) || claims.sub !== OWNER || !Number.isFinite(claims.exp)) throw new ProtocolError(401, 'invalid_token', 'The token was issued for another resource or owner.');
    } else {
      // Keep existing delegation usable until the owner has verified IndieKey.
      const response = await http('https://tokens.indieauth.com/token', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, redirect: 'manual', signal: AbortSignal.timeout(8000) });
      if (response.status === 401 || response.status === 403) throw new ProtocolError(401, 'invalid_token', 'The access token is invalid.');
      if (!response.ok) throw new Error('Identity provider unavailable');
      claims = JSON.parse(new TextDecoder().decode(await limitedBody(response, 65536)));
    }
  } catch (e) {
    if (e instanceof ProtocolError) throw e;
    throw new ProtocolError(503, 'temporarily_unavailable', 'Token verification is unavailable. Nothing was saved.');
  }
  const now = Math.floor(Date.now() / 1000);
  if (claims.me !== OWNER || claims.active === false || (claims.exp !== undefined && (!Number.isFinite(claims.exp) || claims.exp <= now)) ||
      (claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf > now + 30))) throw new ProtocolError(401, 'invalid_token', 'The token is expired, inactive, or belongs to another owner.');
  const scopes = new Set(typeof claims.scope === 'string' ? claims.scope.split(/\s+/) : []);
  if (!needed.some(s => scopes.has(s))) throw new ProtocolError(403, 'insufficient_scope', `This operation requires ${needed.join(' or ')} scope.`);
  return claims;
}
function canonical(value) {
  if (typeof value !== 'string') invalid('An entry URL is required.');
  if (!value.startsWith(OWNER)) invalid('The entry URL must be absolute.');
  const u = new URL(value);
  if (u.origin !== 'https://tedt.org' || !/^\/updates\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/.test(u.pathname) || u.search || u.hash || u.username || u.password) invalid('This endpoint edits only the entries it created on tedt.org.');
  return u.href;
}
function entry(row) { return row && { ...row, properties: JSON.parse(row.properties) }; }
function publishable(row) { return !row.deleted && row.properties['post-status']?.[0] !== 'draft'; }
export class Store {
  constructor(db, uploads, uploadToken) { this.uploads = uploads; this.uploadToken = uploadToken; this.db = typeof db.withSession === 'function' ? db.withSession('first-primary') : db; }
  async get(url) { return entry(await this.db.prepare('SELECT * FROM entries WHERE url = ?').bind(canonical(url)).first()); }
  async byKey(key) { return entry(await this.db.prepare('SELECT * FROM entries WHERE request_key = ?').bind(key).first()); }
  async create(row) {
    const statements = [this.db.prepare('INSERT INTO entries (id,url,properties,type,created,modified,request_key,request_digest) VALUES (?,?,?,?,?,?,?,?)')
      .bind(row.id, row.url, JSON.stringify(row.properties), row.type, row.created, row.created, row.request_key, row.request_digest)];
    await this.db.batch(statements);
  }
  async change(row, properties, deleted) {
    const encoded = JSON.stringify(properties);
    const statements = [this.db.prepare('UPDATE entries SET properties=?, deleted=?, revision=revision+1, modified=? WHERE id=? AND revision=?')
      .bind(encoded, Number(deleted), new Date().toISOString(), row.id, row.revision)];
    const condition = 'EXISTS (SELECT 1 FROM entries WHERE id=? AND revision=? AND properties=? AND deleted=?)';
    const guard = [row.id, row.revision + 1, encoded, Number(deleted)];
    statements.push(this.db.prepare(`DELETE FROM entry_media WHERE entry_id=? AND ${condition}`).bind(row.id, ...guard));
    const results = await this.db.batch(statements);
    if (results[0].meta.changes !== 1) throw new ProtocolError(409, 'conflict', 'This entry changed concurrently. Reload its source before retrying.');
  }

  async pending() {
    const { results } = await this.db.prepare('SELECT * FROM entries WHERE revision > applied_revision ORDER BY modified, id LIMIT 10').all();
    return results.map(entry).map(row => ({ id: row.id, url: row.url, type: row.type, created: row.created, revision: row.revision, publish: publishable(row), ...(publishable(row) ? { properties: row.properties } : {}) }));
  }
  async candidates() {
    const { results } = await this.db.prepare('SELECT * FROM entries WHERE applied_revision = revision AND live_revision < revision ORDER BY modified, id LIMIT 20').all();
    return results.map(entry).map(row => ({ id: row.id, url: row.url, revision: row.revision, publish: publishable(row) }));
  }
  async acknowledge(id, revision, stage, sha) {
    if (!idPattern.test(id) || !Number.isSafeInteger(revision) || revision < 1) invalid('Invalid acknowledgement.');
    if (stage === 'applied' && !/^[a-f0-9]{40}$/.test(sha || '')) invalid('A committed Git revision is required.');
    const sql = stage === 'live' ? `UPDATE entries SET live_revision=?, was_public=CASE WHEN deleted=0 AND json_extract(properties, '$."post-status"[0]')='published' THEN 1 ELSE was_public END WHERE id=? AND revision=? AND applied_revision=?` : 'UPDATE entries SET applied_revision=?, commit_sha=? WHERE id=? AND revision=?';
    const params = stage === 'live' ? [revision, id, revision, revision] : [revision, sha, id, revision];
    const result = await this.db.prepare(sql).bind(...params).run();
    return result.meta.changes === 1;
  }
  async addMedia(id, path, format, bytes) {
    const existing = await this.db.prepare('SELECT * FROM media WHERE id=?').bind(id).first();
    if (existing?.complete || existing?.published) return existing;
    await this.db.prepare('INSERT OR IGNORE INTO media (id,path,content_type,size,created) VALUES (?,?,?,?,?)').bind(id, path, format.contentType, bytes.byteLength, new Date().toISOString()).run();
    if (!this.uploads) throw new Error('Private upload binding is unavailable');
    const data = new Uint8Array(bytes);
    for (let offset = 0, sequence = 0; offset < data.length; offset += 131072, sequence++) {
      const target = `https://upload-buffer.internal/part?id=${id}&sequence=${sequence}`;
      const response = await this.uploads.fetch(target, { method: 'PUT', headers: { Authorization: `Bearer ${this.uploadToken}` }, body: data.subarray(offset, offset + 131072) });
      if (response.status !== 204) throw new Error('Private upload chunk failed');
    }
    const complete = await this.db.prepare('UPDATE media SET complete=1 WHERE id=? AND size=(SELECT coalesce(sum(length(data)),0) FROM media_chunks WHERE media_id=?)').bind(id, id).run();
    if (complete.meta.changes !== 1) throw new Error('Incomplete private upload');
    return this.db.prepare('SELECT * FROM media WHERE id=?').bind(id).first();
  }
}
async function secretMatches(value, expected) {
  if (!value || !expected || expected.length < 32) return false;
  const [a, b] = await Promise.all([value, expected].map(v => crypto.subtle.digest('SHA-256', encoder.encode(v))));
  const x = new Uint8Array(a), y = new Uint8Array(b); let result = 0;
  for (let i = 0; i < x.length; i++) result |= x[i] ^ y[i];
  return result === 0;
}
const PREVIEW = /https:\/\/tedt\.org\/micropub\/media\/([0-9a-f]{64}\.(?:jpg|png|gif|webp|avif|mp3|ogg|wav|m4a|mp4|webm|vtt))(?:\?[^\s"'<>]*)?/g;
function normalizePreview(value, depth = 0) {
  if (depth > 8) invalid('The request nesting is too deep.');
  if (typeof value === 'string') return value.replace(PREVIEW, (original, id) => `${MEDIA_ORIGIN}/files/${id}${original.includes('#') ? original.slice(original.indexOf('#')) : ''}`);
  if (Array.isArray(value)) return value.map(v => normalizePreview(v, depth + 1));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizePreview(v, depth + 1)]));
  return value;
}
async function previewSignature(id, expires, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`media-preview:${id}:${expires}`)))].map(v => v.toString(16).padStart(2, '0')).join('');
}
async function previewUrl(id, env) {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  return `${ENDPOINT}/media/${id}?expires=${expires}&signature=${await previewSignature(id, expires, env.MEDIA_PUBLISHER_TOKEN)}`;
}
function mediaStream(row, env, from = 0, to = row.size - 1) {
  let sequence = Math.floor(from / 131072);
  return new ReadableStream({ async pull(controller) {
    if (sequence * 131072 > to) { controller.close(); return; }
    try {
      const chunkStart = sequence * 131072;
      const response = await env.UPLOADS.fetch(`https://upload-buffer.internal/part?id=${row.id}&sequence=${sequence}`, { headers: { Authorization: `Bearer ${env.MEDIA_PUBLISHER_TOKEN}` } });
      if (!response.ok) throw new Error('Private upload chunk unavailable');
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength !== Math.min(131072, row.size - chunkStart)) throw new Error('Incomplete private upload chunk');
      sequence++;
      controller.enqueue(bytes.subarray(Math.max(0, from - chunkStart), Math.min(bytes.length, to - chunkStart + 1)));
    } catch (e) { controller.error(e); }
  } });
}
async function readPreview(request, env, store, id) {
  if (!['GET', 'HEAD'].includes(request.method)) throw new ProtocolError(405, 'invalid_request', 'Previews support GET and HEAD.');
  const url = new URL(request.url), expires = Number(url.searchParams.get('expires')), signature = url.searchParams.get('signature');
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expires) || expires <= now || expires > now + 3660 || !/^[a-f0-9]{64}$/.test(signature || '') || !await secretMatches(signature, await previewSignature(id, expires, env.MEDIA_PUBLISHER_TOKEN))) throw new ProtocolError(403, 'invalid_token', 'This private preview link is invalid or expired. Reopen the draft in your authoring client.');
  const row = await store.db.prepare('SELECT * FROM media WHERE id=? AND complete=1').bind(id).first();
  if (!row) throw new ProtocolError(404, 'not_found', 'Preview not found.');
  if (row.published) return new Response(null, { status: 302, headers: { ...cors, Location: `${MEDIA_ORIGIN}/${row.path}`, 'Referrer-Policy': 'no-referrer' } });
  let from = 0, to = row.size - 1, status = 200;
  const range = request.headers.get('Range');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { ...cors, 'Content-Range': `bytes */${row.size}` } });
    if (match[1]) { from = Number(match[1]); to = match[2] ? Math.min(Number(match[2]), to) : to; }
    else from = Math.max(0, row.size - Number(match[2]));
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from > to || from >= row.size) return new Response(null, { status: 416, headers: { ...cors, 'Content-Range': `bytes */${row.size}` } });
    status = 206;
  }
  const headers = { ...cors, 'Content-Type': row.content_type, 'Content-Length': String(to - from + 1), 'Accept-Ranges': 'bytes', 'Referrer-Policy': 'no-referrer', 'Content-Disposition': `inline; filename="${id}"`, ...(status === 206 ? { 'Content-Range': `bytes ${from}-${to}/${row.size}` } : {}) };
  return new Response(request.method === 'HEAD' ? null : mediaStream(row, env, from, to), { status, headers });
}
async function editableSource(properties, store, env) {
  const ids = ownedMedia(properties);
  if (!ids.length) return properties;
  const { results } = await store.db.prepare(`SELECT id FROM media WHERE complete=1 AND published=0 AND id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all();
  const replacements = new Map(await Promise.all(results.map(async row => [`${MEDIA_ORIGIN}/files/${row.id}`, await previewUrl(row.id, env)])));
  let source = JSON.stringify(properties);
  for (const [canonical, preview] of replacements) source = source.replaceAll(canonical + '?', preview + '&').replaceAll(canonical, preview);
  return JSON.parse(source);
}
async function publisher(request, env, store) {
  const token = bearer(request); let role;
  if (await secretMatches(token, env.PUBLISHER_TOKEN)) role = 'site';
  else if (await secretMatches(token, env.MEDIA_PUBLISHER_TOKEN)) role = 'media';
  else throw new ProtocolError(401, 'invalid_token', 'Invalid publisher credential.');
  if (request.method !== 'POST') throw new ProtocolError(405, 'invalid_request', 'Use POST.');
  let data;
  try { data = JSON.parse(new TextDecoder().decode(await limitedBody(request, 16384))); } catch (e) { if (e instanceof ProtocolError) throw e; invalid('Malformed publisher request.'); }
  if (role === 'site') {
    if (data.action === 'media-references') {
      if (!idPattern.test(data.id || '') || !Number.isSafeInteger(data.revision) || !Array.isArray(data.ids) || data.ids.length > 16 || data.ids.some(id => !mediaPattern.test(id))) invalid('Invalid validated media references.');
      const condition = `EXISTS (SELECT 1 FROM entries WHERE id=? AND revision=? AND deleted=0 AND json_extract(properties, '$."post-status"[0]')='published')`;
      const statements = [store.db.prepare(`UPDATE entries SET revision=revision WHERE id=? AND revision=? AND deleted=0 AND json_extract(properties, '$."post-status"[0]')='published'`).bind(data.id, data.revision), store.db.prepare(`DELETE FROM entry_media WHERE entry_id=? AND ${condition}`).bind(data.id, data.id, data.revision)];
      for (const id of data.ids) statements.push(store.db.prepare(`INSERT OR IGNORE INTO entry_media (entry_id,media_id) SELECT ?,? WHERE ${condition}`).bind(data.id, id, data.id, data.revision));
      const result = await store.db.batch(statements);
      return json({ acknowledged: result[0].meta.changes === 1 });
    }
    if (data.action === 'pending') return json({ entries: await store.pending() });
    if (data.action === 'candidates') return json({ entries: await store.candidates() });
    if (data.action === 'applied' || data.action === 'live') return json({ acknowledged: await store.acknowledge(data.id, data.revision, data.action, data.commit_sha) });
  } else {
    if (data.action === 'inventory') return json({ ids: (await store.db.prepare('SELECT id FROM media LIMIT 10001').all()).results.map(r => r.id) });
    if (data.action === 'quota') {
      if (!Number.isSafeInteger(data.external_bytes) || data.external_bytes < 0 || data.external_bytes > 786432000) invalid('Invalid media quota.');
      await store.db.prepare("UPDATE settings SET value=? WHERE key='external_media_bytes'").bind(data.external_bytes).run();
      return json({ acknowledged: true });
    }
    if (data.action === 'pending') return json({ media: (await store.db.prepare(`SELECT id,path,content_type,size FROM media WHERE published=0 AND complete=1 AND EXISTS (SELECT 1 FROM entry_media JOIN entries ON entries.id=entry_media.entry_id WHERE entry_media.media_id=media.id AND entries.deleted=0 AND json_extract(entries.properties, '$."post-status"[0]')='published') ORDER BY created LIMIT 5`).all()).results });
    if (!mediaPattern.test(data.id || '')) invalid('Invalid media identifier.');
    if (data.action === 'content') {
      const row = await store.db.prepare('SELECT * FROM media WHERE id=? AND published=0 AND complete=1').bind(data.id).first();
      if (!row) throw new ProtocolError(404, 'not_found', 'Pending upload not found.');
      return new Response(mediaStream(row, env), { headers: { ...cors, 'Content-Type': row.content_type, 'Content-Length': String(row.size) } });
    }
    if (data.action === 'published') {
      await store.db.batch([store.db.prepare('UPDATE media SET published=1 WHERE id=?').bind(data.id), store.db.prepare('DELETE FROM media_chunks WHERE media_id=?').bind(data.id)]);
      return json({ acknowledged: true });
    }
  }
  invalid('Unsupported publisher action for this credential.');
}
async function mediaUpload(request, env, store) {
  if (request.method !== 'POST') throw new ProtocolError(405, 'invalid_request', 'Use POST with one file.');
  let form;
  try { form = await new Response(await limitedBody(request, MAX_UPLOAD + 131072), { headers: { 'Content-Type': request.headers.get('Content-Type') || '' } }).formData(); }
  catch (e) { if (e instanceof ProtocolError) throw e; invalid('Upload a multipart form with one file field.'); }
  await authenticate(request, env, ['media'], form.get('access_token'));
  if ([...form.keys()].some(k => !['file', 'access_token'].includes(k)) || form.getAll('file').length !== 1 || form.getAll('access_token').length > 1) invalid('Upload exactly one file field.');
  const file = form.get('file');
  if (!file || typeof file === 'string' || !file.size || file.size > MAX_UPLOAD) throw new ProtocolError(413, 'invalid_request', 'Upload one nonempty file, at most 5 MiB.');
  const bytes = await file.arrayBuffer(); const format = mediaFormat(bytes, file.type);
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
  const id = `${hash}.${format.extension}`; const path = `files/${id}`;
  const row = await store.addMedia(id, path, format, bytes);
  const canonicalUrl = `${MEDIA_ORIGIN}/${path}`, clientUrl = row.published ? canonicalUrl : await previewUrl(id, env);
  return json({ url: clientUrl, canonical_url: canonicalUrl, publication_status: row.published ? 'published' : 'queued', message: row.published ? 'Media is published.' : 'Upload saved privately with a temporary client preview. Public publication follows validation of the referencing entry.' }, 201, { Location: clientUrl });
}
export async function handle(request, env) {
  const url = new URL(request.url);
  try {
    const previewId = url.pathname.startsWith('/micropub/media/') ? url.pathname.slice('/micropub/media/'.length) : null;
    if (url.origin !== 'https://tedt.org' || (!mediaPattern.test(previewId || '') && !['/micropub', '/micropub/media', '/micropub/publisher', '/micropub/health'].includes(url.pathname))) return json({ error: 'not_found' }, 404);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (url.pathname === '/micropub/health' && request.method === 'GET') return json({ service: 'tedt.org Micropub', version: 1, publication: 'validated GitHub Pages queue', identity: env.INDIEAUTH_METADATA_URL ? 'IndieKey' : 'existing IndieAuth delegation' });
    if (!env.DB || !env.PUBLISHER_TOKEN || !env.MEDIA_PUBLISHER_TOKEN) throw new ProtocolError(503, 'temporarily_unavailable', 'Publishing setup is incomplete. Nothing was saved.');
    const store = new Store(env.DB, env.UPLOADS, env.MEDIA_PUBLISHER_TOKEN);
    if (previewId) return await readPreview(request, env, store, previewId);
    if (url.pathname === '/micropub/publisher') return await publisher(request, env, store);
    if (url.pathname === '/micropub/media') return await mediaUpload(request, env, store);
    if (request.method === 'GET') {
      const q = url.searchParams.get('q');
      await authenticate(request, env, q === 'source' ? ['update'] : ['create', 'update', 'delete', 'undelete', 'media']);
      if (q === 'config' || q === 'syndicate-to' || q === 'post-types') {
        const config = { 'media-endpoint': `${ENDPOINT}/media`, 'syndicate-to': [{ uid: 'https://tschopp.net/@Ted', name: 'Ted on Mastodon' }], 'post-types': POST_TYPES.map(type => ({ type, name: type.charAt(0).toUpperCase() + type.slice(1) })) };
        return json(q === 'syndicate-to' ? { 'syndicate-to': config['syndicate-to'] } : q === 'post-types' ? { 'post-types': config['post-types'] } : config);
      }
      if (q === 'source' || q === 'status') {
        const row = await store.get(url.searchParams.get('url'));
        if (!row) throw new ProtocolError(404, 'not_found', 'Entry not found.');
        if (q === 'status') return json({ url: row.url, revision: row.revision, publication_status: row.live_revision === row.revision ? (publishable(row) ? 'published' : row.deleted ? 'deleted' : 'draft') : row.applied_revision === row.revision ? 'awaiting_deployment' : 'queued', commit: row.commit_sha });
        const selected = url.searchParams.getAll('properties[]');
        const properties = await editableSource(row.properties, store, env);
        return json({ type: [row.type], properties: selected.length ? Object.fromEntries(Object.entries(properties).filter(([key]) => selected.includes(key))) : properties }, 200, { ETag: `"${row.revision}"` });
      }
      invalid('Supported queries are config, source, status, syndicate-to, and post-types.');
    }
    if (request.method !== 'POST') throw new ProtocolError(405, 'invalid_request', 'Use GET, POST, or OPTIONS.');
    const data = normalizePreview(await requestPayload(request));
    if (!data || Array.isArray(data) || typeof data !== 'object') invalid('The request must be an object.');
    const action = data.action || 'create';
    if (!['create', 'update', 'delete', 'undelete'].includes(action)) invalid('Unsupported action.');
    const claims = await authenticate(request, env, [action], data.access_token);
    if (action === 'create') {
      if (Object.keys(data).some(k => !['type', 'properties', 'access_token'].includes(k)) || !Array.isArray(data.type) || data.type.length !== 1) invalid('A create request needs exactly one type and a properties object.');
      const now = new Date(); const properties = validateProperties(data.properties, data.type[0], { now });
      const key = request.headers.get('Idempotency-Key');
      if (key && !/^[A-Za-z0-9_-]{8,128}$/.test(key)) invalid('Invalid Idempotency-Key.');
      const requestKey = key ? `${claims.client_id || OWNER}|${key}` : null;
      const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify({ type: data.type, properties }))))].map(v => v.toString(16).padStart(2, '0')).join('');
      if (requestKey) {
        const previous = await store.byKey(requestKey);
        if (previous) {
          if (previous.request_digest !== digest) throw new ProtocolError(409, 'conflict', 'This idempotency key was used for different content.');
          return json({ url: previous.url, publication_status: 'queued', message: 'This request was already accepted.' }, 201, { Location: previous.url });
        }
      }
      properties.published ||= [now.toISOString()]; properties['post-status'] ||= ['published'];
      const id = crypto.randomUUID(); const slug = properties['mp-slug']?.[0];
      const path = `updates/${now.toISOString().slice(0, 10).replaceAll('-', '/')}/${slug ? `${slug}-` : ''}${id}/`;
      const row = { id, url: `${OWNER}${path}`, properties, type: data.type[0], created: now.toISOString(), request_key: requestKey, request_digest: digest };
      try { await store.create(row); }
      catch (e) {
        if (requestKey) { const previous = await store.byKey(requestKey); if (previous?.request_digest === digest) return json({ url: previous.url, publication_status: 'queued' }, 201, { Location: previous.url }); }
        throw e;
      }
      return json({ url: row.url, publication_status: properties['post-status'][0] === 'draft' ? 'draft' : 'queued', message: 'Saved. Public entries appear after validation, media availability, and a successful Pages deployment.' }, 201, { Location: row.url });
    }
    if (action !== 'update' && Object.keys(data).some(k => !['action', 'url', 'access_token'].includes(k))) invalid('Unsupported action parameter.');
    const row = await store.get(data.url);
    if (!row) throw new ProtocolError(404, 'not_found', 'Entry not found.');
    const match = request.headers.get('If-Match');
    if (match && match !== `"${row.revision}"`) throw new ProtocolError(412, 'conflict', 'Reload the source before editing this revision.');
    if (action === 'update') {
      if (row.deleted) throw new ProtocolError(410, 'invalid_request', 'Undelete this entry before editing it.');
      await store.change(row, patchProperties(row.properties, data, row.type, new Date(), { publishedImmutable: Boolean(row.was_public) || row.properties['post-status']?.[0] !== 'draft', created: row.created }), false);
    } else {
      const deleted = action === 'delete';
      if (Boolean(row.deleted) !== deleted) await store.change(row, row.properties, deleted);
    }
    return json(null, 204);
  } catch (e) {
    if (e instanceof ProtocolError) return json({ error: e.error, error_description: e.message }, e.status, e.status === 401 ? { 'WWW-Authenticate': 'Bearer realm="tedt.org Micropub"' } : {});
    if (/capacity reached/i.test(String(e.message))) return json({ error: 'insufficient_storage', error_description: 'The configured storage budget is full. No paid upgrade was enabled.' }, 507);
    // Never include SQL, access tokens, private content, or provider responses in logs/errors.
    return json({ error: 'temporarily_unavailable', error_description: 'Publishing storage is unavailable. Retry with the same Idempotency-Key.' }, 503);
  }
}
export default { fetch: handle };
