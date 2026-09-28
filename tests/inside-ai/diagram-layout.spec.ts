import { test, expect, type Page } from '@playwright/test';

async function layoutProblems(page: Page) {
  return page.locator('#inside-ai-app .ia-diagram-scroll').evaluate(region => {
    const problems: string[] = [];
    const tolerance = 2; // Allow rounded layout coordinates and one-pixel outlines.
    const box = (selector: string) => {
      const element = region.querySelector(selector);
      if (!element) { problems.push(`Missing ${selector}`); return null; }
      const bounds = element.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) problems.push(`Empty ${selector}`);
      return bounds;
    };
    const stages = [
      ['Embedding', '.embedding.step'],
      ['QKV', '.block-steps.main > .qkv.step'],
      ['Attention', '.block-steps.main > .attention.step'],
      ['MLP', '.block-steps.main > .mlp.step'],
      ['Remaining blocks', '.transformer-blocks.step'],
      ['Probabilities', '.softmax.step'],
    ].map(([name, selector]) => ({ name, bounds: box(selector) }));
    for (let index = 1; index < stages.length; index++) {
      const left = stages[index - 1], right = stages[index];
      if (left.bounds && right.bounds && left.bounds.right > right.bounds.left + tolerance) {
        problems.push(`${left.name} overlaps ${right.name} by ${(left.bounds.right - right.bounds.left).toFixed(1)}px`);
      }
    }
    const blocks = box('.steps > .blocks');
    for (const stage of stages.slice(1, 4)) {
      if (blocks && stage.bounds && (stage.bounds.left < blocks.left - tolerance || stage.bounds.right > blocks.right + tolerance)) {
        problems.push(`${stage.name} escapes its blocks container: child ${stage.bounds.left.toFixed(1)}–${stage.bounds.right.toFixed(1)}, parent ${blocks.left.toFixed(1)}–${blocks.right.toFixed(1)}`);
      }
    }
    const vectors = Array.from(region.querySelectorAll('.block-steps.main .mlp .vector')).map(element => element.getBoundingClientRect());
    const words = Array.from(region.querySelectorAll('.softmax .token-string .text-box > span')).map(element => element.getBoundingClientRect());
    if (!vectors.length || !words.length) problems.push('Missing MLP vectors or output words');
    else {
      const vectorRight = Math.max(...vectors.map(rect => rect.right));
      const wordLeft = Math.min(...words.map(rect => rect.left));
      if (wordLeft < vectorRight + tolerance) problems.push(`Output words reach into MLP vectors: word left ${wordLeft.toFixed(1)}, vector right ${vectorRight.toFixed(1)}`);
    }
    const headings = [
      ['Embedding', '.embedding.step > .title .title-text'],
      ['Attention', '.block-steps.main .attention.step > .title .textbook-tooltip'],
      ['MLP', '.block-steps.main .mlp.step > .title .textbook-tooltip'],
      ['Remaining blocks', '.transformer-blocks.step .guide .text'],
      ['Probabilities', '.softmax.step > .title .title-text'],
    ].map(([name, selector]) => ({ name, bounds: box(selector) }));
    for (let first = 0; first < headings.length; first++) {
      for (let second = first + 1; second < headings.length; second++) {
        const a = headings[first], b = headings[second];
        if (a.bounds && b.bounds
          && Math.min(a.bounds.right, b.bounds.right) - Math.max(a.bounds.left, b.bounds.left) > tolerance
          && Math.min(a.bounds.bottom, b.bounds.bottom) - Math.max(a.bounds.top, b.bounds.top) > tolerance) {
          problems.push(`${a.name} and ${b.name} headings intersect`);
        }
      }
    }
    const bounds = region.getBoundingClientRect();
    if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('Diagram widens the page outside its scroll region');
    if (bounds.left < -1 || bounds.right > innerWidth + 1) problems.push('Diagram scroll region extends outside the viewport');
    if (!['auto', 'scroll'].includes(getComputedStyle(region).overflowX)) problems.push('Diagram has no horizontal scrolling boundary');
    return problems;
  });
}

async function expectSeparatedPipeline(page: Page, state: string) {
  await expect.poll(() => layoutProblems(page), { message: `${state}: pipeline stages and labels must remain separate`, timeout: 6_000 }).toEqual([]);
}

test('expanded diagrams reserve intrinsic stage widths and contain horizontal scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/inside-ai/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await expectSeparatedPipeline(page, `${width}px collapsed`);
    for (const name of ['Expand embeddings', 'Expand attention', 'Expand probabilities']) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expectSeparatedPipeline(page, `${width}px ${name}`);
      await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
      await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'false');
      await expectSeparatedPipeline(page, `${width}px collapsed after ${name}`);
    }
  }
});
