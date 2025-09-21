import { Page, test } from '@playwright/test';

// Domains / message patterns we deliberately ignore to reduce flakiness.
// Rationale: External 3rd-party resources (ads, analytics, blocked font/icon kits) are outside
// regression scope and produce noisy 403/404 errors in CI / headless environments.
const IGNORE_PATTERNS: RegExp[] = [
  /kit\.fontawesome\.com/,
  /fontawesome/i,
  /google-analytics/i,
  /clarity/i,
  /analytics/i,
];

function isIgnorable(text: string): boolean {
  return IGNORE_PATTERNS.some(r => r.test(text));
}

export function trackConsoleErrors(page: Page, bucket: string[]) {
  page.on('pageerror', err => {
    const msg = 'PageError: ' + err.message;
    if (!isIgnorable(msg)) bucket.push(msg);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!isIgnorable(text)) bucket.push('ConsoleError: ' + text);
    }
  });
}

export const consoleErrorsFixture = test.extend<{ consoleErrors: string[] }>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    trackConsoleErrors(page, errors);
    await use(errors);
    if (errors.length) {
      console.warn('Console errors captured (filtered):', errors);
    }
  }
});
