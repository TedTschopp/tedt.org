import test from 'node:test';
import assert from 'node:assert/strict';
import { publicGoodsRound, nextContribution } from '../../js/game-theory/public-goods.mjs';

test('one extra contribution can hurt the contributor and help the group', () => {
  const base = publicGoodsRound();
  const extra = publicGoodsRound({ contributions: [6, 5, 5, 5] });
  assert.equal(base.net[0], 15); assert.equal(base.group, 60);
  assert.equal(extra.net[0], 14.5); assert.equal(extra.group, 61);
  assert.equal(extra.marginal, -0.5);
});
test('matching is an external contribution and changes the personal return', () => {
  const r = publicGoodsRound({ contributions: [5, 5], matching: 100 });
  assert.equal(r.sponsor, 10); assert.equal(r.project, 40); assert.equal(r.marginal, 1);
  assert.equal(r.group, 50);
});
test('punishment costs and fines destroy exactly the stated group points', () => {
  const contributions = [0, 5, 5, 10];
  const base = publicGoodsRound({ contributions });
  const punished = publicGoodsRound({ contributions, punishment: true });
  assert.deepEqual(punished.costs, [0, 1, 1, 3]);
  assert.deepEqual(punished.fines, [6, 2, 2, 0]);
  assert.equal(base.group - punished.group, 15);
  assert.deepEqual(publicGoodsRound({ contributions, punishment: true, visible: false }).net, base.net);
});
test('copying requires visibility and repeated play', () => {
  assert.equal(nextContribution({ own: 9 }), 9);
  assert.equal(nextContribution({ own: 9, visible: false }), 5);
  assert.equal(nextContribution({ own: 9, repeated: false }), 5);
});
test('zero and full contributions preserve group accounting across group sizes', () => {
  for (let n = 2; n <= 8; n++) for (const c of [0, 10]) {
    const r = publicGoodsRound({ contributions: Array(n).fill(c), multiplier: 4, matching: 100 });
    assert.equal(r.group, n * (10 - c) + r.project);
  }
});
