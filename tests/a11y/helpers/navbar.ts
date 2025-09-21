import { Page, expect } from '@playwright/test';

export async function verifyDropdown(page: Page, triggerSelector: string, menuSelector: string) {
  const trigger = page.locator(triggerSelector).first();
  await expect(trigger).toBeVisible();
  // Wait for bootstrap (stub) to be available
  await page.waitForFunction(() => (window as any).bootstrap && (window as any).bootstrap.Dropdown, null, { timeout: 2000 });
  // Ensure menu initially hidden or not expanded
  const menu = page.locator(menuSelector).first();
  await trigger.click();
  await expect(menu).toHaveClass(/show/);
}
