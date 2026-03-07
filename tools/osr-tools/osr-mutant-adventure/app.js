const toolId = 'uruins';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const enemyTable = {
  'Mutant Future': ['raider gang', 'feral mutant', 'rad-hound pack', 'scrap cultists', 'wasteland stalker', 'mutant beetle swarm'],
  'Gamma World': ['mutated troopers', 'glow wolves', 'android scouts', 'waste nomads', 'biotech hunters', 'irradiated lurkers'],
  'Metamorphosis Alpha': ['cargo deck beast', 'rogue maintenance robot', 'mutant vine cluster', 'deck raiders', 'air-duct predator', 'security drone'],
  'Broken Urthe': ['xormite scavengers', 'wastes reavers', 'warped fauna', 'machine ghosts', 'irradiated patrol', 'ashland marauders']
};

const trapTable = ['tripwire flechettes', 'pressure vent toxin', 'collapsing catwalk', 'electrified hatch', 'acid sprayer', 'sleep-gas nozzle'];
const contentTable = ['collapsed furniture', 'old terminals', 'rusted lockers', 'mutated nests', 'forgotten supplies', 'flickering machinery'];
const lootTable = ['ammo cache', 'med-kit', 'tool kit', 'energy cell', 'valuable scrap', 'sealed ration crate'];
const techItems = ['plasma sidearm', 'targeting visor', 'portable scanner', 'micro reactor', 'repair nanites', 'vault keycard'];
const atmospheres = ['caustic mist', 'hallucinogenic spores', 'low oxygen', 'frozen vapor', 'high radiation', 'electrostatic haze'];

const fallbackEnemyTable = {
  'Mutant Future': [...enemyTable['Mutant Future']],
  'Gamma World': [...enemyTable['Gamma World']],
  'Metamorphosis Alpha': [...enemyTable['Metamorphosis Alpha']],
  'Broken Urthe': [...enemyTable['Broken Urthe']]
};
const fallbackContentTable = [...contentTable];
const fallbackLootTable = [...lootTable];
const fallbackTechItems = [...techItems];

let runtimeEnemyTable = {
  'Mutant Future': [...fallbackEnemyTable['Mutant Future']],
  'Gamma World': [...fallbackEnemyTable['Gamma World']],
  'Metamorphosis Alpha': [...fallbackEnemyTable['Metamorphosis Alpha']],
  'Broken Urthe': [...fallbackEnemyTable['Broken Urthe']]
};
let runtimeContentTable = [...fallbackContentTable];
let runtimeLootTable = [...fallbackLootTable];
let runtimeTechItems = [...fallbackTechItems];
let runtimeGeomorphs = [];

let runtimePoolsReady = false;
let runtimePoolsLoading = null;

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => normalizeText(value)).filter(Boolean))];
}

function resetRuntimePools() {
  runtimeEnemyTable = {
    'Mutant Future': [...fallbackEnemyTable['Mutant Future']],
    'Gamma World': [...fallbackEnemyTable['Gamma World']],
    'Metamorphosis Alpha': [...fallbackEnemyTable['Metamorphosis Alpha']],
    'Broken Urthe': [...fallbackEnemyTable['Broken Urthe']]
  };
  runtimeContentTable = [...fallbackContentTable];
  runtimeLootTable = [...fallbackLootTable];
  runtimeTechItems = [...fallbackTechItems];
  runtimeGeomorphs = [];
}

function exodusTerrainKeys(terrain, rng) {
  const value = String(terrain || '').toLowerCase();
  if (/desert|waste|plain/.test(value)) return ['scifi-ma-desert'];
  if (/forest|jungle|swamp|hill|mountain|snow/.test(value)) return ['scifi-ma-woods'];
  return rng && rng() < 0.5 ? ['scifi-ma-desert'] : ['scifi-ma-woods'];
}

function terrainKeysForMapType(mapType, terrain, rng) {
  if (mapType === 'Building') return ['scifi-building'];
  if (mapType === 'Spaceship') return ['scifi-ship'];
  if (mapType === 'Ruined City') return ['ruins'];
  if (mapType === 'Exodus Spaceship') return exodusTerrainKeys(terrain, rng);
  return ['scifi-building'];
}

function monsterCodeForGame(gameName) {
  if (gameName === 'Mutant Future') return 'MF';
  if (gameName === 'Gamma World') return 'BU';
  if (gameName === 'Metamorphosis Alpha') return 'BU';
  if (gameName === 'Broken Urthe') return 'BU';
  return 'MF';
}

function storeCodesForGame(gameName) {
  if (gameName === 'Mutant Future') return ['MF'];
  if (gameName === 'Gamma World') return ['MF', 'BU'];
  if (gameName === 'Metamorphosis Alpha') return ['BU'];
  if (gameName === 'Broken Urthe') return ['BU'];
  return ['MF'];
}

function isTechLabel(label) {
  return /plasma|laser|energy|reactor|scanner|target|drone|robot|battery|power|cell|nano|circuit|electro|rifle|pistol|phaser|blaster/i.test(label);
}

async function loadRuntimePools() {
  if (runtimePoolsReady) {
    return;
  }
  if (runtimePoolsLoading) {
    await runtimePoolsLoading;
    return;
  }

  runtimePoolsLoading = (async () => {
    resetRuntimePools();
    if (!window.WizardawnData) {
      runtimePoolsReady = true;
      return;
    }

    try {
      const games = ['Mutant Future', 'Gamma World', 'Metamorphosis Alpha', 'Broken Urthe'];

      const enemyLoads = games.map(async (gameName) => {
        const monsters = await window.WizardawnData.getMonstersForGame(monsterCodeForGame(gameName));
        const names = uniqueStrings((monsters || []).map((row) => row.name));
        if (names.length) {
          runtimeEnemyTable[gameName] = uniqueStrings([...runtimeEnemyTable[gameName], ...names]);
        }
      });

      const storeLoads = games.map(async (gameName) => {
        const items = await window.WizardawnData.getStoreItemsForGames(storeCodesForGame(gameName));
        return items || [];
      });

      const [_, storeResults, geomorphs] = await Promise.all([
        Promise.all(enemyLoads),
        Promise.all(storeLoads),
        window.WizardawnData.getGeomorphs()
      ]);

      const allStoreItems = storeResults.flat().map((row) => normalizeText(row.item)).filter((item) => item.length >= 4 && item.length <= 48);
      const tech = uniqueStrings(allStoreItems.filter((item) => isTechLabel(item)));
      const mundane = uniqueStrings(allStoreItems.filter((item) => !isTechLabel(item)));

      if (mundane.length) {
        runtimeLootTable = uniqueStrings([...runtimeLootTable, ...mundane]);
      }
      if (tech.length) {
        runtimeTechItems = uniqueStrings([...runtimeTechItems, ...tech]);
      }

      const geoTerms = uniqueStrings((geomorphs || []).flatMap((row) => [row.more, row.delve, row.spot]));
      if (geoTerms.length) {
        runtimeContentTable = uniqueStrings([...runtimeContentTable, ...geoTerms]);
      }
      runtimeGeomorphs = Array.isArray(geomorphs) ? geomorphs : [];
    } catch (error) {
      console.warn('uruins runtime enrichment failed; using fallback pools', error);
      resetRuntimePools();
    }

    runtimePoolsReady = true;
  })();

  try {
    await runtimePoolsLoading;
  } finally {
    runtimePoolsLoading = null;
  }
}

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    adventure: null
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
  if (state === 0) state = 91919191;
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

function boundedNumber(formData, key, min, max, fallback) {
  return Math.max(min, Math.min(max, Number(formData.get(key) || fallback)));
}

function rollCount(rng, min, max, lowBias) {
  const minN = Math.max(0, min);
  const maxN = Math.max(minN, max);
  if (minN === maxN) return minN;
  const high = randomInt(rng, minN, maxN);
  const low = randomInt(rng, minN, maxN);
  return randomInt(rng, 1, 100) <= lowBias ? Math.min(high, low) : Math.max(high, low);
}

function roomHas(rng, chance) {
  return randomInt(rng, 1, 100) <= chance;
}

function roomLabel(mapType, roomNumber) {
  if (mapType === 'Ruined City') return `Building ${roomNumber}`;
  if (mapType === 'Spaceship' || mapType === 'Exodus Spaceship') return `Deck Section ${roomNumber}`;
  return `Room ${roomNumber}`;
}

function rollEnemies(rng, config) {
  const selected = [];
  const table = runtimeEnemyTable[config.game] || runtimeEnemyTable['Mutant Future'];

  if (config.enemyOne && roomHas(rng, config.enemyOneChance)) selected.push(config.enemyOne);
  if (config.enemyTwo && roomHas(rng, config.enemyTwoChance)) selected.push(config.enemyTwo);

  const count = rollCount(rng, config.enemyMin, config.enemyMax, config.enemyLow);
  for (let idx = selected.length; idx < count; idx += 1) {
    selected.push(pick(rng, table));
  }

  return selected.map((entry) => (config.mutantsOnly ? `Mutant ${entry}` : entry));
}

function rollList(rng, shouldRoll, chance, min, max, low, table) {
  if (!shouldRoll || !roomHas(rng, chance)) return [];
  const count = rollCount(rng, min, max, low);
  return Array.from({ length: count }, () => pick(rng, table));
}

function renderRoom(room) {
  const card = document.createElement('article');
  card.className = 'uruins-card';
  const sections = [];

  if (room.atmosphere) sections.push(`<div class="uruins-sub"><strong>Atmosphere:</strong> ${room.atmosphere}</div>`);
  if (room.enemies.length) sections.push(`<div><strong>Enemies:</strong> ${room.enemies.join(', ')}</div>`);
  if (room.traps.length) sections.push(`<div><strong>Traps:</strong> ${room.traps.join(', ')}</div>`);
  if (room.contents.length) sections.push(`<div><strong>Contents:</strong> ${room.contents.join(', ')}</div>`);
  if (room.loot.length) sections.push(`<div><strong>Loot:</strong> ${room.loot.join(', ')}${room.lootTrapped ? ' (TRAPPED)' : ''}</div>`);
  if (room.cash > 0) sections.push(`<div class="uruins-sub"><strong>Cash:</strong> ${room.cash} ${room.currency}</div>`);
  if (room.robots.length) sections.push(`<div><strong>Robots:</strong> ${room.robots.join(', ')}</div>`);
  if (room.vehicles.length) sections.push(`<div><strong>Vehicles:</strong> ${room.vehicles.join(', ')}</div>`);
  if (!sections.length) sections.push('<div class="uruins-sub">No unusual features detected.</div>');

  card.innerHTML = `<div class="uruins-title">${room.label}</div>${sections.join('')}`;
  return card;
}

function renderResult(result) {
  output.innerHTML = '';
  const adventure = result.payload.adventure;
  if (!adventure) {
    output.innerHTML = '<em>No adventure generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'uruins-header';
  header.textContent = `${adventure.name} · ${adventure.game} · ${adventure.mapType} · ${adventure.rooms.length} area(s)`;
  output.appendChild(header);

  if (adventure.summary.length) {
    const summary = document.createElement('ul');
    summary.className = 'uruins-summary';
    adventure.summary.forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      summary.appendChild(li);
    });
    output.appendChild(summary);
  }

  if (adventure.mapPreview && window.WizardawnMap) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(adventure.mapPreview, {
      title: 'Generated Map',
      assetBase: '/tools/osr-tools/osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  adventure.rooms.forEach((room) => output.appendChild(renderRoom(room)));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadRuntimePools();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const game = formData.get('game')?.toString() || 'Mutant Future';
  const mapType = formData.get('mapType')?.toString() || 'Building';
  const mapWide = boundedNumber(formData, 'mapWide', 1, 10, 4);
  const mapHigh = boundedNumber(formData, 'mapHigh', 1, 10, 4);
  const mapRooms = boundedNumber(formData, 'mapRooms', 0, 1000, 0);
  const roomCount = mapRooms > 0 ? mapRooms : mapWide * mapHigh;

  const config = {
    game,
    mapType,
    name: formData.get('name')?.toString().trim() || mapType,
    currency: formData.get('currency')?.toString().trim() || 'gold',
    level: boundedNumber(formData, 'level', 0, 100, 0),
    characters: boundedNumber(formData, 'characters', 0, 20, 0),
    terrain: formData.get('terrain')?.toString().trim() || 'Random',
    mapWide,
    mapHigh,
    mapRooms,
    enemyOne: formData.get('enemyOne')?.toString().trim() || '',
    enemyOneChance: boundedNumber(formData, 'enemyOneChance', 0, 100, 0),
    enemyTwo: formData.get('enemyTwo')?.toString().trim() || '',
    enemyTwoChance: boundedNumber(formData, 'enemyTwoChance', 0, 100, 0),
    outsideVisitors: formData.get('outsideVisitors') === '1',
    mutantsOnly: formData.get('mutantsOnly') === '1',
    atmo: boundedNumber(formData, 'atmo', 0, 100, 0),
    enemyChance: boundedNumber(formData, 'enemyChance', 0, 100, 35),
    enemyMin: boundedNumber(formData, 'enemyMin', 1, 25, 1),
    enemyMax: boundedNumber(formData, 'enemyMax', 1, 25, 5),
    enemyLow: boundedNumber(formData, 'enemyLow', 0, 100, 0),
    trapChance: boundedNumber(formData, 'trapChance', 0, 100, 10),
    trapMin: boundedNumber(formData, 'trapMin', 1, 25, 1),
    trapMax: boundedNumber(formData, 'trapMax', 1, 25, 3),
    trapLow: boundedNumber(formData, 'trapLow', 0, 100, 0),
    contentChance: boundedNumber(formData, 'contentChance', 0, 100, 70),
    contentMin: boundedNumber(formData, 'contentMin', 1, 25, 1),
    contentMax: boundedNumber(formData, 'contentMax', 1, 25, 10),
    contentLow: boundedNumber(formData, 'contentLow', 0, 100, 5),
    lootChance: boundedNumber(formData, 'lootChance', 0, 100, 20),
    lootMin: boundedNumber(formData, 'lootMin', 1, 25, 1),
    lootMax: boundedNumber(formData, 'lootMax', 1, 25, 5),
    lootLow: boundedNumber(formData, 'lootLow', 0, 100, 20),
    lootRigged: boundedNumber(formData, 'lootRigged', 0, 100, 30),
    lootAdjust: boundedNumber(formData, 'lootAdjust', 0, 100, 2),
    cashCut: boundedNumber(formData, 'cashCut', 1, 1000, 100),
    techChance: boundedNumber(formData, 'techItems', 0, 100, 100),
    robotChance: boundedNumber(formData, 'derelictRobots', 0, 100, 2),
    vehicleChance: boundedNumber(formData, 'derelictVehicles', 0, 100, 2)
  };

  const mapPreview = window.WizardawnMap
    ? window.WizardawnMap.buildGeomorphGridPreview({
        random: rng,
        geomorphs: runtimeGeomorphs,
        terrainKeys: terrainKeysForMapType(mapType, config.terrain, rng),
        mapWide: config.mapWide,
        mapHigh: config.mapHigh,
        title: `${mapType} Map`
      })
    : null;

  const rooms = [];
  for (let roomNo = 1; roomNo <= roomCount; roomNo += 1) {
    const enemies = roomHas(rng, config.enemyChance) ? rollEnemies(rng, config) : [];
    const traps = rollList(rng, true, config.trapChance, config.trapMin, config.trapMax, config.trapLow, trapTable);
    const contents = rollList(rng, true, config.contentChance, config.contentMin, config.contentMax, config.contentLow, runtimeContentTable);

    const baseLoot = rollList(rng, true, config.lootChance, config.lootMin, config.lootMax, config.lootLow, runtimeLootTable);
    const techLoot = roomHas(rng, config.techChance)
      ? Array.from({ length: randomInt(rng, 0, 2) }, () => pick(rng, runtimeTechItems))
      : [];
    const loot = [...baseLoot, ...techLoot];
    const lootTrapped = loot.length > 0 && roomHas(rng, config.lootRigged);
    const cash = loot.length > 0 ? Math.floor((randomInt(rng, 5, 100) * config.cashCut) / 100) : 0;

    const robots = roomHas(rng, config.robotChance)
      ? Array.from({ length: randomInt(rng, 1, 2) }, () => pick(rng, ['maintenance drone', 'security bot', 'cargo robot']))
      : [];
    const vehicles = mapType === 'Ruined City' && roomHas(rng, config.vehicleChance)
      ? Array.from({ length: randomInt(rng, 1, 2) }, () => pick(rng, ['wrecked buggy', 'armored truck hulk', 'rusted bike']))
      : [];

    if (config.outsideVisitors && roomHas(rng, 10)) {
      enemies.push(`outside ${config.terrain.toLowerCase()} visitor`);
    }

    rooms.push({
      room: roomNo,
      label: roomLabel(mapType, roomNo),
      atmosphere: roomHas(rng, config.atmo) ? pick(rng, atmospheres) : null,
      enemies,
      traps,
      contents,
      loot,
      lootTrapped,
      cash,
      currency: config.currency,
      robots,
      vehicles
    });
  }

  const summary = [
    `Terrain: ${config.terrain}`,
    `Level: ${config.level || 'n/a'} · Characters: ${config.characters || 'n/a'}`,
    `${rooms.filter((room) => room.enemies.length).length} area(s) with enemies`,
    `${rooms.filter((room) => room.traps.length).length} area(s) with traps`,
    `${rooms.filter((room) => room.loot.length).length} area(s) with loot`
  ];

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      adventure: {
        name: config.name,
        game,
        mapType,
        summary,
        mapPreview,
        rooms
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
Adventure: ${lastResult.payload.adventure?.name || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
