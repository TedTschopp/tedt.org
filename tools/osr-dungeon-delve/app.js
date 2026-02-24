const toolId = 'delve';
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

const MONSTERS = {
  common: ['Goblin patrol', 'Skeleton sentries', 'Bandit scouts', 'Orc raiders', 'Giant rats', 'Cultists'],
  undead: ['Zombies', 'Ghasts', 'Wights', 'Wraiths', 'Bone knights'],
  outside: ['Wolves', 'Harpies', 'Lizardfolk', 'Hill giant', 'Wyvern'],
  deep: ['Troll', 'Manticore', 'Beholder-kin', 'Fire salamander', 'Abyssal horror']
};

const TRAPS = ['Pit trap', 'Poison darts', 'Falling block', 'Arcane glyph', 'Scything blade', 'Gas vent'];
const FURNISHINGS = ['Rotted banquet table', 'Abandoned alchemy bench', 'Ritual dais', 'Collapsing bunks', 'Broken shrine'];
const ATMOSPHERES = ['Whispering echoes', 'Sulfur haze', 'Frigid drafts', 'Magnetic hum', 'Spore mist', 'No unusual atmosphere'];
const LOOT = ['Coin hoard', 'Gem satchel', 'Potion cache', 'Engraved weapon', 'Ancient map fragment', 'Spell scroll'];

const FALLBACK_MONSTERS = {
  common: [...MONSTERS.common],
  undead: [...MONSTERS.undead],
  outside: [...MONSTERS.outside],
  deep: [...MONSTERS.deep]
};
const FALLBACK_FURNISHINGS = [...FURNISHINGS];
const FALLBACK_LOOT = [...LOOT];

let runtimeMonsters = {
  common: [...FALLBACK_MONSTERS.common],
  undead: [...FALLBACK_MONSTERS.undead],
  outside: [...FALLBACK_MONSTERS.outside],
  deep: [...FALLBACK_MONSTERS.deep]
};
let runtimeFurnishings = [...FALLBACK_FURNISHINGS];
let runtimeLoot = [...FALLBACK_LOOT];

let runtimePoolsReady = false;
let runtimePoolsLoading = null;

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => normalizeText(value)).filter(Boolean))];
}

function resetRuntimePools() {
  runtimeMonsters = {
    common: [...FALLBACK_MONSTERS.common],
    undead: [...FALLBACK_MONSTERS.undead],
    outside: [...FALLBACK_MONSTERS.outside],
    deep: [...FALLBACK_MONSTERS.deep]
  };
  runtimeFurnishings = [...FALLBACK_FURNISHINGS];
  runtimeLoot = [...FALLBACK_LOOT];
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
      const [monsters, stores, geomorphs] = await Promise.all([
        window.WizardawnData.getMonstersForGame(gameCode, {
          includeFf: config.useFf,
          includeMm2: config.useMm2
        }),
        window.WizardawnData.getStoreItemsForGames(storeCodes),
        window.WizardawnData.getGeomorphs()
      ]);

      const names = uniqueStrings((monsters || []).map((row) => row.name));
      const undead = names.filter((name) => /skeleton|zombie|ghoul|ghast|wight|wraith|mummy|lich|vampire|spectre|ghost|undead/i.test(name));
      const deep = uniqueStrings((monsters || []).filter((row) => Number(row.difficulty || 0) >= 6).map((row) => row.name));
      const outside = uniqueStrings((monsters || []).filter((row) => !config.terrain || (row.terrains || []).includes(config.terrain)).map((row) => row.name));

      if (names.length) runtimeMonsters.common = uniqueStrings([...runtimeMonsters.common, ...names]);
      if (undead.length) runtimeMonsters.undead = uniqueStrings([...runtimeMonsters.undead, ...undead]);
      if (outside.length) runtimeMonsters.outside = uniqueStrings([...runtimeMonsters.outside, ...outside]);
      if (deep.length) runtimeMonsters.deep = uniqueStrings([...runtimeMonsters.deep, ...deep]);

      const lootItems = uniqueStrings((stores || []).map((row) => row.item).filter((item) => item.length >= 4 && item.length <= 48));
      if (lootItems.length) {
        runtimeLoot = uniqueStrings([...runtimeLoot, ...lootItems]);
      }

      const furnishingTerms = uniqueStrings((geomorphs || []).flatMap((row) => [row.more, row.delve, row.spot]));
      if (furnishingTerms.length) {
        runtimeFurnishings = uniqueStrings([...runtimeFurnishings, ...furnishingTerms]);
      }
    } catch (error) {
      console.warn('delve runtime pool enrichment failed; using fallback pools', error);
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

function randomInt(min, max, random) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.floor(random() * (high - low + 1));
}

function buildRooms(config, random, roomCount) {
  const rooms = [];
  const levels = config.delveType === 'Simple' ? 1 : Math.max(2, Math.ceil(roomCount / 7));

  for (let index = 0; index < roomCount; index += 1) {
    const roomNo = index + 1;
    let floor = config.delveType === 'Simple' ? 1 : 1 + Math.floor(index / Math.ceil(roomCount / levels));

    if (config.delveType !== 'Simple' && config.omitFloors > 0 && random() * 100 < config.omitFloors) {
      floor = Math.max(1, floor - 1);
    }

    const progressiveShift = config.delveType === 'Progressive' ? floor - 1 : 0;
    const encounterLevel = Math.max(1, config.level + progressiveShift);
    const encounterRoll = random() * 100;
    const trapRoll = random() * 100;
    const lootRoll = random() * 100;
    const unusualAtmo = random() * 100 < config.atmo;

    const room = {
      roomNo,
      floor,
      encounter: null,
      trap: null,
      loot: null,
      atmosphere: unusualAtmo ? randomFrom(ATMOSPHERES.slice(0, -1), random) : ATMOSPHERES[ATMOSPHERES.length - 1],
      furnishing: config.furnishRooms ? randomFrom(runtimeFurnishings, random) : null
    };

    if (encounterRoll < config.encChance) {
      let pool = [...runtimeMonsters.common];
      if (config.undeadOnly) {
        pool = [...runtimeMonsters.undead];
      } else {
        if (config.outsideVisitors && config.terrain) pool.push(...runtimeMonsters.outside);
        if (encounterLevel >= config.level + 2) pool.push(...runtimeMonsters.deep);
      }
      room.encounter = {
        name: randomFrom(pool, random),
        level: encounterLevel,
        amount: randomInt(config.encMin, config.encMax, random)
      };
      if (config.showDescriptions) {
        room.encounter.note = `Threat tuned for level ${encounterLevel} party`;
      }
    }

    if (trapRoll < config.trapChance) {
      room.trap = {
        type: randomFrom(TRAPS, random),
        severity: Math.max(1, Math.ceil((config.level + progressiveShift) / 3))
      };
    }

    const lootChanceAdjusted = Math.min(100, config.lootChance + (config.level * config.lootAdjust));
    if (lootRoll < lootChanceAdjusted) {
      room.loot = {
        item: randomFrom(runtimeLoot, random),
        coins: Math.round(randomInt(config.lootMin, config.lootMax, random) * config.coinAmount * (0.5 + random())),
        trapped: random() * 100 < config.lootTrapped,
        artifact: random() * 100 > config.artifacts,
        unusual: random() * 100 < config.unusualItems
      };
      if (config.treasured && room.encounter && /dragon|demon|devil|lich/i.test(room.encounter.name)) {
        room.loot.coins += Math.round(config.coinAmount * 2);
        room.loot.note = 'Treasured boss bonus';
      }
    }

    rooms.push(room);
  }

  return rooms;
}

function parseConfig(formData) {
  return {
    seed: formData.get('seed')?.toString().trim() || null,
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    areaName: formData.get('areaName')?.toString().trim() || '',
    level: Number(formData.get('level') || 3),
    characters: Number(formData.get('characters') || 4),
    mapWide: Number(formData.get('mapWide') || 4),
    mapHigh: Number(formData.get('mapHigh') || 4),
    delveType: formData.get('delveType')?.toString() || 'Simple',
    omitFloors: Number(formData.get('omitFloors') || 0),
    terrain: formData.get('terrain')?.toString() || '',
    atmo: Number(formData.get('atmo') || 20),
    encChance: Number(formData.get('encChance') || 35),
    trapChance: Number(formData.get('trapChance') || 10),
    lootChance: Number(formData.get('lootChance') || 20),
    lootAdjust: Number(formData.get('lootAdjust') || 2),
    encMin: Number(formData.get('encMin') || 1),
    encMax: Number(formData.get('encMax') || 4),
    trapMin: Number(formData.get('trapMin') || 1),
    trapMax: Number(formData.get('trapMax') || 3),
    lootMin: Number(formData.get('lootMin') || 1),
    lootMax: Number(formData.get('lootMax') || 5),
    outsideVisitors: formData.get('outsideVisitors') === '1',
    undeadOnly: formData.get('undeadOnly') === '1',
    furnishRooms: formData.get('furnishRooms') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    manualMonsters: formData.get('manualMonsters') === '1',
    treasured: formData.get('treasured') === '1',
    useAec: formData.get('useAec') === '1',
    useMom: formData.get('useMom') === '1',
    useFf: formData.get('useFf') === '1',
    useMm2: formData.get('useMm2') === '1',
    useUa: formData.get('useUa') === '1',
    coinAmount: 100,
    unusualItems: 1,
    artifacts: 100,
    lootTrapped: 30
  };
}

function generateDelve(config) {
  const seed = config.seed || `${Date.now()}-${Math.random()}`;
  const random = createSeededRandom(seed);
  const roomCount = Math.max(6, Math.round(config.mapWide * config.mapHigh * 0.7));
  const rooms = buildRooms(config, random, roomCount);

  return {
    name: config.areaName || `${config.delveType} Delve`,
    seed,
    roomCount,
    floors: [...new Set(rooms.map((r) => r.floor))].length,
    terrain: config.terrain || 'None',
    rooms,
    notes: [
      config.manualMonsters ? 'Manual of Monsters enabled' : null,
      config.useAec ? 'AEC enabled' : null,
      config.useMom ? 'Monsters of Myth enabled' : null,
      config.useFf ? 'Fiend Folio enabled' : null,
      config.useMm2 ? 'MMII enabled' : null,
      config.useUa ? 'UA enabled' : null
    ].filter(Boolean)
  };
}

function renderResult(result) {
  output.innerHTML = '';
  if (!result.payload) {
    output.innerHTML = '<em>No delve generated.</em>';
    return;
  }

  const summary = document.createElement('section');
  summary.className = 'card mb-3';
  summary.innerHTML = `
    <div class="card-body py-2 px-3 delve-meta">
      <div><strong>Name:</strong> ${result.payload.name}</div>
      <div><strong>Game:</strong> ${result.config.game}</div>
      <div><strong>Type:</strong> ${result.config.delveType} · <strong>Size:</strong> ${result.config.mapWide} × ${result.config.mapHigh}</div>
      <div><strong>Rooms/Floors:</strong> ${result.payload.roomCount} / ${result.payload.floors}</div>
      <div><strong>Terrain:</strong> ${result.payload.terrain}</div>
      <div><strong>Seed:</strong> ${result.seed}</div>
    </div>
  `;
  output.appendChild(summary);

  const tableWrap = document.createElement('section');
  tableWrap.className = 'card mb-3';
  tableWrap.innerHTML = '<div class="card-header py-2">Room Details</div>';
  const body = document.createElement('div');
  body.className = 'card-body p-0';

  const table = document.createElement('table');
  table.className = 'table table-sm mb-0 delve-table';
  table.innerHTML = '<thead><tr><th>Room</th><th>Floor</th><th>Encounter</th><th>Trap</th><th>Loot</th><th>Atmosphere</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');

  result.payload.rooms.forEach((room) => {
    const tr = document.createElement('tr');
    const encounter = room.encounter ? `${room.encounter.name} ×${room.encounter.amount} (L${room.encounter.level})` : '—';
    const trap = room.trap ? `${room.trap.type} (S${room.trap.severity})` : '—';
    const loot = room.loot
      ? `${room.loot.item}, ${room.loot.coins} coins${room.loot.trapped ? ', trapped' : ''}${room.loot.note ? `, ${room.loot.note}` : ''}`
      : '—';
    tr.innerHTML = `<td>${room.roomNo}</td><td>${room.floor}</td><td>${encounter}</td><td>${trap}</td><td>${loot}</td><td>${room.atmosphere}</td>`;
    tbody.appendChild(tr);
  });

  body.appendChild(table);
  tableWrap.appendChild(body);
  output.appendChild(tableWrap);

  if (result.payload.notes.length) {
    const noteCard = document.createElement('section');
    noteCard.className = 'card';
    noteCard.innerHTML = `
      <div class="card-header py-2">Applied Sources/Options</div>
      <div class="card-body py-2 px-3">${result.payload.notes.join(' · ')}</div>
    `;
    output.appendChild(noteCard);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const config = parseConfig(new FormData(form));
  await loadRuntimePools(config);
  const payload = generateDelve(config);

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
    .map((r) => `- Room ${r.roomNo} (F${r.floor}): ${r.encounter ? `${r.encounter.name} x${r.encounter.amount}` : 'No encounter'}; ${r.trap ? r.trap.type : 'No trap'}; ${r.loot ? r.loot.item : 'No loot'}`)
    .join('\n');
  const markdown = `# ${lastResult.payload?.name || 'Dungeon Delve'}

Generated: ${lastResult.generatedAt || 'n/a'}

- Game: ${lastResult.config?.game || 'n/a'}
- Type: ${lastResult.config?.delveType || 'n/a'}
- Size: ${lastResult.config ? `${lastResult.config.mapWide} × ${lastResult.config.mapHigh}` : 'n/a'}
- Rooms: ${lastResult.payload?.roomCount || 0}
- Floors: ${lastResult.payload?.floors || 0}
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
