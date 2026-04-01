import { expect } from '@playwright/test';
import { consoleErrorsFixture } from './helpers/console';

const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';

consoleErrorsFixture.describe('OCR tool smoke', () => {
  consoleErrorsFixture('tool page loads core controls', async ({ page, consoleErrors }) => {
    await page.goto(`${BASE}/tools/ocr.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Browser OCR Workspace' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Choose file' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load example PDF' })).toBeVisible();
    await expect(page.getByLabel('Drop a PDF or image here or press Enter to choose a file')).toBeVisible();
    await expect(page.locator('#ocrLanguage')).toBeVisible();
    await expect(page.locator('#ocrStatus')).toContainText('Ready.');
    expect(consoleErrors, 'OCR tool page should load without console errors').toHaveLength(0);
  });

  consoleErrorsFixture('tools index links to OCR tool', async ({ page, consoleErrors }) => {
    await page.goto(`${BASE}/tools/`, { waitUntil: 'domcontentloaded' });
    const card = page.getByRole('link', { name: 'Browser OCR Workspace' }).first();
    await expect(card).toBeVisible();
    await expect(page.locator('[data-title="browser ocr workspace"]')).toBeVisible();
    expect(consoleErrors, 'Tools index should render without console errors during OCR card check').toHaveLength(0);
  });
});