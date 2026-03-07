const toolId = 'encounter';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    encounters: []
  }
};

const gameCreatorCodes = {
  'Labyrinth Lord': ['LL'],
  'OSRIC': ['OSRIC'],
  'BD&D': ['BX', 'BU'],
  'BFRPG': ['BFRPG'],
  'Swords & Wizardry': ['SW'],
  'Swords & Six-Siders': ['SX'],
  'Tunnels & Trolls 5th Edition': ['TT'],
  'Tunnels & Trolls 7th Edition': ['TT'],
  'Tunnels & Trolls Deluxe': ['TT'],
  'Mutant Future': ['MF'],
  'Gamma World': ['MF', 'BU'],
  'Metamorphosis Alpha': ['MF', 'BU'],
  'Broken Urthe': ['BU']
};

const lootItems = ['small coin pouch', 'gem cluster', 'rare herb satchel', 'arcane trinket', 'weapon cache', 'armor piece', 'mystic scroll'];

function hashSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function makeRng(seedText) {
  let state = seedText ? hashSeed(seedText) : Math.floor(Math.random() * 0xffffffff);
  if (state === 0) state = 74747474;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, list) {
  return list[randomInt(rng, 0, list.length - 1)];
}

function isTtGame(game) {
  return ['Tunnels & Trolls 5th Edition', 'Tunnels & Trolls 7th Edition', 'Tunnels & Trolls Deluxe'].includes(game);
}

function isPaGame(game) {
  return ['Mutant Future', 'Gamma World', 'Metamorphosis Alpha', 'Broken Urthe'].includes(game);
}

async function loadEnemyPool(game, options) {
  const rows = await window.WizardawnData.getMonstersRpgs();
  let matches = [];

  if (game === 'AD&D') {
    matches = rows.filter((row) => window.WizardawnData.matchesGameFilters(row, 'AD', false, false));
  } else {
    const codes = [...(gameCreatorCodes[game] || ['LL'])];
    if (game === 'Labyrinth Lord' && options.aec) {
      codes.push('AEC');
    }
    matches = rows.filter((row) => codes.some((code) => row.creator.startsWith(code)));
  }

  const names = [...new Set(matches.map((row) => row.name).filter(Boolean))];
  return names.length ? names : ['Goblin', 'Orc', 'Skeleton'];
}

function encounterSize(rng, game, level, characters, ttDice, ttAdds, ttDifficulty) {
  if (isTtGame(game)) {
    const mrBase = Math.max(5, (ttDice * 3) + Math.floor(ttAdds / 4));
    const difficultyBoost = ttDifficulty === 9 ? 0.75 : ttDifficulty;
    return Math.max(1, Math.round((mrBase * difficultyBoost) / 10));
  }

  const effectiveLevel = Math.max(1, level || 1);
  const base = Math.max(1, Math.round((effectiveLevel * Math.max(1, characters)) / 4));
  return Math.max(1, base + randomInt(rng, -1, 2));
}

function hitPointModel(rng, game, level, might1, might2, hitDiceType) {
  if (isTtGame(game)) return null;
  if (game === 'Broken Urthe') return `${might1}d${might2}`;
  if (game === 'Swords & Wizardry') return `1d${hitDiceType}`;
  if (isPaGame(game)) return `${Math.max(1, level)}d8`;
  if (game === 'Swords & Six-Siders') return `${Math.max(1, level)}d6`;
  return `${Math.max(1, level)}d8`;
}

function lootForEncounter(rng, addLoot, game, moneyCut, moneyName, whichMagic) {
  if (!addLoot) return null;

  const baseMoney = randomInt(rng, 10, 200);
  const adjustedMoney = Math.max(1, Math.floor((baseMoney * moneyCut) / 100));
  const item = pick(rng, lootItems);
  const source = randomInt(rng, 1, 100) <= whichMagic ? 'Game' : 'Wizardawn';

  if (isPaGame(game)) {
    return `${adjustedMoney} ${moneyName}, ${item}, salvage components`;
  }

  return `${adjustedMoney} ${moneyName}, ${item} (${source} magic source)`;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.encounters.length) {
    output.innerHTML = '<em>No encounters generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'encounter-header';
  header.textContent = `${result.config.game} · ${result.payload.encounters.length} encounter(s)`;
  output.appendChild(header);

  result.payload.encounters.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'encounter-card';
    card.innerHTML = `
      <div class="encounter-title">#${entry.index} ${entry.enemy}</div>
      <div><strong>Count:</strong> ${entry.count}${entry.hitPoints ? ` · <strong>HP Model:</strong> ${entry.hitPoints}` : ''}</div>
      ${entry.notes ? `<div class="encounter-sub">${entry.notes}</div>` : ''}
      ${entry.loot ? `<div><strong>Loot:</strong> ${entry.loot}</div>` : ''}
    `;
    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const random = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const level = Math.max(0, Math.min(100, Number(formData.get('level') || 1)));
  const characters = Math.max(1, Math.min(20, Number(formData.get('characters') || 4)));
  const amount = Math.max(1, Math.min(100, Number(formData.get('amount') || 5)));
  const explicitEnemy = formData.get('enemy')?.toString().trim();
  const hitDiceType = Math.max(6, Math.min(8, Number(formData.get('hitDiceType') || 8)));
  const ttDice = Math.max(0, Math.min(1000, Number(formData.get('ttDice') || 0)));
  const ttAdds = Math.max(0, Math.min(1000, Number(formData.get('ttAdds') || 0)));
  const ttDifficulty = Number(formData.get('ttDifficulty') || 1);

  const moneyName = formData.get('moneyName')?.toString().trim() || 'gold';
  const moneyCut = Math.max(1, Math.min(1000, Number(formData.get('moneyCut') || 100)));
  const whichMagic = Math.max(0, Math.min(100, Number(formData.get('whichMagic') || 50)));
  const might1 = Math.max(1, Math.min(20, Number(formData.get('might1') || 1)));
  const might2 = Math.max(4, Math.min(20, Number(formData.get('might2') || 8)));
  const addLoot = formData.get('addLoot') === '1';

  const options = {
    mutantsOnly: formData.get('optMutantsOnly') === '1',
    ua: formData.get('optUa') === '1',
    aec: formData.get('optAec') === '1',
    ttMagestykc: formData.get('optTtMagestykc') === '1'
  };

  const pool = await loadEnemyPool(game, options);
  const encounters = [];

  for (let index = 1; index <= amount; index += 1) {
    const chosenEnemy = explicitEnemy || pick(random, pool);
    const enemy = options.mutantsOnly && isPaGame(game) ? `Mutant ${chosenEnemy}` : chosenEnemy;
    const count = encounterSize(random, game, level, characters, ttDice, ttAdds, ttDifficulty);
    const hitPoints = hitPointModel(random, game, level, might1, might2, hitDiceType);
    const loot = lootForEncounter(random, addLoot, game, moneyCut, moneyName, whichMagic);

    const noteParts = [];
    if (options.ua && game === 'AD&D') noteParts.push('UA enabled');
    if (options.aec && game === 'Labyrinth Lord') noteParts.push('AEC enabled');
    if (options.ttMagestykc && isTtGame(game)) noteParts.push('Magestykc gear');

    encounters.push({
      index,
      enemy,
      count,
      hitPoints,
      loot,
      notes: noteParts.join(' · ')
    });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      game,
      level,
      characters,
      amount,
      hitDiceType,
      ttDice,
      ttAdds,
      ttDifficulty,
      moneyName,
      moneyCut,
      whichMagic,
      might1,
      might2,
      addLoot,
      options
    },
    payload: {
      encounters
    }
  };

  renderResult(lastResult);
});

exportJsonButton.addEventListener('click', () => {
  window.WizardawnCore.exportJSON(`${toolId}-output.json`, lastResult);
});

exportMdButton.addEventListener('click', () => {
  const markdown = `# ${toolId} output

Generated: ${lastResult.generatedAt || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
