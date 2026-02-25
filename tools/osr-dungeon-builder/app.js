const toolId = 'ultimate';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: null,
  payload: null
};

const ENCOUNTERS = ['Goblin warband', 'Skeleton phalanx', 'Cult adepts', 'Ogre guard', 'Gelatinous terror', 'Shadow stalkers'];
const TRAPS = ['Swinging blades', 'Poison needle lock', 'False floor pit', 'Runic discharge', 'Crushing walls'];
const LOOT = ['Coin cache', 'Gem satchel', 'Ancient blade', 'Potion bundle', 'Relic idol', 'Spell tome'];
const ROOM_FEATURES = ['Collapsed pillars', 'Flooded chamber', 'Sacrificial dais', 'Crumbling statues', 'Moss choked arch', 'Arcane graffiti'];
const ATMOSPHERES = ['Sulfur haze', 'Cold drafts', 'Thick spores', 'Whispering echoes', 'Faint chanting', 'Stable air'];

const FALLBACK_ENCOUNTERS = [...ENCOUNTERS];
const FALLBACK_LOOT = [...LOOT];
const FALLBACK_ROOM_FEATURES = [...ROOM_FEATURES];

let runtimeEncounters = [...FALLBACK_ENCOUNTERS];
let runtimeLoot = [...FALLBACK_LOOT];
let runtimeRoomFeatures = [...FALLBACK_ROOM_FEATURES];
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
  runtimeEncounters = [...FALLBACK_ENCOUNTERS];
  runtimeLoot = [...FALLBACK_LOOT];
  runtimeRoomFeatures = [...FALLBACK_ROOM_FEATURES];
  runtimeGeomorphs = [];
}

function terrainKeysForMapType(mapType) {
  if (mapType === 'Dungeon') return ['dungeon'];
  if (mapType === 'Cavernous') return ['cave'];
  return ['dungeon', 'cave'];
}

function monsterGameCodeForGame(gameName) {
  const game = String(gameName || '').trim();
  if (game === 'Labyrinth Lord') return 'LL';
  if (game === 'OSRIC') return 'OSRIC';
  if (game === 'AD&D') return 'AD';
  if (game === 'Swords & Wizardry') return 'SW';
  if (game === 'BFRPG') return 'BFRPG';
  if (game === 'Swords & Six-Siders') return 'SX';
  if (game === 'BD&D') return 'BX';
  if (game === 'Tunnels & Trolls 5th Edition') return 'TT';
  if (game === 'Tunnels & Trolls 7th Edition') return 'TT';
  if (game === 'Tunnels & Trolls Deluxe') return 'TT';
  return 'ALL';
}

function storeGameCodesForGame(gameName) {
  const game = String(gameName || '').trim();
  if (game === 'Labyrinth Lord') return ['LL'];
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Tunnels & Trolls 5th Edition') return ['TT'];
  if (game === 'Tunnels & Trolls 7th Edition') return ['TT'];
  if (game === 'Tunnels & Trolls Deluxe') return ['TT'];
  return [];
}

async function loadRuntimePools(config) {
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
      const gameCode = monsterGameCodeForGame(config.game);
      const storeCodes = storeGameCodesForGame(config.game);
      const [monsters, storeItems, geomorphs] = await Promise.all([
        window.WizardawnData.getMonstersForGame(gameCode, {
          includeFf: config.useFf,
          includeMm2: config.useMm2
        }),
        window.WizardawnData.getStoreItemsForGames(storeCodes),
        window.WizardawnData.getGeomorphs()
      ]);

      const encounterNames = uniqueStrings((monsters || []).map((row) => row.name));
      if (encounterNames.length) {
        runtimeEncounters = uniqueStrings([...runtimeEncounters, ...encounterNames]);
      }

      const lootItems = uniqueStrings((storeItems || []).map((row) => row.item).filter((item) => item.length >= 4 && item.length <= 48));
      if (lootItems.length) {
        runtimeLoot = uniqueStrings([...runtimeLoot, ...lootItems]);
      }

      const featureTerms = uniqueStrings((geomorphs || []).flatMap((row) => [row.more, row.delve, row.spot]));
      if (featureTerms.length) {
        runtimeRoomFeatures = uniqueStrings([...runtimeRoomFeatures, ...featureTerms]);
      }
      runtimeGeomorphs = Array.isArray(geomorphs) ? geomorphs : [];
    } catch (error) {
      console.warn('ultimate runtime pool enrichment failed; using fallback pools', error);
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

function createSeededRandom(seedValue) {
  const seedText = String(seedValue || '').trim() || String(Date.now());
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;

  for (let i = 0; i < seedText.length; i += 1) {
    const code = seedText.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ code, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ code, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ code, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ code, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  const state = [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];

  return () => {
    const t = (state[0] + state[1] + state[3]) | 0;
    state[3] = (state[3] + 1) | 0;
    state[0] = state[1] ^ (state[1] >>> 9);
    state[1] = (state[2] + (state[2] << 3)) | 0;
    state[2] = (state[2] << 21) | (state[2] >>> 11);
    state[2] = (state[2] + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function randomFrom(list, random) {
  return list[Math.floor(random() * list.length)];
}

function parseConfig(formData) {
  return {
    seed: formData.get('seed')?.toString().trim() || null,
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    areaName: formData.get('areaName')?.toString().trim() || '',
    mapType: formData.get('mapType')?.toString() || 'Cavernous Dungeon',
    level: Number(formData.get('level') || 3),
    characters: Number(formData.get('characters') || 4),
    mapWide: Number(formData.get('mapWide') || 4),
    mapHigh: Number(formData.get('mapHigh') || 4),
    startRoom: Number(formData.get('startRoom') || 1),
    terrain: formData.get('terrain')?.toString() || '',
    atmo: Number(formData.get('atmo') || 20),
    encChance: Number(formData.get('encChance') || 35),
    trapChance: Number(formData.get('trapChance') || 10),
    lootChance: Number(formData.get('lootChance') || 20),
    lootAdjust: Number(formData.get('lootAdjust') || 2),
    tileDyson: formData.get('tileDyson') === '1',
    tileRisus: formData.get('tileRisus') === '1',
    tileRorsch: formData.get('tileRorsch') === '1',
    tileStone: formData.get('tileStone') === '1',
    tileGlenn: formData.get('tileGlenn') === '1',
    tileStuart: formData.get('tileStuart') === '1',
    tileZero: formData.get('tileZero') === '1',
    separateMap: formData.get('separateMap') === '1',
    furnishRooms: formData.get('furnishRooms') === '1',
    manualMonsters: formData.get('manualMonsters') === '1',
    outsideVisitors: formData.get('outsideVisitors') === '1',
    undeadOnly: formData.get('undeadOnly') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    useAec: formData.get('useAec') === '1',
    useMom: formData.get('useMom') === '1',
    useFf: formData.get('useFf') === '1',
    useMm2: formData.get('useMm2') === '1',
    useUa: formData.get('useUa') === '1'
  };
}

function buildDungeon(config) {
  const seed = config.seed || `${Date.now()}-${Math.random()}`;
  const random = createSeededRandom(seed);
  const roomCount = Math.max(8, Math.round(config.mapWide * config.mapHigh * 0.8));

  const sourceTiles = [
    config.tileDyson ? 'Dyson' : null,
    config.tileRisus ? 'Risus' : null,
    config.tileRorsch ? 'Rorschachhamster' : null,
    config.tileStone ? 'Stonewerks' : null,
    config.tileGlenn ? 'Glenn Jupp' : null,
    config.tileStuart ? 'Stuart Robertson' : null,
    config.tileZero ? 'Infinite Zer0' : null
  ].filter(Boolean);

  const rooms = [];
  for (let i = 0; i < roomCount; i += 1) {
    const roomNo = config.startRoom + i;
    const encounterRoll = random() * 100;
    const trapRoll = random() * 100;
    const lootRoll = random() * 100;
    const unusualAtmo = random() * 100 < config.atmo;

    let encounterName = encounterRoll < config.encChance ? randomFrom(runtimeEncounters, random) : null;
    if (config.undeadOnly && encounterName) encounterName = `Undead ${encounterName}`;
    if (config.outsideVisitors && encounterName && random() < 0.2) encounterName = `${encounterName} (outside)`;

    rooms.push({
      roomNo,
      tileSource: sourceTiles.length ? randomFrom(sourceTiles, random) : 'Mixed',
      feature: config.furnishRooms ? randomFrom(runtimeRoomFeatures, random) : null,
      atmosphere: unusualAtmo ? randomFrom(ATMOSPHERES.slice(0, -1), random) : 'Stable air',
      encounter: encounterName
        ? {
            name: encounterName,
            amount: Math.max(1, Math.round((config.characters * (0.5 + random())) / Math.max(1, config.level / 3))),
            note: config.showDescriptions ? `Scaled near level ${config.level}` : null
          }
        : null,
      trap: trapRoll < config.trapChance ? randomFrom(TRAPS, random) : null,
      loot: lootRoll < Math.min(100, config.lootChance + config.level * config.lootAdjust)
        ? { item: randomFrom(runtimeLoot, random), value: Math.round((15 + random() * 95) * config.level) }
        : null
    });
  }

  const mapPreview = window.WizardawnMap
    ? window.WizardawnMap.buildGeomorphGridPreview({
        random,
        geomorphs: runtimeGeomorphs,
        terrainKeys: terrainKeysForMapType(config.mapType),
        mapWide: config.mapWide,
        mapHigh: config.mapHigh,
        title: `${config.mapType} Map`
      })
    : null;

  return {
    seed,
    name: config.areaName || `${config.mapType} Complex`,
    roomCount,
    mapType: config.mapType,
    dimensions: `${config.mapWide} × ${config.mapHigh}`,
    sourceTiles,
    mapPreview,
    rooms,
    options: [
      config.manualMonsters ? 'Manual of Monsters enabled' : null,
      config.separateMap ? 'Separate map output' : null,
      config.useAec ? 'AEC' : null,
      config.useMom ? 'MoM' : null,
      config.useFf ? 'FF' : null,
      config.useMm2 ? 'MMII' : null,
      config.useUa ? 'UA' : null
    ].filter(Boolean)
  };
}

function renderResult(result) {
  output.innerHTML = '';
  if (!result.payload) {
    output.innerHTML = '<em>No dungeon generated.</em>';
    return;
  }

  const summary = document.createElement('section');
  summary.className = 'card mb-3';
  summary.innerHTML = `
    <div class="card-body py-2 px-3 ultimate-meta">
      <div><strong>Name:</strong> ${result.payload.name}</div>
      <div><strong>Game:</strong> ${result.config.game}</div>
      <div><strong>Type:</strong> ${result.payload.mapType} · <strong>Size:</strong> ${result.payload.dimensions}</div>
      <div><strong>Rooms:</strong> ${result.payload.roomCount} · <strong>Terrain:</strong> ${result.config.terrain || 'None'}</div>
      <div><strong>Seed:</strong> ${result.seed}</div>
    </div>
  `;
  output.appendChild(summary);

  if (result.payload.mapPreview && window.WizardawnMap) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(result.payload.mapPreview, {
      title: 'Generated Map',
      assetBase: '/tools/osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  const roomCard = document.createElement('section');
  roomCard.className = 'card mb-3';
  roomCard.innerHTML = '<div class="card-header py-2">Dungeon Rooms</div>';
  const body = document.createElement('div');
  body.className = 'card-body p-0';
  const table = document.createElement('table');
  table.className = 'table table-sm mb-0 ultimate-table';
  table.innerHTML = '<thead><tr><th>Room</th><th>Tile</th><th>Feature</th><th>Encounter</th><th>Trap</th><th>Loot</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');

  result.payload.rooms.forEach((room) => {
    const tr = document.createElement('tr');
    const encounter = room.encounter ? `${room.encounter.name} ×${room.encounter.amount}` : '—';
    const trap = room.trap || '—';
    const loot = room.loot ? `${room.loot.item} (${room.loot.value})` : '—';
    tr.innerHTML = `<td>${room.roomNo}</td><td>${room.tileSource}</td><td>${room.feature || '—'}</td><td>${encounter}</td><td>${trap}</td><td>${loot}</td>`;
    tbody.appendChild(tr);
  });
  body.appendChild(table);
  roomCard.appendChild(body);
  output.appendChild(roomCard);

  if (result.payload.options.length) {
    const options = document.createElement('section');
    options.className = 'card';
    options.innerHTML = `<div class="card-header py-2">Applied Options</div><div class="card-body py-2 px-3">${result.payload.options.join(' · ')}</div>`;
    output.appendChild(options);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const config = parseConfig(new FormData(form));
  await loadRuntimePools(config);
  const payload = buildDungeon(config);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed: payload.seed,
    config,
    payload
  };

  renderResult(lastResult);
});

exportJsonButton.addEventListener('click', () => {
  window.WizardawnCore.exportJSON(`${toolId}-output.json`, lastResult);
});

exportMdButton.addEventListener('click', () => {
  const rooms = (lastResult.payload?.rooms || [])
    .map((room) => `- Room ${room.roomNo}: ${room.feature || 'featureless'}; ${room.encounter ? room.encounter.name : 'no encounter'}; ${room.trap || 'no trap'}; ${room.loot ? room.loot.item : 'no loot'}`)
    .join('\n');
  const markdown = `# ${lastResult.payload?.name || 'Dungeon Builder'}

Generated: ${lastResult.generatedAt || 'n/a'}

- Game: ${lastResult.config?.game || 'n/a'}
- Map Type: ${lastResult.payload?.mapType || 'n/a'}
- Size: ${lastResult.payload?.dimensions || 'n/a'}
- Rooms: ${lastResult.payload?.roomCount || 0}
- Seed: ${lastResult.seed || 'n/a'}

## Rooms
${rooms || '- None'}`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});

form.requestSubmit();
