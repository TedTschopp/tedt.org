const toolId = 'locale';
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

const TERRAIN_FEATURES = {
  Desert: ['salt flats', 'sunken obelisk', 'wind-carved arch', 'dry cistern'],
  Forest: ['ancient grove', 'hunting shrine', 'hollowed oak', 'hidden spring'],
  Hills: ['watch mound', 'collapsed barrow', 'shepherd ruins', 'stone circle'],
  Jungle: ['overgrown ziggurat', 'hanging vines', 'flooded tunnel', 'insect hive'],
  Lake: ['half-sunken chapel', 'reed maze', 'boat graveyard', 'mist shelf'],
  Mountains: ['cliff gate', 'mine shaft', 'frozen pass', 'echoing cavern'],
  Plains: ['old road marker', 'buried vault', 'broken standing stone', 'bandit cairn'],
  Sea: ['wreck shelf', 'reef tunnel', 'tidal cave', 'beacon island'],
  Snow: ['ice cave', 'frost idol', 'avalanche scar', 'abandoned outpost'],
  Swamp: ['bog altar', 'rotted boardwalk', 'sunken hut', 'mire vent'],
  Tropics: ['coral ruin', 'jungle sinkhole', 'storm marker', 'obsidian idol'],
  Underworld: ['fungal forest', 'obsidian bridge', 'glowworm vault', 'abyss pit'],
  Wasteland: ['radiation crater', 'collapsed bunker', 'wrecked convoy', 'fused glass field']
};

const RANDOM_ENCOUNTERS = {
  fantasy: ['goblin scouts', 'skeletal patrol', 'cult acolytes', 'ogre brutes', 'wraith', 'manticore'],
  postApoc: ['mutant scavengers', 'raider bikers', 'feral hounds', 'rogue drone', 'radiation horror', 'stranded robot'],
  tt: ['ratkin prowlers', 'cave troll', 'chaos beast', 'dark elf outcasts', 'ghostly host', 'sorcerer champion']
};

const TRAPS = [
  'needle lock',
  'pit with spikes',
  'swinging blade',
  'poison gas vent',
  'collapsing floor',
  'arcane ward',
  'alarm glyph',
  'crushing wall'
];

const LOOT = {
  fantasy: ['coin cache', 'gem pouch', 'enchanted blade', 'warded scroll', 'healer tincture'],
  postApoc: ['ammo crate', 'repair kit', 'energy cell', 'vintage medpack', 'salvage bundle'],
  tt: ['gold drachmas', 'runed talisman', 'monster trophy', 'mystic powder', 'battle kit']
};

let terrainFeaturePools = TERRAIN_FEATURES;

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

function getGameFamily(game) {
  if (['Mutant Future', 'Broken Urthe', 'Gamma World'].includes(game)) return 'postApoc';
  if (game.includes('Tunnels & Trolls')) return 'tt';
  return 'fantasy';
}

function randomFrom(list, random) {
  return list[Math.floor(random() * list.length)];
}

function randomCount(min, max, random) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.floor(random() * (high - low + 1));
}

function mapLegendRowToTerrainBucket(row) {
  const text = `${String(row?.name || '')} ${String(row?.image || '')}`.toLowerCase();

  if (/(desert|dune|sand|cactus)/.test(text)) return 'Desert';
  if (/(forest|tree)/.test(text)) return 'Forest';
  if (/hills?/.test(text)) return 'Hills';
  if (/jungle/.test(text)) return 'Jungle';
  if (/(lake|waterfall)/.test(text)) return 'Lake';
  if (/(mountain|volcan|lava|rocky)/.test(text)) return 'Mountains';
  if (/(grass|flat|plains?)/.test(text)) return 'Plains';
  if (/(sea|water|sunken|ship|port|dock|boat)/.test(text)) return 'Sea';
  if (/snow/.test(text)) return 'Snow';
  if (/(swamp|marsh|bog)/.test(text)) return 'Swamp';
  if (/(underworld|cavern|fungal|crystal|abyss|u_)/.test(text)) return 'Underworld';
  if (/(radiat|contamin|dead region|barren|crater|wast)/.test(text)) return 'Wasteland';

  return null;
}

async function loadTerrainFeaturePools() {
  if (!window.WizardawnData?.getWorldmapLegend) {
    return;
  }

  try {
    const legendRows = await window.WizardawnData.getWorldmapLegend();
    if (!Array.isArray(legendRows) || !legendRows.length) {
      return;
    }

    const dynamicPools = {
      Desert: [],
      Forest: [],
      Hills: [],
      Jungle: [],
      Lake: [],
      Mountains: [],
      Plains: [],
      Sea: [],
      Snow: [],
      Swamp: [],
      Tropics: [],
      Underworld: [],
      Wasteland: [],
    };

    legendRows.forEach((row) => {
      const bucket = mapLegendRowToTerrainBucket(row);
      if (!bucket || !dynamicPools[bucket]) {
        return;
      }
      const label = String(row.name || '').replace(/\s+/g, ' ').trim();
      if (label) {
        dynamicPools[bucket].push(label.toLowerCase());
      }
    });

    terrainFeaturePools = Object.fromEntries(
      Object.keys(TERRAIN_FEATURES).map((terrain) => {
        const merged = [...new Set([...(dynamicPools[terrain] || []), ...TERRAIN_FEATURES[terrain]])];
        return [terrain, merged.length ? merged : TERRAIN_FEATURES[terrain]];
      })
    );
  } catch (error) {
    console.warn('Unable to load worldmap legend features for locale:', error);
  }
}

function resolveAreaType(areaType, game, random) {
  if (areaType && areaType !== '0') return areaType;
  const postApocTypes = ['Airport', 'Bomb Shelter', 'Cave', 'Factory', 'Military Base', 'Space Station', 'Ruins', 'Prison'];
  const fantasyTypes = ['Castle', 'Cave', 'Dungeon', 'Fort', 'Mine', 'Ruins', 'Temple', 'Tower', 'Unknown Danger'];
  return randomFrom(getGameFamily(game) === 'postApoc' ? postApocTypes : fantasyTypes, random);
}

function buildEncounterTable(config, random) {
  const family = getGameFamily(config.game);
  const mainEntries = [];

  if (config.mainEncounter1 && random() * 100 <= config.mainChance1) {
    mainEntries.push({ type: 'main', name: config.mainEncounter1, weight: config.mainChance1 });
  }
  if (config.mainEncounter2 && random() * 100 <= config.mainChance2) {
    mainEntries.push({ type: 'main', name: config.mainEncounter2, weight: config.mainChance2 });
  }

  const countBase = Math.max(1, Math.ceil((config.level * config.characters) / 8));
  const roomCount = randomCount(config.encMin, config.encMax, random);
  const encounters = [];
  for (let i = 0; i < roomCount; i += 1) {
    if (random() * 100 > config.encChance) continue;
    const source = random() < 0.35 && mainEntries.length ? randomFrom(mainEntries, random).name : randomFrom(RANDOM_ENCOUNTERS[family], random);
    const quantity = Math.max(1, Math.round((countBase * (0.5 + random())) / (config.ttDifficulty === 9 ? 0.8 : config.ttDifficulty)));
    encounters.push({
      area: i + 1,
      creature: source,
      quantity,
      detail: config.showDescriptions ? `Threat scaled for level ${config.level}` : null
    });
  }
  return encounters;
}

function buildTrapTable(config, random) {
  const trapCount = randomCount(1, Math.max(1, config.encMax), random);
  const traps = [];
  for (let i = 0; i < trapCount; i += 1) {
    if (random() * 100 > config.trapChance) continue;
    traps.push({ area: i + 1, trap: randomFrom(TRAPS, random), severity: Math.max(1, Math.ceil(config.level / 3)) });
  }
  return traps;
}

function buildLootTable(config, random, encounterCount) {
  const family = getGameFamily(config.game);
  const lootCount = Math.max(1, Math.ceil(encounterCount / 2));
  const loot = [];
  for (let i = 0; i < lootCount; i += 1) {
    const adjustedChance = Math.min(100, config.lootChance + config.level * config.lootAdjust);
    if (random() * 100 > adjustedChance) continue;
    const item = randomFrom(LOOT[family], random);
    let note = '';
    if (config.treasuredBosses && random() < 0.2) note = 'Boss cache';
    if (config.mutantsOnly && family === 'postApoc' && random() < 0.4) note = note ? `${note}; mutant-tagged` : 'mutant-tagged';
    loot.push({ area: i + 1, item, value: Math.round((10 + random() * 90) * config.level), note: note || null });
  }
  return loot;
}

function buildLocale(config) {
  const seed = config.seed || `${Date.now()}-${Math.random()}`;
  const random = createSeededRandom(seed);
  const family = getGameFamily(config.game);
  const areaType = resolveAreaType(config.areaType, config.game, random);
  const terrainFeatures = terrainFeaturePools[config.terrain] || TERRAIN_FEATURES.Plains;
  const atmosphere = random() * 100 <= config.atmosphere ? 'ordinary atmosphere' : 'thin / hazardous atmosphere';
  const encounterTable = buildEncounterTable(config, random);
  const trapTable = buildTrapTable(config, random);
  const lootTable = buildLootTable(config, random, encounterTable.length);

  return {
    seed,
    family,
    localeName: config.areaName || `${config.terrain} ${areaType}`,
    areaType,
    terrain: config.terrain,
    atmosphere,
    weatherHint: randomFrom(terrainFeatures, random),
    mapSummary: `${areaType} complex with ${randomCount(8, 28, random)} chambers`,
    encounterTable,
    trapTable,
    lootTable,
    notes: {
      furnishRooms: config.furnish,
      variants: [
        config.useAec ? 'AEC enabled' : null,
        config.useMom ? 'Monsters of Myth enabled' : null,
        config.useFf ? 'Fiend Folio enabled' : null,
        config.useMm2 ? 'Monster Manual II enabled' : null,
        config.mutantsOnly ? 'Mutants-only filter active' : null
      ].filter(Boolean)
    }
  };
}

function renderListCard(title, rows, formatter) {
  const card = document.createElement('section');
  card.className = 'card mb-3';
  card.innerHTML = `<div class="card-header py-2">${title}</div>`;
  const body = document.createElement('div');
  body.className = 'card-body py-2 px-3';

  if (!rows.length) {
    body.innerHTML = '<em>None generated.</em>';
    card.appendChild(body);
    return card;
  }

  const list = document.createElement('ul');
  list.className = 'mb-0 locale-list';
  rows.forEach((row) => {
    const li = document.createElement('li');
    li.textContent = formatter(row);
    list.appendChild(li);
  });
  body.appendChild(list);
  card.appendChild(body);
  return card;
}

function renderResult(result) {
  output.innerHTML = '';
  if (!result.payload) {
    output.innerHTML = '<em>No locale generated.</em>';
    return;
  }

  const header = document.createElement('section');
  header.className = 'card mb-3';
  header.innerHTML = `
    <div class="card-body py-2 px-3 locale-meta">
      <div><strong>Name:</strong> ${result.payload.localeName}</div>
      <div><strong>Game:</strong> ${result.config.game}</div>
      <div><strong>Area/Terrain:</strong> ${result.payload.areaType} in ${result.payload.terrain}</div>
      <div><strong>Atmosphere:</strong> ${result.payload.atmosphere}</div>
      <div><strong>Summary:</strong> ${result.payload.mapSummary}; feature: ${result.payload.weatherHint}</div>
      <div><strong>Currency:</strong> ${result.config.currency} · <strong>Seed:</strong> ${result.seed}</div>
    </div>
  `;
  output.appendChild(header);

  output.appendChild(
    renderListCard('Encounters', result.payload.encounterTable, (entry) => {
      const detail = entry.detail ? ` (${entry.detail})` : '';
      return `Area ${entry.area}: ${entry.creature} ×${entry.quantity}${detail}`;
    })
  );

  output.appendChild(
    renderListCard('Traps', result.payload.trapTable, (entry) => {
      return `Area ${entry.area}: ${entry.trap} (severity ${entry.severity})`;
    })
  );

  output.appendChild(
    renderListCard('Loot', result.payload.lootTable, (entry) => {
      const note = entry.note ? ` • ${entry.note}` : '';
      return `Area ${entry.area}: ${entry.item} (${entry.value} ${result.config.currency})${note}`;
    })
  );

  const options = document.createElement('section');
  options.className = 'card';
  options.innerHTML = `
    <div class="card-header py-2">Applied Options</div>
    <div class="card-body py-2 px-3">
      ${result.payload.notes.variants.length ? result.payload.notes.variants.join(' · ') : 'No optional source toggles enabled'}
    </div>
  `;
  output.appendChild(options);
}

function parseConfig(formData) {
  return {
    seed: formData.get('seed')?.toString().trim() || null,
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    areaName: formData.get('areaName')?.toString().trim() || '',
    currency: formData.get('currency')?.toString().trim() || 'gold',
    level: Number(formData.get('level') || 3),
    characters: Number(formData.get('characters') || 4),
    ttDifficulty: Number(formData.get('ttDifficulty') || 1),
    areaType: formData.get('areaType')?.toString() || '0',
    terrain: formData.get('terrain')?.toString() || 'Plains',
    mainEncounter1: formData.get('mainEncounter1')?.toString().trim() || '',
    mainChance1: Number(formData.get('mainChance1') || 0),
    mainEncounter2: formData.get('mainEncounter2')?.toString().trim() || '',
    mainChance2: Number(formData.get('mainChance2') || 0),
    atmosphere: Number(formData.get('atmosphere') || 80),
    encChance: Number(formData.get('encChance') || 35),
    encMin: Number(formData.get('encMin') || 1),
    encMax: Number(formData.get('encMax') || 4),
    trapChance: Number(formData.get('trapChance') || 10),
    lootChance: Number(formData.get('lootChance') || 20),
    lootAdjust: Number(formData.get('lootAdjust') || 2),
    furnish: formData.get('furnish') === '1',
    mutantsOnly: formData.get('mutantsOnly') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    useAec: formData.get('useAec') === '1',
    useMom: formData.get('useMom') === '1',
    useFf: formData.get('useFf') === '1',
    useMm2: formData.get('useMm2') === '1',
    treasuredBosses: formData.get('treasuredBosses') === '1'
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadTerrainFeaturePools();

  const config = parseConfig(new FormData(form));
  const payload = buildLocale(config);

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
  const encounterRows = (lastResult.payload?.encounterTable || []).map((entry) => `- Area ${entry.area}: ${entry.creature} ×${entry.quantity}`).join('\n') || '- None';
  const trapRows = (lastResult.payload?.trapTable || []).map((entry) => `- Area ${entry.area}: ${entry.trap}`).join('\n') || '- None';
  const lootRows = (lastResult.payload?.lootTable || []).map((entry) => `- Area ${entry.area}: ${entry.item} (${entry.value} ${lastResult.config.currency})`).join('\n') || '- None';

  const markdown = `# ${lastResult.payload?.localeName || 'Locale Builder'}

Generated: ${lastResult.generatedAt || 'n/a'}

- Game: ${lastResult.config?.game || 'n/a'}
- Area: ${lastResult.payload?.areaType || 'n/a'}
- Terrain: ${lastResult.payload?.terrain || 'n/a'}
- Atmosphere: ${lastResult.payload?.atmosphere || 'n/a'}
- Seed: ${lastResult.seed || 'n/a'}

## Encounters
${encounterRows}

## Traps
${trapRows}

## Loot
${lootRows}`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});

form.requestSubmit();
