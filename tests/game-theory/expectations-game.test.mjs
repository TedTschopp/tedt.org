import test from 'node:test';
import assert from 'node:assert/strict';
import { reasonedNumber, makePopulation, scoreRound, adaptPopulation } from '../../js/game-theory/expectations-game.mjs';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
test('reasoning depth repeats two-thirds and populations contain nineteen opponents', () => {
  close(reasonedNumber(2), 200 / 9);
  assert.equal(makePopulation().length, 19);
  assert.deepEqual(makePopulation().map(player => player.depth).reduce((counts, depth) => { counts[depth]++; return counts; }, [0, 0, 0, 0, 0]), [3, 5, 5, 3, 3]);
});
test('worked example includes the visitor in the average and awards the prize', () => {
  const result = scoreRound(30, makePopulation('0'));
  assert.equal(result.average, 49);
  close(result.target, 98 / 3);
  close(result.distances[0], 8 / 3);
  assert.equal(result.prizes[0], 100);
  assert.equal(result.totalPrize, 100);
});
test('deeper reasoning can lose against a shallow population', () => {
  assert.equal(scoreRound(0, makePopulation('0')).prizes[0], 0);
  assert.equal(scoreRound(33, makePopulation('0')).prizes[0], 100);
});
test('all-zero choices split the prize and any positive unilateral choice loses', () => {
  const population = makePopulation().map(player => ({ ...player, choice: 0 }));
  const result = scoreRound(0, population);
  assert.equal(result.winners.length, 20);
  assert.deepEqual(result.prizes, Array(20).fill(5));
  assert.equal(scoreRound(1, population).prizes[0], 0);
});
test('learning is a bounded update and does not mutate the previous population', () => {
  const initial = makePopulation('0');
  const next = adaptPopulation(initial, 30, 0.5);
  assert.equal(next[0].choice, 40);
  assert.equal(initial[0].choice, 50);
  assert.equal(adaptPopulation(initial, 30, 0)[0].choice, 50);
  assert.equal(adaptPopulation(initial, 30, 1)[0].choice, 30);
});
test('repeated rounds retain bounds and conserve the total prize', () => {
  let population = makePopulation();
  for (let round = 0; round < 30; round++) {
    const result = scoreRound(round % 2 ? 100 : 0, population);
    close(result.totalPrize, 100);
    population = adaptPopulation(population, result.target, 0.8);
    assert.ok(population.every(player => player.choice >= 0 && player.choice <= 100));
  }
});
