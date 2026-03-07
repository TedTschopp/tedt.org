const toolId = 'mtown';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const fallbackFirstNames = ['Arix', 'Bena', 'Coro', 'Dreel', 'Elna', 'Faro', 'Glim', 'Hara', 'Irik', 'Jessa', 'Karn', 'Luma', 'Moro', 'Nyx', 'Orik', 'Pella', 'Quarn', 'Ressa', 'Silo', 'Tarn'];
const fallbackLastNames = ['Ash', 'Bolt', 'Crag', 'Drift', 'Ember', 'Flux', 'Grime', 'Hollow', 'Iron', 'Jolt', 'Knell', 'Lumen', 'Moss', 'Null', 'Ore', 'Pyre', 'Quill', 'Rivet', 'Shard', 'Torch'];
const outfits = ['patched leathers', 'filtered respirator gear', 'salvage coveralls', 'tribal wraps', 'dust cloak', 'militia jacket'];
const smallItems = ['knife', 'flashlight', 'canteen', 'spool of wire', 'ration packet', 'spare battery', 'med patch', 'lockpick set'];
const professions = ['scrapper', 'guard', 'medic', 'mechanic', 'scout', 'tinkerer', 'trader', 'farmer'];

const businessTypesBase = ['Army Surplus', 'Tavern', 'Tailor', 'Doctor', 'Stables', 'Vehicles', 'Supplies', 'Junk', 'Vault'];
const businessTypesBu = [...businessTypesBase, 'Mechanic', 'Robotics'];
const businessStock = {
  'Army Surplus': ['scrap armor', 'surplus rations', 'combat boots', 'helmets'],
  Tavern: ['brew', 'cooked rations', 'rumors', 'night lodging'],
  Tailor: ['weather wraps', 'boots', 'patch kits', 'mutant-fit clothing'],
  Doctor: ['bandages', 'antitoxin', 'stims', 'surgery services'],
  Stables: ['pack beasts', 'feed', 'saddles', 'hauling harnesses'],
  Vehicles: ['fuel cells', 'wheels', 'bike repairs', 'chassis parts'],
  Supplies: ['rope', 'tools', 'torches', 'maps'],
  Junk: ['random salvage', 'broken circuits', 'copper tubing', 'mystery crates'],
  Vault: ['lock boxes', 'deposit service', 'sealed containers', 'coin exchange'],
  Mechanic: ['engine rebuild', 'spare pistons', 'drive shafts', 'repair kits'],
  Robotics: ['servo parts', 'sensor lenses', 'drone firmware', 'robot repairs']
};

let firstNames = fallbackFirstNames;
let lastNames = fallbackLastNames;
let businessTypesRuntime = [...businessTypesBase];
let businessTypesBuRuntime = [...businessTypesBu];
let businessStockRuntime = JSON.parse(JSON.stringify(businessStock));

const speciesLabels = {
  speciesHuman: 'Human',
  speciesMhuman: 'Mutant Human',
  speciesInsect: 'Humanoid Insect',
  speciesAnimal: 'Humanoid Animal',
  speciesPlant: 'Humanoid Plant',
  speciesRobot: 'Robot'
};

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    settlement: null
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
  if (state === 0) state = 20262026;
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

function gameToStoreCodes(game) {
  if (game === 'Broken Urthe') return ['BU'];
  if (game === 'Gamma World' || game === 'Metamorphosis Alpha') return ['PA', 'MF'];
  return ['MF'];
}

function normalizeItemLabel(value) {
  return String(value || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function resetRuntimePools() {
  firstNames = fallbackFirstNames;
  lastNames = fallbackLastNames;
  businessTypesRuntime = [...businessTypesBase];
  businessTypesBuRuntime = [...businessTypesBu];
  businessStockRuntime = JSON.parse(JSON.stringify(businessStock));
}

async function loadSettlementPools(game) {
  resetRuntimePools();

  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const storeMap = {
      'Army Surplus': ['MILITARY'],
      Tavern: ['TAVERN', 'BAR', 'INN'],
      Tailor: ['TAILOR', 'LEATHERWORKER'],
      Doctor: ['MEDICAL', 'PRIEST'],
      Stables: ['STABLES', 'STABLE'],
      Vehicles: ['VEHICLE'],
      Supplies: ['SUPPLIES', 'PROVISIONER'],
      Junk: ['SUPPLIES', 'PROVISIONER', 'BLACKSMITH'],
      Vault: ['CHURCH', 'LIBRARY'],
      Mechanic: ['MECHANIC'],
      Robotics: ['ROBOT']
    };

    const neededStoreCodes = unique(Object.values(storeMap).flat());
    const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game), neededStoreCodes);

    if (Array.isArray(rows) && rows.length) {
      const pools = {};
      Object.keys(storeMap).forEach((key) => {
        pools[key] = [];
      });

      rows.forEach((row) => {
        const storeCode = String(row.storeCode || '').toUpperCase();
        const item = normalizeItemLabel(row.item);
        if (!item) return;

        Object.entries(storeMap).forEach(([businessType, stores]) => {
          if (stores.includes(storeCode)) {
            pools[businessType].push(item);
          }
        });
      });

      Object.entries(pools).forEach(([businessType, values]) => {
        const merged = unique([...values, ...(businessStock[businessType] || [])]);
        if (merged.length) {
          businessStockRuntime[businessType] = merged.slice(0, 60);
        }
      });

      businessTypesRuntime = businessTypesBase.filter((type) => Array.isArray(businessStockRuntime[type]) && businessStockRuntime[type].length);
      businessTypesBuRuntime = businessTypesBu.filter((type) => Array.isArray(businessStockRuntime[type]) && businessStockRuntime[type].length);
    }

    if (window.WizardawnData.getMutants) {
      const mutantRows = await window.WizardawnData.getMutants();
      if (Array.isArray(mutantRows) && mutantRows.length) {
        const mutantNames = unique(mutantRows.map((row) => normalizeItemLabel(row.name)));
        if (mutantNames.length) {
          firstNames = unique([...fallbackFirstNames, ...mutantNames.map((name) => name.charAt(0).toUpperCase() + name.slice(1))]).slice(0, 80);
          lastNames = unique([...fallbackLastNames, ...mutantNames.map((name) => name.charAt(0).toUpperCase() + name.slice(1))]).slice(0, 80);
        }
      }
    }
  } catch (error) {
    console.warn('Unable to load mtown runtime pools from shared data:', error);
    resetRuntimePools();
  }
}

function settlementClass(size) {
  if (size > 24) return 'City';
  if (size > 16) return 'Town';
  if (size > 8) return 'Village';
  return 'Hamlet';
}

function defaultCurrency(game) {
  if (game === 'Broken Urthe') return 'xm';
  if (game === 'Gamma World' || game === 'Metamorphosis Alpha') return '$';
  return 'gp';
}

function parseSpecies(formData) {
  const selected = Object.entries(speciesLabels)
    .filter(([key]) => formData.get(key) === '1')
    .map(([, value]) => value);
  return selected.length ? selected : ['Human'];
}

function makeCitizen(rng, options) {
  const species = pick(rng, options.species);
  const isRobot = species === 'Robot';
  const adult = randomInt(rng, 1, 100) > 25;
  const role = adult ? pick(rng, professions) : 'child';
  const stamina = `${randomInt(rng, options.might1, options.might1 * options.might2)} STA`;
  const name = isRobot
    ? `Unit-${randomInt(rng, 100, 999)}${pick(rng, ['A', 'B', 'C', 'D'])}`
    : `${pick(rng, firstNames)} ${pick(rng, lastNames)}`;

  const mutation = options.dose && !isRobot
    ? `; extra mutation: ${pick(rng, ['vestigial limbs', 'photosynthetic skin', 'electrical discharge', 'compound eyes'])}`
    : '';

  const clothing = options.dress ? `wearing ${pick(rng, outfits)}` : 'plain attire';
  const itemText = options.possessions ? `; carrying ${pick(rng, smallItems)}` : '';

  return {
    name,
    species,
    role,
    summary: `${name} (${species}) ${adult ? 'adult' : 'youth'} ${role}, ${stamina}, ${clothing}${itemText}${mutation}`
  };
}

function makeBusinesses(rng, game, buildingIds, citizens, options) {
  const types = game === 'Broken Urthe' ? businessTypesBuRuntime : businessTypesRuntime;
  const pool = [...buildingIds];
  const used = [];
  const count = Math.min(types.length, pool.length);

  for (let index = 0; index < count; index += 1) {
    const pickIndex = randomInt(rng, 0, pool.length - 1);
    const building = pool.splice(pickIndex, 1)[0];
    const type = types[index];
    const owner = citizens.find((entry) => entry.building === building)?.primary?.name || 'Unknown Owner';
    const stockPool = businessStockRuntime[type] || ['misc stock'];
    const inventory = stockPool.filter(() => randomInt(rng, 1, 100) <= options.stockPercent);
    const finalInventory = inventory.length ? inventory : [pick(rng, stockPool)];
    const stockText = options.shelf
      ? finalInventory.map((item) => `${item} [${randomInt(rng, 1, 8)}]`).join(', ')
      : finalInventory.join(', ');

    used.push({
      building,
      type,
      owner,
      till: `${randomInt(rng, 50, 3000)}${options.currency}`,
      inventory: stockText,
      techBias: options.techy
    });
  }
  return used;
}

function makeOfficials(rng, settlementType, buildingIds, citizens, techy) {
  const title = settlementType === 'City' ? 'Governor' : settlementType === 'Town' ? 'Mayor' : 'Constable';
  const guards = Math.max(2, Math.ceil(buildingIds.length / 3) + randomInt(rng, 2, 5));
  const shuffled = [...citizens].sort(() => randomInt(rng, -1, 1));
  const selected = shuffled.slice(0, Math.min(guards, shuffled.length));

  return selected.map((entry, index) => ({
    title: index === 0 ? title : 'Law Enforcement',
    name: entry.primary.name,
    building: entry.building,
    gear: techy === 1 ? pick(rng, ['club', 'crossbow', 'spear']) : techy === 2 ? pick(rng, ['laser pistol', 'stun baton', 'plasma carbine']) : pick(rng, ['rifle', 'blade', 'stun baton'])
  }));
}

function renderResult(result) {
  output.innerHTML = '';
  const settlement = result.payload.settlement;
  if (!settlement) {
    output.innerHTML = '<em>No settlement generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'settlement-header';
  header.textContent = `${settlement.name} · ${settlement.type} · ${settlement.buildings} building(s)`;
  output.appendChild(header);

  if (settlement.citizens.length) {
    const citizensTitle = document.createElement('h2');
    citizensTitle.className = 'h6 mt-2';
    citizensTitle.textContent = 'Citizens';
    output.appendChild(citizensTitle);

    settlement.citizens.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'settlement-card';
      card.innerHTML = `<div class="settlement-title">Dwelling ${entry.building}</div><div>${entry.primary.summary}</div>${entry.family.map((member) => `<div class="settlement-sub">${member.summary}</div>`).join('')}`;
      output.appendChild(card);
    });
  }

  if (settlement.businesses.length) {
    const shopsTitle = document.createElement('h2');
    shopsTitle.className = 'h6 mt-3';
    shopsTitle.textContent = 'Businesses';
    output.appendChild(shopsTitle);

    settlement.businesses.forEach((shop) => {
      const card = document.createElement('article');
      card.className = 'settlement-card';
      card.innerHTML = `<div class="settlement-title">#${shop.building} - ${shop.type}</div><div><strong>Owner:</strong> ${shop.owner} · <strong>Till:</strong> ${shop.till}</div><div>${shop.inventory}</div>`;
      output.appendChild(card);
    });
  }

  if (settlement.officials.length) {
    const lawTitle = document.createElement('h2');
    lawTitle.className = 'h6 mt-3';
    lawTitle.textContent = 'Officials';
    output.appendChild(lawTitle);

    settlement.officials.forEach((official) => {
      const card = document.createElement('article');
      card.className = 'settlement-card';
      card.innerHTML = `<div class="settlement-title">${official.title}</div><div>${official.name} (Dwelling ${official.building}) carrying ${official.gear}</div>`;
      output.appendChild(card);
    });
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const game = formData.get('game')?.toString() || 'Mutant Future';
  await loadSettlementPools(game);
  const mapWide = Math.max(1, Math.min(10, Number(formData.get('mapWide') || 1)));
  const mapHigh = Math.max(1, Math.min(10, Number(formData.get('mapHigh') || 1)));
  const mapRooms = Math.max(0, Math.min(1000, Number(formData.get('mapRooms') || 0)));
  const buildings = mapRooms > 0 ? mapRooms : mapWide * mapHigh;
  const type = settlementClass(buildings);
  const name = (formData.get('name')?.toString().trim() || type);

  const options = {
    currency: formData.get('money')?.toString().trim() || defaultCurrency(game),
    populate: formData.get('populate') === '1',
    dress: formData.get('dress') === '1',
    possessions: formData.get('possessions') === '1',
    dose: formData.get('dose') === '1',
    stores: formData.get('stores') === '1',
    shelf: formData.get('shelf') === '1',
    stockPercent: Math.max(5, Math.min(100, Number(formData.get('stock') || 70))),
    techy: Number(formData.get('techy') || 0),
    law: formData.get('law') === '1',
    might1: Math.max(1, Math.min(10, Number(formData.get('might1') || 1))),
    might2: Math.max(4, Math.min(20, Number(formData.get('might2') || (game === 'Gamma World' || game === 'Metamorphosis Alpha' ? 6 : 8)))),
    species: parseSpecies(formData)
  };

  const buildingIds = Array.from({ length: buildings }, (_, idx) => idx + 1);
  const citizens = [];

  if (options.populate) {
    buildingIds.forEach((building) => {
      if (randomInt(rng, 1, 100) > 90) {
        citizens.push({ building, primary: { name: 'Empty Dwelling', summary: 'This building is empty.' }, family: [] });
        return;
      }
      const primary = makeCitizen(rng, options);
      const family = [];
      if (primary.species !== 'Robot' && randomInt(rng, 1, 100) > 50) family.push(makeCitizen(rng, options));
      if (primary.species !== 'Robot' && randomInt(rng, 1, 100) > 70) family.push(makeCitizen(rng, options));
      citizens.push({ building, primary, family });
    });
  }

  const populatedBuildings = citizens.filter((entry) => entry.primary.name !== 'Empty Dwelling').map((entry) => entry.building);
  const businesses = options.stores && populatedBuildings.length
    ? makeBusinesses(rng, game, populatedBuildings, citizens, options)
    : [];

  const officials = options.law && citizens.length
    ? makeOfficials(rng, type, buildingIds, citizens.filter((entry) => entry.primary.name !== 'Empty Dwelling'), options.techy)
    : [];

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      game,
      mapWide,
      mapHigh,
      mapRooms,
      name,
      options
    },
    payload: {
      settlement: {
        name,
        type,
        buildings,
        citizens,
        businesses,
        officials
      }
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
Settlement: ${lastResult.payload.settlement?.name || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
