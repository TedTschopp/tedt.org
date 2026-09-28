import { loadSettings } from './shared.mjs';
export function validateBallots(ballots, candidates) {
  if (![3, 4].includes(candidates.length) || new Set(candidates).size !== candidates.length || !ballots.length || ballots.some(b => !Number.isInteger(b.count) || b.count < 0 || b.count > 20 || !Array.isArray(b.rank) || b.rank.length !== candidates.length || new Set(b.rank).size !== candidates.length || b.rank.some(c => !candidates.includes(c)) || !Number.isInteger(b.approve) || b.approve < 1 || b.approve > candidates.length)) throw new RangeError('Use complete rankings, counts from 0 to 20, and a valid approval cutoff.');
  if (!ballots.some(b => b.count > 0)) throw new RangeError('At least one vote is required.');
}
export function countVotes(ballots, candidates = ['A', 'B', 'C']) {
  validateBallots(ballots, candidates);
  const total = ballots.reduce((n, b) => n + b.count, 0);
  const tally = active => Object.fromEntries(active.map(c => [c, ballots.reduce((n, b) => n + (b.rank.find(x => active.includes(x)) === c ? b.count : 0), 0)]));
  const leaders = scores => Object.keys(scores).filter(c => scores[c] === Math.max(...Object.values(scores)));
  const pluralityScores = tally(candidates), approvalScores = Object.fromEntries(candidates.map(c => [c, ballots.reduce((n, b) => n + (b.rank.slice(0, b.approve).includes(c) ? b.count : 0), 0)]));
  const rounds = []; let active = [...candidates], irv;
  while (active.length) {
    const scores = tally(active); rounds.push({ active: [...active], scores });
    const majority = active.find(c => scores[c] > total / 2);
    if (majority) { irv = { winners: [majority], unresolved: false, rounds }; break; }
    const low = active.filter(c => scores[c] === Math.min(...Object.values(scores)));
    if (low.length > 1) { irv = { winners: [], unresolved: true, tiedForElimination: low, rounds }; break; }
    active = active.filter(c => c !== low[0]);
  }
  const pairwise = Object.fromEntries(candidates.map(a => [a, Object.fromEntries(candidates.filter(b => a !== b).map(b => [b, ballots.reduce((n, row) => n + (row.rank.indexOf(a) < row.rank.indexOf(b) ? row.count : 0), 0)]))]));
  const condorcet = candidates.filter(a => candidates.every(b => a === b || pairwise[a][b] > pairwise[b][a]));
  const cycle = candidates.some(a => candidates.some(b => candidates.some(c => a !== b && b !== c && a !== c && pairwise[a][b] > pairwise[b][a] && pairwise[b][c] > pairwise[c][b] && pairwise[c][a] > pairwise[a][c])));
  return { plurality: { winners: leaders(pluralityScores), scores: pluralityScores }, approval: { winners: leaders(approvalScores), scores: approvalScores }, irv, pairwise: { winners: condorcet, scores: pairwise, cycle }, total };
}
export function votingComparison(genuine, submitted, candidates) {
  validateBallots(genuine, candidates); validateBallots(submitted, candidates);
  return { honest: countVotes(genuine, candidates), submitted: countVotes(submitted, candidates) };
}
export function mount(root) {
  loadSettings(root); const $ = id => root.querySelector(`#vote-${id}`);
  const rules = ['plurality', 'irv', 'approval', 'pairwise'];
  const labels = { plurality: 'Plurality', irv: 'Instant runoff', approval: 'Approval', pairwise: 'Pairwise majority' };
  let candidates, genuine, submitted, comparison;
  const describe = (result, rule) => result.winners.length ? `${result.winners.join(' and ')}${result.winners.length > 1 ? ' (tied)' : ''}` : rule === 'irv' ? `Unresolved: ${result.tiedForElimination.join(', ')} tied for elimination` : `No candidate beats every other candidate${result.cycle ? '; a majority cycle exists' : '; at least one comparison ties'}`;
  function reset() {
    candidates = ['A', 'B', 'C', 'D'].slice(0, Number($('candidates').value));
    const readRank = id => Array.from($(id).value).filter(c => candidates.includes(c));
    genuine = [0, 1, 2, 3].map(i => ({ count: i ? Number($(`count${i}`).value) : 1, rank: readRank(`rank${i}`), approve: Math.min(candidates.length, Number($(`approve${i}`).value)) }));
    submitted = genuine.map(row => ({ ...row, rank: [...row.rank] }));
    if (!$('honest').checked) { submitted[0].rank = readRank('ballot'); submitted[0].approve = Math.min(candidates.length, Number($('ballot-approve').value)); }
    comparison = votingComparison(genuine, submitted, candidates);
    $('prediction').value = ''; $('result').textContent = 'Predict the selected rule’s result, then cast your ballot. Your genuine preferences stay separate from your submitted ballot.';
    $('comparison').replaceChildren(); $('rounds').replaceChildren(); $('pairs').replaceChildren();
  }
  $('cast').addEventListener('click', () => {
    if (!$('prediction').value) { $('result').textContent = 'Choose a prediction first.'; $('prediction').focus(); return; }
    $('comparison').replaceChildren();
    rules.forEach(rule => { const tr = document.createElement('tr'); [labels[rule], describe(comparison.honest[rule], rule), describe(comparison.submitted[rule], rule)].forEach((x, i) => { const cell = document.createElement(i ? 'td' : 'th'); if (!i) cell.scope = 'row'; cell.textContent = x; tr.append(cell); }); $('comparison').append(tr); });
    $('rounds').replaceChildren(); comparison.submitted.irv.rounds.forEach((round, i) => { const li = document.createElement('li'); li.textContent = `Round ${i + 1}: ${Object.entries(round.scores).map(([c, n]) => `${c} has ${n}`).join('; ')}.`; $('rounds').append(li); });
    $('pairs').replaceChildren(); candidates.forEach((a, i) => candidates.slice(i + 1).forEach(b => { const li = document.createElement('li'); li.textContent = `${a} against ${b}: ${comparison.submitted.pairwise.scores[a][b]} to ${comparison.submitted.pairwise.scores[b][a]}.`; $('pairs').append(li); }));
    const rule = $('rule').value, result = comparison.submitted[rule], predicted = result.winners.length === 1 ? result.winners[0] : 'none';
    const personal = result.winners.map(c => `${c} is your genuine choice ${genuine[0].rank.indexOf(c) + 1}`).join('; ');
    const group = result.winners.map(c => `${c}: ${genuine.reduce((n, b) => n + b.count * (candidates.length - 1 - b.rank.indexOf(c)), 0)} rank points`).join('; ');
    $('result').textContent = `${labels[rule]} result: ${describe(result, rule)}. ${personal ? `${personal}. Group score: ${group}. ` : 'Without a selected winner, personal and group scores are not assigned. '}${$('prediction').value === predicted ? 'Your prediction matches.' : 'Your prediction differs.'} Group rank points use genuine preferences: first earns ${candidates.length - 1}, then one fewer per place, down to zero. This is an illustrative comparison, not a measure of how strongly voters feel. All rules counted the same submitted rankings; approval also uses each voter’s approval cutoff.`;
  });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset)); reset(); return { reset };
}
