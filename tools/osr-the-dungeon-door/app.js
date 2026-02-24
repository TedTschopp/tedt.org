const toolId = 'door';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const fallbackMundaneItems = ['rope coil', 'iron spikes', 'lantern', 'chalk bundle', 'waterskin', 'pitons', 'flask of oil', 'small hammer', 'tinderbox', 'bandages'];
const fallbackUnusualItems = ['glass key', 'etched obsidian shard', 'strange idol', 'clockwork lens', 'moon-metal coin', 'hollow reliquary'];
const roomTraps = ['dart barrage', 'swinging blade', 'falling block', 'toxic vapor', 'pit trap', 'arcane glyph'];
const fallbackContainers = ['iron-bound chest', 'stone coffer', 'sealed urn', 'locked cabinet', 'buried cache', 'sarcophagus'];
const containerTraps = ['needle lock', 'acid vial trigger', 'sleep gas release', 'spring bolt', 'curse sigil'];
const curses = ['mark of frailty', 'coin-blight', 'shadow tether', 'echo madness', 'tongue of lies'];
const fallbackCoinGemJewels = ['12 gp and a moonstone', '47 sp and 2 agates', '1 ruby and 95 cp', '7 gold rings and 20 gp', 'mixed coin purse worth 62 gp'];
const exceptionalItems = ['+1 blade', 'warding cloak', 'ring of minor protection', 'healing draught set', 'map to sealed vault'];
const treasureHoards = ['chieftain cache', 'forgotten temple reserve', 'wizard stash', 'black market vault', 'dragon tribute coffer'];
const fallbackEncounters = ['skeleton patrol', 'slime cluster', 'orc scouts', 'cult acolytes', 'ghoul pack', 'mimic disguised as altar'];

let mundaneItems = fallbackMundaneItems;
let unusualItems = fallbackUnusualItems;
let containers = fallbackContainers;
let coinGemJewels = fallbackCoinGemJewels;
let encounters = fallbackEncounters;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    sections: []
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
  if (state === 0) state = 71717171;
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

function uniqueMerge(primary, fallback) {
  return [...new Set([...primary, ...fallback])];
}

function cleanItemLabel(item) {
  return String(item || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function gameToStoreCodes(game, aec) {
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game.includes('Tunnels & Trolls')) return ['TT'];
  if (game === 'Labyrinth Lord') return aec ? ['LL', 'AEC'] : ['LL'];
  return ['LL'];
}

function gameToMonsterCode(game) {
  if (game === 'OSRIC') return 'OSRIC';
  if (game === 'AD&D') return 'AD';
  if (game === 'BFRPG') return 'BFRPG';
  if (game === 'BD&D') return 'BX';
  if (game === 'Swords & Wizardry') return 'SW';
  if (game === 'Swords & Six-Siders') return 'SX';
  if (game.includes('Tunnels & Trolls')) return 'TT';
  return 'LL';
}

function isMundaneLike(label) {
  return /\b(rope|spike|lantern|chalk|waterskin|piton|flask|hammer|tinderbox|bandage|crowbar|shovel|torch|map|sack|bag|backpack|oil|quill|paper|parchment|pot|mirror|tent)\b/i.test(label);
}

function isContainerLike(label) {
  return /\b(chest|coffer|urn|cabinet|cache|sarcophagus|box|case|crate|barrel|jar|pack|satchel|bag|sack)\b/i.test(label);
}

function isUnusualLike(label) {
  return /\b(idol|obsidian|moon|reliquary|crystal|orb|relic|glyph|sigil|ivory|jewel|gem|ruby|emerald|sapphire|pearl)\b/i.test(label);
}

function isTreasureLike(label) {
  return /\b(gem|jewel|ring|necklace|bracelet|ruby|emerald|sapphire|pearl|gold|silver|coin|medallion)\b/i.test(label);
}

function buildCoinGemPool(rows) {
  const pool = rows
    .filter((row) => row.cost > 0 && isTreasureLike(cleanItemLabel(row.item)))
    .slice(0, 40)
    .map((row) => `${Math.max(1, row.cost)} gp and ${cleanItemLabel(row.item)}`);
  return uniqueMerge(pool, fallbackCoinGemJewels);
}

async function loadDoorPools(config) {
  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const storeRows = await window.WizardawnData.getStoreItemsByStore(
      gameToStoreCodes(config.game, config.options.aec),
      ['SUPPLIES', 'TAVERN', 'ALCHEMIST', 'TAILOR', 'MILITARY', 'VEHICLE']
    );

    if (Array.isArray(storeRows) && storeRows.length) {
      const mundaneSet = new Set();
      const unusualSet = new Set();
      const containerSet = new Set();

      storeRows.forEach((row) => {
        const label = cleanItemLabel(row.item);
        if (!label) return;
        if (isMundaneLike(label)) mundaneSet.add(label);
        if (isContainerLike(label)) containerSet.add(label);
        if (isUnusualLike(label)) unusualSet.add(label);
      });

      mundaneItems = uniqueMerge([...mundaneSet], fallbackMundaneItems);
      unusualItems = uniqueMerge([...unusualSet], fallbackUnusualItems);
      containers = uniqueMerge([...containerSet], fallbackContainers);
      coinGemJewels = buildCoinGemPool(storeRows);
    } else {
      mundaneItems = fallbackMundaneItems;
      unusualItems = fallbackUnusualItems;
      containers = fallbackContainers;
      coinGemJewels = fallbackCoinGemJewels;
    }

    if (window.WizardawnData.getMonstersForGame) {
      const monsterRows = await window.WizardawnData.getMonstersForGame(gameToMonsterCode(config.game), {
        includeFf: config.options.ff,
        includeMm2: config.options.mm2
      });

      let encounterNames = Array.isArray(monsterRows) ? monsterRows.map((row) => row.name.toLowerCase()).filter(Boolean) : [];

      if (config.game === 'Labyrinth Lord' && config.options.aec && window.WizardawnData.getMonstersForGame) {
        const aecRows = await window.WizardawnData.getMonstersForGame('AEC');
        encounterNames = encounterNames.concat((aecRows || []).map((row) => row.name.toLowerCase()).filter(Boolean));
      }

      if (config.game === 'OSRIC' && config.options.mom && window.WizardawnData.getMonstersRpgs) {
        const allRows = await window.WizardawnData.getMonstersRpgs();
        const mom = (allRows || [])
          .filter((row) => String(row.creator || '').toUpperCase().includes('MOM'))
          .map((row) => String(row.name || '').toLowerCase())
          .filter(Boolean);
        encounterNames = encounterNames.concat(mom);
      }

      encounters = uniqueMerge([...new Set(encounterNames)].slice(0, 80), fallbackEncounters);
    } else {
      encounters = fallbackEncounters;
    }
  } catch (error) {
    console.warn('Unable to load dungeon door pools from shared data:', error);
    mundaneItems = fallbackMundaneItems;
    unusualItems = fallbackUnusualItems;
    containers = fallbackContainers;
    coinGemJewels = fallbackCoinGemJewels;
    encounters = fallbackEncounters;
  }
}

function rollLabel(index, game) {
  const ttGames = ['Swords & Six-Siders', 'Tunnels & Trolls 5th Edition', 'Tunnels & Trolls 7th Edition', 'Tunnels & Trolls Deluxe'];
  if (!ttGames.includes(game)) return `${index}`;
  const section = Math.floor((index - 1) / 16) + 1;
  const roll = ((index - 1) % 16) + 3;
  return `S${section}/${roll}`;
}

function buildTable(rng, title, count, game, generator) {
  return {
    title,
    rows: Array.from({ length: count }, (_, idx) => ({
      roll: rollLabel(idx + 1, game),
      result: generator(rng, idx + 1)
    }))
  };
}

function renderResult(result) {
  output.innerHTML = '';
  const sections = result.payload.sections;
  if (!sections.length) {
    output.innerHTML = '<em>Select one or more sections and generate.</em>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'door-header';
  header.textContent = `${result.config.game} · Dungeon Level ${result.config.level || 'random'} · ${sections.length} section(s)`;
  output.appendChild(header);

  sections.forEach((section) => {
    const card = document.createElement('article');
    card.className = 'door-card';
    const rows = section.rows
      .map((row) => `<tr><td class="door-roll">${row.roll}</td><td>${row.result}</td></tr>`)
      .join('');
    card.innerHTML = `<div class="door-title">${section.title}</div><table class="door-table"><tbody>${rows}</tbody></table>`;
    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const config = {
    game: formData.get('game')?.toString() || 'Labyrinth Lord',
    level: Math.max(0, Math.min(100, Number(formData.get('level') || 1))),
    magicPercent: Math.max(0, Math.min(100, Number(formData.get('magicPercent') || 50))),
    ttDifficulty: Number(formData.get('ttDifficulty') || 1),
    options: {
      mom: formData.get('optMom') === '1',
      ff: formData.get('optFf') === '1',
      mm2: formData.get('optMm2') === '1',
      ua: formData.get('optUa') === '1',
      aec: formData.get('optAec') === '1',
      ttMagestykc: formData.get('ttMagestykc') === '1',
      showDescribe: formData.get('showDescribe') === '1'
    }
  };

  const sections = [];

  await loadDoorPools(config);

  if (formData.get('showRules') === '1') {
    sections.push(buildTable(rng, 'Rules', 12, config.game, () => pick(rng, [
      'Roll for intent, then risk; resolve fast and move.',
      'A failed check can still advance with a cost.',
      'Restocking chance: 1-in-6 each room cycle.',
      'Noise increases wandering encounter chance by +10%.',
      'Light expires after major scenes; track torches.',
      'Doors are uncertain until tested; listen, force, or bypass.',
      'Large treasure slows movement unless pack animals are present.'
    ])));
  }

  if (formData.get('showMundane') === '1') {
    sections.push(buildTable(rng, 'Mundane Items', 20, config.game, () => pick(rng, mundaneItems)));
  }
  if (formData.get('showUnusual') === '1') {
    sections.push(buildTable(rng, 'Unusual Items', 20, config.game, () => pick(rng, unusualItems)));
  }
  if (formData.get('showRoomTraps') === '1') {
    sections.push(buildTable(rng, 'Room Traps', 20, config.game, () => `${pick(rng, roomTraps)} (L${Math.max(1, config.level)})`));
  }
  if (formData.get('showContainers') === '1') {
    sections.push(buildTable(rng, 'Containers', 20, config.game, () => pick(rng, containers)));
  }
  if (formData.get('showContainerTraps') === '1') {
    sections.push(buildTable(rng, 'Container Traps', 20, config.game, () => pick(rng, containerTraps)));
  }
  if (formData.get('showCurses') === '1') {
    sections.push(buildTable(rng, 'Curses', 20, config.game, () => pick(rng, curses)));
  }
  if (formData.get('showCoinGem') === '1') {
    sections.push(buildTable(rng, 'Coins, Gems & Jewels', 20, config.game, () => pick(rng, coinGemJewels)));
  }
  if (formData.get('showExceptional') === '1') {
    sections.push(buildTable(rng, 'Exceptional Items', 20, config.game, () => {
      const source = randomInt(rng, 1, 100) <= config.magicPercent ? 'Game Source' : 'Wizardawn Source';
      return `${pick(rng, exceptionalItems)} (${source})`;
    }));
  }
  if (formData.get('showHoards') === '1') {
    sections.push(buildTable(rng, 'Treasure Hoards', 20, config.game, () => `${pick(rng, treasureHoards)} · value x${Math.max(1, Math.ceil(config.level / 2))}`));
  }
  if (formData.get('showEncounters') === '1') {
    sections.push(buildTable(rng, 'Encounters', 20, config.game, () => {
      const base = pick(rng, encounters);
      if (!config.options.showDescribe) return base;
      return `${base} — ${pick(rng, ['hostile', 'wary', 'bargaining', 'patrolling', 'hiding'])}`;
    }));
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      sections
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
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
