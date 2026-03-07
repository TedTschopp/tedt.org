const toolId = 'loot';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');
const gameSelect = document.getElementById('game');
const dataSourceGroup = document.getElementById('data-source-group');
const dataSourceInput = document.getElementById('dataSource');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    sets: []
  }
};

const coinLoot = ['12 gp', '40 sp', '1d6 gems worth 10 gp each', 'mixed coins in a small pouch', 'small strongbox with 30 gp'];
const relicLoot = ['silver ring', 'etched idol', 'old ceremonial blade', 'engraved chalice', 'blessed relic shard'];
const magicGameLoot = ['wand of sparks', 'shield +1', 'healing potion', 'ring of warmth', 'cloak of stealth'];
const magicWizardawnLoot = ['orb of ember sight', 'glyph-carved buckler', 'runed compass', 'moonfire tonic', 'soul-lantern'];
const paCurrency = ['7 xm', '34 domars', 'bundle of barter chips', 'sealed pre-war scrip'];
const paItems = ['scrap toolkit', 'salvage med patch', 'filter mask', 'plasma battery', 'weapon part cache'];
const paTech = ['targeting visor', 'power gauntlet', 'micro-reactor', 'servo spine', 'drone core'];
const dataFallback = ['mystery object', 'weathered crate', 'bundle of supplies', 'lost heirloom'];

const storeGameCodesByGame = {
  'Mutant Future': ['MF', 'PA'],
  'Gamma World': ['MF', 'PA', 'BU'],
  'Metamorphosis Alpha': ['MF', 'PA', 'BU'],
  'Broken Urthe': ['BU', 'PA'],
  'Tunnels & Trolls 5th Edition': ['TT'],
  'Tunnels & Trolls 7th Edition': ['TT'],
  'Tunnels & Trolls Deluxe': ['TT']
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
  if (state === 0) state = 42424242;
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

function isFantasyGame(game) {
  return ['OSRIC', 'Labyrinth Lord', 'Swords & Wizardry', 'AD&D', 'BD&D', 'BFRPG', 'Swords & Six-Siders'].includes(game);
}

function isTtGame(game) {
  return ['Tunnels & Trolls 5th Edition', 'Tunnels & Trolls 7th Edition', 'Tunnels & Trolls Deluxe'].includes(game);
}

function isPaGame(game) {
  return ['Broken Urthe', 'Metamorphosis Alpha', 'Mutant Future', 'Gamma World'].includes(game);
}

function makeFantasyLoot(rng, lootType, whichMagic) {
  const roll = lootType === 1 ? 100 : lootType === 2 ? randomInt(rng, 70, 91) : randomInt(rng, 1, 100);
  if (roll < 51) return pick(rng, coinLoot);
  if (roll < 86) return pick(rng, relicLoot);
  if (roll < 92) return pick(rng, ['gems and jewelry set', 'ornamental treasure lot']);
  return randomInt(rng, 1, 100) <= whichMagic ? pick(rng, magicGameLoot) : pick(rng, magicWizardawnLoot);
}

function makeTtLoot(rng, lootType, useMagestykc) {
  const roll = lootType === 1 ? 100 : lootType === 2 ? randomInt(rng, 70, 91) : randomInt(rng, 1, 100);
  if (roll < 51) return pick(rng, coinLoot);
  if (roll < 86) return pick(rng, useMagestykc ? ['Magestykc light blade', 'Magestykc medium armor', 'Magestykc utility kit'] : relicLoot);
  if (roll < 92) return pick(rng, ['gems and jewelry set', 'ornamental treasure lot']);
  return pick(rng, useMagestykc ? ['Magestykc sigil item', 'Magestykc relic', 'Magestykc weapon cache'] : magicWizardawnLoot);
}

function makePaLoot(rng, lootType, conditionItems) {
  const roll = lootType === 1 ? 100 : lootType === 2 ? randomInt(rng, 25, 84) : randomInt(rng, 1, 100);
  if (roll < 50) return pick(rng, paCurrency);
  if (roll < 85) return pick(rng, paItems);
  const tech = pick(rng, paTech);
  if (!conditionItems) return tech;
  return `${tech} (${pick(rng, ['worn', 'good', 'excellent'])} condition)`;
}

function parseDataSource(text) {
  const rows = text
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
  return rows.length ? rows : dataFallback;
}

function makeDataLoot(rng, dataPool) {
  return pick(rng, dataPool);
}

function uniqueValues(list) {
  return [...new Set(list.filter(Boolean))];
}

async function buildDynamicPools(game) {
  const gameCodes = storeGameCodesByGame[game] || [];
  if (!gameCodes.length) {
    return {
      paItemPool: paItems,
      paTechPool: paTech,
      ttItemPool: relicLoot,
      ttMagestykcPool: ['Magestykc light blade', 'Magestykc medium armor', 'Magestykc utility kit']
    };
  }

  const storeRows = await window.WizardawnData.getStoreItemsForGames(gameCodes);
  const allItems = uniqueValues(storeRows.map((row) => row.item));
  const highTech = uniqueValues(storeRows.filter((row) => row.eraCode === 'HI').map((row) => row.item));
  const ttSimple = uniqueValues(storeRows.filter((row) => row.eraCode === 'SIMPLE').map((row) => row.item));
  const ttComplex = uniqueValues(storeRows.filter((row) => row.eraCode === 'COMPLEX' || row.eraCode === 'DELUXE' || row.eraCode === 'DELUXES').map((row) => row.item));

  return {
    paItemPool: allItems.length ? allItems : paItems,
    paTechPool: highTech.length ? highTech : paTech,
    ttItemPool: allItems.length ? allItems : relicLoot,
    ttMagestykcPool: ttComplex.length ? ttComplex : (ttSimple.length ? ttSimple : ['Magestykc light blade', 'Magestykc medium armor', 'Magestykc utility kit'])
  };
}

function makeTtLootWithPools(rng, lootType, useMagestykc, pools) {
  const roll = lootType === 1 ? 100 : lootType === 2 ? randomInt(rng, 70, 91) : randomInt(rng, 1, 100);
  if (roll < 51) return pick(rng, coinLoot);
  if (roll < 86) return pick(rng, useMagestykc ? pools.ttMagestykcPool : pools.ttItemPool);
  if (roll < 92) return pick(rng, ['gems and jewelry set', 'ornamental treasure lot']);
  return pick(rng, useMagestykc ? pools.ttMagestykcPool : magicWizardawnLoot);
}

function makePaLootWithPools(rng, lootType, conditionItems, pools) {
  const roll = lootType === 1 ? 100 : lootType === 2 ? randomInt(rng, 25, 84) : randomInt(rng, 1, 100);
  if (roll < 50) return pick(rng, paCurrency);
  if (roll < 85) return pick(rng, pools.paItemPool);
  const tech = pick(rng, pools.paTechPool);
  if (!conditionItems) return tech;
  return `${tech} (${pick(rng, ['worn', 'good', 'excellent'])} condition)`;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.sets.length) {
    output.innerHTML = '<em>No treasure generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'loot-header';
  header.textContent = `${result.config.game} · ${result.payload.sets.length} treasure set(s)`;
  output.appendChild(header);

  result.payload.sets.forEach((set) => {
    const card = document.createElement('article');
    card.className = 'loot-card';
    const content = result.config.listMode
      ? `<ul class="mb-0">${set.items.map((item) => `<li>${item}</li>`).join('')}</ul>`
      : `<div>${set.items.join(' --- ')}</div>`;
    card.innerHTML = `<div class="loot-title">${set.index}</div>${content}`;
    output.appendChild(card);
  });
}

function syncFieldVisibility() {
  const game = gameSelect.value;
  dataSourceGroup.style.display = game === 'Data' ? '' : 'none';
  if (game !== 'Data') dataSourceInput.value = dataSourceInput.value;
}

gameSelect.addEventListener('change', syncFieldVisibility);
syncFieldVisibility();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const amount = Math.max(1, Math.min(100, Number(formData.get('amount') || 10)));
  const minItemsRaw = Math.max(1, Math.min(100, Number(formData.get('minItems') || 1)));
  const maxItemsRaw = Math.max(1, Math.min(100, Number(formData.get('maxItems') || 4)));
  const minItems = Math.min(minItemsRaw, maxItemsRaw);
  const maxItems = Math.max(minItemsRaw, maxItemsRaw);
  const lootType = Number(formData.get('lootType') || 0);
  const listMode = formData.get('listMode') === '1';
  const conditionItems = formData.get('conditionItems') === '1';
  const includeUa = formData.get('includeUa') === '1';
  const includeAec = formData.get('includeAec') === '1';
  const ttMagestykc = formData.get('ttMagestykc') === '1';
  const whichMagic = Math.max(0, Math.min(100, Number(formData.get('whichMagic') || 50)));
  const dataPool = parseDataSource(formData.get('dataSource')?.toString() || '');
  const dynamicPools = await buildDynamicPools(game);

  const sets = [];
  for (let setIndex = 1; setIndex <= amount; setIndex += 1) {
    const count = randomInt(rng, minItems, maxItems);
    const items = [];
    for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
      let item;
      if (game === 'Data') {
        item = makeDataLoot(rng, dataPool);
      } else if (isPaGame(game)) {
        item = makePaLootWithPools(rng, lootType, conditionItems, dynamicPools);
      } else if (isTtGame(game)) {
        item = makeTtLootWithPools(rng, lootType, ttMagestykc, dynamicPools);
      } else if (isFantasyGame(game)) {
        item = makeFantasyLoot(rng, lootType, whichMagic);
      } else {
        item = pick(rng, relicLoot);
      }
      items.push(item);
    }
    sets.push({ index: setIndex, items });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      game,
      amount,
      minItems,
      maxItems,
      lootType,
      listMode,
      conditionItems,
      whichMagic,
      includeUa,
      includeAec,
      ttMagestykc
    },
    payload: {
      sets
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
