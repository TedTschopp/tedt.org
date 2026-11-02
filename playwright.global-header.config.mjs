import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/global-header', outputDir: 'test-results/global-header', timeout: 30000, workers: 1,
  use: { baseURL: process.env.HEADER_TEST_URL || 'http://127.0.0.1:4000', viewport: { width: 1440, height: 1000 } },
  reporter: [['list']],
});
