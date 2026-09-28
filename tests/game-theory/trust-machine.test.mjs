import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPayoff, strategyMove, simulateMatch, runTournament, normalizeOptions, STRATEGIES } from '../../js/game-theory/trust-machine.mjs';

test('stage payoffs reward unilateral defection while cooperation maximizes the sum', () => {
  assert.deepEqual(roundPayoff('C', 'C'), [3, 3]);
  assert.deepEqual(roundPayoff('C', 'D'), [0, 5]);
  assert.deepEqual(roundPayoff('D', 'C'), [5, 0]);
  assert.deepEqual(roundPayoff('D', 'D'), [1, 1]);
  assert.throws(() => roundPayoff('x', 'C'), RangeError);
});

test('mutual tit for tat sustains cooperation without noise', () => {
  const result = simulateMatch('tit-for-tat', 'tit-for-tat', { rounds: 10 });
  assert.deepEqual(result.scores, [30, 30]);
  assert.deepEqual(result.cooperations, [10, 10]);
  assert.equal(result.rounds, 10);
  assert.equal(result.endReason, 'known final round');
});

test('tit for tat retaliates only after observing the completed round', () => {
  const result = simulateMatch('tit-for-tat', 'defect', { rounds: 3 });
  assert.deepEqual(result.history.map(round => round.actual), [['C', 'D'], ['D', 'D'], ['D', 'D']]);
  assert.deepEqual(result.scores, [2, 7]);
});

test('forgiveness extremes and last-round knowledge alter the intended action', () => {
  assert.equal(strategyMove('forgiving', ['D'], { forgiveness: 1 }, () => 0.9), 'C');
  assert.equal(strategyMove('forgiving', ['D'], { forgiveness: 0 }, () => 0), 'D');
  assert.equal(strategyMove('last-round', ['C', 'C'], { ending: 'known', rounds: 3 }), 'D');
  assert.equal(strategyMove('last-round', ['C', 'C'], { ending: 'continuation', rounds: 3 }), 'C');
  const result = simulateMatch('last-round', 'cooperate', { rounds: 3 });
  assert.deepEqual(result.scores, [11, 6]);
});

test('zero continuation always gives exactly one round; cap is enforced', () => {
  const one = simulateMatch('cooperate', 'cooperate', { ending: 'continuation', continuation: 0 });
  assert.equal(one.rounds, 1);
  assert.equal(one.endReason, 'chance ending');
  const capped = simulateMatch('cooperate', 'cooperate', { ending: 'continuation', continuation: 0.95 }, () => 0);
  assert.equal(capped.rounds, 200);
  assert.equal(capped.endReason, '200-round simulation cap');
});

test('mistakes change actual actions and earned payoffs', () => {
  const result = simulateMatch('cooperate', 'cooperate', { rounds: 1, mistakes: 0.5 }, () => 0.1);
  assert.deepEqual(result.history[0].intended, ['C', 'C']);
  assert.deepEqual(result.history[0].actual, ['D', 'D']);
  assert.deepEqual(result.scores, [1, 1]);
});

test('same seed replays stochastic matches and tournaments; another seed changes trials', () => {
  const options = { rounds: 20, mistakes: 0.15, seed: 1234, trials: 3 };
  assert.deepEqual(simulateMatch('random', 'forgiving', options), simulateMatch('random', 'forgiving', options));
  assert.deepEqual(runTournament(options), runTournament(options));
  assert.notDeepEqual(runTournament(options), runTournament({ ...options, seed: 5678 }));
});

test('tournament includes every pair and weights self-play equally', () => {
  const result = runTournament({ rounds: 2, trials: 3 });
  const count = STRATEGIES.length;
  assert.equal(result.encounters, count * (count + 1) / 2 * 3);
  assert.equal(result.totalRounds, result.encounters * 2);
  for (const entry of result.entries) {
    assert.equal(entry.appearances, count * 3);
    assert.equal(entry.rounds, count * 3 * 2);
    assert.ok(entry.pointsPerRound >= 0 && entry.pointsPerRound <= 5);
    assert.ok(entry.cooperationRate >= 0 && entry.cooperationRate <= 1);
  }
  assert.ok(result.combinedPerRound >= 2 && result.combinedPerRound <= 6);
});

test('inputs are bounded to prevent runaway simulations', () => {
  const options = normalizeOptions({ rounds: Infinity, trials: 1000, mistakes: 5, continuation: 1, seed: NaN });
  assert.equal(options.rounds, 10);
  assert.equal(options.trials, 50);
  assert.equal(options.mistakes, 0.5);
  assert.equal(options.continuation, 0.95);
  assert.equal(options.seed, 42);
  assert.throws(() => simulateMatch('unknown', 'cooperate'), RangeError);
});
