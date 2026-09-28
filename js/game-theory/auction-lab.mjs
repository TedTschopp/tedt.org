import { loadSettings, seededRandom } from './shared.mjs';

export function auctionItem({ mode = 'private', bidders = 4, noise = 30 } = {}, random = seededRandom(42)) {
  const commonValue = 50 + Math.floor(random() * 51);
  const values = Array.from({ length: bidders }, () => mode === 'common' ? commonValue : 30 + Math.floor(random() * 71));
  const estimates = values.map(value => mode === 'common' ? Math.max(0, value + Math.round((random() * 2 - 1) * noise)) : value);
  return { values, estimates, commonValue };
}

export function settleAuction({ bids, values, rule = 'first' }) {
  const order = bids.map((bid, index) => ({ bid, index })).sort((a, b) => b.bid - a.bid || a.index - b.index);
  const winner = order[0].index;
  const price = rule === 'second' ? order[1].bid : order[0].bid;
  const profits = bids.map((_, index) => index === winner ? values[index] - price : 0);
  return { winner, price, profits, group: values[winner], loss: profits[winner] < 0 };
}

export function auctionBatch({ mode = 'common', bidders = 4, noise = 30, shading = 100, ownShading = 100, seed = 42, rounds = 200 } = {}) {
  const random = seededRandom(seed);
  const totals = { first: { wins: 0, profit: 0, losses: 0 }, second: { wins: 0, profit: 0, losses: 0 } };
  for (let round = 0; round < rounds; round++) {
    const item = auctionItem({ mode, bidders, noise }, random);
    const bids = item.estimates.map((estimate, i) => Math.round(estimate * (i === 0 ? ownShading : shading) / 100));
    for (const rule of ['first', 'second']) {
      const result = settleAuction({ bids, values: item.values, rule });
      totals[rule].profit += result.profits[0];
      if (result.winner === 0) { totals[rule].wins++; if (result.loss) totals[rule].losses++; }
    }
  }
  return totals;
}

export function mount(root) {
  loadSettings(root);
  const get = key => root.querySelector(`[data-auction-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ mode: control('mode').value, rule: control('rule').value, bidders: Number(control('bidders').value), noise: Number(control('noise').value), shading: Number(control('shading').value), ownShading: Number(control('ownShading').value), seed: Number(control('seed').value) });
  let item, random;
  function next() {
    item = auctionItem(settings(), random);
    get('prediction').value = ''; get('rows').replaceChildren(); get('play').disabled = false;
    get('information').textContent = settings().mode === 'private' ? `You know the item is worth ${item.values[0]} points to you. Other bidders may value it differently.` : `Your estimate is ${item.estimates[0]} points. Everyone is bidding on the same hidden value, with separate estimate errors of at most ${settings().noise} points.`;
    get('result').textContent = 'Predict whether winning will leave you with a profit, then submit your bid. The highest bid wins; ties go to the lowest bidder number, with you as bidder 1.';
  }
  function reset() { random = seededRandom(settings().seed); get('batch').textContent = 'The comparison replays 200 items under both payment rules using the same bids.'; next(); }
  get('play').addEventListener('click', () => {
    if (!get('prediction').value) { get('result').textContent = 'Choose a prediction first.'; get('prediction').focus(); return; }
    const own = Math.max(0, Math.min(200, Math.round(Number(get('bid').value) || 0)));
    get('bid').value = String(own);
    const s = settings();
    const bids = item.estimates.map((estimate, i) => i === 0 ? own : Math.round(estimate * s.shading / 100));
    const result = settleAuction({ bids, values: item.values, rule: s.rule });
    const actual = result.winner !== 0 ? 'lose' : result.profits[0] < 0 ? 'loss' : 'profit';
    const alternative = settleAuction({ bids, values: item.values, rule: s.rule === 'first' ? 'second' : 'first' });
    get('result').textContent = `Bidder ${result.winner + 1}${result.winner === 0 ? ' (you)' : ''} wins and pays ${result.price} to the seller. Your profit: ${result.profits[0]} points. Winner’s profit: ${result.profits[result.winner]}. Seller’s revenue: ${result.price}. Combined value across all bidders and the seller: ${result.group}; the payment moves points between them. ${get('prediction').value === actual ? 'Your prediction was correct.' : 'That differs from your prediction.'} With the same bids under the other payment rule, the winner would pay ${alternative.price}. ${s.mode === 'common' ? `The actual shared value was ${item.commonValue}. An optimistic estimate can win and still produce a loss.` : 'A private value belongs to that bidder, not to everyone.'}`;
    item.values.forEach((value, i) => {
      const row = document.createElement('tr');
      [i === 0 ? '1 (you)' : i + 1, value, item.estimates[i], bids[i], result.profits[i]].forEach(value => { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); });
      get('rows').append(row);
    });
    get('play').disabled = true;
  });
  get('next').addEventListener('click', next);
  get('run').addEventListener('click', () => {
    const results = auctionBatch(settings());
    get('batch').textContent = ['first', 'second'].map(rule => { const r = results[rule]; return `${rule === 'first' ? 'First' : 'Second'} price: you won ${r.wins} of 200 items, lost money on ${r.losses} wins, and earned ${r.profit} points in total.`; }).join(' ') + ' These bids follow your percentage rules; this is not a calculation of how all strategic bidders would adapt.';
  });
  root.querySelectorAll('[data-setting]').forEach(element => element.addEventListener('change', reset));
  reset(); return { reset };
}
