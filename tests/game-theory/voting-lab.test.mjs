import test from 'node:test';
import assert from 'node:assert/strict';
import { countVotes, votingComparison } from '../../js/game-theory/voting-lab.mjs';
const ballot = (rank, count = 1, approve = 1) => ({ rank: [...rank], count, approve });
test('a majority cycle has no Condorcet winner and IRV preserves elimination ties', () => {
  const results = countVotes([ballot('ABC'), ballot('BCA'), ballot('CAB')]);
  assert.deepEqual(results.plurality.winners, ['A', 'B', 'C']);
  assert.equal(results.irv.unresolved, true);
  assert.equal(results.pairwise.cycle, true); assert.deepEqual(results.pairwise.winners, []);
  assert.equal(results.pairwise.scores.A.B, 2); assert.equal(results.pairwise.scores.B.A, 1);
});
test('plurality and IRV can differ on the same complete ballots', () => {
  const results = countVotes([ballot('ACB', 4), ballot('BCA', 3), ballot('CBA', 2)]);
  assert.deepEqual(results.plurality.winners, ['A']); assert.deepEqual(results.irv.winners, ['B']);
  assert.deepEqual(results.pairwise.winners, ['C']);
});
test('approval uses independently specified cutoffs and retains ties', () => {
  const results = countVotes([ballot('ABC', 2, 2), ballot('BAC', 2, 2), ballot('CAB', 1, 1)]);
  assert.deepEqual(results.approval.winners, ['A', 'B']); assert.equal(results.approval.scores.C, 1);
});
test('strategic submitted ballot does not mutate genuine preferences', () => {
  const genuine = [ballot('ABC'), ballot('BAC'), ballot('CAB')], before = JSON.stringify(genuine);
  const submitted = [ballot('BAC'), ...genuine.slice(1)];
  const results = votingComparison(genuine, submitted, ['A', 'B', 'C']);
  assert.equal(JSON.stringify(genuine), before); assert.deepEqual(results.honest.plurality.winners, ['A', 'B', 'C']);
  assert.deepEqual(results.submitted.plurality.winners, ['B']);
});
test('four candidates are supported and invalid rankings are rejected', () => {
  assert.deepEqual(countVotes([ballot('DABC', 3), ballot('ABCD')], [...'ABCD']).irv.winners, ['D']);
  assert.throws(() => countVotes([ballot('AAC')]), RangeError);
  assert.throws(() => countVotes([ballot('ABC', 0)]), RangeError);
});
