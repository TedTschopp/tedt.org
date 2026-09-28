import { defineConfig, devices } from '@playwright/test';
const external = Boolean(process.env.PLAYWRIGHT_BASE_URL);
export default defineConfig({
  testDir: './tests/inside-ai',
  testMatch: '**/*.spec.ts',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  outputDir: 'test-results/inside-ai',
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4174', trace: 'retain-on-failure' },
  ...(external ? {} : { webServer: {
    command: 'bundle exec ruby -run -e httpd _site -p 4174 -b 127.0.0.1',
    url: 'http://127.0.0.1:4174/inside-ai/', timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  }}),
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
