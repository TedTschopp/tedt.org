import { loadSettings, seededRandom } from './shared.mjs';

// Rows are your recommendation; columns are the partner's. 0 = wait, 1 = go.
export const advicePayoffs = [[[4, 4], [1, 5]], [[5, 1], [0, 0]]];
export function analyzeAdvice(weights = [1, 1, 1, 0]) {
  const safe = Array.from({ length: 4 }, (_, index) => Math.max(0, Number.isFinite(Number(weights[index])) ? Number(weights[index]) : 0));
  const sum = safe.reduce((total, value) => total + value, 0);
  if (sum <= 0) return null;
  const probabilities = safe.map(value => value / sum);
  const expected = [0, 0];
  probabilities.forEach((probability, cell) => advicePayoffs[Math.floor(cell / 2)][cell % 2].forEach((score, player) => { expected[player] += probability * score; }));
  const conditions = [];
  for (let player = 0; player < 2; player++) for (let recommendation = 0; recommendation < 2; recommendation++) {
    let probability = 0; let followTotal = 0; let deviateTotal = 0;
    probabilities.forEach((chance, cell) => {
      const actions = [Math.floor(cell / 2), cell % 2];
      if (actions[player] !== recommendation) return;
      probability += chance;
      followTotal += chance * advicePayoffs[actions[0]][actions[1]][player];
      actions[player] = 1 - actions[player];
      deviateTotal += chance * advicePayoffs[actions[0]][actions[1]][player];
    });
    conditions.push({ player, recommendation, probability, follow: probability ? followTotal / probability : null, deviate: probability ? deviateTotal / probability : null, weightedGain: followTotal - deviateTotal });
  }
  const goA = probabilities[2] + probabilities[3];
  const goB = probabilities[1] + probabilities[3];
  const independent = [(1 - goA) * (1 - goB), (1 - goA) * goB, goA * (1 - goB), goA * goB];
  const independentExpected = [0, 0];
  independent.forEach((chance, cell) => advicePayoffs[Math.floor(cell / 2)][cell % 2].forEach((score, player) => { independentExpected[player] += chance * score; }));
  return { probabilities, expected, independentExpected, independent, conditions, isCorrelatedEquilibrium: conditions.every(condition => condition.weightedGain >= -1e-10) };
}
export function drawRecommendation(probabilities, draw = 0) {
  const target = Math.max(0, Math.min(1 - Number.EPSILON, Number(draw) || 0));
  let total = 0;
  for (let cell = 0; cell < probabilities.length; cell++) { total += probabilities[cell]; if (target < total) return [Math.floor(cell / 2), cell % 2]; }
  return [1, 1];
}
export function adviceOutcome(recommendation, follow = true) {
  const yourAction = follow ? recommendation[0] : 1 - recommendation[0];
  const scores = advicePayoffs[yourAction][recommendation[1]];
  return { actions: [yourAction, recommendation[1]], you: scores[0], other: scores[1], total: scores[0] + scores[1] };
}

export function mount(root) {
  loadSettings(root);
  const find = key => root.querySelector(`[data-advice-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  const fmt = value => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const label = action => action ? 'go' : 'wait';
  let model;
  let random;
  let recommendation;
  function next() {
    if (!model) return;
    recommendation = drawRecommendation(model.probabilities, random());
    find('recommendation').textContent = `Your private recommendation: ${label(recommendation[0])}. Your partner’s recommendation stays hidden until you choose.`;
    find('follow').disabled = false; find('change').disabled = false;
  }
  function reset() {
    model = analyzeAdvice(['ww', 'wg', 'gw', 'gg'].map(key => control(key).value));
    random = seededRandom(control('seed').value);
    find('prediction').value = '';
    find('conditions').replaceChildren();
    if (!model) {
      find('result').textContent = 'Give at least one recommendation pair a weight above zero.';
      find('summary').textContent = 'Four zero weights cannot describe a draw.';
      find('recommendation').textContent = 'No recommendation is available.';
      ['follow', 'change', 'next'].forEach(key => { find(key).disabled = true; }); return;
    }
    find('next').disabled = false;
    model.conditions.forEach(condition => {
      const row = document.createElement('tr');
      [`${condition.player === 0 ? 'You' : 'Partner'} told to ${label(condition.recommendation)}`, `${fmt(100 * condition.probability)}%`, condition.follow === null ? 'Never sent' : fmt(condition.follow), condition.deviate === null ? 'Never sent' : fmt(condition.deviate), condition.probability === 0 ? 'No condition needed' : condition.weightedGain < -1e-10 ? 'Changing pays more' : Math.abs(condition.weightedGain) < 1e-10 ? 'Tie; following is allowed' : 'Following pays more'].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td'); if (index === 0) cell.scope = 'row'; cell.textContent = value; row.append(cell);
      }); find('conditions').append(row);
    });
    find('summary').textContent = `If both follow: you average ${fmt(model.expected[0])}, your partner ${fmt(model.expected[1])}, combined ${fmt(model.expected[0] + model.expected[1])}. Independent choices with the same separate chances to go: you ${fmt(model.independentExpected[0])}, partner ${fmt(model.independentExpected[1])}, combined ${fmt(model.independentExpected[0] + model.independentExpected[1])}. ${model.isCorrelatedEquilibrium ? 'Every sent recommendation makes following at least as good as changing: this is a correlated equilibrium.' : 'At least one recommendation tempts someone to change: this is not a correlated equilibrium.'}`;
    find('result').textContent = 'Inspect the advice, predict whether anyone is tempted to ignore it, then make your own choice.';
    next();
  }
  function choose(follow) {
    if (!find('prediction').value) { find('result').textContent = 'Choose your prediction first.'; find('prediction').focus(); return; }
    const result = adviceOutcome(recommendation, follow);
    const alternative = adviceOutcome(recommendation, !follow);
    const condition = model.conditions[recommendation[0]];
    find('result').textContent = `You were told to ${label(recommendation[0])} and chose to ${label(result.actions[0])}. Your partner was told to ${label(recommendation[1])} and followed. You earn ${result.you}; your partner earns ${result.other}; combined points: ${result.total}. In this one draw, your other choice would have earned ${alternative.you}. Before seeing the partner’s advice, following this recommendation averages ${fmt(condition.follow)} and changing averages ${fmt(condition.deviate)}. One lucky draw does not settle which choice is better on average. Your prediction ${((find('prediction').value === 'stable') === model.isCorrelatedEquilibrium) ? 'matches' : 'does not match'} the four incentive checks.`;
    find('follow').disabled = true; find('change').disabled = true;
  }
  find('follow').addEventListener('click', () => choose(true));
  find('change').addEventListener('click', () => choose(false));
  find('next').addEventListener('click', next);
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  reset();
  return { reset };
}
