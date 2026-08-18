import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { consoleErrorsFixture } from './helpers/console';

declare const process: { env: Record<string, string | undefined> };
declare const Buffer: { from(input: string): Uint8Array };

const BASE = process.env.PROD_BASE || 'http://127.0.0.1:4000';
const TOOL_URL = `${BASE}/tools/markdown-frontmatter-preview.html`;

consoleErrorsFixture.describe('Markdown Front Matter Workbench', () => {
  consoleErrorsFixture('preserves the existing document editor and preview workflow', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Markdown Front Matter Workbench' })).toBeVisible();
    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(/title: Markdown Front Matter Preview/);
    await expect(page.getByRole('button', { name: 'YAML Front Matter' })).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('heading', { name: 'Rendered Markdown' })).toBeVisible();
    await expect(page.locator('#markdownPreviewBody')).toContainText('Live preview, without the guesswork');
    expect(consoleErrors, 'The existing editor and preview should render without console errors').toHaveLength(0);
  });

  consoleErrorsFixture('converts sanitized rich clipboard HTML without changing the document', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    const source = `---\ntitle: Existing document\n---\n\nKeep this body.`;
    await page.getByLabel('Markdown or HTML with YAML front matter').fill(source);
    await page.getByRole('tab', { name: 'Rich Import' }).click();

    await page.getByLabel('Rich text or HTML to convert').evaluate((element) => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/html', `
        <h2>Imported section</h2>
        <p>A <strong>useful</strong> link to <a href="https://example.com">Example</a>.</p>
        <table><tr><th>Name</th><th>Role</th></tr><tr><td>Ada</td><td>Engineer</td></tr></table>
        <script>window.__richImportExecuted = true</script>
      `);
      clipboardData.setData('text/plain', 'Imported section');
      element.dispatchEvent(new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      }));
    });

    const convertedMarkdown = page.getByRole('textbox', { name: 'Converted Markdown', exact: true });
    await expect(convertedMarkdown).toHaveValue(/## Imported section/);
    await expect(convertedMarkdown).toHaveValue(/\*\*useful\*\*/);
    await expect(convertedMarkdown).toHaveValue(/\| Name \| Role \|/);
    await expect(convertedMarkdown).not.toHaveValue(/script|__richImportExecuted/);
    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(source);
    expect(await page.evaluate(() => Boolean((window as any).__richImportExecuted))).toBe(false);
    expect(consoleErrors, 'Rich import should sanitize and convert without console errors').toHaveLength(0);
  });

  consoleErrorsFixture('smart-pastes rich content only inside the Markdown body', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    const source = `---\ntitle: Protected metadata\n---\n\nExisting body.`;
    const editor = page.getByLabel('Markdown or HTML with YAML front matter');
    await editor.fill(source);
    await expect(page.getByRole('radio', { name: 'Smart paste' })).toBeChecked();
    await editor.evaluate((element: HTMLTextAreaElement) => {
      element.setSelectionRange(element.value.length, element.value.length);
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/html', '<h2>Added section</h2><p><strong>Rich</strong> body.</p>');
      clipboardData.setData('text/plain', 'Added section Rich body.');
      element.dispatchEvent(new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      }));
    });

    await expect(editor).toHaveValue(/^---\ntitle: Protected metadata\n---/);
    await expect(editor).toHaveValue(/Existing body\.## Added section\n\n\*\*Rich\*\* body\./);
    expect(consoleErrors, 'Smart body paste should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('routes rich paste away from front matter without changing the document', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    const source = `---\ntitle: Protected metadata\n---\n\nExisting body.`;
    const editor = page.getByLabel('Markdown or HTML with YAML front matter');
    await editor.fill(source);
    await editor.evaluate((element: HTMLTextAreaElement) => {
      const titleStart = element.value.indexOf('Protected metadata');
      element.setSelectionRange(titleStart, titleStart + 'Protected metadata'.length);
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/html', '<h2>Imported safely</h2><p>Do not overwrite YAML.</p>');
      clipboardData.setData('text/plain', 'Imported safely');
      element.dispatchEvent(new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      }));
    });

    await expect(editor).toHaveValue(source);
    await expect(page.getByRole('tab', { name: 'Rich Import' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('textbox', { name: 'Converted Markdown', exact: true })).toHaveValue(/## Imported safely/);
    await expect(page.getByRole('status')).toContainText(/front matter/i);
    expect(consoleErrors, 'Protected rich paste should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('appends converted Markdown while preserving front matter and existing body', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    const source = `---\ntitle: Existing document\n---\n\nOriginal body.`;
    await page.getByLabel('Markdown or HTML with YAML front matter').fill(source);
    await page.getByRole('tab', { name: 'Rich Import' }).click();
    await page.getByLabel('Rich text or HTML to convert').fill('## Imported section\n\nNew body.');
    await page.getByRole('button', { name: 'Append to body' }).click();

    await expect(page.getByRole('tab', { name: 'Document' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(
      `---\ntitle: Existing document\n---\n\nOriginal body.\n\n## Imported section\n\nNew body.`
    );
    expect(consoleErrors, 'Appending converted Markdown should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('loads and sanitizes a local HTML file', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Rich Import' }).click();

    await page.setInputFiles('#richImportFileInput', {
      name: 'meeting-notes.html',
      mimeType: 'text/html',
      buffer: Buffer.from('<h1>Meeting notes</h1><ul><li>First item</li><li>Second item</li></ul><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" onerror="window.__fileImportExecuted=true">'),
    });

    const convertedMarkdown = page.getByRole('textbox', { name: 'Converted Markdown', exact: true });
    await expect(convertedMarkdown).toHaveValue(/# Meeting notes/);
    await expect(convertedMarkdown).toHaveValue(/-\s+First item/);
    await expect(page.getByRole('status')).toContainText(/meeting-notes\.html/i);
    expect(await page.evaluate(() => Boolean((window as any).__fileImportExecuted))).toBe(false);
    expect(consoleErrors, 'HTML file conversion should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('opens a Markdown file with front matter as the active document', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Rich Import' }).click();
    const markdownDocument = `---\ntitle: Imported file\ndescription: File import test\n---\n\n# Imported body`;

    await page.setInputFiles('#richImportFileInput', {
      name: 'imported-file.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from(markdownDocument),
    });

    await expect(page.getByRole('button', { name: 'Open as document' })).toBeEnabled();
    await page.getByRole('button', { name: 'Open as document' }).click();
    await expect(page.getByRole('tab', { name: 'Document' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(markdownDocument);
    await expect(page.locator('#markdownPreviewBody')).toContainText('Imported body');
    expect(consoleErrors, 'Opening a Markdown document should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('adds optional Tedt.org publishing-readiness checks', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Markdown or HTML with YAML front matter').fill(`---
title: Incomplete post
image: img/example.webp
mermaid: false
---

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\``);

    await page.getByLabel('Validation profile').selectOption('tedt');
    const findings = page.getByRole('region', { name: 'Publishing readiness' });
    await expect(findings).toContainText('Missing layout');
    await expect(findings).toContainText('Missing description');
    await expect(findings).toContainText('Missing date');
    await expect(findings).toContainText('Missing categories');
    await expect(findings).toContainText('Image paths should start with /');
    await expect(findings).toContainText('image-alt is required when image is set');
    await expect(findings).toContainText('Mermaid content requires mermaid: true');
    expect(consoleErrors, 'Tedt.org validation should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('migrates the legacy content cookie to localStorage and deletes it', async ({ page, context, consoleErrors }) => {
    const legacyDocument = `---\ntitle: Migrated draft\n---\n\nPrivate local content.`;
    await context.addCookies([{
      name: 'tedt_markdown_frontmatter_preview',
      value: encodeURIComponent(legacyDocument),
      url: `${BASE}/`,
    }]);

    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(legacyDocument);
    const persistedState = await page.evaluate(() => ({
      document: localStorage.getItem('tedt:tools:markdown-frontmatter-workbench:v2'),
      cookie: document.cookie,
    }));
    expect(persistedState.document).toBe(legacyDocument);
    expect(persistedState.cookie).not.toContain('tedt_markdown_frontmatter_preview=');
    expect(consoleErrors, 'Legacy state migration should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('fails safely when the sanitizer library is unavailable', async ({ page }) => {
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/dompurify/**', route => route.fulfill({
      contentType: 'application/javascript',
      body: '',
    }));

    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('alert')).toContainText(/DOMPurify/i);
    await expect(page.getByLabel('Markdown or HTML with YAML front matter')).toHaveValue(/Markdown Front Matter Preview/);
    await expect(page.getByRole('button', { name: 'Convert HTML' })).toBeDisabled();
    await expect(page.locator('#markdownPreviewBody')).toContainText(/preview unavailable/i);
  });

  consoleErrorsFixture('replaces only the Markdown body and can undo the change', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    const original = `---\ntitle: Protected metadata\n---\n\nOriginal body.`;
    const editor = page.getByLabel('Markdown or HTML with YAML front matter');
    await editor.fill(original);
    await page.getByRole('tab', { name: 'Rich Import' }).click();
    await page.getByLabel('Rich text or HTML to convert').fill('# Replacement body');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Replace body' }).click();

    await expect(editor).toHaveValue(`---\ntitle: Protected metadata\n---\n\n# Replacement body`);
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(editor).toHaveValue(original);
    expect(consoleErrors, 'Replace and undo should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('reads rich clipboard data from the Rich Import Paste button', async ({ page, consoleErrors }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          read: async () => [{
            types: ['text/html', 'text/plain'],
            getType: async (type: string) => new Blob([
              type === 'text/html' ? '<h2>Clipboard heading</h2><p><em>Formatted</em> text.</p>' : 'Clipboard heading Formatted text.'
            ], { type }),
          }],
          writeText: async () => undefined,
        },
      });
    });
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Rich Import' }).click();
    await page.getByRole('button', { name: 'Paste clipboard' }).click();

    await expect(page.getByRole('textbox', { name: 'Converted Markdown', exact: true })).toHaveValue(/## Clipboard heading/);
    await expect(page.getByRole('textbox', { name: 'Converted Markdown', exact: true })).toHaveValue(/\*Formatted\*/);
    expect(consoleErrors, 'Rich clipboard button paste should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('updates the rendered import preview when converted Markdown is edited', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Rich Import' }).click();
    const converted = page.getByRole('textbox', { name: 'Converted Markdown', exact: true });
    await page.getByLabel('Rich text or HTML to convert').fill('Initial text');
    await converted.fill('## Edited result\n\nThe preview follows this source.');

    await expect(page.locator('#richImportPreview').getByRole('heading', { name: 'Edited result' })).toBeVisible();
    await expect(page.locator('#richImportPreview')).toContainText('The preview follows this source.');
    expect(consoleErrors, 'Editing converted Markdown should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('uses Smart paste for the Document Paste button', async ({ page, consoleErrors }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          read: async () => [{
            types: ['text/html', 'text/plain'],
            getType: async (type: string) => new Blob([
              type === 'text/html' ? '<h2>Button paste</h2><p><strong>Converted</strong> safely.</p>' : 'Button paste Converted safely.'
            ], { type }),
          }],
          readText: async () => 'Button paste Converted safely.',
          writeText: async () => undefined,
        },
      });
    });
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    const editor = page.getByLabel('Markdown or HTML with YAML front matter');
    const original = `---\ntitle: Protected\n---\n\nExisting.`;
    await editor.fill(original);
    await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(element.value.length, element.value.length));
    await page.getByRole('button', { name: 'Paste', exact: true }).click();

    await expect(editor).toHaveValue(/^---\ntitle: Protected\n---/);
    await expect(editor).toHaveValue(/## Button paste/);
    await expect(editor).toHaveValue(/\*\*Converted\*\* safely\./);
    expect(consoleErrors, 'Document Smart Paste button should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('supports keyboard workspace navigation without accessibility violations', async ({ page, consoleErrors }) => {
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    const documentTab = page.getByRole('tab', { name: 'Document' });
    const richImportTab = page.getByRole('tab', { name: 'Rich Import' });
    await documentTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(richImportTab).toBeFocused();
    await expect(richImportTab).toHaveAttribute('aria-selected', 'true');

    const headersFit = await page.evaluate(() => Array.from(document.querySelectorAll('.panel-header'))
      .filter((header) => !header.closest('[hidden]'))
      .every((header) => {
        const parentRect = header.getBoundingClientRect();
        return Array.from(header.children).every((child) => {
          const childRect = child.getBoundingClientRect();
          return childRect.left >= parentRect.left && childRect.right <= parentRect.right;
        });
      }));
    expect(headersFit).toBe(true);

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations, JSON.stringify(axeResults.violations, null, 2)).toHaveLength(0);
    expect(consoleErrors, 'Accessible workspace navigation should not create console errors').toHaveLength(0);
  });

  consoleErrorsFixture('fits the workbench within a mobile viewport', async ({ page, consoleErrors }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(TOOL_URL, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Rich Import' }).click();

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: document.documentElement.scrollWidth,
      headerChildrenFit: Array.from(document.querySelectorAll('#richImportWorkspace .panel-header > *')).every((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= document.documentElement.clientWidth;
      }),
    }));
    expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.headerChildrenFit).toBe(true);
    await expect(page.getByRole('button', { name: 'Append to body' })).toBeVisible();
    expect(consoleErrors, 'Mobile workbench should not create console errors').toHaveLength(0);
  });
});
