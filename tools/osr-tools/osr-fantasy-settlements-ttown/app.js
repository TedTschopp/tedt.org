const toolId = 'ttown';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const allRaces = [
  'Human', 'Brownie', 'Centaur', 'Cyclops', 'Daklafar', 'Dwarf', 'Dwurman', 'Elf', 'Fairy', 'Falcoran',
  'Fruglum', 'Gnome', 'Goblin', 'Gremlin', 'Greyling', 'Hobgoblin', 'Hobling', 'Imp', 'Kobold', 'Leprechaun',
  'Mantaran', 'Minotaur', 'Neptar', 'Ogre', 'Orke', 'Pixie', 'Rattanu', 'Satyr', 'Sauriman', 'Slitheran',
  'Sprite', 'Suvart', 'Tigran', 'Troll', 'Wulfan'
];

const fallbackGivenNames = ['Aldren', 'Brina', 'Cador', 'Daphne', 'Eldric', 'Fara', 'Gorim', 'Hesta', 'Ilan', 'Jora', 'Kelvin', 'Lyra', 'Merrin', 'Nalia', 'Orin', 'Perrin', 'Quilla', 'Roder', 'Selene', 'Torin'];
const fallbackFamilyNames = ['Amberfield', 'Briarstone', 'Coldwater', 'Duskvale', 'Emberfall', 'Fairwind', 'Goldmere', 'Highoak', 'Ironbloom', 'Juniper', 'Keenford', 'Larkspur', 'Moonbrook', 'Northbarrow', 'Oakheart', 'Pineward', 'Quickbrook', 'Ravenhill', 'Stonebridge', 'Thornwall'];
const outfits = ['linen tunic', 'wool cloak', 'travel leathers', 'guild colors', 'temple vestments', 'sturdy work clothes'];
const keepsakes = ['coin purse', 'dagger', 'holy symbol', 'key ring', 'wax tablet', 'trade ledger'];
const roles = ['farmer', 'fisher', 'smith', 'scribe', 'guard', 'merchant', 'hunter', 'artisan', 'carter', 'laborer'];
const churchNames = ['Temple of Dawn', 'Sanctum of the Hearth', 'Shrine of the Moon', 'Hall of Saints', 'Abbey of the River'];
const guildNames = ['Masons Guild', 'Merchants Guild', 'Scribes Guild', 'Crafts Guild', 'Navigators Guild'];

const fallbackStoreTemplates = [
  { type: 'General Merchant', stock: ['rope', 'rations', 'lantern oil', 'waterskin', 'blankets', 'chalk'] },
  { type: 'Armorer', stock: ['leather jerkin', 'chain shirt', 'shield', 'helmet', 'gauntlets'] },
  { type: 'Weaponsmith', stock: ['dagger', 'short sword', 'spear', 'mace', 'bow'] },
  { type: 'Inn', stock: ['lodging', 'ale', 'stew', 'rumors', 'hirelings'] },
  { type: 'Tailor', stock: ['travel cloak', 'boots', 'winter coat', 'fine vest', 'repair kit'] },
  { type: 'Alchemist', stock: ['healing draught', 'antitoxin', 'lamp oil', 'herbal poultice', 'smoke vial'] },
  { type: 'Stable', stock: ['riding horse', 'mule', 'saddle', 'feed', 'harness'] }
];

let givenNames = fallbackGivenNames;
let familyNames = fallbackFamilyNames;
let storeTemplates = fallbackStoreTemplates;

const weaponMetaClassic = {
  dagger: { class: 'Light Blade', stat: '3+2' },
  'short sword': { class: 'Medium Blade', stat: '4+3' },
  spear: { class: 'Polearm', stat: '5+2' },
  mace: { class: 'Blunt', stat: '6+2' },
  bow: { class: 'Ranged', stat: '4+4' },
  'leather jerkin': { class: 'Armor Light', stat: '1 pt soak' },
  'chain shirt': { class: 'Armor Medium', stat: '3 pt soak' },
  shield: { class: 'Armor Shield', stat: '2 pt soak' },
  helmet: { class: 'Armor Head', stat: '1 pt soak' },
  gauntlets: { class: 'Armor Accessory', stat: '1 pt soak' }
};

const weaponMetaMagestykc = {
  dagger: { class: 'Simple Light', stat: '1 strike die' },
  'short sword': { class: 'Simple Medium', stat: '2 strike dice' },
  spear: { class: 'Simple Reach', stat: '2 strike dice' },
  mace: { class: 'Simple Heavy', stat: '2 strike dice + crush' },
  bow: { class: 'Simple Ranged', stat: '2 strike dice' },
  'leather jerkin': { class: 'Armor Tier 1', stat: 'light guard' },
  'chain shirt': { class: 'Armor Tier 2', stat: 'medium guard' },
  shield: { class: 'Armor Addon', stat: '+guard vs melee' },
  helmet: { class: 'Armor Addon', stat: '+guard vs crit' },
  gauntlets: { class: 'Armor Addon', stat: '+guard vs hand hits' }
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
  if (state === 0) state = 55119977;
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
  givenNames = fallbackGivenNames;
  familyNames = fallbackFamilyNames;
  storeTemplates = fallbackStoreTemplates;
}

async function loadTtownPools() {
  resetRuntimePools();

  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const storeMap = {
      'General Merchant': ['SUPPLIES', 'PROVISIONER'],
      Armorer: ['MILITARY', 'BLACKSMITH'],
      Weaponsmith: ['MILITARY', 'BLACKSMITH'],
      Inn: ['INN', 'TAVERN', 'BAR'],
      Tailor: ['TAILOR', 'LEATHERWORKER'],
      Alchemist: ['ALCHEMIST', 'MEDICAL'],
      Stable: ['STABLE', 'STABLES']
    };

    const storeCodes = unique(Object.values(storeMap).flat());
    const rows = await window.WizardawnData.getStoreItemsByStore(['TT'], storeCodes);
    if (Array.isArray(rows) && rows.length) {
      const templates = [];

      Object.entries(storeMap).forEach(([type, codes]) => {
        const dynamic = unique(
          rows
            .filter((row) => codes.includes(String(row.storeCode || '').toUpperCase()))
            .map((row) => normalizeItem(row.item))
        );

        const fallback = fallbackStoreTemplates.find((entry) => entry.type === type)?.stock || [];
        const stock = unique([...dynamic, ...fallback]).slice(0, 50);
        if (stock.length) {
          templates.push({ type, stock });
        }
      });

      if (templates.length) {
        storeTemplates = templates;
      }
    }

    if (window.WizardawnData.getMonstersForGame) {
      const monsters = await window.WizardawnData.getMonstersForGame('TT');
      if (Array.isArray(monsters) && monsters.length) {
        const firstPool = [];
        const familyPool = [];
        monsters.forEach((row) => {
          const name = normalizeItem(row.name);
          if (!name) return;
          const parts = name.split(/\s+/).filter(Boolean);
          if (parts[0]) firstPool.push(titleize(parts[0]));
          if (parts.length > 1) familyPool.push(titleize(parts[parts.length - 1]));
        });

        givenNames = unique([...fallbackGivenNames, ...firstPool]).slice(0, 80);
        familyNames = unique([...fallbackFamilyNames, ...familyPool]).slice(0, 80);
      }
    }
  } catch (error) {
    console.warn('Unable to load ttown runtime pools from shared data:', error);
    resetRuntimePools();
  }
}

function makeName(rng) {
  return `${pick(rng, givenNames)} ${pick(rng, familyNames)}`;
}

function pickRace(rng, racePool) {
  return pick(rng, racePool.length ? racePool : allRaces);
}

function settlementLabel(built, buildings) {
  if (built === 'Keep') return 'Keep';
  if (built === 'Village') return 'Village';
  if (buildings >= 40) return 'City';
  if (buildings >= 20) return 'Town';
  return 'Hamlet';
}

function realmScale(mapWide, mapHigh, mapRooms) {
  if (mapRooms > 0) {
    const realm = Math.ceil(mapRooms / 50) + Math.floor(mapRooms / 50);
    const kingdom = mapRooms / 10;
    return { realm, kingdom };
  }
  return { realm: mapWide + mapHigh, kingdom: mapWide * mapHigh };
}

function rulerTier(kingdom) {
  if (kingdom >= 60) return { male: 'King', female: 'Queen', guardsMin: 4, guardsMax: 9 };
  if (kingdom >= 50) return { male: 'Grand Duke', female: 'Grand Duchess', guardsMin: 4, guardsMax: 8 };
  if (kingdom >= 40) return { male: 'Viceroy', female: 'Vicereine', guardsMin: 3, guardsMax: 7 };
  if (kingdom >= 30) return { male: 'Archduke', female: 'Archduchess', guardsMin: 3, guardsMax: 6 };
  if (kingdom >= 20) return { male: 'Prince', female: 'Princess', guardsMin: 2, guardsMax: 5 };
  if (kingdom >= 10) return { male: 'Duke', female: 'Duchess', guardsMin: 2, guardsMax: 4 };
  if (kingdom >= 5) return { male: 'Count', female: 'Countess', guardsMin: 1, guardsMax: 3 };
  return { male: 'Baron', female: 'Baroness', guardsMin: 1, guardsMax: 1 };
}

function makeCitizen(rng, racePool) {
  const race = pickRace(rng, racePool);
  const level = randomInt(rng, 1, 8);
  return `${makeName(rng)} (${race}) L${level} ${pick(rng, roles)}, wearing ${pick(rng, outfits)}, carrying ${pick(rng, keepsakes)}`;
}

function formatStoreItem(item, options, rng) {
  const metadata = options.oldway === 1 ? weaponMetaMagestykc[item] : weaponMetaClassic[item];
  const parts = [item];
  if (metadata && options.showcase1) parts.push(`[${metadata.class}]`);
  if (metadata && options.showcase2) parts.push(`{${metadata.stat}}`);
  if (options.shelf) parts.push(`x${randomInt(rng, 1, 6)}`);
  return parts.join(' ');
}

function makeInstitutionPool(rng, count, buildings) {
  const available = Array.from({ length: buildings }, (_, idx) => idx + 1);
  const taken = [];
  for (let idx = 0; idx < Math.min(count, available.length); idx += 1) {
    const pickIndex = randomInt(rng, 0, available.length - 1);
    taken.push(available.splice(pickIndex, 1)[0]);
  }
  return taken;
}

function renderSection(titleText, entries, builder) {
  if (!entries.length) return;
  const title = document.createElement('h2');
  title.className = 'h6 mt-3';
  title.textContent = titleText;
  output.appendChild(title);
  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'ttown-card';
    card.innerHTML = builder(entry);
    output.appendChild(card);
  });
}

function renderResult(result) {
  output.innerHTML = '';
  const settlement = result.payload.settlement;
  if (!settlement) {
    output.innerHTML = '<em>No settlement generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'ttown-header';
  header.textContent = `${settlement.name} · ${settlement.type} · ${settlement.buildings} building(s)${settlement.seaside ? ' · Sea Side' : ''}`;
  output.appendChild(header);

  renderSection('Rulers', settlement.rulers, (entry) => `<div class="ttown-title">${entry.title}</div><div>${entry.primary}</div><div>${entry.secondary}</div><div class="ttown-sub">Royal Guards: ${entry.guards}</div>`);

  if (settlement.citizens.summary) {
    const summary = document.createElement('div');
    summary.className = 'ttown-sub mt-2';
    summary.textContent = settlement.citizens.summary;
    output.appendChild(summary);
  }

  renderSection('Citizens', settlement.citizens.entries, (entry) => `<div class="ttown-title">Dwelling ${entry.building}</div><div>${entry.profile}</div>`);
  renderSection('Merchants', settlement.stores, (entry) => `<div class="ttown-title">#${entry.building} ${entry.type}</div><div><strong>Owner:</strong> ${entry.owner}</div><div>${entry.stock}</div>`);
  renderSection('Guilds', settlement.guilds, (entry) => `<div class="ttown-title">#${entry.building} ${entry.name}</div><div>${entry.master}</div>`);
  renderSection('Guards', settlement.police, (entry) => `<div class="ttown-title">#${entry.building} ${entry.post}</div><div>${entry.captain}</div><div class="ttown-sub">Watch Size: ${entry.size}</div>`);
  renderSection('Churches', settlement.churches, (entry) => `<div class="ttown-title">#${entry.building} ${entry.name}</div><div>${entry.priest}</div>`);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadTtownPools();

  const mapWide = Math.max(1, Math.min(10, Number(formData.get('mapWide') || 1)));
  const mapHigh = Math.max(1, Math.min(10, Number(formData.get('mapHigh') || 1)));
  const mapRooms = Math.max(0, Math.min(1000, Number(formData.get('mapRooms') || 0)));
  const buildings = mapRooms > 0 ? mapRooms : mapWide * mapHigh;
  const built = formData.get('built')?.toString() || 'City';
  const type = settlementLabel(built, buildings);
  const settlementName = formData.get('name')?.toString().trim() || type;
  const racePool = formData.getAll('race').map((value) => value.toString());

  const options = {
    populate: formData.get('populate') === '1',
    rulers: formData.get('rulers') === '1',
    stores: formData.get('stores') === '1',
    guilds: formData.get('guilds') === '1',
    police: formData.get('police') === '1',
    church: formData.get('church') === '1',
    water: formData.get('water') === '1',
    stock: Math.max(5, Math.min(100, Number(formData.get('stock') || 70))),
    shelf: formData.get('shelf') === '1',
    oldway: Number(formData.get('oldway') || 0),
    showcase1: formData.get('showcase1') === '1',
    showcase2: formData.get('showcase2') === '1'
  };

  const { kingdom } = realmScale(mapWide, mapHigh, mapRooms);
  const tier = rulerTier(kingdom);
  const rulerSex = randomInt(rng, 1, 2) === 1;

  const rulers = options.rulers
    ? [{
      title: rulerSex ? tier.male : tier.female,
      primary: `${rulerSex ? tier.male : tier.female}: ${makeCitizen(rng, racePool)}`,
      secondary: `${rulerSex ? tier.female : tier.male}: ${makeCitizen(rng, racePool)}`,
      guards: randomInt(rng, tier.guardsMin, tier.guardsMax)
    }]
    : [];

  const citizens = [];
  if (options.populate) {
    for (let building = 1; building <= buildings; building += 1) {
      citizens.push({ building, profile: makeCitizen(rng, racePool) });
    }
  }

  const institutionBase = Math.max(1, Math.ceil(buildings / 10));

  const stores = options.stores
    ? makeInstitutionPool(rng, institutionBase + 1, buildings).map((building) => {
      const template = pick(rng, storeTemplates);
      const chosen = template.stock.filter(() => randomInt(rng, 1, 100) <= options.stock);
      const finalItems = chosen.length ? chosen : [pick(rng, template.stock)];
      const formatted = finalItems.map((item) => formatStoreItem(item, options, rng)).join(', ');
      return {
        building,
        type: template.type,
        owner: makeCitizen(rng, racePool),
        stock: formatted
      };
    })
    : [];

  const guilds = options.guilds
    ? makeInstitutionPool(rng, Math.max(1, Math.ceil(buildings / 16)), buildings).map((building) => ({
      building,
      name: pick(rng, guildNames),
      master: `Guildmaster: ${makeCitizen(rng, racePool)}`
    }))
    : [];

  const police = options.police
    ? makeInstitutionPool(rng, Math.max(1, Math.ceil(buildings / 14)), buildings).map((building) => ({
      building,
      post: pick(rng, ['Guard House', 'Watch Post', 'Barracks']),
      captain: `Captain: ${makeCitizen(rng, racePool)}`,
      size: randomInt(rng, 4, 24)
    }))
    : [];

  const churches = options.church
    ? makeInstitutionPool(rng, Math.max(1, Math.ceil(buildings / 18)), buildings).map((building) => ({
      building,
      name: pick(rng, churchNames),
      priest: `High Priest: ${makeCitizen(rng, racePool)}`
    }))
    : [];

  const citizenRenderCap = 250;

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      built,
      mapWide,
      mapHigh,
      mapRooms,
      options,
      racePool: racePool.length ? racePool : allRaces
    },
    payload: {
      settlement: {
        name: settlementName,
        type,
        buildings,
        seaside: options.water,
        rulers,
        citizens: {
          total: citizens.length,
          summary: citizens.length > citizenRenderCap
            ? `Showing first ${citizenRenderCap} of ${citizens.length} populated dwellings.`
            : citizens.length
              ? `Showing ${citizens.length} populated dwellings.`
              : '',
          entries: citizens.slice(0, citizenRenderCap)
        },
        stores,
        guilds,
        police,
        churches
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
