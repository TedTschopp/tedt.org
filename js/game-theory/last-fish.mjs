import { loadSettings } from './shared.mjs';

export function fishSeason({ stock = 80, requests = [6, 6, 6, 6], growth = 50, quota = 6, monitoring = 0, capacity = 100 } = {}) {
  const allowed = requests.map(request => Math.min(request, quota) + Math.max(0, request - quota) * (1 - monitoring / 100));
  const demand = allowed.reduce((sum, value) => sum + value, 0);
  const scale = demand > stock ? stock / demand : 1;
  const catches = allowed.map(value => value * scale);
  const harvest = catches.reduce((sum, value) => sum + value, 0);
  const remaining = Math.max(0, stock - harvest);
  const births = Math.min(capacity - remaining, remaining * growth / 100);
  const net = catches.map(value => value - monitoring / 100);
  return { catches, harvest, remaining, births, stock: remaining + births, net, group: net.reduce((sum, value) => sum + value, 0) };
}

export function mount(root) {
  loadSettings(root);
  const get = key => root.querySelector(`[data-fish-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ growth: Number(control('growth').value), quota: Number(control('quota').value), monitoring: Number(control('monitoring').value), other: Number(control('other').value), negotiated: control('negotiated').value === 'yes' });
  const fmt = value => Number(value.toFixed(2)).toLocaleString('en-US');
  let stock, season, personal, group;
  function reset() {
    stock = 80; season = 0; personal = 0; group = 0;
    get('prediction').value = ''; get('history').replaceChildren(); get('play').disabled = false;
    get('stock').textContent = '80'; get('meter').value = stock;
    get('result').textContent = 'The lake starts with 80 fish. Predict, choose a harvest request, and advance one season.';
  }
  get('play').addEventListener('click', () => {
    if (!get('prediction').value) { get('result').textContent = 'Choose a prediction first.'; get('prediction').focus(); return; }
    const s = settings();
    const own = Math.max(0, Math.min(20, Math.round(Number(get('harvest').value) || 0)));
    get('harvest').value = String(own);
    const others = s.negotiated ? Math.min(s.other, s.quota) : s.other;
    const result = fishSeason({ ...s, stock, requests: [own, others, others, others] });
    const actual = result.stock > stock + 1e-8 ? 'grow' : result.stock < stock - 1e-8 ? 'shrink' : 'same';
    season++; personal += result.net[0]; group += result.group;
    get('result').textContent = `Season ${season}. You caught ${fmt(result.catches[0])} fish and earned ${fmt(result.net[0])} points after monitoring costs. All boats caught ${fmt(result.harvest)} fish and earned ${fmt(result.group)} points. ${fmt(result.remaining)} fish remained; ${fmt(result.births)} new fish grew before the next season. The lake now holds ${fmt(result.stock)} fish. ${get('prediction').value === actual ? 'Your prediction matches the lake’s change.' : `The lake ${actual === 'grow' ? 'grew' : actual === 'shrink' ? 'shrank' : 'stayed the same'}, unlike your prediction.`} Total earnings so far: you ${fmt(personal)}; all boats ${fmt(group)}.`;
    stock = result.stock;
    get('stock').textContent = fmt(stock); get('meter').value = stock;
    const row = document.createElement('tr');
    [season, fmt(result.catches[0]), fmt(result.harvest), fmt(result.births), fmt(stock)].forEach(value => { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); });
    get('history').append(row);
    if (stock < 1e-8 || season >= 12) { get('play').disabled = true; get('result').textContent += stock < 1e-8 ? ' No fish remain to reproduce. Restart to test a different rule.' : ' Twelve seasons are complete. Restart to compare another rule.'; }
  });
  root.querySelectorAll('[data-setting]').forEach(element => element.addEventListener('change', reset));
  reset(); return { reset };
}
