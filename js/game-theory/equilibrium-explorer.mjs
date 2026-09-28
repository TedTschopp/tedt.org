import { loadSettings } from './shared.mjs';

export const PRESETS = Object.freeze({
  prisoners: { label: 'Prisoner’s Dilemma', context: 'For both players, A means cooperate: help each other if both choose it. B means defect: take the other choice. Can either player earn more by switching alone?', payoffs: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]] },
  chicken: { label: 'Chicken', context: 'For both players, A means yield and B means insist. Yielding to an insistent player costs less than both insisting.', payoffs: [[[2, 2], [1, 4]], [[4, 1], [-2, -2]]] },
  coordination: { label: 'Coordination', context: 'A means adopt the shared new standard; B means keep the old standard. Both prefer shared adoption, but switching alone is costly.', payoffs: [[[4, 4], [0, 2]], [[2, 0], [2, 2]]] },
  matching: { label: 'Matching pennies', context: 'The row player wants matching letters; the column player wants different letters. Their points sum to zero.', payoffs: [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]] },
});

function validateGame(game) {
  if (!Array.isArray(game) || game.length !== 2 || game.some(row => !Array.isArray(row) || row.length !== 2 || row.some(cell => !Array.isArray(cell) || cell.length !== 2 || cell.some(value => !Number.isFinite(value))))) {
    throw new TypeError('A game must contain two rows, two columns, and two finite payoffs in each cell.');
  }
}

/** Weak best responses include ties. Only pure-strategy equilibria are returned. */
export function analyzeGame(game) {
  validateGame(game);
  const bestRows = [0, 1].map(r => [0, 1].map(c => game[r][c][0] >= game[1 - r][c][0]));
  const bestColumns = [0, 1].map(r => [0, 1].map(c => game[r][c][1] >= game[r][1 - c][1]));
  const equilibria = [];
  const bestCombined = [];
  let maxCombined = -Infinity;
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 2; c += 1) {
      if (bestRows[r][c] && bestColumns[r][c]) equilibria.push([r, c]);
      const sum = game[r][c][0] + game[r][c][1];
      if (sum > maxCombined) { maxCombined = sum; bestCombined.length = 0; }
      if (sum === maxCombined) bestCombined.push([r, c]);
    }
  }
  return { bestRows, bestColumns, equilibria, maxCombined, bestCombined };
}

export function unilateralMoves(game, row, column) {
  validateGame(game);
  if (![0, 1].includes(row) || ![0, 1].includes(column)) throw new RangeError('Actions must be 0 or 1.');
  const current = [...game[row][column]];
  return {
    current,
    combined: current[0] + current[1],
    rowAlternative: game[1 - row][column][0],
    columnAlternative: game[row][1 - column][1],
    rowGain: game[1 - row][column][0] - current[0],
    columnGain: game[row][1 - column][1] - current[1],
  };
}

const letter = value => value === 0 ? 'A' : 'B';
const outcomeName = ([r, c]) => `${letter(r)} / ${letter(c)}`;
function paragraph(parent, text) {
  const p = document.createElement('p');
  p.textContent = text;
  parent.append(p);
}

export function mount(root) {
  const get = id => root.querySelector(`#equilibrium-${id}`);
  let game;
  let row = 0;
  let column = 0;
  let revealed = false;
  const payoffInputs = [];
  for (let r = 0; r < 2; r += 1) for (let c = 0; c < 2; c += 1) for (const player of ['row', 'column']) payoffInputs.push(get(`${r}${c}-${player}`));

  function readPayoff(input) {
    const parsed = Number(input.value);
    const value = Math.min(100, Math.max(-100, Math.round(Number.isFinite(parsed) ? parsed : 0)));
    input.value = String(value);
    return value;
  }

  function drawTable() {
    const analysis = analyzeGame(game);
    const body = get('table');
    body.replaceChildren();
    for (let r = 0; r < 2; r += 1) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = letter(r);
      tr.append(th);
      for (let c = 0; c < 2; c += 1) {
        const td = document.createElement('td');
        paragraph(td, `(${game[r][c][0]}, ${game[r][c][1]})`);
        if (revealed) {
          const labels = [];
          if (analysis.bestRows[r][c]) labels.push('Row best response');
          if (analysis.bestColumns[r][c]) labels.push('Column best response');
          if (analysis.bestRows[r][c] && analysis.bestColumns[r][c]) { labels.push('Nash equilibrium'); td.classList.add('gt-equilibrium-cell'); }
          if (r === row && c === column) { labels.push('Current outcome'); td.classList.add('gt-current-cell'); }
          if (labels.length) paragraph(td, labels.join(' · '));
        }
        tr.append(td);
      }
      body.append(tr);
    }
    get('summary').textContent = revealed
      ? `${analysis.equilibria.length ? `Pure Nash equilibria: ${analysis.equilibria.map(outcomeName).join('; ')}. At each of these fixed choices, neither player can earn more by switching alone.` : 'There is no pure Nash equilibrium in this game. At every cell, at least one player can earn more by switching alone. Strategies that use chance are not checked here.'} Highest combined payoff: ${analysis.maxCombined} points at ${analysis.bestCombined.map(outcomeName).join('; ')}.`
      : 'Reveal an outcome to see each player’s best choices and find any pair where neither gains by switching alone.';
  }

  function showOutcome(moveText = '') {
    revealed = true;
    const moves = unilateralMoves(game, row, column);
    const result = get('result');
    result.replaceChildren();
    if (moveText) paragraph(result, moveText);
    paragraph(result, `At ${outcomeName([row, column])}: row player ${moves.current[0]} points; column player ${moves.current[1]} points; combined ${moves.combined}.`);
    for (const [name, gain, alternative] of [['Row', moves.rowGain, moves.rowAlternative], ['Column', moves.columnGain, moves.columnAlternative]]) {
      paragraph(result, `${name} player switching alone would get ${alternative}: ${gain > 0 ? `a gain of ${gain}` : gain < 0 ? `a loss of ${Math.abs(gain)}` : 'a tie, with no gain'}.`);
    }
    const equilibrium = moves.rowGain <= 0 && moves.columnGain <= 0;
    paragraph(result, equilibrium ? 'This is a Nash equilibrium: neither player can improve by switching alone.' : 'This is not a Nash equilibrium: at least one player can improve by switching alone.');
    const analysis = analyzeGame(game);
    if (equilibrium && moves.combined < analysis.maxCombined) paragraph(result, `Yet both players’ combined points could be ${analysis.maxCombined} elsewhere. Stability does not mean the best combined result.`);
    const prediction = get('prediction').value;
    if (prediction) paragraph(result, prediction === 'yes' ? 'Your prediction was that an equilibrium must give the highest combined points. The Prisoner’s Dilemma preset shows why that is not always true: B / B is stable but A / A has a higher total.' : 'An equilibrium does not have to give the highest combined points. Test that idea with the Prisoner’s Dilemma preset.');
    get('switch-row').disabled = false;
    get('switch-column').disabled = false;
    drawTable();
  }

  function reset() {
    game = [0, 1].map(r => [0, 1].map(c => ['row', 'column'].map(player => readPayoff(get(`${r}${c}-${player}`)))));
    row = Number(get('row-choice').value);
    column = Number(get('column-choice').value);
    revealed = false;
    get('context').textContent = PRESETS[get('preset').value]?.context || 'You control the incentives. A and B can represent any pair of actions; each player prefers more points.';
    get('result').replaceChildren();
    paragraph(get('result'), 'Choose A or B for each player, then reveal the incentives.');
    get('switch-row').disabled = true;
    get('switch-column').disabled = true;
    drawTable();
  }

  get('preset').addEventListener('change', () => {
    const preset = PRESETS[get('preset').value];
    if (preset) for (let r = 0; r < 2; r += 1) for (let c = 0; c < 2; c += 1) ['row', 'column'].forEach((player, index) => { get(`${r}${c}-${player}`).value = String(preset.payoffs[r][c][index]); });
    reset();
  });
  payoffInputs.forEach(input => input.addEventListener('change', () => { get('preset').value = 'custom'; reset(); }));
  ['row-choice', 'column-choice'].forEach(id => get(id).addEventListener('change', reset));
  get('play').addEventListener('click', () => showOutcome());
  for (const player of ['row', 'column']) get(`switch-${player}`).addEventListener('click', () => {
    const before = game[row][column][player === 'row' ? 0 : 1];
    if (player === 'row') row = 1 - row;
    else column = 1 - column;
    const after = game[row][column][player === 'row' ? 0 : 1];
    showOutcome(`${player === 'row' ? 'Row' : 'Column'} player switched alone, moving from ${before} to ${after} points. The other player’s choice stayed fixed.`);
  });
  loadSettings(root);
  // A hand-edited preset-only link must load that preset's payoffs as well.
  const loadedPreset = PRESETS[get('preset').value];
  if (loadedPreset) {
    const params = new URLSearchParams(globalThis.location?.search || '');
    if (!payoffInputs.some(input => params.has(input.id))) {
      for (let r = 0; r < 2; r += 1) for (let c = 0; c < 2; c += 1) ['row', 'column'].forEach((player, index) => {
        get(`${r}${c}-${player}`).value = String(loadedPreset.payoffs[r][c][index]);
      });
    } else if (payoffInputs.some((input, index) => Number(input.value) !== loadedPreset.payoffs.flat(2)[index])) {
      get('preset').value = 'custom';
    }
  }
  reset();
  return { reset };
}
