import { loadSettings } from './shared.mjs';

const clamp = (value, low, high, fallback = low) => Math.min(high, Math.max(low, Number.isFinite(Number(value)) ? Number(value) : fallback));
export function strategyScores(hawkShare, resource = 4, conflict = 8) {
  const p = clamp(hawkShare, 0, 1);
  const value = clamp(resource, 0, 20);
  const cost = clamp(conflict, 0, 40);
  const hawk = p * (value - cost) / 2 + (1 - p) * value;
  const dove = (1 - p) * value / 2;
  return { hawk, dove, average: p * hawk + (1 - p) * dove };
}
export function stepPopulation(hawkShare, { resource = 4, conflict = 8, mutation = 0 } = {}) {
  const p = clamp(hawkShare, 0, 1);
  const value = clamp(resource, 0, 20);
  const cost = clamp(conflict, 0, 40);
  const scores = strategyScores(p, value, cost);
  const baseline = 1 + value + cost;
  const selected = p * (baseline + scores.hawk) / (baseline + scores.average);
  const rate = clamp(mutation, 0, 0.5);
  return clamp(rate + (1 - 2 * rate) * selected, 0, 1);
}
export function invadePopulation(hawkShare, strategy = 'hawk', fraction = 0.02) {
  const rate = clamp(fraction, 0, 1);
  return (1 - rate) * clamp(hawkShare, 0, 1) + (strategy === 'hawk' ? rate : 0);
}
export function evolvePopulation(hawkShare, settings, generations = 20) {
  const history = [clamp(hawkShare, 0, 1)];
  for (let n = 0; n < Math.floor(clamp(generations, 0, 200)); n++) history.push(stepPopulation(history.at(-1), settings));
  return history;
}

export function mount(root) {
  loadSettings(root);
  const find = key => root.querySelector(`[data-evolution-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ resource: Number(control('resource').value), conflict: Number(control('conflict').value), mutation: Number(control('mutation').value) / 100 });
  const fmt = value => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  let share;
  let generation;
  function render() {
    const scores = strategyScores(share, settings().resource, settings().conflict);
    find('population').textContent = `Generation ${generation}: ${fmt(100 * share)}% Hawk and ${fmt(100 * (1 - share))}% Dove. Expected points per encounter: Hawk ${fmt(scores.hawk)}, Dove ${fmt(scores.dove)}, population average ${fmt(scores.average)}.`;
    find('bar').value = 100 * share;
    find('bar').textContent = `${fmt(100 * share)}% Hawk`;
    find('continue').disabled = generation >= 200;
    find('invade').disabled = generation >= 200;
  }
  function addRow() {
    const scores = strategyScores(share, settings().resource, settings().conflict);
    const row = document.createElement('tr');
    [generation, `${fmt(100 * share)}%`, fmt(scores.hawk), fmt(scores.dove), fmt(scores.average)].forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td'); if (index === 0) cell.scope = 'row'; cell.textContent = String(value); row.append(cell);
    });
    find('history').prepend(row);
  }
  function reset() {
    share = Number(control('initial').value) / 100; generation = 0;
    find('prediction').value = '';
    find('history').replaceChildren(); addRow(); render();
    find('result').textContent = 'Predict which behavior will grow, choose an invading behavior, and release a small group.';
  }
  function run(invade) {
    if (!find('prediction').value) { find('result').textContent = 'Choose a prediction before advancing the population.'; find('prediction').focus(); return; }
    const strategy = find('strategy').value;
    const original = share;
    if (invade) share = invadePopulation(share, strategy);
    const before = share;
    const points = strategyScores(before, settings().resource, settings().conflict)[strategy];
    share = evolvePopulation(share, settings(), Math.min(20, 200 - generation)).at(-1);
    generation = Math.min(200, generation + 20);
    const direction = Math.abs(share - before) < 1e-8 ? 'steady' : share > before ? 'hawk' : 'dove';
    find('result').textContent = `${invade ? `Your ${strategy === 'hawk' ? 'Hawk' : 'Dove'} newcomers replace 2% of the population, moving the Hawk share from ${fmt(100 * original)}% to ${fmt(100 * before)}%. Their starting expected score is ${fmt(points)} points per encounter. ` : ''}After 20 generations, the Hawk share is ${fmt(100 * share)}%. ${direction === 'steady' ? 'The mixture stays steady.' : `${direction === 'hawk' ? 'Hawk' : 'Dove'} becomes more common.`} Your prediction ${direction === find('prediction').value ? 'matches' : 'does not match'} this run. ${settings().mutation > 0 ? 'Switching between behaviors also affects growth, so a behavior can grow even while earning fewer points.' : 'With switching off, the behavior earning more spreads when both behaviors are present.'} This tracks behavior shares; it does not track the descendants of individual newcomers.`;
    addRow(); render();
  }
  find('invade').addEventListener('click', () => run(true));
  find('continue').addEventListener('click', () => run(false));
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  reset();
  return { reset };
}
