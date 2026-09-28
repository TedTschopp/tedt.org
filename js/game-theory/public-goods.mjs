import { loadSettings } from './shared.mjs';

export function publicGoodsRound({ contributions = [5, 5, 5, 5], multiplier = 2, matching = 0, punishment = false, visible = true } = {}) {
  const total = contributions.reduce((sum, value) => sum + value, 0);
  const sponsor = total * matching / 100;
  const project = (total + sponsor) * multiplier;
  const share = project / contributions.length;
  const earnings = contributions.map(value => 10 - value + share);
  const costs = contributions.map(() => 0);
  const fines = contributions.map(() => 0);
  if (punishment && visible) {
    contributions.forEach((giver, i) => contributions.forEach((receiver, j) => {
      if (giver > receiver) { costs[i] += 1; fines[j] += 2; }
    }));
  }
  const net = earnings.map((value, i) => value - costs[i] - fines[i]);
  return { total, sponsor, project, share, costs, fines, net, group: net.reduce((sum, value) => sum + value, 0), marginal: multiplier * (1 + matching / 100) / contributions.length - 1 };
}

export function nextContribution({ own, initial = 5, repeated = true, visible = true }) {
  return repeated && visible ? own : initial;
}

export function mount(root) {
  loadSettings(root);
  const get = key => root.querySelector(`[data-public-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ size: Number(control('size').value), initial: Number(control('initial').value), multiplier: Number(control('multiplier').value), matching: Number(control('matching').value), visible: control('visible').value === 'yes', repeated: control('repeated').value === 'yes', punishment: control('punishment').value === 'yes' });
  const fmt = value => Number(value.toFixed(2)).toLocaleString('en-US');
  let other, round, totalOwn, totalGroup;
  function reset() {
    other = settings().initial; round = 0; totalOwn = 0; totalGroup = 0;
    get('prediction').value = '';
    get('history').replaceChildren();
    get('result').textContent = 'Predict, choose how many of your 10 tokens to contribute, then play a round.';
    get('context').textContent = `The ${settings().size - 1} other players each plan to contribute ${other} tokens in the first round.`;
    get('play').disabled = false;
  }
  get('play').addEventListener('click', () => {
    if (!get('prediction').value) { get('result').textContent = 'Choose a prediction first.'; get('prediction').focus(); return; }
    const s = settings();
    const own = Math.round(Math.max(0, Math.min(10, Number(get('contribution').value) || 0)));
    get('contribution').value = String(own);
    const contributions = [own, ...Array(s.size - 1).fill(other)];
    const result = publicGoodsRound({ ...s, contributions });
    round++; totalOwn += result.net[0]; totalGroup += result.group;
    const predicted = result.marginal > 1e-9 ? 'gain' : result.marginal < -1e-9 ? 'loss' : 'same';
    get('result').textContent = `Round ${round}. You earned ${fmt(result.net[0])} points; all players together earned ${fmt(result.group)}. The project returned ${fmt(result.project)} points, including an outside sponsor contribution of ${fmt(result.sponsor)} before multiplication. You paid ${result.costs[0]} to punish and lost ${result.fines[0]} in fines. Before punishment, one extra token changes your own earnings by ${fmt(result.marginal)} points when others keep their choices. ${get('prediction').value === predicted ? 'Your prediction matches that comparison.' : 'That differs from your prediction.'} Running totals: you ${fmt(totalOwn)}; group ${fmt(totalGroup)}.`;
    const row = document.createElement('tr');
    [round, own, s.visible ? other : 'Hidden', fmt(result.net[0]), fmt(result.group)].forEach(value => { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); });
    get('history').append(row);
    other = nextContribution({ own, initial: s.initial, repeated: s.repeated, visible: s.visible });
    get('context').textContent = s.visible ? `Next round, each other player contributes ${other}. ${s.repeated ? 'Their rule is to copy your previous contribution.' : 'Their rule is to keep the starting contribution.'}` : 'Individual contributions stay hidden. Other players keep the starting contribution; punishment is unavailable.';
    if (round >= 12) { get('play').disabled = true; get('context').textContent += ' Twelve rounds are complete. Restart to compare a different sequence.'; }
  });
  root.querySelectorAll('[data-setting]').forEach(element => element.addEventListener('change', reset));
  reset(); return { reset };
}
