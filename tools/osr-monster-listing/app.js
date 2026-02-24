const toolId = 'lists';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    monsters: []
  }
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
  'Broken Urthe': ['BU'],
  'Gamma World': ['MF', 'BU'],
  'Metamorphosis Alpha': ['MF', 'BU'],
  'Mutant Future': ['MF'],
  'Fantasy': ['LL', 'OSRIC', 'AD', 'BX', 'BFRPG', 'SW', 'SX', 'TT']
};

const terrainNames = {
  DG: 'Dungeon/Ruins/Interior', TW: 'Settlement', RD: 'Wastelands', PF: 'Forest', PH: 'Hills', PM: 'Mountains', PP: 'Plains',
  PS: 'Swamp', PD: 'Desert', FW: 'Freshwater', SW: 'Sea', CF: 'Snowy Forest', CH: 'Snowy Hills', CM: 'Snowy Mountains',
  CP: 'Snowy Plains', TF: 'Jungle Forest', TH: 'Jungle Hills', TM: 'Jungle Mountains', TS: 'Jungle Swamp', VG: 'Settlement', LW: 'Lost World'
};

function renderResult(result) {
  output.innerHTML = '';

  const monsters = result.payload.monsters;
  if (!monsters.length) {
    output.innerHTML = '<em>No monsters generated for selected options.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'lists-header';
  header.textContent = `${result.config.game} · ${monsters.length} monster entr${monsters.length === 1 ? 'y' : 'ies'}`;
  output.appendChild(header);

  if (result.config.type === 'terrain') {
    const byTerrain = monsters.reduce((acc, item) => {
      const key = item.terrain;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    Object.entries(byTerrain).forEach(([code, list]) => {
      const sub = document.createElement('h2');
      sub.className = 'h6 mt-2';
      sub.textContent = `${code} · ${terrainNames[code] || code}`;
      output.appendChild(sub);
      renderMonsterSet(list, result.config, output);
    });
    return;
  }

  renderMonsterSet(monsters, result.config, output);
}

function renderMonsterSet(monsters, config, host) {
  if (config.appearance === 'stat') {
    monsters.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'lists-card';
      card.innerHTML = `
        <div class="lists-title">${item.name}</div>
        <div><strong>Level:</strong> ${item.level}${config.showTerrain ? ` · <strong>Terrain:</strong> ${item.terrain}` : ''}</div>
        ${config.showDesc ? `<div class="lists-sub">${item.desc}</div>` : ''}
      `;
      host.appendChild(card);
    });
    return;
  }

  const table = document.createElement('table');
  table.className = 'lists-table';
  const terrainHead = config.showTerrain ? '<th>Terrain</th>' : '';
  table.innerHTML = `<thead><tr><th>Name</th><th>Level</th>${terrainHead}${config.showDesc ? '<th>Description</th>' : ''}</tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');

  monsters.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td><td>${item.level}</td>${config.showTerrain ? `<td>${item.terrain}</td>` : ''}${config.showDesc ? `<td>${item.desc}</td>` : ''}`;
    tbody.appendChild(tr);
  });

  host.appendChild(table);
}

function normalizeForGame(item, game, ttDifficulty) {
  if (!game.includes('Tunnels & Trolls')) return item;
  const shift = ttDifficulty === 9 ? 0 : ttDifficulty;
  return { ...item, level: Math.max(1, item.level + shift - 1) };
}

function toMonsterRow(item) {
  return {
    name: item.name,
    level: Math.max(1, item.difficulty || 1),
    terrain: item.terrains?.[0] || 'DG',
    desc: `${item.creator} · ${item.location || 'varied terrain'}`,
    creator: item.creator,
  };
}

async function assemblePool(config) {
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

  if (config.options.mutants) {
    const mutantRows = allRows.filter((row) => row.name.toUpperCase().includes('MUTANT'));
    filtered = [...filtered, ...mutantRows];
  }

  const deduped = [...new Map(filtered.map((row) => [row.name, row])).values()];
  return deduped.map((item) => normalizeForGame(toMonsterRow(item), config.game, config.ttDifficulty));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;

  const config = {
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    sorting: formData.get('sorting')?.toString() || 'name',
    type: formData.get('type')?.toString() || 'list',
    appearance: formData.get('appearance')?.toString() || 'columns',
    showDesc: formData.get('optShowDesc') === '1',
    showTerrain: formData.get('optShowTerrain') === '1',
    ttDifficulty: Number(formData.get('ttDifficulty') || 1),
    options: {
      aec: formData.get('optAec') === '1',
      mom: formData.get('optMom') === '1',
      ff: formData.get('optFf') === '1',
      mm2: formData.get('optMm2') === '1',
      mutants: formData.get('optMutants') === '1'
    }
  };

  const pool = await assemblePool(config);
  const sorted = [...pool].sort((left, right) => {
    if (config.sorting === 'level') {
      if (left.level !== right.level) return left.level - right.level;
      return left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      monsters: sorted
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
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
