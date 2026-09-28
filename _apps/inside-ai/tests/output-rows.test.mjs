import test from 'node:test';
import assert from 'node:assert/strict';
import { distribution } from '../src/lib/sampling.js';
import { outputRows, outputRowsHeight } from '../src/lib/output-rows.js';

const logits = Array.from({ length: 100 }, (_, rank) => 10 - rank / 10);

test('diagram rows follow top-k while the full distribution stays unchanged', () => {
  for (const k of [1, 3, 12, 50, 100]) {
    const full = distribution(logits, 0.8, { type: 'top-k', value: k });
    const before = JSON.stringify(full);
    const result = outputRows(full.slice(0, 50), 15);
    assert.equal(result.rows.length, Math.min(k, 15));
    assert.equal(result.retainedCount, k);
    assert.deepEqual(result.rows.map(row => row.rank), Array.from({ length: Math.min(k, 15) }, (_, rank) => rank));
    assert.equal(JSON.stringify(full), before);
    assert.ok(Math.abs(full.reduce((sum, row) => sum + row.probability, 0) - 1) < 1e-12);
  }
});

test('top-p row count follows its full-vocabulary cutoff rather than rounded percentages', () => {
  for (const p of [0.01, 0.1, 0.5, 0.9, 1]) {
    const full = distribution(logits, 0.8, { type: 'top-p', value: p });
    const expected = full[0].cutoffIndex + 1;
    const result = outputRows(full.slice(0, 50), 15);
    assert.equal(result.retainedCount, expected);
    assert.equal(result.rows.length, Math.min(expected, 15));
    assert.equal(result.hiddenCount, expected - result.rows.length);
  }
});

test('selected rows survive zero-valued underflow and tiny displayed probabilities', () => {
  const candidates = [1, 1e-300, 0, 0].map((probability, rank) => ({ rank, probability, cutoffIndex: 2 }));
  const result = outputRows(candidates);
  assert.equal(result.retainedCount, 3);
  assert.deepEqual(result.rows.map(row => row.rank), [0, 1, 2]);
  const legacy = [0, -700, -1000, -Infinity].map((topKLogit, rank) => ({ rank, topKLogit, probability: rank === 0 ? 1 : 0 }));
  assert.deepEqual(outputRows(legacy).rows.map(row => row.rank), [0, 1, 2]);
});

test('the explicit display limit changes only the window and its exact matching height', () => {
  const candidates = distribution(logits, 0.8, { type: 'top-k', value: 100 });
  for (const limit of [5, 10, 15]) {
    const result = outputRows(candidates.slice(0, 50), limit);
    assert.equal(result.rows.length, limit);
    assert.equal(result.retainedCount, 100);
    assert.equal(outputRowsHeight(result.rows.length, 22.4, 8), limit * 22.4 + (limit - 1) * 8);
  }
  assert.deepEqual(outputRows([]), { rows: [], retainedCount: 0, hiddenCount: 0 });
  assert.equal(outputRowsHeight(0, 22.4, 8), 0);
  assert.throws(() => outputRows(candidates, 50257), /row limit/);
});
