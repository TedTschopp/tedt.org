import test from 'node:test';
import assert from 'node:assert/strict';
import { ORDERS, DEFAULT_APPLICANTS, DEFAULT_TEAMS, validatePreferences, deferredAcceptance, blockingPairs } from '../../js/game-theory/stable-matching.mjs';
test('both proposer sides end in stable complete matches and can favor different sides', () => {
  const a = deferredAcceptance(), t = deferredAcceptance(DEFAULT_APPLICANTS, DEFAULT_TEAMS, 'teams');
  assert.deepEqual(a.matching, [0, 1, 2]); assert.deepEqual(t.matching, [1, 0, 2]);
  assert.equal(a.blocking.length, 0); assert.equal(t.blocking.length, 0);
  for (const result of [a, t]) { assert.equal(new Set(result.matching).size, 3); assert.ok(result.trace.length <= 9); }
});
test('complete strict ranks reject duplicates and out-of-range entries', () => {
  assert.throws(() => validatePreferences([[0, 0, 2], [0, 1, 2], [0, 1, 2]]), RangeError);
  assert.throws(() => validatePreferences([[0, 1, 3], [0, 1, 2], [0, 1, 2]]), RangeError);
  assert.throws(() => deferredAcceptance(DEFAULT_APPLICANTS, DEFAULT_TEAMS, 'unknown'), RangeError);
});
test('blocking pair requires both people to prefer switching', () => {
  assert.deepEqual(blockingPairs(DEFAULT_APPLICANTS, DEFAULT_TEAMS, [0, 1, 2]), []);
  assert.ok(blockingPairs(DEFAULT_APPLICANTS, DEFAULT_TEAMS, [2, 1, 0]).some(([a, t]) => a === 0 && t === 0));
});
test('every three-person applicant profile is stable against varied team profiles on either proposing side', () => {
  for (const x of ORDERS) for (const y of ORDERS) for (const z of ORDERS) {
    const applicants = [x, y, z].map(s => Array.from(s, Number));
    for (const side of ['applicants', 'teams']) for (const teamOrder of ORDERS) {
      const teams = [teamOrder, z, x].map(s => Array.from(s, Number));
      const result = deferredAcceptance(applicants, teams, side);
      assert.deepEqual(result.blocking, []); assert.equal(new Set(result.matching).size, 3);
      const proposals = result.trace.map(r => `${r.proposer}:${r.receiver}`);
      assert.equal(new Set(proposals).size, proposals.length);
    }
  }
});
