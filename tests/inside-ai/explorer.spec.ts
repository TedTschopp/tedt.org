import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve, basename } from 'node:path';

const modelPattern = '**/inside-ai-models/**';

async function openExplorer(page) {
  await page.goto('/inside-ai/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByTestId('numerical-output')).toBeVisible();
}

test('recorded examples and all layers/heads work without requesting the model', async ({ page }) => {
  const modelRequests: string[] = [];
  const errors: string[] = [];
  page.on('request', request => { if (request.url().includes('/inside-ai-models/')) modelRequests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await openExplorer(page);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://tedt.org/inside-ai/');
  const examples = page.getByTestId('example-select');
  await expect(examples.locator('option')).toHaveCount(5);
  for (let index = 0; index < 5; index++) {
    await examples.selectOption({ index });
    await expect(page.getByTestId('evidence-mode')).toContainText(/recorded/i);
    await expect(page.getByTestId('numerical-output')).not.toBeEmpty();
  }
  await expect(page.getByTestId('layer-select').locator('option')).toHaveCount(12);
  await expect(page.getByTestId('head-select').locator('option')).toHaveCount(12);
  await page.getByTestId('layer-select').selectOption({ index: 11 });
  await page.getByTestId('head-select').selectOption({ index: 11 });
  await expect(page.getByTestId('attention-table').locator('caption')).toContainText('block 12, head 12');
  await page.getByTestId('reset-example').click();
  await expect(page.getByTestId('layer-select')).toHaveValue('0');
  await expect(page.getByTestId('head-select')).toHaveValue('0');
  await expect(page.getByTestId('attention-table').locator('caption')).toContainText('block 1, head 1');
  expect(modelRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('the transformer diagram retains its horizontal layout and bounded vectors', async ({ page }) => {
  await openExplorer(page);
  const steps = page.locator('#inside-ai-app .nodes > .steps');
  await expect(steps).toHaveCSS('display', 'grid');
  const columns = await steps.locator(':scope > .step, :scope > .blocks').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { left: box.left, width: box.width, height: box.height };
  }));
  expect(columns).toHaveLength(4);
  expect(columns.every(box => box.width > 0 && box.height > 0 && box.height < 900)).toBe(true);
  for (let index = 1; index < columns.length; index++) expect(columns[index].left).toBeGreaterThan(columns[index - 1].left);
  const vector = page.locator('#inside-ai-app .step.embedding canvas').first();
  await expect.poll(() => vector.evaluate(element => {
    const box = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();
    return box.width > 0 && box.width < 100 && box.height > 0 && box.height < 250 && Math.abs(box.width - parent.width) <= 2;
  })).toBe(true);
  const scrollRegion = page.locator('#inside-ai-app .ia-diagram-scroll');
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const expanded of [false, true]) {
      if (expanded) await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
      // Expanded attention has a visible residual caption just beyond the canvas.
      const permittedCaptionExtent = expanded ? 24 : 1;
      await expect.poll(() => scrollRegion.evaluate(element => {
        const canvas = element.querySelector('.ia-diagram-canvas');
        return element.scrollWidth - Math.ceil(canvas.getBoundingClientRect().width);
      }), { message: `${width}px diagram must not scroll into a blank area (expanded: ${expanded})` }).toBeLessThanOrEqual(permittedCaptionExtent);
      if (expanded) await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
    }
  }
});

test('controls and explanations remain accessible in both themes on small screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExplorer(page);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => document.documentElement.setAttribute('data-bs-theme', theme), theme);
    await page.setViewportSize({ width: 1440, height: 1000 });
    const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, `${theme} WCAG violations`).toEqual([]);
    for (const operation of ['Q/K/V projection', 'Attention output', 'MLP expansion', 'MLP projection', 'Vocabulary projection']) {
      await page.getByRole('button', { name: operation, exact: true }).click();
      await expect(page.locator('#inside-ai-app .weight-popover')).toBeVisible();
      const popup = await new AxeBuilder({ page }).include('#inside-ai-app .weight-popover').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(popup.violations, `${theme} ${operation} WCAG violations`).toEqual([]);
      await page.getByRole('button', { name: 'Close weight explanation', exact: true }).click();
    }
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} ${width}px overflow`).toBe(true);
      await expect(page.getByTestId('example-select')).toBeVisible();
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByTestId('example-select').focus();
  await expect(page.getByTestId('example-select')).toBeFocused();
});

test('sampling controls and keyboard explanations update the visible results', async ({ page }) => {
  await openExplorer(page);
  await expect(page.getByTestId('numerical-output')).toContainText('5 of 50,257');
  await page.getByTestId('sampling-value').fill('10');
  await page.getByTestId('sampling-value').blur();
  await expect(page.getByTestId('numerical-output')).toContainText('10 of 50,257');
  await page.getByTestId('sampling-mode').selectOption('top-p');
  await page.getByTestId('sampling-value').fill('1');
  await page.getByTestId('sampling-value').blur();
  await expect(page.getByTestId('numerical-output')).toContainText('50,257 of 50,257');
  await page.getByTestId('sampling-value').fill('9');
  await page.getByTestId('sampling-value').blur();
  await expect(page.getByTestId('sampling-value')).toHaveValue('1');
  const explain = page.getByRole('button', { name: 'How sampling works', exact: true });
  await explain.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(explain).toBeFocused();
  await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Expand attention', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Expand attention', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('failed downloads preserve the example experience and allow retry', async ({ page }) => {
  await page.route(modelPattern, route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await openExplorer(page);
  await page.getByTestId('enable-model').click();
  await expect(page.getByTestId('model-status')).toContainText(/failed|unable|could not|error|unavailable/i);
  await expect(page.getByTestId('enable-model')).toBeEnabled();
  await page.getByTestId('enable-model').click();
  await expect(page.getByTestId('model-status')).toContainText(/failed|unable|could not|error|unavailable/i);
  await page.getByTestId('example-select').selectOption({ index: 1 });
  await expect(page.getByTestId('numerical-output')).toBeVisible();
  await expect(page.getByTestId('evidence-mode')).toContainText(/recorded/i);
});

test('cancellation works during loading and cache clearing preserves unrelated data', async ({ page }) => {
  await page.route(modelPattern, async route => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    await route.abort().catch(() => {});
  });
  await openExplorer(page);
  await page.evaluate(async () => {
    const cache = await caches.open('unrelated-site-cache');
    await cache.put('/unrelated-example', new Response('preserve me'));
  });
  await page.getByTestId('enable-model').click();
  await expect(page.getByTestId('cancel-download')).toBeEnabled();
  await page.getByTestId('cancel-download').click();
  await expect(page.getByTestId('model-status')).toContainText(/cancel/i);
  await page.getByTestId('clear-cache').click();
  expect(await page.evaluate(async () => (await caches.keys()).includes('unrelated-site-cache'))).toBe(true);
  await expect(page.getByTestId('numerical-output')).toBeVisible();
});

test('runtime failure returns to usable examples and permits another attempt', async ({ page }) => {
  await page.addInitScript(() => {
    window.Worker = class {
      onmessage = null;
      onerror = null;
      postMessage() { setTimeout(() => this.onerror?.(new ErrorEvent('error', { message: 'Simulated insufficient memory' })), 0); }
      terminate() {}
    } as unknown as typeof Worker;
  });
  await openExplorer(page);
  await page.getByTestId('enable-model').click();
  await expect(page.getByRole('alert')).toContainText(/could not run the model worker/i);
  await expect(page.getByTestId('enable-model')).toBeEnabled();
  await page.getByTestId('example-select').selectOption({ index: 2 });
  await expect(page.getByTestId('evidence-mode')).toContainText(/recorded/i);
  await expect(page.getByTestId('numerical-output')).toBeVisible();
});

test('static lessons and attribution remain useful without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/inside-ai/');
  await expect(page.locator('main h1')).toHaveText('Inside AI: Explore a Transformer');
  await expect(page.locator('main')).toContainText('attention');
  await expect(page.locator('main')).toContainText('Polo Club');
  await expect(page.locator('main noscript')).toBeVisible();
  await context.close();
});

test('Inside AI is discoverable and navigation fits desktop and mobile', async ({ page }) => {
  for (const path of ['/', '/assessments/ai-coding-maturity-assessment/', '/assessments/enterprise-ai-maturity-assessment/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const navigation = page.locator('nav[aria-label="Primary"]').first();
    const item = navigation.locator('a[href$="/inside-ai/"],button[data-href$="/inside-ai/"]').first();
    for (const width of [390, 1024, 1200, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const toggle = navigation.locator('.navbar-toggler');
      if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
      await expect(item).toBeVisible();
      expect(await navigation.locator('.navbar-nav > .nav-item').evaluateAll(items => items.filter(element => {
        const r = element.getBoundingClientRect();
        return r.width > 0 && (r.left < 0 || r.right > innerWidth + 1);
      }).map(element => element.textContent?.trim()))).toEqual([]);
    }
    if (path === '/') {
      const labels = await navigation.locator('.navbar-nav > .nav-item > .nav-link').allTextContents();
      const names = labels.map(value => value.trim());
      expect(names.indexOf('Inside AI')).toBe(names.indexOf('Game Theory') + 1);
      await expect(page.locator('main a[href="/inside-ai/"],.container a[href="/inside-ai/"]').first()).toBeVisible();
    }
  }
  await page.goto('/tools/');
  await expect(page.getByRole('link', { name: /Inside AI/ }).first()).toBeVisible();
  for (const path of ['/category/ai/', '/Agents-Dont-Click/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: /Explore Inside AI/ })).toHaveAttribute('href', '/inside-ai/');
  }
});

test('real instrumented GPT-2 generates a token and exposes live attention', async ({ page }, testInfo) => {
  test.skip(process.env.INSIDE_AI_REAL_MODEL !== '1', 'Enable explicit real-model verification.');
  // CI uses the real pinned model from a validated local cache, without charging Pages for each browser.
  if (process.env.INSIDE_AI_MODEL_FIXTURES) {
    const directory = resolve(process.env.INSIDE_AI_MODEL_FIXTURES);
    await page.route(modelPattern, route => {
      const file = basename(new URL(route.request().url()).pathname);
      if (!/^(manifest[.]json|gpt2[.]onnx[.]part[0-9]+)$/.test(file)) return route.abort();
      return route.fulfill({ path: resolve(directory, file), headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': file.endsWith('.json') ? 'application/json' : 'application/octet-stream' } });
    });
  }
  test.setTimeout(600_000);
  await openExplorer(page);
  await page.getByTestId('enable-model').click();
  await expect(page.getByTestId('model-status')).toContainText(/ready|loaded/i, { timeout: 480_000 });
  await expect(page.getByTestId('prompt-input')).toBeEnabled();
  await page.getByTestId('prompt-input').fill('The capital of France is');
  await page.getByTestId('generate-token').click();
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-token-count', '6', { timeout: 90_000 });
  await expect(page.getByTestId('model-status')).toContainText(/ready/i, { timeout: 90_000 });
  await expect(page.getByTestId('prompt-input')).toHaveValue(/^The capital of France is.+/);
  await expect(page.getByTestId('evidence-mode')).toContainText(/live/i);
  await expect(page.getByTestId('numerical-output')).toBeVisible();
  await expect(page.getByTestId('attention-table')).toBeVisible();
  await expect(page.getByTestId('attention-table').locator('tbody tr')).toHaveCount(6);
  const attentionBefore = await page.getByTestId('attention-table').locator('tbody td:nth-child(2)').allTextContents();
  const weights = attentionBefore.map(Number);
  expect(weights.every(value => Number.isFinite(value) && value >= 0 && value <= 1)).toBe(true);
  expect(weights.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 3);
  await page.getByTestId('head-select').selectOption('5');
  await expect.poll(() => page.getByTestId('attention-table').locator('tbody td:nth-child(2)').allTextContents()).not.toEqual(attentionBefore);
  await page.screenshot({ path: testInfo.outputPath('real-model.png'), fullPage: true });
  await page.getByTestId('prompt-input').fill(Array(33).fill('hello').join(' '));
  await expect(page.locator('#ia-context-note')).toContainText('33 / 32 tokens');
  await expect(page.getByTestId('generate-token')).toBeDisabled();
  await page.getByRole('button', { name: 'Inspect prompt', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/32/);

});
