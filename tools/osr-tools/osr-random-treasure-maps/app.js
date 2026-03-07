const toolId = 'tmap';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const fallbackMapMediums = ['aged parchment', 'stitched leather strip', 'etched copper plate', 'wax tablet', 'charcoal cave sketch', 'velum scroll'];
const fallbackMapLocations = ['inside a false-bottom chest', 'sewn into a cloak hem', 'tattooed on a corpse', 'hidden in a chapel reliquary', 'inside a hollow staff', 'wedged behind a tavern beam'];
const fallbackMapLegends = ['three black oaks and a moon-shaped hill', 'the old king road split marker', 'a drowned watchtower', 'the serpent canyon crossing', 'the stone face of the giant', 'the obsidian circle in the marsh'];
const fallbackProtections = ['skeletal guardians', 'a cursed idol', 'collapsing tunnel triggers', 'poison dart gallery', 'riddle-bound gate', 'patrolling brigands'];
const boxes = ['weathered chest', 'ironbound coffer', 'sealed urn', 'bone tube cache', 'masoned stone box'];

const defaultLoot = ['3,400 sp and 820 gp', 'a silver coronet with opals', 'bundle of old coinage', 'carved jade figurine', 'satin purse of mixed gems'];
const defaultMagic = ['+1 sword', 'ring of protection', 'wand of sparks', 'staff of warding', 'scroll case of incantations'];
const defaultTraps = ['needle trap', 'pit deadfall', 'sleeping gas release', 'flame jet trigger', 'alarm sigil'];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    maps: []
  }
};

let mapFlavorPools = {
  mediums: fallbackMapMediums,
  locations: fallbackMapLocations,
  legends: fallbackMapLegends,
  protections: fallbackProtections,
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
  if (state === 0) state = 123123123;
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

function toRoman(value) {
  const numerals = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ];
  let number = value;
  let result = '';
  numerals.forEach(([symbol, amount]) => {
    while (number >= amount) {
      result += symbol;
      number -= amount;
    }
  });
  return result;
}

function parseDataLines(text) {
  const parsed = {
    loot: [],
    magic: [],
    trap: []
  };

  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [prefixRaw, ...rest] = line.split(':');
      if (!rest.length) return;
      const prefix = prefixRaw.trim().toLowerCase();
      const value = rest.join(':').trim();
      if (!value) return;
      if (prefix === 'loot') parsed.loot.push(value);
      if (prefix === 'magic') parsed.magic.push(value);
      if (prefix === 'trap') parsed.trap.push(value);
    });

  return parsed;
}

function titleCaseWords(text) {
  return String(text || '')
    .split(/\s+/)
    .map((chunk) => chunk ? `${chunk[0].toUpperCase()}${chunk.slice(1)}` : '')
    .join(' ')
    .trim();
}

function makeUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function loadMapFlavorPools() {
  if (!window.WizardawnData?.getMapsCreated) {
    return;
  }

  try {
    const maps = await window.WizardawnData.getMapsCreated();
    if (!Array.isArray(maps) || !maps.length) {
      return;
    }

    const allEntries = maps.flatMap((row) => Array.isArray(row.entries) ? row.entries : []);
    const artists = makeUnique(allEntries.map((entry) => titleCaseWords(entry.artist || '')));
    const terrains = makeUnique(allEntries.map((entry) => (entry.terrain || '').toLowerCase()));
    const spots = makeUnique(allEntries.map((entry) => titleCaseWords((entry.spot || '').replace(/_/g, ' '))));

    const mediums = makeUnique(artists.map((artist) => `${artist} field parchment`));
    const locations = makeUnique(spots.map((spot) => `folded into notes marked “${spot}”`));
    const legends = makeUnique(
      terrains.flatMap((terrain) => artists.slice(0, 8).map((artist) => `the ${terrain} route sketched in ${artist} style`))
    );
    const protections = makeUnique(
      terrains.map((terrain) => {
        if (terrain === 'cave') return 'unstable cave choke points';
        if (terrain === 'dungeon') return 'sealed dungeon gateworks';
        return `${terrain} hazard wards`;
      })
    );

    mapFlavorPools = {
      mediums: mediums.length ? mediums : fallbackMapMediums,
      locations: locations.length ? locations : fallbackMapLocations,
      legends: legends.length ? legends : fallbackMapLegends,
      protections: protections.length ? protections : fallbackProtections,
    };
  } catch (error) {
    console.warn('Unable to load maps_created flavor pools for tmap:', error);
  }
}

function resolvedLevel(levelInput, game, rng) {
  if (levelInput.toLowerCase() === 'random') {
    const max = game === 'Swords & Six-Siders' ? 6 : 20;
    return randomInt(rng, 1, max);
  }
  const numeric = Number(levelInput);
  if (Number.isNaN(numeric)) return 1;
  const max = game === 'Swords & Six-Siders' ? 6 : 20;
  return Math.max(1, Math.min(max, numeric));
}

function buildTreasure(rng, level, game, magicGamePercent, pools) {
  const cut = game === 'Swords & Six-Siders' ? Math.ceil(randomInt(rng, 25, 50) / 5) : randomInt(rng, 25, 50);
  const itemsToGenerate = level + randomInt(rng, 2, 10);
  const generated = [];
  let hasCoins = false;

  for (let idx = 0; idx < itemsToGenerate; idx += 1) {
    let rollFloor = hasCoins ? 91 : 1;
    const rewardRoll = randomInt(rng, rollFloor, 100);

    if (rewardRoll < 91) {
      generated.push(`${randomInt(rng, cut * 10, cut * 100)} gp in mixed coinage`);
      hasCoins = true;
    } else if (rewardRoll < 96) {
      generated.push(`${randomInt(rng, 1, 3)} gems (${pick(rng, ['amber', 'onyx', 'sapphire', 'garnet'])})`);
    } else if (rewardRoll < 98) {
      generated.push(pick(rng, ['gold torque', 'jeweled bracelet', 'obsidian ring', 'silver filigree mask']));
    } else {
      const gameMagic = randomInt(rng, 1, 100) <= magicGamePercent;
      const pool = pools.magic.length ? pools.magic : defaultMagic;
      generated.push(gameMagic ? `${pick(rng, pool)} (${game})` : `${pick(rng, defaultMagic)} (Wizardawn)`);
    }
  }

  return generated;
}

function buildMapRecord(index, config, rng, parsedData) {
  const level = resolvedLevel(config.levelInput, config.game, rng);
  const rank = toRoman(level);
  const isFalse = randomInt(rng, 1, 100) <= 8;
  const isRansacked = !isFalse && randomInt(rng, 1, 100) <= 12;
  const loot = buildTreasure(rng, level, config.game, config.whichMagic, parsedData);

  const trapped = randomInt(rng, 1, 100) <= Math.min(95, level + 50);
  const trapPool = parsedData.trap.length ? parsedData.trap : defaultTraps;
  const map = {
    id: index + 1,
    rank,
    level,
    game: config.game,
    medium: pick(rng, mapFlavorPools.mediums),
    foundAt: pick(rng, mapFlavorPools.locations),
    legend: pick(rng, mapFlavorPools.legends),
    protection: pick(rng, mapFlavorPools.protections),
    falseMap: isFalse,
    alreadyRansacked: isRansacked,
    treasure: {
      container: pick(rng, boxes),
      trapped,
      trap: trapped ? pick(rng, trapPool) : null,
      items: isFalse ? ['misleading marks, no treasure'] : isRansacked ? ['signs of prior looting', 'scattered debris'] : loot
    },
    options: {
      ua: config.ua,
      aec: config.aec,
      oldway: config.oldway,
      magicFromGamePercent: config.whichMagic
    }
  };

  if (config.game === 'Data') {
    const dataLoot = parsedData.loot.length ? parsedData.loot : defaultLoot;
    map.treasure.items = isFalse ? ['misleading marks, no treasure'] : isRansacked ? ['signs of prior looting', 'scattered debris'] : [pick(rng, dataLoot), ...loot.slice(0, Math.max(1, Math.floor(level / 4)))];
  }

  return map;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.maps.length) {
    output.innerHTML = '<em>No maps generated.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'map-summary';
  summary.textContent = `${result.payload.maps.length} treasure map(s) · ${result.config.game}`;
  output.appendChild(summary);

  result.payload.maps.forEach((map) => {
    const card = document.createElement('article');
    card.className = 'map-card';

    const title = document.createElement('div');
    title.className = 'map-title';
    title.textContent = `Map ${map.id} · Rank ${map.rank} · Level ${map.level}`;
    card.appendChild(title);

    const blockA = document.createElement('div');
    blockA.className = 'map-block';
    blockA.innerHTML = `<strong>Legend:</strong> ${map.legend}`;
    card.appendChild(blockA);

    const blockB = document.createElement('div');
    blockB.className = 'map-block';
    blockB.innerHTML = `<strong>Written On:</strong> ${map.medium} · <strong>Found:</strong> ${map.foundAt}`;
    card.appendChild(blockB);

    const blockC = document.createElement('div');
    blockC.className = 'map-block';
    blockC.innerHTML = `<strong>Protection:</strong> ${map.protection}`;
    card.appendChild(blockC);

    const status = map.falseMap ? 'False Map' : map.alreadyRansacked ? 'Ransacked' : 'Active Lead';
    const blockD = document.createElement('div');
    blockD.className = 'map-block';
    blockD.innerHTML = `<strong>Status:</strong> ${status}`;
    card.appendChild(blockD);

    const trapInfo = map.treasure.trapped ? ` - TRAPPED: ${map.treasure.trap}` : '';
    const blockE = document.createElement('div');
    blockE.className = 'map-block';
    blockE.innerHTML = `<strong>Treasure:</strong> [${map.treasure.container}${trapInfo}: ${map.treasure.items.join(' - - - - - ')}]`;
    card.appendChild(blockE);

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadMapFlavorPools();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const config = {
    amount: Math.max(1, Math.min(100, Number(formData.get('amount') || 1))),
    levelInput: formData.get('level')?.toString().trim() || 'Random',
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    whichMagic: Math.max(0, Math.min(100, Number(formData.get('whichMagic') || 50))),
    ua: formData.get('ua') === '1',
    aec: formData.get('aec') === '1',
    oldway: formData.get('oldway') === '1'
  };

  const parsedData = parseDataLines(formData.get('data')?.toString() || '');
  const maps = [];
  for (let index = 0; index < config.amount; index += 1) {
    maps.push(buildMapRecord(index, config, rng, parsedData));
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      maps
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
Maps: ${lastResult.payload.maps.length}
Game: ${lastResult.config?.game || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
