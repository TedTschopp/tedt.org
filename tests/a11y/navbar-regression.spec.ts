import { routeSharedHeader } from './helpers/global-header';
import { test, expect } from '@playwright/test';
for (const path of ['/', '/assessments/', '/profile/']) {
  test(`shared navigation works on ${path}`, async ({ page }) => {
    await routeSharedHeader(page);
    await page.goto(path);
    const header = page.locator('tedt-global-header');
    await expect(header).toHaveAttribute('data-ready', 'true');
    await expect(header.locator('.section-link')).toHaveText(['Essays','Stories & Folklore','Games & Worlds','Tools','Learn','About']);
    const trigger = header.getByRole('button', { name: 'Show Tools menu', exact: true });
    await trigger.click();
    await expect(header.getByRole('link', { name: 'AI Library', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });
}
