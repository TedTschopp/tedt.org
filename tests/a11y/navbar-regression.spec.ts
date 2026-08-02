import { expect } from '@playwright/test';
import { consoleErrorsFixture } from './helpers/console';
import { verifyDropdown } from './helpers/navbar';

// Hardening test: validates that navbar dropdown works across representative pages.
// Pages list can be extended; use PROD_BASE or default to local Jekyll dev.
const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';
const pages = [
  '/',
  '/prompts/',
  // Prompt pages use /prompts/:slug/ per _config.yml defaults
  '/prompts/business-case-and-requirements-assistant/',
  '/assessments/',
  '/assessments/ai-coding-maturity-assessment/',
  '/assessments/enterprise-ai-maturity-assessment/',
];
const responsiveAssessmentPages = [
  '/assessments/',
  '/assessments/ai-coding-maturity-assessment/',
  '/assessments/enterprise-ai-maturity-assessment/',
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
      const response = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      expect(response, `${path} should return an HTTP response`).not.toBeNull();
      expect(response?.ok(), `${path} should load successfully`).toBeTruthy();
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

      const assessmentsItem = page.locator(
        'nav[aria-label="Primary"] a[href$="/assessments/"], ' +
        'nav[aria-label="Primary"] button[data-href$="/assessments/"]'
      ).first();
      await expect(assessmentsItem).toBeVisible();
      await expect(assessmentsItem).toContainText('Assessments');

      const primaryNavigationText = await page.locator('nav[aria-label="Primary"]').innerText();
      expect(primaryNavigationText).not.toMatch(/(?:\bAlpha\b|\bBeta\b|\bGamma\b|α|β|γ)/i);
      await expect(page.locator('nav[aria-label="Primary"] .stage-badge')).toHaveCount(0);

      // Regression: all top-level nav links must remain uniform, accessible touch targets.
      const navItems = page.locator('nav[aria-label="Primary"] .navbar-nav > .nav-item > .nav-link.menu-item');
      const count = await navItems.count();
      expect(count, 'Primary navigation should expose top-level links').toBeGreaterThan(0);
      const heights: number[] = [];
      for (let i = 0; i < count; i++) {
        const box = await navItems.nth(i).boundingBox();
        expect(box, `Nav item at index ${i} should have a bounding box`).not.toBeNull();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(43);
          heights.push(box.height);
        }
      }
      for (const height of heights.slice(1)) {
        expect(Math.abs(height - heights[0])).toBeLessThanOrEqual(1);
      }
      if (consoleErrors.length > 0 || failedRequests.length > 0) {
        console.log('Network/Console diagnostics for', path, { consoleErrors, failedRequests });
      }
      expect(consoleErrors, 'No console errors should occur during dropdown interaction').toHaveLength(0);
    });
  }

  for (const path of responsiveAssessmentPages) {
    for (const width of [992, 1024, 1200]) {
      consoleErrorsFixture(`navigation fits ${path} at ${width}px`, async ({ page, consoleErrors }) => {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
        expect(response?.ok(), `${path} should load successfully`).toBeTruthy();

        const nav = page.locator('nav[aria-label="Primary"]').first();
        const toggler = nav.locator('.navbar-toggler').first();
        const collapse = nav.locator('.navbar-collapse').first();

        if (width < 1200) {
          await expect(toggler).toBeVisible();
          await expect(toggler).toHaveAttribute('aria-expanded', 'false');
          await toggler.click();
          await expect(toggler).toHaveAttribute('aria-expanded', 'true');
          await expect(collapse).toBeVisible();
        } else {
          await expect(toggler).toBeHidden();
          await expect(collapse).toBeVisible();
        }

        const outsideViewport = await nav.locator('.navbar-nav > .nav-item').evaluateAll(items =>
          items
            .filter(item => {
              const style = getComputedStyle(item);
              const rect = item.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            })
            .filter(item => {
              const rect = item.getBoundingClientRect();
              return rect.left < 0 || rect.right > window.innerWidth;
            })
            .map(item => item.textContent?.trim().replace(/\s+/g, ' ') || 'unnamed item')
        );
        expect(outsideViewport, 'Visible navigation items must stay inside the viewport').toEqual([]);
        expect(consoleErrors, 'No console errors should occur during responsive navigation').toHaveLength(0);
      });
    }
  }
});
