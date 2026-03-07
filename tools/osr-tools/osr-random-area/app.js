const toolId = 'area';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const defaults = {
  enemies: [
    { name: 'Giant Rats', level: 1, detail: '2d6 swarming vermin' },
    { name: 'Skeletons', level: 2, detail: '4 animated guardians' },
    { name: 'Orc Scouts', level: 2, detail: '1d6 with crude bows' },
    { name: 'Ogre Brute', level: 4, detail: 'single heavy hitter' }
  ],
  traps: ['Pit trap', 'Poison needle', 'Swinging blade', 'Falling block', 'Alarm glyph'],
  contents: ['Broken table', 'Torn banner', 'Ancient mural', 'Cobweb drapery', 'Charred brazier', 'Dusty bookshelf'],
  loot: ['pouch of silver', 'jeweled dagger', 'healing draught', 'golden idol fragment', 'gemstone cluster'],
  boxes: ['wooden chest', 'iron coffer', 'stone urn', 'sealed crate', 'hidden cache']
};

const FALLBACK_DEFAULTS = {
  enemies: defaults.enemies.map((entry) => ({ ...entry })),
  traps: [...defaults.traps],
  contents: [...defaults.contents],
  loot: [...defaults.loot],
  boxes: [...defaults.boxes]
};

let runtimeDefaults = {
  enemies: FALLBACK_DEFAULTS.enemies.map((entry) => ({ ...entry })),
  traps: [...FALLBACK_DEFAULTS.traps],
  contents: [...FALLBACK_DEFAULTS.contents],
  loot: [...FALLBACK_DEFAULTS.loot],
  boxes: [...FALLBACK_DEFAULTS.boxes]
};

let runtimePoolsReady = false;
let runtimePoolsLoading = null;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    areas: []
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
  if (state === 0) state = 1357913579;
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

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function toTitleCase(value) {
  const text = normalizeText(value).toLowerCase();
  if (!text) {
    return '';
  }
  return text.replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => normalizeText(value)).filter(Boolean))];
}

function resetRuntimeDefaults() {
  runtimeDefaults = {
    enemies: FALLBACK_DEFAULTS.enemies.map((entry) => ({ ...entry })),
    traps: [...FALLBACK_DEFAULTS.traps],
    contents: [...FALLBACK_DEFAULTS.contents],
    loot: [...FALLBACK_DEFAULTS.loot],
    boxes: [...FALLBACK_DEFAULTS.boxes]
  };
}

function classifyStoreItem(itemText) {
  const item = String(itemText || '').toLowerCase();
  if (/chest|coffer|crate|box|safe|urn|cache/.test(item)) {
    return 'boxes';
  }
  if (/trap|snare|wire|spike|poison|dart|alarm/.test(item)) {
    return 'traps';
  }
  if (/potion|scroll|gem|jewel|idol|ring|amulet|coin|gold|silver|weapon|blade|wand|staff/.test(item)) {
    return 'loot';
  }
  if (/chair|table|banner|mural|bookshelf|torch|brazier|bed|altar|statue|cobweb/.test(item)) {
    return 'contents';
  }
  return null;
}

async function loadRuntimeDefaults(config) {
  if (runtimePoolsReady) {
    return;
  }
  if (runtimePoolsLoading) {
    await runtimePoolsLoading;
    return;
  }

  runtimePoolsLoading = (async () => {
    resetRuntimeDefaults();
    if (!window.WizardawnData) {
      runtimePoolsReady = true;
      return;
    }

    try {
      const terrainToken = normalizeText(config.terrain).toUpperCase();
      const [monsters, stores, geomorphs] = await Promise.all([
        window.WizardawnData.getMonstersForGame('ALL'),
        window.WizardawnData.getStoreItems(),
        window.WizardawnData.getGeomorphs()
      ]);

      const enemyRows = (monsters || [])
        .filter((row) => !terrainToken || (row.terrains || []).includes(terrainToken))
        .slice(0, 500)
        .map((row) => ({
          name: toTitleCase(row.name || ''),
          level: Math.max(1, Number(row.difficulty || 1) || 1),
          detail: row.location ? `Terrain: ${row.location}` : 'Roaming threat'
        }))
        .filter((entry) => entry.name);
      if (enemyRows.length) {
        const dedupMap = new Map(runtimeDefaults.enemies.map((entry) => [entry.name.toLowerCase(), entry]));
        enemyRows.forEach((entry) => {
          if (!dedupMap.has(entry.name.toLowerCase())) {
            dedupMap.set(entry.name.toLowerCase(), entry);
          }
        });
        runtimeDefaults.enemies = [...dedupMap.values()];
      }

      const storeText = (stores || [])
        .map((row) => toTitleCase(row.item || ''))
        .filter((item) => item.length >= 4 && item.length <= 60);
      const storeBuckets = {
        traps: [],
        contents: [],
        loot: [],
        boxes: []
      };
      storeText.forEach((item) => {
        const bucket = classifyStoreItem(item);
        if (bucket) {
          storeBuckets[bucket].push(item);
        }
      });

      const geoTerms = uniqueStrings((geomorphs || []).flatMap((row) => [toTitleCase(row.more || ''), toTitleCase(row.delve || ''), toTitleCase(row.spot || '')]));
      runtimeDefaults.contents = uniqueStrings([...runtimeDefaults.contents, ...storeBuckets.contents, ...geoTerms]);
      runtimeDefaults.traps = uniqueStrings([...runtimeDefaults.traps, ...storeBuckets.traps]);
      runtimeDefaults.loot = uniqueStrings([...runtimeDefaults.loot, ...storeBuckets.loot]);
      runtimeDefaults.boxes = uniqueStrings([...runtimeDefaults.boxes, ...storeBuckets.boxes]);
    } catch (error) {
      console.warn('area runtime data enrichment failed; using fallback defaults', error);
      resetRuntimeDefaults();
    }

    runtimePoolsReady = true;
  })();

  try {
    await runtimePoolsLoading;
  } finally {
    runtimePoolsLoading = null;
  }
}

function parseMainEncounters(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const bits = line.split('\t').map((value) => value.trim());
      if (bits.length >= 2 && !Number.isNaN(Number(bits[1]))) {
        return {
          name: bits[0] || 'Main Encounter',
          level: Number(bits[1]) || 1,
          detail: bits[2] || bits[0] || 'Custom encounter'
        };
      }
      return {
        name: bits[0] || 'Main Encounter',
        level: 1,
        detail: bits[0] || 'Custom encounter'
      };
    });
}

function parseData(text) {
  const parsed = {
    enemies: [],
    traps: [],
    contents: [],
    loot: [],
    boxes: []
  };

  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [rawPrefix, ...rest] = line.split(':');
      if (!rest.length) return;
      const prefix = rawPrefix.trim().toLowerCase();
      const value = rest.join(':').trim();
      if (!value) return;

      if (prefix === 'enemy') {
        const enemyBits = value.split(',').map((v) => v.trim());
        const levelMatch = value.match(/level\s*(\d+)/i);
        parsed.enemies.push({
          name: enemyBits[0] || value,
          level: levelMatch ? Number(levelMatch[1]) : 1,
          detail: enemyBits.slice(1).join(', ') || enemyBits[0] || value
        });
      } else if (prefix === 'trap') {
        parsed.traps.push(value);
      } else if (prefix === 'content' || prefix === 'contents') {
        parsed.contents.push(value);
      } else if (prefix === 'loot') {
        parsed.loot.push(value);
      } else if (prefix === 'box' || prefix === 'container') {
        parsed.boxes.push(value);
      }
    });

  return parsed;
}

function chancePasses(rng, chance, lowStep, index) {
  const effective = Math.max(0, Math.min(100, chance - (index * lowStep)));
  return randomInt(rng, 1, 100) <= effective;
}

function generateAreaRooms(config, rng, pools) {
  const rooms = [];
  for (let roomNo = 1; roomNo <= config.areas; roomNo += 1) {
    let encounterLevel = 0;
    const room = {
      room: roomNo,
      encounters: [],
      contents: [],
      loot: [],
      traps: []
    };

    const encCount = randomInt(rng, config.encMin, config.encMax);
    for (let index = 0; index < encCount; index += 1) {
      if (!chancePasses(rng, config.encChance, config.encLow, index)) continue;

      const useMain = config.mainEncounters.length && randomInt(rng, 1, 100) <= config.mainChance;
      const encounter = useMain ? pick(rng, config.mainEncounters) : pick(rng, pools.enemies);
      encounterLevel = Math.max(encounterLevel, encounter.level || 1);
      room.encounters.push({
        name: encounter.name,
        detail: encounter.detail,
        level: encounter.level || 1
      });
    }

    const contentsCount = randomInt(rng, config.contentsMin, config.contentsMax);
    for (let index = 0; index < contentsCount; index += 1) {
      if (!chancePasses(rng, config.contentsChance, config.contentsLow, index)) continue;
      room.contents.push(pick(rng, pools.contents));
    }

    const lootAdjustment = config.lootAdjust ? encounterLevel * config.adjustment : 0;
    const lootCount = randomInt(rng, config.lootMin, config.lootMax);
    for (let index = 0; index < lootCount; index += 1) {
      const chance = Math.min(100, config.lootChance + lootAdjustment);
      if (!chancePasses(rng, chance, config.lootLow, index)) continue;

      const trapped = randomInt(rng, 1, 100) <= config.riggedChance;
      room.loot.push({
        box: pick(rng, pools.boxes),
        items: [pick(rng, pools.loot)],
        trapped,
        trap: trapped ? pick(rng, pools.traps) : null
      });
    }

    const trapCount = Math.max(0, randomInt(rng, config.trapMin, config.trapMax) - room.loot.filter((item) => item.trapped).length);
    for (let index = 0; index < trapCount; index += 1) {
      if (!chancePasses(rng, config.trapChance, config.trapLow, index)) continue;
      room.traps.push(pick(rng, pools.traps));
    }

    rooms.push(room);
  }

  return rooms;
}

function renderResult(result) {
  output.innerHTML = '';

  const heading = document.createElement('div');
  heading.className = 'area-heading';
  const name = result.config.areaName?.trim() || 'Random Area';
  heading.textContent = `${name}${result.config.level > 0 ? ` · Level ${result.config.level}` : ''} · ${result.payload.areas.length} room(s)`;
  output.appendChild(heading);

  result.payload.areas.forEach((room) => {
    const card = document.createElement('article');
    card.className = 'area-card';

    const title = document.createElement('div');
    title.className = 'area-title';
    title.textContent = `${room.room}.`;
    card.appendChild(title);

    if (room.encounters.length) {
      const block = document.createElement('div');
      block.className = 'area-block';
      block.innerHTML = `<strong>Encounter:</strong> ${room.encounters.map((enc) => `${enc.name}${enc.detail ? ` - ${enc.detail}` : ''}`).join('; ')}`;
      card.appendChild(block);
    }
    if (room.contents.length) {
      const block = document.createElement('div');
      block.className = 'area-block';
      block.innerHTML = `<strong>Contents:</strong> ${room.contents.join('; ')}`;
      card.appendChild(block);
    }
    if (room.loot.length) {
      const block = document.createElement('div');
      block.className = 'area-block';
      block.innerHTML = `<strong>Loot:</strong> ${room.loot.map((loot) => `[${loot.box}${loot.trapped ? ` - TRAPPED: ${loot.trap}` : ''}: ${loot.items.join(', ')}]`).join(' ; ')}`;
      card.appendChild(block);
    }
    if (room.traps.length) {
      const block = document.createElement('div');
      block.className = 'area-block';
      block.innerHTML = `<strong>Room Trap:</strong> ${room.traps.join('; ')}`;
      card.appendChild(block);
    }

    if (!room.encounters.length && !room.contents.length && !room.loot.length && !room.traps.length) {
      const block = document.createElement('div');
      block.className = 'area-block';
      block.textContent = 'No notable features.';
      card.appendChild(block);
    }

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const config = {
    areaName: formData.get('areaName')?.toString() || '',
    level: Math.max(0, Math.min(100, Number(formData.get('level') || 0))),
    areas: Math.max(1, Math.min(1000, Number(formData.get('areas') || 1))),
    terrain: formData.get('terrain')?.toString().trim() || '',
    encChance: Math.max(0, Math.min(100, Number(formData.get('encChance') || 30))),
    encMin: Math.max(1, Math.min(10, Number(formData.get('encMin') || 1))),
    encMax: Math.max(1, Math.min(10, Number(formData.get('encMax') || 3))),
    encLow: Math.max(0, Math.min(100, Number(formData.get('encLow') || 0))),
    trapChance: Math.max(0, Math.min(100, Number(formData.get('trapChance') || 10))),
    trapMin: Math.max(1, Math.min(10, Number(formData.get('trapMin') || 1))),
    trapMax: Math.max(1, Math.min(10, Number(formData.get('trapMax') || 2))),
    trapLow: Math.max(0, Math.min(100, Number(formData.get('trapLow') || 0))),
    contentsChance: Math.max(0, Math.min(100, Number(formData.get('contentsChance') || 20))),
    contentsMin: Math.max(1, Math.min(25, Number(formData.get('contentsMin') || 1))),
    contentsMax: Math.max(1, Math.min(25, Number(formData.get('contentsMax') || 3))),
    contentsLow: Math.max(0, Math.min(100, Number(formData.get('contentsLow') || 0))),
    lootChance: Math.max(0, Math.min(100, Number(formData.get('lootChance') || 10))),
    lootMin: Math.max(1, Math.min(25, Number(formData.get('lootMin') || 1))),
    lootMax: Math.max(1, Math.min(25, Number(formData.get('lootMax') || 10))),
    lootLow: Math.max(0, Math.min(100, Number(formData.get('lootLow') || 5))),
    riggedChance: Math.max(0, Math.min(100, Number(formData.get('riggedChance') || 25))),
    lootAdjust: formData.get('lootAdjust') === '1',
    adjustment: Math.max(0, Math.min(100, Number(formData.get('adjustment') || 5))),
    mainChance: Math.max(0, Math.min(100, Number(formData.get('mainChance') || 50))),
    mainEncounters: parseMainEncounters(formData.get('mainEncounters')?.toString() || '')
  };

  await loadRuntimeDefaults(config);

  config.encMax = Math.max(config.encMin, config.encMax);
  config.trapMax = Math.max(config.trapMin, config.trapMax);
  config.contentsMax = Math.max(config.contentsMin, config.contentsMax);
  config.lootMax = Math.max(config.lootMin, config.lootMax);

  const parsedData = parseData(formData.get('data')?.toString() || '');
  const pools = {
    enemies: parsedData.enemies.length ? parsedData.enemies : runtimeDefaults.enemies,
    traps: parsedData.traps.length ? parsedData.traps : runtimeDefaults.traps,
    contents: parsedData.contents.length ? parsedData.contents : runtimeDefaults.contents,
    loot: parsedData.loot.length ? parsedData.loot : runtimeDefaults.loot,
    boxes: parsedData.boxes.length ? parsedData.boxes : runtimeDefaults.boxes
  };

  const areas = generateAreaRooms(config, rng, pools);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      areas
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
Areas: ${lastResult.payload.areas.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
