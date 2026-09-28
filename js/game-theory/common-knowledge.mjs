import { loadSettings, seededRandom } from './shared.mjs';

/** Prefix worlds: a message may be lost; a recipient sends the next acknowledgment. */
export function knowledgeModel(delivered = 0, publicAnnouncement = false, maximumDepth = 6) {
  const count = Math.max(0, Math.min(20, Math.floor(Number(delivered) || 0)));
  const depth = Math.max(1, Math.min(8, Math.floor(Number(maximumDepth) || 6)));
  const worlds = [{ fact: false, count: -1, A: 'not-ready', B: 0 }];
  for (let n = 0; n <= count + depth + 2; n++) worlds.push({ fact: true, count: n, A: `ready:${Math.floor(n / 2)}`, B: Math.ceil(n / 2) });
  const possible = publicAnnouncement ? worlds.filter(world => world.fact) : worlds;
  const actual = possible.find(world => world.count === count);
  const knows = (agent, world, event) => possible.filter(other => other[agent] === world[agent]).every(other => event.has(other));
  let event = new Set(possible.filter(world => world.fact));
  const levels = [];
  for (let level = 1; level <= depth; level++) {
    const A = knows('A', actual, event);
    const B = knows('B', actual, event);
    levels.push({ level, A, B, everyone: A && B });
    event = new Set(possible.filter(world => knows('A', world, event) && knows('B', world, event)));
  }
  // Common knowledge means truth throughout every world reachable by either agent's uncertainty.
  const reached = new Set([actual]);
  const pending = [actual];
  while (pending.length) {
    const current = pending.pop();
    for (const world of possible) if (!reached.has(world) && (world.A === current.A || world.B === current.B)) { reached.add(world); pending.push(world); }
  }
  return { delivered: count, levels, common: [...reached].every(world => world.fact), reachableWorlds: reached.size };
}
export function coordinationOutcome(yourAction, otherAction) {
  if (yourAction === 'go' && otherAction === 'go') return { you: 4, other: 4, total: 8 };
  const you = yourAction === 'go' ? -6 : 0;
  const other = otherAction === 'go' ? -6 : 0;
  return { you, other, total: you + other };
}

export function mount(root) {
  loadSettings(root);
  const find = key => root.querySelector(`[data-knowledge-${key}]`);
  const control = key => root.querySelector(`[data-setting="${key}"]`);
  let delivered;
  let stopped;
  let announced;
  let random;
  let model;
  function render() {
    model = knowledgeModel(delivered, announced);
    find('levels').replaceChildren();
    model.levels.forEach(entry => {
      const row = document.createElement('tr');
      [entry.level === 1 ? 'Level 1: know the plan' : `Level ${entry.level}: know that everyone has level ${entry.level - 1}`, entry.A ? 'Yes' : 'No', entry.B ? 'Yes' : 'No', entry.everyone ? 'Yes' : 'No'].forEach((value, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td'); if (index === 0) cell.scope = 'row'; cell.textContent = value; row.append(cell);
      });
      find('levels').append(row);
    });
    find('summary').textContent = announced ? 'Both teams hear the public announcement and know that both hear it. The fact is common knowledge under that ideal assumption, at every level.' : `${delivered} private message${delivered === 1 ? '' : 's'} delivered. Common knowledge: no. A chain of possibilities still connects this situation to one where Team B never heard the plan, however many finite acknowledgments arrive.`;
    find('chain').replaceChildren();
    if (announced || delivered > 6) {
      const paragraph = document.createElement('p');
      paragraph.textContent = announced ? 'Public announcement: every further everyone-knows layer holds under the public-channel assumption.' : `The newest private chain now has ${delivered + 1} alternating knowledge layers. The first six everyone-knows levels appear in the table; the private chain is still finite.`;
      find('chain').append(paragraph);
    } else {
      let container = find('chain');
      for (let remaining = delivered; remaining >= 0; remaining--) {
        const list = document.createElement('ol'); list.className = 'gt-tree-list';
        const item = document.createElement('li');
        item.textContent = remaining === 0 ? 'Team A knows the plan is ready.' : `Team ${remaining % 2 === 0 ? 'A' : 'B'} knows that…`;
        list.append(item); container.append(list); container = item;
      }
    }
    find('send').disabled = stopped || announced || delivered >= 12;
    find('announce').disabled = announced;
    find('send').textContent = delivered === 0 ? 'Send A’s plan to B' : `Send ${delivered % 2 === 1 ? 'B’s' : 'A’s'} acknowledgment`;
  }
  function reset() {
    delivered = 0; stopped = false; announced = false;
    random = seededRandom(control('seed').value);
    find('prediction').value = '';
    find('log').replaceChildren();
    find('result').textContent = 'Team A knows the plan. Team B does not. Send a message, then predict whether both teams meet the chosen knowledge rule.';
    render();
  }
  find('send').addEventListener('click', () => {
    const success = random() < Number(control('delivery').value) / 100;
    const item = document.createElement('li');
    item.textContent = `Message ${delivered + 1}, from ${delivered % 2 === 0 ? 'A to B' : 'B to A'}: ${success ? 'delivered' : 'lost; the reply chain stops'}.`;
    find('log').append(item);
    if (success) delivered += 1; else stopped = true;
    render();
    find('result').textContent = success ? 'The recipient now knows one more layer. The sender cannot see whether this message arrived. The table is your outside view, not a public message to the teams.' : 'The message was lost. Only you, the outside observer, see the failure label. The sender cannot distinguish loss from an unconfirmed delivery. Reset to replay or try a public announcement.';
  });
  find('announce').addEventListener('click', () => { announced = true; render(); find('result').textContent = 'The ideal public announcement removes every possibility in which either team missed the fact. Predict, then decide whether Team A should act.'; });
  function act(action) {
    if (!find('prediction').value) { find('result').textContent = 'Choose a prediction about the knowledge rule first.'; find('prediction').focus(); return; }
    const required = Number(control('depth').value);
    const state = model.levels[required - 1];
    const rule = state.A && state.B ? 'both' : state.A || state.B ? 'one' : 'neither';
    const otherAction = state.B ? 'go' : 'wait';
    const result = coordinationOutcome(action, otherAction);
    find('result').textContent = `You chose to ${action === 'go' ? 'act' : 'wait'} as Team A. Team B ${otherAction === 'go' ? 'acts' : 'waits'} under the level-${required} knowledge rule. You earn ${result.you}; Team B earns ${result.other}; combined points: ${result.total}. Your prediction about which teams meet the rule ${rule === find('prediction').value ? 'matches' : 'does not match'}. ${model.common ? 'The public announcement supplies common knowledge in this model.' : 'A finite private exchange can support this finite rule without creating common knowledge.'}`;
  }
  find('go').addEventListener('click', () => act('go'));
  find('wait').addEventListener('click', () => act('wait'));
  root.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', reset));
  reset();
  return { reset };
}
