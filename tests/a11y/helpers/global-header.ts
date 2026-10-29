import { Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

export async function routeSharedHeader(page: Page) {
  const assets = resolve(process.env.HEADER_TEST_BUILD || '_site', 'assets/global-header/v1');
  await page.route('https://tedt.org/assets/global-header/v1/**', async route => {
    const file = new URL(route.request().url()).pathname.split('/').pop()!;
    await route.fulfill({ body: await readFile(join(assets, file)),
      contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'image/svg+xml' });
  });
}
