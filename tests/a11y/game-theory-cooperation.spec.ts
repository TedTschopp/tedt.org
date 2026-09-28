import { test, expect } from '@playwright/test';

test('public goods reuses your previous contribution and resets on rule changes', async ({ page }) => {
  await page.goto('/game-theory/public-goods/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#public-prediction').selectOption('loss');
  await page.locator('#public-contribution').fill('6');
  await page.locator('[data-public-play]').click();
  await expect(page.locator('[data-public-result]')).toContainText('14.5');
  await expect(page.locator('[data-public-context]')).toContainText('each other player contributes 6');
  await page.locator('[data-public-play]').click();
  await expect(page.locator('[data-public-history] tr')).toHaveCount(2);
  await page.locator('#public-matching').fill('100'); await page.locator('#public-matching').blur();
  await expect(page.locator('[data-public-history] tr')).toHaveCount(0);
});

test('unrestricted overharvesting empties the lake and enforcement prevents it', async ({ page }) => {
  await page.goto('/game-theory/last-fish/?fish-other=20');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#fish-prediction').selectOption('shrink'); await page.locator('#fish-harvest').fill('20');
  await page.locator('[data-fish-play]').click();
  await expect(page.locator('[data-fish-stock]')).toHaveText('0'); await expect(page.locator('[data-fish-play]')).toBeDisabled();
  await page.locator('#fish-monitoring').fill('100'); await page.locator('#fish-monitoring').blur();
  await page.locator('#fish-prediction').selectOption('grow'); await page.locator('[data-fish-play]').click();
  await expect(page.locator('[data-fish-stock]')).toHaveText('84');
});

test('bargaining supports a counteroffer and ultimatum rejection', async ({ page }) => {
  await page.goto('/game-theory/bargaining-room/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#bargain-prediction').selectOption('reject'); await page.locator('#bargain-amount').fill('10');
  await page.locator('[data-bargain-offer]').click();
  await expect(page.locator('[data-bargain-accept]')).toBeEnabled(); await page.locator('[data-bargain-accept]').click();
  await expect(page.locator('[data-bargain-result]')).toContainText('Your value: 20');
  await page.locator('#bargain-mode').selectOption('ultimatum');
  await page.locator('#bargain-prediction').selectOption('reject'); await page.locator('[data-bargain-offer]').click();
  await expect(page.locator('[data-bargain-result]')).toContainText('you earn 0');
});

test('auction reveals bids, preserves the item across rules, and repeats batches', async ({ page }) => {
  await page.goto('/game-theory/auction-lab/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#auction-prediction').selectOption('loss'); await page.locator('#auction-bid').fill('200');
  await page.locator('[data-auction-play]').click();
  await expect(page.locator('[data-auction-result]')).toContainText('pays 200');
  await expect(page.locator('[data-auction-rows] tr')).toHaveCount(4);
  await page.locator('#auction-rule').selectOption('second');
  await page.locator('#auction-prediction').selectOption('loss'); await page.locator('[data-auction-play]').click();
  await expect(page.locator('[data-auction-result]')).not.toContainText('pays 200');
  await page.locator('[data-auction-run]').click(); const result = await page.locator('[data-auction-batch]').textContent();
  await page.locator('[data-auction-run]').click(); await expect(page.locator('[data-auction-batch]')).toHaveText(result!);
});

test('signaling distinguishes assumed quality from a pattern sellers want to break', async ({ page }) => {
  await page.goto('/game-theory/signaling-game/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-signal-analysis]')).toContainText('Neither type gains');
  await page.locator('#signal-badCost').fill('0'); await page.locator('#signal-badCost').blur();
  await expect(page.locator('[data-signal-analysis]')).toContainText('not supported');
  await page.locator('#signal-prediction').selectOption('good'); await page.locator('[data-signal-buy]').click();
  await expect(page.locator('[data-signal-result]')).toContainText('profitable change');
  await page.locator('#signal-pattern').selectOption('pool');
  await expect(page.locator('[data-signal-observation]')).toContainText('50%');
});
