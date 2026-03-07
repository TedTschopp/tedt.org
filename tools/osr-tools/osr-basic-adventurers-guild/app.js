const toolId = 'ladvg';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const classCaps = {
  Cleric: 20,
  Dwarf: 12,
  Elf: 10,
  Fighter: 20,
  Halfling: 8,
  'Magic-User': 20,
  Thief: 20
};

const racesByClass = {
  Cleric: 'Human',
  Dwarf: 'Dwarf',
  Elf: 'Elf',
  Fighter: 'Human',
  Halfling: 'Halfling',
  'Magic-User': 'Human',
  Thief: 'Human'
};

const saveLabels = ['BA', 'PD', 'PP', 'WN', 'SD'];
const alignments = ['Lawful', 'Neutral', 'Chaotic'];
const languages = ['Common', 'Dwarvish', 'Elvish', 'Gnomish', 'Goblin', 'Hobgoblin', 'Orcish', 'Draconic', 'Alignment Tongue'];

const gearByClass = {
  Cleric: ['mace', 'shield', 'holy symbol', 'chain armor'],
  Dwarf: ['battle axe', 'shield', 'lamp', 'pack'],
  Elf: ['sword', 'bow', 'quiver', 'travel cloak'],
  Fighter: ['long sword', 'shield', 'chainmail', 'rations'],
  Halfling: ['short sword', 'sling', 'stone pouch', 'hooded cloak'],
  'Magic-User': ['dagger', 'spellbook', 'robes', 'ink and quill'],
  Thief: ['short sword', 'dagger', 'leather armor', 'lockpicks']
};

const skillsByClass = {
  Cleric: ['Turn Undead', 'Divine Rites'],
  Dwarf: ['Detect Slopes', 'Stonework Lore'],
  Elf: ['Keen Senses', 'Secret Door Sense'],
  Fighter: ['Weapon Drill', 'Battle Line Discipline'],
  Halfling: ['Stealth', 'Missile Precision'],
  'Magic-User': ['Arcane Study', 'Scroll Lore'],
  Thief: ['Open Locks', 'Find Traps', 'Climb Sheer Surfaces']
};

const spellPool = ['Cure Light Wounds', 'Bless', 'Light', 'Protection from Evil', 'Sleep', 'Magic Missile', 'Detect Magic', 'Shield', 'Charm Person', 'Invisibility', 'Web', 'Fireball'];

const firstNames = ['Aldo', 'Brenna', 'Cato', 'Della', 'Edric', 'Fara', 'Gideon', 'Hesta', 'Ivo', 'Jora', 'Kellan', 'Lysa', 'Milo', 'Nera', 'Orin', 'Pella', 'Quill', 'Rina', 'Seth', 'Tala'];
const lastNames = ['Amber', 'Bright', 'Cask', 'Dawn', 'Elder', 'Frost', 'Grain', 'Hearth', 'Iron', 'Jade', 'Keen', 'Long', 'Marsh', 'North', 'Oak', 'Pike', 'Quick', 'Rook', 'Stone', 'Thorn'];

const FALLBACK_FIRST_NAMES = [...firstNames];
const FALLBACK_LAST_NAMES = [...lastNames];
const FALLBACK_SPELL_POOL = [...spellPool];

let runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
let runtimeLastNames = [...FALLBACK_LAST_NAMES];
let runtimeSpellPool = [...FALLBACK_SPELL_POOL];

let runtimePoolsReady = false;
let runtimePoolsLoading = null;

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function toTitleCase(value) {
  const text = normalizeText(value).toLowerCase();
  if (!text) {
    return '';
  }
  return text.replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => normalizeText(value)).filter(Boolean))];
}

function resetRuntimePools() {
  runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
  runtimeLastNames = [...FALLBACK_LAST_NAMES];
  runtimeSpellPool = [...FALLBACK_SPELL_POOL];
}

function extractNameTokens(text, minLength = 3, maxLength = 12) {
  return normalizeText(text)
    .split(/[^A-Za-z]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= minLength && token.length <= maxLength)
    .map((token) => toTitleCase(token));
}

async function loadRuntimePools(config) {
  if (runtimePoolsReady) {
    return;
  }
  if (runtimePoolsLoading) {
    await runtimePoolsLoading;
    return;
  }

  runtimePoolsLoading = (async () => {
    resetRuntimePools();
    if (!window.WizardawnData) {
      runtimePoolsReady = true;
      return;
    }

    try {
      const [legendRows, spells, monsters] = await Promise.all([
        window.WizardawnData.getWorldmapLegend(),
        window.WizardawnData.getLabLordSpells(),
        window.WizardawnData.getMonstersForGame('LL', { includeFf: false, includeMm2: false })
      ]);

      const legendTokens = uniqueStrings((legendRows || []).flatMap((row) => extractNameTokens(row.nameClean || row.name || '')));
      const monsterTokens = uniqueStrings((monsters || []).flatMap((row) => extractNameTokens(row.name || '')));

      const firstCandidates = uniqueStrings([...legendTokens, ...monsterTokens].filter((token) => token.length >= 4 && token.length <= 9));
      const lastCandidates = uniqueStrings([...legendTokens, ...monsterTokens].filter((token) => token.length >= 4 && token.length <= 12));
      if (firstCandidates.length) {
        runtimeFirstNames = uniqueStrings([...runtimeFirstNames, ...firstCandidates]);
      }
      if (lastCandidates.length) {
        runtimeLastNames = uniqueStrings([...runtimeLastNames, ...lastCandidates]);
      }

      const spellNames = uniqueStrings((spells || []).map((row) => toTitleCase(row.name || '')));
      if (spellNames.length) {
        runtimeSpellPool = uniqueStrings([...runtimeSpellPool, ...spellNames]);
      }

      if (config.flags.useAecLanguages) {
        const mutantRows = await window.WizardawnData.getMutants();
        const mutantTokens = uniqueStrings((mutantRows || []).flatMap((row) => extractNameTokens(row.name || '')));
        if (mutantTokens.length) {
          runtimeLastNames = uniqueStrings([...runtimeLastNames, ...mutantTokens]);
        }
      }
    } catch (error) {
      console.warn('ladvg runtime enrichment failed; using fallback pools', error);
      resetRuntimePools();
    }

    runtimePoolsReady = true;
  })();

  try {
    await runtimePoolsLoading;
  } finally {
    runtimePoolsLoading = null;
  }
}

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: {
    outputType: 'Character Listing',
    lvl1: 1,
    lvl2: 20,
    sex: 'Any'
  },
  payload: {
    characters: []
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
  if (state === 0) state = 987654321;
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

function mod(score) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}

function fmt(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function rollStat(rng, favored = false) {
  if (!favored) return randomInt(rng, 3, 18);
  return Math.max(randomInt(rng, 3, 18), randomInt(rng, 3, 18), randomInt(rng, 3, 18), randomInt(rng, 3, 18));
}

function levelForClass(rng, klass, minLevel, maxLevel) {
  const cap = classCaps[klass] || 20;
  return Math.min(cap, randomInt(rng, minLevel, maxLevel));
}

function statsForClass(rng, klass) {
  const favoredByClass = {
    Cleric: 'wisdom',
    Dwarf: 'strength',
    Elf: 'strength',
    Fighter: 'strength',
    Halfling: 'dexterity',
    'Magic-User': 'intelligence',
    Thief: 'dexterity'
  };

  const favored = favoredByClass[klass] || 'strength';
  const stats = {
    strength: rollStat(rng, favored === 'strength'),
    dexterity: rollStat(rng, favored === 'dexterity'),
    constitution: rollStat(rng, false),
    intelligence: rollStat(rng, favored === 'intelligence'),
    wisdom: rollStat(rng, favored === 'wisdom'),
    charisma: rollStat(rng, false)
  };

  if (klass === 'Dwarf') stats.constitution = Math.max(stats.constitution, 9);
  if (klass === 'Elf') stats.intelligence = Math.max(stats.intelligence, 9);
  if (klass === 'Halfling') {
    stats.dexterity = Math.max(stats.dexterity, 9);
    stats.constitution = Math.max(stats.constitution, 9);
  }

  return stats;
}

function hitDie(klass) {
  if (klass === 'Magic-User' || klass === 'Thief') return 4;
  if (klass === 'Cleric' || klass === 'Elf' || klass === 'Halfling') return 6;
  return 8;
}

function hitPoints(rng, klass, level, maxHp, conMod) {
  const die = hitDie(klass);
  let hp = 0;
  for (let i = 0; i < level; i += 1) hp += maxHp ? die : randomInt(rng, 1, die);
  hp += level * conMod;
  return Math.max(level, hp);
}

function armorClass(rng, dexMod) {
  return Math.max(-5, Math.min(9, randomInt(rng, 3, 8) - dexMod));
}

function attacksByAc(level, strMod) {
  const base = Math.max(5, 20 - level);
  return Array.from({ length: 10 }, (_, ac) => Math.max(2, base - ac - Math.max(0, strMod)));
}

function saves(level) {
  return {
    BA: Math.max(2, 16 - Math.floor(level / 2)),
    PD: Math.max(2, 14 - Math.floor(level / 2)),
    PP: Math.max(2, 15 - Math.floor(level / 2)),
    WN: Math.max(2, 16 - Math.floor(level / 2)),
    SD: Math.max(2, 17 - Math.floor(level / 2))
  };
}

function xpForLevel(level, randomExperience, rng) {
  const min = level * 1000;
  const max = (level + 1) * 2000;
  return randomExperience ? randomInt(rng, min, max) : min;
}

function nextLevelXp(level) {
  return (level + 1) * 2000;
}

function xpMod(stats) {
  const primary = stats.strength + stats.wisdom + stats.intelligence;
  if (primary >= 45) return '+10%';
  if (primary >= 36) return '+5%';
  if (primary <= 24) return '-10%';
  return '0%';
}

function pocketCoins(rng, level, sheetsMode) {
  if (sheetsMode) return 'Coins kept in reserves';
  return `${randomInt(rng, 0, level * 20)} gp, ${randomInt(rng, 0, level * 50)} sp, ${randomInt(rng, 0, level * 100)} cp`;
}

function chooseLanguages(rng, klass, intelligence, chooseSet, useAec) {
  const known = Math.max(1, Math.floor((intelligence - 6) / 3));
  if (!chooseSet) return `${known} additional language(s)`;
  const list = [...languages];
  if (useAec) list.push('Gnoll', 'Kobold', 'Bugbear', 'Lizardfolk');
  const chosen = new Set([racesByClass[klass] === 'Elf' ? 'Elvish' : 'Common']);
  while (chosen.size < known + 1 && chosen.size < list.length) chosen.add(pick(rng, list));
  return [...chosen].join(', ');
}

function spellSelection(rng, klass, level) {
  if (!['Cleric', 'Magic-User', 'Elf'].includes(klass) || level < 2) return [];
  const qty = Math.min(8, Math.max(1, Math.floor(level / 2)));
  const chosen = new Set();
  while (chosen.size < qty) chosen.add(pick(rng, runtimeSpellPool));
  return [...chosen];
}

function queueFromCounts(counts) {
  const order = ['Cleric', 'Dwarf', 'Elf', 'Fighter', 'Halfling', 'Magic-User', 'Thief'];
  const queue = [];
  order.forEach((klass) => {
    for (let i = 0; i < (counts[klass] || 0); i += 1) queue.push(klass);
  });
  if (!queue.length) queue.push('Fighter');
  return queue;
}

function makeCharacter(rng, klass, config) {
  const level = levelForClass(rng, klass, config.lvl1, config.lvl2);
  const stats = statsForClass(rng, klass);
  const strengthMod = mod(stats.strength);
  const dexMod = mod(stats.dexterity);
  const conMod = mod(stats.constitution);
  const intMod = mod(stats.intelligence);
  const wisMod = mod(stats.wisdom);
  const chaMod = mod(stats.charisma);

  const hp = hitPoints(rng, klass, level, config.flags.maxHp, conMod);
  const ac = armorClass(rng, dexMod);
  const saveBlock = saves(level);
  const attacks = attacksByAc(level, strengthMod);
  const sex = config.sex === 'Any' ? (randomInt(rng, 0, 1) ? 'Male' : 'Female') : config.sex;
  const age = 16 + level + randomInt(rng, 1, 20);
  const name = config.flags.nameCharacters ? `${pick(rng, runtimeFirstNames)} ${pick(rng, runtimeLastNames)}` : null;
  const alignment = pick(rng, alignments);

  const baseEquipment = config.flags.showEquipment ? [...(gearByClass[klass] || [])] : [];
  if (config.flags.showEquipment && config.flags.showRelics && randomInt(rng, 1, 5) === 1) baseEquipment.push('minor magical item');

  const knownLangs = chooseLanguages(rng, klass, stats.intelligence, config.flags.chooseLanguages, config.flags.useAecLanguages);
  const spells = config.flags.showSpellLists ? spellSelection(rng, klass, level) : [];

  return {
    name,
    class: klass,
    race: racesByClass[klass],
    gender: sex,
    alignment: config.flags.showAlignment ? alignment : null,
    age: config.flags.showAge || config.flags.advancedSheet ? age : null,
    level,
    xp: xpForLevel(level, config.flags.randomExperience, rng),
    xpNeeded: level >= classCaps[klass] ? 'Max Level' : nextLevelXp(level),
    xpMod: xpMod(stats),
    hp,
    ac,
    stats,
    saves: saveBlock,
    attacks,
    modifiers: {
      SB: fmt(strengthMod),
      AB: fmt(dexMod),
      MA: fmt(dexMod),
      IB: fmt(dexMod),
      CB: fmt(conMod),
      LG: fmt(Math.max(0, intMod)),
      SM: fmt(wisMod),
      RA: fmt(chaMod),
      RT: `${Math.max(1, 4 + chaMod)}`,
      RM: `${Math.max(4, 7 + chaMod)}`
    },
    languages: knownLangs,
    abilities: config.flags.showSkills ? skillsByClass[klass] || [] : [],
    spells,
    spellBook: config.flags.showSpellBook ? spells : [],
    description: config.flags.showDescriptions && config.flags.nameCharacters
      ? `${name} has the weathered look of a road-tested ${klass.toLowerCase()} and a practical adventuring style.`
      : null,
    equipment: baseEquipment,
    coins: pocketCoins(rng, level, config.outputType === 'Character Sheets')
  };
}

function renderListing(character, index) {
  const card = document.createElement('article');
  card.className = 'guild-card';

  const title = document.createElement('div');
  title.className = 'guild-title';
  title.textContent = `${index + 1}. ${character.name || '(Unnamed)'} — ${character.class}`;
  card.appendChild(title);

  const top = document.createElement('div');
  top.className = 'guild-meta';
  top.textContent = `LV ${character.level} · HP ${character.hp} · AC ${character.ac} · XP ${character.xp} · XP Next ${character.xpNeeded} · ${character.gender}${character.age ? ` · Age ${character.age}` : ''}${character.alignment ? ` · ${character.alignment}` : ''}`;
  card.appendChild(top);

  const stats = document.createElement('div');
  stats.className = 'guild-grid';
  stats.innerHTML = [
    `ST ${character.stats.strength}`,
    `DX ${character.stats.dexterity}`,
    `CN ${character.stats.constitution}`,
    `IN ${character.stats.intelligence}`,
    `WS ${character.stats.wisdom}`,
    `CH ${character.stats.charisma}`,
    ...saveLabels.map((label) => `${label} ${character.saves[label]}`)
  ].map((item) => `<span>${item}</span>`).join('');
  card.appendChild(stats);

  const attacks = document.createElement('div');
  attacks.className = 'guild-block';
  attacks.textContent = `Attack vs AC 0-9: ${character.attacks.join(', ')}`;
  card.appendChild(attacks);

  const mods = document.createElement('div');
  mods.className = 'guild-block';
  mods.textContent = `Mods SB ${character.modifiers.SB} · AB ${character.modifiers.AB} · MA ${character.modifiers.MA} · IB ${character.modifiers.IB} · CB ${character.modifiers.CB} · LG ${character.modifiers.LG} · SM ${character.modifiers.SM} · RA ${character.modifiers.RA} · RT ${character.modifiers.RT} · RM ${character.modifiers.RM}`;
  card.appendChild(mods);

  const langs = document.createElement('div');
  langs.className = 'guild-block';
  langs.textContent = `Languages: ${character.languages}`;
  card.appendChild(langs);

  if (character.description) {
    const desc = document.createElement('div');
    desc.className = 'guild-block';
    desc.textContent = character.description;
    card.appendChild(desc);
  }
  if (character.abilities.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Abilities: ${character.abilities.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.spells.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Spell List: ${character.spells.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.spellBook.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Spell Book: ${character.spellBook.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.equipment.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Equipment: ${character.equipment.join(', ')} · ${character.coins}`;
    card.appendChild(detail);
  }

  return card;
}

function renderSheet(character, index) {
  const card = document.createElement('article');
  card.className = 'sheet-card';

  const title = document.createElement('div');
  title.className = 'sheet-title';
  title.textContent = `${index + 1}. ${character.name || '(Unnamed)'} — ${character.class}`;
  card.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'sheet-meta';
  meta.textContent = `${character.gender} ${character.race} · LV ${character.level} · HP ${character.hp} · AC ${character.ac}${character.alignment ? ` · ${character.alignment}` : ''}${character.age ? ` · Age ${character.age}` : ''}`;
  card.appendChild(meta);

  const stats = document.createElement('div');
  stats.className = 'sheet-grid';
  stats.innerHTML = `
    <span>ST ${character.stats.strength}</span>
    <span>DX ${character.stats.dexterity}</span>
    <span>CN ${character.stats.constitution}</span>
    <span>IN ${character.stats.intelligence}</span>
    <span>WS ${character.stats.wisdom}</span>
    <span>CH ${character.stats.charisma}</span>
    ${saveLabels.map((label) => `<span>${label} ${character.saves[label]}</span>`).join('')}
  `;
  card.appendChild(stats);

  const xp = document.createElement('div');
  xp.className = 'guild-block';
  xp.textContent = `XP ${character.xp} · XP Needed ${character.xpNeeded} · XP Mod ${character.xpMod}`;
  card.appendChild(xp);

  const attacks = document.createElement('div');
  attacks.className = 'guild-block';
  attacks.textContent = `Attack Table (AC 0-9): ${character.attacks.join(', ')}`;
  card.appendChild(attacks);

  const langs = document.createElement('div');
  langs.className = 'guild-block';
  langs.textContent = `Languages: ${character.languages}`;
  card.appendChild(langs);

  if (character.abilities.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Abilities: ${character.abilities.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.spellBook.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Spell Book: ${character.spellBook.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.equipment.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Equipment: ${character.equipment.join(', ')} · ${character.coins}`;
    card.appendChild(detail);
  }
  if (character.description) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = character.description;
    card.appendChild(detail);
  }

  return card;
}

function renderResult(result) {
  output.innerHTML = '';

  const characters = result.payload.characters;
  if (!characters.length) {
    output.innerHTML = '<em>No adventurers generated.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'guild-summary';
  summary.textContent = `${characters.length} adventurer(s) · ${result.config.outputType}`;
  output.appendChild(summary);

  characters.forEach((character, index) => {
    const node = result.config.outputType === 'Character Sheets'
      ? renderSheet(character, index)
      : renderListing(character, index);
    output.appendChild(node);

    if (result.config.flags.imageSeparator && index < characters.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'guild-divider';
      divider.textContent = '✦';
      output.appendChild(divider);
    }
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const outputType = formData.get('outputType')?.toString() || 'Character Listing';
  const lvl1Raw = Math.max(1, Math.min(20, Number(formData.get('lvl1') || 1)));
  const lvl2Raw = Math.max(1, Math.min(20, Number(formData.get('lvl2') || 20)));
  const lvl1 = Math.min(lvl1Raw, lvl2Raw);
  const lvl2 = Math.max(lvl1Raw, lvl2Raw);
  const sex = formData.get('sex')?.toString() || 'Any';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const classCounts = {
    Cleric: Math.max(0, Math.min(20, Number(formData.get('qtyCleric') || 0))),
    Dwarf: Math.max(0, Math.min(20, Number(formData.get('qtyDwarf') || 0))),
    Elf: Math.max(0, Math.min(20, Number(formData.get('qtyElf') || 0))),
    Fighter: Math.max(0, Math.min(20, Number(formData.get('qtyFighter') || 0))),
    Halfling: Math.max(0, Math.min(20, Number(formData.get('qtyHalfling') || 0))),
    'Magic-User': Math.max(0, Math.min(20, Number(formData.get('qtyMage') || 0))),
    Thief: Math.max(0, Math.min(20, Number(formData.get('qtyThief') || 0)))
  };

  const flags = {
    nameCharacters: formData.get('nameCharacters') === '1',
    showRelics: formData.get('showRelics') === '1',
    maxHp: formData.get('maxHp') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    showEquipment: formData.get('showEquipment') === '1',
    showSkills: formData.get('showSkills') === '1',
    showSpellLists: formData.get('showSpellLists') === '1',
    showSpellBook: formData.get('showSpellBook') === '1',
    showAlignment: formData.get('showAlignment') === '1',
    showAge: formData.get('showAge') === '1',
    chooseLanguages: formData.get('chooseLanguages') === '1',
    useAecLanguages: formData.get('useAecLanguages') === '1',
    advancedSheet: formData.get('advancedSheet') === '1',
    randomExperience: formData.get('randomExperience') === '1',
    imageSeparator: formData.get('imageSeparator') === '1'
  };

  const queue = queueFromCounts(classCounts);
  const config = {
    outputType,
    lvl1,
    lvl2,
    sex,
    flags
  };

  await loadRuntimePools(config);

  const characters = queue.map((klass) => makeCharacter(rng, klass, config));

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      outputType,
      lvl1,
      lvl2,
      sex,
      classCounts,
      flags
    },
    payload: {
      characters
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
Type: ${lastResult.config.outputType}
Characters: ${lastResult.payload.characters.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
