const toolId = 'acity';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const FALLBACK_TILE_FLAVORS = {
  'ruined-building': ['ruined-building', 'collapsed tower', 'broken apartments'],
  'ruined-street': ['ruined-street', 'choked avenue', 'cracked junction'],
  'debris-field': ['debris-field', 'scrap scatter', 'shattered masonry'],
  'collapsed-zone': ['collapsed-zone', 'sinkhole block', 'fallen structure'],
  'overgrown-block': ['overgrown-block', 'vine district', 'rooted ruins']
};

let runtimeTileFlavors = {
  'ruined-building': [...FALLBACK_TILE_FLAVORS['ruined-building']],
  'ruined-street': [...FALLBACK_TILE_FLAVORS['ruined-street']],
  'debris-field': [...FALLBACK_TILE_FLAVORS['debris-field']],
  'collapsed-zone': [...FALLBACK_TILE_FLAVORS['collapsed-zone']],
  'overgrown-block': [...FALLBACK_TILE_FLAVORS['overgrown-block']]
};

let runtimeTileImages = {
  'ruined-building': [],
  'ruined-street': [],
  'debris-field': [],
  'collapsed-zone': [],
  'overgrown-block': []
};

function buildRuinsImageList(max) {
  const images = [];
  for (let index = 1; index <= max; index += 1) {
    if (index < 10) {
      images.push(`ruins_0${index}.gif`);
    } else {
      images.push(`ruins_${index}.gif`);
    }
  }
  return images;
}

const FALLBACK_RUINS_IMAGES = buildRuinsImageList(181);

let runtimePoolsReady = false;
let runtimePoolsLoading = null;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: {
    width: 4,
    height: 4,
    keyed: true,
    startNumber: 1
  },
  payload: {
    tiles: []
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
  if (state === 0) state = 123456789;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randomFrom(rng, list) {
  return list[randomInt(rng, 0, list.length - 1)];
}

function randomOrNull(rng, list) {
  return list && list.length ? randomFrom(rng, list) : null;
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function titleCase(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) {
    return '';
  }
  return text.replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))];
}

function resetRuntimePools() {
  runtimeTileFlavors = {
    'ruined-building': [...FALLBACK_TILE_FLAVORS['ruined-building']],
    'ruined-street': [...FALLBACK_TILE_FLAVORS['ruined-street']],
    'debris-field': [...FALLBACK_TILE_FLAVORS['debris-field']],
    'collapsed-zone': [...FALLBACK_TILE_FLAVORS['collapsed-zone']],
    'overgrown-block': [...FALLBACK_TILE_FLAVORS['overgrown-block']]
  };
  runtimeTileImages = {
    'ruined-building': [...FALLBACK_RUINS_IMAGES],
    'ruined-street': [...FALLBACK_RUINS_IMAGES],
    'debris-field': [...FALLBACK_RUINS_IMAGES],
    'collapsed-zone': [...FALLBACK_RUINS_IMAGES],
    'overgrown-block': [...FALLBACK_RUINS_IMAGES]
  };
}

function classifyRuinFlavor(text) {
  const value = normalizeText(text);
  if (!value) {
    return null;
  }
  if (/street|road|avenue|junction|way|lane/.test(value)) {
    return 'ruined-street';
  }
  if (/debris|rubble|scrap|wreck|shatter|junk/.test(value)) {
    return 'debris-field';
  }
  if (/collapse|fallen|sink|crater|broken/.test(value)) {
    return 'collapsed-zone';
  }
  if (/vine|moss|root|overgrow|swamp|forest|green/.test(value)) {
    return 'overgrown-block';
  }
  if (/ruin|city|building|block|tower|house|district/.test(value)) {
    return 'ruined-building';
  }
  return null;
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
      const geomorphs = await window.WizardawnData.getGeomorphs();
      const buckets = {
        'ruined-building': [],
        'ruined-street': [],
        'debris-field': [],
        'collapsed-zone': [],
        'overgrown-block': []
      };
      const imageBuckets = {
        'ruined-building': [],
        'ruined-street': [],
        'debris-field': [],
        'collapsed-zone': [],
        'overgrown-block': []
      };

      (geomorphs || []).forEach((row) => {
        const terrain = normalizeText(row.terrain);
        if (!terrain.includes('ruin')) {
          return;
        }

        const image = String(row.image || '').trim().toLowerCase();
        if (image) {
          const imageBucket = classifyRuinFlavor(image) || 'ruined-building';
          imageBuckets[imageBucket].push(image);
        }

        const terms = [row.spot, row.more, row.delve]
          .map((term) => String(term || '').trim())
          .filter(Boolean);
        terms.forEach((term) => {
          const bucket = classifyRuinFlavor(term);
          if (bucket) {
            buckets[bucket].push(titleCase(term));
          }
        });
      });

      Object.keys(buckets).forEach((bucket) => {
        const terms = uniqueStrings(buckets[bucket]);
        if (terms.length) {
          runtimeTileFlavors[bucket] = uniqueStrings([...runtimeTileFlavors[bucket], ...terms]);
        }
        runtimeTileImages[bucket] = uniqueStrings([...(imageBuckets[bucket] || []), ...FALLBACK_RUINS_IMAGES]);
      });
    } catch (error) {
      console.warn('acity runtime geomorph enrichment failed; using fallback pools', error);
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

function chooseTileType(rng) {
  const roll = randomInt(rng, 1, 100);
  if (roll <= 35) return 'ruined-building';
  if (roll <= 56) return 'ruined-street';
  if (roll <= 72) return 'debris-field';
  if (roll <= 86) return 'collapsed-zone';
  return 'overgrown-block';
}

function generateRuinedCity(config, rng) {
  const tiles = [];
  let number = config.startNumber;
  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      rowTiles.push({
        row,
        col,
        type: chooseTileType(rng),
        flavor: null,
        source: null,
        key: config.keyed ? number : null
      });
      rowTiles[rowTiles.length - 1].flavor = randomFrom(rng, runtimeTileFlavors[rowTiles[rowTiles.length - 1].type] || [rowTiles[rowTiles.length - 1].type]);
      rowTiles[rowTiles.length - 1].source = randomOrNull(rng, runtimeTileImages[rowTiles[rowTiles.length - 1].type]);
      if (config.keyed) number += 1;
    }
    tiles.push(rowTiles);
  }
  return tiles;
}

function buildMapPreview(result) {
  return {
    title: 'Generated Map',
    mapWide: result.config.width,
    mapHigh: result.config.height,
    hasTiles: true,
    rows: (result.payload.tiles || []).map((rowTiles) =>
      rowTiles.map((tile) => ({
        image: tile.source,
        label: tile.flavor || tile.type,
        key: tile.key,
        type: tile.type
      }))
    )
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'acity-summary';
  summary.textContent = `Ruined city map ${result.config.width}×${result.config.height} · keyed ${result.config.keyed ? 'on' : 'off'}${result.config.keyed ? ` (start ${result.config.startNumber})` : ''}`;
  output.appendChild(summary);

  if (window.WizardawnMap?.createGeomorphMapCard) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(buildMapPreview(result), {
      title: 'Generated Map',
      assetBase: '../osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  const note = document.createElement('div');
  note.className = 'small text-muted';
  note.textContent = 'Map approximates legacy ruined city geomorph behavior.';
  output.appendChild(note);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const keyed = formData.get('keyed') === '1';
  const startNumber = Math.min(1000, Math.max(1, Number(formData.get('map_numbers') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadRuntimePools();

  const config = { width, height, keyed, startNumber };
  const tiles = generateRuinedCity(config, rng);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      tiles
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
