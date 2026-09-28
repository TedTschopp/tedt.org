import { loadSettings } from './shared.mjs';

/** Complete-information entry game; ties retain every pure best response. */
export function solveThreat({ sharedProfit = 3, fightCost = 2, deposit = 0, entrantGain = 2, entrantLoss = 1 } = {}) {
  const payoffs = {
    out: { incumbent: 5, entrant: 0 },
    accommodate: { incumbent: sharedProfit - deposit, entrant: entrantGain },
    fight: { incumbent: -fightCost || 0, entrant: -entrantLoss || 0 },
  };
  const best = Math.max(payoffs.fight.incumbent, payoffs.accommodate.incumbent);
  const responses = ['accommodate', 'fight'].filter(action => payoffs[action].incumbent === best);
  const equilibria = responses.flatMap(response => {
    const entryPayoff = payoffs[response].entrant;
    const choices = entryPayoff > 0 ? ['enter'] : entryPayoff < 0 ? ['out'] : ['enter', 'out'];
    return choices.map(choice => ({ response, choice, payoffs: choice === 'out' ? payoffs.out : payoffs[response] }));
  });
  return { payoffs, responses, equilibria, threshold: sharedProfit + fightCost,
    credibility: responses.length > 1 ? 'tie' : responses[0] === 'fight' ? 'strict' : 'none' };
}

export function mount(root) {
  loadSettings(root);
  const find = key => root.querySelector(`[data-threat-${key}]`);
  const settings = () => Object.fromEntries(['sharedProfit', 'fightCost', 'deposit', 'entrantGain', 'entrantLoss']
    .map(key => [key, Number(root.querySelector(`[data-setting="${key}"]`).value)]));
  const fmt = number => Number(number).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const describe = action => action === 'accommodate' ? 'share the market' : 'fight';
  let model;
  let step = 0;

  function reset() {
    model = solveThreat(settings());
    step = 0;
    find('prediction').value = '';
    find('result').textContent = 'Predict what the incumbent will do if you enter. Then make your entry decision.';
    find('analysis').textContent = 'Work backward from the incumbent’s decision after entry.';
    find('step').disabled = false;
    find('step').textContent = '1. Inspect the incumbent’s incentives';
    for (const [branch, payoff] of Object.entries(model.payoffs)) {
      find(`${branch}-incumbent`).textContent = fmt(payoff.incumbent);
      find(`${branch}-entrant`).textContent = fmt(payoff.entrant);
      find(`${branch}-total`).textContent = fmt(payoff.incumbent + payoff.entrant);
    }
    find('math-values').textContent = `Here, fighting pays ${fmt(model.payoffs.fight.incumbent)} and sharing pays ${fmt(model.payoffs.accommodate.incumbent)}. The deposit threshold is ${fmt(model.threshold)}: exactly that amount creates a tie; a larger amount makes fighting strictly better.`;
  }

  function play(choice) {
    const prediction = find('prediction').value;
    if (!prediction) {
      find('result').textContent = 'Choose your prediction first, then decide whether to enter.';
      find('prediction').focus();
      return;
    }
    const actual = model.responses.length > 1 ? 'tie' : model.responses[0];
    const predictionText = prediction === actual ? 'Your prediction matches what the points tell us.' : `Your prediction differs: ${actual === 'tie' ? 'both choices give the incumbent the same points' : `the incumbent prefers to ${describe(actual)}`}.`;
    if (choice === 'out') {
      find('result').textContent = `You stayed out. You earn 0; the incumbent earns 5; together you earn 5. Any deposit is returned. ${predictionText} ${model.credibility === 'none' && settings().entrantGain > 0 ? `Entering would have earned you ${fmt(settings().entrantGain)}, because sharing pays the incumbent more than fighting.` : 'Use backward induction below to check whether entry could improve your payoff.'}`;
    } else if (model.responses.length > 1) {
      find('result').textContent = `You entered. The incumbent has two equally good replies, so the model cannot select one. Sharing: you earn ${fmt(model.payoffs.accommodate.entrant)}, the incumbent earns ${fmt(model.payoffs.accommodate.incumbent)}, total ${fmt(model.payoffs.accommodate.entrant + model.payoffs.accommodate.incumbent)}. Fighting: you earn ${fmt(model.payoffs.fight.entrant)}, the incumbent earns ${fmt(model.payoffs.fight.incumbent)}, total ${fmt(model.payoffs.fight.entrant + model.payoffs.fight.incumbent)}. ${predictionText}`;
    } else {
      const response = model.responses[0];
      const payoff = model.payoffs[response];
      find('result').textContent = `You entered. The incumbent chooses to ${describe(response)}. You earn ${fmt(payoff.entrant)}; the incumbent earns ${fmt(payoff.incumbent)}; together you earn ${fmt(payoff.entrant + payoff.incumbent)}. ${response === 'accommodate' && settings().deposit > 0 ? 'The incumbent forfeits its deposit.' : 'Any deposit is returned.'} ${predictionText}`;
    }
  }

  find('enter').addEventListener('click', () => play('enter'));
  find('out').addEventListener('click', () => play('out'));
  find('step').addEventListener('click', () => {
    if (step === 0) {
      find('analysis').textContent = `After entry, fighting gives the incumbent ${fmt(model.payoffs.fight.incumbent)}; sharing gives it ${fmt(model.payoffs.accommodate.incumbent)}. ${model.responses.length > 1 ? 'Both replies are best responses. A promise to fight is possible, but the payoffs do not force it.' : `It therefore chooses to ${describe(model.responses[0])}. ${model.credibility === 'none' ? 'Announcing a fight does not change that incentive.' : 'The threat is now credible under the stated assumptions.'}`}`;
      find('step').textContent = '2. Return to the entrant’s decision';
      step = 1;
    } else {
      const lines = model.equilibria.map(eq => `If the existing business would ${describe(eq.response)}, ${eq.choice === 'enter' ? 'entering' : 'staying out'} is a best choice for you (you: ${fmt(eq.payoffs.entrant)} points; existing business: ${fmt(eq.payoffs.incumbent)} points).`);
      find('analysis').textContent = `${lines.join(' ')} ${model.equilibria.length > 1 ? 'A tie leaves more than one possible outcome. The rules do not tell us how to break the tie.' : 'We found this outcome by working backward from the last decision.'}`;
      find('step').disabled = true;
    }
  });
  root.querySelectorAll('[data-setting]').forEach(control => control.addEventListener('change', reset));
  reset();
  return { reset };
}
