const toolId = 'bmbs';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const fallbackMundaneItems = ['rope and pitons', 'rusted crowbar', 'field med-kit', 'water canteen', 'work lamp', 'salvage wrench', 'flares', 'ration bars', 'scavenger tarp', 'signal mirror'];
const roomTraps = ['collapsing floor plate', 'radioactive vent burst', 'tripwire dart rig', 'electrified hatch frame', 'spore mine pocket'];
const containerTraps = ['acid vial puncture', 'toxin needle spring', 'flash-bang canister', 'alarm screecher', 'incendiary gel burst'];
const fallbackLargeContainers = ['armored locker', 'industrial crate', 'subway tool cabinet', 'vehicle trunk', 'sealed bunker pod'];
const fallbackSmallContainers = ['canvas satchel', 'ammo pouch', 'metal tube case', 'belt pouch', 'sealed envelope'];
const fallbackExceptionalItems = ['prototype plasma cutter', 'advanced filter mask', 'relic data slate', 'kinetic gauntlet', 'nanofiber weave cloak', 'adaptive optics visor'];
const fallbackEncounters = ['rad-hound pack', 'feral scavengers', 'mutant stalker', 'security drone pair', 'fungal brute', 'ruin raider patrol'];
const hoardExtras = ['bundle of batteries', 'cache of preserved rations', 'crate of spare parts', 'vaulted medicine stock', 'sealed tech module'];

let mundaneItems = fallbackMundaneItems;
let largeContainers = fallbackLargeContainers;
let smallContainers = fallbackSmallContainers;
let exceptionalItems = fallbackExceptionalItems;
let encounters = fallbackEncounters;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {}
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
  if (state === 0) state = 42424242;
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

function normalizeItem(value) {
  return String(value || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function gameToStoreCodes(game) {
  if (game === 'Mutant Future') return ['MF'];
  if (game === 'Broken Urthe') return ['BU'];
  if (game === 'Gamma World' || game === 'Metamorphosis Alpha') return ['MF', 'BU'];
  return ['MF'];
}

function gameToMonsterCode(game) {
  if (game === 'Mutant Future') return 'MF';
  if (game === 'Broken Urthe') return 'BU';
  if (game === 'Gamma World' || game === 'Metamorphosis Alpha') return 'BU';
  return 'MF';
}

function resetRuntimePools() {
  mundaneItems = fallbackMundaneItems;
  largeContainers = fallbackLargeContainers;
  smallContainers = fallbackSmallContainers;
  exceptionalItems = fallbackExceptionalItems;
  encounters = fallbackEncounters;
}

async function loadBmbsPools(game, mutantsOnly) {
  resetRuntimePools();

  if (!window.WizardawnData) {
    return;
  }

  try {
    if (window.WizardawnData.getStoreItemsByStore) {
      const rows = await window.WizardawnData.getStoreItemsByStore(gameToStoreCodes(game), [
        'SUPPLIES', 'PROVISIONER', 'MILITARY', 'MEDICAL', 'MECHANIC', 'ROBOT', 'VEHICLE', 'ALCHEMIST'
      ]);

      if (Array.isArray(rows) && rows.length) {
        const mundane = [];
        const largeC = [];
        const smallC = [];
        const exceptional = [];

        rows.forEach((row) => {
          const label = normalizeItem(row.item);
          if (!label) return;

          if (/\b(crate|locker|trunk|cabinet|pod|chest|box|cache)\b/.test(label)) {
            largeC.push(label);
          } else if (/\b(pouch|satchel|tube|envelope|bag|sack|kit|case)\b/.test(label)) {
            smallC.push(label);
          }

          if (/\b(plasma|laser|nano|servo|adaptive|relic|prototype|kinetic|visor|optic|drone|advanced)\b/.test(label)) {
            exceptional.push(label);
          } else {
            mundane.push(label);
          }
        });

        mundaneItems = unique([...mundane, ...fallbackMundaneItems]).slice(0, 120);
        largeContainers = unique([...largeC, ...fallbackLargeContainers]).slice(0, 80);
        smallContainers = unique([...smallC, ...fallbackSmallContainers]).slice(0, 80);
        exceptionalItems = unique([...exceptional, ...fallbackExceptionalItems]).slice(0, 100);
      }
    }

    if (window.WizardawnData.getMonstersForGame) {
      const monsters = await window.WizardawnData.getMonstersForGame(gameToMonsterCode(game));
      if (Array.isArray(monsters) && monsters.length) {
        let names = monsters.map((row) => normalizeItem(row.name)).filter(Boolean);
        if (mutantsOnly) {
          names = names.filter((name) => /\b(mutant|radio|rad|beast|stalker|brute|aberrant|spawn)\b/.test(name));
        }
        encounters = unique([
          ...names.map((name) => `${name}`),
          ...fallbackEncounters
        ]).slice(0, 140);
      }
    }

    if (window.WizardawnData.getMutants && mutantsOnly) {
      const mutants = await window.WizardawnData.getMutants();
      if (Array.isArray(mutants) && mutants.length) {
        const mutantNames = mutants.map((row) => normalizeItem(row.name)).filter(Boolean);
        encounters = unique([
          ...mutantNames.map((name) => `mutated ${name}`),
          ...encounters
        ]).slice(0, 160);
      }
    }
  } catch (error) {
    console.warn('Unable to load bmbs runtime pools from shared data:', error);
    resetRuntimePools();
  }
}

function moneyDefaults(game) {
  if (game === 'Broken Urthe') return 'xormite';
  if (game === 'Gamma World' || game === 'Metamorphosis Alpha') return 'domars';
  return 'gold';
}

function makeMoney(rng, level, currency) {
  return `${randomInt(rng, level * 5, level * 120)} ${currency}`;
}

function makeTable(count, makeEntry) {
  return Array.from({ length: count }, (_, index) => ({
    roll: index + 1,
    entry: makeEntry()
  }));
}

function renderSection(title, entries) {
  const section = document.createElement('section');
  section.className = 'apoc-section';

  const heading = document.createElement('h3');
  heading.className = 'h6 mb-2';
  heading.textContent = title;
  section.appendChild(heading);

  const table = document.createElement('table');
  table.className = 'table table-sm table-bordered mb-0';
  const tbody = document.createElement('tbody');

  entries.forEach((row) => {
    const tr = document.createElement('tr');
    const tdRoll = document.createElement('td');
    tdRoll.className = 'roll-col';
    tdRoll.textContent = `${row.roll}`;
    const tdEntry = document.createElement('td');
    tdEntry.textContent = row.entry;
    tr.appendChild(tdRoll);
    tr.appendChild(tdEntry);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  section.appendChild(table);
  output.appendChild(section);
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'apoc-summary';
  summary.textContent = `Game: ${result.config.game} · Level: ${result.config.level || 'Random'} · Currency: ${result.config.money}`;
  output.appendChild(summary);

  if (result.payload.rules?.length) renderSection('Rules', result.payload.rules.map((entry, idx) => ({ roll: idx + 1, entry })));
  if (result.payload.mundaneItems) renderSection('Mundane Items', result.payload.mundaneItems);
  if (result.payload.roomTraps) renderSection('Room Traps', result.payload.roomTraps);
  if (result.payload.containersLarge && result.payload.containersSmall) {
    renderSection('Large Containers', result.payload.containersLarge);
    renderSection('Small Containers', result.payload.containersSmall);
  }
  if (result.payload.containerTraps) renderSection('Container Traps', result.payload.containerTraps);
  if (result.payload.money) renderSection('Money', result.payload.money);
  if (result.payload.exceptionalItems) renderSection('Exceptional Items', result.payload.exceptionalItems);
  if (result.payload.hoards) renderSection('Hoards', result.payload.hoards);
  if (result.payload.encounters) renderSection('Encounters', result.payload.encounters);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);
  const game = formData.get('game')?.toString() || 'Mutant Future';
  const level = Math.max(1, Math.min(100, Number(formData.get('level') || 1)));
  const money = (formData.get('money')?.toString().trim() || moneyDefaults(game));

  const flags = {
    showRules: formData.get('showRules') === '1',
    showMundane: formData.get('showMundane') === '1',
    showRoomTraps: formData.get('showRoomTraps') === '1',
    showContainers: formData.get('showContainers') === '1',
    showContainerTraps: formData.get('showContainerTraps') === '1',
    showMoney: formData.get('showMoney') === '1',
    showExceptional: formData.get('showExceptional') === '1',
    showHoards: formData.get('showHoards') === '1',
    showEncounters: formData.get('showEncounters') === '1',
    mutantsOnly: formData.get('mutantsOnly') === '1'
  };

  await loadBmbsPools(game, flags.mutantsOnly);

  const payload = {};

  if (flags.showRules) {
    payload.rules = [
      'Use one roll per section unless the fiction suggests multiple checks.',
      'If no GM is present, interpret results in the most dangerous plausible way.',
      'Treat level as encounter pressure and hoard intensity modifier.',
      'Mutants Only filters out baseline animals for non-Mutant Future games.'
    ];
  }
  if (flags.showMundane) payload.mundaneItems = makeTable(100, () => `${pick(rng, mundaneItems)}; ${pick(rng, mundaneItems)}`);
  if (flags.showRoomTraps) payload.roomTraps = makeTable(20, () => pick(rng, roomTraps));
  if (flags.showContainers) {
    payload.containersLarge = makeTable(20, () => pick(rng, largeContainers));
    payload.containersSmall = makeTable(20, () => pick(rng, smallContainers));
  }
  if (flags.showContainerTraps) payload.containerTraps = makeTable(20, () => pick(rng, containerTraps));
  if (flags.showMoney) payload.money = makeTable(100, () => makeMoney(rng, level, money));
  if (flags.showExceptional) payload.exceptionalItems = makeTable(100, () => pick(rng, exceptionalItems));
  if (flags.showHoards) {
    payload.hoards = makeTable(20, () => {
      const chunk = randomInt(rng, 5, 15);
      const items = [];
      for (let idx = 0; idx < chunk; idx += 1) {
        const roll = randomInt(rng, 1, 100);
        if (roll < 91) items.push(makeMoney(rng, level, money));
        else if (roll < 96) items.push(`${randomInt(rng, 1, 3)} gems`);
        else items.push(pick(rng, [...exceptionalItems, ...hoardExtras]));
      }
      return items.join(' ----- ');
    });
  }
  if (flags.showEncounters) {
    payload.encounters = makeTable(100, () => {
      const mutantPrefix = flags.mutantsOnly && game !== 'Mutant Future' ? 'mutated ' : '';
      return `${mutantPrefix}${pick(rng, encounters)} (L${Math.max(1, level + randomInt(rng, -2, 4))})`;
    });
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      game,
      level,
      money,
      flags
    },
    payload
  };

  renderResult(lastResult);
});

exportJsonButton.addEventListener('click', () => {
  window.WizardawnCore.exportJSON(`${toolId}-output.json`, lastResult);
});

exportMdButton.addEventListener('click', () => {
  const markdown = `# ${toolId} output

Generated: ${lastResult.generatedAt || 'n/a'}
Game: ${lastResult.config?.game || 'n/a'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
