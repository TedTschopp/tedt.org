import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import { authenticate } from '../src/worker.mjs';
const META = 'https://indiekey.id/.well-known/oauth-authorization-server/s/crse2y91vtsd5q0r';
const issuer = 'https://indiekey.id/s/crse2y91vtsd5q0r/';
let pair, jwk;
const encode = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
before(async () => {
  pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  jwk = { ...await crypto.subtle.exportKey('jwk', pair.publicKey), kid: 'fixture-key', alg: 'RS256', use: 'sig' };
});
async function signed(changes = {}, headerChanges = {}) {
  const claims = { iss: issuer, sub: 'https://tedt.org/', me: 'https://tedt.org/', aud: 'https://tedt.org/micropub', exp: Math.floor(Date.now() / 1000) + 3600, scope: 'create media', ...changes };
  const input = `${encode({ alg: 'RS256', typ: 'at+jwt', kid: 'fixture-key', ...headerChanges })}.${encode(claims)}`;
  return `${input}.${Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(input))).toString('base64url')}`;
}
async function provider(url) {
  if (url === META) return Response.json({ issuer, jwks_uri: 'https://indiekey.id/jwks' });
  assert.equal(url, 'https://indiekey.id/jwks');
  return Response.json({ keys: [jwk] });
}
function verify(token, needed = ['create']) {
  return authenticate(new Request('https://tedt.org/micropub', { headers: { Authorization: `Bearer ${token}` } }), { INDIEAUTH_METADATA_URL: META }, needed, undefined, provider);
}
test('signed IndieKey JWT accepts only the correct owner, resource, scope, time and key', async () => {
  assert.equal((await verify(await signed())).me, 'https://tedt.org/');
  assert.equal((await verify(await signed({ aud: ['https://tedt.org/micropub', 'https://aperture.p3k.io/microsub/1121'] }))).me, 'https://tedt.org/');
  for (const changes of [{ me: 'https://foreign.example/' }, { sub: 'https://foreign.example/' }, { aud: 'https://foreign.example/micropub' }, { iss: 'https://indiekey.id/s/foreign/' }, { exp: 1 }, { exp: '9999999999' }, { nbf: Math.floor(Date.now() / 1000) + 3600 }]) {
    await assert.rejects(verify(await signed(changes)), e => e.status === 401);
  }
  await assert.rejects(verify(await signed({ scope: 'read follow' })), e => e.status === 403);
  for (const header of [{ alg: 'none' }, { typ: 'JWT' }, { kid: 'unknown' }]) await assert.rejects(verify(await signed({}, header)), e => e.status === 401);
  const parts = (await signed()).split('.'); const signature = Buffer.from(parts[2], 'base64url'); signature[10] ^= 1; parts[2] = signature.toString('base64url');
  await assert.rejects(verify(parts.join('.')), e => e.status === 401);
});
test('JWT key retrieval failure does not accept an unverified token', async () => {
  const token = await signed();
  await assert.rejects(authenticate(new Request('https://tedt.org/micropub', { headers: { Authorization: `Bearer ${token}` } }), { INDIEAUTH_METADATA_URL: META }, ['create'], undefined, async () => new Response('Unavailable', { status: 503 })), e => e.status === 503);
});
