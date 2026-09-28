import test from 'node:test';
import assert from 'node:assert/strict';
import { adoptionValue, createScenario, normalizeOptions, stepScenario, summarize } from '../../js/game-theory/coordination-trap.mjs';

test('default all-wait and all-adopt profiles are both stable best responses', () => {
  const options = normalizeOptions();
  const waiting = createScenario(options);
  assert.equal(summarize(stepScenario(waiting, options), options).adopters, 0);
  const adopting = { ...waiting, teams: waiting.teams.map(team => ({ ...team, adopt: true })) };
  const next = stepScenario(adopting, options);
  assert.equal(summarize(next, options).adopters, 8);
  assert.ok(summarize(next, options).values.every(value => value === 4));
  assert.equal(summarize(next, options).combined, 32);
});

test('an isolated adopter bears the cost; other teams use the previous profile', () => {
  const options = normalizeOptions();
  const next = stepScenario(createScenario(options), options, 'adopt');
  const outcome = summarize(next, options);
  assert.equal(outcome.adopters, 1);
  assert.equal(outcome.values[0], -6);
  assert.equal(outcome.combined, -6);
  assert.equal(summarize(stepScenario(next, options), options).adopters, 0);
});

test('five committed teams allow full adoption that persists after commitment expires', () => {
  const options = normalizeOptions({ commitments: 5 });
  let state = createScenario(options);
  assert.equal(summarize(state, options).adopters, 5);
  for (let round = 0; round < 4; round += 1) state = stepScenario(state, options);
  assert.equal(state.review, 4);
  assert.equal(summarize(state, options).adopters, 8);
});

test('commitments expire and do not hide an unprofitable final outcome', () => {
  const options = normalizeOptions({ commitments: 7, benefit: 0 });
  let state = createScenario(options);
  for (let round = 0; round < 3; round += 1) {
    state = stepScenario(state, options);
    assert.equal(summarize(state, options).adopters, 7);
  }
  state = stepScenario(state, options);
  assert.equal(summarize(state, options).adopters, 0);
});

test('funding is a transfer and seed assignment is reproducible', () => {
  const options = normalizeOptions({ initial: 7, support: 4, seed: 120 });
  const state = createScenario(options);
  assert.deepEqual(state, createScenario(options));
  assert.equal(state.teams.filter(team => team.pilot).length, 3);
  assert.equal(state.teams[0].pilot, false);
  const outcome = summarize(state, options);
  assert.equal(outcome.supportUsed, 12);
  assert.equal(outcome.combined - outcome.afterFunding, 12);
});

test('simultaneous updates do not let later teams see earlier teams’ new plans', () => {
  const options = normalizeOptions({ benefit: 14, cost: 7, initial: 3 });
  const state = createScenario(options);
  const next = stepScenario(state, options, 'adopt');
  assert.equal(next.teams.filter(team => team.adopt).length, 1);
  assert.equal(state.teams.filter(team => team.adopt).length, 3);
});

test('actual payoff excludes optimism, and options are bounded', () => {
  const options = normalizeOptions({ expectation: 100, benefit: 10, cost: 6 });
  assert.equal(adoptionValue({ pilot: false }, 0, options), -6);
  const normalized = normalizeOptions({ seed: -1, initial: 50, cost: Infinity });
  assert.equal(normalized.seed, 0);
  assert.equal(normalized.initial, 7);
  assert.equal(normalized.cost, 6);
});
