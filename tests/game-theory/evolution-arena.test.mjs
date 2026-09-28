import test from 'node:test';
import assert from 'node:assert/strict';
import { strategyScores, stepPopulation, invadePopulation, evolvePopulation } from '../../js/game-theory/evolution-arena.mjs';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
test('Hawk and Dove worked examples have the stated averages', () => {
  assert.deepEqual(strategyScores(0.5, 4, 8), { hawk: 1, dove: 1, average: 1 });
  const sparse = strategyScores(0.2, 4, 8);
  close(sparse.hawk, 2.8); close(sparse.dove, 1.6); close(sparse.average, 1.84);
});
test('selection moves toward the interior balance from both sides', () => {
  assert.ok(stepPopulation(0.2) > 0.2);
  assert.ok(stepPopulation(0.8) < 0.8);
  close(stepPopulation(0.5), 0.5);
  close(evolvePopulation(0.2, {}, 200).at(-1), 0.5, 1e-5);
});
test('without mutation, absent behaviors cannot appear before an invasion', () => {
  assert.equal(stepPopulation(0), 0);
  assert.equal(stepPopulation(1), 1);
  close(invadePopulation(0, 'hawk'), 0.02);
  close(invadePopulation(1, 'dove'), 0.98);
  assert.ok(stepPopulation(invadePopulation(0, 'hawk')) > 0.02);
});
test('switching introduces the absent behavior at exactly the mutation fraction', () => {
  close(stepPopulation(0, { mutation: 0.03 }), 0.03);
  close(stepPopulation(1, { mutation: 0.03 }), 0.97);
});
test('Hawk grows with no fighting cost whenever both behaviors are present', () => {
  for (const p of [0.01, 0.2, 0.5, 0.99]) assert.ok(stepPopulation(p, { resource: 4, conflict: 0 }) > p);
});
test('all control ranges keep population fractions finite and bounded', () => {
  for (const resource of [1, 4, 20]) for (const conflict of [0, 8, 40]) for (const mutation of [0, 0.01, 0.1]) for (const p of [0, 0.01, 0.5, 0.99, 1]) {
    const history = evolvePopulation(p, { resource, conflict, mutation }, 200);
    assert.ok(history.every(value => Number.isFinite(value) && value >= 0 && value <= 1));
  }
});
test('an invasion replaces a fraction instead of adding percentages beyond one', () => {
  close(invadePopulation(0.4, 'hawk'), 0.412);
  close(invadePopulation(0.4, 'dove'), 0.392);
});
