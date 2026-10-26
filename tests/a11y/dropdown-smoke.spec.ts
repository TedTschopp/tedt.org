import { test, expect } from '@playwright/test';

// Prompt URLs now forward to the AI Library. Check the shared site navbar on
// the profile page, using Playwright's configured baseURL.
const LOCAL_URL = process.env.LOCAL_NAVBAR_URL || '/profile/';

test.describe('Navbar dropdown smoke test', () => {
  test('Career dropdown opens', async ({ page }) => {
    await page.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('button#careerDropdownToggle');
    await expect(trigger).toBeVisible();
    await trigger.click();
    // After click, the menu (ul.dropdown-menu) associated should be visible
  const menu = page.locator('ul[aria-labelledby="careerDropdownToggle"]');
    await expect(menu).toBeVisible();
  });
});
