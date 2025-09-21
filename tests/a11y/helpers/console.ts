import { Page, test } from '@playwright/test';

export function trackConsoleErrors(page: Page, bucket: string[]) {
  page.on('pageerror', err => bucket.push('PageError: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') bucket.push('ConsoleError: ' + msg.text());
  });
}

export const consoleErrorsFixture = test.extend<{ consoleErrors: string[] }>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    trackConsoleErrors(page, errors);
    await use(errors);
    if (errors.length) {
      console.warn('Console errors captured:', errors);
    }
  }
});
