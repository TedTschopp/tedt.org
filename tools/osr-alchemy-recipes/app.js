const toolId = 'brew';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const potionLists = {
  OSRIC: ['Oil of Etherealness', 'Oil of Slipperiness', 'Philtre of Love', 'Philtre of Persuasiveness', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Gaseous Form', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Plant Control', 'Potion of Polymorph', 'Potion of Speed', 'Potion of Sweet Water', 'Potion of Treasure Finding', 'Potion of Water Breathing'],
  'Labyrinth Lord': ['Animal Control', 'Clairaudience', 'Clairvoyance', 'Climbing', 'Delusion', 'Diminution', 'ESP', 'Extra-Healing', 'Fire Resistance', 'Flying', 'Gaseous Form', 'Giant Strength', 'Growth', 'Healing', 'Heroism', 'Invisibility', 'Invulnerability', 'Levitation', 'Longevity', 'Oil of Etherealness', 'Oil of Slipperiness', 'Philter of Love', 'Plant Control', 'Poison', 'Polymorph', 'Speed', 'Sweet Water', 'Treasure Finding', 'Undead Control', 'Water Breathing'],
  'BD&D': ['Poison', 'Clairaudience', 'Clairvoyance', 'Control Animal', 'Control Dragon', 'Control Giant', 'Control Human', 'Control Plant', 'Control Undead', 'Delusion', 'Diminution', 'ESP', 'Fire Resistance', 'Flying', 'Gaseous Form', 'Giant Strength', 'Growth', 'Healing', 'Heroism', 'Invisibility', 'Invulnerability', 'Levitation', 'Longevity', 'Polymorph Self', 'Speed', 'Treasure Finding'],
  'Swords & Six-Siders': ['Poison', 'Flying', 'Gaseous Form', 'Giant Strength', 'Growth', 'Healing', 'Invisibility', 'Levitation', 'Neutralize Poison', 'Remove Disease', 'Remove Paralysis', 'Shrinking', 'Stone to Flesh'],
  'AD&D': ['Oil of Etherealness', 'Oil of Slipperiness', 'Philter of Love', 'Philter of Persuasiveness', 'Poison', 'Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Potion of Plant Control', 'Potion of Polymorph Self', 'Potion of Speed', 'Potion of Sweet Water', 'Potion of Treasure Finding', 'Potion of Water Breathing'],
  'Swords & Wizardry': ['Animal Control', 'Clairaudience', 'Clairvoyance', 'Diminution', 'Dragon Control', 'Ethereality', 'Fire Resistance', 'Flying', 'Frozen Concoction', 'Gaseous Form', 'Giant Strength', 'Growth', 'Heroism', 'Invisibility', 'Invulnerability', 'Levitation', 'Plant Control', 'Poison', 'Slipperiness', 'Treasure Finding', 'Undead Control', 'Extra Healing', 'Healing'],
  BFRPG: ['Clairaudience', 'Clairvoyance', 'Control Animal', 'Control Dragon', 'Control Giant', 'Control Human', 'Control Plant', 'Control Undead', 'Delusion', 'Diminution', 'ESP', 'Fire Resistance', 'Flying', 'Gaseous Form', 'Giant Strength', 'Growth', 'Healing', 'Heroism', 'Invisibility', 'Invulnerability', 'Levitation', 'Longevity', 'Poison', 'Polymorph Self', 'Speed', 'Treasure Finding']
};

const adndUaExtras = ['Elixir of Health', 'Elixir of Life', 'Elixir of Madness', 'Elixir of Youth', 'Oil of Acid Resistance', 'Oil of Disenchantment', 'Oil of Elemental Invulnerability', 'Oil of Fiery Burning', 'Oil of Fumbling', 'Oil of Impact', 'Oil of Timelessness', 'Philter of Beauty', 'Philter of Glibness', 'Philter of Stammering & Stuttering', 'Potion of Fire Breath', 'Potion of Rainbow Hues', 'Potion of Ventriloquism', 'Potion of Vitality'];
const llAecExtras = ['Brass Dragon Control', 'Bronze Dragon Control', 'Copper Dragon Control', 'Gold Dragon Control', 'Silver Dragon Control', 'Other Humanoid Control'];

const fallbackReagents = ['mandrake root', 'wolfsbane', 'belladonna', 'ghost orchid', 'moonwater', 'basilisk scale', 'wyrm blood', 'sunleaf', 'nightshade', 'salamander ash', 'phoenix feather dust', 'silverthorn', 'grave moss', 'faerie pollen', 'amber resin', 'obsidian powder', 'quicksilver', 'starlight dew', 'dragonfly wing', 'deep-cave lichen', 'myrrh', 'spider silk', 'sea salt', 'charcoal', 'powdered pearl', 'oak gall', 'lotus sap', 'frost mint', 'witch hazel'];
const fallbackVessels = ['vial', 'flask', 'stoppered bottle', 'sealed ampoule', 'ceramic phial', 'glass jar'];
const brewActions = ['Steep and stir for one hour', 'Simmer over low flame', 'Distill through silver coil', 'Blend under moonlight', 'Filter through linen', 'Agitate in clockwise spirals', 'Let settle overnight', 'Heat until just before boil'];

let reagents = fallbackReagents;
let vessels = fallbackVessels;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Labyrinth Lord',
  config: {
    valueMin: 1,
    valueMax: 1000,
    ua: false,
    aec: false
  },
  payload: {
    recipes: [],
    reagentPrices: []
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

function pick(rng, values) {
  return values[randomInt(rng, 0, values.length - 1)];
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

function isVesselItem(name) {
  return /\b(vial|flask|bottle|jar|phial|tube|ampoule)\b/i.test(name);
}

function isReagentItem(name) {
  return /\b(herb|powder|dust|resin|root|moss|sage|garlic|belladonna|feverfew|rue|salt|ash|ink|oil|water|glue|incense)\b/i.test(name);
}

async function loadBrewPools(game, aec) {
  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game, aec), ['ALCHEMIST', 'SUPPLIES']);
    if (!Array.isArray(rows) || !rows.length) {
      return;
    }

    const reagentSet = new Set();
    const vesselSet = new Set();
    rows.forEach((row) => {
      const label = cleanItemLabel(row.item);
      if (!label) return;
      if (isVesselItem(label)) {
        vesselSet.add(label);
      } else if (isReagentItem(label)) {
        reagentSet.add(label);
      }
    });

    reagents = [...reagentSet, ...fallbackReagents].filter((value, index, all) => all.indexOf(value) === index);
    vessels = [...vesselSet, ...fallbackVessels].filter((value, index, all) => all.indexOf(value) === index);
  } catch (error) {
    console.warn('Unable to load brew pools from store_items:', error);
  }
}

function buildPotionList(game, ua, aec) {
  let base = [...(potionLists[game] || [])];
  if (game === 'AD&D' && ua) base = [...base, ...adndUaExtras];
  if (game === 'Labyrinth Lord' && aec) base = [...base, ...llAecExtras];

  if (game === 'Labyrinth Lord' || game === 'Swords & Wizardry' || game === 'BFRPG' || game === 'Swords & Six-Siders') {
    return base.map((name) => (name.startsWith('Potion of ') || name.startsWith('Oil') || name.startsWith('Philter') ? name : `Potion of ${name}`));
  }
  return base;
}

function createRecipe(rng) {
  const ingredientCount = randomInt(rng, 2, 5);
  const chosen = new Set();
  while (chosen.size < ingredientCount) {
    chosen.add(pick(rng, reagents));
  }
  const ingredients = [...chosen];
  return {
    ingredients,
    method: `${pick(rng, brewActions)} and bottle in a ${pick(rng, vessels)}.`
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'brew-summary';
  summary.textContent = `${result.payload.recipes.length} recipe(s) · ${result.payload.reagentPrices.length} reagent entries · ${result.game}`;
  output.appendChild(summary);

  const recipesHeader = document.createElement('h2');
  recipesHeader.className = 'h6 mt-2';
  recipesHeader.textContent = 'Potion Recipes';
  output.appendChild(recipesHeader);

  const recipesTable = document.createElement('table');
  recipesTable.className = 'table table-sm table-striped brew-table';
  recipesTable.innerHTML = '<thead><tr><th>Potion</th><th>Recipe</th></tr></thead><tbody></tbody>';
  const recipesBody = recipesTable.querySelector('tbody');

  result.payload.recipes.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.name}</td><td>${entry.pretty}</td>`;
    recipesBody.appendChild(row);
  });

  output.appendChild(recipesTable);

  const reagentHeader = document.createElement('h2');
  reagentHeader.className = 'h6 mt-3';
  reagentHeader.textContent = 'Reagent Prices';
  output.appendChild(reagentHeader);

  const reagentTable = document.createElement('table');
  reagentTable.className = 'table table-sm table-striped brew-table';
  reagentTable.innerHTML = '<thead><tr><th>Reagent</th><th class="text-end">Price</th></tr></thead><tbody></tbody>';
  const reagentBody = reagentTable.querySelector('tbody');

  result.payload.reagentPrices.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.name}, ${entry.vessel}</td><td class="text-end">${entry.price}gp</td>`;
    reagentBody.appendChild(row);
  });

  output.appendChild(reagentTable);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const valueMinRaw = Math.min(1000, Math.max(1, Number(formData.get('valueMin') || 1)));
  const valueMaxRaw = Math.min(1000, Math.max(1, Number(formData.get('valueMax') || 1000)));
  const valueMin = Math.min(valueMinRaw, valueMaxRaw);
  const valueMax = Math.max(valueMinRaw, valueMaxRaw);
  const ua = formData.get('ua') === '1';
  const aec = formData.get('aec') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadBrewPools(game, aec);

  const potionNames = buildPotionList(game, ua, aec);
  const recipes = [];
  const reagentMap = new Map();

  potionNames.forEach((name) => {
    const recipe = createRecipe(rng);
    recipes.push({
      name,
      ingredients: recipe.ingredients,
      method: recipe.method,
      pretty: `${recipe.ingredients.join(', ')}. ${recipe.method}`
    });

    recipe.ingredients.forEach((ingredient) => {
      if (!reagentMap.has(ingredient)) {
        reagentMap.set(ingredient, {
          name: ingredient,
          vessel: pick(rng, vessels),
          price: randomInt(rng, valueMin, valueMax)
        });
      }
    });
  });

  const reagentPrices = [...reagentMap.values()].sort((left, right) => left.name.localeCompare(right.name));

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      valueMin,
      valueMax,
      ua,
      aec
    },
    payload: {
      recipes,
      reagentPrices
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
Recipes: ${lastResult.payload.recipes.length}
Reagents: ${lastResult.payload.reagentPrices.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
