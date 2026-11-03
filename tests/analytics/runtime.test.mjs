import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const runtimeURL = 'https://tedt.org/assets/analytics/v1/analytics.js';
const runtime = await readFile(new URL('../../_site/assets/analytics/v1/analytics.js', import.meta.url), 'utf8');
let browser;
before(async () => { browser = await chromium.launch({ headless: true }); });
after(async () => { await browser?.close(); });
async function fixture({ host = 'ai.tedt.org', path = '/', mode = 'standard', duplicate = false, cf = false, fail = false } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage(), requests = [], errors = [];
  const tag = `<script defer src="${runtimeURL}" data-privacy="${mode}"></script>`;
  const body = `<html><head><title>Test public title</title>${tag}${duplicate ? tag : ''}${cf ? '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{}"></script>' : ''}</head><body><main id="app">Ready</main><p data-clarity-unmask="true">PRIVATE_CANARY</p><a id="outside" href="https://example.com/path?private=PRIVATE_CANARY">PRIVATE_CANARY</a><a id="download" download href="/PRIVATE_CANARY.zip">Download</a><form><input type="search" name="q" id="search"></form></body></html>`;
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url === runtimeURL) return route.fulfill({ contentType: 'text/javascript', body: runtime });
    if (/googletagmanager|clarity\.ms|cloudflareinsights/.test(url)) {
      requests.push(url);
      if (fail) return route.abort();
      return route.fulfill({ contentType: 'text/javascript', body: url.includes('clarity.ms/tag/') ? 'window.__maskedAtLoad=document.documentElement.getAttribute("data-clarity-mask");window.__unmaskedAtLoad=document.querySelectorAll("[data-clarity-unmask]").length;' : '' });
    }
    return route.fulfill({ contentType: 'text/html', body });
  });
  await page.goto(`http${host === 'localhost' ? '' : 's'}://${host}${path}`);
  await page.waitForTimeout(150);
  const commands = () => page.evaluate(() => (window.dataLayer || []).map(x => Array.from(x)));
  return { page, context, requests, errors, commands };
}
test('initializes all three once and preserves public events', async () => {
  const f = await fixture({ duplicate: true });
  try {
    assert.equal(f.requests.length, 3);
    let commands = await f.commands();
    assert.equal(commands.filter(x => x[0] === 'config').length, 1);
    assert.equal(commands.filter(x => x[1] === 'page_view').length, 1);
    assert.equal(commands.find(x => x[0] === 'config')[2].allow_google_signals, false);
    await f.page.evaluate(() => { document.querySelector('#outside').addEventListener('click', e => e.preventDefault()); document.querySelector('#outside').click(); document.querySelector('#download').addEventListener('click', e => e.preventDefault()); document.querySelector('#download').click(); const s=document.querySelector('#search');s.value='published search';s.dispatchEvent(new Event('change',{bubbles:true})); });
    commands = await f.commands();
    for (const name of ['outbound_click', 'file_download', 'search']) assert.equal(commands.filter(x => x[1] === name).length, 1);
    assert.deepEqual(f.errors, []);
  } finally { await f.context.close(); }
});
test('private mode masks before Clarity and omits private event values', async () => {
  const f = await fixture({ host: 'member.tedt.org', path: '/library/?q=PRIVATE_CANARY', mode: 'masked' });
  try {
    assert.equal(await f.page.evaluate(() => window.__maskedAtLoad), 'true');
    assert.equal(await f.page.evaluate(() => window.__unmaskedAtLoad), 0);
    await f.page.evaluate(() => { document.querySelector('#outside').addEventListener('click', e => e.preventDefault());document.querySelector('#outside').click();document.querySelector('#download').addEventListener('click', e => e.preventDefault());document.querySelector('#download').click();const s=document.querySelector('#search');s.value='PRIVATE_CANARY';s.dispatchEvent(new Event('change',{bubbles:true}));document.body.insertAdjacentHTML('beforeend','<p data-clarity-unmask="true">PRIVATE_CANARY</p>'); });
    await f.page.waitForTimeout(50);
    assert.equal(await f.page.locator('[data-clarity-unmask]').count(), 0);
    assert.ok(!JSON.stringify(await f.commands()).includes('PRIVATE_CANARY'));
    assert.ok(!(await f.commands()).some(x => x[1] === 'search'));
  } finally { await f.context.close(); }
});
test('uses an existing Cloudflare beacon and records one URL-changing navigation', async () => {
  const f = await fixture({ cf: true });
  try {
    assert.equal(f.requests.filter(x => x.includes('cloudflareinsights')).length, 1);
    await f.page.evaluate(() => { history.pushState({}, '', '/second/');history.replaceState({}, '', '/second/'); });
    await f.page.waitForTimeout(50);
    assert.equal((await f.commands()).filter(x => x[1] === 'page_view').length, 2);
  } finally { await f.context.close(); }
});
test('localhost and authentication operations do not initialize collectors', async () => {
  for (const config of [{ host: 'localhost' }, { host: 'member.tedt.org', path: '/auth/callback?code=secret' }, { path: '/?access_token=secret' }, { path: '/api/status' }]) {
    const f = await fixture(config);
    try { assert.deepEqual(f.requests, []); assert.deepEqual(await f.commands(), []); } finally { await f.context.close(); }
  }
});
test('blocked collectors leave the application usable', async () => {
  const f = await fixture({ fail: true });
  try { assert.equal(await f.page.locator('#app').textContent(), 'Ready'); assert.deepEqual(f.errors, []); } finally { await f.context.close(); }
});
