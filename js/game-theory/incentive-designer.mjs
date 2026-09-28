import { loadSettings } from './shared.mjs';
export const WORK_ACTIONS = [{ id: 'coast', name: 'Low effort, no shortcut', effort: 0, shortcut: 0 }, { id: 'careful', name: 'High effort, no shortcut', effort: 1, shortcut: 0 }, { id: 'rush', name: 'Low effort with shortcut', effort: 0, shortcut: 1 }, { id: 'intense', name: 'High effort with shortcut', effort: 1, shortcut: 1 }];
export function contractOutcomes({ contract = 'speed', rate = 1, monitoring = 0, alignment = 100, fine = 8 } = {}) {
  if (!['speed', 'quality', 'reported', 'value'].includes(contract) || !Number.isFinite(rate) || rate < 0 || rate > 3 || !Number.isFinite(monitoring) || monitoring < 0 || monitoring > 100 || !Number.isFinite(alignment) || alignment < 0 || alignment > 100 || !Number.isFinite(fine) || fine < 0 || fine > 20) throw new RangeError('Contract controls are outside the model’s range.');
  const rows = WORK_ACTIONS.map(action => {
    const units = 4 + 2 * action.effort + 4 * action.shortcut;
    const quality = 80 + 15 * action.effort - 50 * action.shortcut;
    const value = 3 * units * quality / 100;
    const cost = 1 + 3 * action.effort + action.shortcut;
    const reported = units + 6 * action.shortcut * (1 - monitoring / 100);
    const measuredValue = alignment / 100 * value + (1 - alignment / 100) * units;
    const metric = { speed: units, quality: quality / 10, reported, value: measuredValue }[contract];
    const penalty = action.shortcut * monitoring / 100 * fine;
    const wage = 2 + rate * metric - penalty;
    const personal = wage - cost, organization = value - wage - 2 * monitoring / 100;
    return { ...action, units, quality, value, cost, reported, metric, penalty, wage, personal, organization, total: personal + organization };
  });
  const best = Math.max(...rows.map(r => r.personal));
  return { rows, best: rows.filter(r => Math.abs(r.personal - best) < 1e-8).map(r => r.id) };
}
export function mount(root) {
  loadSettings(root); const $ = id => root.querySelector(`#incentive-${id}`), fmt = n => Number(n.toFixed(2)).toString(); let model;
  function reset() {
    model = contractOutcomes({ contract: $('contract').value, rate: Number($('rate').value), monitoring: Number($('monitoring').value), alignment: Number($('alignment').value), fine: Number($('fine').value) });
    $('prediction').value = ''; $('result').textContent = 'Predict the employee’s most rewarding choice, then choose how you will work.'; $('rows').replaceChildren();
  }
  $('work').addEventListener('click', () => {
    if (!$('prediction').value) { $('result').textContent = 'Choose a prediction first.'; $('prediction').focus(); return; }
    const row = model.rows.find(r => r.id === $('action').value), predicted = model.best.length > 1 ? 'tie' : model.best[0];
    $('rows').replaceChildren(); model.rows.forEach(r => { const tr = document.createElement('tr'); [r.name + (model.best.includes(r.id) ? ' (best personal score)' : ''), fmt(r.units), `${r.quality}%`, fmt(r.metric), fmt(r.wage), fmt(r.cost), fmt(r.personal), fmt(r.organization), fmt(r.total)].forEach((text, i) => { const cell = document.createElement(i ? 'td' : 'th'); if (!i) cell.scope = 'row'; cell.textContent = text; tr.append(cell); }); $('rows').append(tr); });
    $('result').textContent = `You chose ${row.name.toLowerCase()}. Your expected personal score is ${fmt(row.personal)}; the organization’s is ${fmt(row.organization)}; combined, ${fmt(row.total)}. Actual customer value is ${fmt(row.value)}. The contract rewards a measured score of ${fmt(row.metric)}. Best personal choices: ${model.rows.filter(r => model.best.includes(r.id)).map(r => r.name.toLowerCase()).join('; ')}. ${$('prediction').value === predicted ? 'Your prediction matches.' : 'Your prediction differs.'} ${model.best.includes(row.id) ? 'Your choice maximizes your personal score in this model.' : `A best personal choice would add ${fmt(Math.max(...model.rows.map(r => r.personal)) - row.personal)} to your score.`} These are averages over possible monitoring checks, not a random run.`;
  });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset)); reset(); return { reset };
}
