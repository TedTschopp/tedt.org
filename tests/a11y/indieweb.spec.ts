import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';

const article = '/Dungeons-and-Dragons-5th-Edition-Rules-For-Gamma-World-Weapons/';
const canonical = `https://tedt.org${article}`;
const receiver = 'https://webmention.io/tedt.org/webmention';

test('Webmention form sends canonical data and announces queued acceptance', async ({ page }) => {
  const requests: string[] = [];
  await page.route(receiver, async route => {
    requests.push(route.request().postData() || '');
    await route.fulfill({ status: 202, headers: { 'access-control-allow-origin': '*' }, body: 'Queued' });
  });
  await page.goto(article);
  await expect(page.locator('[data-webmention-form]')).toHaveAttribute('data-enhanced', 'true');
  expect(requests).toHaveLength(0);
  await page.getByLabel('URL of your response').fill('https://reader.example/reply');
  await page.getByRole('button', { name: 'Send Webmention' }).click();
  await expect(page.locator('.webmention-status')).toContainText('Queued for verification and moderation');
  expect(requests).toHaveLength(1);
  const body = new URLSearchParams(requests[0]);
  expect(body.get('source')).toBe('https://reader.example/reply');
  expect(body.get('target')).toBe(canonical);
  await expect(page.getByRole('button', { name: 'Send Webmention' })).toBeEnabled();
});

test('receiver rejection and uncertain network status remain distinguishable', async ({ page }) => {
  let failNetwork = false;
  await page.route(receiver, async route => {
    if (failNetwork) await route.abort('failed');
    else await route.fulfill({ status: 400, headers: { 'access-control-allow-origin': '*' }, body: 'Invalid source' });
  });
  await page.goto(article);
  await page.getByLabel('URL of your response').fill('https://reader.example/reply');
  await page.getByRole('button', { name: 'Send Webmention' }).click();
  await expect(page.locator('.webmention-status')).toContainText('did not accept');
  failNetwork = true;
  await page.getByRole('button', { name: 'Send Webmention' }).click();
  await expect(page.locator('.webmention-status')).toContainText('could not be confirmed');
  await expect(page.locator('.webmention-status a')).toHaveAttribute('href', receiver);
  await expect(page.getByRole('button', { name: 'Send Webmention' })).toBeEnabled();
});

test('discussion controls fit mobile screens and pass scoped accessibility checks', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(article);
  const section = page.locator('#webmentions-section');
  await section.scrollIntoViewIfNeeded();
  const field = await page.getByLabel('URL of your response').boundingBox();
  const button = await page.getByRole('button', { name: 'Send Webmention' }).boundingBox();
  expect(field && field.x >= 0 && field.x + field.width <= 375).toBeTruthy();
  expect(button && button.x >= 0 && button.x + button.width <= 375).toBeTruthy();
  const audit = await new AxeBuilder({ page }).include('#webmentions-section').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('slide discussion remains reachable below the presentation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/slides/principles-of-effective-architecture/');
  const form = page.locator('[data-webmention-form]');
  await form.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Send Webmention' })).toBeInViewport();
  expect(await page.locator('.slide-deck-frame').evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThan(200);
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((node, value) => node.setAttribute('data-bs-theme', value), theme);
    const audit = await new AxeBuilder({ page }).include('#webmentions-section').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('approved responses remain readable and the native form retains its canonical target', async ({ page }) => {
    const cache = JSON.parse(fs.readFileSync('_data/webmentions.json', 'utf8'));
    const groups = cache.by_target[canonical] || {};
    const count = Object.values(groups).reduce((sum: number, rows: any) => sum + rows.length, 0);
    await page.goto(article);
    await expect(page.locator('#webmentions li[id^="webmention-"]')).toHaveCount(count);
    await expect(page.locator('[data-webmention-form]')).toHaveAttribute('action', receiver);
    await expect(page.locator('[name="target"]')).toHaveValue(canonical);
    await expect(page.getByLabel('URL of your response')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Webmention' })).toBeEnabled();
    await page.route(receiver, async route => {
      await route.fulfill({ status: 202, contentType: 'text/html', body: '<p>Queued by the receiver</p>' });
    });
    await page.getByLabel('URL of your response').fill('https://reader.example/native-reply');
    const [submitted] = await Promise.all([
      page.waitForRequest(request => request.url() === receiver && request.method() === 'POST'),
      page.getByRole('button', { name: 'Send Webmention' }).click({ force: true, noWaitAfter: true }),
    ]);
    const body = new URLSearchParams(submitted.postData() || '');
    expect(body.get('target')).toBe(canonical);
    expect(body.get('source')).toBe('https://reader.example/native-reply');
  });
});
