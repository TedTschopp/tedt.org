import { test, expect } from '@playwright/test';

async function openExplorer(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/inside-ai/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByTestId('diagram-output-count')).toHaveAttribute('data-retained', '5');
}

async function setSamplingValue(page, value: number) {
  await page.getByTestId('sampling-value').fill(String(value));
  await page.getByTestId('sampling-value').press('Tab');
}

async function expectMatchingOutput(page, rows: number) {
  const content = page.locator('#inside-ai-app .softmax.step > .content');
  await expect(content.locator('.first-column .text-box')).toHaveCount(rows);
  await expect(content.locator('.probability-col g.probability')).toHaveCount(rows);
  await expect(page.getByTestId('diagram-output-count')).toHaveAttribute('data-shown', String(rows));
  await expect(page.locator('.ia-probability-table tbody tr')).toHaveCount(50);
  await expect.poll(() => page.evaluate(() => {
    const content = document.querySelector('#inside-ai-app .softmax.step > .content');
    const vocab = content.querySelector('.vocab').getBoundingClientRect();
    const tokens = content.querySelector('.first-column .token-string').getBoundingClientRect();
    const bars = content.querySelector('.probability-col svg').getBoundingClientRect();
    const origin = document.querySelector('#inside-ai-app .main-section').getBoundingClientRect();
    const path = document.querySelector('#inside-ai-app g.softmax path').getAttribute('d');
    const coordinates = path.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi).map(Number);
    return Math.max(
      Math.abs(vocab.height - tokens.height),
      Math.abs(vocab.height - bars.height),
      Math.abs(coordinates[6] - (vocab.left - origin.left)),
      Math.abs(coordinates[7] - (vocab.top - origin.top)),
      Math.abs(coordinates[8] - (vocab.left - origin.left)),
      Math.abs(coordinates[9] - (vocab.bottom - origin.top)),
    );
  }), { message: 'Logits fan endpoints, word list, and probability bars must share the dynamic height' }).toBeLessThan(1);
  const height = await content.evaluate(element => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(448.1);
  const sum = Number(await page.getByTestId('numerical-output').getAttribute('data-probability-sum'));
  expect(Math.abs(sum - 1)).toBeLessThan(1e-10);
}

test('top-k rows and the logits fan resize together, with an explicit bounded display window', async ({ page }) => {
  await openExplorer(page);
  for (const k of [1, 3, 12, 50, 50257]) {
    await setSamplingValue(page, k);
    await expect(page.getByTestId('diagram-output-count')).toHaveAttribute('data-retained', String(k));
    await expectMatchingOutput(page, Math.min(k, 15));
  }
  for (const limit of [5, 10, 15]) {
    await page.getByTestId('diagram-row-limit').selectOption(String(limit));
    await expectMatchingOutput(page, limit);
    await expect(page.getByRole('button', { name: 'Expand probabilities', exact: true })).toHaveAttribute('aria-pressed', 'false');
  }
  await page.getByRole('button', { name: 'Expand probabilities', exact: true }).click();
  await setSamplingValue(page, 3);
  await expectMatchingOutput(page, 3);
  await expect(page.locator('.softmax.step .vector-box.logits .text-box')).toHaveCount(3);
  await page.getByTestId('diagram-row-limit').focus();
  await page.getByTestId('diagram-row-limit').press('Tab');
  await expect(page.getByRole('button', { name: 'Expand probabilities', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Leading 50 candidates and logits', exact: true }).click();
  await expect(page).toHaveURL(/#ia-next-heading$/);
});

test('top-p derives visible rows from the changing cutoff and remains compact across screens', async ({ page }) => {
  await openExplorer(page);
  await page.getByTestId('sampling-mode').selectOption('top-p');
  const counts = [];
  for (const p of [0.01, 0.1, 0.5, 0.9, 1]) {
    await setSamplingValue(page, p);
    await expect.poll(async () => Number(await page.getByTestId('diagram-output-count').getAttribute('data-retained'))).toBeGreaterThan(0);
    const retained = Number(await page.getByTestId('diagram-output-count').getAttribute('data-retained'));
    counts.push(retained);
    await expectMatchingOutput(page, Math.min(retained, 15));
  }
  expect(counts[0]).toBe(1);
  expect(new Set(counts).size).toBeGreaterThan(2);
  expect(counts).toEqual([...counts].sort((a, b) => a - b));
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expectMatchingOutput(page, 15);
    await expect.poll(() => page.locator('.ia-diagram-scroll').evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1);
  }
});
