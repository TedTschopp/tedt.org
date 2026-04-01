import path from 'node:path';

import { expect } from '@playwright/test';
import { consoleErrorsFixture } from './helpers/console';

const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';
const FIXTURE_PATH = path.resolve(__dirname, '../fixtures/ocr-fixture.png');

consoleErrorsFixture.describe('OCR tool recognition', () => {
  consoleErrorsFixture('extracts text from a tiny fixture image', async ({ page, consoleErrors }) => {
    consoleErrorsFixture.setTimeout(120_000);

    await page.goto(`${BASE}/tools/ocr.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await page.setInputFiles('#ocrFileInput', FIXTURE_PATH);

    await expect(page.locator('#ocrStatus')).toContainText('Completed OCR for', { timeout: 120_000 });
    await expect(page.locator('#ocrCountLabel')).toHaveText('1');
    await expect(page.locator('#ocrFullDocumentSection')).toBeVisible();

    const extracted = await page.locator('#ocrFullDocument').inputValue();
    const normalized = extracted.toUpperCase().replace(/[^A-Z0-9]+/g, '');

    expect(normalized, 'Fixture OCR output should include the rendered word').toContain('OCR');
    expect(consoleErrors, 'OCR recognition path should not emit console errors').toHaveLength(0);
  });
});