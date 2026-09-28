import test from 'node:test';
import assert from 'node:assert/strict';
import { bargainingOffer } from '../../js/game-theory/bargaining-room.mjs';

test('acceptance compares outside option and fairness separately', () => {
  assert.equal(bargainingOffer({ offer: 30 }).accepted, true);
  assert.equal(bargainingOffer({ offer: 29 }).accepted, false);
  assert.equal(bargainingOffer({ offer: 40, outsideB: 50 }).accepted, false);
});
test('waiting discounts each side independently and can destroy feasible agreement', () => {
  const r = bargainingOffer({ offer: 40, round: 2, patienceA: 50, patienceB: 90 });
  assert.equal(r.a, 15); assert.ok(Math.abs(r.b - 32.4) < 1e-9);
  assert.equal(r.feasible, false);
  assert.equal(bargainingOffer({ offer: 40, round: 1, outsideB: 40 }).accepted, false);
});
test('ultimatum ignores alternatives and rejects to zero', () => {
  const r = bargainingOffer({ offer: 29, ultimatum: true, outsideA: 80, outsideB: 80 });
  assert.equal(r.accepted, false); assert.equal(r.a, 0); assert.equal(r.b, 0);
  assert.equal(bargainingOffer({ offer: 30, ultimatum: true, outsideB: 80 }).accepted, true);
});
test('counteroffer matches your outside option and requires enough surplus', () => {
  const r = bargainingOffer({ round: 1 });
  assert.ok(Math.abs(r.counter * r.discountA - 20) < 1e-9); assert.equal(r.feasible, true);
  assert.equal(bargainingOffer({ outsideA: 80, outsideB: 80 }).feasible, false);
});
