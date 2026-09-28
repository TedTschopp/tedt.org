import test from 'node:test';
import assert from 'node:assert/strict';
import { contractOutcomes } from '../../js/game-theory/incentive-designer.mjs';
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9);
test('speed rewards shortcuts; quality and actual customer value give different incentives', () => {
  assert.deepEqual(contractOutcomes().best, ['rush']);
  assert.deepEqual(contractOutcomes({ contract: 'quality' }).best, ['coast']);
  assert.deepEqual(contractOutcomes({ contract: 'value' }).best, ['careful']);
  assert.deepEqual(contractOutcomes({ contract: 'value', alignment: 0 }).best, ['rush']);
});
test('monitoring reduces inflated output and fines can change a best response', () => {
  const hidden = contractOutcomes({ contract: 'reported' }), observed = contractOutcomes({ contract: 'reported', monitoring: 100 });
  assert.deepEqual(hidden.best, ['rush']); assert.deepEqual(observed.best, ['coast']);
  near(hidden.rows.find(r => r.id === 'rush').reported, 14); near(observed.rows.find(r => r.id === 'rush').reported, 8);
});
test('transfers cancel in group totals and the worked example is exact', () => {
  const careful = contractOutcomes().rows.find(r => r.id === 'careful');
  near(careful.personal, 4); near(careful.organization, 9.1); near(careful.total, 13.1);
  for (const contract of ['speed', 'quality', 'reported', 'value']) for (const monitoring of [0, 50, 100]) {
    for (const row of contractOutcomes({ contract, monitoring, rate: 2.5 }).rows) {
      near(row.total, row.value - row.cost - 2 * monitoring / 100);
    }
  }
});
test('retains exact ties and bounds parameters', () => {
  assert.deepEqual(contractOutcomes({ contract: 'speed', rate: 0.25 }).best, ['coast', 'rush']);
  assert.throws(() => contractOutcomes({ monitoring: 101 }), RangeError);
});
