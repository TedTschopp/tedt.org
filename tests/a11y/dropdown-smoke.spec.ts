import { test, expect } from '@playwright/test';

// Smoke test for Bootstrap navbar dropdown on a prompt-details page
// Assumes local server at http://127.0.0.1:4000
const LOCAL_URL = process.env.LOCAL_PROMPT_URL || 'http://127.0.0.1:4000/Active-Learning-Teaching-Assistant/';

test.describe('Navbar dropdown smoke test', () => {
  test('Career dropdown opens', async ({ page }) => {
    await page.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
    // Wait a tick to ensure bootstrap JS attached
    await page.waitForTimeout(500);
  const trigger = page.locator('button#careerDropdownToggle');
    await expect(trigger).toBeVisible();
    await trigger.click();
    // After click, the menu (ul.dropdown-menu) associated should be visible
  const menu = page.locator('ul[aria-labelledby="careerDropdownToggle"]');
    await expect(menu).toBeVisible();
  });
});
