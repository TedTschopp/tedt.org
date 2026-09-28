import { test, expect } from '@playwright/test';

test('probability explanation handles a sampled token beyond the displayed candidates', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/inside-ai/');
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');

  // Force a draw in the distribution's tail only in this isolated test page.
  await page.evaluate(() => { Math.random = () => 0.9999999; });
  await page.getByTestId('sampling-mode').selectOption('top-p');
  await page.getByTestId('sampling-value').fill('1');
  await page.getByTestId('sampling-value').blur();
  await page.getByRole('button', { name: 'Expand probabilities', exact: true }).click();

  const title = page.locator('#inside-ai-app .softmax-popover-title');
  const selectedToken = title.locator('.highlight');
  await expect(title).toBeVisible();
  await expect(selectedToken).toHaveText(/".+"/s);
  await expect(selectedToken).not.toHaveText(/undefined/);
  // Reducing the visible rows must not erase the sampled token's explanation.
  await page.getByTestId('diagram-row-limit').selectOption('5');
  await expect(selectedToken).toHaveText(/".+"/s);
  await expect(title).toContainText('being sampled');
  expect(errors).toEqual([]);
});
