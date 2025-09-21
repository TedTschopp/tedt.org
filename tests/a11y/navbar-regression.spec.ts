import { test } from '@playwright/test';
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
const careerTrigger = 'a#navbarDarkDropdownMenuLink';
const careerMenu = 'ul[aria-labelledby="navbarDarkDropdownMenuLink"]';

test.describe('Navbar dropdown regression', () => {
  for (const path of pages) {
    test(`dropdown works on ${path}`, async ({ page }) => {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);
      await verifyDropdown(page, careerTrigger, careerMenu);
    });
  }
});
