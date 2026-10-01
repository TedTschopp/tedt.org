import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const TOOL = '/tools/social-bot-check.html';
const DID = 'did:plc:account001';
const BASE_TIME = Date.parse('2026-09-28T12:00:00Z');
const profile = { did: DID, handle: 'tedt.org', displayName: 'Test Account', followersCount: 42, followsCount: 12,
  postsCount: 40, description: 'Public account fixture', createdAt: '2023-08-01T12:58:28.310Z' };

function bluePost(index: number) {
  const parentDid = `did:plc:parent${index}`;
  const uri = `at://${parentDid}/app.bsky.feed.post/parent${index}`;
  const created = new Date(BASE_TIME - index * 300_000).toISOString();
  const parentTime = new Date(BASE_TIME - index * 300_000 - 30_000).toISOString();
  return { post: { uri: `at://${DID}/app.bsky.feed.post/post${index}`, author: { did: DID, handle: 'tedt.org' },
    indexedAt: created, record: { text: `Distinct response number ${String(index).padStart(2, '0')}. Can you share another example?`,
      createdAt: created, langs: ['en'], reply: { parent: { uri }, root: { uri } } } },
    reply: { parent: { uri, author: { did: parentDid, handle: `parent${index}.bsky.social` }, indexedAt: parentTime,
      record: { text: `Original question ${index}`, createdAt: parentTime } } } };
}

async function noRemoteFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
}

async function stubBluesky(page: Page, options: { secondPageFails?: boolean; repeatedCursor?: boolean } = {}) {
  await noRemoteFonts(page);
  const calls: string[] = [];
  await page.route('https://public.api.bsky.app/xrpc/**', async route => {
    const url = new URL(route.request().url());
    calls.push(url.href);
    if (url.pathname.endsWith('getProfile')) {
      await route.fulfill({ json: profile });
    } else if (url.searchParams.has('cursor') && options.secondPageFails) {
      await route.fulfill({ status: 429, json: { error: 'RateLimitExceeded' } });
    } else {
      const second = url.searchParams.has('cursor');
      const feed = Array.from({ length: second ? 5 : 40 }, (_, index) => bluePost(second ? 40 + index : index));
      if (!second) {
        const boost = bluePost(999);
        boost.post.author = { did: 'did:plc:someoneelse', handle: 'someone.bsky.social' };
        feed.push({ ...boost, reason: { $type: 'app.bsky.feed.defs#reasonRepost', indexedAt: new Date(BASE_TIME).toISOString() } } as any);
      }
      await route.fulfill({ json: { feed, ...((options.secondPageFails || options.repeatedCursor) ? { cursor: 'next-page' } : {}) } });
    }
  });
  return calls;
}

async function checkBluesky(page: Page) {
  await page.goto(TOOL);
  await page.getByLabel('Account or profile URL').fill('tedt.org');
  await page.getByRole('button', { name: 'Check account', exact: true }).click();
  await expect(page.locator('#results')).toBeVisible();
}

test('Bluesky report links evidence, separates boosts, filters posts, and exports its sample', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const calls = await stubBluesky(page);
  await checkBluesky(page);
  await expect(page.locator('#overview')).toContainText('Test Account');
  await expect(page.locator('#coverage')).toContainText('40 original posts and replies, plus 1 boosts or reposts');
  const signal = page.locator('[data-signal="fast"]');
  await signal.locator('summary').click();
  await expect(signal).toContainText('Pattern observed');
  await expect(signal).toContainText('40 of 40');
  await signal.getByRole('button', { name: 'Show matching posts (40)', exact: true }).click();
  await expect(page.locator('#active-filter')).toContainText('Fast unprompted replies');
  await expect(page.locator('#posts > li')).toHaveCount(40);
  await page.getByRole('button', { name: 'Clear signal filter' }).click();
  await page.getByLabel('Show', { exact: true }).selectOption('boosts');
  await expect(page.locator('#posts > li')).toHaveCount(1);
  await expect(page.locator('#posts')).toContainText('Boost / repost');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON report' }).click();
  const download = await downloadEvent;
  const data = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(data.schemaVersion).toBe(1);
  expect(data.provider).toBe('bluesky');
  expect(data.coverage.ownPosts).toBe(40);
  expect(data.coverage.boosts).toBe(1);
  expect(data.signals.find((value: any) => value.id === 'fast').evidenceIds).toHaveLength(40);
  expect(calls).toHaveLength(2);
  expect(errors).toEqual([]);
});

test('shared query parameters select the platform and run a fresh check', async ({ page }) => {
  const calls = await stubBluesky(page);
  await page.goto(`${TOOL}?platform=bluesky&user=tedt.org&limit=100`);
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.getByLabel('Scan up to')).toHaveValue('100');
  expect(new URL(calls[1]).searchParams.get('actor')).toBe(DID);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as any).__copied = value; } } });
  });
  await page.getByRole('button', { name: 'Copy link', exact: true }).click();
  const value = await page.evaluate(() => (window as any).__copied);
  expect(new URL(value).searchParams.get('user')).toBe('tedt.org');
  expect(new URL(value).searchParams.get('limit')).toBe('100');
});

test('API rate limits after a successful page preserve an explicitly partial report', async ({ page }) => {
  await stubBluesky(page, { secondPageFails: true });
  await checkBluesky(page);
  await expect(page.locator('#coverage')).toContainText('The scan stopped early');
  await expect(page.locator('#coverage')).toContainText('request limit');
  await expect(page.locator('#status')).toContainText('some data is incomplete');
  await expect(page.locator('#coverage')).not.toContainText('Reached the end');
});

test('repeated API cursors stop pagination without duplicating the report', async ({ page }) => {
  const calls = await stubBluesky(page, { repeatedCursor: true });
  await checkBluesky(page);
  await expect(page.locator('#coverage')).toContainText('45 original posts and replies');
  await expect(page.locator('#coverage')).toContainText('repeated a pagination cursor');
  expect(calls).toHaveLength(3);
});

test('Mastodon deduplicates pages, respects bot metadata and edits, and renders hostile HTML as text', async ({ page }) => {
  await noRemoteFonts(page);
  const unexpectedRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('unexpected.invalid')) unexpectedRequests.push(request.url()); });
  const account = { id: '123', username: 'Ted', acct: 'Ted', display_name: 'Mastodon Test', url: 'https://mastodon.social/@Ted',
    bot: true, note: '<p>Safe profile <script>window.__htmlExecuted = true</script></p>', statuses_count: 4 };
  const makeStatus = (id: string, extra = {}) => ({ id, account, created_at: '2026-09-28T12:00:00.000Z',
    content: '<p>Ordinary public post</p>', url: `https://mastodon.social/@Ted/${id}`, ...extra });
  const hostile = makeStatus('100', { content: '<p>Safe &amp; sound <strong>bold</strong></p><img src="https://unexpected.invalid/leak"><script>window.__htmlExecuted = true</script><a href="javascript:alert(1)">read</a>' });
  await page.route('https://mastodon.social/api/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/lookup')) await route.fulfill({ json: account });
    else if (url.pathname.endsWith('/statuses/77')) await route.fulfill({ json: makeStatus('77', { account: { id: '456', acct: 'parent' }, created_at: '2026-09-28T11:59:00.000Z' }) });
    else if (url.pathname.endsWith('/statuses/78')) await route.fulfill({ status: 404, json: { error: 'Not found' } });
    else if (!url.searchParams.has('max_id')) await route.fulfill({ json: [hostile,
      makeStatus('99', { in_reply_to_id: '77', in_reply_to_account_id: '456' }),
      makeStatus('98', { in_reply_to_id: '78', in_reply_to_account_id: '456', edited_at: '2026-09-28T12:05:00.000Z' })] });
    else if (url.searchParams.get('max_id') === '98') await route.fulfill({ json: [hostile, makeStatus('97')] });
    else await route.fulfill({ json: [] });
  });
  await page.goto(`${TOOL}?platform=mastodon&user=%40Ted%40mastodon.social&limit=100`);
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#overview')).toContainText('Mastodon Test');
  await expect(page.locator('#coverage')).toContainText('4 original posts and replies');
  await expect(page.locator('#coverage')).toContainText('1 of 2 replies to other accounts have usable timing');
  await expect(page.locator('[data-signal="declared-bot"]')).toContainText('Self-declared bot');
  await expect(page.locator('[data-signal="record-metadata"]')).toContainText('Unavailable');
  await expect(page.locator('#posts')).toContainText('Safe & sound bold');
  await expect(page.locator('#posts')).toContainText('Edited post; excluded from reply timing');
  expect(await page.evaluate(() => (window as any).__htmlExecuted)).toBeUndefined();
  expect(unexpectedRequests).toEqual([]);
  await expect(page.locator('#posts img, #posts script, #posts a[href^="javascript:"]')).toHaveCount(0);
});

test('an invalid address or failed new check cannot leave a stale report visible', async ({ page }) => {
  await stubBluesky(page);
  await checkBluesky(page);
  await page.getByLabel('Site', { exact: true }).selectOption('mastodon');
  await page.getByLabel('Account or profile URL').fill('Ted');
  await page.getByRole('button', { name: 'Check account', exact: true }).click();
  await expect(page.locator('#status')).toContainText('Include the Mastodon server');
  await expect(page.locator('#results')).toBeHidden();
  await page.route('https://mastodon.social/api/**', route => route.fulfill({ status: 403, json: { error: 'Forbidden' } }));
  await page.getByLabel('Account or profile URL').fill('@Ted@mastodon.social');
  await page.getByRole('button', { name: 'Check account', exact: true }).click();
  await expect(page.locator('#status')).toContainText('does not allow this public API request');
  await expect(page.locator('#check-button')).toBeEnabled();
  await expect(page.locator('#results')).toBeHidden();
});

test('cancel aborts an in-flight request and restores the input controls', async ({ page }) => {
  await noRemoteFonts(page);
  let release: (() => void) | undefined;
  await page.route('https://public.api.bsky.app/**', async route => {
    await new Promise<void>(resolve => { release = resolve; });
    await route.abort().catch(() => {});
  });
  await page.goto(TOOL);
  await page.getByLabel('Account or profile URL').fill('tedt.org');
  await page.getByRole('button', { name: 'Check account', exact: true }).click();
  await expect.poll(() => Boolean(release)).toBe(true);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('#status')).toContainText('Check canceled');
  await expect(page.locator('#account')).toBeEnabled();
  await expect(page.locator('#results')).toBeHidden();
  release?.();
});

test('desktop and phone reports have accessible controls and no horizontal overflow', async ({ page }) => {
  await stubBluesky(page);
  await checkBluesky(page);
  const desktop = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(desktop.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Social Bot Check', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(mobile.violations).toEqual([]);
});

test('the published-date tools catalog links directly to the new checker', async ({ page }) => {
  await noRemoteFonts(page);
  await page.goto('/tools/?sort=published');
  const entry = page.getByRole('link', { name: 'Social Bot Check', exact: true });
  await expect(entry).toHaveAttribute('href', TOOL);
  await expect(page.locator('#tools-card-grid > article').first()).toContainText('Social Bot Check');
});
