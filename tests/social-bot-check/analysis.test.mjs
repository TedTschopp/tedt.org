import assert from 'node:assert/strict';
import test from 'node:test';
import { analyze, breakWindows } from '../../tools/social-bot-check/analysis.js';
import { DAY, HOUR } from '../../tools/social-bot-check/common.js';
import { normalizeBluesky, parseBluesky } from '../../tools/social-bot-check/providers/bluesky.js';
import { parseMastodon } from '../../tools/social-bot-check/providers/mastodon.js';

const now = Date.parse('2026-10-01T12:00:00Z');
const profile = { id: 'me', handle: 'test.example', declaredBot: null };
function post(index, overrides = {}) {
  return { id: String(index), authorId: 'me', text: `Different original text ${index}`, time: now - DAY - index * HOUR,
    isBoost: false, isReply: false, parentAuthorId: null, delayMs: null, prompted: null,
    length: 40, hasQuestion: false, hasMedia: true, hasQuote: false, hasLanguage: true, timestampStandard: true, ...overrides };
}
function report(posts, provider = 'bluesky') {
  return analyze({ profile, posts, coverage: { limit: 100, pages: 1, exhausted: true, warnings: [] } }, provider, now);
}

test('a small or private feed cannot become a negative bot verdict', () => {
  const data = report([]);
  assert.equal(data.summary.checked, 0);
  assert.equal(data.summary.smallSample, true);
  assert.ok(data.signals.filter(signal => signal.group === 'behavior').every(signal => signal.status === 'insufficient'));
  assert.equal(data.signals.find(signal => signal.id === 'declared-bot').status, 'unavailable');
});

test('missing parents and prompted replies do not manufacture fast-reply evidence', () => {
  const posts = Array.from({ length: 25 }, (_, index) => post(index, { isReply: true, parentAuthorId: `other-${index}`,
    delayMs: index < 8 ? 1000 : null, prompted: index < 4 ? true : false }));
  const fast = report(posts).signals.find(signal => signal.id === 'fast');
  assert.equal(fast.status, 'insufficient');
  assert.deepEqual(fast.evidenceIds, []);
  assert.match(fast.observed, /4 of 4/);
});

test('a repeated announcement is observable without being labeled AI-generated', () => {
  const posts = Array.from({ length: 20 }, (_, index) => post(index, { text: index < 4 ? 'Recurring announcement' : `Announcement ${index}` }));
  const data = report(posts);
  const signal = data.signals.find(value => value.id === 'repeated');
  assert.equal(signal.status, 'flag');
  assert.equal(signal.evidenceIds.length, 4);
  assert.equal(data.posts.filter(value => value.observedSignals.includes(signal.name)).length, 4);
  assert.match(signal.caveat, /manually pasted/);
});

test('boosted content does not count as the account’s own repeated writing', () => {
  const posts = Array.from({ length: 50 }, (_, index) => post(index, { isBoost: true, authorId: 'someone-else', text: 'Same boosted content' }));
  const data = report(posts);
  assert.equal(data.coverage.ownPosts, 0);
  assert.equal(data.coverage.boosts, 50);
  assert.equal(data.summary.checked, 0);
  assert.equal(data.summary.hourCounts.reduce((sum, count) => sum + count, 0), 0);
});

test('complete rolling windows find breaks across midnight', () => {
  const times = [];
  for (let hour = 0; hour <= 5 * 24; hour++) {
    if (hour % 24 >= 5 && hour % 24 <= 22) times.push(now - 6 * DAY + hour * HOUR);
  }
  const result = breakWindows(times);
  assert.ok(result.total > 0);
  assert.equal(result.withBreak, result.total);
  assert.equal(breakWindows([now - DAY, now]).total, 0);
});

test('future and invalid creation times are excluded from volume and activity', () => {
  const data = report([post(0), post(1, { time: null }), post(2, { time: now + DAY })]);
  assert.equal(data.coverage.invalidDates, 2);
  assert.equal(data.summary.hourCounts.reduce((sum, count) => sum + count, 0), 1);
  assert.equal(data.signals.find(signal => signal.id === 'volume').status, 'insufficient');
});

test('Bluesky links use UTF-8 facets and negative reply delays remain unknown', () => {
  const text = '😀hello example.test';
  const item = { post: { uri: 'at://did:plc:me/app.bsky.feed.post/abc', author: { did: 'did:plc:me', handle: 'me.bsky.social' },
    indexedAt: '2026-10-01T00:00:01.000Z', record: { text, createdAt: '2026-10-01T00:00:00.000Z',
      facets: [{ index: { byteStart: 10, byteEnd: 22 }, features: [{ $type: 'app.bsky.richtext.facet#link' }] }],
      reply: { parent: { uri: 'at://did:plc:other/app.bsky.feed.post/parent' } } } },
    reply: { parent: { uri: 'at://did:plc:other/app.bsky.feed.post/parent', author: { did: 'did:plc:other', handle: 'other.bsky.social' },
      indexedAt: '2026-10-01T00:00:02.000Z', record: { createdAt: '2026-10-01T00:00:02.000Z', text: 'Parent' } } } };
  const value = normalizeBluesky(item, 'did:plc:me');
  assert.equal(value.length, 6);
  assert.equal(value.delayMs, null);
  assert.equal(value.delaySource, null);
});

test('account parsing supports real formats and rejects unrelated or credentialed URLs', () => {
  assert.deepEqual(parseBluesky('https://bsky.app/profile/tedt.org/post/abc'), { actor: 'tedt.org' });
  assert.deepEqual(parseBluesky('@simonwillison'), { actor: 'simonwillison.bsky.social' });
  assert.deepEqual(parseBluesky('at://did:plc:abc/app.bsky.feed.post/one'), { actor: 'did:plc:abc' });
  assert.throws(() => parseBluesky('https://evil.invalid/profile/tedt.org'));
  assert.deepEqual(parseMastodon('@Ted@tschopp.net'), { origin: 'https://tschopp.net', username: 'Ted' });
  assert.deepEqual(parseMastodon('https://tschopp.net/@Ted/123'), { origin: 'https://tschopp.net', username: 'Ted' });
  for (const value of ['Ted', '@Ted@localhost', '@Ted@127.0.0.1', 'http://tschopp.net/@Ted', 'https://user:password@tschopp.net/@Ted', 'https://tschopp.net:8443/@Ted']) {
    assert.throws(() => parseMastodon(value));
  }
});
