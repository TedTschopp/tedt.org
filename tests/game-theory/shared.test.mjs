import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRandom, settingValue, loadSettings, scenarioURL } from '../../js/game-theory/shared.mjs';

test('a seed replays a bounded random sequence and different seeds vary', () => {
  const sequence = seed => Array.from({length: 200}, seededRandom(seed));
  assert.deepEqual(sequence(42), sequence(42));
  assert.notDeepEqual(sequence(42), sequence(43));
  assert.ok(sequence(42).every(value => value >= 0 && value < 1));
});
test('scenario numbers reject invalid values and clamp to legal steps', () => {
  const control = {type: 'number', min: '0', max: '100', step: '5'};
  assert.equal(settingValue(control, 'Infinity'), null);
  assert.equal(settingValue(control, ''), null);
  assert.equal(settingValue(control, 'not a number'), null);
  assert.equal(settingValue(control, '103'), '100');
  assert.equal(settingValue(control, '-23'), '0');
  assert.equal(settingValue(control, '12'), '10');
});
test('scenario choices only allow existing options', () => {
  const control = {tagName: 'SELECT', options: [{value: 'cooperate'}, {value: 'defect'}]};
  assert.equal(settingValue(control, 'cooperate'), 'cooperate');
  assert.equal(settingValue(control, '<script>'), null);
});
test('links restore settings while excluding unrelated query and history', () => {
  const controls = [
    {id: 'seed', type: 'number', min: '1', max: '100', step: '1', value: '42'},
    {id: 'shortcut', type: 'checkbox', checked: true}
  ];
  const root = {querySelectorAll: () => controls};
  const url = scenarioURL(root, 'https://tedt.org/game-theory/traffic-paradox/?unrelated=1#history');
  assert.equal(url, 'https://tedt.org/game-theory/traffic-paradox/?seed=42&shortcut=true');
  controls[0].value = '1';
  controls[1].checked = false;
  loadSettings(root, new URL(url).search);
  assert.equal(controls[0].value, '42');
  assert.equal(controls[1].checked, true);
});
