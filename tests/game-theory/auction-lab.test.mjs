import test from 'node:test';
import assert from 'node:assert/strict';
import { auctionItem, settleAuction, auctionBatch } from '../../js/game-theory/auction-lab.mjs';
import { seededRandom } from '../../js/game-theory/shared.mjs';

test('payment rule changes price, not highest-bid allocation', () => {
  const input = { bids: [70, 60, 20], values: [80, 90, 30] };
  const first = settleAuction(input), second = settleAuction({ ...input, rule: 'second' });
  assert.equal(first.winner, 0); assert.equal(second.winner, 0);
  assert.equal(first.price, 70); assert.equal(second.price, 60);
  assert.equal(first.profits[0], 10); assert.equal(second.profits[0], 20);
  assert.equal(first.group, first.price + first.profits.reduce((a, b) => a + b, 0));
});
test('tie rule is deterministic and tied second price is not skipped', () => {
  const r = settleAuction({ bids: [50, 50, 10], values: [40, 70, 30], rule: 'second' });
  assert.equal(r.winner, 0); assert.equal(r.price, 50); assert.equal(r.loss, true);
});
test('truthful private-value bidding weakly dominates alternative bids for fixed opponents', () => {
  for (let value = 0; value <= 100; value += 10) for (let rival = 0; rival <= 100; rival += 10) {
    const truthful = settleAuction({ bids: [value, rival], values: [value, 80], rule: 'second' }).profits[0];
    for (let bid = 0; bid <= 120; bid += 10) assert.ok(truthful >= settleAuction({ bids: [bid, rival], values: [value, 80], rule: 'second' }).profits[0]);
  }
});
test('seeded common values agree across bidders but their estimates can differ', () => {
  const a = auctionItem({ mode: 'common', bidders: 8 }, seededRandom(8));
  const b = auctionItem({ mode: 'common', bidders: 8 }, seededRandom(8));
  assert.deepEqual(a, b); assert.equal(new Set(a.values).size, 1); assert.ok(new Set(a.estimates).size > 1);
  assert.deepEqual(auctionBatch({ seed: 100 }), auctionBatch({ seed: 100 }));
});
test('zero error and bids at actual common value cannot create winner losses', () => {
  const r = auctionBatch({ noise: 0, shading: 100, ownShading: 100 });
  assert.equal(r.first.losses, 0); assert.equal(r.second.losses, 0);
});
