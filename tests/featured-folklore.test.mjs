import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import featured from '../assets/js/featured-folklore.js';
const { pickStories } = featured;
const source = new URL('../_data/featured_folklore.json', import.meta.url);
test('the promotion pool contains 99 distinct canonical stories with their own illustrations', async () => {
  const { stories } = JSON.parse(await readFile(source));
  assert.equal(stories.length, 99);
  for (const key of ['id', 'url']) assert.equal(new Set(stories.map(story => story[key])).size, 99);
  assert.equal(new Set(stories.map(story => story.image.src)).size, 99);
  for (const story of stories) {
    assert.match(story.url, /^https:\/\/folklore\.tschopp\.org\/stories\/[a-z0-9-]+\/$/);
    assert.match(story.image.src, /^https:\/\/folklore\.tschopp\.org\/assets\/folklore\/illustrations\/story-/);
    assert.ok(story.image.alt.length > 25);
    assert.equal(story.image.width / story.image.height, 1.5);
    assert.equal(story.image.srcset.split(',').length, 4);
  }
});
test('three unique stories are sampled without mutating the pool', () => {
  const pool = Array.from({ length: 99 }, (_, id) => ({ id }));
  const original = JSON.stringify(pool);
  for (let seed = 1; seed <= 99; seed += 1) {
    let state = seed;
    const random = () => { state = state * 16807 % 2147483647; return (state - 1) / 2147483646; };
    const result = pickStories(pool, 3, random);
    assert.equal(result.length, 3);
    assert.equal(new Set(result.map(story => story.id)).size, 3);
  }
  assert.equal(JSON.stringify(pool), original);
  assert.notDeepEqual(pickStories(pool, 3, () => 0), pickStories(pool, 3, () => 0.999));
});
test('every story can occupy the first card and duplicate IDs cannot repeat', () => {
  const pool = Array.from({ length: 99 }, (_, id) => ({ id }));
  for (let id = 0; id < 99; id += 1) assert.equal(pickStories(pool, 3, () => (id + 0.5) / 99)[0].id, id);
  assert.deepEqual(pickStories([{id:1},{id:1},{id:2}], 3, () => 0).map(story => story.id), [1,2]);
});
