const toolId = 'swmp';
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
    halls: 25,
    keyed: true,
    startNumber: 1
  },
  payload: {
    tiles: []
  }
};

const fallbackSources = {
  room: ['room'],
  tunnel: ['tunnel'],
  junction: ['junction'],
  'dead-end': ['dead-end']
};

let sewerSources = {
  room: [...fallbackSources.room],
  tunnel: [...fallbackSources.tunnel],
  junction: [...fallbackSources.junction],
  'dead-end': [...fallbackSources['dead-end']]
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

function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

function sourceTypeFromImage(imageName) {
  const image = normalize(imageName);
  if (!image) return null;
  if (/room|chamber|hall/.test(image)) return 'room';
  if (/junction|cross|intersect/.test(image)) return 'junction';
  if (/dead|end|culdesac|cul-de-sac/.test(image)) return 'dead-end';
  return 'tunnel';
}

function resetSourcePools() {
  sewerSources = {
    room: [...fallbackSources.room],
    tunnel: [...fallbackSources.tunnel],
    junction: [...fallbackSources.junction],
    'dead-end': [...fallbackSources['dead-end']]
  };
}

async function loadSewerSources() {
  resetSourcePools();

  if (!window.WizardawnData?.getGeomorphs) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getGeomorphs();
    if (!Array.isArray(rows) || !rows.length) {
      return;
    }

    const grouped = {
      room: [],
      tunnel: [],
      junction: [],
      'dead-end': []
    };

    rows
      .filter((row) => normalize(row.terrain) === 'sewers')
      .forEach((row) => {
        const source = normalize(row.image) || normalize(row.more) || normalize(row.coord);
        const type = sourceTypeFromImage(row.image || row.more || row.coord);
        if (!type || !source) return;
        grouped[type].push(source);
      });

    sewerSources = {
      room: unique([...grouped.room, ...fallbackSources.room]),
      tunnel: unique([...grouped.tunnel, ...fallbackSources.tunnel]),
      junction: unique([...grouped.junction, ...fallbackSources.junction]),
      'dead-end': unique([...grouped['dead-end'], ...fallbackSources['dead-end']])
    };
  } catch (error) {
    console.warn('Unable to load sewer geomorph sources:', error);
    resetSourcePools();
  }
}

function chooseTileType(rng, roomChancePercent) {
  const roll = randomInt(rng, 1, 100);
  if (roll <= roomChancePercent) {
    return 'room';
  }

  const tunnelRoll = randomInt(rng, 1, 100);
  if (tunnelRoll <= 60) {
    return 'tunnel';
  }
  if (tunnelRoll <= 85) {
    return 'junction';
  }
  return 'dead-end';
}

function generateSewerMap(config, rng) {
  const tiles = [];
  let areaNumber = config.startNumber;

  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      const type = chooseTileType(rng, config.halls);
      const tile = {
        row,
        col,
        type,
        source: pick(rng, sewerSources[type] || fallbackSources[type] || ['unknown']),
        key: config.keyed ? areaNumber : null
      };
      if (config.keyed) {
        areaNumber += 1;
      }
      rowTiles.push(tile);
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
        key: tile.key,
        type: tile.type
      }))
    )
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'sewer-summary';
  summary.textContent = `Sewer map ${result.config.width}×${result.config.height} · room chance ${result.config.halls}% · keyed ${result.config.keyed ? 'on' : 'off'}${result.config.keyed ? ` (start ${result.config.startNumber})` : ''}`;
  output.appendChild(summary);

  if (window.WizardawnMap?.createGeomorphMapCard) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(buildMapPreview(result), {
      title: 'Generated Map',
      assetBase: '../osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  const legend = document.createElement('div');
  legend.className = 'small text-muted';
  legend.textContent = 'Tile types approximate legacy sewer geomorph behavior (room/tunnel/junction/dead-end).';
  output.appendChild(legend);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const halls = Math.min(100, Math.max(0, Number(formData.get('halls') || 0)));
  const keyed = formData.get('keyed') === '1';
  const startNumber = Math.min(1000, Math.max(1, Number(formData.get('map_numbers') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadSewerSources();

  const config = {
    width,
    height,
    halls,
    keyed,
    startNumber
  };

  const tiles = generateSewerMap(config, rng);

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
Room chance: ${lastResult.config.halls}%
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
