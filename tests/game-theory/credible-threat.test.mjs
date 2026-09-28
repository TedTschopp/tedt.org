import test from 'node:test';
import assert from 'node:assert/strict';
import { solveThreat } from '../../js/game-theory/credible-threat.mjs';

test('cheap announcement does not deter profitable entry', () => {
  const model = solveThreat();
  assert.deepEqual(model.responses, ['accommodate']);
  assert.deepEqual(model.equilibria.map(eq => eq.choice), ['enter']);
  assert.deepEqual(model.equilibria[0].payoffs, { incumbent: 3, entrant: 2 });
  assert.equal(model.credibility, 'none');
});

test('enforceable deposit changes the off-path response and deters entry', () => {
  const model = solveThreat({ deposit: 6 });
  assert.deepEqual(model.responses, ['fight']);
  assert.deepEqual(model.equilibria, [{ response: 'fight', choice: 'out', payoffs: { incumbent: 5, entrant: 0 } }]);
  assert.equal(model.payoffs.accommodate.incumbent, -3);
  assert.equal(model.payoffs.fight.incumbent, -2);
});

test('deposit at the threshold preserves both incumbent best responses', () => {
  const model = solveThreat({ deposit: 5 });
  assert.equal(model.credibility, 'tie');
  assert.deepEqual(model.responses, ['accommodate', 'fight']);
  assert.deepEqual(model.equilibria.map(eq => eq.choice), ['enter', 'out']);
});

test('zero entry payoffs retain both entrant choices for every tied reply', () => {
  const model = solveThreat({ deposit: 5, entrantGain: 0, entrantLoss: 0 });
  assert.equal(model.equilibria.length, 4);
  for (const eq of model.equilibria) assert.equal(eq.payoffs.entrant, 0);
});

test('every enumerated branch is sequentially optimal throughout control ranges', () => {
  for (let sharedProfit = 0; sharedProfit <= 10; sharedProfit++) {
    for (let fightCost = 0; fightCost <= 10; fightCost++) {
      for (let deposit = 0; deposit <= 20; deposit++) {
        const model = solveThreat({ sharedProfit, fightCost, deposit });
        for (const eq of model.equilibria) {
          assert.equal(model.payoffs[eq.response].incumbent, Math.max(model.payoffs.fight.incumbent, model.payoffs.accommodate.incumbent));
          assert.ok(eq.payoffs.entrant >= model.payoffs[eq.response].entrant);
          assert.ok(eq.payoffs.entrant >= 0);
        }
      }
    }
  }
});
