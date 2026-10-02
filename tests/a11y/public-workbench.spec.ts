import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  test(`workbench contrast, controls, and identity in ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('color-scheme', value), theme);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', theme);
    await expect(page.locator('main h1.display-1')).toHaveCount(1);
    await expect(page.locator('main h1')).toHaveCSS('font-weight', '400');
    await expect(page.locator('.ia-shelf h3 a').first()).toHaveCSS('text-decoration-line', 'underline');
    const pressed = page.locator('#colorSchemeToggle [aria-pressed="true"]');
    await expect(pressed).toHaveAttribute('data-color-scheme', theme);
    await expect(pressed).toHaveCSS('background-color', 'rgb(248, 246, 240)');
    await expect(pressed).toHaveCSS('color', 'rgb(16, 24, 32)');
    await expect(page.getByRole('button', { name: 'System', exact: true })).toContainText('◐');
    for (const button of await page.locator('.ia-navbar button:visible').all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    const hero = page.locator('.ia-hero-photo img');
    await expect.poll(() => hero.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBe(1904);
    await expect(hero).toHaveAttribute('width', '1904');
    await expect(hero).toHaveAttribute('height', '640');
    await expect(page.locator('.ia-familymark-' + theme)).toBeVisible();
    await expect(page.locator('.ia-familymark-' + (theme === 'light' ? 'dark' : 'light'))).toBeHidden();
    await expect(page.locator('.ia-elsewhere-list a')).toHaveCount(6);
    await expect(page.locator('.ia-elsewhere-more')).not.toHaveAttribute('open');
    const summary = page.locator('.ia-elsewhere-more summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.ia-elsewhere-more')).toHaveAttribute('open', '');
    await expect(page.locator('.ia-elsewhere-groups a')).toHaveCount(27);
    const missingIdentity = await page.locator('.ia-elsewhere a').evaluateAll(links =>
      links.filter(link => !link.getAttribute('rel')?.split(' ').includes('me')).map(link => link.textContent));
    expect(missingIdentity).toEqual([]);
    expect((await new AxeBuilder({ page }).include('.ia-footer').analyze()).violations).toEqual([]);
    await page.goto('/search/');
    const contrasts = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const rgb = (color: string) => {
        const el = document.createElement('span'); el.style.color = color; document.body.append(el);
        const values = getComputedStyle(el).color.match(/[\d.]+/g)!.slice(0, 3).map(Number); el.remove();
        const channels = values.map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
      };
      const contrast = (a: string, b: string) => {
        const values = [rgb(root.getPropertyValue(a)), rgb(root.getPropertyValue(b))].sort((x, y) => y - x);
        return (values[0] + .05) / (values[1] + .05);
      };
      return {
        text: ['--ia-ink', '--ia-muted', '--ia-link', '--brand-orange', '--brand-cyan'].flatMap(color =>
          ['--ia-paper', '--ia-surface'].map(ground => ({ color, ground, ratio: contrast(color, ground) }))),
        border: contrast('--ia-control', '--ia-surface'),
        button: contrast('--ia-primary', '--ia-on-primary')
      };
    });
    for (const pair of contrasts.text) expect(pair.ratio, JSON.stringify(pair)).toBeGreaterThanOrEqual(4.5);
    expect(contrasts.border).toBeGreaterThanOrEqual(3);
    expect(contrasts.button).toBeGreaterThanOrEqual(4.5);
  });
}

test('shelves and Plotto use purposeful imagery and a single page title', async ({ page }) => {
  for (const path of ['/essays/', '/stories/', '/games/', '/tools/', '/learn/', '/about-ted/']) {
    await page.goto(path);
    await expect(page.locator('main h1.display-1')).toHaveCount(1);
    await expect(page.locator('.ia-shelf-lead img')).toHaveCount(1);
    const img = page.locator('.ia-shelf-lead img');
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const dimensions = await img.evaluate(el => {
      const image = el as HTMLImageElement;
      return [Number(image.getAttribute('width')), Number(image.getAttribute('height')), image.naturalWidth, image.naturalHeight];
    });
    expect(dimensions.slice(0, 2)).toEqual(dimensions.slice(2));
  }
  await page.goto('/tools/plotto/');
  await expect(page.locator('main h1.display-1')).toHaveCount(1);
  await expect(page.locator('.ia-status--development')).toHaveText('Under Development');
  await expect(page.locator('main img')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View the Project', exact: false })).toHaveAttribute('href', 'https://plotto.tedt.org/');
});

test('footer and controls fit a narrow phone in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  for (const theme of ['light', 'dark']) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.getByRole('button', { name: theme === 'light' ? 'Light' : 'Dark', exact: true }).click();
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.locator('.ia-elsewhere-more summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect((await new AxeBuilder({ page }).include('.ia-footer').analyze()).violations).toEqual([]);
  }
});
