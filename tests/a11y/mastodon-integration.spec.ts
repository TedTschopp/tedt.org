import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ARTICLE = '/Winning-the-Intelligence-Inversion/';
const INSTANCE = 'https://tschopp.net';
const ACCOUNT = '109784960088344792';

function post(id: string, extra = {}) {
  return {
    id, url: `${INSTANCE}/@Ted/${id}`, created_at: '2026-10-25T10:00:00Z', visibility: 'public',
    account: { id: ACCOUNT, username: 'Ted', acct: 'Ted', display_name: 'Ted Tschopp', url: `${INSTANCE}/@Ted` },
    content: '<p>A public discussion with <a href="https://tedt.org/">a link</a>.</p>',
    replies_count: 0, reblogs_count: 2, favourites_count: 3, media_attachments: [], ...extra
  };
}

async function discussion(page: Page, options: { missing?: boolean; failContext?: boolean; descendants?: any[]; hostile?: boolean; offline?: boolean } = {}) {
  let rootRequests = 0;
  await page.route('https://tschopp.net/api/v1/statuses/**', async route => {
    const url = new URL(route.request().url());
    if (options.offline) return route.abort('failed');
    if (url.pathname.endsWith('/context')) {
      return route.fulfill({ status: options.failContext ? 503 : 200,
        json: { ancestors: [], descendants: options.descendants || [] } });
    }
    rootRequests++;
    if (options.missing && rootRequests === 1) return route.fulfill({ status: 404, json: { error: 'Not found' } });
    const id = url.pathname.split('/').at(-1)!;
    return route.fulfill({ json: post(id, options.hostile ? {
      account: { id: ACCOUNT, username: 'Ted', acct: 'Ted', display_name: '<img src=x onerror="window.mastodonInjected=true">', url: `${INSTANCE}/@Ted` },
      content: '<p>Safe text <a href="javascript:window.mastodonInjected=true">unsafe URL</a><script>window.mastodonInjected=true</script><svg onload="window.mastodonInjected=true"></svg><img src=x onerror="window.mastodonInjected=true" alt=":emoji:"></p>'
    } : {}) });
  });
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://www.googletagmanager.com/**', route => route.abort());
  await page.route('https://www.clarity.ms/**', route => route.abort());
});

test('public root, nested replies, and native Mastodon links render without private replies', async ({ page }) => {
  await discussion(page, { descendants: [
    post('9001', { in_reply_to_id: '115628535544786819', content: '<p>First public reply</p>' }),
    post('9002', { in_reply_to_id: '9001', content: '<p>Nested public reply</p>' }),
    post('9003', { in_reply_to_id: '9001', content: '<p>Private reply</p>', visibility: 'private' }),
    post('9002', { in_reply_to_id: '9001', content: '<p>Nested public reply</p>' })
  ] });
  await page.goto(ARTICLE);
  const comments = page.locator('[data-mastodon-discussion]');
  await expect(comments.getByRole('status')).toHaveText('Discussion loaded.');
  await expect(comments.locator('.mastodon-post')).toHaveCount(3);
  await expect(comments).not.toContainText('Private reply');
  await expect(comments.getByText('Nested public reply', { exact: true })).toHaveCount(1);
  const toggle = comments.locator('.mastodon-replies-toggle');
  await expect(toggle).toHaveText('Hide replies');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(comments.getByText('First public reply')).toBeHidden();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  for (const href of await comments.getByRole('link', { name: 'Reply or react on Mastodon' }).evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    expect(href).toMatch(/^https:\/\/tschopp\.net\/@Ted\/\d+$/);
    expect(href).not.toContain('/interact/');
  }
});

test('empty threads show a clear state and hostile fields cannot insert active markup', async ({ page }) => {
  await discussion(page, { hostile: true });
  await page.goto(ARTICLE);
  const comments = page.locator('[data-mastodon-discussion]');
  await expect(comments).toContainText('No public replies yet.');
  await expect(comments).toContainText('<img src=x');
  await expect(comments.locator('script, svg, [onerror], [onload], a[href^="javascript:"]')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).mastodonInjected)).toBeUndefined();
});

test('a deleted root shows an unavailable state and retry can recover', async ({ page }) => {
  await discussion(page, { missing: true });
  await page.goto(ARTICLE);
  const comments = page.locator('[data-mastodon-discussion]');
  await expect(comments.getByRole('status')).toContainText('original Mastodon thread is unavailable');
  await expect(comments.locator('.mastodon-post')).toHaveCount(0);
  await comments.getByRole('button', { name: 'Retry loading comments' }).click();
  await expect(comments.getByRole('status')).toHaveText('Discussion loaded.');
  await expect(comments.getByRole('button', { name: 'Retry loading comments' })).toBeHidden();
});

test('a context outage preserves the root and an offline server preserves the discussion link', async ({ page }) => {
  await discussion(page, { failContext: true });
  await page.goto(ARTICLE);
  const comments = page.locator('[data-mastodon-discussion]');
  await expect(comments.getByRole('status')).toContainText('replies are temporarily unavailable');
  await expect(comments.locator('.mastodon-post')).toHaveCount(1);
  await page.unroute('https://tschopp.net/api/v1/statuses/**');
  await discussion(page, { offline: true });
  await comments.getByRole('button', { name: 'Retry loading comments' }).click();
  await expect(comments.getByRole('status')).toContainText('Comments are temporarily unavailable');
  await expect(comments.getByRole('link', { name: 'Join the discussion on Mastodon' })).toHaveAttribute('href', /^https:\/\/tschopp\.net\/@Ted\/\d+$/);
  await expect(comments.locator('.mastodon-post')).toHaveCount(0);
});

test('comments fit a narrow viewport and pass focused accessibility checks in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await discussion(page);
  await page.goto(ARTICLE);
  await expect(page.locator('[data-mastodon-discussion]')).toContainText('No public replies yet.');
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((node, selected) => node.setAttribute('data-bs-theme', selected), theme);
    const scan = await new AxeBuilder({ page }).include('[data-mastodon-discussion]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(scan.violations.filter(violation => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  }
  const bounds = await page.locator('[data-mastodon-discussion]').evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth }));
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.width + 1);
});

test('timeline resolves an exact string ID by handle before fetching statuses', async ({ page }) => {
  const id = '109286944787814809';
  const requested: string[] = [];
  await page.route('https://twit.social/api/v1/**', async route => {
    const url = new URL(route.request().url());
    requested.push(url.pathname);
    if (url.pathname.endsWith('/lookup')) return route.fulfill({ json: { id, username: 'TedT', url: 'https://twit.social/@TedT' } });
    if (url.pathname.endsWith('/custom_emojis')) return route.fulfill({ json: [] });
    if (url.pathname === `/api/v1/accounts/${id}/statuses`) return route.fulfill({ json: [] });
    return route.fulfill({ status: 404, json: { error: 'Unexpected rounded account ID' } });
  });
  await page.goto('/tools/mastodon/');
  await expect(page.locator('.mt-body')).toContainText('No posts to show');
  expect(requested).toContain('/api/v1/accounts/lookup');
  expect(requested).toContain(`/api/v1/accounts/${id}/statuses`);
  expect(requested.some(url => url.includes('109286944787814820'))).toBe(false);
});
