const toolId = 'scavenge';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const buildingLabels = {
  book_store: 'Book Store',
  cloth_store: 'Clothing Store',
  dept_store: 'Department Store',
  electric_store: 'Electronics Store',
  fire_station: 'Fire Station',
  gas_store: 'Gas Station/Convenient Store',
  generic: 'Generic Building',
  food_store: 'Grocery Store',
  tool_store: 'Hardware Store',
  home: 'Home',
  hospital: 'Hospital/Pharmacy',
  army_base: 'Military Base/Army Surplus Store',
  police_station: 'Police Station',
  restaurant: 'Restaurant',
  sport_store: 'Sporting Goods Store',
  toy_store: 'Toy Store'
};

const buildingItemPools = {
  book_store: ['field guide', 'faded atlas', 'scavenged paperback', 'water-damaged notebook', 'ink pen', 'bookend', 'map tube'],
  cloth_store: ['work gloves', 'winter coat', 'backpack strap', 'scarf', 'denim jacket', 'boots', 'poncho'],
  dept_store: ['flashlight', 'duct tape', 'batteries', 'kitchen knife', 'blanket', 'soap', 'multi-tool'],
  electric_store: ['circuit board', 'soldering iron', 'headlamp', 'coiled wire', 'charger cable', 'radio parts', 'portable speaker'],
  fire_station: ['fire axe', 'breathing mask', 'rope bundle', 'flare', 'hydrant wrench', 'protective gloves', 'helmet'],
  gas_store: ['snack bars', 'bottled water', 'lighter', 'fuel siphon hose', 'road map', 'matches', 'motor oil'],
  generic: ['scrap metal', 'plastic container', 'rope', 'toolbox', 'rusty can', 'work light', 'small lockbox'],
  food_store: ['canned beans', 'rice bag', 'water jug', 'salt pack', 'dried fruit', 'energy drink', 'cooking oil'],
  tool_store: ['hammer', 'box cutter', 'nails', 'screwdriver set', 'duct tape', 'wrench', 'socket set'],
  home: ['photo frame', 'kitchen pan', 'bedsheet', 'hiking bag', 'toiletries', 'first-aid kit', 'pocket knife'],
  hospital: ['bandages', 'antiseptic', 'syringe kit', 'painkillers', 'surgical mask', 'splint', 'medical scissors'],
  army_base: ['ammo pouch', 'canteen', 'combat boots', 'field radio', 'combat knife', 'ration pack', 'uniform patch'],
  police_station: ['handcuffs', 'flashlight', 'duty belt', 'radio battery', 'case file folder', 'locker key', 'baton'],
  restaurant: ['kitchen knife', 'cooking pot', 'water filter pitcher', 'sealed spices', 'apron', 'heavy gloves', 'cleaning alcohol'],
  sport_store: ['baseball bat', 'hiking rope', 'camp stove', 'water bottle', 'fishing line', 'tent stakes', 'compass'],
  toy_store: ['board game', 'toy drone', 'battery pack', 'plastic figures', 'remote control', 'paint kit', 'toy toolkit']
};

const gameStoreCodes = {
  'Mutant Future': ['MF', 'PA'],
  'Millenniums & Mutations': ['MF', 'PA'],
  'Gamma World': ['MF', 'PA', 'BU'],
  'Metamorphosis Alpha': ['MF', 'PA', 'BU'],
  'Broken Urthe': ['BU', 'PA'],
  'Post-Apocalyptic': ['MF', 'PA', 'BU'],
  'Rifts': ['MF', 'PA', 'BU'],
  'Necropalyx': ['MF', 'PA', 'BU']
};

const buildingStoreMap = {
  book_store: ['LIBRARY'],
  cloth_store: ['TAILOR', 'LEATHERWORKER'],
  dept_store: ['SUPPLIES', 'PROVISIONER'],
  electric_store: ['MECHANIC', 'VEHICLE'],
  fire_station: ['SUPPLIES', 'MILITARY'],
  gas_store: ['BAR', 'TAVERN', 'PROVISIONER'],
  generic: [],
  food_store: ['BAKER', 'BAR', 'TAVERN', 'PROVISIONER'],
  tool_store: ['BLACKSMITH', 'CARPENTER', 'MECHANIC', 'SUPPLIES'],
  home: ['SUPPLIES', 'PROVISIONER'],
  hospital: ['MEDICAL', 'PRIEST'],
  army_base: ['MILITARY'],
  police_station: ['MILITARY', 'SUPPLIES'],
  restaurant: ['BAR', 'TAVERN', 'BAKER'],
  sport_store: ['MILITARY', 'SUPPLIES', 'PROVISIONER'],
  toy_store: ['MUSIC', 'SUPPLIES']
};

const corpseTypes = ['survivor corpse', 'raider corpse', 'soldier corpse', 'mutant corpse', 'scavenger corpse', 'zombie corpse'];
const corpseItems = ['wallet', 'broken phone', 'ammo', 'canteen', 'bandage roll', 'pocket knife', 'key ring', 'coin pouch', 'map scrap', 'protein bar', 'flashlight', 'wristwatch'];
const conditionSuffixes = [' (broken)', ' (worn)', ' (damaged)', ' (serviceable)', ' (good)', ' (excellent)'];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Mutant Future',
  config: {
    building: 'random',
    sets: 1,
    amount1: 5,
    amount2: 12,
    csets: 0,
    camount1: 1,
    camount2: 5,
    condition: false
  },
  payload: {
    buildings: [],
    corpses: []
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

function chooseBuilding(rng, building) {
  if (building !== 'random') return building;
  return pick(rng, Object.keys(buildingLabels));
}

function maybeCondition(rng, item, enabled) {
  if (!enabled) return item;
  return `${item}${pick(rng, conditionSuffixes)}`;
}

function uniqueValues(list) {
  return [...new Set(list.filter(Boolean))];
}

async function resolveBuildingPool(game, key) {
  const gameCodes = gameStoreCodes[game] || ['MF', 'PA', 'BU'];
  const storeCodes = buildingStoreMap[key] || [];
  const rows = await window.WizardawnData.getStoreItemsByStore(gameCodes, storeCodes);
  const items = uniqueValues(rows.map((row) => row.item));
  if (items.length) {
    return items;
  }
  return buildingItemPools[key] || buildingItemPools.generic;
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'scav-summary';
  summary.textContent = `${result.payload.buildings.length} building set(s) · ${result.payload.corpses.length} corpse set(s) · ${result.game}`;
  output.appendChild(summary);

  if (result.payload.buildings.length) {
    const bHead = document.createElement('h2');
    bHead.className = 'h6 mt-2';
    bHead.textContent = 'Building Finds';
    output.appendChild(bHead);

    result.payload.buildings.forEach((set, setIndex) => {
      const card = document.createElement('article');
      card.className = 'scav-card';
      const title = document.createElement('div');
      title.className = 'scav-title';
      title.textContent = `${setIndex + 1}. ${set.title}`;
      card.appendChild(title);

      const list = document.createElement('ol');
      list.className = 'mb-0';
      set.items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      card.appendChild(list);
      output.appendChild(card);
    });
  }

  if (result.payload.corpses.length) {
    const cHead = document.createElement('h2');
    cHead.className = 'h6 mt-3';
    cHead.textContent = 'Corpse Finds';
    output.appendChild(cHead);

    result.payload.corpses.forEach((set, setIndex) => {
      const card = document.createElement('article');
      card.className = 'scav-card';
      const title = document.createElement('div');
      title.className = 'scav-title';
      title.textContent = `${setIndex + 1}. ${set.title}`;
      card.appendChild(title);

      const list = document.createElement('ol');
      list.className = 'mb-0';
      set.items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      card.appendChild(list);
      output.appendChild(card);
    });
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Mutant Future';
  const building = formData.get('building')?.toString() || 'random';
  const sets = Math.min(100, Math.max(0, Number(formData.get('sets') || 0)));
  const amount1Raw = Math.min(100, Math.max(1, Number(formData.get('amount1') || 1)));
  const amount2Raw = Math.min(100, Math.max(1, Number(formData.get('amount2') || 1)));
  const amount1 = Math.min(amount1Raw, amount2Raw);
  const amount2 = Math.max(amount1Raw, amount2Raw);
  const csets = Math.min(100, Math.max(0, Number(formData.get('csets') || 0)));
  const camount1Raw = Math.min(20, Math.max(1, Number(formData.get('camount1') || 1)));
  const camount2Raw = Math.min(20, Math.max(1, Number(formData.get('camount2') || 1)));
  const camount1 = Math.min(camount1Raw, camount2Raw);
  const camount2 = Math.max(camount1Raw, camount2Raw);
  const condition = formData.get('condition') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const buildings = [];
  for (let index = 0; index < sets; index += 1) {
    const key = chooseBuilding(rng, building);
    const title = buildingLabels[key] || 'Building';
    const pool = await resolveBuildingPool(game, key);
    const count = randomInt(rng, amount1, amount2);
    const items = Array.from({ length: count }, () => maybeCondition(rng, pick(rng, pool), condition));
    buildings.push({ buildingKey: key, title, items });
  }

  const corpses = [];
  for (let index = 0; index < csets; index += 1) {
    const corpse = pick(rng, corpseTypes);
    const count = randomInt(rng, camount1, camount2);
    const items = Array.from({ length: count }, () => maybeCondition(rng, pick(rng, corpseItems), condition));
    corpses.push({ title: corpse, items });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      building,
      sets,
      amount1,
      amount2,
      csets,
      camount1,
      camount2,
      condition
    },
    payload: {
      buildings,
      corpses
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
Building Sets: ${lastResult.payload.buildings.length}
Corpse Sets: ${lastResult.payload.corpses.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
