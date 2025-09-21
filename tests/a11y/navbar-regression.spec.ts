import { expect } from '@playwright/test';
import { consoleErrorsFixture } from './helpers/console';
import { verifyDropdown } from './helpers/navbar';

// Hardening test: validates that navbar dropdown works across representative pages.
// Pages list can be extended; use PROD_BASE or default to local Jekyll dev.
const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';
const pages = [
  '/',
  '/prompts/',
  '/Active-Learning-Teaching-Assistant/',
];

// Selectors based on existing markup
const careerTrigger = 'button#careerDropdownToggle';
const careerMenu = 'ul[aria-labelledby="careerDropdownToggle"]';

consoleErrorsFixture.describe('Navbar dropdown regression', () => {
  for (const path of pages) {
    consoleErrorsFixture(`dropdown works on ${path}`, async ({ page, consoleErrors }) => {
      const failedRequests: { url: string; status: number | null; method: string; }[] = [];
      page.on('requestfailed', req => {
        failedRequests.push({ url: req.url(), status: null, method: req.method() });
      });
      page.on('response', async resp => {
        try {
          const status = resp.status();
          if (status === 403 || status === 404) {
            failedRequests.push({ url: resp.url(), status, method: resp.request().method() });
          }
        } catch { /* ignore */ }
      });
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
  const trigger = page.locator(careerTrigger).first();
  await expect(trigger).toBeVisible();
  // Initial state
  await expect(trigger).toHaveAttribute('aria-expanded', /false|undefined/);
  // Open
  await verifyDropdown(page, careerTrigger, careerMenu);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  // Close via Escape
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', /false|undefined/);
      // Regression: all top-level nav items must retain uniform 44px height (accessible touch target)
      const navItems = page.locator('nav[aria-label="Primary"] .navbar-nav > li > .nav-link.menu-item');
      const count = await navItems.count();
      for (let i = 0; i < count; i++) {
        const box = await navItems.nth(i).boundingBox();
        expect(box, `Nav item at index ${i} should have a bounding box`).not.toBeNull();
        if (box) {
          // Allow ±1px due to potential sub-pixel rounding / DPI scaling
            expect(box.height).toBeGreaterThanOrEqual(43);
            expect(box.height).toBeLessThanOrEqual(45);
        }
      }
      if (consoleErrors.length > 0 || failedRequests.length > 0) {
        console.log('Network/Console diagnostics for', path, { consoleErrors, failedRequests });
      }
      expect(consoleErrors, 'No console errors should occur during dropdown interaction').toHaveLength(0);
    });
  }
});
