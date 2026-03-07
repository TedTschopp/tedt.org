const toolId = 'ftown';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const defaultRaces = [
  'Human', 'Brownie', 'Centaur', 'Cyclops', 'Daklafar', 'Dwarf', 'Dwurman', 'Elf', 'Fairy', 'Falcoran',
  'Fruglum', 'Gnome', 'Goblin', 'Gremlin', 'Greyling', 'Hobgoblin', 'Hobbit', 'Imp', 'Kobold', 'Leprechaun',
  'Mantaran', 'Minotaur', 'Neptar', 'Ogre', 'Orc', 'Pixie', 'Rattanu', 'Satyr', 'Sauriman', 'Slitheran',
  'Sprite', 'Suvart', 'Tigran', 'Troll', 'Wulfan'
];

const fallbackNames = ['Alder', 'Bryn', 'Corvin', 'Dain', 'Elora', 'Fenn', 'Garrick', 'Helm', 'Iris', 'Joran', 'Kael', 'Lina', 'Marek', 'Nim', 'Orla', 'Perrin', 'Quin', 'Rhea', 'Soren', 'Talia'];
const fallbackSurnames = ['Ashwood', 'Briar', 'Cinder', 'Dawn', 'Elder', 'Frost', 'Grove', 'Hollow', 'Iron', 'Jade', 'Kettle', 'Lark', 'Moon', 'North', 'Oak', 'Pine', 'Quick', 'Reed', 'Stone', 'Thorn'];
const professions = ['farmer', 'smith', 'fletcher', 'scribe', 'guard', 'baker', 'hunter', 'innkeeper', 'weaver', 'herbalist'];
const items = ['coin pouch', 'dagger', 'canteen', 'small charm', 'trade token', 'map scrap'];

const fallbackShops = ['General Merchant', 'Armorer', 'Inn', 'Stable', 'Tailor', 'Alchemist', 'Provisioner'];
const guilds = ['Masons Guild', 'Merchants Guild', 'Scribes Guild', 'Hunters Guild'];
const churches = ['Temple of Light', 'Shrine of Tides', 'Chapel of Stones', 'Sanctuary of Dawn'];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    settlement: null
  }
};

let names = fallbackNames;
let surnames = fallbackSurnames;
let shops = fallbackShops;
let dynamicShopStock = ['rope', 'rations', 'torches', 'arrow bundles', 'healing herbs', 'cloth bolts'];

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
  if (state === 0) state = 31415926;
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

function gameToStoreCodes(game) {
  if (game === 'AD&D') return ['AD'];
  if (game === 'OSRIC') return ['OSRIC'];
  return [];
}

function gameToMonsterCode(game) {
  if (game === 'AD&D') return 'AD';
  if (game === 'OSRIC') return 'OSRIC';
  return 'ALL';
}

function resetRuntimePools() {
  names = fallbackNames;
  surnames = fallbackSurnames;
  shops = fallbackShops;
  dynamicShopStock = ['rope', 'rations', 'torches', 'arrow bundles', 'healing herbs', 'cloth bolts'];
}

async function loadFtownPools(game) {
  resetRuntimePools();

  if (!window.WizardawnData) {
    return;
  }

  try {
    if (window.WizardawnData.getStoreItemsByStore) {
      const storeMap = {
        'General Merchant': ['SUPPLIES', 'PROVISIONER'],
        Armorer: ['MILITARY', 'BLACKSMITH'],
        Inn: ['INN', 'TAVERN', 'BAR'],
        Stable: ['STABLE', 'STABLES'],
        Tailor: ['TAILOR', 'LEATHERWORKER'],
        Alchemist: ['ALCHEMIST', 'MEDICAL'],
        Provisioner: ['PROVISIONER', 'SUPPLIES']
      };

      const storeCodes = unique(Object.values(storeMap).flat());
      const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game), storeCodes);
      if (Array.isArray(rows) && rows.length) {
        const stockTerms = unique(rows.map((row) => normalizeItem(row.item))).slice(0, 120);
        if (stockTerms.length) {
          dynamicShopStock = unique([...stockTerms, ...dynamicShopStock]).slice(0, 120);
        }

        const availableShops = Object.entries(storeMap)
          .filter(([, codes]) => rows.some((row) => codes.includes(String(row.storeCode || '').toUpperCase())))
          .map(([shop]) => shop);

        if (availableShops.length) {
          shops = unique([...availableShops, ...fallbackShops]);
        }
      }
    }

    if (window.WizardawnData.getMonstersForGame) {
      const monsters = await window.WizardawnData.getMonstersForGame(gameToMonsterCode(game));
      if (Array.isArray(monsters) && monsters.length) {
        const firstPool = [];
        const lastPool = [];
        monsters.slice(0, 1200).forEach((row) => {
          const cleaned = normalizeItem(row.name);
          if (!cleaned) return;
          const tokens = cleaned.split(' ').filter(Boolean);
          if (!tokens.length) return;
          firstPool.push(titleize(tokens[0]));
          if (tokens.length > 1) {
            lastPool.push(titleize(tokens[tokens.length - 1]));
          }
        });
        names = unique([...fallbackNames, ...firstPool]).slice(0, 120);
        surnames = unique([...fallbackSurnames, ...lastPool]).slice(0, 120);
      }
    }
  } catch (error) {
    console.warn('Unable to load ftown runtime pools from shared data:', error);
    resetRuntimePools();
  }
}

function settlementType(built, buildings) {
  if (built === 'Keep') return 'Keep';
  if (built === 'Village') return 'Village';
  if (buildings >= 40) return 'City';
  if (buildings >= 20) return 'Town';
  return 'Hamlet';
}

function parseRaces(value) {
  const parsed = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  return parsed.length ? parsed : defaultRaces;
}

function makeCitizen(rng, racePool) {
  return `${pick(rng, names)} ${pick(rng, surnames)} (${pick(rng, racePool)}) ${pick(rng, professions)}, carrying ${pick(rng, items)}`;
}

function renderBlock(title, entries) {
  if (!entries.length) return;
  const heading = document.createElement('h2');
  heading.className = 'h6 mt-3';
  heading.textContent = title;
  output.appendChild(heading);
  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'ftown-card';
    card.innerHTML = `<div class="ftown-title">${entry.title}</div><div>${entry.body}</div>`;
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
  header.className = 'ftown-header';
  header.textContent = `${settlement.name} · ${settlement.type} · ${settlement.buildings} building(s)${settlement.seaside ? ' · Sea Side' : ''}`;
  output.appendChild(header);

  renderBlock('Rulers', settlement.rulers);
  renderBlock('Citizens', settlement.citizens);
  renderBlock('Merchants', settlement.stores);
  renderBlock('Guilds', settlement.guilds);
  renderBlock('Guards', settlement.police);
  renderBlock('Churches', settlement.churches);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Fantasy';
  await loadFtownPools(game);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const mapWide = Math.max(1, Math.min(10, Number(formData.get('mapWide') || 1)));
  const mapHigh = Math.max(1, Math.min(10, Number(formData.get('mapHigh') || 1)));
  const mapRooms = Math.max(0, Math.min(1000, Number(formData.get('mapRooms') || 0)));
  const buildings = mapRooms > 0 ? mapRooms : mapWide * mapHigh;
  const built = formData.get('built')?.toString() || 'City';
  const type = settlementType(built, buildings);
  const racePool = parseRaces(formData.get('raceList')?.toString() || '');

  const options = {
    populate: formData.get('populate') === '1',
    rulers: formData.get('rulers') === '1',
    stores: formData.get('stores') === '1',
    guilds: formData.get('guilds') === '1',
    police: formData.get('police') === '1',
    church: formData.get('church') === '1',
    water: formData.get('water') === '1',
    stock: Math.max(5, Math.min(100, Number(formData.get('stock') || 70))),
    shelf: formData.get('shelf') === '1'
  };

  const citizens = options.populate
    ? Array.from({ length: buildings }, (_, idx) => ({ title: `Dwelling ${idx + 1}`, body: makeCitizen(rng, racePool) }))
    : [];

  const rulers = options.rulers
    ? [{ title: 'Local Ruler', body: `${pick(rng, ['Baron', 'Count', 'Duke', 'Prince', 'Lord'])} ${makeCitizen(rng, racePool)}` }]
    : [];

  const stores = options.stores
    ? Array.from({ length: Math.max(1, Math.ceil(buildings / 8)) }, (_, idx) => {
      const store = pick(rng, shops);
      const stockCount = Math.max(1, Math.floor((options.stock / 100) * 6));
      const stocked = Array.from({ length: stockCount }, () => pick(rng, dynamicShopStock));
      return {
        title: `#${idx + 1} ${store}`,
        body: `${makeCitizen(rng, racePool)}. Stock: ${options.shelf ? stocked.map((item) => `${item} [${randomInt(rng, 1, 5)}]`).join(', ') : stocked.join(', ')}`
      };
    })
    : [];

  const guildList = options.guilds
    ? Array.from({ length: Math.max(1, Math.ceil(buildings / 15)) }, () => ({ title: pick(rng, guilds), body: `${makeCitizen(rng, racePool)} oversees contracts and apprentices.` }))
    : [];

  const guardList = options.police
    ? Array.from({ length: Math.max(1, Math.ceil(buildings / 12)) }, () => ({ title: 'Guard Captain', body: `${makeCitizen(rng, racePool)} commands the watch patrol.` }))
    : [];

  const churchList = options.church
    ? Array.from({ length: Math.max(1, Math.ceil(buildings / 20)) }, () => ({ title: pick(rng, churches), body: `${makeCitizen(rng, racePool)} tends rites and alms.` }))
    : [];

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
      racePool
    },
    payload: {
      settlement: {
        name: formData.get('name')?.toString().trim() || type,
        type,
        buildings,
        seaside: options.water,
        rulers,
        citizens,
        stores,
        guilds: guildList,
        police: guardList,
        churches: churchList
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
