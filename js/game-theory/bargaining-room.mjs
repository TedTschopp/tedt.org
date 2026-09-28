import { loadSettings } from './shared.mjs';

export function bargainingOffer({ offer = 40, outsideA = 20, outsideB = 20, patienceA = 90, patienceB = 90, fairness = 30, round = 0, ultimatum = false } = {}) {
  const discountA = (patienceA / 100) ** round;
  const discountB = (patienceB / 100) ** round;
  const threshold = Math.max(ultimatum ? 0 : outsideB / discountB, fairness);
  const accepted = offer >= threshold - 1e-8;
  const a = accepted ? (100 - offer) * discountA : ultimatum ? 0 : outsideA;
  const b = accepted ? offer * discountB : ultimatum ? 0 : outsideB;
  return { accepted, a, b, group: a + b, threshold, discountA, discountB, counter: Math.min(100, outsideA / discountA), feasible: threshold + outsideA / discountA <= 100 + 1e-8 };
}

export function mount(root) {
  loadSettings(root);
  const get = key => root.querySelector(`[data-bargain-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const settings = () => ({ outsideA: Number(control('outsideA').value), outsideB: Number(control('outsideB').value), patienceA: Number(control('patienceA').value), patienceB: Number(control('patienceB').value), fairness: Number(control('fairness').value), deadline: Number(control('deadline').value), ultimatum: control('mode').value === 'ultimatum', known: control('knowledge').value === 'known' });
  const fmt = value => Number(value.toFixed(2)).toLocaleString('en-US');
  let round, ended;
  function describe() {
    const s = settings(), result = bargainingOffer({ ...s, round });
    get('context').textContent = `Offer ${round + 1} of ${s.ultimatum ? 1 : s.deadline}. Waiting has left each token worth ${fmt(result.discountA)} points to you and ${fmt(result.discountB)} to the other side. ${s.known ? `The other side accepts an offer of at least ${fmt(result.threshold)} tokens.` : 'The other side’s exact acceptance threshold is hidden until you make an offer.'} ${s.ultimatum ? 'Rejection ends this game with zero for both sides; alternatives and patience do not apply.' : `Walking away earns you ${s.outsideA} points and the other side ${s.outsideB}.`}`;
  }
  function finish() { ended = true; ['offer', 'wait', 'accept', 'walk'].forEach(key => { get(key).disabled = true; }); }
  function reset() {
    round = 0; ended = false; get('prediction').value = '';
    ['offer', 'walk'].forEach(key => { get(key).disabled = false; });
    get('wait').disabled = settings().ultimatum; get('accept').disabled = true;
    get('result').textContent = 'Predict whether your offer will be accepted, then divide the 100 tokens.';
    describe();
  }
  get('offer').addEventListener('click', () => {
    if (ended) return;
    if (!get('prediction').value) { get('result').textContent = 'Choose a prediction first.'; get('prediction').focus(); return; }
    const offer = Math.max(0, Math.min(100, Math.round(Number(get('amount').value) || 0)));
    get('amount').value = String(offer);
    const s = settings(), result = bargainingOffer({ ...s, round, offer });
    const prediction = (get('prediction').value === 'accept') === result.accepted ? 'Your prediction was correct.' : 'That differs from your prediction.';
    if (result.accepted) {
      get('result').textContent = `Accepted. You receive ${100 - offer} tokens worth ${fmt(result.a)} points; the other side receives ${offer} worth ${fmt(result.b)} points. Combined value: ${fmt(result.group)} points. ${prediction} ${!s.ultimatum && result.a < s.outsideA ? 'You accepted less value than your walk-away alternative.' : ''}`; finish();
    } else if (s.ultimatum || round + 1 >= s.deadline) {
      get('result').textContent = `Rejected. The acceptance threshold was ${fmt(result.threshold)} tokens. ${prediction} ${s.ultimatum ? 'The ultimatum ends: you earn 0, the other side earns 0, combined 0.' : `The deadline ends bargaining: you take ${s.outsideA}, the other side takes ${s.outsideB}, combined ${s.outsideA + s.outsideB} points from separate alternatives.`}`; finish();
    } else {
      get('result').textContent = `Rejected. The other side needed at least ${fmt(result.threshold)} tokens. ${prediction} ${result.feasible ? `Its scripted counteroffer gives you ${fmt(result.counter)} tokens, worth your ${s.outsideA}-point alternative, and keeps the rest. Accept that counteroffer, wait one round, or walk away.` : 'No split meets both outside options and the other side’s minimum-share rule. Wait or walk away.'}`;
      get('accept').disabled = !result.feasible; get('offer').disabled = true;
    }
  });
  get('accept').addEventListener('click', () => {
    const s = settings(), result = bargainingOffer({ ...s, round });
    const b = (100 - result.counter) * result.discountB;
    get('result').textContent = `You accepted the counteroffer. Your value: ${fmt(s.outsideA)} points; the other side’s value: ${fmt(b)} points; combined: ${fmt(s.outsideA + b)}. This counteroffer follows the stated script, not a prediction of every negotiator.`; finish();
  });
  get('wait').addEventListener('click', () => {
    if (round + 1 >= settings().deadline) { get('walk').click(); return; }
    round++; get('accept').disabled = true; get('offer').disabled = false; get('prediction').value = '';
    get('result').textContent = 'One round passed. Make a fresh prediction and offer using the new values.'; describe();
  });
  get('walk').addEventListener('click', () => {
    const s = settings(); get('result').textContent = s.ultimatum ? 'You ended the ultimatum without a deal. You earn 0; the other side earns 0; combined 0.' : `You walked away. Your alternative earns ${s.outsideA}; the other side’s earns ${s.outsideB}; combined ${s.outsideA + s.outsideB} points. No tokens from the proposed deal are distributed.`; finish();
  });
  root.querySelectorAll('[data-setting]').forEach(element => element.addEventListener('change', reset));
  reset(); return { reset };
}
