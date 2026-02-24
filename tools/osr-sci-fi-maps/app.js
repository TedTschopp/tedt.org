const toolId = 'smap';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: {
    width: 4,
    height: 4,
    type: 'Building',
    colored: '0',
    keyed: true,
    startNumber: 1
  },
  payload: {
    tiles: [],
    innerClimate: null
  }
};

const FALLBACK_TILE_LABELS = {
  building: ['Building', 'Outpost', 'Station'],
  ship: ['Spaceship', 'Derelict', 'Hull Section'],
  climateDesert: ['Desert Region', 'Barren Sector', 'Dune Zone'],
  climateWoods: ['Forest Region', 'Jungle Sector', 'Swamp Zone']
};

const FALLBACK_IMAGE_POOLS = {
  building: [],
  ship: [],
  climateDesert: [],
  climateWoods: []
};

let smapLabelPools = {
  building: [...FALLBACK_TILE_LABELS.building],
  ship: [...FALLBACK_TILE_LABELS.ship],
  climateDesert: [...FALLBACK_TILE_LABELS.climateDesert],
  climateWoods: [...FALLBACK_TILE_LABELS.climateWoods]
};

let smapImagePools = {
  building: [...FALLBACK_IMAGE_POOLS.building],
  ship: [...FALLBACK_IMAGE_POOLS.ship],
  climateDesert: [...FALLBACK_IMAGE_POOLS.climateDesert],
  climateWoods: [...FALLBACK_IMAGE_POOLS.climateWoods]
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
  if (state === 0) {
    state = 123456789;
  }
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

function pickOrNull(rng, list) {
  return list && list.length ? pick(rng, list) : null;
}

function chooseClimate(rng) {
  return randomInt(rng, 1, 100) > 30 ? 'desert' : 'woods';
}

function uniqueValues(list) {
  return [...new Set(list.filter(Boolean))];
}

async function loadSmapLegendData() {
  if (window.__wizSmapLegendReady) {
    return;
  }

  const rows = await window.WizardawnData.getWorldmapLegend();
  const names = rows.map((row) => row.nameClean).filter(Boolean);

  const geomorphs = await window.WizardawnData.getGeomorphs();
  const sciFiRows = (geomorphs || []).filter((row) => String(row.terrain || '').toLowerCase().startsWith('scifi'));
  const imageBuckets = {
    building: [],
    ship: [],
    climateDesert: [],
    climateWoods: []
  };

  sciFiRows.forEach((row) => {
    const terrain = String(row.terrain || '').toLowerCase();
    const image = String(row.image || '').toLowerCase();
    if (!image) return;
    if (terrain.includes('ship')) imageBuckets.ship.push(image);
    else if (terrain.includes('desert')) imageBuckets.climateDesert.push(image);
    else if (terrain.includes('woods') || terrain.includes('wood') || terrain.includes('jungle') || terrain.includes('swamp')) imageBuckets.climateWoods.push(image);
    else imageBuckets.building.push(image);
  });

  smapLabelPools = {
    building: uniqueValues(names.filter((name) => /city|village|outpost|station|factory|base|fort|tower|temple|ruins|dungeon|camp/i.test(name))),
    ship: uniqueValues(names.filter((name) => /ship|spaceship|space station|crashed/i.test(name))),
    climateDesert: uniqueValues(names.filter((name) => /desert|barren|broken|wast|crater/i.test(name))),
    climateWoods: uniqueValues(names.filter((name) => /forest|jungle|swamp|grass|marsh|fungal/i.test(name)))
  };

  Object.keys(FALLBACK_TILE_LABELS).forEach((key) => {
    if (!smapLabelPools[key] || !smapLabelPools[key].length) {
      smapLabelPools[key] = [...FALLBACK_TILE_LABELS[key]];
    }
    smapImagePools[key] = uniqueValues([...(imageBuckets[key] || []), ...FALLBACK_IMAGE_POOLS[key]]);
  });

  window.__wizSmapLegendReady = true;
}

function generateMap(config, rng) {
  const tiles = [];
  let number = config.startNumber;
  const centerRow = Math.floor(config.height / 2);
  const centerCol = Math.floor(config.width / 2);
  const innerClimate = config.type === 'Exodus Spaceship' ? chooseClimate(rng) : null;

  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      let tileType = config.type === 'Building' ? 'building' : 'ship';

      if (
        config.type === 'Exodus Spaceship' &&
        row === centerRow &&
        col === centerCol
      ) {
        tileType = innerClimate === 'desert' ? 'climate-desert' : 'climate-woods';
      }

      const tileName = tileType === 'building'
        ? pick(rng, smapLabelPools.building)
        : tileType === 'ship'
          ? pick(rng, smapLabelPools.ship)
          : tileType === 'climate-desert'
            ? pick(rng, smapLabelPools.climateDesert)
            : pick(rng, smapLabelPools.climateWoods);

      const tileImage = tileType === 'building'
        ? pickOrNull(rng, smapImagePools.building)
        : tileType === 'ship'
          ? pickOrNull(rng, smapImagePools.ship)
          : tileType === 'climate-desert'
            ? pickOrNull(rng, smapImagePools.climateDesert)
            : pickOrNull(rng, smapImagePools.climateWoods);

      rowTiles.push({
        row,
        col,
        tileType,
        tileName,
        tileImage,
        key: config.keyed ? number : null
      });

      if (config.keyed) {
        number += 1;
      }
    }
    tiles.push(rowTiles);
  }

  return { tiles, innerClimate };
}

function buildMapPreview(result) {
  return {
    title: 'Generated Map',
    mapWide: result.config.width,
    mapHigh: result.config.height,
    hasTiles: true,
    rows: (result.payload.tiles || []).map((rowTiles) =>
      rowTiles.map((tile) => ({
        image: tile.tileImage,
        label: tile.tileName || tile.tileType,
        key: tile.key,
        type: tile.tileType
      }))
    )
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'scifi-summary';
  summary.textContent = `Sci-Fi map ${result.config.width}×${result.config.height} · ${result.config.type} · ${result.config.colored === '0' ? 'Classic Blue' : 'Black & White'} · keyed ${result.config.keyed ? 'on' : 'off'}`;
  output.appendChild(summary);

  if (result.payload.innerClimate) {
    const climate = document.createElement('div');
    climate.className = 'small text-muted mb-2';
    climate.textContent = `Exodus inner climate: ${result.payload.innerClimate}`;
    output.appendChild(climate);
  }

  if (window.WizardawnMap?.createGeomorphMapCard) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(buildMapPreview(result), {
      title: 'Generated Map',
      assetBase: '../osr-support-files/assets/maps/',
      wrapClass: `wiz-map-grid ${result.config.colored === '0' ? 'palette-blue' : 'palette-bw'}`
    });
    output.appendChild(mapCard);
  }

  const note = document.createElement('div');
  note.className = 'small text-muted';
  note.textContent = 'Map uses legacy-inspired geomorph selection (building, ship, or Exodus climate-center variant).';
  output.appendChild(note);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadSmapLegendData();

  const formData = new FormData(form);
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const type = formData.get('type')?.toString() || 'Building';
  const colored = formData.get('geomorph_colored')?.toString() === '1' ? '1' : '0';
  const keyed = formData.get('keyed') === '1';
  const startNumber = Math.min(1000, Math.max(1, Number(formData.get('map_numbers') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const config = {
    width,
    height,
    type,
    colored,
    keyed,
    startNumber
  };

  const generated = generateMap(config, rng);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      tiles: generated.tiles,
      innerClimate: generated.innerClimate
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
Map size: ${lastResult.config.width}x${lastResult.config.height}
Type: ${lastResult.config.type}
Color mode: ${lastResult.config.colored === '0' ? 'Classic Blue' : 'Black & White'}
Keyed: ${lastResult.config.keyed ? 'yes' : 'no'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
