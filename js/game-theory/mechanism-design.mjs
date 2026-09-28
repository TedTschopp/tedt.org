import { loadSettings, seededRandom } from './shared.mjs';
export function allocateItem({ values = [7, 10, 5], reports = [7, 10, 5], rule = 'priority', queue = [0, 1, 2], seed = 42 } = {}) {
  if (!['queue', 'lottery', 'priority', 'auction'].includes(rule) || [values, reports].some(xs => !Array.isArray(xs) || xs.length !== 3 || xs.some(x => !Number.isFinite(x) || x < 0 || x > 30)) || !Array.isArray(queue) || queue.length !== 3 || new Set(queue).size !== 3 || queue.some(i => ![0, 1, 2].includes(i)) || !Number.isInteger(seed) || seed < 0 || seed > 999999) throw new RangeError('Invalid allocation settings.');
  let winner;
  if (rule === 'queue') winner = queue[0];
  else if (rule === 'lottery') winner = Math.floor(seededRandom(seed)() * 3);
  else winner = reports.indexOf(Math.max(...reports)); // Preannounced fixed order: You, B, C.
  const price = rule === 'auction' ? [...reports].sort((a, b) => b - a)[1] : 0;
  const costs = rule === 'queue' ? [0, 1, 2].map(i => 2 - queue.indexOf(i)) : [0, 0, 0];
  const utility = values.map((v, i) => (i === winner ? v - price : 0) - costs[i]);
  return { winner, price, costs, utility, total: utility.reduce((a, b) => a + b, 0) + price, bestValue: Math.max(...values), winnerValue: values[winner], expected: rule === 'lottery' ? values.map(v => v / 3) : null };
}
export function compareReport(settings) {
  const actual = allocateItem(settings);
  const truthful = allocateItem({ ...settings, reports: [settings.values[0], ...settings.reports.slice(1)] });
  return { actual, truthful, gain: actual.utility[0] - truthful.utility[0] };
}
export function lotteryBatch(seed = 42, runs = 600) {
  if (!Number.isInteger(runs) || runs < 1 || runs > 10000) throw new RangeError('Use 1 to 10000 runs.');
  const random = seededRandom(seed), counts = [0, 0, 0];
  for (let i = 0; i < runs; i++) counts[Math.floor(random() * 3)]++;
  return counts;
}
export function mount(root) {
  loadSettings(root); const $ = id => root.querySelector(`#mechanism-${id}`), names = ['You', 'B', 'C'], fmt = n => Number(n.toFixed(2)).toString(); let settings;
  function reset() {
    const place = Number($('place').value), queue = [1, 2]; queue.splice(place, 0, 0);
    settings = { values: [0, 1, 2].map(i => Number($(`value${i}`).value)), reports: [0, 1, 2].map(i => Number($(`report${i}`).value)), rule: $('rule').value, queue, seed: Number($('seed').value) };
    $('prediction').value = ''; $('result').textContent = 'Predict who gets the item, then submit your declared value under the selected rule.'; $('rows').replaceChildren(); $('batch-result').textContent = '';
  }
  $('allocate').addEventListener('click', () => {
    if (!$('prediction').value) { $('result').textContent = 'Choose a prediction first.'; $('prediction').focus(); return; }
    const { actual, truthful, gain } = compareReport(settings);
    $('rows').replaceChildren(); names.forEach((name, i) => { const tr = document.createElement('tr'); [name, fmt(settings.values[i]), fmt(settings.reports[i]), i === actual.winner ? 'Yes' : 'No', fmt(i === actual.winner ? actual.price : 0), fmt(actual.costs[i]), fmt(actual.utility[i])].forEach((text, j) => { const cell = document.createElement(j ? 'td' : 'th'); if (!j) cell.scope = 'row'; cell.textContent = text; tr.append(cell); }); $('rows').append(tr); });
    $('result').textContent = `${names[actual.winner]} ${actual.winner ? 'gets' : 'get'} the item. Your score is ${fmt(actual.utility[0])}. Participants plus the organizer receive ${fmt(actual.total)} points together; the organizer receives ${fmt(actual.price)} in payment. The winner’s actual value is ${fmt(actual.winnerValue)}; the highest actual value available is ${fmt(actual.bestValue)}. ${Number($('prediction').value) === actual.winner ? 'Your prediction matches this outcome.' : 'Your prediction differs from this outcome.'} If only you reported your actual value, ${names[truthful.winner]} would receive the item and your score would be ${fmt(truthful.utility[0])}. Your chosen report changes your score by ${fmt(gain)}. ${actual.expected ? `In the lottery, each person has a 1 in 3 chance. Your long-run average score is ${fmt(actual.expected[0])}; the group’s is ${fmt(actual.expected.reduce((a, b) => a + b, 0))}. One draw can differ from those averages.` : 'This is an exact outcome under the stated rules.'}`;
  });
  $('batch').addEventListener('click', () => { const counts = lotteryBatch(settings.seed); $('batch-result').textContent = `600 lottery draws with seed ${settings.seed}: ${names.map((n, i) => `${n} win${i ? 's' : ''} ${counts[i]} times`).join('; ')}. Every draw uses equal chances. Repeating this button repeats the same draws.`; });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset)); reset(); return { reset };
}
