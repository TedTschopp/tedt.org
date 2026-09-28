import test from 'node:test';
import assert from 'node:assert/strict';
import { coalitionAnalysis, checkCore, DEFAULT_VALUES } from '../../js/game-theory/coalition-calculator.mjs';
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} differs from ${b}`);
test('exact six-order averages show a Shapley allocation outside the core', () => {
  const result = coalitionAnalysis();
  result.shapley.forEach((value, i) => near(value, [5, 5, 2][i]));
  assert.equal(result.orders.length, 6);
  const core = checkCore(DEFAULT_VALUES, result.shapley);
  assert.equal(core.inCore, false); assert.equal(core.efficient, true);
  assert.ok(core.objections.some(o => o.members.join() === '0,1' && Math.abs(o.gain - 2) < 1e-9));
  assert.equal(checkCore(DEFAULT_VALUES, [6, 6, 0]).inCore, true);
});
test('additive values return individual contributions, preserve symmetry, and pay a dummy zero', () => {
  const values = [0, 3, 3, 6, 0, 3, 3, 6], result = coalitionAnalysis(values);
  near(result.shapley[0], 3); near(result.shapley[1], 3); near(result.shapley[2], 0);
  assert.equal(checkCore(values, result.shapley).inCore, true);
});
test('shares and each order always distribute exactly the full value, even with negative contributions', () => {
  for (let x = 0; x <= 60; x += 3) {
    const values = [0, x, 7, 17, 3, 6, 10, 20]; const result = coalitionAnalysis(values);
    near(result.shapley.reduce((a, b) => a + b, 0), 20);
    for (const row of result.orders) near(row.contributions.reduce((a, b) => a + b, 0), 20);
  }
});
test('the core also requires whole-team efficiency and valid input', () => {
  assert.equal(checkCore([0, 0, 0, 0, 0, 0, 0, 3], [2, 2, 2]).inCore, false);
  assert.throws(() => coalitionAnalysis([1, 2, 3]), RangeError);
});
