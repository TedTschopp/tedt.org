import { test, expect, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Axe cannot establish contrast for many SVG primitives, composited opacity, or
// labels covered by a separate gradient. Check those rendered states explicitly.
async function diagramContrast(page: Page) {
  return page.locator('#inside-ai-app .ia-diagram-canvas').evaluate(root => {
    type Color = [number, number, number, number];
    const transparent: Color = [0, 0, 0, 0];
    const white: Color = [255, 255, 255, 1];
    const parse = (value: string): Color | null => {
      if (!/^rgba?\(/.test(value)) return null;
      const numbers = value.match(/[\d.]+/g)?.map(Number);
      return numbers && numbers.length >= 3 ? [numbers[0], numbers[1], numbers[2], numbers[3] ?? 1] : null;
    };
    const over = (front: Color, back: Color): Color => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      if (!alpha) return transparent;
      return [0, 1, 2].map(index => (front[index] * front[3] + back[index] * back[3] * (1 - front[3])) / alpha)
        .concat(alpha) as Color;
    };
    const luminance = (color: Color) => color.slice(0, 3).map(channel => channel / 255)
      .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
      .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
    const ratio = (a: Color, b: Color) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    // Compose both a painted and an unpainted pixel through every background and
    // opacity group. Multiplying only the leaf opacity misses nested dimming.
    const contrast = (element: Element, pigment: Color, ownBackground = true) => {
      let foreground = pigment;
      let background = transparent;
      for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        const surface = ancestor === element && !ownBackground ? transparent : (parse(style.backgroundColor) || transparent);
        foreground = over(foreground, surface);
        background = over(background, surface);
        const opacity = Number(style.opacity);
        foreground = [foreground[0], foreground[1], foreground[2], foreground[3] * opacity];
        background = [background[0], background[1], background[2], background[3] * opacity];
      }
      return ratio(over(foreground, white), over(background, white));
    };
    const shown = (element: Element) => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width && !bounds.height) return false;
      for (let ancestor: Element | null = element; ancestor && ancestor !== root.parentElement; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    const describe = (element: Element) => `${element.tagName.toLowerCase()}.${element.getAttribute('class') || ''} ${(element.textContent || '').trim().slice(0, 40)}`;
    const violations: string[] = [];
    const minima = { text: Infinity, graphics: Infinity };
    const counts = { text: 0, paths: 0, bars: 0, cells: 0, vectors: 0, icons: 0, labelSurfaces: 0 };
    const record = (element: Element, kind: string, value: number, minimum: number) => {
      const category = kind === 'text' ? 'text' : 'graphics';
      minima[category] = Math.min(minima[category], value);
      if (value + 0.001 < minimum) violations.push(`${kind} ${value.toFixed(2)}:1 < ${minimum}:1 — ${describe(element)}`);
    };
    for (const element of root.querySelectorAll('*')) {
      if (!shown(element) || element.closest('.katex-mathml, button:disabled, [aria-disabled="true"]')) continue;
      if (![...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) continue;
      const style = getComputedStyle(element);
      const color = parse(element instanceof SVGElement ? style.fill : style.color);
      if (!color) continue;
      if (element instanceof SVGElement) color[3] *= Number(style.fillOpacity);
      counts.text++;
      record(element, 'text', contrast(element, color), 4.5);
    }
    for (const element of root.querySelectorAll('.sankey-path, .operation-col .cell svg path, .operation-col .cell svg .icon, .residual-connector, .probability rect.bar, .matrix-svg circle.cell, .matrix-svg rect.cell, .token-id svg path, .attention-matrix .arrow path, .formula-steps .step-arrow path, .formula-steps .annotation svg polyline, .formula-steps .annotation svg line')) {
      if (!shown(element)) continue;
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      const matrix = Boolean(element.closest('.matrix-svg'));
      const bar = element.matches('.probability rect.bar');
      // Transparent rectangle placeholders align attention paths in Firefox.
      if (matrix && element.tagName.toLowerCase() === 'rect' && (parse(style.fill)?.[3] ?? 1) === 0) continue;
      // A zero-probability bar correctly has no visible extent.
      if (bar && bounds.width === 0) continue;
      const filled = bar || element.matches('.icon, .token-id svg path');
      const pigment = parse(filled ? style.fill : style.stroke);
      const paintOpacity = Number(filled ? style.fillOpacity : style.strokeOpacity);
      if (paintOpacity === 0) continue;
      const kind = matrix ? 'cells' : bar ? 'bars' : 'paths';
      counts[kind]++;
      if (!pigment || (!filled && parseFloat(style.strokeWidth) === 0)) {
        violations.push(`${kind} has no visible ${filled ? 'fill' : 'boundary'} — ${describe(element)}`);
        continue;
      }
      pigment[3] *= paintOpacity;
      record(element, kind, contrast(element, pigment, false), 3);
      if (element.matches('.icon')) {
        counts.icons++;
        // These dots sit over separate SVG ribbons, which are not CSS ancestors.
        // Require an opaque halo so their actual adjacent color is measurable.
        const backplate = parse(style.stroke);
        if (!backplate || backplate[3] < 1 || Number(style.strokeOpacity) < 1 || parseFloat(style.strokeWidth) < 2) {
          violations.push(`operation icon lacks an opaque 2px backplate over ribbons — ${describe(element)}`);
        } else record(element, 'operation icon against its backplate', ratio(over(pigment, backplate), backplate), 3);
      }
    }
    for (const element of root.querySelectorAll('.vector:not(.vocab), .sub-vector')) {
      if (!shown(element)) continue;
      const style = getComputedStyle(element);
      const color = parse(style.outlineColor);
      counts.vectors++;
      if (!color || style.outlineStyle === 'none' || parseFloat(style.outlineWidth) === 0) {
        violations.push(`vector has no visible boundary — ${describe(element)}`);
      } else record(element, 'vector boundary', contrast(element, color, false), 3);
    }
    for (const element of root.querySelectorAll('.label, .guide-text, .matrix-label, .color-scale .val, .title-text, .text-box > span, .qkv .head-rest span')) {
      if (element instanceof SVGElement || !shown(element) || !element.textContent?.trim()) continue;
      counts.labelSurfaces++;
      if ((parse(getComputedStyle(element).backgroundColor)?.[3] ?? 0) < 1) {
        violations.push(`label has no opaque surface over diagram ribbons — ${describe(element)}`);
      }
    }
    for (const overlay of root.querySelectorAll('.prob-dim, .softmax .second-column .dim, .main-section > .dim, .main-section > .dim-partial')) {
      if (shown(overlay)) violations.push(`dimming overlay covers readable diagram content — ${describe(overlay)}`);
    }
    return { counts, minima, violations: [...new Set(violations)] };
  });
}

for (const theme of ['light', 'dark']) {
  test(`${theme} diagram text and essential graphics retain rendered contrast`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.goto('/inside-ai/');
    await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
    await page.evaluate(theme => document.documentElement.setAttribute('data-bs-theme', theme), theme);
    const evidence: Array<{ state: string; result: Awaited<ReturnType<typeof diagramContrast>> }> = [];
    const check = async (state: string) => {
      const result = await diagramContrast(page);
      evidence.push({ state, result });
      expect(result.counts.text, `${state}: must inspect actual text`).toBeGreaterThan(10);
      expect(result.counts.paths, `${state}: must inspect actual paths`).toBeGreaterThan(10);
      expect(result.counts.icons, `${state}: must inspect operation icons`).toBeGreaterThan(0);
      expect(result.counts.bars, `${state}: must inspect probability bars`).toBeGreaterThan(0);
      expect(result.counts.cells, `${state}: must inspect attention cells`).toBeGreaterThan(10);
      expect(result.counts.vectors, `${state}: must inspect vector boundaries`).toBeGreaterThan(10);
      expect(result.counts.labelSurfaces, `${state}: must inspect label backgrounds`).toBeGreaterThan(10);
      expect.soft(result.violations, `${theme} ${state} contrast failures`).toEqual([]);
    };
    await check('default');
    const diagramImage = testInfo.outputPath(`${theme}-diagram.png`);
    await page.locator('.ia-diagram-scroll').screenshot({ path: diagramImage });
    await testInfo.attach(`${theme}-diagram`, { path: diagramImage, contentType: 'image/png' });
    await page.locator('.block-steps.main .attention-result circle.cell:not([data-masked=true])').first().hover();
    await expect(page.locator('#inside-ai-app .matrix-tooltip')).toBeVisible();
    await check('attention cell hover and labels');
    await page.getByRole('button', { name: 'Expand embeddings', exact: true }).hover();
    await check('attention cell mouseout');
    await page.getByRole('button', { name: 'Expand embeddings', exact: true }).click();
    await check('expanded embeddings');
    await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
    await page.getByRole('button', { name: 'Expand attention', exact: true }).click();
    await check('expanded attention');
    await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
    await page.getByRole('button', { name: 'Expand probabilities', exact: true }).click();
    await check('expanded probabilities');
    const outputImage = testInfo.outputPath(`${theme}-output.png`);
    await page.locator('.ia-diagram-scroll').screenshot({ path: outputImage });
    await testInfo.attach(`${theme}-output`, { path: outputImage, contentType: 'image/png' });
    await page.getByRole('button', { name: 'Collapse diagram', exact: true }).click();
    for (const operation of ['Q/K/V projection', 'Attention output', 'MLP expansion', 'MLP projection', 'Vocabulary projection']) {
      await page.getByRole('button', { name: operation, exact: true }).click();
      await expect(page.locator('#inside-ai-app .weight-popover')).toBeVisible();
      await check(operation);
      await page.getByRole('button', { name: 'Close weight explanation', exact: true }).click();
    }
    const evidencePath = testInfo.outputPath(`${theme}-contrast-results.json`);
    await writeFile(evidencePath, JSON.stringify(evidence, null, 2));
    await testInfo.attach(`${theme}-contrast-results`, { path: evidencePath, contentType: 'application/json' });
  });
}
