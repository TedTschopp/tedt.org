import { routeSharedHeader } from './helpers/global-header';
import { test, expect } from '@playwright/test';
test('About disclosure retains profile and career destinations', async ({ page }) => {
  await routeSharedHeader(page);
    await page.goto('/profile/');
  const header = page.locator('tedt-global-header');
  await expect(header).toHaveAttribute('data-ready', 'true');
  await header.getByRole('button', { name: 'Show About menu', exact: true }).click();
  await expect(header.getByRole('link', { name: 'Career & Resume', exact: true })).toBeVisible();
});
