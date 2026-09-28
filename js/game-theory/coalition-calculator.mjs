import { loadSettings } from './shared.mjs';
export const JOIN_ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
export const DEFAULT_VALUES = [0, 0, 0, 12, 0, 6, 6, 12];
export function coalitionAnalysis(values = DEFAULT_VALUES) {
  if (!Array.isArray(values) || values.length !== 8 || values[0] !== 0 || values.some(v => !Number.isFinite(v) || v < 0 || v > 60)) throw new RangeError('Supply all eight coalition values from 0 to 60; the empty team has value zero.');
  const shapley = [0, 0, 0];
  const orders = JOIN_ORDERS.map(order => {
    let mask = 0;
    const contributions = [0, 0, 0];
    for (const member of order) { const after = mask | (1 << member); contributions[member] = values[after] - values[mask]; shapley[member] += contributions[member] / 6; mask = after; }
    return { order, contributions };
  });
  return { shapley, equal: Array(3).fill(values[7] / 3), orders };
}
export function checkCore(values, allocation) {
  coalitionAnalysis(values);
  if (!Array.isArray(allocation) || allocation.length !== 3 || allocation.some(v => !Number.isFinite(v))) throw new RangeError('Supply three finite shares.');
  const efficient = Math.abs(allocation.reduce((a, b) => a + b, 0) - values[7]) < 1e-8;
  const objections = [];
  for (let mask = 1; mask < 7; mask++) {
    const members = [0, 1, 2].filter(i => mask & (1 << i));
    const assigned = members.reduce((sum, i) => sum + allocation[i], 0);
    if (values[mask] - assigned > 1e-8) objections.push({ members, assigned, available: values[mask], gain: values[mask] - assigned });
  }
  return { inCore: efficient && !objections.length, efficient, objections };
}
export function mount(root) {
  loadSettings(root);
  const $ = id => root.querySelector(`#coalition-${id}`), names = ['A', 'B', 'C'];
  const fmt = x => Number(x.toFixed(2)).toString();
  let values, model;
  function reset() {
    values = [0, ...[1, 2, 3, 4, 5, 6, 7].map(mask => Number($(`v${mask}`).value))]; model = coalitionAnalysis(values);
    $('prediction').value = ''; $('result').textContent = 'Predict whether your chosen sharing rule keeps every subgroup satisfied, then divide the project value.';
    $('shares').replaceChildren(); $('orders').replaceChildren(); $('objections').replaceChildren();
  }
  $('allocate').addEventListener('click', () => {
    if (!$('prediction').value) { $('result').textContent = 'Choose a prediction first.'; $('prediction').focus(); return; }
    const allocation = model[$('rule').value], core = checkCore(values, allocation);
    $('shares').replaceChildren();
    names.forEach((name, i) => { const tr = document.createElement('tr'); [name, fmt(model.equal[i]), fmt(model.shapley[i]), fmt(allocation[i])].forEach((x, j) => { const cell = document.createElement(j ? 'td' : 'th'); if (!j) cell.scope = 'row'; cell.textContent = x; tr.append(cell); }); $('shares').append(tr); });
    $('orders').replaceChildren(); model.orders.forEach(row => { const li = document.createElement('li'); li.textContent = `Joining order ${row.order.map(i => names[i]).join(', ')}: added value A ${fmt(row.contributions[0])}, B ${fmt(row.contributions[1])}, C ${fmt(row.contributions[2])}.`; $('orders').append(li); });
    $('objections').replaceChildren(); core.objections.forEach(objection => { const li = document.createElement('li'); li.textContent = `${objection.members.map(i => names[i]).join(' and ')} receive ${fmt(objection.assigned)} together, but can create ${fmt(objection.available)} alone. They could gain ${fmt(objection.gain)} by leaving and sharing it.`; $('objections').append(li); });
    const matches = ($('prediction').value === 'stable') === core.inCore;
    $('result').textContent = `You are A and receive ${fmt(allocation[0])} points. B receives ${fmt(allocation[1])}; C receives ${fmt(allocation[2])}. The whole project distributes ${fmt(values[7])}. ${core.inCore ? 'This allocation is in the core: no subgroup can get more on its own.' : `${core.objections.length} subgroup(s) could gain by leaving. This allocation is outside the core.`} ${matches ? 'Your prediction matches.' : 'Your prediction differs.'} This checks this allocation only; it does not decide whether some other allocation could keep everyone.`;
  });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset)); reset(); return { reset };
}
