import { test, expect, type Page } from '@playwright/test';

async function labelPaint(page: Page) {
  return page.locator('#inside-ai-app .ia-diagram-canvas').evaluate(root => {
    const labels = [...root.querySelectorAll('.mlp .label, .softmax .token-string .text-box, .softmax .token-string .text-box > span')].filter(element => {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) return false;
      for (let node: Element | null = element; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility !== 'visible' || Number(style.opacity) === 0) return false;
      }
      return true;
    });
    return labels.map(element => {
      const style = getComputedStyle(element);
      return { text: element.textContent?.trim(), background: style.backgroundColor, image: style.backgroundImage, shadow: style.textShadow };
    });
  });
}

for (const theme of ['light', 'dark']) {
  test(`${theme} diagram labels leave ribbons clear and output controls stay below the scroll region`, async ({ page, browserName }, testInfo) => {
    const modelRequests: string[] = [];
    page.on('request', request => { if (request.url().includes('/inside-ai-models/')) modelRequests.push(request.url()); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.goto('/inside-ai/');
    await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
    await page.evaluate(value => document.documentElement.setAttribute('data-bs-theme', value), theme);
    const count = page.getByTestId('diagram-output-count');
    const limit = page.getByTestId('diagram-row-limit');
    await expect(count).toHaveAttribute('data-shown', '5');
    const assertLabels = async () => {
      const labels = await labelPaint(page);
      expect(labels.length).toBeGreaterThan(5);
      expect.soft(labels.filter(label => label.background !== 'rgba(0, 0, 0, 0)' || label.image !== 'none' || label.shadow === 'none'), 'MLP and predicted-word labels must have transparent rectangles and a glyph halo').toEqual([]);
    };
    const assertControlsBelowDiagram = async () => {
      await expect(page.locator('.ia-diagram-scroll [data-testid="diagram-row-limit"]')).toHaveCount(0);
      await expect(page.locator('.ia-diagram-scroll + .ia-output-controls')).toHaveCount(1);
      await expect(page.locator('.ia-output-controls')).toContainText('Sampling uses all 50,257 tokens.');
      const geometry = await page.evaluate(() => {
        const diagram = document.querySelector('.ia-diagram-scroll').getBoundingClientRect();
        const controls = document.querySelector('.ia-output-controls');
        const box = controls.getBoundingClientRect();
        return { clearance: box.top - diagram.bottom, left: box.left, right: box.right, viewport: document.documentElement.clientWidth, position: getComputedStyle(controls).position };
      });
      expect(geometry.clearance).toBeGreaterThanOrEqual(0);
      expect(geometry.position).toBe('static');
      expect(geometry.left).toBeGreaterThanOrEqual(0);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
    };
    await assertLabels();
    await assertControlsBelowDiagram();
    await page.locator('.ia-diagram-canvas').screenshot({ path: testInfo.outputPath(`${theme}-transparent-labels.png`) });
    const word = page.locator('.softmax .token-string .text-box').first();
    await word.hover();
    await assertLabels();
    await page.getByRole('button', { name: 'Expand probabilities', exact: true }).click();
    await assertLabels();
    await page.getByTestId('sampling-value').fill('50');
    await page.getByTestId('sampling-value').press('Tab');
    for (const rows of [5, 10, 15]) {
      await limit.selectOption(String(rows));
      await expect(count).toHaveAttribute('data-retained', '50');
      await expect(count).toHaveAttribute('data-shown', String(rows));
      await expect(page.locator('.softmax .token-string .text-box')).toHaveCount(rows);
      await expect(page.locator('.softmax .probability-col g.probability')).toHaveCount(rows);
      await expect(page.locator('.ia-probability-table tbody tr')).toHaveCount(50);
      await expect(page.getByRole('button', { name: 'Expand probabilities', exact: true })).toHaveAttribute('aria-pressed', 'true');
    }
    await limit.focus();
    await page.keyboard.press('Tab');
    await expect(limit).not.toBeFocused();
    await expect(page.getByRole('button', { name: 'Expand probabilities', exact: true })).toHaveAttribute('aria-pressed', 'true');
    // macOS WebKit uses Option+Tab to include links in native keyboard focus.
    // Ordinary Tab above must still leave the expanded diagram open.
    await limit.focus();
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
    await expect(page.getByRole('link', { name: 'Leading 50 candidates and logits', exact: true })).toBeFocused();
    for (const width of [1600, 320]) {
      await page.setViewportSize({ width, height: 1100 });
      await assertControlsBelowDiagram();
      await assertLabels();
    }
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#ia-next-heading$/);
    expect(modelRequests).toEqual([]);
  });
}
