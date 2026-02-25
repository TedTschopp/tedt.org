const toolId = 'world';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const TERRAIN = {
  ocean: { key: 'ocean', label: 'Ocean', glyph: '~~', color: 'hex-ocean', image: 'sea.png' },
  coast: { key: 'coast', label: 'Coast', glyph: '≈≈', color: 'hex-coast', image: 'sea.png' },
  plains: { key: 'plains', label: 'Plains', glyph: '..', color: 'hex-plains', image: 'grasslands.png' },
  forest: { key: 'forest', label: 'Forest', glyph: '♣♣', color: 'hex-forest', image: 'forest.png' },
  hills: { key: 'hills', label: 'Hills', glyph: '^^', color: 'hex-hills', image: 'hills.png' },
  mountains: { key: 'mountains', label: 'Mountains', glyph: '⛰', color: 'hex-mountains', image: 'mountains.png' },
  swamp: { key: 'swamp', label: 'Swamp', glyph: '≈.', color: 'hex-swamp', image: 'swamp.png' },
  desert: { key: 'desert', label: 'Desert', glyph: '░░', color: 'hex-desert', image: 'desert.png' },
  tundra: { key: 'tundra', label: 'Tundra', glyph: '**', color: 'hex-tundra', image: 'snow.png' },
  jungle: { key: 'jungle', label: 'Jungle', glyph: '♠♠', color: 'hex-jungle', image: 'jungle.png' },
  ruins: { key: 'ruins', label: 'Ruins', glyph: '⛶', color: 'hex-ruins', image: 'ruins.png' },
  waste: { key: 'waste', label: 'Wastes', glyph: '··', color: 'hex-waste', image: 'barrens.png' },
  underdark: { key: 'underdark', label: 'Cavern', glyph: '◊◊', color: 'hex-underdark', image: 'cavern.png' }
};

const LANDMARKS = ['City', 'Castle', 'Ruin', 'Temple', 'Tower', 'Mine', 'Port', 'Stronghold'];
let worldLandmarkPool = [...LANDMARKS];

function landAssetPath(imageName) {
  if (!imageName) return '';
  return `/tools/osr-support-files/assets/land/${encodeURIComponent(imageName)}`;
}

function legacyLandPath(imageName) {
  if (!imageName) return '';
  return `/tools/osr-support-files/assets/land/${encodeURIComponent(imageName)}`;
}

function terrainBaseAsset(terrainKey) {
  const map = {
    ocean: 'sea.png',
    coast: 'sea_cover.png',
    plains: 'grasslands.png',
    forest: 'forest.png',
    hills: 'hills.png',
    mountains: 'mountains.png',
    swamp: 'swamp.png',
    desert: 'desert.png',
    tundra: 'snow.png',
    jungle: 'jungle.png',
    ruins: 'ruins.png',
    waste: 'barrens.png',
    underdark: 'cavern.png'
  };
  return map[terrainKey] || 'grasslands.png';
}

function terrainColorOverlay(terrainKey) {
  const map = {
    ocean: '_color_water.png',
    coast: '_color_sea.png',
    plains: '_color_grass.png',
    forest: '_color_tree.png',
    hills: '_color_hills.png',
    mountains: '_color_mountains.png',
    swamp: '_color_swamp.png',
    desert: '_color_sand.png',
    tundra: '_color_snow.png',
    jungle: '_color_jungle.png',
    ruins: '_color_dead.png',
    waste: '_color_dead.png',
    underdark: '_color_caverns.png'
  };
  return map[terrainKey] || '_color_grass.png';
}

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: null,
  payload: {
    name: null,
    terrainCounts: {},
    landmarks: [],
    grid: []
  }
};

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

function chooseWeighted(choices, random) {
  const total = choices.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  for (const item of choices) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return choices[choices.length - 1].value;
}

function resolveClimate(climateValue, random) {
  if (climateValue !== 9) return climateValue;
  const pool = [1, 2, 10, 11, 3, 4, 5, 6, 7, 8, 12];
  return pool[Math.floor(random() * pool.length)];
}

function climateBand(yIndex, rows) {
  const middle = rows / 2;
  const distance = Math.abs(yIndex - middle) / middle;
  if (distance > 0.8) return 'polar';
  if (distance > 0.4) return 'temperate';
  return 'equatorial';
}

function getTerrainProfile(style, climate, band) {
  if (climate === 12) {
    return [
      { value: 'underdark', weight: 48 },
      { value: 'waste', weight: 24 },
      { value: 'ruins', weight: 12 },
      { value: 'hills', weight: 10 },
      { value: 'mountains', weight: 6 }
    ];
  }

  if (style === 'Empty') return [{ value: 'plains', weight: 1 }];

  if (style === 'Exodus Spaceship') {
    return [
      { value: 'waste', weight: 42 },
      { value: 'ruins', weight: 28 },
      { value: 'hills', weight: 16 },
      { value: 'forest', weight: 8 },
      { value: 'mountains', weight: 6 }
    ];
  }

  if (style === 'Post-Apocalyptic') {
    return [
      { value: 'waste', weight: 36 },
      { value: 'ruins', weight: 20 },
      { value: 'plains', weight: 16 },
      { value: 'desert', weight: 14 },
      { value: 'mountains', weight: 8 },
      { value: 'forest', weight: 6 }
    ];
  }

  if (style === 'Sci-Fi') {
    return [
      { value: 'plains', weight: 24 },
      { value: 'desert', weight: 18 },
      { value: 'waste', weight: 14 },
      { value: 'forest', weight: 14 },
      { value: 'hills', weight: 12 },
      { value: 'mountains', weight: 10 },
      { value: 'swamp', weight: 8 }
    ];
  }

  if (climate === 3 || band === 'polar') {
    return [
      { value: 'tundra', weight: 36 },
      { value: 'hills', weight: 20 },
      { value: 'mountains', weight: 20 },
      { value: 'forest', weight: 10 },
      { value: 'plains', weight: 8 },
      { value: 'swamp', weight: 6 }
    ];
  }

  if (climate === 4) {
    return [
      { value: 'desert', weight: 54 },
      { value: 'hills', weight: 16 },
      { value: 'mountains', weight: 14 },
      { value: 'waste', weight: 10 },
      { value: 'plains', weight: 6 }
    ];
  }

  if (climate === 6 || climate === 7 || band === 'equatorial') {
    return [
      { value: 'jungle', weight: 34 },
      { value: 'forest', weight: 24 },
      { value: 'swamp', weight: 16 },
      { value: 'plains', weight: 12 },
      { value: 'hills', weight: 8 },
      { value: 'mountains', weight: 6 }
    ];
  }

  if (climate === 5) {
    return [
      { value: 'forest', weight: 44 },
      { value: 'plains', weight: 18 },
      { value: 'hills', weight: 14 },
      { value: 'swamp', weight: 12 },
      { value: 'mountains', weight: 12 }
    ];
  }

  return [
    { value: 'plains', weight: 30 },
    { value: 'forest', weight: 18 },
    { value: 'hills', weight: 16 },
    { value: 'mountains', weight: 12 },
    { value: 'desert', weight: 10 },
    { value: 'swamp', weight: 8 },
    { value: 'tundra', weight: 6 }
  ];
}

function applyDirectionalBorders(grid, width, height, north, south, east, west) {
  const northTerrain = north === 1 ? 'ocean' : north === 2 ? 'mountains' : null;
  const southTerrain = south === 1 ? 'ocean' : south === 2 ? 'mountains' : null;
  const eastTerrain = east === 1 ? 'ocean' : east === 2 ? 'mountains' : null;
  const westTerrain = west === 1 ? 'ocean' : west === 2 ? 'mountains' : null;

  if (northTerrain && grid[0]) {
    for (let x = 0; x < width; x += 1) grid[0][x].terrain = northTerrain;
  }
  if (southTerrain && grid[height - 1]) {
    for (let x = 0; x < width; x += 1) grid[height - 1][x].terrain = southTerrain;
  }
  if (eastTerrain) {
    for (let y = 0; y < height; y += 1) grid[y][width - 1].terrain = eastTerrain;
  }
  if (westTerrain) {
    for (let y = 0; y < height; y += 1) grid[y][0].terrain = westTerrain;
  }
}

function applyOuterHull(grid, width, height) {
  for (let x = 0; x < width; x += 1) {
    grid[0][x].terrain = 'ocean';
    grid[height - 1][x].terrain = 'ocean';
  }
  for (let y = 0; y < height; y += 1) {
    grid[y][0].terrain = 'ocean';
    grid[y][width - 1].terrain = 'ocean';
  }
}

function sprinkleCoasts(grid, width, height) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = grid[y][x];
      if (cell.terrain === 'ocean' || cell.terrain === 'underdark') continue;

      let adjacentWater = 0;
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        if (grid[ny][nx].terrain === 'ocean') adjacentWater += 1;
      }
      if (adjacentWater >= 2) cell.terrain = 'coast';
    }
  }
}

function generateLandmarks(grid, width, height, random, enabled) {
  if (!enabled) return [];
  const count = Math.max(4, Math.floor((width * height) / 90));
  const landmarks = [];
  const pool = worldLandmarkPool.length ? worldLandmarkPool : LANDMARKS;

  for (let i = 0; i < count; i += 1) {
    let attempts = 0;
    while (attempts < 30) {
      attempts += 1;
      const x = Math.floor(random() * width);
      const y = Math.floor(random() * height);
      const cell = grid[y][x];
      if (!cell || ['ocean', 'mountains', 'underdark'].includes(cell.terrain)) continue;
      if (cell.landmark) continue;

      const landmark = pool[Math.floor(random() * pool.length)];
      cell.landmark = landmark;
      landmarks.push({ name: landmark, x: x + 1, y: y + 1, terrain: TERRAIN[cell.terrain].label });
      break;
    }
  }

  return landmarks;
}

function uniqueValues(list) {
  return [...new Set(list.filter(Boolean))];
}

async function loadWorldLegendData() {
  if (window.__wizWorldLegendReady) {
    return;
  }

  try {
    const rows = await window.WizardawnData.getWorldmapLegend();
    const candidates = rows
      .map((row) => row.nameClean)
      .filter((name) => /city|castle|ruin|temple|tower|mine|port|village|fort|stronghold|outpost/i.test(name));
    worldLandmarkPool = uniqueValues(candidates);
  } catch (error) {
    console.warn('[world] Failed to load world legend data; using built-in landmark pool.', error);
  }

  if (!worldLandmarkPool.length) {
    worldLandmarkPool = [...LANDMARKS];
  }

  window.__wizWorldLegendReady = true;
}

function climateLabel(climate) {
  const labels = {
    1: 'Cold North & Warm South',
    2: 'Warm North & Cold South',
    3: 'Snow',
    4: 'Desert',
    5: 'Forest',
    6: 'Jungle',
    7: 'Tropics',
    8: 'Lifeless',
    9: 'Random',
    10: 'Cold North & South',
    11: 'Warm North & South',
    12: 'Underworld'
  };
  return labels[climate] || 'Unknown';
}

function buildMap(config) {
  const seed = config.seed || `${Date.now()}-${Math.random()}`;
  const random = createSeededRandom(seed);
  const width = Math.max(10, Math.min(100, config.mapWide * 10));
  const height = Math.max(8, Math.min(80, config.mapHigh * 8));
  const climate = resolveClimate(config.climate, random);

  const grid = Array.from({ length: height }, (_, y) => {
    const band = climateBand(y, height);
    const profile = getTerrainProfile(config.mapStyle, climate, band);
    return Array.from({ length: width }, (_, x) => ({
      x,
      y,
      terrain: chooseWeighted(profile, random),
      landmark: null
    }));
  });

  applyDirectionalBorders(grid, width, height, config.northBorder, config.southBorder, config.eastBorder, config.westBorder);
  if (config.outerHull) applyOuterHull(grid, width, height);
  if (climate !== 12 && config.mapStyle !== 'Empty') sprinkleCoasts(grid, width, height);

  const landmarks = generateLandmarks(grid, width, height, random, config.highlightLandmarks);
  const terrainCounts = {};
  for (const row of grid) {
    for (const cell of row) {
      terrainCounts[cell.terrain] = (terrainCounts[cell.terrain] || 0) + 1;
    }
  }

  return {
    name: config.mapName || 'Unnamed World',
    climate,
    width,
    height,
    hexMiles: config.hexMiles,
    terrainCounts,
    landmarks,
    grid,
    seed
  };
}

function renderResult(result) {
  output.innerHTML = '';
  const payload = result.payload;
  if (!payload.grid.length) {
    output.innerHTML = '<em>No map generated.</em>';
    return;
  }

  if (result.config.showInfo) {
    const infoCard = document.createElement('div');
    infoCard.className = 'card mb-3';
    infoCard.innerHTML = `
      <div class="card-body py-2 px-3 world-info">
        <div><strong>Name:</strong> ${payload.name}</div>
        <div><strong>Seed:</strong> ${result.seed}</div>
        <div><strong>Style:</strong> ${result.config.mapStyle}</div>
        <div><strong>Climate:</strong> ${climateLabel(payload.climate)}</div>
        <div><strong>Size:</strong> ${payload.width} × ${payload.height} hexes (${payload.hexMiles} miles/hex)</div>
      </div>
    `;
    output.appendChild(infoCard);
  }

  const mapWrap = document.createElement('div');
  mapWrap.className = 'card world-map-card';

  const mapHead = document.createElement('div');
  mapHead.className = 'card-header py-2';
  mapHead.textContent = 'Hex Map Preview';
  mapWrap.appendChild(mapHead);

  const mapBody = document.createElement('div');
  mapBody.className = 'card-body p-2';
  const map = document.createElement('div');
  map.className = 'world-map world-map-php';

  const HEX_WIDTH = 41;
  const HEX_HEIGHT = 33;
  const HEX_STEP_X = 64;
  const HEX_STEP_Y = 17;
  const HEX_STAGGER_X = 32;
  const BASE_OFFSET_X = 10;
  const BASE_OFFSET_Y = 10;
  const TILE_STEP_X = 320;
  const TILE_STEP_Y = 272;
  const TILE_IMAGE_WIDTH = 331;
  const TILE_IMAGE_HEIGHT = 290;
  const TERRAIN_OFFSET_X = 1;
  const TERRAIN_OFFSET_Y = 1;

  let maxRight = 0;
  let maxBottom = 0;

  payload.grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const terrain = TERRAIN[cell.terrain] || TERRAIN.plains;
      const halfRow = (rowIndex * 2) + (colIndex % 2);
      const halfCol = Math.floor(colIndex / 2);
      const top = BASE_OFFSET_Y + (halfRow * HEX_STEP_Y);
      const left = BASE_OFFSET_X + (halfCol * HEX_STEP_X) + (halfRow % 2 ? HEX_STAGGER_X : 0);

      const stack = document.createElement('span');
      stack.className = `world-hex-stack${result.config.colorMap ? ` ${terrain.color}` : ''}${cell.landmark ? ' hex-landmark' : ''}`;
      stack.style.top = `${top}px`;
      stack.style.left = `${left}px`;
      stack.title = `${terrain.label}${cell.landmark ? ` • ${cell.landmark}` : ''}`;

      const terrainImage = document.createElement('img');
      terrainImage.className = 'world-hex-terrain';
      terrainImage.loading = 'lazy';
      terrainImage.decoding = 'async';
      terrainImage.alt = terrain.label;
      terrainImage.src = legacyLandPath(terrainBaseAsset(cell.terrain));
      terrainImage.style.top = `${TERRAIN_OFFSET_Y}px`;
      terrainImage.style.left = `${TERRAIN_OFFSET_X}px`;
      terrainImage.addEventListener('error', () => {
        terrainImage.src = landAssetPath(terrain.image);
      }, { once: true });
      stack.appendChild(terrainImage);

      if (result.config.colorMap) {
        const overlay = document.createElement('img');
        overlay.className = 'world-hex-color';
        overlay.loading = 'lazy';
        overlay.decoding = 'async';
        overlay.alt = `${terrain.label} color`;
        overlay.src = legacyLandPath(terrainColorOverlay(cell.terrain));
        overlay.style.top = `${TERRAIN_OFFSET_Y}px`;
        overlay.style.left = `${TERRAIN_OFFSET_X}px`;
        overlay.addEventListener('error', () => {
          overlay.remove();
        }, { once: true });
        stack.appendChild(overlay);
      }

      const frame = document.createElement('span');
      frame.className = 'world-hex-frame';
      stack.appendChild(frame);

      if (cell.landmark && result.config.highlightLandmarks) {
        const landmarkOverlay = document.createElement('img');
        landmarkOverlay.className = 'world-hex-highlight';
        landmarkOverlay.loading = 'lazy';
        landmarkOverlay.decoding = 'async';
        landmarkOverlay.alt = 'highlight';
        landmarkOverlay.src = legacyLandPath('_color_highlight.png');
        landmarkOverlay.style.top = `${TERRAIN_OFFSET_Y}px`;
        landmarkOverlay.style.left = `${TERRAIN_OFFSET_X}px`;
        landmarkOverlay.addEventListener('error', () => {
          landmarkOverlay.remove();
        }, { once: true });
        stack.appendChild(landmarkOverlay);
      }

      if (cell.landmark) {
        const marker = document.createElement('span');
        marker.className = 'hex-marker';
        marker.textContent = '✦';
        stack.appendChild(marker);
      }

      map.appendChild(stack);
      maxRight = Math.max(maxRight, left + HEX_WIDTH + TERRAIN_OFFSET_X);
      maxBottom = Math.max(maxBottom, top + HEX_HEIGHT + TERRAIN_OFFSET_Y);
    });
  });

  const tileCols = Math.max(1, Math.floor(payload.width / 10));
  const tileRows = Math.max(1, Math.floor(payload.height / 8));
  for (let row = 0; row < tileRows; row += 1) {
    for (let col = 0; col < tileCols; col += 1) {
      const tile = document.createElement('img');
      tile.className = 'world-hex-gridtile';
      tile.loading = 'lazy';
      tile.decoding = 'async';
      tile.alt = '';
      tile.src = legacyLandPath('hexes.png');
      tile.style.left = `${BASE_OFFSET_X + (col * TILE_STEP_X)}px`;
      tile.style.top = `${BASE_OFFSET_Y + (row * TILE_STEP_Y)}px`;
      tile.style.width = `${TILE_IMAGE_WIDTH}px`;
      tile.style.height = `${TILE_IMAGE_HEIGHT}px`;
      tile.addEventListener('error', () => {
        tile.remove();
      }, { once: true });
      map.appendChild(tile);
      maxRight = Math.max(maxRight, BASE_OFFSET_X + (col * TILE_STEP_X) + TILE_IMAGE_WIDTH);
      maxBottom = Math.max(maxBottom, BASE_OFFSET_Y + (row * TILE_STEP_Y) + TILE_IMAGE_HEIGHT);
    }
  }

  map.style.width = `${maxRight + 10}px`;
  map.style.height = `${maxBottom + 10}px`;

  const mapPixelWidth = maxRight + 10;
  const cardTargetWidth = mapPixelWidth + 18;
  mapWrap.style.width = `${cardTargetWidth}px`;

  mapBody.appendChild(map);
  mapWrap.appendChild(mapBody);
  output.appendChild(mapWrap);

  if (result.config.showLegend) {
    const legend = document.createElement('div');
    legend.className = 'card mt-3 world-legend-card';
    legend.style.width = `${cardTargetWidth}px`;

    const head = document.createElement('div');
    head.className = 'card-header py-2';
    head.textContent = 'Legend';
    legend.appendChild(head);

    const body = document.createElement('div');
    body.className = 'card-body py-2 px-3';
    const list = document.createElement('ul');
    list.className = 'mb-0 legend-list';

    Object.entries(payload.terrainCounts)
      .sort((left, right) => right[1] - left[1])
      .forEach(([key, count]) => {
        const terrain = TERRAIN[key] || TERRAIN.plains;
        const li = document.createElement('li');
        const pct = ((count / (payload.width * payload.height)) * 100).toFixed(1);

        const swatch = document.createElement('span');
        swatch.className = 'legend-hex';

        const base = document.createElement('img');
        base.className = 'legend-hex-layer';
        base.loading = 'lazy';
        base.decoding = 'async';
        base.alt = terrain.label;
        base.src = legacyLandPath(terrainBaseAsset(key));
        base.addEventListener('error', () => {
          base.src = landAssetPath(terrain.image);
        }, { once: true });
        swatch.appendChild(base);

        if (result.config.colorMap) {
          const overlay = document.createElement('img');
          overlay.className = 'legend-hex-layer legend-hex-color';
          overlay.loading = 'lazy';
          overlay.decoding = 'async';
          overlay.alt = `${terrain.label} color`;
          overlay.src = legacyLandPath(terrainColorOverlay(key));
          overlay.addEventListener('error', () => {
            overlay.remove();
          }, { once: true });
          swatch.appendChild(overlay);
        }

        li.appendChild(swatch);
        li.append(` ${terrain.label}: ${count} (${pct}%)`);
        list.appendChild(li);
      });

    body.appendChild(list);
    legend.appendChild(body);
    output.appendChild(legend);
  }

  if (result.config.highlightLandmarks && payload.landmarks.length) {
    const landmarkCard = document.createElement('div');
    landmarkCard.className = 'card mt-3';
    landmarkCard.innerHTML = '<div class="card-header py-2">Landmarks</div>';
    const body = document.createElement('div');
    body.className = 'card-body py-2 px-3';
    const list = document.createElement('ul');
    list.className = 'mb-0';
    payload.landmarks.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} at (${item.x}, ${item.y}) in ${item.terrain}`;
      list.appendChild(li);
    });
    body.appendChild(list);
    landmarkCard.appendChild(body);
    output.appendChild(landmarkCard);
  }
}

function parseConfig(formData) {
  return {
    seed: formData.get('seed')?.toString().trim() || null,
    mapName: formData.get('mapName')?.toString().trim() || '',
    mapStyle: formData.get('mapStyle')?.toString() || 'Fantasy',
    climate: Number(formData.get('climate') || 9),
    mapWide: Number(formData.get('mapWide') || 4),
    mapHigh: Number(formData.get('mapHigh') || 4),
    hexMiles: Number(formData.get('hexMiles') || 30),
    colorMap: formData.get('colorMap') === '1',
    highlightLandmarks: formData.get('highlightLandmarks') === '1',
    showInfo: formData.get('showInfo') === '1',
    showLegend: formData.get('showLegend') === '1',
    outerHull: formData.get('outerHull') === '1',
    northBorder: Number(formData.get('northBorder') || 0),
    southBorder: Number(formData.get('southBorder') || 0),
    eastBorder: Number(formData.get('eastBorder') || 0),
    westBorder: Number(formData.get('westBorder') || 0)
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadWorldLegendData();
  const config = parseConfig(new FormData(form));
  const payload = buildMap(config);

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
  const counts = Object.entries(lastResult.payload.terrainCounts || {})
    .sort((left, right) => right[1] - left[1])
    .map(([key, count]) => `- ${TERRAIN[key] ? TERRAIN[key].label : key}: ${count}`)
    .join('\n');
  const landmarks = (lastResult.payload.landmarks || []).length
    ? lastResult.payload.landmarks.map((item) => `- ${item.name} at (${item.x}, ${item.y}) in ${item.terrain}`).join('\n')
    : '- None';

  const markdown = `# ${lastResult.payload.name || 'World Map'}

Generated: ${lastResult.generatedAt || 'n/a'}

- Seed: ${lastResult.seed || 'n/a'}
- Style: ${lastResult.config ? lastResult.config.mapStyle : 'n/a'}
- Climate: ${lastResult.payload ? climateLabel(lastResult.payload.climate) : 'n/a'}
- Size: ${lastResult.payload ? `${lastResult.payload.width} × ${lastResult.payload.height}` : 'n/a'}
- Hex Miles: ${lastResult.payload ? lastResult.payload.hexMiles : 'n/a'}

## Terrain Breakdown
${counts || '- n/a'}

## Landmarks
${landmarks}`;

  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});

form.requestSubmit();
