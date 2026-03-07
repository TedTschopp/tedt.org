const toolId = 'wtown';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const races = ['Human', 'Dwarf', 'Elf', 'Gnome', 'Halfling'];
const fallbackFirstNames = ['Aldren', 'Brina', 'Cador', 'Daphne', 'Eldric', 'Fara', 'Gorim', 'Hesta', 'Ilan', 'Jora', 'Kelvin', 'Lyra', 'Merrin', 'Nalia', 'Orin', 'Perrin', 'Quilla', 'Roder', 'Selene', 'Torin'];
const fallbackSurnames = ['Amberfield', 'Briarstone', 'Coldwater', 'Duskvale', 'Emberfall', 'Fairwind', 'Goldmere', 'Highoak', 'Ironbloom', 'Juniper', 'Keenford', 'Larkspur', 'Moonbrook', 'Northbarrow', 'Oakheart', 'Pineward', 'Quickbrook', 'Ravenhill', 'Stonebridge', 'Thornwall'];
const attires = ['linen tunic', 'wool cloak', 'merchant vest', 'patched traveler gear', 'guild colors', 'temple robes'];
const carried = ['coin purse', 'dagger', 'keyring', 'small journal', 'holy charm', 'trade ledger'];

const fallbackStoreTypes = ['General Merchant', 'Armorer', 'Weaponsmith', 'Alchemist', 'Stable', 'Inn', 'Tailor'];
const fallbackStoreInventory = {
  'General Merchant': ['rope', 'lantern oil', 'rations', 'waterskins', 'blankets'],
  Armorer: ['leather armor', 'chain shirts', 'helmets', 'shields', 'gauntlets'],
  Weaponsmith: ['daggers', 'short swords', 'spears', 'maces', 'arrow bundles'],
  Alchemist: ['healing draught', 'acid vial', 'smoke bomb', 'salves', 'herbal kits'],
  Stable: ['riding horse', 'mule', 'saddles', 'feed bags', 'cart harness'],
  Inn: ['rooms', 'ale', 'stews', 'rumors', 'hirelings'],
  Tailor: ['winter cloaks', 'fine garments', 'travel packs', 'repair services', 'boots']
};

let firstNames = fallbackFirstNames;
let surnames = fallbackSurnames;
let storeTypes = fallbackStoreTypes;
let storeInventory = JSON.parse(JSON.stringify(fallbackStoreInventory));

const guildTypes = ['Masons Guild', 'Merchants Guild', 'Scribes Guild', 'Navigators Guild', 'Artisans Guild'];
const churches = ['Temple of Dawn', 'Sanctum of the Hearth', 'Shrine of the Moon', 'Hall of Saints', 'Abbey of the River'];

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
  if (state === 0) state = 11223344;
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

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeItem(value) {
  return String(value || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function titleize(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function resetRuntimePools() {
  firstNames = fallbackFirstNames;
  surnames = fallbackSurnames;
  storeTypes = fallbackStoreTypes;
  storeInventory = JSON.parse(JSON.stringify(fallbackStoreInventory));
}

function gameToStoreCodes(game) {
  if (game === 'AD&D') return ['AD'];
  return ['OSRIC'];
}

function gameToMonsterCode(game) {
  if (game === 'AD&D') return 'AD';
  return 'OSRIC';
}

async function loadWtownPools(game) {
  resetRuntimePools();

  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const storeMap = {
      'General Merchant': ['SUPPLIES', 'PROVISIONER'],
      Armorer: ['MILITARY', 'BLACKSMITH'],
      Weaponsmith: ['MILITARY', 'BLACKSMITH', 'BOWYER'],
      Alchemist: ['ALCHEMIST', 'MEDICAL'],
      Stable: ['STABLE', 'STABLES'],
      Inn: ['INN', 'TAVERN', 'BAR'],
      Tailor: ['TAILOR', 'LEATHERWORKER']
    };

    const storeCodes = unique(Object.values(storeMap).flat());
    const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game), storeCodes);
    if (Array.isArray(rows) && rows.length) {
      const inventories = {};
      Object.keys(storeMap).forEach((key) => {
        inventories[key] = [];
      });

      rows.forEach((row) => {
        const label = normalizeItem(row.item);
        if (!label) return;
        const code = String(row.storeCode || '').toUpperCase();
        Object.entries(storeMap).forEach(([type, codes]) => {
          if (codes.includes(code)) {
            inventories[type].push(label);
          }
        });
      });

      const nextTypes = [];
      Object.entries(inventories).forEach(([type, dynamic]) => {
        const merged = unique([...dynamic, ...(fallbackStoreInventory[type] || [])]).slice(0, 60);
        if (merged.length) {
          nextTypes.push(type);
          storeInventory[type] = merged;
        }
      });

      if (nextTypes.length) {
        storeTypes = nextTypes;
      }
    }

    if (window.WizardawnData.getMonstersForGame) {
      const monsters = await window.WizardawnData.getMonstersForGame(gameToMonsterCode(game));
      if (Array.isArray(monsters) && monsters.length) {
        const firstPool = [];
        const lastPool = [];
        monsters.slice(0, 1000).forEach((row) => {
          const name = normalizeItem(row.name);
          if (!name) return;
          const tokens = name.split(' ').filter(Boolean);
          if (!tokens.length) return;
          firstPool.push(titleize(tokens[0]));
          if (tokens.length > 1) {
            lastPool.push(titleize(tokens[tokens.length - 1]));
          }
        });
        firstNames = unique([...fallbackFirstNames, ...firstPool]).slice(0, 120);
        surnames = unique([...fallbackSurnames, ...lastPool]).slice(0, 120);
      }
    }
  } catch (error) {
    console.warn('Unable to load wtown runtime pools from shared data:', error);
    resetRuntimePools();
  }
}

function makeName(rng) {
  return `${pick(rng, firstNames)} ${pick(rng, surnames)}`;
}

function settlementLabel(built, buildings) {
  if (built === 'Keep') return 'Keep';
  if (built === 'Village') return 'Village';
  if (buildings >= 40) return 'City';
  if (buildings >= 20) return 'Town';
  return 'Hamlet';
}

function citizenRace(rng, dominantRace, dominantPercent) {
  if (dominantRace && dominantRace !== 'Any' && randomInt(rng, 1, 100) <= dominantPercent) return dominantRace;
  return pick(rng, races);
}

function makeCitizen(rng, options) {
  const race = citizenRace(rng, options.dominantRace, options.dominantPercent);
  const level = randomInt(rng, options.lvl1, options.lvl2);
  const profession = pick(rng, ['laborer', 'artisan', 'merchant', 'apprentice', 'guard', 'scribe', 'fisher', 'farmer']);
  const desc = `${makeName(rng)} (${race}) L${level} ${profession}${options.dress ? `, wearing ${pick(rng, attires)}` : ''}${options.possessions ? `, carrying ${pick(rng, carried)}` : ''}`;
  return { race, level, desc };
}

function makeInstitutionList(rng, label, types, count, buildings, owners, stock, shelf, columns) {
  const used = [];
  const availableBuildings = [...buildings];
  for (let index = 0; index < Math.min(count, availableBuildings.length); index += 1) {
    const bIndex = randomInt(rng, 0, availableBuildings.length - 1);
    const building = availableBuildings.splice(bIndex, 1)[0];
    const type = pick(rng, types);
    const owner = pick(rng, owners);

    let details = '';
    if (label === 'stores') {
      const invPool = storeInventory[type] || ['misc goods'];
      const inv = invPool.filter(() => randomInt(rng, 1, 100) <= stock);
      const finalInv = inv.length ? inv : [pick(rng, invPool)];
      const packed = shelf ? finalInv.map((item) => `${item} [${randomInt(rng, 1, 6)}]`) : finalInv;
      details = columns ? packed.join(', ') : packed.join(' · ');
    } else if (label === 'banks') {
      details = `Vault stock: ${randomInt(rng, 5, 20)} lockboxes, ${randomInt(rng, 200, 5000)} coins`;
    } else if (label === 'guilds') {
      details = `Guild dues and contracts managed by ${owner}`;
    } else if (label === 'churches') {
      details = `Priory stores include ${pick(rng, ['candles', 'scriptures', 'healing herbs', 'alms funds'])}`;
    }

    used.push({ building, type, owner, details });
  }
  return used;
}

function makeRulerBlock(rng, settlementType, options) {
  const realmScale = options.buildings;
  let title = 'Baron';
  if (realmScale >= 60) title = 'King';
  else if (realmScale >= 40) title = 'Prince';
  else if (realmScale >= 20) title = 'Duke';
  else if (settlementType === 'Village') title = 'Lord';

  const ruler = makeCitizen(rng, options);
  const consort = makeCitizen(rng, options);
  const vaultItems = Array.from({ length: randomInt(rng, 8, 16) }, () => pick(rng, ['gem casket', 'royal signet', 'ceremonial armor', 'silver chalice', 'enchanted trinket']));

  return {
    title,
    ruler: `${title.toUpperCase()}: ${ruler.desc}`,
    consort: `${title === 'King' ? 'QUEEN' : title === 'Prince' ? 'PRINCESS' : 'CONSORT'}: ${consort.desc}`,
    vault: vaultItems
  };
}

function renderResult(result) {
  output.innerHTML = '';
  const settlement = result.payload.settlement;
  if (!settlement) {
    output.innerHTML = '<em>No settlement generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'wtown-header';
  header.textContent = `${settlement.name} · ${settlement.type} · ${settlement.buildings} building(s)`;
  output.appendChild(header);

  if (settlement.rulerBlock) {
    const card = document.createElement('article');
    card.className = 'wtown-card';
    card.innerHTML = `<div class="wtown-title">Rulers</div><div>${settlement.rulerBlock.ruler}</div><div>${settlement.rulerBlock.consort}</div><div class="wtown-sub">ROYAL VAULT: ${settlement.rulerBlock.vault.join(' --- ')}</div>`;
    output.appendChild(card);
  }

  if (settlement.citizens.length) {
    const title = document.createElement('h2');
    title.className = 'h6 mt-2';
    title.textContent = 'Citizens';
    output.appendChild(title);

    settlement.citizens.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'wtown-card';
      card.innerHTML = `<div class="wtown-title">Dwelling ${entry.building}</div><div>${entry.desc}</div>`;
      output.appendChild(card);
    });
  }

  const sections = [
    { key: 'stores', label: 'Merchants' },
    { key: 'banks', label: 'Banks' },
    { key: 'guilds', label: 'Guilds' },
    { key: 'police', label: 'Guards' },
    { key: 'churches', label: 'Churches' }
  ];

  sections.forEach((section) => {
    const entries = settlement[section.key] || [];
    if (!entries.length) return;
    const title = document.createElement('h2');
    title.className = 'h6 mt-3';
    title.textContent = section.label;
    output.appendChild(title);

    entries.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'wtown-card';
      card.innerHTML = `<div class="wtown-title">#${entry.building} - ${entry.type}</div><div><strong>Owner:</strong> ${entry.owner}</div><div>${entry.details || ''}</div>`;
      output.appendChild(card);
    });
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'OSRIC';
  await loadWtownPools(game);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const mapWide = Math.max(1, Math.min(10, Number(formData.get('mapWide') || 1)));
  const mapHigh = Math.max(1, Math.min(10, Number(formData.get('mapHigh') || 1)));
  const mapRooms = Math.max(0, Math.min(1000, Number(formData.get('mapRooms') || 0)));
  const buildings = mapRooms > 0 ? mapRooms : mapWide * mapHigh;
  const built = formData.get('built')?.toString() || 'City';
  const type = settlementLabel(built, buildings);

  const lvl1Raw = Math.max(1, Math.min(20, Number(formData.get('lvl1') || 1)));
  const lvl2Raw = Math.max(1, Math.min(20, Number(formData.get('lvl2') || 20)));
  const lvl1 = Math.min(lvl1Raw, lvl2Raw);
  const lvl2 = Math.max(lvl1Raw, lvl2Raw);

  const options = {
    game,
    name: formData.get('name')?.toString().trim() || type,
    buildings,
    dress: formData.get('dress') === '1',
    possessions: formData.get('possessions') === '1',
    populate: formData.get('populate') === '1',
    storesEnabled: formData.get('stores') === '1',
    banksEnabled: formData.get('banks') === '1',
    guildsEnabled: formData.get('guilds') === '1',
    policeEnabled: formData.get('police') === '1',
    churchesEnabled: formData.get('church') === '1',
    rulerEnabled: formData.get('ruler') === '1',
    columns: formData.get('columns') === '1',
    shelf: formData.get('shelf') === '1',
    stock: Math.max(5, Math.min(100, Number(formData.get('stock') || 70))),
    dominantRace: formData.get('race')?.toString() || 'Any',
    dominantPercent: Math.max(0, Math.min(100, Number(formData.get('racePart') || 100))),
    lvl1,
    lvl2
  };

  const buildingIds = Array.from({ length: buildings }, (_, idx) => idx + 1);
  const citizens = options.populate
    ? buildingIds.map((building) => ({ building, ...makeCitizen(rng, options) }))
    : [];
  const ownerNames = citizens.length ? citizens.map((entry) => entry.desc.split(' (')[0]) : [makeName(rng), makeName(rng), makeName(rng)];

  const stores = options.storesEnabled
    ? makeInstitutionList(rng, 'stores', storeTypes, Math.ceil(buildings / 8), buildingIds, ownerNames, options.stock, options.shelf, options.columns)
    : [];
  const banks = options.banksEnabled
    ? makeInstitutionList(rng, 'banks', ['Bank', 'Money Changer'], Math.max(1, Math.ceil(buildings / 20)), buildingIds, ownerNames, options.stock, options.shelf, options.columns)
    : [];
  const guilds = options.guildsEnabled
    ? makeInstitutionList(rng, 'guilds', guildTypes, Math.max(1, Math.ceil(buildings / 18)), buildingIds, ownerNames, options.stock, options.shelf, options.columns)
    : [];
  const police = options.policeEnabled
    ? makeInstitutionList(rng, 'police', ['Guard Barracks', 'Watch Post'], Math.max(1, Math.ceil(buildings / 16)), buildingIds, ownerNames, options.stock, options.shelf, options.columns)
    : [];
  const churchesList = options.churchesEnabled
    ? makeInstitutionList(rng, 'churches', churches, Math.max(1, Math.ceil(buildings / 15)), buildingIds, ownerNames, options.stock, options.shelf, options.columns)
    : [];

  const rulerBlock = options.rulerEnabled ? makeRulerBlock(rng, type, options) : null;

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      built,
      mapWide,
      mapHigh,
      mapRooms,
      options
    },
    payload: {
      settlement: {
        name: options.name,
        type,
        buildings,
        rulerBlock,
        citizens,
        stores,
        banks,
        guilds,
        police,
        churches: churchesList
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
