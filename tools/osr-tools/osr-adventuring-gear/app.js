const toolId = 'packs';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Fantasy',
  config: {
    packs: 1,
    simpleFood: false
  },
  payload: {
    packs: []
  }
};

const colors = ['red', 'blue', 'green', 'yellow', 'brown', 'black', 'white', 'gray', 'purple', 'tan'];
const fallbackFoods = ['head of lettuce', 'bag of nuts', 'onion', 'orange', 'peach', 'apple', 'turnip', 'bag of berries', 'loaf of bread', 'head of cabbage', 'bag of cherries', 'carrot', 'dried beef', 'apricot', 'dried pork', 'wheel of cheese'];
const fallbackDrinks = ['water', 'ale', 'beer', 'brandy', 'cider', 'grog', 'mead', 'rum', 'wine'];
const fallbackDrinkContainers = ['waterskin', 'waterskin', 'waterskin', 'iron flask', 'iron flask', 'copper flask', 'pewter flask', 'glass bottle', 'clay bottle', 'glass jar', 'clay jar', 'waterskin', 'waterskin', 'waterskin'];
const fallbackBags = ['leather backpack', 'large leather bag', 'large sack', 'leather satchel', 'leather backpack', 'leather satchel'];
const lightTypes = ['bullseye lantern', 'hooded lantern', 'clay oil lamp', 'torches', 'brass oil-burning torch'];
const fallbackBottles = ['ceramic jug', 'glass bottle', 'glass jar', 'clay jug', 'waterskin'];
const instruments = ['small drum', 'flute', 'harp', 'horn', 'lute', 'mandolin'];
const boots = ['heavy boots', 'high hard boots', 'soft high boots', 'hard low boots', 'soft low boots', 'soft boots', 'fur boots', 'shoes', 'sandals', 'thigh boots'];
const hats = ['cloth cap', 'leather cap', 'hat', 'straw hat', 'tall straw hat', 'feathered hat', 'floppy hat', 'skullcap', 'wide-brim hat', 'bandana'];
const fallbackMisc = [
  'small bag of rocks', 'small bell', 'beeswax', 'block & tackle', 'blank book', 'empty bottle', 'candles', 'iron chain', 'chalk', 'small bag of charcoal',
  'crowbar', 'tankard', 'set of ivory dice', 'firewood', 'fishing net (25\' sq)', 'flint & steel', 'hacksaw', 'hammer & chisel', 'wooden snuff box', 'grappling hook & rope',
  'rope', 'container of holy water', 'hourglass', 'bottle of ink', 'iron spikes', 'glass jar', 'clay jar', 'small pouch of sand', 'ball of string', 'magnifying lense',
  'manacles', 'metal file', 'small steel mirror', 'mortar & pestal', 'container of lamp oil', 'padlock with key', 'jar of paint with brush', 'parchment sheets', 'pick axe', 'corncob pipe with tobacco',
  'wooden pole (10\')', 'iron pot', 'quill', 'razor', 'scissors', 'leather scrollcase', 'shovel', 'skillet', 'spyglass', 'leather strap',
  'tent', 'tinderbox', 'brass knuckles', 'tongs', 'small sundial', 'twine', 'whetstone', 'whistle', 'small herb pouch', 'small carving knife',
  'bottle of cloth dye', 'bottle of hair dye', 'jewelry trinket', 'deck of tarot cards', 'hammer', 'cloth rag', 'bandages', 'wooden stakes', 'mallet', 'rabbit\'s foot',
  'blackjack', 'small pouch of nut shells', 'lockpicks', 'holy symbol'
];

let foods = fallbackFoods;
let drinks = fallbackDrinks;
let drinkContainers = fallbackDrinkContainers;
let bags = fallbackBags;
let bottles = fallbackBottles;
let misc = fallbackMisc;

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

function pick(rng, values) {
  return values[randomInt(rng, 0, values.length - 1)];
}

function gameToStoreCodes(game) {
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game.includes('Tunnels & Trolls')) return ['TT'];
  if (game === 'Labyrinth Lord') return ['LL'];
  if (game === 'Fantasy') return [];
  return ['LL'];
}

function cleanItemLabel(item) {
  return String(item || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[`_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function extractDrinkName(label) {
  if (!label) return '';
  const keyword = ['water', 'ale', 'beer', 'brandy', 'cider', 'grog', 'mead', 'rum', 'wine'].find((name) => label.includes(name));
  return keyword || '';
}

function isFoodLike(label) {
  return /\b(lettuce|nuts|onion|orange|peach|apple|turnip|berries|cherries|bread|cabbage|carrot|beef|pork|cheese|food|ration|fish|egg|meal)\b/i.test(label);
}

function isDrinkContainerLike(label) {
  return /\b(waterskin|flask|bottle|jar|jug)\b/i.test(label);
}

function isBagLike(label) {
  return /\b(backpack|bag|sack|satchel|pack)\b/i.test(label);
}

function isBottleLike(label) {
  return /\b(flask|bottle|jar|jug|waterskin)\b/i.test(label);
}

function isMiscCandidate(label) {
  if (!label || label.length < 3 || label.length > 42) return false;
  return /\b(rope|hook|lantern|lamp|spike|ink|quill|tent|pot|shovel|hammer|sack|book|chain|torch|mirror|lock|manacles|map|pick|tool|blanket|oil|tinder|candle|crowbar|spyglass|sundial|parchment|chalk)\b/i.test(label);
}

function uniqueMerge(primary, fallback) {
  return [...new Set([...primary, ...fallback])];
}

async function loadPackPools(game) {
  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game), ['SUPPLIES', 'TAVERN', 'TAILOR', 'ALCHEMIST']);
    if (!Array.isArray(rows) || !rows.length) {
      foods = fallbackFoods;
      drinks = fallbackDrinks;
      drinkContainers = fallbackDrinkContainers;
      bags = fallbackBags;
      bottles = fallbackBottles;
      misc = fallbackMisc;
      return;
    }

    const foodSet = new Set();
    const drinkSet = new Set();
    const drinkContainerSet = new Set();
    const bagSet = new Set();
    const bottleSet = new Set();
    const miscSet = new Set();

    rows.forEach((row) => {
      const label = cleanItemLabel(row.item);
      if (!label) return;

      const drinkName = extractDrinkName(label);
      if (drinkName) drinkSet.add(drinkName);
      if (isFoodLike(label) && !drinkName) foodSet.add(label);
      if (isDrinkContainerLike(label)) drinkContainerSet.add(label);
      if (isBagLike(label)) bagSet.add(label);
      if (isBottleLike(label)) bottleSet.add(label);
      if (isMiscCandidate(label)) miscSet.add(label);
    });

    foods = uniqueMerge([...foodSet], fallbackFoods);
    drinks = uniqueMerge([...drinkSet], fallbackDrinks);
    drinkContainers = uniqueMerge([...drinkContainerSet], fallbackDrinkContainers);
    bags = uniqueMerge([...bagSet], fallbackBags);
    bottles = uniqueMerge([...bottleSet], fallbackBottles);
    misc = uniqueMerge([...miscSet].slice(0, 80), fallbackMisc);
  } catch (error) {
    console.warn('Unable to load packs item pools from store_items:', error);
    foods = fallbackFoods;
    drinks = fallbackDrinks;
    drinkContainers = fallbackDrinkContainers;
    bags = fallbackBags;
    bottles = fallbackBottles;
    misc = fallbackMisc;
  }
}

function makeCurrency(rng, game) {
  const base = randomInt(rng, 1, 10);
  if (game.includes('Tunnels & Trolls') || game === 'Swords & Six-Siders') {
    return `${randomInt(rng, 2, base * 6)} gp`;
  }

  const parts = [];
  const gp = randomInt(rng, 1, Math.max(1, base));
  if (gp > 0) parts.push(`${gp}gp`);
  if (!['Swords & Wizardry', 'Tunnels & Trolls 5th Edition', 'Tunnels & Trolls 7th Edition', 'Tunnels & Trolls Deluxe'].includes(game) && randomInt(rng, 1, 100) > 70) {
    parts.push(`${randomInt(rng, 1, base)}ep`);
  }
  if (randomInt(rng, 1, 100) > 50) parts.push(`${randomInt(rng, 2, base * 2)}sp`);
  if (randomInt(rng, 1, 100) > 35) parts.push(`${randomInt(rng, 3, base * 4)}cp`);
  return parts.join(' / ');
}

function makePack(rng, simpleFood, game) {
  const used = new Set();
  const pileCount = randomInt(rng, 5, 15);
  const items = [];

  const foodCount = randomInt(rng, 4, 8);
  const drinkCount = randomInt(rng, 2, 4);

  if (simpleFood) {
    items.push(`rations (${foodCount} ea)`);
    items.push(`waterskin (${drinkCount} ea)`);
  } else {
    for (let index = 0; index < foodCount; index += 1) {
      items.push(pick(rng, foods));
    }
    for (let index = 0; index < drinkCount; index += 1) {
      const liquid = randomInt(rng, 1, 4) === 1 ? pick(rng, drinks.slice(1)) : 'water';
      const vessel = pick(rng, drinkContainers);
      items.push(`${vessel} of ${liquid}`);
    }
  }

  items.push(randomInt(rng, 0, 1) === 0 ? 'bedroll' : `${pick(rng, colors)} blanket`);

  const bagChoice = pick(rng, bags);
  if (bagChoice === 'large sack') {
    items.push(`large ${pick(rng, colors)} sack`);
  } else {
    items.push(bagChoice);
  }

  const light = pick(rng, lightTypes);
  if (light === 'torches') {
    items.push(`torches (${randomInt(rng, 2, 4)} ea)`);
  } else {
    items.push(`${light}`);
    items.push(`${pick(rng, bottles)} of lamp oil (${randomInt(rng, 2, 5)} pints)`);
  }

  if (randomInt(rng, 1, 10) === 1) items.push(pick(rng, instruments));

  items.push(pick(rng, boots));
  items.push(`${pick(rng, colors)} ${randomInt(rng, 0, 1) ? 'shirt' : 'tunic'}`);
  items.push(randomInt(rng, 0, 3) === 3 ? 'leather trousers' : `${pick(rng, colors)} ${pick(rng, ['heavy trousers', 'kilt', 'light trousers'])}`);
  if (randomInt(rng, 1, 3) === 1) items.push('leather belt');
  if (randomInt(rng, 1, 5) === 1) items.push(`${pick(rng, colors)} ${pick(rng, hats)}`);
  if (randomInt(rng, 1, 5) === 1) items.push(randomInt(rng, 1, 4) === 4 ? `${pick(rng, colors)} cloth gloves` : 'leather gloves');
  if (randomInt(rng, 1, 3) === 1) items.push(randomInt(rng, 0, 2) === 1 ? 'fur cloak' : `${pick(rng, colors)} ${pick(rng, ['cape', 'cloak'])}`);
  if (randomInt(rng, 1, 5) === 1) items.push(`${pick(rng, colors)} ${pick(rng, ['silk robe', 'linen robe'])}`);

  while (used.size < pileCount) {
    const id = randomInt(rng, 0, misc.length - 1);
    if (used.has(id)) continue;
    used.add(id);

    let add = misc[id];
    if (add === 'blank book') add = `blank book bound in ${pick(rng, colors)} leather (${randomInt(rng, 5, 20) * 10} pages)`;
    if (add === 'empty bottle') add = pick(rng, bottles);
    if (add === 'candles') add = `${pick(rng, colors)} candles (${randomInt(rng, 2, 8)} ea)`;
    if (add === 'iron chain') add = `iron chain (${randomInt(rng, 2, 10)}')`;
    if (add === 'tankard') add = `${pick(rng, ['iron', 'steel', 'bronze', 'wooden', 'silver', 'copper'])} tankard`;
    if (add === 'wooden snuff box') add = `wooden snuff box with ${randomInt(rng, 2, 5)} pinches`;
    if (add === 'grappling hook & rope') add = `grappling hook & ${pick(rng, ['silk', 'hemp'])} rope (${randomInt(rng, 5, 10) * 10}')`;
    if (add === 'rope') add = `${pick(rng, ['silk', 'hemp'])} rope (${randomInt(rng, 5, 10) * 10}')`;
    if (add === 'container of holy water') add = `${pick(rng, bottles)} of holy water`;
    if (add === 'bottle of ink') add = 'bottle of ink (2 oz)';
    if (add === 'iron spikes') add = `iron spikes (${randomInt(rng, 6, 12)} ea)`;
    if (add === 'small pouch of sand') add = `small pouch of ${pick(rng, colors)} sand`;
    if (add === 'ball of string') add = `${randomInt(rng, 2, 10) * 10}' ball of ${pick(rng, colors)} string`;
    if (add === 'container of lamp oil') add = `${pick(rng, bottles)} of lamp oil (${randomInt(rng, 2, 5)} pints)`;
    if (add === 'jar of paint with brush') add = `jar of ${pick(rng, colors)} paint with brush`;
    if (add === 'parchment sheets') add = `parchment (${randomInt(rng, 5, 50)} sheets)`;
    if (add === 'leather strap') add = `leather strap (${randomInt(rng, 3, 10)}')`;
    if (add === 'tent') add = `tent (${randomInt(rng, 1, 4)} person)`;
    if (add === 'small sundial') add = `small ${pick(rng, ['iron', 'steel', 'bronze', 'silver', 'copper'])} sundial`;
    if (add === 'twine') add = `twine (${randomInt(rng, 1, 5) * 10}')`;
    if (add === 'small herb pouch') add = `small pouch of ${pick(rng, ['belladonna', 'garlic', 'spiderwort', 'wolfsbane', 'yarrow'])} (${randomInt(rng, 2, 10)} oz)`;
    if (add === 'bottle of cloth dye') add = `bottle of ${pick(rng, colors)} cloth dye`;
    if (add === 'bottle of hair dye') add = `bottle of ${pick(rng, colors)} hair dye`;
    if (add === 'jewelry trinket') add = `${pick(rng, ['iron', 'steel', 'bronze', 'silver', 'copper'])} ${pick(rng, ['necklace', 'ring', 'earrings', 'earring', 'medallion'])}`;
    if (add === 'cloth rag') add = `${pick(rng, colors)} ${pick(rng, ['cloth rag', 'silk handkerchief', 'handkerchief'])}`;
    if (add === 'bandages') add = `bandages (${randomInt(rng, 5, 20)} ea)`;
    if (add === 'wooden stakes') add = `wooden stake (${randomInt(rng, 2, 6)} ea)`;
    if (add === 'lockpicks') add = `lockpicks (${randomInt(rng, 2, 6)} ea)`;
    if (add === 'holy symbol') add = `${pick(rng, ['iron', 'steel', 'bronze', 'silver', 'copper'])} holy symbol`;
    items.push(add);
  }

  const moneyContainer = pick(rng, ['small pouch', 'belt pouch', 'small sack']);
  items.push(`and a ${moneyContainer} (${makeCurrency(rng, game)})`);

  return items;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.packs.length) {
    output.innerHTML = '<em>No packs generated yet.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'packs-summary';
  summary.textContent = `${result.payload.packs.length} pack(s) · ${result.game} · ${result.config.simpleFood ? 'Simple rations enabled' : 'Varied food & drink'}`;
  output.appendChild(summary);

  result.payload.packs.forEach((pack) => {
    const card = document.createElement('article');
    card.className = 'pack-card';

    const title = document.createElement('div');
    title.className = 'pack-title';
    title.textContent = `${pack.index}. Adventuring Pack`;
    card.appendChild(title);

    const list = document.createElement('div');
    list.className = 'pack-items';
    list.textContent = pack.items.join(', ');
    card.appendChild(list);

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Fantasy';
  const packs = Math.min(100, Math.max(1, Number(formData.get('packs') || 1)));
  const simpleFood = formData.get('simpleFood') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadPackPools(game);

  const generated = [];
  for (let index = 1; index <= packs; index += 1) {
    generated.push({
      index,
      items: makePack(rng, simpleFood, game)
    });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      packs,
      simpleFood
    },
    payload: {
      packs: generated
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
Packs: ${lastResult.payload.packs.length}
Simple Food: ${lastResult.config.simpleFood ? 'yes' : 'no'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
