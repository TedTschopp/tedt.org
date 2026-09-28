import { test, expect, type Locator, type Page } from '@playwright/test';

// Playwright's toBeVisible deliberately allows opacity:0. Check every ancestor,
// including .main.matrix-container, so a present-but-blank diagram cannot pass.
async function renderedState(locator: Locator) {
  return locator.evaluate(element => {
    let opacity = 1;
    const hiddenAncestors: string[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      opacity *= Number(style.opacity);
      if (style.display === 'none' || style.visibility !== 'visible') {
        hiddenAncestors.push(`${node.tagName}.${Array.from(node.classList).join('.')}`);
      }
    }
    const box = element.getBoundingClientRect();
    return { opacity, hiddenAncestors, width: box.width, height: box.height };
  });
}

async function expectRendered(locator: Locator, label: string) {
  await expect(locator, `${label} must exist exactly once`).toHaveCount(1);
  await expect.poll(async () => {
    const state = await renderedState(locator);
    return {
      opacity: state.opacity,
      hiddenAncestors: state.hiddenAncestors,
      positiveGeometry: state.width > 0 && state.height > 0,
    };
  }, { message: `${label} must be fully opaque through every ancestor and have rendered geometry` }).toEqual({ opacity: 1, hiddenAncestors: [], positiveGeometry: true });
}

async function openExplorer(page: Page, theme: string, motion: 'reduce' | 'no-preference') {
  await page.emulateMedia({ reducedMotion: motion });
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.goto('/inside-ai/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
  await expect(page.getByTestId('numerical-output')).not.toBeEmpty();
  await page.evaluate(value => document.documentElement.setAttribute('data-bs-theme', value), theme);
}

async function checkExpandedAttention(page: Page, tokenCount: number) {
  const stages = [
    { selector: '.attention-qk', label: 'Dot product', activeCells: tokenCount ** 2 },
    { selector: '.attention-mask', label: 'Scaling · Mask', activeCells: tokenCount * (tokenCount + 1) / 2 },
    { selector: '.attention-softmax', label: 'Softmax', activeCells: tokenCount * (tokenCount + 1) / 2 },
  ];
  for (const { selector, label, activeCells } of stages) {
    const stage = page.locator(`#inside-ai-app .block-steps.main ${selector}`);
    const matrix = stage.locator('.main[data-id="matrix"]');
    const svg = matrix.locator('svg.matrix-svg');
    await expect(stage.locator('.matrix-label')).toHaveText(label);
    await expectRendered(stage, `${label} stage`);
    await expectRendered(matrix, `${label} final matrix`);
    await expectRendered(svg, `${label} final matrix SVG`);
    await expect(matrix.locator('circle.cell')).toHaveCount(tokenCount ** 2);
    await expect(matrix.locator('circle.cell:not([data-masked="true"])')).toHaveCount(activeCells);
    await expect(matrix.locator('circle.cell[data-masked="true"]')).toHaveCount(tokenCount ** 2 - activeCells);
    await expect.poll(() => matrix.locator('circle.cell:not([data-masked="true"])').evaluateAll(cells => cells.map(cell => {
      let opacity = 1;
      let hidden = false;
      for (let node: Element | null = cell; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        opacity *= Number(style.opacity);
        hidden ||= style.display === 'none' || style.visibility !== 'visible';
      }
      const box = cell.getBoundingClientRect();
      const style = getComputedStyle(cell);
      const transparent = style.fill === 'none' || style.fill === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(style.fill);
      return opacity === 1 && !hidden && box.width > 0 && box.height > 0 && !transparent && Number(style.fillOpacity) > 0;
    }).every(Boolean)), { message: `${label} must actually paint every unmasked cell` }).toBe(true);
    // The final stage must contain its full SVG even after the collapsed
    // result becomes hidden, including every reopening and data change.
    await expect.poll(async () => {
      const outer = await renderedState(stage);
      const inner = await renderedState(svg);
      return outer.width >= inner.width && outer.height >= inner.height;
    }, { message: `${label} stage must retain the matrix width and height` }).toBe(true);
  }
}

async function collapseAttention(page: Page) {
  await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
  await expectRendered(page.locator('#inside-ai-app .block-steps.main .attention-result .main[data-id="matrix"]'), 'Collapsed attention result');
  await expect(page.locator('#inside-ai-app .block-steps.main .attention-mask')).toBeHidden();
  await expect(page.locator('#inside-ai-app .block-steps.main .attention-softmax')).toBeHidden();
}

async function checkExpandedProbabilities(page: Page, sampling: 'top-k' | 'top-p') {
  const output = page.locator('#inside-ai-app .softmax.step');
  await expectRendered(output.locator('.softmax-subtitle'), 'Expanded probability column headings');
  await expectRendered(output.locator('.softmax-detail.expandable'), 'Expanded probability values');
  const count = Number(await page.getByTestId('diagram-output-count').getAttribute('data-shown'));
  expect(count).toBeGreaterThan(0);
  for (const [selector, label] of [['.logits', 'Logits'], ['.scaled', 'Scaled logits'], ['.sampling', sampling === 'top-k' ? 'Top-k' : 'Softmax & Top-p']]) {
    const title = output.locator(`.softmax-subtitle .title-box${selector}`);
    await expect(title).toContainText(label);
    await expectRendered(title, `${label} heading`);
    const values = output.locator(`.vector-box${selector} .text-box`);
    await expect(values).toHaveCount(count);
    for (let index = 0; index < count; index++) {
      await expectRendered(values.nth(index), `${label} row ${index + 1}`);
      await expect(values.nth(index)).toContainText(/\d/);
    }
  }
}

for (const theme of ['light', 'dark']) {
  for (const motion of ['reduce', 'no-preference'] as const) {
    test(`${theme} ${motion}: Scaling, Mask, and Softmax matrices stay visible after reopening and token-count changes`, async ({ page }) => {
      await openExplorer(page, theme, motion);
      // Reopen the same example, then grow and shrink the token count.
      for (const example of [0, 0, 3, 0]) {
        await page.getByTestId('example-select').selectOption(String(example));
        const tokenCount = example === 3 ? 7 : 6;
        await expect(page.locator('.ia-token-strip button')).toHaveCount(tokenCount);
        await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
        await checkExpandedAttention(page, tokenCount);
        await collapseAttention(page);
      }
    });

    test(`${theme} ${motion}: expanded logits, scaling, and sampling numbers stay visible after reopening`, async ({ page }) => {
      await openExplorer(page, theme, motion);
      for (const [example, sampling] of [[0, 'top-k'], [0, 'top-k'], [3, 'top-p']] as const) {
        await page.getByTestId('example-select').selectOption(String(example));
        await expect(page.locator('.ia-token-strip button')).toHaveCount(example === 3 ? 7 : 6);
        await page.getByTestId('sampling-mode').selectOption(sampling);
        await page.getByRole('button', { name: 'Expand probabilities', exact: true }).click();
        await checkExpandedProbabilities(page, sampling);
        await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
        await expect(page.locator('.softmax-subtitle')).toHaveCount(0);
      }
    });
  }
}


test('slow animation frames still reveal every attention matrix within 20 seconds', async ({ page }) => {
  // Reproduce a throttled device: every frame arrives beyond GSAP's default
  // 500 ms lag threshold. The application must honor elapsed wall-clock time.
  await page.addInitScript(() => {
    const frameDelays: number[] = [];
    Object.defineProperty(window, '__insideAISlowFrameDelays', { value: frameDelays });
    window.requestAnimationFrame = callback => {
      const requested = performance.now();
      return window.setTimeout(() => {
        const timestamp = performance.now();
        frameDelays.push(timestamp - requested);
        callback(timestamp);
      }, 550);
    };
    window.cancelAnimationFrame = handle => window.clearTimeout(handle);
  });
  await openExplorer(page, 'light', 'no-preference');
  await page.getByTestId('example-select').selectOption('0');
  await expect(page.locator('.ia-token-strip button')).toHaveCount(6);
  const started = Date.now();
  await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
  await checkExpandedAttention(page, 6);
  expect(Date.now() - started, 'All attention stages must finish revealing in elapsed wall-clock time').toBeLessThan(20_000);
  const frameDelays = await page.evaluate(() => (window as Window & { __insideAISlowFrameDelays: number[] }).__insideAISlowFrameDelays);
  expect(frameDelays.length, 'The test must exercise multiple slow animation frames').toBeGreaterThan(5);
  expect(Math.min(...frameDelays), 'Every injected frame must exceed the default 500 ms lag threshold').toBeGreaterThan(500);
});
