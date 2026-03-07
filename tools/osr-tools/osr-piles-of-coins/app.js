const toolId = 'coins';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const FALLBACK_DENOMS = {
  pp: 'pp',
  gp: 'gp',
  ep: 'ep',
  sp: 'sp',
  cp: 'cp'
};

let runtimeDenoms = { ...FALLBACK_DENOMS };
let runtimePoolsReady = false;
let runtimePoolsLoading = null;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Labyrinth Lord',
  config: {
    valueMin: 1,
    valueMax: 100,
    piles: 1
  },
  payload: {
    piles: []
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

function formatInt(value) {
  return Number(value || 0).toLocaleString('en-US');
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function resetRuntimeDenoms() {
  runtimeDenoms = { ...FALLBACK_DENOMS };
}

function gameCodesFor(game) {
  if (game === 'Labyrinth Lord') return ['LL'];
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game === 'Tunnels & Trolls 5th Edition') return ['TT'];
  if (game === 'Tunnels & Trolls 7th Edition') return ['TT'];
  if (game === 'Tunnels & Trolls Deluxe') return ['TT'];
  return [];
}

async function loadRuntimeDenoms(game) {
  if (runtimePoolsReady) {
    return;
  }
  if (runtimePoolsLoading) {
    await runtimePoolsLoading;
    return;
  }

  runtimePoolsLoading = (async () => {
    resetRuntimeDenoms();
    if (!window.WizardawnData) {
      runtimePoolsReady = true;
      return;
    }

    try {
      const codes = gameCodesFor(game);
      const storeItems = await window.WizardawnData.getStoreItemsForGames(codes);
      const text = (storeItems || []).map((row) => normalizeText(row.item));

      if (text.some((value) => /platinum/.test(value))) runtimeDenoms.pp = 'platinum';
      if (text.some((value) => /gold/.test(value))) runtimeDenoms.gp = 'gold';
      if (text.some((value) => /electrum/.test(value))) runtimeDenoms.ep = 'electrum';
      if (text.some((value) => /silver/.test(value))) runtimeDenoms.sp = 'silver';
      if (text.some((value) => /copper/.test(value))) runtimeDenoms.cp = 'copper';
    } catch (error) {
      console.warn('coins runtime denomination enrichment failed; using fallback labels', error);
      resetRuntimeDenoms();
    }

    runtimePoolsReady = true;
  })();

  try {
    await runtimePoolsLoading;
  } finally {
    runtimePoolsLoading = null;
  }
}

function supportsPlatinum(game) {
  return ['Labyrinth Lord', 'AD&D', 'BFRPG', 'OSRIC', 'BD&D'].includes(game);
}

function supportsElectrum(game) {
  return ['Labyrinth Lord', 'AD&D', 'BFRPG', 'OSRIC', 'BD&D'].includes(game);
}

function silverRate(game) {
  if (game === 'Swords & Six-Siders') return 20;
  return 10;
}

function buildCoinPile(value, game, rng) {
  const pp = supportsPlatinum(game) ? 500 : 0;
  const gp = 100;
  const ep = supportsElectrum(game) ? 50 : 0;
  const sp = silverRate(game);

  let copper = value * gp;
  let platinum = 0;
  let gold = 0;
  let electrum = 0;
  let silver = 0;

  if (game !== 'Swords & Six-Siders') {
    gold = Math.floor(copper / gp);
    copper -= gold * gp;
  } else {
    if (pp > 0 && randomInt(rng, 1, 100) > 90) {
      const maxPp = Math.floor(copper / pp);
      if (maxPp > 0) {
        platinum = randomInt(rng, 1, maxPp);
        copper -= platinum * pp;
      }
    }
    if (randomInt(rng, 1, 100) > 70) {
      const maxGp = Math.floor(copper / gp);
      if (maxGp > 0) {
        gold = randomInt(rng, 1, maxGp);
        copper -= gold * gp;
      }
    }
    if (ep > 0 && randomInt(rng, 1, 100) > 50) {
      const maxEp = Math.floor(copper / ep);
      if (maxEp > 0) {
        electrum = randomInt(rng, 1, maxEp);
        copper -= electrum * ep;
      }
    }
    if (randomInt(rng, 1, 100) > 20) {
      const maxSp = Math.floor(copper / sp);
      if (maxSp > 0) {
        silver = randomInt(rng, 1, maxSp);
        copper -= silver * sp;
      }
    }
    if (copper > 100) {
      copper = randomInt(rng, 5, 95);
    }
  }

  const parts = [];
  if (platinum > 0) parts.push(`${formatInt(platinum)}${runtimeDenoms.pp}`);
  if (gold > 0) parts.push(`${formatInt(gold)}${runtimeDenoms.gp}`);
  if (electrum > 0) parts.push(`${formatInt(electrum)}${runtimeDenoms.ep}`);
  if (silver > 0) parts.push(`${formatInt(silver)}${runtimeDenoms.sp}`);
  if (copper > 0) parts.push(`${formatInt(copper)}${runtimeDenoms.cp}`);

  if (!parts.length) {
    parts.push('1cp');
  }

  return {
    valueGold: value,
    platinum,
    gold,
    electrum,
    silver,
    copper,
    display: parts.join(' / ')
  };
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.piles.length) {
    output.innerHTML = '<em>No coin piles generated yet.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'coins-summary';
  summary.textContent = `${result.payload.piles.length} pile(s) · ${result.game} · value range ${result.config.valueMin}-${result.config.valueMax} gp`;
  output.appendChild(summary);

  const table = document.createElement('table');
  table.className = 'table table-sm table-striped coins-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col" style="width:80px;">#</th>
        <th scope="col" style="width:160px;">Gold Value</th>
        <th scope="col">Coins</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  result.payload.piles.forEach((pile) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pile.line}</td>
      <td>${formatInt(pile.valueGold)} gp</td>
      <td>${pile.display}</td>
    `;
    tbody.appendChild(row);
  });

  output.appendChild(table);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const valueMinRaw = Math.max(1, Number(formData.get('valueMin') || 1));
  const valueMaxRaw = Math.max(1, Number(formData.get('valueMax') || 100));
  const valueMin = Math.min(valueMinRaw, valueMaxRaw);
  const valueMax = Math.max(valueMinRaw, valueMaxRaw);
  const piles = Math.min(100, Math.max(1, Number(formData.get('piles') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadRuntimeDenoms(game);

  const generatedPiles = [];
  for (let line = 1; line <= piles; line += 1) {
    const value = randomInt(rng, valueMin, valueMax);
    const built = buildCoinPile(value, game, rng);
    generatedPiles.push({
      line,
      ...built
    });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      valueMin,
      valueMax,
      piles
    },
    payload: {
      piles: generatedPiles
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
Game: ${lastResult.game || 'n/a'}
Piles: ${lastResult.payload.piles.length}
Value Range: ${lastResult.config.valueMin}-${lastResult.config.valueMax} gp

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
