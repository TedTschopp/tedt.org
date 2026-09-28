import { loadSettings, seededRandom } from './shared.mjs';

export const MOVES = ['Rock', 'Paper', 'Scissors'];
const bounded = (value, fallback, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : fallback));

export function scoreRound(player, opponent) {
  if (![0, 1, 2].includes(player) || ![0, 1, 2].includes(opponent)) throw new RangeError('Moves must be 0, 1, or 2.');
  return player === opponent ? 0 : (player - opponent + 3) % 3 === 1 ? 1 : -1;
}

export function probabilities(weights) {
  if (!Array.isArray(weights) || weights.length !== 3 || weights.some(weight => !Number.isFinite(weight) || weight < 0)) throw new RangeError('Supply three nonnegative finite weights.');
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0 || !Number.isFinite(total)) throw new RangeError('At least one weight must be positive.');
  return weights.map(weight => weight / total);
}

export function worstCaseScore(weights) {
  const [rock, paper, scissors] = probabilities(weights);
  return Math.min(paper - scissors, scissors - rock, rock - paper);
}

export function sampleMove(chances, random) {
  const draw = random();
  if (draw < chances[0]) return 0;
  if (draw < chances[0] + chances[1]) return 1;
  return 2;
}

export function predictNext(previousMoves, random) {
  const recent = previousMoves.slice(-12);
  const counts = [0, 0, 0];
  let method = 'No history: a random prediction';
  if (recent.length > 0) {
    const latest = recent.at(-1);
    const followers = [0, 0, 0];
    for (let index = 1; index < recent.length; index += 1) {
      if (recent[index - 1] === latest) followers[recent[index]] += 1;
    }
    if (followers.reduce((sum, count) => sum + count, 0) >= 2) {
      counts.splice(0, 3, ...followers);
      method = `What usually followed your previous ${MOVES[latest]}`;
    } else {
      recent.forEach(move => { counts[move] += 1; });
      method = 'Your most common recent move';
    }
  }
  const highest = Math.max(...counts);
  const ties = counts.flatMap((count, index) => count === highest ? [index] : []);
  const prediction = ties[Math.floor(random() * ties.length)];
  return { prediction, move: (prediction + 1) % 3, method };
}

export function simulateBatch(weights, { rounds = 1000, seed = 42 } = {}) {
  const chances = probabilities(weights);
  const count = Math.round(bounded(rounds, 1000, 1, 5000));
  const normalizedSeed = Math.round(bounded(seed, 42, 0, 2147483647));
  const playerRandom = seededRandom(normalizedSeed);
  const opponentRandom = seededRandom(normalizedSeed + 104729);
  const history = [];
  const result = { rounds: count, wins: 0, draws: 0, losses: 0, score: 0, opponentScore: 0, average: 0, actions: [0, 0, 0] };
  for (let index = 0; index < count; index += 1) {
    // The opponent commits using prior history before the player samples this round.
    const opponent = predictNext(history, opponentRandom);
    const player = sampleMove(chances, playerRandom);
    const score = scoreRound(player, opponent.move);
    result.actions[player] += 1;
    result.score += score;
    result[score === 1 ? 'wins' : score === -1 ? 'losses' : 'draws'] += 1;
    history.push(player);
  }
  result.opponentScore = -result.score || 0;
  result.average = result.score / count;
  return result;
}

export function mount(root) {
  loadSettings(root);
  const get = id => root.querySelector(`#${id}`);
  let settings;
  let history;
  let opponentRandom;
  let nextOpponent;
  const number = (value, digits = 2) => value.toFixed(digits);

  function readSettings() {
    const read = (name, fallback, min, max) => {
      const input = get(`mixed-${name}`);
      const value = Math.round(bounded(input.value, fallback, min, max));
      input.value = String(value);
      return value;
    };
    return { weights: [read('rock', 6, 0, 100), read('paper', 2, 0, 100), read('scissors', 2, 0, 100)], rounds: read('trials', 1000, 100, 5000), seed: read('seed', 42, 0, 2147483647) };
  }

  function renderManual() {
    const score = history.reduce((sum, round) => sum + round.score, 0);
    const metrics = [['Rounds played', String(history.length)], ['Your score', String(score)], ['Opponent score', String(-score || 0)], ['Combined score', '0']];
    get('mixed-metrics').replaceChildren(...metrics.map(([label, value]) => {
      const item = document.createElement('div');
      item.className = 'gt-metric';
      const title = document.createElement('span');
      title.textContent = label;
      const amount = document.createElement('strong');
      amount.textContent = value;
      item.append(title, amount);
      return item;
    }));
    const list = get('mixed-history');
    list.start = Math.max(1, history.length - 7);
    list.replaceChildren(...history.slice(-8).map((round, index) => {
      const item = document.createElement('li');
      item.textContent = `Round ${Math.max(1, history.length - 7) + index}: your ${MOVES[round.player]} versus ${MOVES[round.opponent]}; ${round.score === 1 ? 'you win (+1)' : round.score === -1 ? 'you lose (−1)' : 'draw (0)'}.`;
      return item;
    }));
  }

  function reset() {
    settings = readSettings();
    history = [];
    opponentRandom = seededRandom(settings.seed + 104729);
    nextOpponent = predictNext([], opponentRandom);
    renderManual();
    get('mixed-result').textContent = 'A fresh opponent has fixed its first move. Make a prediction, then play.';
    get('mixed-batch-result').textContent = 'Run a comparison to see results from a set of simulated rounds.';
    get('mixed-batch-rows').replaceChildren();
    get('mixed-batch-table').hidden = true;
    const valid = settings.weights.some(weight => weight > 0);
    get('mixed-run').disabled = !valid;
    if (valid) {
      const chances = probabilities(settings.weights);
      get('mixed-mixture').textContent = `Your mixture: ${chances.map((chance, index) => `${MOVES[index]} ${number(chance * 100, 1)}%`).join(', ')}. Lowest expected average: ${number(worstCaseScore(settings.weights), 3)} points per round if an opponent knows these chances and chooses its best reply. This is a calculated average; an actual run can finish above or below it.`;
    } else {
      get('mixed-mixture').textContent = 'Set at least one positive weight to run a comparison. All three weights are currently zero.';
    }
  }

  function play(player) {
    if (!get('mixed-prediction').value) {
      get('mixed-result').textContent = 'Choose a prediction first, then test it with your moves.';
      get('mixed-prediction').focus();
      return;
    }
    const opponent = nextOpponent;
    const score = scoreRound(player, opponent.move);
    history.push({ player, opponent: opponent.move, score });
    const result = score === 1 ? 'You gain 1 point (+1).' : score === -1 ? 'You lose 1 point (−1).' : 'A draw: 0 points each.';
    get('mixed-result').textContent = `Round ${history.length}: you played ${MOVES[player]}; the opponent played ${MOVES[opponent.move]}. ${result} It predicted ${MOVES[opponent.prediction]} before you chose. Basis: ${opponent.method.toLowerCase()}.`;
    renderManual();
    nextOpponent = predictNext(history.map(round => round.player), opponentRandom);
  }

  function runComparison() {
    if (!settings.weights.some(weight => weight > 0)) return;
    const custom = simulateBatch(settings.weights, settings);
    const uniform = simulateBatch([1, 1, 1], settings);
    get('mixed-batch-rows').replaceChildren(...[['Your mixture', custom], ['Equal chance on every draw', uniform]].map(([label, result]) => {
      const row = document.createElement('tr');
      [label, result.wins, result.draws, result.losses, result.score, result.opponentScore, number(result.average, 3)].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        if (index === 0) cell.scope = 'row';
        cell.textContent = String(value);
        row.append(cell);
      });
      return row;
    }));
    get('mixed-batch-table').hidden = false;
    get('mixed-batch-result').textContent = `Seed ${settings.seed}; ${settings.rounds} rounds per mixture. Your mixture scored ${custom.score}; the equal mixture scored ${uniform.score}. These are results from simulated rounds against this pattern spotter. Use the same seed to repeat them, or change the seed to try another run.`;
  }

  root.querySelectorAll('[data-mixed-move]').forEach(button => button.addEventListener('click', () => play(Number(button.dataset.mixedMove))));
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  get('mixed-run').addEventListener('click', runComparison);
  reset();
  return { reset };
}
