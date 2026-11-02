import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';

const build = process.env.HEADER_TEST_BUILD || path.resolve('_site');
const assets = path.join(build, 'assets/global-header/v1');
const labels = ['Essays', 'Stories & Folklore', 'Games & Worlds', 'Tools', 'Learn', 'About'];
async function sharedAssets(page, transform = value => value) {
  await page.route('https://tedt.org/assets/global-header/v1/**', async route => {
    const file = new URL(route.request().url()).pathname.split('/').pop();
    const body = await readFile(path.join(assets, file));
    await route.fulfill({ body: file === 'header.js' ? transform(body.toString()) : body,
      contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'image/svg+xml' });
  });
}
async function ready(page) { await expect(page.locator('tedt-global-header')).toHaveAttribute('data-ready', 'true'); }

test('six-section navigation, accessible disclosure, focus, and isolated styling', async ({ page }) => {
  await sharedAssets(page); await page.goto('/essays/'); await ready(page);
  const header = page.locator('tedt-global-header');
  await expect(header.locator('.section-link')).toHaveText(labels);
  const disclosure = header.getByRole('button', { name: 'Show Essays menu', exact: true });
  await disclosure.click(); await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
  await expect(header.getByRole('link', { name: 'Yesterday in AI' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(disclosure).toBeFocused();
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  for (const node of await header.locator('.section-link, .disclosure, .theme button').all()) {
    const box = await node.boundingBox(); expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const results = await new AxeBuilder({ page }).include('tedt-global-header').analyze();
  expect(results.violations).toEqual([]);
  await page.addStyleTag({ content: 'a, button { font-size:60px !important; background:red !important; }' });
  expect(await header.locator('.section-link').first().evaluate(node => getComputedStyle(node).fontSize)).toBe('15px');
});

for (const width of [375, 768, 1024, 1199, 1200, 1440]) {
  test(`responsive navigation fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await sharedAssets(page); await page.goto('/learn/'); await ready(page);
    const header = page.locator('tedt-global-header'); const toggle = header.getByRole('button', { name: 'Toggle navigation' });
    if (width < 1200) { await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true'); }
    else await expect(toggle).toBeHidden();
    for (const link of await header.locator('.section-link').all()) {
      await expect(link).toBeVisible(); const box = await link.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    const bar = await header.locator('.bar').boundingBox(); expect(bar.height).toBe(70);
    expect(await page.locator('#main-content').evaluate(node => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(70);
  });
}

test('fallback works when JavaScript or the shadow stylesheet cannot load', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const noJS = await context.newPage();
  await noJS.goto(new URL('/stories/', test.info().project.use.baseURL).href);
  await expect(noJS.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Stories & Folklore' })).toBeVisible();
  await context.close();
  await sharedAssets(page);
  await page.route('https://tedt.org/assets/global-header/v1/header.css', route => route.abort());
  await page.goto('/stories/');
  await expect(page.locator('tedt-global-header .tedt-header-fallback')).toBeVisible();
  await expect(page.locator('tedt-global-header .tedt-header-fallback').getByRole('link', { name: 'Tools', exact: true })).toHaveAttribute('href', 'https://tools.tedt.org/');
});

test('appearance follows visitors between real subdomain origins and rechecks on focus', async ({ context }) => {
  const source = await readFile(path.join(build, 'essays/index.html'), 'utf8');
  for (const host of ['busy.tedt.org', 'tools.tedt.org']) {
    await context.route(`https://${host}/`, route => route.fulfill({ body: source, contentType: 'text/html' }));
  }
  const first = await context.newPage(); await sharedAssets(first); await first.goto('https://busy.tedt.org/'); await ready(first);
  await first.locator('tedt-global-header').getByRole('button', { name: 'Dark', exact: true }).click();
  const cookie = (await context.cookies()).find(item => item.name === 'tedt-appearance');
  expect(cookie.domain).toBe('.tedt.org'); expect(cookie.secure).toBe(true); expect(cookie.sameSite).toBe('Lax');
  const second = await context.newPage(); await sharedAssets(second); await second.goto('https://tools.tedt.org/'); await ready(second);
  await expect(second.locator('html')).toHaveAttribute('data-theme', 'dark');
  await second.locator('tedt-global-header').getByRole('button', { name: 'Light', exact: true }).click();
  await first.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(first.locator('html')).toHaveAttribute('data-theme', 'light');
  await second.locator('tedt-global-header').getByRole('button', { name: 'System', exact: true }).click();
  await second.emulateMedia({ colorScheme: 'dark' }); await expect(second.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('central updates reach unchanged consumer HTML and iframe headers are suppressed', async ({ page }) => {
  let updated = false;
  await sharedAssets(page, source => updated ? source.replace('"Essays"', '"Essays updated"') : source);
  await page.goto('/essays/'); await ready(page);
  updated = true; await page.reload(); await ready(page);
  await expect(page.locator('tedt-global-header .section-link').first()).toHaveText('Essays updated');
  await page.evaluate(() => {
    const frame = document.createElement('iframe'); frame.src = '/essays/'; document.body.append(frame);
  });
  await expect(page.frameLocator('iframe').locator('tedt-global-header')).toBeHidden();
});

test('landing artwork follows shared Light, Dark, and System choices', async ({ page }) => {
  await sharedAssets(page); await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/essays/'); await ready(page);
  const image = page.locator('.tedt-section-hero img');
  await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  await expect.poll(() => image.evaluate(node => node.currentSrc.includes('-dark'))).toBe(false);
  await page.locator('tedt-global-header').getByRole('button', { name: 'Dark', exact: true }).click();
  await expect.poll(() => image.evaluate(node => node.currentSrc.includes('-dark') && node.complete && node.naturalWidth > 0)).toBe(true);
  await page.reload(); await ready(page);
  await expect.poll(() => image.evaluate(node => node.currentSrc.includes('-dark') && node.complete)).toBe(true);
  await page.locator('tedt-global-header').getByRole('button', { name: 'System', exact: true }).click();
  await expect.poll(() => image.evaluate(node => node.currentSrc.includes('-dark'))).toBe(false);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(() => image.evaluate(node => node.currentSrc.includes('-dark') && node.complete)).toBe(true);
  for (const [section, groups] of [['essays', 5], ['stories', 5], ['games', 5], ['learn', 4], ['about-ted', 4]]) {
    await page.goto('/' + section + '/');
    await expect(page.locator('.tedt-section-hero picture')).toHaveCount(1);
    await expect(page.locator('.tedt-group-artwork picture')).toHaveCount(groups);
    await expect(page.locator('picture[data-tedt-artwork] source[data-tedt-dark]')).toHaveCount(groups + 1);
  }
});
