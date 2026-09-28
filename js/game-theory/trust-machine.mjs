import { loadSettings, seededRandom } from './shared.mjs';

export const STRATEGIES = Object.freeze([
  { id: 'tit-for-tat', name: 'Tit for tat', description: 'Tit for tat cooperates first, then copies your last actual action.' },
  { id: 'forgiving', name: 'Forgiving tit for tat', description: 'Forgiving tit for tat cooperates first, then copies your last actual action, sometimes forgiving a defection.' },
  { id: 'cooperate', name: 'Always cooperate', description: 'This opponent intends to cooperate every round, whatever you do.' },
  { id: 'defect', name: 'Always defect', description: 'This opponent intends to defect every round, whatever you do.' },
  { id: 'random', name: 'Fair coin', description: 'This opponent uses the same odds as a fair coin each round: a 50% chance to cooperate and a 50% chance to defect. Earlier rounds do not affect this choice.' },
  { id: 'last-round', name: 'Tit for tat, final defection', description: 'This opponent plays tit for tat, except that it defects in a known final round. With a random ending it cannot identify a final round in advance.' },
]);

const flip = action => action === 'C' ? 'D' : 'C';
const actionName = action => action === 'C' ? 'Cooperate' : 'Defect';
function bounded(value, fallback, low, high, integer = false) {
  const n = Number(value);
  const result = Math.min(high, Math.max(low, Number.isFinite(n) ? n : fallback));
  return integer ? Math.round(result) : result;
}

export function normalizeOptions(options = {}) {
  return {
    ending: options.ending === 'continuation' ? 'continuation' : 'known',
    rounds: bounded(options.rounds ?? 10, 10, 1, 50, true),
    continuation: bounded(options.continuation ?? 0.9, 0.9, 0, 0.95),
    mistakes: bounded(options.mistakes ?? 0, 0, 0, 0.5),
    forgiveness: bounded(options.forgiveness ?? 0.25, 0.25, 0, 1),
    seed: bounded(options.seed ?? 42, 42, 1, 999999, true),
    trials: bounded(options.trials ?? 20, 20, 1, 50, true),
  };
}

export function roundPayoff(a, b) {
  if (!['C', 'D'].includes(a) || !['C', 'D'].includes(b)) throw new RangeError('Actions must be C or D.');
  if (a === 'C' && b === 'C') return [3, 3];
  if (a === 'D' && b === 'D') return [1, 1];
  return a === 'D' ? [5, 0] : [0, 5];
}

/** History is an array of actual actions by the other player, before this round. */
export function strategyMove(strategy, opponentHistory, options = {}, random = Math.random) {
  if (!STRATEGIES.some(entry => entry.id === strategy)) throw new RangeError(`Unknown strategy: ${strategy}`);
  if (strategy === 'cooperate') return 'C';
  if (strategy === 'defect') return 'D';
  if (strategy === 'random') return random() < 0.5 ? 'C' : 'D';
  if (strategy === 'last-round' && options.ending === 'known' && opponentHistory.length + 1 === options.rounds) return 'D';
  const previous = opponentHistory.at(-1) ?? 'C';
  if (strategy === 'forgiving' && previous === 'D' && random() < (options.forgiveness ?? 0.25)) return 'C';
  return previous;
}

function actualAction(intended, mistakes, random) {
  return mistakes > 0 && random() < mistakes ? flip(intended) : intended;
}

function endingReason(roundCount, options, random) {
  if (options.ending === 'known') return roundCount >= options.rounds ? 'known final round' : null;
  if (roundCount >= 200) return '200-round simulation cap';
  return random() >= options.continuation ? 'chance ending' : null;
}

export function simulateMatch(strategyA, strategyB, rawOptions = {}, random) {
  const options = normalizeOptions(rawOptions);
  const rng = random ?? seededRandom(options.seed);
  const actionsA = [];
  const actionsB = [];
  const history = [];
  const scores = [0, 0];
  const cooperations = [0, 0];
  let endReason = null;
  while (!endReason) {
    // Both intentions depend only on completed rounds, never this round's move.
    const intendedA = strategyMove(strategyA, actionsB, options, rng);
    const intendedB = strategyMove(strategyB, actionsA, options, rng);
    const a = actualAction(intendedA, options.mistakes, rng);
    const b = actualAction(intendedB, options.mistakes, rng);
    const payoff = roundPayoff(a, b);
    actionsA.push(a);
    actionsB.push(b);
    scores[0] += payoff[0];
    scores[1] += payoff[1];
    cooperations[0] += Number(a === 'C');
    cooperations[1] += Number(b === 'C');
    history.push({ intended: [intendedA, intendedB], actual: [a, b], payoff });
    endReason = endingReason(history.length, options, rng);
  }
  return { history, scores, cooperations, rounds: history.length, endReason };
}

export function runTournament(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const random = seededRandom(options.seed ^ 0x51ED270B);
  const entries = STRATEGIES.map(strategy => ({ id: strategy.id, name: strategy.name, points: 0, rounds: 0, cooperations: 0, appearances: 0 }));
  let encounters = 0;
  let totalCombined = 0;
  let totalRounds = 0;
  let capped = 0;
  for (let a = 0; a < entries.length; a += 1) {
    for (let b = a; b < entries.length; b += 1) {
      for (let trial = 0; trial < options.trials; trial += 1) {
        const result = simulateMatch(entries[a].id, entries[b].id, options, random);
        // Average both copies in a self-match so it has the same weight as
        // encountering any other strategy, rather than double weight.
        const weight = a === b ? 0.5 : 1;
        [a, b].forEach((index, player) => {
          entries[index].points += result.scores[player] * weight;
          entries[index].rounds += result.rounds * weight;
          entries[index].cooperations += result.cooperations[player] * weight;
          entries[index].appearances += weight;
        });
        encounters += 1;
        totalRounds += result.rounds;
        totalCombined += result.scores[0] + result.scores[1];
        capped += Number(result.endReason === '200-round simulation cap');
      }
    }
  }
  const ranked = entries.map(entry => ({ ...entry, pointsPerRound: entry.points / entry.rounds, cooperationRate: entry.cooperations / entry.rounds })).sort((a, b) => b.pointsPerRound - a.pointsPerRound || a.name.localeCompare(b.name));
  return { entries: ranked, encounters, totalRounds, totalCombined, combinedPerRound: totalCombined / totalRounds, capped };
}

function paragraph(parent, text) {
  const p = document.createElement('p');
  p.textContent = text;
  parent.append(p);
}

export function mount(root) {
  const get = id => root.querySelector(`#trust-${id}`);
  let options;
  let random;
  let opponent;
  let history = [];
  let scores = [0, 0];
  let ended = false;

  function numberSetting(id, fallback, min, max) {
    const input = get(id);
    const value = bounded(input.value, fallback, min, max, true);
    input.value = String(value);
    return value;
  }

  function readOptions() {
    return normalizeOptions({
      ending: get('ending').value,
      rounds: numberSetting('rounds', 10, 1, 50),
      continuation: numberSetting('continuation', 90, 0, 95) / 100,
      mistakes: numberSetting('mistakes', 0, 0, 50) / 100,
      forgiveness: numberSetting('forgiveness', 25, 0, 100) / 100,
      seed: numberSetting('seed', 42, 1, 999999),
      trials: numberSetting('trials', 20, 1, 50),
    });
  }

  function drawRoundLabel() {
    get('round-label').textContent = ended
      ? `Encounter complete after ${history.length} round${history.length === 1 ? '' : 's'}. Use Restart this scenario to replay these settings.`
      : options.ending === 'known'
        ? `Round ${history.length + 1} of ${options.rounds}. Both players know the endpoint.`
        : `Round ${history.length + 1}. After this round, there is a ${Math.round(options.continuation * 100)}% chance of meeting again.`;
  }

  function reset() {
    options = readOptions();
    random = seededRandom(options.seed);
    opponent = STRATEGIES.find(entry => entry.id === get('opponent').value) ?? STRATEGIES[0];
    history = [];
    scores = [0, 0];
    ended = false;
    get('history').replaceChildren();
    get('result').replaceChildren();
    paragraph(get('result'), 'Choose an action to play your first round. The opponent chooses without seeing your current action.');
    get('opponent-description').textContent = opponent.description;
    get('tournament-results').replaceChildren();
    get('tournament-summary').replaceChildren();
    get('cooperate').disabled = false;
    get('defect').disabled = false;
    drawRoundLabel();
  }

  function play(intended) {
    if (ended) return;
    const opponentIntended = strategyMove(opponent.id, history.map(round => round.actual[0]), options, random);
    const a = actualAction(intended, options.mistakes, random);
    const b = actualAction(opponentIntended, options.mistakes, random);
    const payoff = roundPayoff(a, b);
    history.push({ intended: [intended, opponentIntended], actual: [a, b], payoff });
    scores = scores.map((score, i) => score + payoff[i]);
    const reason = endingReason(history.length, options, random);
    ended = Boolean(reason);
    const result = get('result');
    result.replaceChildren();
    paragraph(result, `Round ${history.length}: you ${a === 'C' ? 'cooperated' : 'defected'}${a !== intended ? ` (your intended ${actionName(intended).toLowerCase()} was flipped by a mistake)` : ''}; your opponent ${b === 'C' ? 'cooperated' : 'defected'}${b !== opponentIntended ? ' (an accidental flip)' : ''}. You earned ${payoff[0]}; they earned ${payoff[1]}; combined ${payoff[0] + payoff[1]}.`);
    paragraph(result, `Total points: you ${scores[0]}, opponent ${scores[1]}, combined ${scores[0] + scores[1]}. Average per round: you ${(scores[0] / history.length).toFixed(2)}, opponent ${(scores[1] / history.length).toFixed(2)}.`);
    const alternative = roundPayoff(flip(a), b)[0];
    paragraph(result, `If your opponent had made the same choice, choosing ${actionName(flip(a)).toLowerCase()} instead would have earned you ${alternative} points this round. Your choice can affect how your opponent responds next round.`);
    if (ended) {
      paragraph(result, `The encounter ended: ${reason}. This run alone cannot establish which strategy is best. Change a condition or compare many tournament encounters.`);
      const prediction = get('prediction').value;
      if (prediction) paragraph(result, `Your prediction: “${prediction}.” Use the tournament to compare it with the outcomes under these settings.`);
    }
    const tr = document.createElement('tr');
    const values = [history.length, `${actionName(a)}${a !== intended ? ' (mistake)' : ''}`, `${actionName(b)}${b !== opponentIntended ? ' (mistake)' : ''}`, payoff[0], payoff[1], payoff[0] + payoff[1]];
    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      if (index === 0) cell.scope = 'row';
      cell.textContent = String(value);
      tr.append(cell);
    });
    get('history').append(tr);
    get('cooperate').disabled = ended;
    get('defect').disabled = ended;
    drawRoundLabel();
  }

  get('cooperate').addEventListener('click', () => play('C'));
  get('defect').addEventListener('click', () => play('D'));
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  get('tournament-run').addEventListener('click', () => {
    const result = runTournament(readOptions());
    const body = get('tournament-results');
    body.replaceChildren();
    for (const entry of result.entries) {
      const tr = document.createElement('tr');
      [entry.name, entry.pointsPerRound.toFixed(3), `${(entry.cooperationRate * 100).toFixed(1)}%`, entry.rounds].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = String(value);
        tr.append(cell);
      });
      body.append(tr);
    }
    const summary = get('tournament-summary');
    summary.replaceChildren();
    paragraph(summary, `${result.encounters} simulated encounters, ${result.totalRounds} rounds played. Combined earnings: ${result.totalCombined} points, or ${result.combinedPerRound.toFixed(3)} points for the two players together per round (both cooperating would earn 6).${result.capped ? ` ${result.capped} encounters reached the 200-round cap.` : ''}`);
    paragraph(summary, `Highest observed points per round: ${result.entries[0].name}, at ${result.entries[0].pointsPerRound.toFixed(3)}. Rounded values may appear tied. This ranking applies to these opponents and settings; try another seed to see whether chance changes the result.`);
  });
  loadSettings(root);
  reset();
  return { reset };
}
