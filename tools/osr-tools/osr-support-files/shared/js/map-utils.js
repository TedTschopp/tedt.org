(function () {
  const TERRAIN_ASSETS = {
    Desert: 'desert.png',
    Forest: 'forest.png',
    Hills: 'hills.png',
    Jungle: 'jungle.png',
    Mountains: 'mountains.png',
    Plains: 'grasslands.png',
    Sea: 'sea.png',
    Snow: 'snow.png',
    Swamp: 'swamp.png',
    Tropics: 'jungle.png',
    Lake: 'sea.png',
    Wasteland: 'barrens.png',
    Underworld: 'cavern.png'
  };

  function resolveTerrainImage(terrainName) {
    return TERRAIN_ASSETS[String(terrainName || '').trim()] || TERRAIN_ASSETS.Plains;
  }

  function resolveTerrainColorOverlay(terrainName) {
    const key = String(terrainName || '').trim().toLowerCase();
    const overlays = {
      desert: '_color_sand.png',
      forest: '_color_tree.png',
      hills: '_color_hills.png',
      jungle: '_color_jungle.png',
      mountains: '_color_mountains.png',
      plains: '_color_grass.png',
      sea: '_color_water.png',
      snow: '_color_snow.png',
      swamp: '_color_swamp.png',
      tropics: '_color_jungle.png',
      lake: '_color_water.png',
      wasteland: '_color_dead.png',
      underworld: '_color_caverns.png'
    };
    return overlays[key] || '_color_grass.png';
  }

  function buildHexPreview(random, terrainName, siteCount) {
    const rowWidths = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 11];
    const maxWidth = 19;
    const cells = [];
    let cellId = 1;

    rowWidths.forEach((width, row) => {
      const offset = Math.floor((maxWidth - width) / 2);
      for (let col = 0; col < width; col += 1) {
        cells.push({
          id: cellId,
          row,
          col,
          x: offset + col,
          site: null
        });
        cellId += 1;
      }
    });

    for (let site = 1; site <= siteCount; site += 1) {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const candidate = cells[Math.floor(random() * cells.length)];
        if (!candidate.site) {
          candidate.site = site;
          break;
        }
      }
    }

    return {
      rows: rowWidths,
      cells,
      terrain: terrainName,
      image: resolveTerrainImage(terrainName)
    };
  }

  function landAssetPath(imageName, assetBase) {
    if (!imageName) return '';
    return `${assetBase}${encodeURIComponent(imageName)}`;
  }

  function mapAssetPath(imageName, assetBase) {
    if (!imageName) return '';
    return `${assetBase}${encodeURIComponent(imageName)}`;
  }

  const GEOMORPH_FALLBACKS = {
    cave: {
      default: ['bottomleft0dyson0cave0original005.jpg', 'bottomright0dyson0cave0original005.jpg'],
      dyson: ['bottomleft0dyson0cave0original005.jpg', 'bottomright0dyson0cave0original005.jpg'],
      risus: ['bottomleft0risus0cave0original032.jpg', 'bottomright0risus0cave0original032.jpg'],
      rorsch: ['bottomleft0rorschachhamster0cave0original048.jpg', 'bottomright0rorschachhamster0cave0original048.jpg'],
      stone: ['bottomleft0stonewerks0cave0original0005.jpg', 'bottomright0stonewerks0cave0original0004.jpg'],
      zero: ['bottomleft0infinite0zer00cave0original024.jpg', 'bottomright0infinite0zer00cave0original024.jpg']
    },
    dungeon: {
      default: ['bottomleft0dyson0dungeon0original013.jpg', 'bottomright0dyson0dungeon0original013.jpg'],
      dyson: ['bottomleft0dyson0dungeon0original013.jpg', 'bottomright0dyson0dungeon0original013.jpg'],
      risus: ['bottomleft0risus0dungeon0original042.jpg', 'bottomright0risus0dungeon0original042.jpg'],
      rorsch: ['bottomleft0rorschachhamster0dungeon0original053.jpg', 'bottomright0rorschachhamster0dungeon0original053.jpg'],
      stone: ['bottomleft0stonewerks0dungeon0original065.jpg', 'bottomright0stonewerks0dungeon0original065.jpg'],
      glenn: ['bottomleft0glenn0jupp0dungeon0original019.jpg', 'bottomright0glenn0jupp0dungeon0original019.jpg'],
      stuart: ['bottomleft0stuart0dungeon0original072.jpg', 'bottomright0stuart0dungeon0original072.jpg']
    },
    side: {
      default: ['bottomleft0dyson0dungeon0original014.jpg', 'bottomright0dyson0dungeon0original014.jpg']
    },
    city: {
      default: ['city_1.gif', 'city_2.gif', 'city_3.gif', 'city_4.gif']
    },
  };

  function normalizeGeomorphArtist(value) {
    const artist = String(value || '').toLowerCase();
    if (artist.includes('rorsch')) return 'rorsch';
    if (artist.includes('stone')) return 'stone';
    if (artist.includes('glenn')) return 'glenn';
    if (artist.includes('stuart')) return 'stuart';
    if (artist.includes('zero') || artist.includes('infinite')) return 'zero';
    if (artist.includes('risus')) return 'risus';
    if (artist.includes('dyson')) return 'dyson';
    return '';
  }

  function normalizeGeomorphType(value) {
    const type = String(value || '').toLowerCase().replace(/^tile-/, '');
    if (type.includes('cave')) return 'cave';
    if (type.includes('dungeon') || type.includes('room') || type.includes('tunnel') || type.includes('junction') || type.includes('dead-end')) return 'dungeon';
    if (type.includes('side')) return 'side';
    if (type.includes('city') || type.includes('ruined') || type.includes('house') || type.includes('store') || type.includes('school') || type.includes('park') || type.includes('road') || type.includes('industrial') || type.includes('building') || type.includes('ship') || type.includes('climate')) return 'city';
    return 'dungeon';
  }

  function resolveGeomorphFallbackImage(cell, fallbackIndex = 0) {
    const bucket = normalizeGeomorphType(cell?.type || cell?.terrain || cell?.label);
    const artist = normalizeGeomorphArtist(cell?.artist || cell?.label);
    const bucketMap = GEOMORPH_FALLBACKS[bucket] || GEOMORPH_FALLBACKS.dungeon;
    const options = bucketMap[artist] || bucketMap.default || GEOMORPH_FALLBACKS.dungeon.default;
    if (!options.length) return '';
    return options[Math.abs(Number(fallbackIndex) || 0) % options.length];
  }

  function normalizeTerrain(value) {
    return String(value || '').trim().toLowerCase();
  }

  function matchesTerrainKey(terrainValue, terrainKey) {
    if (!terrainKey) return true;
    const terrain = normalizeTerrain(terrainValue);
    const key = normalizeTerrain(terrainKey);
    return terrain === key;
  }

  function filterGeomorphsByTerrains(geomorphs, terrainKeys) {
    const keys = (terrainKeys || []).map((value) => normalizeTerrain(value)).filter(Boolean);
    if (!keys.length) return [...(geomorphs || [])];
    return (geomorphs || []).filter((row) => keys.some((key) => matchesTerrainKey(row.terrain, key)));
  }

  function pickFrom(list, random) {
    if (!list || !list.length) return null;
    return list[Math.floor(random() * list.length)];
  }

  function buildGeomorphGridPreview(options = {}) {
    const random = options.random || Math.random;
    const mapWide = Math.max(1, Number(options.mapWide) || 1);
    const mapHigh = Math.max(1, Number(options.mapHigh) || 1);
    const terrainKeys = options.terrainKeys || [];
    const geomorphs = options.geomorphs || [];
    const tilePool = filterGeomorphsByTerrains(geomorphs, terrainKeys);

    const rows = [];
    for (let y = 0; y < mapHigh; y += 1) {
      const row = [];
      for (let x = 0; x < mapWide; x += 1) {
        const picked = pickFrom(tilePool, random);
        row.push({
          x,
          y,
          image: picked?.image || '',
          label: picked?.spot || picked?.more || picked?.delve || picked?.terrain || options.fallbackLabel || 'Map Tile',
          terrain: picked?.terrain || ''
        });
      }
      rows.push(row);
    }

    return {
      title: options.title || 'Map Preview',
      mapWide,
      mapHigh,
      rows,
      terrainKeys,
      hasTiles: tilePool.length > 0
    };
  }

  function createGeomorphMapCard(mapPreview, options = {}) {
    const title = options.title || mapPreview.title || 'Map Preview';
    const cardClass = options.cardClass || 'card mb-3';
    const bodyClass = options.bodyClass || 'card-body py-2 px-2';
    const wrapClass = options.wrapClass || 'wiz-map-grid';
    const rowClass = options.rowClass || 'wiz-map-row';
    const tileClass = options.tileClass || 'wiz-map-tile';
    const imageClass = options.imageClass || 'wiz-map-image';
    const labelClass = options.labelClass || 'wiz-map-label';
    const metaClass = options.metaClass || 'wiz-map-meta';
    const keyClass = options.keyClass || 'wiz-map-key';
    const assetBase = options.assetBase || './osr-support-files/assets/maps/';
    const expandCardWithMap = options.expandCardWithMap !== false;
    const modeText = String(
      options.dataMode
      || window.WizardawnData?.getGeomorphDataMode?.()
      || (mapPreview.hasTiles ? 'JSON' : 'Fallback')
    );
    const badgeClass = modeText === 'JSON'
      ? 'bg-success-subtle text-success-emphasis'
      : (modeText === 'Fallback' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-secondary-subtle text-secondary-emphasis');

    const mapCard = document.createElement('section');
    mapCard.className = cardClass;
    mapCard.innerHTML = `
      <div class="card-header py-2 d-flex justify-content-between align-items-center gap-2">
        <span>${title}</span>
        <span class="badge rounded-pill ${badgeClass}">Data: ${modeText}</span>
      </div>
    `;

    const mapBody = document.createElement('div');
    mapBody.className = bodyClass;

    const mapWrap = document.createElement('div');
    mapWrap.className = wrapClass;

    if (expandCardWithMap) {
      mapCard.style.width = 'max-content';
      mapCard.style.maxWidth = 'none';
      mapBody.style.overflow = 'visible';
      mapWrap.style.overflow = 'visible';
      mapWrap.style.maxHeight = 'none';
      mapWrap.style.width = 'max-content';
    }

    (mapPreview.rows || []).forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = rowClass;

      row.forEach((cell) => {
        const tile = document.createElement('span');
        tile.className = tileClass;
        if (cell.type) {
          tile.classList.add(`tile-${String(cell.type)}`);
        }
        tile.title = cell.label || 'Map Tile';

        const resolvedImage = String(cell.image || '').trim() || resolveGeomorphFallbackImage(cell, (cell.x || 0) + ((cell.y || 0) * 13));

        if (resolvedImage) {
          const img = document.createElement('img');
          img.className = imageClass;
          img.loading = 'lazy';
          img.decoding = 'async';
          img.alt = cell.label || 'Map Tile';
          img.src = mapAssetPath(resolvedImage, assetBase);
          img.addEventListener('error', () => {
            const secondFallback = resolveGeomorphFallbackImage(cell, (cell.x || 0) + ((cell.y || 0) * 29) + 1);
            if (secondFallback && secondFallback !== resolvedImage) {
              img.src = mapAssetPath(secondFallback, assetBase);
              return;
            }
            img.remove();
            tile.textContent = (cell.label || 'Tile').slice(0, 3).toUpperCase();
          });
          tile.appendChild(img);
        } else {
          tile.textContent = (cell.label || 'Tile').slice(0, 3).toUpperCase();
        }

        if (cell.key !== null && cell.key !== undefined) {
          const key = document.createElement('span');
          key.className = keyClass;
          key.textContent = `#${cell.key}`;
          tile.appendChild(key);
        }

        rowEl.appendChild(tile);
      });

      mapWrap.appendChild(rowEl);
    });

    mapBody.appendChild(mapWrap);

    const meta = document.createElement('div');
    meta.className = metaClass;
    meta.textContent = `${mapPreview.mapWide} × ${mapPreview.mapHigh} tiles${mapPreview.hasTiles ? '' : ' (fallback view)'}`;
    mapBody.appendChild(meta);

    mapCard.appendChild(mapBody);
    return mapCard;
  }

  function createHexMapCard(mapPreview, options = {}) {
    const title = options.title || 'Hex Map';
    const cardClass = options.cardClass || 'card mb-3';
    const bodyClass = options.bodyClass || 'card-body py-2 px-2';
    const wrapClass = options.wrapClass || 'hexcrawl-map hexcrawl-map-php';
    const rowClass = options.rowClass || 'hexcrawl-row';
    const cellClass = options.cellClass || 'hexcrawl-cell';
    const imageClass = options.imageClass || 'hexcrawl-cell-image';
    const markerClass = options.markerClass || 'hexcrawl-site';
    const assetBase = options.assetBase || './osr-support-files/assets/land/';
    const colorAssetBase = options.colorAssetBase || './osr-support-files/assets/land/';
    const colorMap = Boolean(options.colorMap);
    const expandCardWithMap = Boolean(options.expandCardWithMap);

    const HEX_WIDTH = 41;
    const HEX_HEIGHT = 33;
    const STEP_X = 32;
    const STEP_Y = 28;
    const BASE_X = 10;
    const BASE_Y = 10;

    const mapCard = document.createElement('section');
    mapCard.className = cardClass;
    mapCard.innerHTML = `<div class="card-header py-2">${title}</div>`;

    const mapBody = document.createElement('div');
    mapBody.className = bodyClass;
    const mapWrap = document.createElement('div');
    mapWrap.className = wrapClass;

    const terrainImage = mapPreview.image;
    const colorOverlay = resolveTerrainColorOverlay(mapPreview.terrain);
    let maxRight = 0;
    let maxBottom = 0;

    (mapPreview.cells || []).forEach((cell) => {
      const tile = document.createElement('span');
      tile.className = cellClass;
      tile.title = `${mapPreview.terrain}${cell.site ? ` • Site ${cell.site}` : ''}`;

      const left = BASE_X + ((Number(cell.x) || 0) * STEP_X);
      const top = BASE_Y + ((Number(cell.row) || 0) * STEP_Y);
      tile.style.left = `${left}px`;
      tile.style.top = `${top}px`;

      if (terrainImage) {
        const img = document.createElement('img');
        img.className = imageClass;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = mapPreview.terrain;
        img.src = landAssetPath(terrainImage, assetBase);
        img.addEventListener('error', () => {
          img.remove();
          tile.textContent = String(mapPreview.terrain || '?').slice(0, 1).toUpperCase();
        });
        tile.appendChild(img);
      }

      if (colorMap) {
        const overlay = document.createElement('img');
        overlay.className = `${imageClass} hexcrawl-cell-color`;
        overlay.loading = 'lazy';
        overlay.decoding = 'async';
        overlay.alt = `${mapPreview.terrain} color`;
        overlay.src = landAssetPath(colorOverlay, colorAssetBase);
        overlay.addEventListener('error', () => {
          overlay.remove();
        }, { once: true });
        tile.appendChild(overlay);
      }

      if (cell.site) {
        const marker = document.createElement('span');
        marker.className = markerClass;
        marker.textContent = String(cell.site);
        tile.appendChild(marker);
      }

      mapWrap.appendChild(tile);
      maxRight = Math.max(maxRight, left + HEX_WIDTH);
      maxBottom = Math.max(maxBottom, top + HEX_HEIGHT);
    });

    mapWrap.style.width = `${maxRight + BASE_X}px`;
    mapWrap.style.height = `${maxBottom + BASE_Y}px`;

    if (expandCardWithMap) {
      mapCard.style.width = `${maxRight + BASE_X + 18}px`;
      mapCard.style.maxWidth = 'none';
    }

    mapBody.appendChild(mapWrap);
    mapCard.appendChild(mapBody);
    return mapCard;
  }

  window.WizardawnMap = {
    terrainAssets: TERRAIN_ASSETS,
    resolveTerrainImage,
    buildHexPreview,
    createHexMapCard,
    filterGeomorphsByTerrains,
    buildGeomorphGridPreview,
    createGeomorphMapCard
  };
})();
