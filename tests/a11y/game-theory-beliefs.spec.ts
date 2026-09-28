import { test, expect } from '@playwright/test';

test('expectations scoring includes the visitor and learning changes the next round', async ({ page }) => {
  await page.goto('/game-theory/expectations-game/?expect-population=0&expect-learning=50');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#expect-prediction').selectOption('middle');
  await page.locator('#expect-choice').fill('30');
  await page.locator('[data-expect-play]').click();
  await expect(page.locator('[data-expect-result]')).toContainText('group average is 49');
  await expect(page.locator('[data-expect-result]')).toContainText('You earn 100');
  await expect(page.locator('[data-expect-population]')).toContainText('41.33');
  await page.locator('[data-expect-play]').click();
  await expect(page.locator('[data-expect-history] tr')).toHaveCount(2);
  await page.locator('#gt-reset').click();
  await expect(page.locator('[data-expect-history] tr')).toHaveCount(0);
});

test('private acknowledgments add levels while only the public channel gives common knowledge', async ({ page }) => {
  await page.goto('/game-theory/common-knowledge/?knowledge-delivery=99&knowledge-seed=42');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('[data-knowledge-send]').click();
  await page.locator('[data-knowledge-send]').click();
  await expect(page.locator('[data-knowledge-summary]')).toContainText('2 private messages delivered');
  await expect(page.locator('[data-knowledge-summary]')).toContainText('Common knowledge: no');
  await page.locator('#knowledge-prediction').selectOption('both');
  await page.locator('[data-knowledge-go]').click();
  await expect(page.locator('[data-knowledge-result]')).toContainText('combined points: 8');
  await page.locator('[data-knowledge-announce]').click();
  await expect(page.locator('[data-knowledge-summary]')).toContainText('common knowledge under that ideal assumption');
  await expect(page.locator('[data-knowledge-send]')).toBeDisabled();
});

test('evolution invasion changes the population and reset restores the starting mix', async ({ page }) => {
  await page.goto('/game-theory/evolution-arena/?evolution-initial=0');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#evolution-prediction').selectOption('hawk');
  await page.locator('[data-evolution-invade]').click();
  await expect(page.locator('[data-evolution-result]')).toContainText('from 0% to 2%');
  await expect(page.locator('[data-evolution-result]')).toContainText('Hawk becomes more common');
  await expect(page.locator('[data-evolution-history] tr')).toHaveCount(2);
  await page.locator('#gt-reset').click();
  await expect(page.locator('[data-evolution-population]')).toContainText('Generation 0: 0% Hawk');
});

test('advice distinguishes stable recommendations from a tempting both-wait rule', async ({ page }) => {
  await page.goto('/game-theory/correlation-experiment/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-advice-summary]')).toContainText('this is a correlated equilibrium');
  await page.locator('#advice-prediction').selectOption('stable');
  await page.locator('[data-advice-follow]').click();
  await expect(page.locator('[data-advice-result]')).toContainText('Your prediction matches');
  for (const id of ['advice-wg', 'advice-gw']) { await page.locator(`#${id}`).fill('0'); await page.locator(`#${id}`).blur(); }
  await expect(page.locator('[data-advice-summary]')).toContainText('not a correlated equilibrium');
  await page.locator('#advice-prediction').selectOption('temptation');
  await page.locator('[data-advice-change]').click();
  await expect(page.locator('[data-advice-result]')).toContainText('You earn 5');
  await page.locator('#advice-ww').fill('0'); await page.locator('#advice-ww').blur();
  await expect(page.locator('[data-advice-follow]')).toBeDisabled();
  await expect(page.locator('[data-advice-result]')).toContainText('weight above zero');
});
