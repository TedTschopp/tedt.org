import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const toolPath = '/tools/quick-study-painter.html';
const photo = {
  name: 'color-blocks.svg',
  mimeType: 'image/svg+xml',
  buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="#e65a35"/><rect x="32" width="32" height="48" fill="#3475cd"/></svg>')
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
});

test('all six media paint a local image and export distinct textured PNGs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(toolPath);
  await expect(page.locator('#save')).toBeEnabled();
  await page.locator('#file').setInputFiles(photo);
  await expect(page.locator('#caption')).toContainText('color-blocks.svg');
  await expect(page.locator('#save')).toBeEnabled();
  const downloadPng = async (slug: string) => {
    const pending = page.waitForEvent('download');
    await page.locator('#save').click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(`color-blocks-${slug}-study.png`);
    const data = await readFile((await download.path())!);
    expect(data.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(data.readUInt32BE(16)).toBe(64);
    expect(data.readUInt32BE(20)).toBe(48);
    return data;
  };
  const media = [
    ['oil', 'oil', 'Oil'], ['water', 'watercolor', 'Watercolor'],
    ['point', 'pointillist', 'Pointillist'], ['gouache', 'gouache', 'Gouache'],
    ['pastel', 'soft-pastel', 'Soft pastel'], ['knife', 'palette-knife', 'Palette knife']
  ];
  await expect(page.getByRole('radio')).toHaveCount(6);
  const paintings = new Set<string>();
  let textured: Buffer = Buffer.alloc(0);
  for (const [medium, slug, caption] of media) {
    await page.locator(`input[name="medium"][value="${medium}"]`).check();
    await expect(page.locator('#save')).toBeEnabled();
    await expect(page.locator('#status')).toContainText('Finished');
    await expect(page.locator('#caption')).toContainText(caption);
    const pixels = await page.locator('#paint').evaluate((canvas: HTMLCanvasElement) => {
      const data = canvas.getContext('2d')!.getImageData(0, 0, 64, 48).data;
      const colors = new Set<string>();
      for (let i = 0; i < data.length; i += 4) colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
      return { colors: colors.size, opaque: data.every((value, index) => index % 4 !== 3 || value === 255) };
    });
    expect(pixels.colors).toBeGreaterThan(10);
    expect(pixels.opaque).toBe(true);
    textured = await downloadPng(slug);
    paintings.add(textured.toString('base64'));
  }
  expect(paintings.size).toBe(6);
  await page.locator('#texture-toggle').uncheck();
  await expect(page.locator('#texture')).toBeHidden();
  const plain = await downloadPng('palette-knife');
  expect(textured.equals(plain)).toBe(false);
  expect(errors).toEqual([]);
});

test('comparison works with Enter and Space and the sample can replace an upload', async ({ page }) => {
  await page.goto(toolPath);
  await expect(page.locator('#save')).toBeEnabled();
  const compare = page.locator('#compare');
  await compare.focus();
  await page.keyboard.press('Enter');
  await expect(compare).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#original')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(compare).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#original')).toBeHidden();
  await page.locator('#file').setInputFiles(photo);
  await expect(page.locator('#caption')).toContainText('color-blocks.svg');
  await page.locator('#sample').click();
  await expect(page.locator('#caption')).toContainText('Lakeside sample');
  await expect(page.locator('#save')).toBeEnabled();
});

test('unreadable files report an error and leave the previous completed painting available', async ({ page }) => {
  await page.goto(toolPath);
  await expect(page.locator('#save')).toBeEnabled();
  await page.locator('#file').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#status')).toContainText('could not read');
  await expect(page.locator('#save')).toBeEnabled();
  await page.locator('#file').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('text') });
  await expect(page.locator('#status')).toContainText('Choose an image');
  await page.locator('#repaint').click();
  await expect(page.locator('#status')).toContainText('Finished');
});

test('dropped and pasted images load without a remote image service', async ({ page }) => {
  const remoteImages: string[] = [];
  page.on('request', request => {
    if (request.resourceType() === 'image' && /^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:')) {
      remoteImages.push(request.url());
    }
  });
  await page.goto(toolPath);
  await expect(page.locator('#save')).toBeEnabled();
  const svg = photo.buffer.toString();
  await page.evaluate(source => {
    const data = new DataTransfer();
    data.items.add(new File([source], 'dropped.svg', { type: 'image/svg+xml' }));
    window.dispatchEvent(new DragEvent('drop', { dataTransfer: data, cancelable: true }));
  }, svg);
  await expect(page.locator('#caption')).toContainText('dropped.svg');
  await expect(page.locator('#save')).toBeEnabled();
  await page.evaluate(source => {
    const data = new DataTransfer();
    data.items.add(new File([source], 'pasted.svg', { type: 'image/svg+xml' }));
    window.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, cancelable: true }));
  }, svg);
  await expect(page.locator('#caption')).toContainText('pasted.svg');
  await expect(page.locator('#save')).toBeEnabled();
  expect(remoteImages).toEqual([]);
});

test('finish now ends playback and changing options safely restarts the painting', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(toolPath);
  await expect(page.locator('#finish')).toBeEnabled();
  await expect(page.locator('#save')).toBeDisabled();
  await page.locator('#detail').selectOption('5');
  await page.locator('input[value="water"]').check();
  await page.locator('#finish').click();
  await expect(page.locator('#save')).toBeEnabled();
  await expect(page.locator('#brush-log')).toContainText('5 passes');
  await expect(page.locator('#caption')).toContainText('Watercolor');
  await expect(page.locator('#progress')).toHaveJSProperty('value', 1);
});

test('mobile layout and controls pass WCAG AA checks', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(toolPath);
  await expect(page.locator('#save')).toBeEnabled();
  await page.getByRole('radio', { name: 'Palette knife', exact: true }).check();
  await expect(page.locator('#save')).toBeEnabled();
  await expect(page.locator('#medium-hint')).toContainText('Angular');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('the catalog includes the new tool', async ({ page }) => {
  await page.goto('/tools/');
  await expect(page.locator('[data-title="quick study painter"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Quick Study Painter', exact: true }).first()).toBeVisible();
});
