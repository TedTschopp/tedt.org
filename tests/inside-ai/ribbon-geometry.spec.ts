import { test, expect, type Page } from '@playwright/test';

async function ribbonProblems(page: Page) {
  return page.locator('#inside-ai-app .main-section').evaluate(section => {
    const problems: string[] = [];
    const path = section.querySelector<SVGPathElement>('svg.sankey-top g.attention path.value-to-out');
    const source = section.querySelector('.block-steps.main .head-block .value')?.getBoundingClientRect();
    const target = section.querySelector('.block-steps.main .attention .head-out')?.getBoundingClientRect();
    if (!path || !source || !target) return ['Missing Value→Out ribbon or endpoint'];
    const origin = section.getBoundingClientRect();
    const values = (path.getAttribute('d')?.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi) || []).map(Number);
    if (values.length !== 16 || values.some(value => !Number.isFinite(value))) return ['Invalid closed cubic ribbon'];
    const points = Array.from({ length: 8 }, (_, index) => ({ x: values[index * 2], y: values[index * 2 + 1] }));
    const [start, upper1, upper2, end, bottom, lower1, lower2, finish] = points;
    const tolerance = 1;
    for (const [name, actual, expected] of [
      ['Value top', start, { x: source.right - origin.left, y: source.top - origin.top }],
      ['Out top', end, { x: target.left - origin.left, y: target.top - origin.top }],
      ['Out bottom', bottom, { x: target.left - origin.left, y: target.bottom - origin.top }],
      ['Value bottom', finish, { x: source.right - origin.left, y: source.bottom - origin.top }],
    ] as const) {
      if (Math.abs(actual.x - expected.x) > tolerance || Math.abs(actual.y - expected.y) > tolerance) problems.push(`${name} does not meet its local endpoint`);
    }
    const left = Math.min(start.x, end.x), right = Math.max(start.x, end.x);
    for (const point of [upper1, upper2, lower1, lower2]) {
      if (point.x < left - tolerance || point.x > right + tolerance) problems.push(`Control point ${point.x.toFixed(1)} escapes Value→Out interval ${left.toFixed(1)}–${right.toFixed(1)}`);
    }
    const cubic = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
    let lastX = start.x;
    const direction = Math.sign(end.x - start.x);
    for (let step = 1; step <= 100; step++) {
      const t = step / 100;
      const x = cubic(start.x, upper1.x, upper2.x, end.x, t);
      const topY = cubic(start.y, upper1.y, upper2.y, end.y, t);
      const bottomY = cubic(finish.y, lower2.y, lower1.y, bottom.y, t);
      if (direction * (x - lastX) < -0.001) problems.push(`Ribbon doubles back at ${step}%`);
      if (topY >= bottomY) problems.push(`Ribbon edges cross at ${step}%`);
      lastX = x;
    }
    const bounds = path.getBBox();
    if (bounds.x < left - tolerance || bounds.x + bounds.width > right + tolerance) problems.push('Painted ribbon extends beyond its endpoints');
    return problems;
  });
}

async function expectCleanRibbon(page: Page, state: string) {
  await expect.poll(() => ribbonProblems(page), { message: `${state}: Value→Out must stay connected without folding`, timeout: 6000 }).toEqual([]);
}

test('Value→Out ribbon stays local, connected, and unfolded across inset, scrolling, and data changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 2048, height: 1100 });
  await page.goto('/inside-ai/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
  // At this width the centered page has a 273px inset: the old viewport/local
  // coordinate mixture overshoots Out by 44px even before scrolling.
  await expectCleanRibbon(page, '2048px centered page');
  await page.getByTestId('example-select').selectOption('3');
  await expect(page.locator('.ia-token-strip button')).toHaveCount(7);
  for (const head of ['7', '11']) {
    await page.getByTestId('head-select').selectOption(head);
    await expectCleanRibbon(page, `seven tokens, head ${Number(head) + 1}`);
  }
  await page.getByRole('button', { name: 'Expand embeddings', exact: true }).click();
  await expectCleanRibbon(page, 'expanded embeddings');
  await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
  await expectCleanRibbon(page, '1440px expanded attention');
  await page.setViewportSize({ width: 390, height: 844 });
  const region = page.locator('#inside-ai-app .ia-diagram-scroll');
  await region.evaluate(element => { element.scrollLeft = 260; });
  await expect.poll(() => region.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  // A normal head change redraws the path while its viewport coordinates have
  // shifted; the ribbon's diagram-local geometry must remain unchanged.
  await page.getByTestId('head-select').selectOption('0');
  await expectCleanRibbon(page, '390px horizontally scrolled attention');
  await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
  await page.getByTestId('example-select').selectOption('0');
  await expect(page.locator('.ia-token-strip button')).toHaveCount(6);
  await expectCleanRibbon(page, 'six-token collapsed return');
});
