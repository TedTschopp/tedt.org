import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const labels = ['Essays', 'Stories & Folklore', 'Games & Worlds', 'Tools', 'Learn', 'About', 'Search', 'Subscribe'];
const isPreview = process.env.PLAYWRIGHT_IA_PREVIEW === '1' || (process.env.PLAYWRIGHT_BASE_URL || '').includes('preview.tedt.org');
const paths = ['/', '/essays/', '/stories/', '/games/', '/tools/', '/learn/', '/about-ted/', '/profile/', '/category/ai/', '/tools/plotto/', '/Gamma-World-Bestiary/Abomination.html', '/assessments/ai-coding-maturity-assessment/', '/assessments/enterprise-ai-maturity-assessment/'];

for (const width of [1440, 390]) {
  for (const path of paths) {
    test(`shared navigation and disclosure on ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      const nav = page.locator('nav[aria-label="Primary"]').first();
      const toggle = nav.locator('.navbar-toggler');
      if (width < 1200) await toggle.click();
      const links = nav.locator('.navbar-nav > .nav-item > a.menu-item');
      expect((await links.allTextContents()).map(t => t.trim())).toEqual(labels);
      if (isPreview) {
        await expect(page.locator('.site-preview-banner')).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      } else {
        await expect(page.locator('.site-preview-banner')).toHaveCount(0);
        await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      }
      const disclosure = nav.locator('#toolsDropdownToggle');
      await disclosure.click();
      await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
      await expect(nav.locator('#toolsDropdownMenu')).toBeVisible();
      await expect(nav.locator('#toolsDropdownMenu')).toContainText('Writing, Text & Code');
      await page.keyboard.press('Escape');
      await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, 'The page should fit the viewport').toBe(false);
    });
  }
}

test('homepage balances interests and does not repeat recent writing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ia-shelf')).toHaveCount(5);
  const urls = await page.locator('.ia-writing-row h3 a').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(urls.length).toBe(6);
  expect(new Set(urls).size).toBe(urls.length);
  await expect(page.locator('.ia-highlight')).toHaveCount(5);
  await page.getByRole('link', { name: 'Plotto — A Story’s Starting Point' }).click();
  await expect(page).toHaveURL(/\/tools\/plotto\//);
  await expect(page.getByRole('link', { name: 'Visit Plotto' })).toHaveAttribute('href', 'https://plotto.tedt.org/');
});

test('tool directory supports purpose search, status filtering, and empty results', async ({ page }) => {
  await page.goto('/tools/');
  const cards = page.locator('.ia-tool-card');
  const original = await cards.count();
  expect(original).toBeGreaterThan(25);
  await page.getByLabel('Search tools', { exact: true }).fill('plotto');
  await expect(page.locator('.ia-tool-card:visible')).toHaveCount(1);
  await expect(page.locator('.ia-tool-card:visible')).toContainText('Under development');
  await page.getByLabel('Development status').selectOption('active');
  await expect(page.locator('#tools-empty')).toBeVisible();
  await page.getByLabel('Search tools', { exact: true }).fill('');
  await page.getByLabel('Development status').selectOption('');
  await expect(page.locator('.ia-tool-card:visible')).toHaveCount(original);
});

test('search finds Plotto and supports bestiary-only searching', async ({ page }) => {
  await page.goto('/search/');
  await page.getByLabel('What are you looking for?').fill('plotto');
  await expect(page.locator('#search-results a').first()).toContainText('Plotto');
  await expect(page.locator('#search-results a').first()).toHaveAttribute('href', '/tools/plotto/');
  await page.getByLabel('Collection', { exact: true }).selectOption('reference');
  await page.getByLabel('What are you looking for?').fill('abomination');
  await expect(page.locator('#search-results a').first()).toContainText('Abomination');
});

for (const path of ['/', '/essays/', '/stories/', '/games/', '/tools/', '/learn/', '/about-ted/', '/search/', '/subscribe/']) {
  for (const theme of ['light', 'dark']) {
    test(`accessible main content and navigation: ${path} in ${theme}`, async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem('color-scheme', value), theme);
      await page.goto(path);
      await expect(page.locator('.library-main')).toHaveCount(1);
      const audit = new AxeBuilder({ page }).include('.library-main').include('.ia-navbar');
      if (isPreview) audit.include('.site-preview-banner');
      const result = await audit.analyze();
      expect(result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    });
  }
}
