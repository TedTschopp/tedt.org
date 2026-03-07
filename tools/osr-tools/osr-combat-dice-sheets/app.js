const toolId = 'dice';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const FALLBACK_SPITE_HINTS = {
  1: 'minor sting',
  2: 'solid hit',
  3: 'painful strike',
  4: 'heavy blow',
  5: 'critical smash',
  6: 'devastating impact'
};

let runtimeSpiteHints = { ...FALLBACK_SPITE_HINTS };
let runtimePoolsReady = false;
let runtimePoolsLoading = null;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: {
    diceMin: 1,
    diceMax: 10,
    setsPerDice: 10,
    ttVersion: '7'
  },
  payload: {
    rolls: []
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

function resetRuntimeSpiteHints() {
  runtimeSpiteHints = { ...FALLBACK_SPITE_HINTS };
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function loadRuntimeSpiteHints() {
  if (runtimePoolsReady) {
    return;
  }
  if (runtimePoolsLoading) {
    await runtimePoolsLoading;
    return;
  }

  runtimePoolsLoading = (async () => {
    resetRuntimeSpiteHints();
    if (!window.WizardawnData) {
      runtimePoolsReady = true;
      return;
    }

    try {
      const monsters = await window.WizardawnData.getMonstersForGame('TT');
      const sorted = (monsters || [])
        .filter((row) => normalizeText(row.name))
        .sort((a, b) => Number(a.difficulty || 0) - Number(b.difficulty || 0));

      for (let spite = 1; spite <= 6; spite += 1) {
        const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((spite / 6) * sorted.length)));
        const chosen = sorted[idx];
        if (chosen?.name) {
          runtimeSpiteHints[spite] = normalizeText(chosen.name);
        }
      }
    } catch (error) {
      console.warn('dice runtime spite enrichment failed; using fallback hints', error);
      resetRuntimeSpiteHints();
    }

    runtimePoolsReady = true;
  })();

  try {
    await runtimePoolsLoading;
  } finally {
    runtimePoolsLoading = null;
  }
}

function rollDiceSet(rng, diceCount) {
  const faces = [0, 0, 0, 0, 0, 0];
  for (let index = 0; index < diceCount; index += 1) {
    const face = randomInt(rng, 1, 6);
    faces[face - 1] += 1;
  }

  const total =
    faces[0] * 1 +
    faces[1] * 2 +
    faces[2] * 3 +
    faces[3] * 4 +
    faces[4] * 5 +
    faces[5] * 6;

  return {
    diceCount,
    faces,
    total,
    spiteDamage: faces[5]
  };
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'dice-summary';
  summary.textContent = `Generated ${result.payload.rolls.length} roll sets · range ${result.config.diceMin}-${result.config.diceMax} dice · ${result.config.setsPerDice} sets each · ${result.config.ttVersion === '7' ? 'T&T 7e (spite shown)' : 'T&T 5e'}`;
  output.appendChild(summary);

  if (!result.payload.rolls.length) {
    const empty = document.createElement('em');
    empty.textContent = 'No rolls generated yet.';
    output.appendChild(empty);
    return;
  }

  const table = document.createElement('table');
  table.className = 'dice-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Dice</th>
      <th>1s</th>
      <th>2s</th>
      <th>3s</th>
      <th>4s</th>
      <th>5s</th>
      <th>6s</th>
      <th>Total</th>
      ${result.config.ttVersion === '7' ? '<th>Spite</th>' : ''}
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  result.payload.rolls.forEach((roll) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${roll.diceCount}</td>
      <td>${roll.faces[0]}</td>
      <td>${roll.faces[1]}</td>
      <td>${roll.faces[2]}</td>
      <td>${roll.faces[3]}</td>
      <td>${roll.faces[4]}</td>
      <td>${roll.faces[5]}</td>
      <td>${roll.total}</td>
      ${result.config.ttVersion === '7' ? `<td title="${runtimeSpiteHints[Math.max(1, Math.min(6, roll.spiteDamage || 1))] || ''}">${roll.spiteDamage}</td>` : ''}
    `;
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  output.appendChild(table);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const diceMin = Math.min(1000, Math.max(1, Number(formData.get('dice_min') || 1)));
  const diceMaxRaw = Math.min(1000, Math.max(1, Number(formData.get('dice_max') || diceMin)));
  const diceMax = Math.max(diceMin, diceMaxRaw);
  const setsPerDice = Math.min(500, Math.max(1, Number(formData.get('dice_num') || 1)));
  const ttVersion = formData.get('tt_vs')?.toString() === '5' ? '5' : '7';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  if (ttVersion === '7') {
    await loadRuntimeSpiteHints();
  }

  const rolls = [];
  for (let diceCount = diceMin; diceCount <= diceMax; diceCount += 1) {
    for (let setIndex = 0; setIndex < setsPerDice; setIndex += 1) {
      rolls.push(rollDiceSet(rng, diceCount));
    }
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      diceMin,
      diceMax,
      setsPerDice,
      ttVersion
    },
    payload: {
      rolls
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
Range: ${lastResult.config.diceMin}-${lastResult.config.diceMax}
Sets each: ${lastResult.config.setsPerDice}
Version: T&T ${lastResult.config.ttVersion}e

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
