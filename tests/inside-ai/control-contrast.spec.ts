import { test, expect } from '@playwright/test';

// Control outlines are essential visual cues that Axe's text-contrast rule does
// not evaluate. Compare the actual rendered edge with both adjacent surfaces.
async function renderedControls(page) {
  return page.locator('#inside-ai-app').evaluate(root => {
    type Color = [number, number, number, number];
    const clear: Color = [0, 0, 0, 0];
    const white: Color = [255, 255, 255, 1];
    const parse = (value: string): Color => {
      const components = value.match(/[\d.]+/g)?.map(Number);
      return components?.length >= 3 ? [components[0], components[1], components[2], components[3] ?? 1] : clear;
    };
    const over = (foreground: Color, background: Color): Color => {
      const alpha = foreground[3] + background[3] * (1 - foreground[3]);
      return alpha ? [0, 1, 2].map(i => (foreground[i] * foreground[3] + background[i] * background[3] * (1 - foreground[3])) / alpha).concat(alpha) as Color : clear;
    };
    const luminance = (color: Color) => color.slice(0, 3).map(value => value / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
      .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
    const ratio = (a: Color, b: Color) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    const paint = (element: Element, pigment: Color, ownBackground = true) => {
      let color = pigment;
      for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (ancestor !== element || ownBackground) color = over(color, parse(style.backgroundColor));
        color = [color[0], color[1], color[2], color[3] * Number(style.opacity)];
      }
      return over(color, white);
    };
    const controls = [...root.querySelectorAll('select:not(:disabled), textarea:not(:disabled), input[type=number]:not(:disabled), .ia-token-strip button')];
    return controls.map(element => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      const inside = paint(element, clear);
      const outside = paint(element, clear, false);
      const edges = ['Top', 'Right', 'Bottom', 'Left'].map(side => {
        const border = paint(element, parse(style[`border${side}Color`]));
        return { side, width: parseFloat(style[`border${side}Width`]), style: style[`border${side}Style`], inside: ratio(border, inside), outside: ratio(border, outside) };
      });
      const label = element.getAttribute('data-testid') || element.closest('label')?.textContent?.trim().slice(0, 55) || element.textContent?.trim().slice(0, 55);
      const ownText = [...element.querySelectorAll('span,small')].filter(child => child.textContent?.trim());
      const text = [element, ...ownText].map(child => ratio(paint(child, parse(getComputedStyle(child).color)), paint(child, clear)));
      const outline = paint(element, parse(style.outlineColor), false);
      return { label, visible: box.width > 0 && box.height > 0, edges, text, selected: element.classList.contains('ia-selected'), token: Boolean(element.closest('.ia-token-strip')), focused: element === document.activeElement, outlineWidth: parseFloat(style.outlineWidth), outlineStyle: style.outlineStyle, outlineContrast: ratio(outline, outside) };
    });
  });
}

for (const theme of ['light', 'dark']) {
  test(`${theme} enabled controls have visible boundaries and distinct token selection`, async ({ page }, testInfo) => {
    const modelRequests: string[] = [];
    page.on('request', request => { if (request.url().includes('/inside-ai-models/')) modelRequests.push(request.url()); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/inside-ai/');
    await expect(page.getByTestId('app-ready')).toHaveAttribute('data-ready', 'true');
    await page.evaluate(theme => document.documentElement.setAttribute('data-bs-theme', theme), theme);
    const measurements = await renderedControls(page);
    expect(measurements.length).toBeGreaterThanOrEqual(14);
    expect(measurements.some(item => item.label === 'diagram-row-limit')).toBe(true);
    const failures = [];
    for (const control of measurements) {
      if (!control.visible) failures.push(`${control.label}: invisible`);
      for (const edge of control.edges) {
        if (edge.width < 1 || edge.style === 'none' || Math.min(edge.inside, edge.outside) < 3) failures.push(`${control.label} ${edge.side} boundary: ${edge.inside.toFixed(2)}:1 inside, ${edge.outside.toFixed(2)}:1 outside (${edge.width}px ${edge.style})`);
      }
      if (Math.min(...control.text) < 4.5) failures.push(`${control.label}: text ${Math.min(...control.text).toFixed(2)}:1`);
    }
    await testInfo.attach(`${theme}-control-contrast`, { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
    expect(failures).toEqual([]);
    const tokens = page.locator('.ia-token-strip button');
    await tokens.first().click();
    await expect(tokens.first()).toHaveClass(/ia-selected/);
    const changed = (await renderedControls(page)).filter(item => item.token);
    expect(changed.filter(item => item.selected)).toHaveLength(1);
    expect(changed.find(item => item.selected)?.edges.every(edge => edge.width >= 2)).toBe(true);
    expect(changed.filter(item => !item.selected).every(item => item.edges.every(edge => edge.width === 1))).toBe(true);
    await page.getByTestId('example-select').focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const focused = (await renderedControls(page)).find(item => item.focused);
    expect(focused?.label).toBe('example-select');
    expect(focused?.outlineStyle).not.toBe('none');
    expect(focused?.outlineWidth).toBeGreaterThanOrEqual(3);
    expect(focused?.outlineContrast).toBeGreaterThanOrEqual(3);
    expect(modelRequests).toEqual([]);
  });
}
