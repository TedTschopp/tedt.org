import { test, expect } from '@playwright/test';

// Smoke test for Bootstrap navigation on a local tool-details page.
// Preserve the historical URL override for developers testing a specific page.
const LOCAL_URL = process.env.LOCAL_PROMPT_URL || '/tools/plotto/';

test.describe('Navbar dropdown smoke test', () => {
  test('Tools dropdown opens', async ({ page }) => {
    await page.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
    // Wait a tick to ensure bootstrap JS attached
    await page.waitForTimeout(500);
    const trigger = page.locator('button#toolsDropdownToggle');
    await expect(trigger).toBeVisible();
    await trigger.click();
    // After click, the menu (ul.dropdown-menu) associated should be visible
    const menu = page.locator('ul[aria-labelledby="toolsDropdownToggle"]');
    await expect(menu).toBeVisible();
  });
});
