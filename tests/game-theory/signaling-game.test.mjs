import test from 'node:test';
import assert from 'node:assert/strict';
import { signalModel } from '../../js/game-theory/signaling-game.mjs';

test('default separating pattern is supported by both sellers’ incentives', () => {
  const r = signalModel();
  assert.equal(r.beliefs.signal.posterior, 1); assert.equal(r.beliefs.plain.posterior, 0);
  assert.equal(r.sellers.good.signal, 16); assert.equal(r.sellers.bad.signal, -2);
  assert.equal(r.stable, true);
});
test('cheap imitation breaks the pattern without magically changing assumed beliefs', () => {
  const r = signalModel({ badCost: 0 });
  assert.equal(r.beliefs.signal.posterior, 1); assert.equal(r.sellers.bad.stable, false); assert.equal(r.stable, false);
});
test('pooling conveys no quality information', () => {
  const r = signalModel({ pattern: 'pool', prior: 30 });
  assert.equal(r.beliefs.signal.posterior, 0.3); assert.equal(r.beliefs.plain.offPath, true);
  assert.equal(r.beliefs.plain.posterior, 0.3);
});
test('zero-probability observations use explicit finite prior fallback', () => {
  for (const prior of [0, 100]) for (const pattern of ['separate', 'pool', 'none']) {
    const r = signalModel({ prior, pattern });
    for (const belief of Object.values(r.beliefs)) { assert.ok(Number.isFinite(belief.posterior)); assert.ok(belief.posterior >= 0 && belief.posterior <= 1); }
  }
});
test('a signal cost is paid even when the modeled buyer does not purchase', () => {
  const r = signalModel({ pattern: 'pool', premium: 15, goodCost: 2, badCost: 10 });
  assert.equal(r.beliefs.signal.buy, false); assert.equal(r.sellers.good.signal, -2); assert.equal(r.sellers.bad.signal, -10);
});
