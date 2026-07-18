import { expect } from '@playwright/test';
import { consoleErrorsFixture } from './helpers/console';

const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';

async function stubColorNameApi(page) {
  await page.route('https://api.color.pizza/**', async route => {
    const requestUrl = new URL(route.request().url());
    const hex = requestUrl.pathname.split('/').filter(Boolean).pop() || '000000';
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ colors: [{ name: `Test ${hex.toUpperCase()}` }] }),
    });
  });
}

consoleErrorsFixture.describe('Color chart source extraction', () => {
  consoleErrorsFixture('keeps existing URL palette rendering intact', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.goto(`${BASE}/tools/color-chart.html?c=teds`, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.color-box')).toHaveCount(77);
    await expect(page.getByLabel('Color list')).toContainText('#0EA6CC');
    await expect(page.getByLabel('Color list')).toContainText('#00B339');
    expect(consoleErrors, 'Color chart should render the existing teds palette without console errors').toHaveLength(0);
  });

  consoleErrorsFixture('extracts a palette from an uploaded image and saves it into the URL palette', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.goto(`${BASE}/tools/color-chart.html?c=000000`, { waitUntil: 'domcontentloaded' });

    await expect(page.getByLabel('Analyze website or image URL')).toBeVisible();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
      <rect width="40" height="40" fill="#00664f"/>
      <rect x="40" width="40" height="40" fill="#fed141"/>
      <rect y="40" width="40" height="40" fill="#00a9e0"/>
      <rect x="40" y="40" width="40" height="40" fill="#e87722"/>
    </svg>`;

    await page.setInputFiles('#sourceImageInput', {
      name: 'brand-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(svg),
    });

    await expect(page.getByText(/Extracted \d+ colors from brand-sample\.svg/)).toBeVisible();
    await expect(page.getByLabel('Color list')).toContainText('#00664F');
    await expect(page.getByLabel('Color list')).toContainText('#FED141');
    await expect(page.locator('.color-box')).toHaveCount(44);

    await page.getByRole('button', { name: 'Save URL' }).click();
    const savedColors = new URL(page.url()).searchParams.get('c')?.split(',') || [];
    expect(savedColors).toEqual(expect.arrayContaining(['00664F', 'FED141', '00A9E0', 'E87722']));
    expect(consoleErrors, 'Uploaded image palette extraction should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('reports blocked website analysis without destroying the current palette', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.route('https://blocked.example/**', route => route.fulfill({
      status: 403,
      headers: { 'access-control-allow-origin': '*' },
      body: 'blocked',
    }));
    await page.goto(`${BASE}/tools/color-chart.html?c=101820`, { waitUntil: 'domcontentloaded' });

    await page.getByLabel('Analyze website or image URL').fill('https://blocked.example/');
    await page.getByRole('button', { name: 'Analyze URL' }).click();

    await expect(page.getByText(/Browser security blocked direct analysis/i)).toBeVisible();
    await expect(page.getByLabel('Color list')).toContainText('#101820');
    await expect(page.locator('.color-box')).toHaveCount(11);
  });

  consoleErrorsFixture('exposes reusable color analysis primitives for the workbench', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.goto(`${BASE}/tools/color-chart.html?c=000000,ffffff`, { waitUntil: 'domcontentloaded' });

    const analysis = await page.evaluate(() => {
      const blackOnWhite = getContrastReport('#000000', '#ffffff');
      const blackMetrics = getColorMetrics('#000000');
      const whiteMetrics = getColorMetrics('#ffffff');
      const shadeRecords = getPaletteShadeRecords([{ hex: '#000000' }, { hex: '#ffffff' }]);

      return {
        blackOnWhite,
        blackText: getReadableTextColor('#000000'),
        whiteText: getReadableTextColor('#ffffff'),
        blackMetrics,
        whiteMetrics,
        shadeRecordCount: shadeRecords.length,
        firstShadeRecord: shadeRecords[0],
      };
    });

    expect(analysis.blackOnWhite.ratio).toBeCloseTo(21, 2);
    expect(analysis.blackOnWhite.aaNormal).toBe(true);
    expect(analysis.blackOnWhite.aaaNormal).toBe(true);
    expect(analysis.blackText).toBe('#FFFFFF');
    expect(analysis.whiteText).toBe('#000000');
    expect(analysis.blackMetrics.cmyk).toEqual([0, 0, 0, 100]);
    expect(analysis.whiteMetrics.cmyk).toEqual([0, 0, 0, 0]);
    expect(analysis.shadeRecordCount).toBe(22);
    expect(analysis.firstShadeRecord).toMatchObject({
      baseHex: '#000000',
      shade: '50',
      textColor: '#FFFFFF',
    });
    expect(consoleErrors, 'Color analysis helpers should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('renders an accessible contrast matrix in the workbench', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.goto(`${BASE}/tools/color-chart.html?c=000000,ffffff`, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('region', { name: 'Analysis workbench' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Contrast Matrix' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Contrast matrix summary')).toContainText('22 shades');
    await expect(page.getByLabel('Contrast matrix table')).toContainText('21.00:1');
    await expect(page.getByLabel('Contrast matrix table')).toContainText('AAA');
    expect(consoleErrors, 'Contrast Matrix should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('renders the full analysis workbench toolset', async ({ page, consoleErrors }) => {
    await stubColorNameApi(page);
    await page.goto(`${BASE}/tools/color-chart.html?c=0EA6CC,C73A28,FFFFFF,000000`, { waitUntil: 'domcontentloaded' });

    const tabNames = [
      'Contrast Matrix',
      'Tokens',
      'Roles',
      'Audit',
      'Themes',
      'Compare',
      'Vision',
      'Preview',
      'Image Picker',
    ];

    for (const name of tabNames) {
      await expect(page.getByRole('tab', { name })).toBeVisible();
    }
    await expect(page.getByRole('tab', { name: 'Harmony' })).toHaveCount(0);

    await page.getByRole('tab', { name: 'Tokens' }).click();
    await expect(page.getByLabel('Token export output')).toHaveValue(/--color-1-500: #C73A28;/);

    await page.getByRole('tab', { name: 'Roles' }).click();
    await expect(page.getByLabel('Semantic role mapper')).toContainText('primary');
    await expect(page.getByLabel('Semantic role mapper')).toContainText('Shared roles');
    await expect(page.getByLabel('Semantic role mapper')).toContainText('Light mode roles');
    await expect(page.getByLabel('Semantic role mapper')).toContainText('Dark mode roles');
    await expect(page.getByLabel('light background role color')).toBeVisible();
    await expect(page.getByLabel('dark background role color')).toBeVisible();

    await page.getByRole('tab', { name: 'Audit' }).click();
    await expect(page.getByLabel('Palette audit results')).toContainText('Palette audit');

    await page.getByRole('tab', { name: 'Themes' }).click();
    await expect(page.getByLabel('Theme builder results')).toContainText('Light theme');
    await expect(page.getByLabel('Theme builder results')).toContainText('Dark theme');

    await page.getByRole('tab', { name: 'Compare' }).click();
    await page.getByLabel('Comparison palette input').fill('#0EA6CC, #FF0000');
    await expect(page.getByLabel('Palette comparison results')).toContainText('Nearest match');
    await expect(page.getByLabel('Palette comparison results')).toContainText('#FF0000');

    await page.getByRole('tab', { name: 'Vision' }).click();
    await expect(page.getByLabel('Color vision simulation')).toContainText('Deuteranopia');

    await page.getByRole('tab', { name: 'Preview' }).click();
    await expect(page.getByLabel('UI preview board')).toContainText('Sample Button');
    await expect(page.getByLabel('UI preview board')).toContainText('Light Mode');
    await expect(page.getByLabel('UI preview board')).toContainText('Dark Mode');

    await page.getByRole('tab', { name: 'Image Picker' }).click();
    await expect(page.getByLabel('Image palette region picker')).toContainText('Upload, paste, or drop an image');

    expect(consoleErrors, 'Full workbench should not create console errors').toHaveLength(0);
  });
});