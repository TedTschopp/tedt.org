const toolId = 'villg';
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
    settlementType: 'City',
    width: 4,
    height: 4,
    keyed: true,
    startNumber: 1
  },
  payload: {
    kingdomSize: 16,
    rulerTier: null,
    placeCastle: null,
    tiles: []
  }
};

const fallbackTilePools = {
  city: ['city'],
  keep: ['keep'],
  village: ['village'],
  dock: ['dock']
};

let tilePools = {
  city: [...fallbackTilePools.city],
  keep: [...fallbackTilePools.keep],
  village: [...fallbackTilePools.village],
  dock: [...fallbackTilePools.dock]
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

function pick(rng, list) {
  return list[randomInt(rng, 0, list.length - 1)];
}

function mapAssetPath(imageName) {
  if (!imageName) return '';
  return `../osr-support-files/assets/maps/${encodeURIComponent(imageName)}`;
}

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function resetTilePools() {
  tilePools = {
    city: [...fallbackTilePools.city],
    keep: [...fallbackTilePools.keep],
    village: [...fallbackTilePools.village],
    dock: [...fallbackTilePools.dock]
  };
}

async function loadVillgTilePools() {
  resetTilePools();

  if (!window.WizardawnData?.getGeomorphs) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getGeomorphs();
    if (!Array.isArray(rows) || !rows.length) {
      return;
    }

    const city = [];
    const keep = [];
    const village = [];
    const dock = [];

    rows.forEach((row) => {
      const terrain = normalizeText(row.terrain);
      const image = normalizeText(row.image);
      if (!image) return;

      const isCityDock = image.includes('citdock_');
      const isKeepDock = image.includes('keep_d_');
      if (isCityDock || isKeepDock) {
        dock.push(image);
      }

      if (terrain === 'city') {
        city.push(image);
      } else if (terrain.startsWith('keep')) {
        keep.push(image);
      } else if (terrain === 'village') {
        village.push(image);
      }
    });

    tilePools.city = unique([...city, ...fallbackTilePools.city]);
    tilePools.keep = unique([...keep, ...fallbackTilePools.keep]);
    tilePools.village = unique([...village, ...fallbackTilePools.village]);
    tilePools.dock = unique([...dock, ...fallbackTilePools.dock]);
  } catch (error) {
    console.warn('Unable to load villg geomorph tile pools:', error);
    resetTilePools();
  }
}

function resolveRulerTier(rng, kingdomSize) {
  if (kingdomSize >= 50) return 'keep_king';
  if (kingdomSize >= 20) return randomInt(rng, 1, 2) === 1 ? 'keep_king' : 'keep_prince';
  if (kingdomSize >= 5) return randomInt(rng, 1, 2) === 1 ? 'keep_baron' : 'keep_prince';
  return 'keep_baron';
}

function chooseTileType(rng, settlementType) {
  if (settlementType === 'Village') {
    return pick(rng, ['village', 'village', 'village', 'dock']);
  }
  if (settlementType === 'Keep') {
    return pick(rng, ['keep', 'keep', 'keep', 'dock']);
  }
  return pick(rng, ['city', 'city', 'city', 'dock']);
}

function generateSettlement(config, rng) {
  const kingdomSize = config.width * config.height;
  const placeCastleRoll = randomInt(rng, 1, kingdomSize);
  const placeCastle = randomInt(rng, 1, 2) === 1 ? 0 : placeCastleRoll;
  const rulerTier = config.settlementType === 'Village' ? 'village_ruler' : resolveRulerTier(rng, kingdomSize);

  const tiles = [];
  let area = config.startNumber;
  let linear = 1;
  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      let type = chooseTileType(rng, config.settlementType);
      if (placeCastle !== 0 && linear === placeCastle) {
        type = 'castle';
      }

      const sourcePool = type === 'city' || type === 'keep' || type === 'village' || type === 'dock'
        ? tilePools[type]
        : [];

      rowTiles.push({
        row,
        col,
        type,
        source: sourcePool.length ? pick(rng, sourcePool) : null,
        key: config.keyed ? area : null
      });
      if (config.keyed) area += 1;
      linear += 1;
    }
    tiles.push(rowTiles);
  }

  return { kingdomSize, placeCastle, rulerTier, tiles };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'villg-summary';
  summary.textContent = `${result.config.settlementType} map ${result.config.width}×${result.config.height} · keyed ${result.config.keyed ? 'on' : 'off'} · ruler tier ${result.payload.rulerTier}`;
  output.appendChild(summary);

  const table = document.createElement('table');
  table.className = 'villg-grid';

  result.payload.tiles.forEach((rowTiles) => {
    const row = document.createElement('tr');
    rowTiles.forEach((tile) => {
      const cell = document.createElement('td');
      cell.className = `tile-${tile.type}`;

      if (tile.source) {
        const img = document.createElement('img');
        img.className = 'tile-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = tile.source;
        img.src = mapAssetPath(tile.source);
        img.addEventListener('error', () => {
          img.remove();
          if (!cell.querySelector('.tile-label')) {
            const fallback = document.createElement('span');
            fallback.className = 'tile-label';
            fallback.textContent = tile.type;
            cell.appendChild(fallback);
          }
        });
        cell.appendChild(img);
      }

      if (!tile.source) {
        const label = document.createElement('span');
        label.className = 'tile-label';
        label.textContent = tile.type;
        cell.appendChild(label);
      }

      if (tile.key !== null) {
        const key = document.createElement('span');
        key.className = 'tile-key';
        key.textContent = `#${tile.key}`;
        cell.appendChild(key);
      }

      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  output.appendChild(table);

  const note = document.createElement('div');
  note.className = 'small text-muted';
  note.textContent = `Kingdom size: ${result.payload.kingdomSize} · castle placement index: ${result.payload.placeCastle}`;
  output.appendChild(note);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const settlementType = formData.get('type')?.toString() || 'City';
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const keyed = formData.get('keyed') === '1';
  const startNumber = Math.min(1000, Math.max(1, Number(formData.get('map_numbers') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadVillgTilePools();

  const config = { settlementType, width, height, keyed, startNumber };
  const generated = generateSettlement(config, rng);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      kingdomSize: generated.kingdomSize,
      rulerTier: generated.rulerTier,
      placeCastle: generated.placeCastle,
      tiles: generated.tiles
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
Settlement type: ${lastResult.config.settlementType}
Map size: ${lastResult.config.width}x${lastResult.config.height}
Keyed: ${lastResult.config.keyed ? 'yes' : 'no'}
Ruler tier: ${lastResult.payload.rulerTier}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
