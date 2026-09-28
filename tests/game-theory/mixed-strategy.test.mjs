import test from 'node:test';
import assert from 'node:assert/strict';
import { predictNext, probabilities, sampleMove, scoreRound, simulateBatch, worstCaseScore } from '../../js/game-theory/mixed-strategy.mjs';

test('payoff matrix is antisymmetric and each move wins, draws, and loses once', () => {
  for (let player = 0; player < 3; player += 1) {
    const scores = [];
    for (let opponent = 0; opponent < 3; opponent += 1) {
      const score = scoreRound(player, opponent);
      assert.equal(score + scoreRound(opponent, player), 0);
      scores.push(score);
    }
    assert.deepEqual(scores.sort(), [-1, 0, 1]);
  }
  assert.equal(scoreRound(0, 2), 1);
  assert.equal(scoreRound(1, 0), 1);
  assert.equal(scoreRound(2, 1), 1);
  assert.throws(() => scoreRound(3, 0), RangeError);
});

test('weights normalize without introducing moves with zero weight', () => {
  assert.deepEqual(probabilities([6, 2, 2]), [0.6, 0.2, 0.2]);
  assert.equal(sampleMove(probabilities([0, 1, 0]), () => 0), 1);
  assert.equal(sampleMove(probabilities([0, 1, 0]), () => 0.999), 1);
  assert.throws(() => probabilities([0, 0, 0]), RangeError);
  assert.throws(() => probabilities([-1, 2, 1]), RangeError);
});

test('uniform is minimax for the symmetric table and biased mixtures are exploitable', () => {
  assert.equal(worstCaseScore([1, 1, 1]), 0);
  assert.equal(worstCaseScore([1, 0, 0]), -1);
  assert.ok(Math.abs(worstCaseScore([6, 2, 2]) + 0.4) < 1e-10);
  for (let rock = 0; rock <= 10; rock += 1) {
    for (let paper = 0; paper <= 10 - rock; paper += 1) {
      assert.ok(worstCaseScore([rock, paper, 10 - rock - paper]) <= 0);
    }
  }
});

test('prior-only prediction identifies constant moves and repeating cycles', () => {
  const constant = predictNext([0, 0, 0, 0], () => 0);
  assert.equal(constant.prediction, 0);
  assert.equal(constant.move, 1);
  const cycle = predictNext([0, 1, 2, 0, 1, 2, 0, 1, 2], () => 0);
  assert.equal(cycle.prediction, 0);
  assert.equal(cycle.move, 1);
  assert.match(cycle.method, /followed/);
});

test('same history fixes the opponent move regardless of the next player action', () => {
  const prior = [0, 0, 0];
  const committed = predictNext(prior, () => 0.25);
  assert.equal(committed.move, 1);
  assert.deepEqual([0, 1, 2].map(player => scoreRound(player, committed.move)), [-1, 0, 1]);
  assert.deepEqual(prior, [0, 0, 0]);
});

test('batch sampling is reproducible, bounded, zero-sum, and exploits a pure action', () => {
  const batch = simulateBatch([1, 0, 0], { rounds: 1000, seed: 42 });
  assert.deepEqual(batch, simulateBatch([1, 0, 0], { rounds: 1000, seed: 42 }));
  assert.equal(batch.wins + batch.draws + batch.losses, 1000);
  assert.equal(batch.score, batch.wins - batch.losses);
  assert.equal(batch.score + batch.opponentScore, 0);
  assert.deepEqual(batch.actions, [1000, 0, 0]);
  assert.ok(batch.losses >= 999);
  assert.ok(batch.average >= -1 && batch.average <= 1);
});

test('uniform batch remains close to its zero expected score over a long seeded run', () => {
  const batch = simulateBatch([1, 1, 1], { rounds: 5000, seed: 42 });
  assert.ok(Math.abs(batch.average) < 0.08);
  assert.equal(batch.actions.reduce((sum, count) => sum + count, 0), 5000);
});
