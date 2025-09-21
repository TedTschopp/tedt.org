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
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      const trigger = page.locator(careerTrigger).first();
      await expect(trigger).toHaveAttribute('aria-expanded', /false|undefined/);
      await verifyDropdown(page, careerTrigger, careerMenu);
      // After first click it should have aria-expanded true
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      // Escape closes menu
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', /false|undefined/);
      expect(consoleErrors, 'No console errors should occur during dropdown interaction').toHaveLength(0);
    });
  }
});
