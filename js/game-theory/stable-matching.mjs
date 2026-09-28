import { loadSettings } from './shared.mjs';

export const ORDERS = ['012', '021', '102', '120', '201', '210'];
export const DEFAULT_APPLICANTS = [[0, 1, 2], [1, 0, 2], [0, 1, 2]];
export const DEFAULT_TEAMS = [[1, 0, 2], [0, 1, 2], [2, 0, 1]];

export function validatePreferences(preferences, size = 3) {
  if (!Array.isArray(preferences) || preferences.length !== size || preferences.some(row =>
    !Array.isArray(row) || row.length !== size || new Set(row).size !== size || row.some(x => !Number.isInteger(x) || x < 0 || x >= size))) {
    throw new RangeError('Each person must rank every partner once, with no ties.');
  }
  return true;
}

export function blockingPairs(applicants, teams, matching) {
  validatePreferences(applicants); validatePreferences(teams);
  if (!Array.isArray(matching) || matching.length !== 3 || matching.some(x => !Number.isInteger(x) || x < -1 || x > 2) || new Set(matching.filter(x => x >= 0)).size !== matching.filter(x => x >= 0).length) throw new RangeError('Invalid matching.');
  const pairs = [];
  for (let a = 0; a < 3; a++) for (let t = 0; t < 3; t++) {
    if (matching[a] === t) continue;
    const partner = matching.indexOf(t);
    if ((matching[a] < 0 || applicants[a].indexOf(t) < applicants[a].indexOf(matching[a])) &&
        (partner < 0 || teams[t].indexOf(a) < teams[t].indexOf(partner))) pairs.push([a, t]);
  }
  return pairs;
}

export function deferredAcceptance(applicants = DEFAULT_APPLICANTS, teams = DEFAULT_TEAMS, side = 'applicants') {
  validatePreferences(applicants); validatePreferences(teams);
  if (!['applicants', 'teams'].includes(side)) throw new RangeError('Unknown proposer side.');
  const proposers = side === 'applicants' ? applicants : teams;
  const receivers = side === 'applicants' ? teams : applicants;
  const next = [0, 0, 0], held = [-1, -1, -1], trace = [];
  while (true) {
    const p = next.findIndex((n, i) => !held.includes(i) && n < 3);
    if (p < 0) break;
    const r = proposers[p][next[p]++], old = held[r];
    const accepted = old < 0 || receivers[r].indexOf(p) < receivers[r].indexOf(old);
    if (accepted) held[r] = p;
    const matching = side === 'applicants' ? [0, 1, 2].map(a => held.indexOf(a)) : [...held];
    trace.push({ proposer: p, receiver: r, accepted, displaced: accepted ? old : -1, matching });
  }
  const matching = trace.at(-1).matching;
  return { matching, trace, blocking: blockingPairs(applicants, teams, matching) };
}

export function mount(root) {
  loadSettings(root);
  const $ = id => root.querySelector(`#match-${id}`);
  const names = ['A', 'B', 'C'], teamNames = ['Oak', 'Pine', 'Elm'];
  let model, step, prefs;
  function show(matching, finished = false) {
    $('pairs').replaceChildren();
    matching.forEach((t, a) => {
      const li = document.createElement('li');
      li.textContent = t < 0 ? `Applicant ${names[a]} is waiting.` : `Applicant ${names[a]} with ${teamNames[t]}: applicant choice ${prefs.a[a].indexOf(t) + 1}; team choice ${prefs.t[t].indexOf(a) + 1}.`;
      $('pairs').append(li);
    });
    const blocking = blockingPairs(prefs.a, prefs.t, matching);
    $('blocking').textContent = blocking.length ? `Pairs who both prefer each other: ${blocking.map(([a, t]) => `${names[a]} and ${teamNames[t]}`).join('; ')}. ${finished ? 'This assignment is not stable.' : 'These are temporary assignments; more proposals remain.'}` : `${finished ? 'Stable assignment. ' : ''}No pair both prefers leaving its current assignment for the other.`;
  }
  function reset() {
    prefs = { a: [0, 1, 2].map(i => Array.from($(`a${i}`).value, Number)), t: [0, 1, 2].map(i => Array.from($(`t${i}`).value, Number)) };
    model = deferredAcceptance(prefs.a, prefs.t, $('side').value); step = 0;
    $('prediction').value = ''; $('result').textContent = 'Predict Applicant A’s outcome, then choose how to make the matches.';
    $('log').replaceChildren(); $('step').disabled = false; show([-1, -1, -1]);
  }
  function predict() {
    if ($('prediction').value) return true;
    $('result').textContent = 'Choose a prediction first.'; $('prediction').focus(); return false;
  }
  function conclusion(matching) {
    const rank = prefs.a[0].indexOf(matching[0]) + 1;
    const total = matching.reduce((sum, t, a) => sum + prefs.a[a].indexOf(t) + 1 + prefs.t[t].indexOf(a) + 1, 0);
    $('result').textContent = `You are Applicant A: you get choice ${rank}. ${Number($('prediction').value) === rank ? 'Your prediction matches.' : 'Your prediction differs.'} All six participants’ choice numbers add to ${total}; smaller means better rankings under this simple score. Rank numbers do not measure how strongly people feel. ${blockingPairs(prefs.a, prefs.t, matching).length ? 'At least one pair would prefer to leave together.' : 'No pair would prefer to leave together. Stability does not guarantee everyone gets a first choice.'}`;
  }
  $('step').addEventListener('click', () => {
    if (!predict() || step >= model.trace.length) return;
    const event = model.trace[step++], applicantsPropose = $('side').value === 'applicants';
    const proposer = applicantsPropose ? `Applicant ${names[event.proposer]}` : teamNames[event.proposer];
    const receiver = applicantsPropose ? teamNames[event.receiver] : `Applicant ${names[event.receiver]}`;
    const li = document.createElement('li');
    li.textContent = `${proposer} proposes to ${receiver}. ${event.accepted ? 'The offer is held for now.' : 'The offer is rejected.'}${event.displaced >= 0 ? ' The previous held offer is released.' : ''}`;
    $('log').append(li); show(event.matching, step === model.trace.length);
    if (step === model.trace.length) { $('step').disabled = true; conclusion(event.matching); }
  });
  $('finish').addEventListener('click', () => { if (!predict()) return; while (step < model.trace.length) $('step').click(); });
  $('inspect').addEventListener('click', () => { if (!predict()) return; const matching = Array.from($('manual').value, Number); show(matching, true); conclusion(matching); });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset));
  reset(); return { reset };
}
