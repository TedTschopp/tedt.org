import test from 'node:test';
import assert from 'node:assert/strict';
import { fishSeason } from '../../js/game-theory/last-fish.mjs';

test('default lake grows after a modest harvest', () => {
  const r = fishSeason();
  assert.equal(r.harvest, 24); assert.equal(r.remaining, 56); assert.equal(r.births, 28); assert.equal(r.stock, 84);
});
test('exhausted stock cannot reproduce and scarcity is shared proportionally', () => {
  const r = fishSeason({ stock: 10, requests: [20, 10, 5, 5] });
  assert.deepEqual(r.catches, [5, 2.5, 1.25, 1.25]); assert.equal(r.stock, 0);
  assert.equal(fishSeason({ stock: 0 }).stock, 0);
});
test('monitoring caps excess and charges every boat', () => {
  const r = fishSeason({ requests: [20, 20, 20, 20], quota: 6, monitoring: 100 });
  assert.deepEqual(r.catches, [6, 6, 6, 6]); assert.deepEqual(r.net, [5, 5, 5, 5]); assert.equal(r.stock, 84);
  assert.deepEqual(fishSeason({ requests: [20, 20, 20, 20], quota: 6, monitoring: 50, growth: 0 }).catches, [13, 13, 13, 13]);
});
test('stock and catches obey resource bounds throughout slider endpoints', () => {
  for (const stock of [0, 1, 50, 80, 100]) for (const request of [0, 6, 20]) for (const growth of [0, 50, 100]) {
    const r = fishSeason({ stock, requests: Array(4).fill(request), growth });
    assert.ok(r.harvest <= stock + 1e-9); assert.ok(r.stock >= 0 && r.stock <= 100);
    assert.equal(r.harvest + r.remaining, stock);
  }
});
