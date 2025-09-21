import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/a11y',
  timeout: 30_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4000',
    trace: 'off'
  },
  reporter: [['list']],
  webServer: {
    command: 'JEKYLL_ENV=production bundle exec jekyll serve --no-watch --port 4000 --host 127.0.0.1',
    port: 4000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
