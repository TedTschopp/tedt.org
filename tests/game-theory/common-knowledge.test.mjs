import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeModel, coordinationOutcome } from '../../js/game-theory/common-knowledge.mjs';

test('initially only A knows the fact', () => {
  const model = knowledgeModel(0);
  assert.deepEqual(model.levels[0], { level: 1, A: true, B: false, everyone: false });
  assert.equal(model.common, false);
});
test('a delivered plan gives both the fact but not both second-order knowledge', () => {
  const model = knowledgeModel(1);
  assert.equal(model.levels[0].everyone, true);
  assert.deepEqual(model.levels[1], { level: 2, A: false, B: true, everyone: false });
});
test('an acknowledgment adds one shared knowledge level', () => {
  const model = knowledgeModel(2);
  assert.equal(model.levels[1].everyone, true);
  assert.deepEqual(model.levels[2], { level: 3, A: true, B: false, everyone: false });
});
test('finite private delivery chains never establish common knowledge', () => {
  for (let delivered = 0; delivered <= 20; delivered++) {
    const model = knowledgeModel(delivered, false, 8);
    assert.equal(model.common, false);
    assert.ok(model.reachableWorlds > 1);
    for (const level of model.levels) assert.equal(level.everyone, level.level <= delivered);
  }
});
test('six positive visible levels do not imply common knowledge', () => {
  const model = knowledgeModel(12);
  assert.ok(model.levels.every(level => level.everyone));
  assert.equal(model.common, false);
});
test('ideal public restriction establishes knowledge at every modeled level', () => {
  for (let delivered = 0; delivered <= 12; delivered++) {
    const model = knowledgeModel(delivered, true, 8);
    assert.equal(model.common, true);
    assert.ok(model.levels.every(level => level.A && level.B));
  }
});
test('action payoffs distinguish successful coordination from costly solo action', () => {
  assert.deepEqual(coordinationOutcome('go', 'go'), { you: 4, other: 4, total: 8 });
  assert.deepEqual(coordinationOutcome('go', 'wait'), { you: -6, other: 0, total: -6 });
  assert.deepEqual(coordinationOutcome('wait', 'go'), { you: 0, other: -6, total: -6 });
  assert.deepEqual(coordinationOutcome('wait', 'wait'), { you: 0, other: 0, total: 0 });
});
