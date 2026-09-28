import { test, expect } from '@playwright/test';

async function open(page: any, slug: string) {
  await page.goto(`/game-theory/${slug}/`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
}

test('stable matching steps through offers, reverses proposer advantage, and checks manual matches', async ({ page }) => {
  await open(page, 'stable-matching');
  await page.locator('#match-prediction').selectOption('1');
  await page.locator('#match-step').click();
  await expect(page.locator('#match-log li')).toHaveCount(1);
  await page.locator('#match-finish').click();
  await expect(page.locator('#match-result')).toContainText('you get choice 1');
  await expect(page.locator('#match-blocking')).toContainText('Stable assignment');
  await page.locator('#match-side').selectOption('teams');
  await page.locator('#match-prediction').selectOption('2');
  await page.locator('#match-finish').click();
  await expect(page.locator('#match-result')).toContainText('you get choice 2');
  await page.locator('#match-manual').selectOption('210');
  await page.locator('#match-inspect').click();
  await expect(page.locator('#match-blocking')).toContainText('not stable');
});

test('coalition calculator shows exact joining orders and profitable subgroup departure', async ({ page }) => {
  await open(page, 'coalition-calculator');
  await page.locator('#coalition-prediction').selectOption('leave');
  await page.locator('#coalition-allocate').click();
  await expect(page.locator('#coalition-result')).toContainText('A and receive 5');
  await expect(page.locator('#coalition-objections')).toContainText('A and B receive 10');
  await expect(page.locator('#coalition-orders li')).toHaveCount(6);
  await page.locator('#coalition-rule').selectOption('equal');
  await page.locator('#coalition-prediction').selectOption('leave');
  await page.locator('#coalition-allocate').click();
  await expect(page.locator('#coalition-result')).toContainText('A and receive 4');
});

test('voting preserves genuine preferences when the submitted ballot changes', async ({ page }) => {
  await open(page, 'voting-lab');
  await page.locator('#vote-prediction').selectOption('A');
  await page.locator('#vote-cast').click();
  await expect(page.locator('#vote-result')).toContainText('Plurality result: A');
  await page.locator('#vote-honest').uncheck();
  await page.locator('#vote-prediction').selectOption('B');
  await page.locator('#vote-cast').click();
  await expect(page.locator('#vote-result')).toContainText('Plurality result: B');
  await expect(page.locator('#vote-result')).toContainText('B is your genuine choice 2');
  await expect(page.locator('#vote-rank0')).toHaveValue('ABCD');
  await expect(page.locator('#vote-comparison tr')).toHaveCount(4);
  await page.locator('#vote-candidates').selectOption('4');
  await page.locator('#vote-prediction').selectOption('B');
  await page.locator('#vote-cast').click();
  await expect(page.locator('#vote-pairs li')).toHaveCount(6);
});

test('employee incentives change when actual customer value is rewarded', async ({ page }) => {
  await open(page, 'incentive-designer');
  await page.locator('#incentive-prediction').selectOption('rush');
  await page.locator('#incentive-action').selectOption('rush');
  await page.locator('#incentive-work').click();
  await expect(page.locator('#incentive-result')).toContainText('maximizes your personal score');
  await expect(page.locator('#incentive-result')).toContainText('organization’s is -2.8');
  await page.locator('#incentive-contract').selectOption('value');
  await page.locator('#incentive-prediction').selectOption('careful');
  await page.locator('#incentive-action').selectOption('careful');
  await page.locator('#incentive-work').click();
  await expect(page.locator('#incentive-result')).toContainText('maximizes your personal score');
  await expect(page.locator('#incentive-rows tr')).toHaveCount(4);
});

test('free priority rewards exaggeration while the same report loses points in an auction', async ({ page }) => {
  await open(page, 'mechanism-design');
  await page.locator('#mechanism-report0').fill('11');
  await page.locator('#mechanism-report0').blur();
  await page.locator('#mechanism-prediction').selectOption('0');
  await page.locator('#mechanism-allocate').click();
  await expect(page.locator('#mechanism-result')).toContainText('Your score is 7');
  await page.locator('#mechanism-rule').selectOption('auction');
  await page.locator('#mechanism-prediction').selectOption('0');
  await page.locator('#mechanism-allocate').click();
  await expect(page.locator('#mechanism-result')).toContainText('Your score is -3');
  await expect(page.locator('#mechanism-result')).toContainText('Participants plus the organizer receive 7');
  await page.locator('#mechanism-batch').click();
  const runs = await page.locator('#mechanism-batch-result').textContent();
  await page.locator('#mechanism-batch').click();
  await expect(page.locator('#mechanism-batch-result')).toHaveText(runs!);
});
