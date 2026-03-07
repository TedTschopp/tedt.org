const toolId = 'dmap';
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
    mapType: 'cavernous dungeon',
    width: 4,
    height: 4,
    keyed: true,
    startNumber: 1,
    artists: []
  },
  payload: {
    tiles: []
  }
};

let geomorphPools = null;

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

function inferArtistFromImage(imageName) {
  const key = String(imageName || '').toLowerCase();
  if (key.includes('rorschachhamster')) return 'rorsch';
  if (key.includes('stonewerks')) return 'stone';
  if (key.includes('glenn0jupp')) return 'glenn';
  if (key.includes('infinite0zer00') || key.includes('infinite0zero0')) return 'zero';
  if (key.includes('dyson')) return 'dyson';
  if (key.includes('risus')) return 'risus';
  if (key.includes('stuart')) return 'stuart';
  return 'dyson';
}

function toTerrainClass(terrain) {
  if (terrain === 'cave') return 'cave';
  if (terrain === 'dungeon') return 'dungeon';
  return 'mixed';
}

async function loadGeomorphPools() {
  if (geomorphPools) {
    return;
  }

  const rows = await window.WizardawnData.getGeomorphs();
  const pools = {
    cave: {},
    dungeon: {}
  };

  rows
    .filter((row) => row.done === 1 && (row.terrain === 'cave' || row.terrain === 'dungeon'))
    .forEach((row) => {
      const artist = inferArtistFromImage(row.image);
      if (!pools[row.terrain][artist]) {
        pools[row.terrain][artist] = [];
      }
      pools[row.terrain][artist].push({
        id: row.id,
        image: row.image,
        terrain: row.terrain,
        artist,
      });
    });

  geomorphPools = pools;
}

function chooseTileType(rng, mapType) {
  if (mapType === 'side view') return 'side';
  if (mapType === 'dungeon') return 'dungeon';
  if (mapType === 'cavernous') return 'cave';
  return randomInt(rng, 1, 100) <= 50 ? 'dungeon' : 'cave';
}

function pickGeomorph(rng, terrain, artists) {
  const selectedArtists = artists.length ? artists : ['dyson'];
  const terrainPools = geomorphPools?.[terrain] || {};
  const availableArtists = selectedArtists.filter((artist) => (terrainPools[artist] || []).length);
  const chosenArtist = availableArtists.length ? pick(rng, availableArtists) : selectedArtists[0];
  const options = terrainPools[chosenArtist] || [];

  if (!options.length) {
    return {
      id: null,
      image: '',
      terrain,
      artist: chosenArtist,
    };
  }

  return pick(rng, options);
}

function generateDungeonMap(config, rng) {
  const tiles = [];
  let number = config.startNumber;

  for (let row = 0; row < config.height; row += 1) {
    const rowTiles = [];
    for (let col = 0; col < config.width; col += 1) {
      const tileType = chooseTileType(rng, config.mapType);
      const geomorph = tileType === 'side'
        ? { id: null, image: '', terrain: 'dungeon', artist: 'dyson' }
        : pickGeomorph(rng, tileType, config.artists);

      rowTiles.push({
        row,
        col,
        tileType: tileType === 'side' ? 'side' : toTerrainClass(geomorph.terrain),
        artist: geomorph.artist,
        geomorphId: geomorph.id,
        image: geomorph.image,
        key: config.keyed ? number : null
      });

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
        image: tile.image,
        label: `${tile.tileType}/${tile.artist}${tile.geomorphId ? ` #${tile.geomorphId}` : ''}`,
        artist: tile.artist,
        key: tile.key,
        type: tile.tileType === 'side'
          ? 'side'
          : (tile.tileType === 'dungeon' ? 'dungeon' : (tile.tileType === 'cave' ? 'cave' : 'mixed'))
      }))
    )
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'dmap-summary';
  summary.textContent = `Dungeon map ${result.config.width}×${result.config.height} · ${result.config.mapType} · keyed ${result.config.keyed ? 'on' : 'off'} · artists: ${result.config.artists.join(', ') || 'dyson'}`;
  output.appendChild(summary);

  if (window.WizardawnMap?.createGeomorphMapCard) {
    const mapCard = window.WizardawnMap.createGeomorphMapCard(buildMapPreview(result), {
      title: 'Generated Map',
      assetBase: '/tools/osr-tools/osr-support-files/assets/maps/'
    });
    output.appendChild(mapCard);
  }

  const note = document.createElement('div');
  note.className = 'small text-muted';
  note.textContent = 'Map approximates legacy geomorph and artist filtering behavior.';
  output.appendChild(note);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadGeomorphPools();

  const formData = new FormData(form);
  const mapType = formData.get('type')?.toString() || 'cavernous dungeon';
  const width = Math.min(10, Math.max(1, Number(formData.get('map_wide') || 1)));
  const height = Math.min(10, Math.max(1, Number(formData.get('map_high') || 1)));
  const keyed = formData.get('keyed') === '1';
  const startNumber = Math.min(1000, Math.max(1, Number(formData.get('map_numbers') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const artists = [];
  if (formData.get('cave_dyson') === '1') artists.push('dyson');
  if (formData.get('cave_risus') === '1') artists.push('risus');
  if (formData.get('cave_rorsch') === '1') artists.push('rorsch');
  if (formData.get('cave_stone') === '1') artists.push('stone');
  if (formData.get('cave_glenn') === '1') artists.push('glenn');
  if (formData.get('cave_stuart') === '1') artists.push('stuart');
  if (formData.get('cave_zero') === '1') artists.push('zero');

  if (mapType !== 'side view' && artists.length === 0) {
    artists.push('dyson', 'risus', 'rorsch', 'stone', 'glenn', 'stuart', 'zero');
  }

  const config = {
    mapType,
    width,
    height,
    keyed,
    startNumber,
    artists
  };

  const tiles = generateDungeonMap(config, rng);

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
Map type: ${lastResult.config.mapType}
Map size: ${lastResult.config.width}x${lastResult.config.height}
Keyed: ${lastResult.config.keyed ? 'yes' : 'no'}
Artists: ${(lastResult.config.artists || []).join(', ') || 'dyson'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
