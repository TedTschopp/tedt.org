import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const experiments = [
  'trust-machine', 'equilibrium-explorer', 'coordination-trap', 'mixed-strategy', 'credible-threat', 'traffic-paradox',
  'public-goods', 'last-fish', 'bargaining-room', 'auction-lab', 'signaling-game', 'expectations-game',
  'common-knowledge', 'evolution-arena', 'correlation-experiment', 'stable-matching', 'coalition-calculator',
  'voting-lab', 'incentive-designer', 'mechanism-design'
];

for (const slug of ['', ...experiments]) {
  test(`playground ${slug || 'collection'}: responsive, accessible, and shareable`, async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(`/game-theory/${slug ? slug + '/' : ''}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveCount(1);
    const hero = page.locator('.gt-hero-image img').first();
    await expect(hero).toBeVisible();
    await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(hero).toHaveAttribute('srcset', /480w.*768w.*1200w.*1456w/);
    if (slug) {
      await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
      await expect(page.locator('.gt-math-beginner')).toBeVisible();
      await expect(page.locator('script[src*="mathjax@3/"]')).toHaveCount(1);
      await page.waitForFunction(() => Boolean((window as any).MathJax?.startup?.promise));
      await page.evaluate(async () => { await (window as any).MathJax.startup.promise; });
      const expert = page.locator('.gt-expert');
      await expert.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(expert).toHaveAttribute('open', '');
      await expect(expert.locator('mjx-container[jax="SVG"]').first()).toBeVisible();
      expect(await page.locator('.gt-equation mjx-container[jax="SVG"]').count()).toBe(await page.locator('.gt-equation').count());
      await expect(page.locator('[data-mjx-error], mjx-merror, [data-mml-node="merror"]')).toHaveCount(0);
    } else {
      await expect(page.locator('script[src*="mathjax@3/"]')).toHaveCount(0);
    }
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.setAttribute('data-bs-theme', theme), theme);
      await page.setViewportSize({ width: 1280, height: 900 });
      if (slug) {
        const heroWidth = await hero.evaluate(image => image.getBoundingClientRect().width);
        expect(heroWidth, 'full-width page hero').toBeGreaterThan(1100);
      }
      const results = await new AxeBuilder({ page }).include('#gt-main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, `${theme} accessibility`).toEqual([]);
      await page.setViewportSize({ width: 390, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} mobile overflow`).toBe(true);
      for (const table of await page.locator('.gt-table-wrap').all()) {
        const overflows = await table.evaluate(element => element.scrollWidth > element.clientWidth + 1);
        if (overflows) {
          await expect(table).toHaveAttribute('tabindex', '0');
          await expect(table).toHaveAttribute('aria-label', /scroll/i);
          await table.focus();
          await table.evaluate(element => { element.scrollLeft = 0; });
          const before = await table.evaluate(element => element.scrollLeft);
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => table.evaluate(element => element.scrollLeft)).toBeGreaterThan(before);
        }
      }
    }
    if (slug) {
      await page.locator('#gt-share').click();
      const link = await page.locator('#gt-share-url').inputValue();
      const settings = await page.locator('[data-setting]').evaluateAll(elements => elements.map(element => {
        const control = element as HTMLInputElement;
        return [control.id, control.type === 'checkbox' ? String(control.checked) : control.value];
      }));
      for (const [key, value] of settings) expect(new URL(link).searchParams.get(key)).toBe(value);
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
      for (const [key, value] of settings) {
        const actual = await page.locator(`#${key}`).evaluate((element: HTMLInputElement) => element.type === 'checkbox' ? String(element.checked) : element.value);
        expect(actual, key).toBe(value);
      }
      await page.locator('#gt-reset').click();
      await expect(page.locator('#gt-status')).toContainText('Restarted');
    } else {
      await expect(page.locator('.gt-card')).toHaveCount(experiments.length);
      await expect(page.locator('.gt-card-link')).toHaveCount(experiments.length);
    }
    expect(failures).toEqual([]);
  });
}

test('math guide renders symbols and supports readable keyboard navigation on small screens', async ({ page }) => {
  await page.goto('/game-theory/');
  await page.getByRole('link', { name: 'Math Symbols, in Plain English guide', exact: true }).click();
  await expect(page).toHaveURL(/\/math-guide\/$/);
  await page.waitForFunction(() => Boolean((window as any).MathJax?.startup?.promise));
  await page.evaluate(async () => { await (window as any).MathJax.startup.promise; });
  await expect(page.locator('[data-mjx-error], mjx-merror, [data-mml-node="merror"]')).toHaveCount(0);
  const sumsLink = page.getByRole('link', { name: 'The large Σ: adding a list', exact: true });
  await sumsLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#sums$/);
  await expect(page.locator('#guide-sums-title')).toBeInViewport();
  await expect(page.locator('#sums mjx-container[jax="SVG"]').first()).toBeVisible();
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.setAttribute('data-bs-theme', theme), theme);
    const results = await new AxeBuilder({ page }).include('#gt-main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, `${theme} math guide accessibility`).toEqual([]);
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} guide mobile overflow`).toBe(true);
  }
});

test('equilibrium reveals incentives, unilateral escape, and no pure equilibrium', async ({ page }) => {
  await page.goto('/game-theory/equilibrium-explorer/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#equilibrium-play').click();
  await expect(page.locator('#equilibrium-result')).toContainText('combined 6');
  await page.locator('#equilibrium-switch-row').click();
  await expect(page.locator('#equilibrium-result')).toContainText('row player 5');
  await page.locator('#equilibrium-switch-column').click();
  await expect(page.locator('#equilibrium-result')).toContainText('This is a Nash equilibrium');
  await page.locator('#equilibrium-preset').selectOption('matching');
  await page.locator('#equilibrium-play').click();
  await expect(page.locator('#equilibrium-summary')).toContainText('no pure Nash equilibrium');
  await page.goto('/game-theory/equilibrium-explorer/?equilibrium-preset=matching');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#equilibrium-play').click();
  await expect(page.locator('#equilibrium-summary')).toContainText('no pure Nash equilibrium');
});

test('coordination makes the individual cost visible and bounds invalid inputs', async ({ page }) => {
  await page.goto('/game-theory/coordination-trap/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#coord-prediction').selectOption({ index: 1 });
  await page.locator('[data-coord-choice="adopt"]').click();
  await expect(page.locator('#coord-teams')).toContainText('-6');
  await page.locator('#coord-cost').fill('10000');
  await page.locator('#coord-cost').blur();
  await expect(page.locator('#coord-cost')).toHaveValue('30');
});

test('credible commitment changes the response to market entry', async ({ page }) => {
  await page.goto('/game-theory/credible-threat/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#threat-prediction').selectOption({ index: 1 });
  await page.locator('[data-threat-enter]').click();
  await expect(page.locator('[data-threat-result]')).toContainText('share');
  await page.locator('#threat-deposit').fill('6');
  await page.locator('#threat-deposit').blur();
  await page.locator('#threat-prediction').selectOption({ index: 1 });
  await page.locator('[data-threat-enter]').click();
  await expect(page.locator('[data-threat-result]')).toContainText('fight');
});

test('the collection and model explanations remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/game-theory/');
  await expect(page.locator('.gt-card-link')).toHaveCount(experiments.length);
  await page.goto('/game-theory/traffic-paradox/');
  await expect(page.locator('#gt-main noscript p')).toContainText('Turn on JavaScript');
  await expect(page.locator('#gt-assumptions')).toBeVisible();
  await context.close();
});

test('trust replays choices and runs a repeatable tournament', async ({ page }) => {
  await page.goto('/game-theory/trust-machine/?trust-mistakes=20&trust-seed=98');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#trust-cooperate').click();
  await page.locator('#trust-defect').click();
  const history = await page.locator('#trust-history').textContent();
  await page.locator('#gt-reset').click();
  await page.locator('#trust-cooperate').click();
  await page.locator('#trust-defect').click();
  await expect(page.locator('#trust-history')).toHaveText(history!);
  await page.locator('#trust-tournament-run').click();
  await expect(page.locator('#trust-tournament-results tr')).toHaveCount(6);
  const tournament = await page.locator('#trust-tournament-results').textContent();
  await page.locator('#trust-tournament-run').click();
  await expect(page.locator('#trust-tournament-results')).toHaveText(tournament!);
});

test('mixed play commits opponent moves and compares seeded mixtures', async ({ page }) => {
  await page.goto('/game-theory/mixed-strategy/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#mixed-prediction').selectOption({ index: 1 });
  for (let round = 0; round < 6; round++) await page.locator('[data-mixed-move="0"]').click();
  await expect(page.locator('#mixed-history li')).toHaveCount(6);
  await page.locator('#mixed-run').click();
  await expect(page.locator('#mixed-batch-rows tr')).toHaveCount(2);
  const result = await page.locator('#mixed-batch-rows').textContent();
  await page.locator('#mixed-run').click();
  await expect(page.locator('#mixed-batch-rows')).toHaveText(result!);
  for (const move of ['rock', 'paper', 'scissors']) { await page.locator(`#mixed-${move}`).fill('0'); await page.locator(`#mixed-${move}`).blur(); }
  await expect(page.locator('#mixed-run')).toBeDisabled();
});

test('traffic shows the paradox and a toll supports the coordinated allocation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/game-theory/traffic-paradox/');
  await expect(page.locator('#gt-experiment')).toHaveAttribute('data-ready', 'true');
  await page.locator('#traffic-prediction').selectOption({ index: 1 });
  await page.locator('[data-traffic-choose-shortcut]').click();
  await expect(page.locator('[data-traffic-equilibrium-time]')).toContainText('80');
  await expect(page.locator('[data-traffic-optimum-time]')).toContainText('64.69');
  await expect(page.locator('.gt-network')).not.toHaveClass(/is-running/);
  await page.locator('[data-traffic-coordinating-toll]').click();
  await expect(page.locator('#traffic-toll')).toHaveValue('22.5');
  await page.locator('#traffic-prediction').selectOption({ index: 1 });
  await page.locator('[data-traffic-choose-top]').click();
  await expect(page.locator('[data-traffic-equilibrium-time]')).toContainText('64.69');
  await page.locator('#traffic-open').selectOption('closed');
  await expect(page.locator('[data-traffic-choose-shortcut]')).toBeDisabled();
});
