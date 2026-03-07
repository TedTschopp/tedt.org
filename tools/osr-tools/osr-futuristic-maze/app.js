const toolId = 'uexfl';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const mutantFutureFallback = ['rad roach swarm', 'mutant hound', 'wasteland raider', 'slime crawler', 'security drone', 'feral stalker'];
const labyrinthFallback = ['orc scavengers', 'goblin salvagers', 'bugbear marauders', 'skeleton crewman', 'kobold pack', 'ogre bruiser'];
const trapTable = ['shock panel', 'acid vent', 'auto-turret nest', 'gravity shear', 'electrified hatch', 'magnetic snare'];
const contentTable = ['cryo pods', 'cargo lockers', 'damaged consoles', 'sealed labs', 'maintenance shafts', 'discarded bunkrooms'];
const lootTable = ['energy cartridges', 'plasteel scraps', 'mystic relic', 'navigation charts', 'medical kits', 'sealed ration packs'];
const techTable = ['fusion battery', 'laser sidearm', 'tactical visor', 'portable scanner', 'med drone shell', 'nanite ampoule'];
const atmoTable = ['ionized haze', 'toxic vapor', 'oxygen-thin pocket', 'superheated air', 'frozen condensation', 'hallucinogenic mist'];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    adventure: null
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
  if (state === 0) state = 81818181;
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

function boundedNumber(formData, key, min, max, fallback) {
  return Math.max(min, Math.min(max, Number(formData.get(key) || fallback)));
}

function rollCount(rng, min, max, lowBias) {
  const minN = Math.max(0, min);
  const maxN = Math.max(minN, max);
  if (minN === maxN) return minN;
  const high = randomInt(rng, minN, maxN);
  const low = randomInt(rng, minN, maxN);
  return randomInt(rng, 1, 100) <= lowBias ? Math.min(high, low) : Math.max(high, low);
}

function roomHas(rng, chance) {
  return randomInt(rng, 1, 100) <= chance;
}

function enemyPool(mixMonsters) {
  return mixMonsters
    ? [...(window.__wizMutantFutureMonsters || mutantFutureFallback), ...(window.__wizLabyrinthMonsters || labyrinthFallback)]
    : (window.__wizMutantFutureMonsters || mutantFutureFallback);
}

async function loadEnemyPools() {
  if (window.__wizEnemyPoolsReady) {
    return;
  }

  const [mfNames, llNames] = await Promise.all([
    window.WizardawnData.getMonsterNamesForCreatorPrefixes(['MF']),
    window.WizardawnData.getMonsterNamesForCreatorPrefixes(['LL', 'BX'])
  ]);

  window.__wizMutantFutureMonsters = mfNames.length ? mfNames : mutantFutureFallback;
  window.__wizLabyrinthMonsters = llNames.length ? llNames : labyrinthFallback;
  window.__wizEnemyPoolsReady = true;
}

function rollEnemies(rng, config) {
  const entries = [];
  const pool = enemyPool(config.mixMonsters);
  if (config.enemyOne && roomHas(rng, config.enemyOneChance)) entries.push(config.enemyOne);
  if (config.enemyTwo && roomHas(rng, config.enemyTwoChance)) entries.push(config.enemyTwo);
  const target = rollCount(rng, config.enemyMin, config.enemyMax, config.enemyLow);
  for (let idx = entries.length; idx < target; idx += 1) entries.push(pick(rng, pool));
  return entries;
}

function rollList(rng, chance, min, max, low, table) {
  if (!roomHas(rng, chance)) return [];
  const count = rollCount(rng, min, max, low);
  return Array.from({ length: count }, () => pick(rng, table));
}

function renderResult(result) {
  output.innerHTML = '';
  const adventure = result.payload.adventure;
  if (!adventure) {
    output.innerHTML = '<em>No adventure generated.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'uexfl-header';
  header.textContent = `${adventure.name} · ${adventure.mapType} · ${adventure.rooms.length} room(s) · ${adventure.mapStyle}`;
  output.appendChild(header);

  if (adventure.summary.length) {
    const summary = document.createElement('ul');
    summary.className = 'uexfl-summary';
    adventure.summary.forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      summary.appendChild(li);
    });
    output.appendChild(summary);
  }

  adventure.rooms.forEach((room) => {
    const card = document.createElement('article');
    card.className = 'uexfl-card';
    const parts = [];
    if (room.atmosphere) parts.push(`<div class="uexfl-sub"><strong>Atmosphere:</strong> ${room.atmosphere}</div>`);
    if (room.enemies.length) parts.push(`<div><strong>Enemies:</strong> ${room.enemies.join(', ')}</div>`);
    if (room.traps.length) parts.push(`<div><strong>Traps:</strong> ${room.traps.join(', ')}</div>`);
    if (room.contents.length) parts.push(`<div><strong>Contents:</strong> ${room.contents.join(', ')}</div>`);
    if (room.loot.length) parts.push(`<div><strong>Loot:</strong> ${room.loot.join(', ')}${room.lootTrapped ? ' (TRAPPED)' : ''}</div>`);
    if (room.cash > 0) parts.push(`<div class="uexfl-sub"><strong>Cash:</strong> ${room.cash} ${room.currency}</div>`);
    if (!parts.length) parts.push('<div class="uexfl-sub">No unusual features detected.</div>');

    card.innerHTML = `<div class="uexfl-title">Room ${room.id}</div>${parts.join('')}`;
    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadEnemyPools();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const mapWide = boundedNumber(formData, 'mapWide', 1, 10, 4);
  const mapHigh = boundedNumber(formData, 'mapHigh', 1, 10, 4);
  const mapRooms = boundedNumber(formData, 'mapRooms', 0, 1000, 0);
  const roomCount = mapRooms > 0 ? mapRooms : mapWide * mapHigh;

  const config = {
    mapType: formData.get('mapType')?.toString() || 'Exodus Spaceship',
    mapStyle: formData.get('mapStyle')?.toString() || 'Classic Blue',
    name: formData.get('name')?.toString().trim() || 'Futuristic Maze',
    currency: formData.get('currency')?.toString().trim() || 'gold',
    level: boundedNumber(formData, 'level', 0, 100, 0),
    characters: boundedNumber(formData, 'characters', 0, 20, 0),
    terrain: formData.get('terrain')?.toString().trim() || 'Random',
    mapWide,
    mapHigh,
    mapRooms,
    enemyOne: formData.get('enemyOne')?.toString().trim() || '',
    enemyOneChance: boundedNumber(formData, 'enemyOneChance', 0, 100, 0),
    enemyTwo: formData.get('enemyTwo')?.toString().trim() || '',
    enemyTwoChance: boundedNumber(formData, 'enemyTwoChance', 0, 100, 0),
    outsideVisitors: formData.get('outsideVisitors') === '1',
    mixMonsters: formData.get('mixMonsters') === '1',
    atmoChance: boundedNumber(formData, 'atmo', 0, 100, 0),
    enemyChance: boundedNumber(formData, 'enemyChance', 0, 100, 35),
    enemyMin: boundedNumber(formData, 'enemyMin', 1, 25, 1),
    enemyMax: boundedNumber(formData, 'enemyMax', 1, 25, 5),
    enemyLow: boundedNumber(formData, 'enemyLow', 0, 100, 0),
    trapChance: boundedNumber(formData, 'trapChance', 0, 100, 10),
    trapMin: boundedNumber(formData, 'trapMin', 1, 25, 1),
    trapMax: boundedNumber(formData, 'trapMax', 1, 25, 3),
    trapLow: boundedNumber(formData, 'trapLow', 0, 100, 0),
    contentChance: boundedNumber(formData, 'contentChance', 0, 100, 70),
    contentMin: boundedNumber(formData, 'contentMin', 1, 25, 1),
    contentMax: boundedNumber(formData, 'contentMax', 1, 25, 10),
    contentLow: boundedNumber(formData, 'contentLow', 0, 100, 5),
    lootChance: boundedNumber(formData, 'lootChance', 0, 100, 20),
    lootMin: boundedNumber(formData, 'lootMin', 1, 25, 1),
    lootMax: boundedNumber(formData, 'lootMax', 1, 25, 5),
    lootLow: boundedNumber(formData, 'lootLow', 0, 100, 20),
    lootRigged: boundedNumber(formData, 'lootRigged', 0, 100, 30),
    lootAdjust: boundedNumber(formData, 'lootAdjust', 0, 100, 2),
    cashCut: boundedNumber(formData, 'cashCut', 1, 1000, 100),
    techChance: boundedNumber(formData, 'techItems', 0, 100, 100)
  };

  const rooms = [];
  for (let roomId = 1; roomId <= roomCount; roomId += 1) {
    const enemies = roomHas(rng, config.enemyChance) ? rollEnemies(rng, config) : [];
    if (config.outsideVisitors && roomHas(rng, 10)) {
      enemies.push(`visitor from ${config.terrain.toLowerCase()}`);
    }

    const traps = rollList(rng, config.trapChance, config.trapMin, config.trapMax, config.trapLow, trapTable);
    const contents = rollList(rng, config.contentChance, config.contentMin, config.contentMax, config.contentLow, contentTable);
    const lootBase = rollList(rng, config.lootChance + (config.level * config.lootAdjust), config.lootMin, config.lootMax, config.lootLow, lootTable);
    const techBonus = roomHas(rng, config.techChance) ? Array.from({ length: randomInt(rng, 0, 2) }, () => pick(rng, techTable)) : [];
    const loot = [...lootBase, ...techBonus];
    const lootTrapped = loot.length > 0 && roomHas(rng, config.lootRigged);
    const cash = loot.length ? Math.floor((randomInt(rng, 8, 120) * config.cashCut) / 100) : 0;

    rooms.push({
      id: roomId,
      atmosphere: roomHas(rng, config.atmoChance) ? pick(rng, atmoTable) : null,
      enemies,
      traps,
      contents,
      loot,
      lootTrapped,
      cash,
      currency: config.currency
    });
  }

  const summary = [
    `Terrain: ${config.terrain}`,
    `Level: ${config.level || 'n/a'} · Characters: ${config.characters || 'n/a'}`,
    `${rooms.filter((room) => room.enemies.length).length} room(s) with enemies`,
    `${rooms.filter((room) => room.traps.length).length} room(s) with traps`,
    `${rooms.filter((room) => room.loot.length).length} room(s) with loot`
  ];

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      adventure: {
        name: config.name,
        mapType: config.mapType,
        mapStyle: config.mapStyle,
        summary,
        rooms
      }
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
Adventure: ${lastResult.payload.adventure?.name || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
