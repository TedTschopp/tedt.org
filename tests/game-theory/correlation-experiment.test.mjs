import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeAdvice, drawRecommendation, adviceOutcome } from '../../js/game-theory/correlation-experiment.mjs';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
test('the default mediator has wait indifference and strict go incentives', () => {
  const model = analyzeAdvice();
  assert.equal(model.isCorrelatedEquilibrium, true);
  for (const condition of model.conditions) {
    if (condition.recommendation === 0) { close(condition.follow, 2.5); close(condition.deviate, 2.5); close(condition.weightedGain, 0); }
    else { close(condition.follow, 5); close(condition.deviate, 4); }
  }
  close(model.expected[0], 10 / 3);
  close(model.independentExpected[0], 28 / 9);
  assert.ok(model.expected[0] > model.independentExpected[0]);
});
test('independent fair coin flips are a mixed equilibrium with indifference', () => {
  const model = analyzeAdvice([1, 1, 1, 1]);
  assert.equal(model.isCorrelatedEquilibrium, true);
  assert.deepEqual(model.expected, [2.5, 2.5]);
  assert.deepEqual(model.independent, model.probabilities);
  model.conditions.forEach(condition => close(condition.follow, condition.deviate));
});
test('jointly attractive both-wait advice fails its obedience incentives', () => {
  const model = analyzeAdvice([1, 0, 0, 0]);
  assert.equal(model.isCorrelatedEquilibrium, false);
  assert.deepEqual(model.expected, [4, 4]);
  const wait = model.conditions[0];
  assert.equal(wait.follow, 4); assert.equal(wait.deviate, 5);
});
test('never-sent recommendations have no conditional average and zero weighted gap', () => {
  const model = analyzeAdvice([0, 1, 0, 0]);
  assert.equal(model.isCorrelatedEquilibrium, true);
  const absent = model.conditions.filter(condition => condition.probability === 0);
  assert.equal(absent.length, 2);
  for (const condition of absent) { assert.equal(condition.follow, null); assert.equal(condition.deviate, null); assert.equal(condition.weightedGain, 0); }
});
test('the four probability inequalities equal conditional incentive checks', () => {
  for (let ww = 0; ww <= 3; ww++) for (let wg = 0; wg <= 3; wg++) for (let gw = 0; gw <= 3; gw++) for (let gg = 0; gg <= 3; gg++) {
    const model = analyzeAdvice([ww, wg, gw, gg]);
    if (!model) continue;
    const [a, b, c, d] = model.probabilities;
    const gaps = [-a + b, c - d, -a + c, b - d];
    model.conditions.forEach((condition, index) => {
      close(condition.weightedGain, gaps[index]);
      if (condition.probability) close(condition.weightedGain, condition.probability * (condition.follow - condition.deviate));
    });
    assert.equal(model.isCorrelatedEquilibrium, gaps.every(gap => gap >= -1e-10));
  }
});
test('weights normalize and an empty bag is rejected', () => {
  assert.deepEqual(analyzeAdvice([2, 2, 2, 0]).probabilities, analyzeAdvice().probabilities);
  assert.equal(analyzeAdvice([0, 0, 0, 0]), null);
});
test('sampling honors zero probabilities and choices change the actual score', () => {
  assert.deepEqual(drawRecommendation([0, 1, 0, 0], 0), [0, 1]);
  assert.deepEqual(drawRecommendation([0, 1, 0, 0], 0.999), [0, 1]);
  assert.deepEqual(adviceOutcome([0, 1], true), { actions: [0, 1], you: 1, other: 5, total: 6 });
  assert.deepEqual(adviceOutcome([0, 1], false), { actions: [1, 1], you: 0, other: 0, total: 0 });
});
