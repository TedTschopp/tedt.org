const toolId = 'alchemist';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const potionBase = {
  OSRIC: ['Oil of Etherealness', 'Oil of Slipperiness', 'Philtre of Love', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Levitation', 'Potion of Speed', 'Potion of Treasure Finding', 'Potion of Water Breathing'],
  'Labyrinth Lord': ['Animal Control', 'Clairaudience', 'Clairvoyance', 'Climbing', 'Diminution', 'ESP', 'Extra-Healing', 'Fire Resistance', 'Flying', 'Gaseous Form', 'Giant Strength', 'Growth', 'Healing', 'Heroism', 'Invisibility', 'Levitation', 'Plant Control', 'Polymorph', 'Speed', 'Undead Control'],
  'AD&D': ['Oil of Etherealness', 'Oil of Slipperiness', 'Philter of Love', 'Poison', 'Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Flying', 'Potion of Giant Strength', 'Potion of Heroism', 'Potion of Invulnerability', 'Potion of Longevity', 'Potion of Polymorph Self', 'Potion of Speed', 'Potion of Sweet Water', 'Potion of Water Breathing'],
  'BD&D': ['Poison', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Control Animal', 'Potion of Control Dragon', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Growth', 'Potion of Healing', 'Potion of Invisibility', 'Potion of Levitation', 'Potion of Polymorph Self'],
  BFRPG: ['Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Control Animal', 'Potion of Delusion', 'Potion of ESP', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Levitation', 'Potion of Longevity', 'Potion of Speed'],
  'Swords & Wizardry': ['Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Dragon Control', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Plant Control', 'Potion of Treasure Finding', 'Potion of Healing'],
  'Swords & Six-Siders': ['Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Invisibility', 'Potion of Levitation', 'Potion of Neutralize Poison', 'Potion of Remove Disease', 'Potion of Stone to Flesh']
};

const uaAdditions = ['Elixir of Health', 'Elixir of Life', 'Elixir of Madness', 'Elixir of Youth', 'Oil of Acid Resistance', 'Potion of Fire Breath', 'Potion of Rainbow Hues', 'Potion of Vitality'];
const aecAdditions = ['Potion of Brass Dragon Control', 'Potion of Bronze Dragon Control', 'Potion of Copper Dragon Control'];
const fallbackBottles = ['glass bottle', 'clay bottle', 'glass vial', 'ceramic flask', 'stoppered ampoule', 'small jar'];
const fallbackReagents = ['mandrake root', 'wyrm blood', 'phoenix ash', 'grave moss', 'moonwater', 'belladonna', 'wolfsbane', 'faerie pollen', 'silverthorn', 'obsidian powder', 'quicksilver', 'dragonfly wing', 'star anise', 'lichen resin', 'amber dust', 'witch hazel', 'oak gall', 'myrrh', 'sea salt', 'powdered pearl', 'salamander scale', 'nightshade', 'frost mint', 'spider silk'];

let bottles = fallbackBottles;
let reagents = fallbackReagents;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Fantasy',
  config: {
    amount: 12,
    potionRate: 30,
    valueMin: 0,
    valueMax: 0,
    ua: false,
    aec: false
  },
  payload: {
    entries: []
  }
};

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
  if (state === 0) state = 123456789;
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

function gameToStoreCodes(game, aec) {
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game.includes('Tunnels & Trolls')) return ['TT'];
  if (game === 'Labyrinth Lord') return aec ? ['LL', 'AEC'] : ['LL'];
  if (game === 'Fantasy') return [];
  return ['LL'];
}

function cleanItemLabel(item) {
  return String(item || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isBottleLike(name) {
  return /\b(vial|flask|bottle|jar|phial|tube|ampoule)\b/i.test(name);
}

function isReagentLike(name) {
  return /\b(herb|powder|dust|resin|root|moss|sage|garlic|belladonna|feverfew|rue|salt|ash|ink|oil|water|glue|incense)\b/i.test(name);
}

async function loadShelfPools(game, aec) {
  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game, aec), ['ALCHEMIST', 'SUPPLIES']);
    if (!Array.isArray(rows) || !rows.length) {
      bottles = fallbackBottles;
      reagents = fallbackReagents;
      return;
    }

    const bottleSet = new Set();
    const reagentSet = new Set();
    rows.forEach((row) => {
      const label = cleanItemLabel(row.item);
      if (!label) return;
      if (isBottleLike(label)) {
        bottleSet.add(label);
      } else if (isReagentLike(label)) {
        reagentSet.add(label);
      }
    });

    bottles = [...bottleSet, ...fallbackBottles].filter((value, index, all) => all.indexOf(value) === index);
    reagents = [...reagentSet, ...fallbackReagents].filter((value, index, all) => all.indexOf(value) === index);
  } catch (error) {
    console.warn('Unable to load alchemist shelf pools from store_items:', error);
    bottles = fallbackBottles;
    reagents = fallbackReagents;
  }
}

function potionListForGame(game, ua, aec) {
  const key = potionBase[game] ? game : 'Labyrinth Lord';
  let list = [...potionBase[key]];
  if (game === 'AD&D' && ua) list = [...list, ...uaAdditions];
  if (game === 'Labyrinth Lord' && aec) list = [...list, ...aecAdditions];
  return list;
}

function makeReagentText(rng) {
  const ingredient = pick(rng, reagents);
  return `${pick(rng, bottles)} (${ingredient})`;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.entries.length) {
    output.innerHTML = '<em>No shelf entries generated yet.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'alc-summary';
  const potionCount = result.payload.entries.filter((entry) => entry.type === 'magic').length;
  summary.textContent = `${result.payload.entries.length} shelf item(s) · ${potionCount} magical item(s) · ${result.game}`;
  output.appendChild(summary);

  const table = document.createElement('table');
  table.className = 'table table-sm table-striped alc-table';
  table.innerHTML = '<thead><tr><th>#</th><th>Item</th><th class="text-end">Price</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');

  result.payload.entries.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.line}</td><td>${entry.text}</td><td class="text-end">${entry.priceLabel || ''}</td>`;
    tbody.appendChild(row);
  });

  output.appendChild(table);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Fantasy';
  const amount = Math.min(100, Math.max(1, Number(formData.get('amount') || 12)));
  const potionRate = Math.min(100, Math.max(0, Number(formData.get('potionRate') || 30)));
  const valueMinRaw = Math.min(1000, Math.max(0, Number(formData.get('valueMin') || 0)));
  const valueMaxRaw = Math.min(1000, Math.max(0, Number(formData.get('valueMax') || 0)));
  const valueMin = Math.min(valueMinRaw, valueMaxRaw);
  const valueMax = Math.max(valueMinRaw, valueMaxRaw);
  const ua = formData.get('ua') === '1';
  const aec = formData.get('aec') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadShelfPools(game, aec);

  const potions = potionListForGame(game, ua, aec);
  const entries = [];
  for (let line = 1; line <= amount; line += 1) {
    const isPotion = potionRate >= randomInt(rng, 1, 100);

    if (isPotion) {
      const potion = pick(rng, potions);
      entries.push({
        line,
        type: 'magic',
        text: potion.toLowerCase(),
        priceLabel: valueMin > 0 ? 'Magic' : ''
      });
    } else {
      const reagentText = makeReagentText(rng);
      let priceLabel = '';
      if (valueMin > 0 || valueMax > 0) {
        priceLabel = reagentText.includes('(empty)') ? '-' : `${randomInt(rng, Math.max(1, valueMin), Math.max(1, valueMax))}gp`;
      }
      entries.push({
        line,
        type: 'reagent',
        text: reagentText,
        priceLabel
      });
    }
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      amount,
      potionRate,
      valueMin,
      valueMax,
      ua,
      aec
    },
    payload: {
      entries
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
Game: ${lastResult.game || 'n/a'}
Entries: ${lastResult.payload.entries.length}
Potion Chance: ${lastResult.config.potionRate}%

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
