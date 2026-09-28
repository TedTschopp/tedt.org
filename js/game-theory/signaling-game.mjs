import { loadSettings, seededRandom } from './shared.mjs';

export function signalModel({ prior = 50, pattern = 'separate', goodCost = 2, badCost = 20, premium = 8 } = {}) {
  const p = prior / 100;
  const rates = pattern === 'separate' ? { good: 1, bad: 0 } : pattern === 'pool' ? { good: 1, bad: 1 } : { good: 0, bad: 0 };
  const beliefs = {};
  for (const action of ['signal', 'plain']) {
    const goodRate = action === 'signal' ? rates.good : 1 - rates.good;
    const badRate = action === 'signal' ? rates.bad : 1 - rates.bad;
    const frequency = p * goodRate + (1 - p) * badRate;
    const posterior = frequency > 0 ? p * goodRate / frequency : p;
    const expectedValue = posterior * 20 + (1 - posterior) * 6;
    const price = action === 'signal' ? 10 + premium : 10;
    beliefs[action] = { frequency, posterior, expectedValue, price, buy: expectedValue >= price, offPath: frequency === 0 };
  }
  const sellers = {};
  for (const type of ['good', 'bad']) {
    const cost = type === 'good' ? goodCost : badCost;
    const signal = (beliefs.signal.buy ? beliefs.signal.price : 0) - cost;
    const plain = beliefs.plain.buy ? beliefs.plain.price : 0;
    const chosen = rates[type] ? 'signal' : 'plain';
    sellers[type] = { signal, plain, chosen, stable: (chosen === 'signal' ? signal : plain) >= Math.max(signal, plain) };
  }
  return { rates, beliefs, sellers, stable: sellers.good.stable && sellers.bad.stable };
}

export function mount(root) {
  loadSettings(root);
  const get = key => root.querySelector(`[data-signal-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ prior: Number(control('prior').value), pattern: control('pattern').value, goodCost: Number(control('goodCost').value), badCost: Number(control('badCost').value), premium: Number(control('premium').value), seed: Number(control('seed').value) });
  const fmt = value => Number(value.toFixed(2)).toLocaleString('en-US');
  let model, type, action, random;
  function newSeller() {
    const s = settings(); model = signalModel(s);
    type = random() < s.prior / 100 ? 'good' : 'bad';
    action = model.rates[type] ? 'signal' : 'plain';
    get('prediction').value = ''; get('buy').disabled = false; get('pass').disabled = false;
    const belief = model.beliefs[action];
    get('observation').textContent = `This seller ${action === 'signal' ? 'paid for the signal' : 'did not use the signal'}. Asking price: ${belief.price} points. Under the proposed pattern, ${fmt(belief.posterior * 100)}% of sellers with this observation have high quality. Average value at that belief: ${fmt(belief.expectedValue)} points. Quality stays hidden until your decision.`;
    get('result').textContent = 'Predict the quality, then decide whether to buy. The incentive check below shows whether the proposed pattern could hold up.';
    get('analysis').textContent = `High-quality seller: signal earns ${fmt(model.sellers.good.signal)}; no signal earns ${fmt(model.sellers.good.plain)}. Low-quality seller: signal earns ${fmt(model.sellers.bad.signal)}; no signal earns ${fmt(model.sellers.bad.plain)}. ${model.stable ? 'Neither type gains by changing its proposed action under these buyer beliefs.' : 'At least one type would prefer to change its action. The proposed pattern is not supported by these incentives.'} For an observation that never occurs under the proposed pattern, this model uses the starting quality percentage as the buyer’s belief.`;
  }
  function reset() { random = seededRandom(settings().seed); newSeller(); }
  function play(buy) {
    if (!get('prediction').value) { get('result').textContent = 'Choose a prediction first.'; get('prediction').focus(); return; }
    const s = settings(), belief = model.beliefs[action];
    const value = type === 'good' ? 20 : 6;
    const cost = action === 'signal' ? (type === 'good' ? s.goodCost : s.badCost) : 0;
    const buyer = buy ? value - belief.price : 0, seller = (buy ? belief.price : 0) - cost;
    get('result').textContent = `The product had ${type === 'good' ? 'high' : 'low'} quality, worth ${value} points. ${get('prediction').value === type ? 'Your prediction matched this seller.' : 'Your prediction did not match this seller.'} You ${buy ? 'bought it' : 'passed'}. Your profit: ${fmt(buyer)}; seller’s profit after signal cost: ${fmt(seller)}; combined: ${fmt(buyer + seller)} points. ${!model.stable ? 'The simulated seller followed the proposed pattern even though an incentive check found a profitable change. Do not treat that pattern’s quality estimate as a reliable real-world prediction.' : 'A single outcome does not establish how common high quality is; the percentage comes from the stated population.'}`;
    get('buy').disabled = true; get('pass').disabled = true;
  }
  get('buy').addEventListener('click', () => play(true)); get('pass').addEventListener('click', () => play(false)); get('next').addEventListener('click', newSeller);
  root.querySelectorAll('[data-setting]').forEach(element => element.addEventListener('change', reset));
  reset(); return { reset };
}
