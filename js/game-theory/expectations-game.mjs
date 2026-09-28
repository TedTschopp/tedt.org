import { loadSettings } from './shared.mjs';

const bounded = (value, low, high, fallback = low) => Math.min(high, Math.max(low, Number.isFinite(Number(value)) ? Number(value) : fallback));
export function reasonedNumber(depth = 0, anchor = 50) {
  return bounded(anchor, 0, 100) * (2 / 3) ** Math.round(bounded(depth, 0, 8));
}
export function makePopulation(kind = 'mixed') {
  const depths = kind === 'mixed' ? [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4] : Array(19).fill(Math.round(bounded(kind, 0, 4)));
  return depths.map((depth, index) => ({ id: index + 1, depth, choice: reasonedNumber(depth) }));
}
export function scoreRound(yourChoice, population) {
  const choices = [bounded(yourChoice, 0, 100), ...population.map(player => bounded(player.choice, 0, 100))];
  const average = choices.reduce((sum, choice) => sum + choice, 0) / choices.length;
  const target = 2 * average / 3;
  const distances = choices.map(choice => Math.abs(choice - target));
  const closest = Math.min(...distances);
  const winners = distances.flatMap((distance, index) => Math.abs(distance - closest) < 1e-9 ? [index] : []);
  const prizes = choices.map((_, index) => winners.includes(index) ? 100 / winners.length : 0);
  return { choices, average, target, distances, winners, prizes, totalPrize: prizes.reduce((sum, prize) => sum + prize, 0) };
}
export function adaptPopulation(population, target, learning = 0.5) {
  const rate = bounded(learning, 0, 1);
  return population.map(player => ({ ...player, choice: bounded(player.choice * (1 - rate) + bounded(target, 0, 100) * rate, 0, 100) }));
}

export function mount(root) {
  loadSettings(root);
  const find = name => root.querySelector(`[data-expect-${name}]`);
  const control = name => root.querySelector(`[data-setting="${name}"]`);
  const fmt = value => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  let population;
  let round;
  let total;
  function reset() {
    population = makePopulation(control('population').value);
    round = 0;
    total = 0;
    find('history').replaceChildren();
    find('prediction').value = '';
    find('play').disabled = false;
    find('result').textContent = 'Predict the target range, choose your number, and play the first round.';
    find('population').textContent = `There are 19 simulated players plus you. ${control('population').value === 'mixed' ? 'Their starting reasoning depths range from 0 to 4.' : `All start with reasoning depth ${control('population').value}.`} They update only after a round finishes.`;
    find('scores').textContent = 'Your total prize: 0 points. The group shares exactly 100 prize points per round.';
  }
  find('play').addEventListener('click', () => {
    if (!find('prediction').value) { find('result').textContent = 'Choose a target-range prediction first.'; find('prediction').focus(); return; }
    const choice = bounded(find('choice').value, 0, 100, 33);
    find('choice').value = String(choice);
    const result = scoreRound(choice, population);
    round += 1;
    total += result.prizes[0];
    const band = result.target < 20 ? 'low' : result.target <= 40 ? 'middle' : 'high';
    find('result').textContent = `Round ${round}: the group average is ${fmt(result.average)}, so the target is ${fmt(result.target)}. Your number, ${fmt(choice)}, is ${fmt(result.distances[0])} away. You earn ${fmt(result.prizes[0])} of the 100 prize points; the other players share ${fmt(100 - result.prizes[0])}. ${result.winners.length} player${result.winners.length === 1 ? '' : 's'} ${result.winners.length === 1 ? 'is' : 'are'} closest. Your target-range prediction ${band === find('prediction').value ? 'matches' : 'does not match'} the result.`;
    const row = document.createElement('tr');
    [round, fmt(choice), fmt(result.average), fmt(result.target), fmt(result.distances[0]), fmt(result.prizes[0])].forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      if (index === 0) cell.scope = 'row';
      cell.textContent = String(value); row.append(cell);
    });
    find('history').prepend(row);
    population = adaptPopulation(population, result.target, Number(control('learning').value) / 100);
    find('scores').textContent = `Your total prize: ${fmt(total)} points across ${round} rounds. All players together: ${round * 100} points. These are redistributed prizes, not new value created by lower guesses.`;
    find('population').textContent = `The simulated players move ${control('learning').value}% of the way from their previous choice toward this round’s target before the next round. Their next average choice is ${fmt(population.reduce((sum, player) => sum + player.choice, 0) / population.length)}. Use that clue for your next number.`;
    if (round >= 30) { find('play').disabled = true; find('result').textContent += ' This 30-round run is complete. Reset to replay.'; }
  });
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  reset();
  return { reset };
}
