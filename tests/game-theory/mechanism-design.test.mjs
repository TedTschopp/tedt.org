import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateItem, compareReport, lotteryBatch } from '../../js/game-theory/mechanism-design.mjs';
test('free priority rewards exaggeration but auction overbidding can hurt', () => {
  const settings = { values: [7, 10, 5], reports: [11, 10, 5] };
  assert.equal(compareReport({ ...settings, rule: 'priority' }).gain, 7);
  const auction = compareReport({ ...settings, rule: 'auction' });
  assert.equal(auction.actual.price, 10); assert.equal(auction.actual.utility[0], -3); assert.equal(auction.gain, -3);
});
test('truthful second-price bidding weakly beats every integer misreport for every participant and tested rival report', () => {
  for (let person = 0; person < 3; person++) for (let v = 0; v <= 12; v++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) {
    const values = [0, 0, 0]; values[person] = v;
    const reports = [b, c]; reports.splice(person, 0, v);
    const honest = allocateItem({ rule: 'auction', values, reports }).utility[person];
    assert.ok(honest >= 0);
    for (let report = 0; report <= 15; report++) {
      const changed = [...reports]; changed[person] = report;
      assert.ok(allocateItem({ rule: 'auction', values, reports: changed }).utility[person] <= honest);
    }
  }
});
test('queue costs include losing participants and auction payments are transfers', () => {
  const queue = allocateItem({ rule: 'queue', values: [7, 10, 5], queue: [1, 0, 2] });
  assert.equal(queue.winner, 1); assert.deepEqual(queue.costs, [1, 2, 0]); assert.equal(queue.total, 7);
  const auction = allocateItem({ rule: 'auction' }); assert.equal(auction.total, 10);
  assert.equal(auction.utility.reduce((a, b) => a + b, 0) + auction.price, auction.total);
});
test('lottery is replayable and ignores reports; seeded batches conserve the run count', () => {
  const first = allocateItem({ rule: 'lottery', seed: 98 });
  const changed = allocateItem({ rule: 'lottery', reports: [30, 0, 0], seed: 98 });
  assert.equal(first.winner, changed.winner); assert.deepEqual(first.expected, [7 / 3, 10 / 3, 5 / 3]);
  assert.deepEqual(lotteryBatch(98), lotteryBatch(98)); assert.equal(lotteryBatch().reduce((a, b) => a + b, 0), 600);
});
