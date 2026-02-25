const toolId = 'suburb';
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
    height: 4
  },
  payload: {
    tiles: []
  }
};

const fallbackTypeWeights = {
  houses: 38,
  road: 16,
  stores: 13,
  park: 11,
  school: 11,
  industrial: 11
};

let typeWeights = { ...fallbackTypeWeights };
let typeSources = {
  houses: [],
  road: [],
  stores: [],
  park: [],
  school: [],
  industrial: []
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

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function classifyGeomorphType(text) {
  const value = String(text || '').toLowerCase();
  if (/\b(road|street|lane|way|avenue|highway)\b/.test(value)) return 'road';
  if (/\b(store|shop|market|mall|bazaar|vendor)\b/.test(value)) return 'stores';
  if (/\b(park|tree|garden|green|playground|field)\b/.test(value)) return 'park';
  if (/\b(school|church|chapel|library|academy|college|hall)\b/.test(value)) return 'school';
  if (/\b(factory|warehouse|industrial|plant|mill|works|garage)\b/.test(value)) return 'industrial';
  return 'houses';
}

async function loadSuburbWeights() {
  if (!window.WizardawnData?.getGeomorphs) {
    typeWeights = { ...fallbackTypeWeights };
    typeSources = {
      houses: [],
      road: [],
      stores: [],
      park: [],
      school: [],
      industrial: []
    };
    return;
  }

  try {
    const rows = await window.WizardawnData.getGeomorphs();
    const suburbRows = (rows || []).filter((row) => String(row.terrain || '').toLowerCase() === 'suburb');
    if (!suburbRows.length) {
      typeWeights = { ...fallbackTypeWeights };
      return;
    }

    const counts = {
      houses: 0,
      road: 0,
      stores: 0,
      park: 0,
      school: 0,
      industrial: 0
    };
    const sources = {
      houses: [],
      road: [],
      stores: [],
      park: [],
      school: [],
      industrial: []
    };

    suburbRows.forEach((row) => {
      const signature = `${row.image || ''} ${row.spot || ''} ${row.artist || ''} ${row.more || ''}`;
      const bucket = classifyGeomorphType(signature);
      counts[bucket] += 1;
      const image = String(row.image || '').toLowerCase();
      if (image) {
        sources[bucket].push(image);
      }
    });

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    if (!total) {
      typeWeights = { ...fallbackTypeWeights };
      return;
    }

    typeWeights = Object.fromEntries(
      Object.entries(counts).map(([type, count]) => [type, Math.max(1, Math.round((count / total) * 100))])
    );

    typeSources = {
      houses: unique(sources.houses),
      road: unique(sources.road),
      stores: unique(sources.stores),
      park: unique(sources.park),
      school: unique(sources.school),
      industrial: unique(sources.industrial)
    };
  } catch (error) {
    console.warn('Unable to load suburb geomorph weights:', error);
    typeWeights = { ...fallbackTypeWeights };
    typeSources = {
      houses: [],
      road: [],
      stores: [],
      park: [],
      school: [],
      industrial: []
    };
  }
}

function chooseTileType(rng) {
  const roll = randomInt(rng, 1, 100);
  let current = 0;
  for (const [type, weight] of Object.entries(typeWeights)) {
    current += weight;
    if (roll <= current) return type;
  }
  return 'industrial';
}

function generateSuburb(config, rng) {
  const tiles = [];
  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      rowTiles.push({
        row,
        col,
        type: chooseTileType(rng)
      });
      const tile = rowTiles[rowTiles.length - 1];
      const pool = typeSources[tile.type] || [];
      tile.source = pool.length ? pick(rng, pool) : null;
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
        label: tile.type,
        type: tile.type
      }))
    )
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'suburb-summary';
  summary.textContent = `Suburb map ${result.config.width}×${result.config.height}`;
  output.appendChild(summary);

  if (window.WizardawnMap?.createGeomorphMapCard) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(buildMapPreview(result), {
      title: 'Generated Map',
      assetBase: '/tools/osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  const note = document.createElement('div');
  note.className = 'small text-muted';
  note.textContent = 'Map approximates legacy suburb geomorph composition.';
  output.appendChild(note);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadSuburbWeights();

  const config = { width, height };
  const tiles = generateSuburb(config, rng);

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

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
