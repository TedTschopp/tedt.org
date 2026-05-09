import { defineConfig, devices } from '@playwright/test';

const reporter: any[] = [['list']];
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === '1';
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === '1' || !process.env.CI;

const webServer = skipWebServer
  ? undefined
  : {
      command: 'JEKYLL_ENV=production bundle exec jekyll serve --no-watch --port 4000 --host 127.0.0.1',
      port: 4000,
      timeout: 120_000,
      reuseExistingServer
    };

if (process.env.PLAYWRIGHT_ALLURE === '1') {
  reporter.push([
    'allure-playwright',
    {
      outputFolder: 'reports/allure/allure-results'
    }
  ]);
}

export default defineConfig({
  testDir: 'tests/a11y',
  timeout: 30_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4000',
    trace: 'off'
  },
  reporter,
  ...(webServer ? { webServer } : {}),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
