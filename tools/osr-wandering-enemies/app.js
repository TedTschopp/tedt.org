const toolId = 'wander';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');
const gameSelect = document.getElementById('game');
const dataCodeGroup = document.getElementById('data-code-group');
const dataSourceGroup = document.getElementById('data-source-group');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    table: []
  }
};

const terrainMap = {
  DG: ['dungeon', 'ruins', 'interior'],
  TW: ['settlement'],
  RD: ['wasteland', 'harsh'],
  PF: ['forest'],
  PH: ['hills'],
  PM: ['mountains'],
  PP: ['plains'],
  PS: ['swamp'],
  PD: ['desert'],
  FW: ['freshwater', 'river', 'lake'],
  SW: ['sea', 'coast'],
  CF: ['snow forest'],
  CH: ['snow hills'],
  CM: ['snow mountains'],
  CP: ['snow plains'],
  TF: ['jungle forest'],
  TH: ['jungle hills'],
  TM: ['jungle mountains'],
  TS: ['jungle swamp'],
  VG: ['village'],
  LW: ['lost world']
};

const gameCreatorCodes = {
  'Labyrinth Lord': ['LL'],
  'OSRIC': ['OSRIC'],
  'BD&D': ['BX', 'BU'],
  'BFRPG': ['BFRPG'],
  'Swords & Wizardry': ['SW'],
  'Swords & Six-Siders': ['SX'],
  'Tunnels & Trolls 5th Edition': ['TT'],
  'Tunnels & Trolls 7th Edition': ['TT'],
  'Tunnels & Trolls Deluxe': ['TT'],
  'Mutant Future': ['MF'],
  'Gamma World': ['MF', 'BU'],
  'Metamorphosis Alpha': ['MF', 'BU'],
  'Broken Urthe': ['BU']
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
  if (state === 0) state = 65656565;
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

function parseDataRows(rawText) {
  return rawText
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split('^^^')[0].trim())
    .filter(Boolean);
}

function terrainFits(entryTerrains, selectedTerrain) {
  if (!selectedTerrain) return true;
  return entryTerrains.includes(selectedTerrain);
}

async function selectPool(config) {
  if (config.game === 'Data') return [];

  const allRows = await window.WizardawnData.getMonstersRpgs();
  let filtered = [];

  if (config.game === 'AD&D') {
    filtered = allRows.filter((row) =>
      window.WizardawnData.matchesGameFilters(row, 'AD', config.options.ff, config.options.mm2)
    );
  } else {
    const codes = [...(gameCreatorCodes[config.game] || ['LL'])];
    if (config.options.aec && config.game === 'Labyrinth Lord') {
      codes.push('AEC');
    }
    if (config.options.mom && config.game === 'OSRIC') {
      codes.push('MOM');
    }
    filtered = allRows.filter((row) => codes.some((code) => row.creator.startsWith(code)));
  }

  if (config.options.mutate) {
    const mutantRows = allRows.filter((row) => row.name.toUpperCase().includes('MUTANT'));
    filtered = [...filtered, ...mutantRows];
  }

  return filtered.map((row) => ({
    name: row.name,
    level: Math.max(1, row.difficulty || 1),
    terrain: row.terrains?.length ? row.terrains : ['DG'],
  }));
}

function syncDataModeUi() {
  const isData = gameSelect.value === 'Data';
  dataCodeGroup.style.display = isData ? '' : 'none';
  dataSourceGroup.style.display = isData ? '' : 'none';
}

syncDataModeUi();
gameSelect.addEventListener('change', syncDataModeUi);

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.table.length) {
    output.innerHTML = '<em>No enemies found for the selected filters.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'wander-header';
  header.textContent = `${result.config.game} · ${result.payload.table.length} table entr${result.payload.table.length === 1 ? 'y' : 'ies'}`;
  output.appendChild(header);

  const table = document.createElement('table');
  table.className = 'wander-table';
  table.innerHTML = '<tbody></tbody>';
  const tbody = table.querySelector('tbody');

  result.payload.table.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td class="wander-roll">${entry.roll}</td><td>${entry.enemy}</td>`;
    tbody.appendChild(row);
  });

  output.appendChild(table);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const random = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const level = Math.max(0, Math.min(100, Number(formData.get('level') || 1)));
  const amount = Math.max(1, Math.min(100, Number(formData.get('amount') || 12)));
  const terrain = formData.get('terrain')?.toString() || '';

  const config = {
    game,
    level,
    amount,
    terrain,
    dataCode: formData.get('dataCode')?.toString().trim() || '',
    ttDifficulty: Number(formData.get('ttDifficulty') || 1),
    options: {
      mom: formData.get('optMom') === '1',
      ff: formData.get('optFf') === '1',
      mm2: formData.get('optMm2') === '1',
      aec: formData.get('optAec') === '1',
      mutate: formData.get('optMutate') === '1',
      showDescribe: formData.get('showDescribe') === '1'
    }
  };

  const table = [];

  if (game === 'Data') {
    const dataRows = parseDataRows(formData.get('dataSource')?.toString() || '');
    for (let index = 1; index <= amount; index += 1) {
      if (!dataRows.length) break;
      table.push({ roll: index, enemy: pick(random, dataRows) });
    }
  } else {
    const selectedPool = await selectPool(config);
    const allPool = selectedPool
      .filter((entry) => terrainFits(entry.terrain, terrain))
      .filter((entry) => level === 0 || entry.level <= Math.max(1, level));

    const activePool = allPool.length ? allPool : selectedPool;
    for (let index = 1; index <= amount; index += 1) {
      const picked = pick(random, activePool);
      const descriptionText = config.options.showDescribe
        ? `${picked.name} — ${pick(random, ['lurking', 'hunting', 'patrolling', 'guarding'])}; threat level ${picked.level}`
        : picked.name;
      table.push({ roll: index, enemy: descriptionText });
    }
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      table
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

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
