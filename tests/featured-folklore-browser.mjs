import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const built = join(root, '_site');
const pool = JSON.parse(await readFile(join(root, '_data/featured_folklore.json'))).stories;
const byID = new Map(pool.map(story => [story.id, story]));
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2' };
const server = process.argv[2] ? null : createServer(async (request, response) => {
  try {
    let file = resolve(built, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (!file.startsWith(built + sep) && file !== built) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = process.argv[2] || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
await mkdir(join(root, 'test-results'), { recursive:true });
try {
  const context = await browser.newContext({ viewport: {width:1440,height:1000} });
  await context.route(/https:\/\/(?:[^/]*google-analytics\.com|www\.googletagmanager\.com|[^/]*clarity\.ms|static\.cloudflareinsights\.com)\//, route => route.abort());
  if (server && process.env.FOLKLORE_BUILD) await context.route('https://folklore.tschopp.org/assets/folklore/illustrations/**', route => route.fulfill({path:join(process.env.FOLKLORE_BUILD, new URL(route.request().url()).pathname), contentType:'image/webp'}));
  const page = await context.newPage();
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  const selections=[];
  for (let run=0;run<4;run+=1) {
    await page.goto(base, {waitUntil:'domcontentloaded'});
    await page.waitForSelector('[data-featured-initialized="true"]');
    const cards=await page.locator('[data-featured-story]').evaluateAll(nodes=>nodes.map(card=>({id:card.dataset.storyId,url:card.querySelector('[data-featured-link]').href,title:card.querySelector('[data-featured-link]').textContent,src:card.querySelector('img').getAttribute('src'),alt:card.querySelector('img').alt})));
    assert.equal(cards.length,3);assert.equal(new Set(cards.map(card=>card.id)).size,3);
    for (const card of cards) {
      const story=byID.get(card.id);assert.ok(story);
      assert.equal(card.url,story.url);assert.equal(card.title,story.title);
      assert.equal(card.src,story.image.src);assert.equal(card.alt,story.image.alt);
    }
    selections.push(cards.map(card=>card.id).join(','));
  }
  assert.ok(new Set(selections).size>1,'Homepage selection changes between loads');
  const before=selections.at(-1);
  await page.waitForTimeout(1200);
  assert.equal((await page.locator('[data-featured-story]').evaluateAll(cards=>cards.map(card=>card.dataset.storyId))).join(','),before,'Selection stays still while reading');
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});
    const section=page.locator('[data-featured-folklore]');await section.scrollIntoViewIfNeeded();
    for(const image of await section.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
      assert.ok(await image.evaluate(img=>img.naturalWidth>0));
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    for(const theme of ['light','dark']) {
      await page.evaluate(theme=>document.documentElement.setAttribute('data-bs-theme',theme),theme);
      const result=await new AxeBuilder({page}).include('[data-featured-folklore]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      assert.deepEqual(result.violations.map(v=>[v.id,v.nodes.map(n=>n.failureSummary)]),[]);
      await section.screenshot({path:join(root,'test-results',`featured-folklore-${width}-${theme}.png`)});
    }
  }
  // Keyboard access goes to the canonical story, without a local article hop.
  const link=page.locator('[data-featured-link]').first();await link.focus();assert.equal(await link.evaluate(a=>a===document.activeElement),true);
  assert.deepEqual(errors,[]);
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback=await noJS.newPage();await fallback.goto(base,{waitUntil:'domcontentloaded'});
  assert.deepEqual(await fallback.locator('[data-featured-link]').evaluateAll(links=>links.map(link=>link.href)),pool.slice(0,3).map(story=>story.url));
  await noJS.close();await context.close();
  console.log('Featured folklore browser OK: random unique choices, coherent cards, stable reading, static fallback, mobile/dark accessibility.');
} finally {await browser.close();if(server){server.closeAllConnections();server.close();}}
