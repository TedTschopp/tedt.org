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

    await expect(page.locator('.color-box')).toHaveCount(121);
    await expect(page.getByLabel('Color list')).toContainText('#101820');
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
});