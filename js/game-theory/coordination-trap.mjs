import { loadSettings, seededRandom } from './shared.mjs';

const TEAM_COUNT = 8;
const COMMITMENT_REVIEWS = 3;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const bounded = (value, fallback, min, max) => clamp(Number.isFinite(Number(value)) ? Number(value) : fallback, min, max);

export function normalizeOptions(options = {}) {
  return {
    benefit: bounded(options.benefit ?? 10, 10, 0, 30),
    cost: bounded(options.cost ?? 6, 6, 0, 30),
    support: bounded(options.support ?? 0, 0, 0, 30),
    expectation: bounded(options.expectation ?? 0, 0, -100, 100),
    initial: Math.round(bounded(options.initial ?? 0, 0, 0, 7)),
    commitments: Math.round(bounded(options.commitments ?? 0, 0, 0, 7)),
    seed: Math.round(bounded(options.seed ?? 42, 42, 0, 2147483647)),
  };
}

export function adoptionValue(team, peerShare, options) {
  return options.benefit * clamp(peerShare, 0, 1) - options.cost + (team.pilot ? options.support : 0);
}

export function peerShare(teams, index) {
  return teams.reduce((count, team, i) => count + (i !== index && team.adopt ? 1 : 0), 0) / (teams.length - 1);
}

export function summarize(state, rawOptions) {
  const options = normalizeOptions(rawOptions);
  const values = state.teams.map((team, index) => team.adopt ? adoptionValue(team, peerShare(state.teams, index), options) : 0);
  const supportUsed = state.teams.filter(team => team.adopt && team.pilot).length * options.support;
  const combined = values.reduce((sum, value) => sum + value, 0);
  return { adopters: state.teams.filter(team => team.adopt).length, values, combined, supportUsed, afterFunding: combined - supportUsed };
}

export function createScenario(rawOptions = {}) {
  const options = normalizeOptions(rawOptions);
  const random = seededRandom(options.seed);
  const order = Array.from({ length: TEAM_COUNT - 1 }, (_, index) => index + 1);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [order[index], order[other]] = [order[other], order[index]];
  }
  return {
    review: 0,
    teams: Array.from({ length: TEAM_COUNT }, (_, index) => ({
      id: index + 1,
      pilot: order.slice(0, 3).includes(index),
      committed: order.slice(0, options.commitments).includes(index),
      adopt: order.slice(0, Math.max(options.initial, options.commitments)).includes(index),
    })),
    history: [],
  };
}

export function stepScenario(state, rawOptions, userChoice = null) {
  const options = normalizeOptions(rawOptions);
  const review = state.review + 1;
  const forecasts = state.teams.map((team, index) => adoptionValue(team, clamp(peerShare(state.teams, index) + options.expectation / 100, 0, 1), options));
  const teams = state.teams.map((team, index) => {
    let adopt = forecasts[index] > 0 || (forecasts[index] === 0 && team.adopt);
    if (team.committed && review <= COMMITMENT_REVIEWS) adopt = true;
    if (index === 0 && (userChoice === 'adopt' || userChoice === 'wait')) adopt = userChoice === 'adopt';
    return { ...team, adopt };
  });
  const next = { review, teams, history: [] };
  const outcome = summarize(next, options);
  next.history = [...state.history, { review, adopters: outcome.adopters, ownValue: outcome.values[0], combined: outcome.combined, ownForecast: forecasts[0], ownAdopt: teams[0].adopt, changed: teams.some((team, index) => team.adopt !== state.teams[index].adopt) }].slice(-8);
  return next;
}

export function mount(root) {
  loadSettings(root);
  const get = id => root.querySelector(`#${id}`);
  let options;
  let state;
  const format = value => (Math.abs(value) < 0.00001 ? '0.00' : value.toFixed(2));
  const readOptions = () => normalizeOptions(Object.fromEntries(['benefit', 'cost', 'support', 'expectation', 'initial', 'commitments', 'seed'].map(key => [key, get(`coord-${key}`).value])));

  function render(message) {
    get('coord-result').textContent = message;
    const summary = summarize(state, options);
    const metrics = [
      ['Teams planning to adopt', `${summary.adopters} / ${TEAM_COUNT}`],
      ['Your team’s net value', format(summary.values[0])],
      ['Combined team value', format(summary.combined)],
      ['Combined value after funding', format(summary.afterFunding)],
    ];
    get('coord-metrics').replaceChildren(...metrics.map(([label, value]) => {
      const item = document.createElement('div');
      item.className = 'gt-metric';
      const title = document.createElement('span');
      title.textContent = label;
      const number = document.createElement('strong');
      number.textContent = value;
      item.append(title, number);
      return item;
    }));
    get('coord-teams').replaceChildren(...state.teams.map((team, index) => {
      const row = document.createElement('tr');
      const cells = [`Team ${team.id}${index === 0 ? ' (You)' : ''}`, team.adopt ? 'Adopt' : 'Wait', team.pilot ? `${options.support} available` : 'None', team.committed ? (state.review <= COMMITMENT_REVIEWS ? 'Through review 3' : 'Expired') : 'None', format(summary.values[index])];
      cells.forEach((value, cellIndex) => {
        const cell = document.createElement(cellIndex === 0 ? 'th' : 'td');
        if (cellIndex === 0) cell.scope = 'row';
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    }));
    const history = get('coord-history');
    history.start = Math.max(1, state.review - state.history.length + 1);
    history.replaceChildren(...state.history.map(record => {
      const item = document.createElement('li');
      item.textContent = `Review ${record.review}: ${record.adopters} teams adopt; your value ${format(record.ownValue)}; combined team value ${format(record.combined)}.`;
      return item;
    }));
  }

  function reset() {
    options = readOptions();
    Object.entries(options).forEach(([key, value]) => { get(`coord-${key}`).value = String(value); });
    state = createScenario(options);
    render('Starting plans are shown below. Make a prediction, then choose whether your team adopts.');
  }

  function advance(choice) {
    if (!get('coord-prediction').value) {
      get('coord-result').textContent = 'Choose a prediction before the first review. It is fine to be uncertain.';
      get('coord-prediction').focus();
      return;
    }
    state = stepScenario(state, options, choice);
    const last = state.history.at(-1);
    const forecast = `Before this review, your team expected switching to earn ${format(last.ownForecast)} points after costs.`;
    const result = `Your team ${last.ownAdopt ? 'adopts' : 'waits'} and gets ${format(last.ownValue)} points with the plans actually chosen.`;
    const stable = last.changed ? 'Teams changed their plans.' : 'No team changed its plan in this review.';
    const commitment = state.review === 4 && options.commitments > 0 ? ' The three-review commitments have now expired.' : '';
    render(`Review ${state.review}. ${forecast} ${result} ${stable}${commitment}`);
  }

  root.querySelectorAll('[data-coord-choice]').forEach(button => button.addEventListener('click', () => advance(button.dataset.coordChoice)));
  get('coord-step').addEventListener('click', () => advance(null));
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  reset();
  return { reset };
}
