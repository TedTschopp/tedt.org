import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, analyzeGame, unilateralMoves } from '../../js/game-theory/equilibrium-explorer.mjs';

test('Prisoner’s Dilemma has one pure equilibrium despite a better collective outcome', () => {
  const result = analyzeGame(PRESETS.prisoners.payoffs);
  assert.deepEqual(result.equilibria, [[1, 1]]);
  assert.equal(result.maxCombined, 6);
  assert.deepEqual(result.bestCombined, [[0, 0]]);
  const moves = unilateralMoves(PRESETS.prisoners.payoffs, 1, 1);
  assert.equal(moves.combined, 2);
  assert.equal(moves.rowGain, -1);
  assert.equal(moves.columnGain, -1);
});

test('each player gains by defecting alone from mutual cooperation', () => {
  const moves = unilateralMoves(PRESETS.prisoners.payoffs, 0, 0);
  assert.equal(moves.rowAlternative, 5);
  assert.equal(moves.columnAlternative, 5);
  assert.equal(moves.rowGain, 2);
  assert.equal(moves.columnGain, 2);
});

test('Chicken and coordination expose different pairs of pure equilibria', () => {
  assert.deepEqual(analyzeGame(PRESETS.chicken.payoffs).equilibria, [[0, 1], [1, 0]]);
  assert.deepEqual(analyzeGame(PRESETS.coordination.payoffs).equilibria, [[0, 0], [1, 1]]);
});

test('matching pennies has no pure equilibrium, with a profitable move at every cell', () => {
  const game = PRESETS.matching.payoffs;
  assert.deepEqual(analyzeGame(game).equilibria, []);
  for (let r = 0; r < 2; r += 1) for (let c = 0; c < 2; c += 1) {
    const move = unilateralMoves(game, r, c);
    assert.ok(move.rowGain > 0 || move.columnGain > 0);
    assert.equal(move.combined, 0);
  }
});

test('weak best responses preserve every equilibrium when all payoffs tie', () => {
  const result = analyzeGame([[[0, 0], [0, 0]], [[0, 0], [0, 0]]]);
  assert.deepEqual(result.equilibria, [[0, 0], [0, 1], [1, 0], [1, 1]]);
  assert.deepEqual(result.bestRows, [[true, true], [true, true]]);
  assert.deepEqual(result.bestColumns, [[true, true], [true, true]]);
});

test('asymmetric and negative payoffs use each player’s own payoff component', () => {
  const game = [[[-3, 7], [-3, 5]], [[-4, 2], [-2, 2]]];
  const result = analyzeGame(game);
  assert.deepEqual(result.equilibria, [[0, 0], [1, 1]]);
  assert.deepEqual(result.bestRows, [[true, false], [false, true]]);
  assert.deepEqual(result.bestColumns, [[true, false], [true, true]]);
});

test('invalid shapes, nonfinite payoffs, and invalid actions fail explicitly', () => {
  assert.throws(() => analyzeGame([]), TypeError);
  assert.throws(() => analyzeGame([[[NaN, 0], [0, 0]], [[0, 0], [0, 0]]]), TypeError);
  assert.throws(() => unilateralMoves(PRESETS.prisoners.payoffs, 2, 0), RangeError);
});
