import { Page, expect } from '@playwright/test';

export async function verifyDropdown(page: Page, triggerSelector: string, menuSelector: string) {
  const trigger = page.locator(triggerSelector).first();
  await expect(trigger).toBeVisible();
  // Ensure menu initially hidden or not expanded
  const menu = page.locator(menuSelector).first();
  await trigger.click();
  await expect(menu).toBeVisible();
}
