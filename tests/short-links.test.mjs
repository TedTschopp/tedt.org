import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { destinationUrl } from '../_code/short-links/links.mjs';
import worker from '../_code/short-links/worker.mjs';

const cli = fileURLToPath(new URL('../_code/short-links/cli.mjs', import.meta.url));
const destination = 'https://folklore.tschopp.org/read/?lang=en&sort=date#notes';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'short-links-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '_data'));
  const registry = join(root, '_data', 'short_links.json');
  writeFileSync(registry, '[]');
  return { root, registry, run: (...args) => spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
  }) };
}

test('create, reuse, and publish a short link with the full destination', (t) => {
  const { root, run } = fixture(t);
  const added = run('add', destination);
  assert.equal(added.status, 0, added.stderr);
  const shortUrl = added.stdout.trim();
  assert.match(shortUrl, /^https:\/\/tedt\.org\/s\/[a-z0-9]{8}$/);
  assert.equal(run('add', destination).stdout.trim(), shortUrl);

  const code = shortUrl.split('/').at(-1);
  assert.match(run('add', 'https://tedt.org/', code).stderr, /already in use/);
  assert.equal(run('add', 'https://tedt.org/', 'tedthome').status, 0);
  const build = run('build', '_site');
  assert.equal(build.status, 0, build.stderr);
  assert.equal(
    JSON.parse(readFileSync(join(root, '_site', 'assets', 'short-links', `${code}.json`), 'utf8')),
    destination,
  );
  const fallback = readFileSync(join(root, '_site', 's', code, 'index.html'), 'utf8');
  const escaped = destination.replace('&', '&amp;');
  assert.ok(fallback.includes(`http-equiv="refresh" content="0; url=${escaped}"`));
  assert.ok(fallback.includes(`href="${escaped}"`));
  assert.ok(fallback.includes('content="noindex,follow"'));
});

test('reject duplicate registry codes before publishing', (t) => {
  const { registry, run } = fixture(t);
  writeFileSync(registry, JSON.stringify([
    { code: 'samecode', url: 'https://tedt.org/' },
    { code: 'samecode', url: 'https://tschopp.org/' },
  ]));
  const result = run('build', '_site');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Duplicate short code/);
});

test('accept site URLs and reject unrelated destinations and short-link loops', () => {
  assert.equal(destinationUrl(destination), destination);
  assert.equal(destinationUrl('https://tedt.org'), 'https://tedt.org/');
  for (const url of [
    'http://tedt.org/',
    'https://example.org/',
    'https://tedt.org.example.org/',
    'https://hypothetical-tedt.org/',
    'https://user@tedt.org/',
    'https://tschopp.org:8443/',
    'https://tedt.org/s/tedthome',
    'https://www.tedt.org/%73/tedthome',
  ]) {
    assert.throws(() => destinationUrl(url), Error, url);
  }
});

test('redirect GET and HEAD using the registry and retain destination parameters', async (t) => {
  const lookup = t.mock.method(globalThis, 'fetch', async () => Response.json(destination));
  for (const [method, path] of [['GET', 'familyhq?source=short'], ['HEAD', 'familyhq/']]) {
    const response = await worker.fetch(new Request(`https://tedt.org/s/${path}`, { method }));
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('Location'), destination);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(lookup.mock.calls.length, 2);
  for (const { arguments: [url, init] } of lookup.mock.calls) {
    assert.equal(url.href, 'https://tedt.org/assets/short-links/familyhq.json');
    assert.equal(init.redirect, 'manual');
  }
});

test('pass through to Pages for unavailable lookups and unrelated requests', async (t) => {
  const response = new Response('Pages fallback', { status: 404 });
  const lookup = t.mock.method(globalThis, 'fetch', async (input) => {
    if (input instanceof Request) return response;
    return Response.json('https://example.org/');
  });
  const shortLink = new Request('https://tedt.org/s/familyhq');
  assert.equal(await worker.fetch(shortLink), response);
  assert.equal(lookup.mock.calls[1].arguments[0], shortLink);

  lookup.mock.resetCalls();
  for (const request of [
    new Request('https://tedt.org/s/invalid'),
    new Request('https://tedt.org/about/'),
    new Request('https://tedt.org/s/familyhq', { method: 'POST' }),
  ]) {
    assert.equal(await worker.fetch(request), response);
    assert.equal(lookup.mock.calls.at(-1).arguments[0], request);
  }
  assert.equal(lookup.mock.calls.length, 3);
});
