const toolId = 'hexcrawl';
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

const TERRAIN_CODES = {
  100: 'Desert',
  101: 'Forest',
  102: 'Hills',
  103: 'Jungle',
  104: 'Mountains',
  105: 'Plains',
  106: 'Sea',
  107: 'Snow',
  108: 'Swamp',
  109: 'Tropics',
  110: 'Lake',
  111: 'Wasteland',
  112: 'Underworld'
};

const LANDMARKS = ['Ruined keep', 'Ancient watchtower', 'Hidden shrine', 'Bandit camp', 'Sunken vault', 'Abandoned fort'];
const HAZARDS = ['Blighted weather', 'Quicksand basin', 'Poison fog pocket', 'Rockslide zone', 'Arcane storm', 'Predator migration'];
const SITE_TYPES = ['Cave', 'Ruins', 'Temple', 'Fort', 'Tower', 'Mine', 'Den', 'Dungeon'];
const ENCOUNTERS = ['Goblin scouts', 'Undead patrol', 'Cult fanatics', 'Orc warband', 'Mutant raiders', 'Drake hunters'];
const TRAPS = ['Collapsing floor', 'Needle lock', 'Swinging blade', 'Toxic spore vent', 'Explosive rune', 'Tripwire darts'];
const CONTENTS = ['Supply cache', 'Forgotten journal', 'Ceremonial altar', 'Collapsed armory', 'Warded chamber', 'Strange machinery'];
const LOOT = ['Coin stash', 'Gem packet', 'Runed weapon', 'Ancient relic', 'Potion bundle', 'Trade goods'];

const FALLBACK_LANDMARKS = [...LANDMARKS];
const FALLBACK_ENCOUNTERS = [...ENCOUNTERS];
const FALLBACK_LOOT = [...LOOT];

let runtimeLandmarks = [...FALLBACK_LANDMARKS];
let runtimeEncounters = [...FALLBACK_ENCOUNTERS];
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
  runtimeLandmarks = [...FALLBACK_LANDMARKS];
  runtimeEncounters = [...FALLBACK_ENCOUNTERS];
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
  if (game === 'Mutant Future') return 'MF';
  if (game === 'Broken Urthe') return 'BU';
  if (game === 'Gamma World') return 'BU';
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
  if (game === 'Mutant Future') return ['MF'];
  if (game === 'Broken Urthe') return ['BU'];
  if (game === 'Gamma World') return ['MF', 'BU'];
  return [];
}

function terrainKeyword(terrainCode) {
  const terrainName = String(TERRAIN_CODES[terrainCode] || '').toLowerCase();
  if (!terrainName) {
    return '';
  }
  if (terrainName === 'sea' || terrainName === 'lake') {
    return 'water';
  }
  return terrainName;
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
      const terrainKey = terrainKeyword(config.terrain);

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

      if (config.mutantsOnly) {
        const mutants = await window.WizardawnData.getMutants();
        const mutantNames = uniqueStrings((mutants || []).map((row) => row.name).filter(Boolean).map((name) => `Mutant ${name}`));
        if (mutantNames.length) {
          runtimeEncounters = uniqueStrings([...runtimeEncounters, ...mutantNames]);
        }
      }

      const lootItems = uniqueStrings((storeItems || []).map((row) => row.item).filter((item) => item.length >= 4 && item.length <= 48));
      if (lootItems.length) {
        runtimeLoot = uniqueStrings([...runtimeLoot, ...lootItems]);
      }

      const landmarkCandidates = (geomorphs || [])
        .filter((row) => !terrainKey || row.terrain.includes(terrainKey))
        .flatMap((row) => [row.spot, row.more, row.delve]);
      const landmarkNames = uniqueStrings(landmarkCandidates).map((value) => value.replace(/^./, (char) => char.toUpperCase()));
      if (landmarkNames.length) {
        runtimeLandmarks = uniqueStrings([...runtimeLandmarks, ...landmarkNames]);
      }
    } catch (error) {
      console.warn('hexcrawl runtime pool enrichment failed; using fallback pools', error);
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

function parseConfig(formData) {
  return {
    seed: formData.get('seed')?.toString().trim() || null,
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    areaName: formData.get('areaName')?.toString().trim() || '',
    level: Number(formData.get('level') || 3),
    characters: Number(formData.get('characters') || 4),
    hexMiles: Number(formData.get('hexMiles') || 24),
    terrain: Number(formData.get('terrain') || 105),
    colorMap: formData.get('colorMap') === '1',
    currency: formData.get('currency')?.toString().trim() || 'gold',
    atmo: Number(formData.get('atmo') || 20),
    encChance: Number(formData.get('encChance') || 35),
    trapChance: Number(formData.get('trapChance') || 10),
    contentChance: Number(formData.get('contentChance') || 10),
    lootChance: Number(formData.get('lootChance') || 20),
    lootAdjust: Number(formData.get('lootAdjust') || 2),
    siteMin: Number(formData.get('siteMin') || 2),
    siteMax: Number(formData.get('siteMax') || 6),
    lootMin: Number(formData.get('lootMin') || 1),
    lootMax: Number(formData.get('lootMax') || 5),
    cashPct: Number(formData.get('cashPct') || 100),
    techPct: Number(formData.get('techPct') || 100),
    furnishRooms: formData.get('furnishRooms') === '1',
    mutantsOnly: formData.get('mutantsOnly') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    useAec: formData.get('useAec') === '1',
    useMom: formData.get('useMom') === '1',
    useFf: formData.get('useFf') === '1',
    useMm2: formData.get('useMm2') === '1',
    useUa: formData.get('useUa') === '1',
    treasured: formData.get('treasured') === '1'
  };
}

function buildHexAdventure(config) {
  const seed = config.seed || `${Date.now()}-${Math.random()}`;
  const random = createSeededRandom(seed);
  const terrainName = TERRAIN_CODES[config.terrain] || 'Plains';
  const siteCount = randomInt(config.siteMin, config.siteMax, random);

  const sites = [];
  for (let i = 0; i < siteCount; i += 1) {
    const danger = Math.max(1, config.level + Math.floor(i / 2));
    const hasEncounter = random() * 100 < config.encChance;
    const hasTrap = random() * 100 < config.trapChance;
    const hasContent = random() * 100 < config.contentChance;
    const hasLoot = random() * 100 < Math.min(100, config.lootChance + (config.level * config.lootAdjust));

    let encounterName = hasEncounter ? randomFrom(runtimeEncounters, random) : null;
    if (config.mutantsOnly && encounterName) {
      encounterName = `Mutant ${encounterName}`;
    }

    const site = {
      id: i + 1,
      type: randomFrom(SITE_TYPES, random),
      danger,
      atmosphere: random() * 100 < config.atmo ? randomFrom(HAZARDS, random) : 'Stable conditions',
      encounter: hasEncounter
        ? {
            name: encounterName,
            amount: randomInt(1, Math.max(2, Math.ceil(config.characters * 1.5)), random),
            note: config.showDescriptions ? `Threat scaled for level ${danger}` : null
          }
        : null,
      trap: hasTrap ? randomFrom(TRAPS, random) : null,
      content: hasContent ? randomFrom(CONTENTS, random) : null,
      loot: hasLoot
        ? {
            item: randomFrom(runtimeLoot, random),
            value: Math.round(randomInt(config.lootMin, config.lootMax, random) * config.cashPct * (0.25 + random())),
            currency: config.currency,
            techTag: config.techPct < 100 && random() * 100 > config.techPct ? 'low-tech replacement' : null,
            bonus: config.treasured && random() < 0.2 ? 'boss cache' : null
          }
        : null
    };
    sites.push(site);
  }

  const landmarks = Array.from({ length: randomInt(2, 5, random) }, (_, i) => ({
    id: i + 1,
    name: randomFrom(runtimeLandmarks, random),
    distanceMiles: randomInt(1, Math.max(3, config.hexMiles), random)
  }));

  const wandering = Array.from({ length: 6 }, (_, i) => ({
    roll: i + 1,
    result: randomFrom(runtimeEncounters, random)
  }));

  const mapPreview = window.WizardawnMap?.buildHexPreview
    ? window.WizardawnMap.buildHexPreview(random, terrainName, sites.length)
    : null;

  return {
    seed,
    hexName: config.areaName || `${terrainName} Frontier Hex`,
    terrainName,
    hexMiles: config.hexMiles,
    landmarks,
    wandering,
    sites,
    mapPreview,
    options: [
      config.furnishRooms ? 'Furnish rooms' : null,
      config.useAec ? 'AEC' : null,
      config.useMom ? 'MoM' : null,
      config.useFf ? 'FF' : null,
      config.useMm2 ? 'MMII' : null,
      config.useUa ? 'UA' : null,
      config.colorMap ? 'Color map' : null
    ].filter(Boolean)
  };
}

function renderResult(result) {
  output.innerHTML = '';
  if (!result.payload) {
    output.innerHTML = '<em>No hexcrawl generated.</em>';
    return;
  }

  const summary = document.createElement('section');
  summary.className = 'card mb-3';
  summary.innerHTML = `
    <div class="card-body py-2 px-3 hexcrawl-meta">
      <div><strong>Name:</strong> ${result.payload.hexName}</div>
      <div><strong>Game:</strong> ${result.config.game}</div>
      <div><strong>Terrain:</strong> ${result.payload.terrainName} · <strong>Hex Size:</strong> ${result.payload.hexMiles} miles</div>
      <div><strong>Sites:</strong> ${result.payload.sites.length} · <strong>Landmarks:</strong> ${result.payload.landmarks.length}</div>
      <div><strong>Seed:</strong> ${result.seed}</div>
    </div>
  `;
  output.appendChild(summary);

  const landmarks = document.createElement('section');
  landmarks.className = 'card mb-3';
  landmarks.innerHTML = '<div class="card-header py-2">Landmarks</div>';
  const landmarksBody = document.createElement('div');
  landmarksBody.className = 'card-body py-2 px-3';
  landmarksBody.innerHTML = `<ul class="mb-0 hexcrawl-list">${result.payload.landmarks.map((l) => `<li>${l.name} (${l.distanceMiles} miles)</li>`).join('')}</ul>`;
  landmarks.appendChild(landmarksBody);
  output.appendChild(landmarks);

  if (result.payload.mapPreview) {
    const mapCard = window.WizardawnMap?.createHexMapCard
      ? window.WizardawnMap.createHexMapCard(result.payload.mapPreview, {
          title: 'Hex Map',
          cardClass: 'card mb-3 hexcrawl-map-card',
          assetBase: '/tools/osr-tools/osr-support-files/assets/land/',
          colorMap: result.config.colorMap,
          expandCardWithMap: true
        })
      : null;
    if (mapCard) {
      output.appendChild(mapCard);
    }
  }

  const sites = document.createElement('section');
  sites.className = 'card mb-3';
  sites.innerHTML = '<div class="card-header py-2">Exploration Sites</div>';
  const sitesBody = document.createElement('div');
  sitesBody.className = 'card-body p-0';
  const table = document.createElement('table');
  table.className = 'table table-sm mb-0 hexcrawl-table';
  table.innerHTML = '<thead><tr><th>Site</th><th>Type</th><th>Danger</th><th>Encounter</th><th>Trap</th><th>Loot</th></tr></thead><tbody></tbody>';
  const tbody = table.querySelector('tbody');
  result.payload.sites.forEach((site) => {
    const tr = document.createElement('tr');
    const encounter = site.encounter ? `${site.encounter.name} ×${site.encounter.amount}` : '—';
    const trap = site.trap || '—';
    const loot = site.loot ? `${site.loot.item} (${site.loot.value} ${site.loot.currency})` : '—';
    tr.innerHTML = `<td>${site.id}</td><td>${site.type}</td><td>${site.danger}</td><td>${encounter}</td><td>${trap}</td><td>${loot}</td>`;
    tbody.appendChild(tr);
  });
  sitesBody.appendChild(table);
  sites.appendChild(sitesBody);
  output.appendChild(sites);

  const wandering = document.createElement('section');
  wandering.className = 'card mb-3';
  wandering.innerHTML = '<div class="card-header py-2">Wandering Encounters (d6)</div>';
  const wanderBody = document.createElement('div');
  wanderBody.className = 'card-body py-2 px-3';
  wanderBody.innerHTML = `<ul class="mb-0 hexcrawl-list">${result.payload.wandering.map((w) => `<li>${w.roll}: ${w.result}</li>`).join('')}</ul>`;
  wandering.appendChild(wanderBody);
  output.appendChild(wandering);

  if (result.payload.options.length) {
    const opts = document.createElement('section');
    opts.className = 'card';
    opts.innerHTML = `<div class="card-header py-2">Applied Options</div><div class="card-body py-2 px-3">${result.payload.options.join(' · ')}</div>`;
    output.appendChild(opts);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const config = parseConfig(new FormData(form));
  await loadRuntimePools(config);
  const payload = buildHexAdventure(config);

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
  const siteRows = (lastResult.payload?.sites || [])
    .map((s) => `- Site ${s.id} (${s.type}, danger ${s.danger}): ${s.encounter ? s.encounter.name : 'No encounter'}; ${s.trap || 'No trap'}; ${s.loot ? s.loot.item : 'No loot'}`)
    .join('\n');
  const markdown = `# ${lastResult.payload?.hexName || 'World Adventure Hex'}

Generated: ${lastResult.generatedAt || 'n/a'}

- Game: ${lastResult.config?.game || 'n/a'}
- Terrain: ${lastResult.payload?.terrainName || 'n/a'}
- Hex Size: ${lastResult.payload?.hexMiles || 'n/a'} miles
- Sites: ${lastResult.payload?.sites?.length || 0}
- Seed: ${lastResult.seed || 'n/a'}

## Exploration Sites
${siteRows || '- None'}`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});

form.requestSubmit();
