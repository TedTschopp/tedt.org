const toolId = 'oadvg';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const classCaps = {
  Assassin: 15,
  Cleric: 20,
  Druid: 14,
  Fighter: 20,
  Illusionist: 14,
  'Magic-User': 20,
  Paladin: 11,
  Ranger: 15,
  Thief: 20
};

const favoredStatByClass = {
  Assassin: 'dexterity',
  Cleric: 'wisdom',
  Druid: 'wisdom',
  Fighter: 'strength',
  Illusionist: 'intelligence',
  'Magic-User': 'intelligence',
  Paladin: 'charisma',
  Ranger: 'dexterity',
  Thief: 'dexterity'
};

const abilitiesByClass = {
  Assassin: ['Backstab', 'Disguise', 'Poison Lore'],
  Cleric: ['Turn Undead', 'Divine Petition', 'Religious Lore'],
  Druid: ['Druidic Lore', 'Animal Rapport', 'Nature Sense'],
  Fighter: ['Weapon Specialization', 'Formation Tactics', 'Shield Discipline'],
  Illusionist: ['Minor Glamour', 'Visual Misdirection', 'Pattern Weaving'],
  'Magic-User': ['Scroll Scribing', 'Arcane Theory', 'Spellcraft'],
  Paladin: ['Detect Evil', 'Lay on Hands', 'Aura of Courage'],
  Ranger: ['Tracking', 'Wilderness Survival', 'Ambush Sense'],
  Thief: ['Open Locks', 'Find/Remove Traps', 'Move Silently']
};

const gearByClass = {
  Assassin: ['short sword', 'dagger', 'dark cloak', 'thieves tools'],
  Cleric: ['mace', 'shield', 'holy symbol', 'chain hauberk'],
  Druid: ['sickle', 'staff', 'mistletoe focus', 'hide armor'],
  Fighter: ['long sword', 'shield', 'chainmail', 'backpack'],
  Illusionist: ['dagger', 'spellbook', 'ink and quill', 'robes'],
  'Magic-User': ['dagger', 'spellbook', 'robes', 'component pouch'],
  Paladin: ['long sword', 'lance', 'plate armor', 'warhorse tack'],
  Ranger: ['longbow', 'short sword', 'leather armor', 'traveler kit'],
  Thief: ['short sword', 'dagger', 'leather armor', 'lockpicks']
};

const magicItems = ['+1 weapon', 'cloak of protection', 'ring of feather falling', 'boots of elvenkind', 'minor healing draught', 'wand fragment'];
const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
const races = ['Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Halfling', 'Half-Orc', 'Human'];
const saveLabels = ['RSW', 'BW', 'DPP', 'PP', 'SPL'];

const firstNames = ['Aldric', 'Beatrix', 'Corvin', 'Daria', 'Edric', 'Fenna', 'Garrick', 'Helene', 'Ivor', 'Jessa', 'Kael', 'Lyra', 'Merric', 'Nysa', 'Orin', 'Petra', 'Quent', 'Rhea', 'Silas', 'Tarin', 'Ulric', 'Vera', 'Wren', 'Ysra', 'Zorin'];
const lastNames = ['Ashford', 'Blackthorn', 'Crowmere', 'Dunwall', 'Emberfall', 'Frosthaven', 'Grimward', 'Highmere', 'Ironvale', 'Jadebridge', 'Keenfield', 'Larkspur', 'Mournhill', 'Northglen', 'Oakrest', 'Pryce', 'Quickwater', 'Ravenoak', 'Stormvale', 'Thistleby'];

const FALLBACK_FIRST_NAMES = [...firstNames];
const FALLBACK_LAST_NAMES = [...lastNames];
const FALLBACK_MAGIC_ITEMS = [...magicItems];

let runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
let runtimeLastNames = [...FALLBACK_LAST_NAMES];
let runtimeMagicItems = [...FALLBACK_MAGIC_ITEMS];

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

function extractNameTokens(text, minLength = 3, maxLength = 12) {
  return normalizeText(text)
    .split(/[^A-Za-z]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= minLength && token.length <= maxLength)
    .map((token) => toTitleCase(token));
}

function isRelicLikeItem(label) {
  return /amulet|ring|wand|staff|scroll|cloak|bracer|sword|blade|helm|helmet|orb|idol|talisman|relic|potion/i.test(label);
}

function resetRuntimePools() {
  runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
  runtimeLastNames = [...FALLBACK_LAST_NAMES];
  runtimeMagicItems = [...FALLBACK_MAGIC_ITEMS];
}

async function loadRuntimePools() {
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
      const [legendRows, monsters, storeItems] = await Promise.all([
        window.WizardawnData.getWorldmapLegend(),
        window.WizardawnData.getMonstersForGame('OSRIC'),
        window.WizardawnData.getStoreItemsForGames(['OSRIC'])
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

      const relics = uniqueStrings((storeItems || [])
        .map((row) => toTitleCase(row.item || ''))
        .filter((item) => item.length >= 4 && item.length <= 48)
        .filter((item) => isRelicLikeItem(item)));
      if (relics.length) {
        runtimeMagicItems = uniqueStrings([...runtimeMagicItems, ...relics]);
      }
    } catch (error) {
      console.warn('oadvg runtime enrichment failed; using fallback pools', error);
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
    sex: 'Any',
    race: 'Any'
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
  if (state === 0) state = 246813579;
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

function abilityModifier(score) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}

function formatBonus(value) {
  if (value > 0) return `+${value}`;
  return `${value}`;
}

function hitDieForClass(klass) {
  if (klass === 'Magic-User' || klass === 'Illusionist' || klass === 'Assassin' || klass === 'Thief') return 4;
  if (klass === 'Cleric' || klass === 'Druid') return 6;
  if (klass === 'Paladin' || klass === 'Ranger' || klass === 'Fighter') return 10;
  return 8;
}

function rollStat(rng, favored = false) {
  if (!favored) return randomInt(rng, 3, 18);
  const rolls = [randomInt(rng, 3, 18), randomInt(rng, 3, 18), randomInt(rng, 3, 18)];
  return Math.max(...rolls);
}

function rollStats(rng, klass) {
  const favored = favoredStatByClass[klass] || 'strength';
  const stats = {
    strength: rollStat(rng, favored === 'strength'),
    intelligence: rollStat(rng, favored === 'intelligence'),
    wisdom: rollStat(rng, favored === 'wisdom'),
    dexterity: rollStat(rng, favored === 'dexterity'),
    constitution: rollStat(rng, favored === 'constitution'),
    charisma: rollStat(rng, favored === 'charisma')
  };

  if (klass === 'Paladin') {
    stats.charisma = Math.max(stats.charisma, 12);
    stats.strength = Math.max(stats.strength, 12);
  }
  if (klass === 'Ranger') {
    stats.dexterity = Math.max(stats.dexterity, 12);
    stats.constitution = Math.max(stats.constitution, 12);
  }

  return stats;
}

function rollHp(rng, klass, level, maxHp, conModifier) {
  const die = hitDieForClass(klass);
  let hp = 0;
  for (let idx = 0; idx < level; idx += 1) {
    hp += maxHp ? die : randomInt(rng, 1, die);
  }
  hp += level * conModifier;
  return Math.max(level, hp);
}

function makeName(rng) {
  return `${pick(rng, runtimeFirstNames)} ${pick(rng, runtimeLastNames)}`;
}

function ageForRace(rng, race, level) {
  const baseByRace = {
    Dwarf: 45,
    Elf: 90,
    Gnome: 60,
    'Half-Elf': 35,
    Halfling: 32,
    'Half-Orc': 18,
    Human: 16
  };
  const base = baseByRace[race] || 16;
  return base + randomInt(rng, 1, 20) + level;
}

function armorClass(rng, stats, hasEquipment) {
  const dexMod = abilityModifier(stats.dexterity);
  const base = hasEquipment ? randomInt(rng, 2, 8) : 10;
  return Math.max(-10, Math.min(10, base - dexMod));
}

function savesForLevel(level) {
  return {
    RSW: Math.max(2, 16 - Math.floor(level / 2)),
    BW: Math.max(2, 17 - Math.floor(level / 2)),
    DPP: Math.max(2, 14 - Math.floor(level / 2)),
    PP: Math.max(2, 15 - Math.floor(level / 2)),
    SPL: Math.max(2, 16 - Math.floor(level / 2))
  };
}

function buildClassQueue(counts) {
  const ordered = ['Assassin', 'Cleric', 'Druid', 'Illusionist', 'Magic-User', 'Paladin', 'Ranger', 'Thief', 'Fighter'];
  const queue = [];
  ordered.forEach((klass) => {
    for (let index = 0; index < (counts[klass] || 0); index += 1) queue.push(klass);
  });
  if (!queue.length) queue.push('Fighter');
  return queue;
}

function makeCharacter(rng, klass, levelRange, opts) {
  const cap = classCaps[klass] || 20;
  const level = Math.min(cap, randomInt(rng, levelRange.min, levelRange.max));
  const race = opts.race === 'Any' ? pick(rng, races) : opts.race;
  const gender = opts.sex === 'Any' ? (randomInt(rng, 0, 1) ? 'Male' : 'Female') : opts.sex;
  const stats = rollStats(rng, klass);
  const conMod = abilityModifier(stats.constitution);
  const hp = rollHp(rng, klass, level, opts.maxHp, conMod);
  const ac = armorClass(rng, stats, opts.showEquipment);

  const bonuses = {
    AB: formatBonus(abilityModifier(stats.dexterity)),
    SB: formatBonus(abilityModifier(stats.dexterity)),
    HB: formatBonus(abilityModifier(stats.strength)),
    DB: formatBonus(abilityModifier(stats.strength)),
    RB: formatBonus(abilityModifier(stats.dexterity))
  };
  const thaco = Math.max(1, 21 - level - Math.max(0, abilityModifier(stats.strength)));
  const saves = savesForLevel(level);
  const age = ageForRace(rng, race, level);

  const name = opts.nameCharacters ? makeName(rng) : null;
  const alignment = pick(rng, alignments);
  const abilities = opts.showSkills ? abilitiesByClass[klass] || [] : [];

  const equipment = opts.showEquipment
    ? [...(gearByClass[klass] || []), ...(opts.showRelics && randomInt(rng, 1, 5) === 1 ? [pick(rng, runtimeMagicItems)] : [])]
    : [];

  const description = opts.showDescriptions && opts.nameCharacters
    ? `${name} is a ${gender.toLowerCase()} ${race.toLowerCase()} ${klass.toLowerCase()} known for practical field discipline.`
    : null;

  return {
    name,
    race,
    age,
    gender,
    class: klass,
    alignment,
    level,
    hp,
    ac,
    stats,
    bonuses,
    thaco,
    saves,
    abilities,
    equipment,
    description
  };
}

function renderListing(character, index) {
  const card = document.createElement('article');
  card.className = 'guild-card';

  const title = document.createElement('div');
  title.className = 'guild-title';
  title.textContent = `${index + 1}. ${character.name || '(Unnamed)'} — ${character.gender} ${character.race} ${character.class}`;
  card.appendChild(title);

  const row = document.createElement('div');
  row.className = 'guild-grid';
  row.innerHTML = [
    `AL ${character.alignment}`,
    `ST ${character.stats.strength}`,
    `IN ${character.stats.intelligence}`,
    `WI ${character.stats.wisdom}`,
    `DX ${character.stats.dexterity}`,
    `CN ${character.stats.constitution}`,
    `CH ${character.stats.charisma}`,
    `LV ${character.level}`,
    `HP ${character.hp}`,
    `AC ${character.ac}`,
    `AB ${character.bonuses.AB}`,
    `SB ${character.bonuses.SB}`,
    `HB ${character.bonuses.HB}`,
    `DB ${character.bonuses.DB}`,
    `RB ${character.bonuses.RB}`,
    `TH ${character.thaco}`,
    ...saveLabels.map((label) => `${label} ${character.saves[label]}`)
  ].map((item) => `<span>${item}</span>`).join('');
  card.appendChild(row);

  if (character.description) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = character.description;
    card.appendChild(detail);
  }
  if (character.abilities.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Abilities: ${character.abilities.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.equipment.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Inventory: ${character.equipment.join(', ')}`;
    card.appendChild(detail);
  }

  return card;
}

function renderSheet(character, index) {
  const card = document.createElement('article');
  card.className = 'sheet-card';

  const title = document.createElement('div');
  title.className = 'sheet-title';
  title.textContent = `${index + 1}. ${character.name || '(Unnamed)'}`;
  card.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'sheet-meta';
  meta.textContent = `${character.gender} ${character.race} ${character.class} · Age ${character.age} · ${character.alignment}`;
  card.appendChild(meta);

  const vital = document.createElement('div');
  vital.className = 'sheet-grid';
  vital.innerHTML = `<span>Level ${character.level}</span><span>HP ${character.hp}</span><span>AC ${character.ac}</span><span>THAC0 ${character.thaco}</span>`;
  card.appendChild(vital);

  const stats = document.createElement('div');
  stats.className = 'sheet-grid';
  stats.innerHTML = `
    <span>STR ${character.stats.strength}</span>
    <span>INT ${character.stats.intelligence}</span>
    <span>WIS ${character.stats.wisdom}</span>
    <span>DEX ${character.stats.dexterity}</span>
    <span>CON ${character.stats.constitution}</span>
    <span>CHA ${character.stats.charisma}</span>
  `;
  card.appendChild(stats);

  const saves = document.createElement('div');
  saves.className = 'sheet-grid';
  saves.innerHTML = saveLabels.map((label) => `<span>${label} ${character.saves[label]}</span>`).join('');
  card.appendChild(saves);

  if (character.abilities.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Abilities: ${character.abilities.join(', ')}`;
    card.appendChild(detail);
  }
  if (character.equipment.length) {
    const detail = document.createElement('div');
    detail.className = 'guild-block';
    detail.textContent = `Inventory: ${character.equipment.join(', ')}`;
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
      divider.textContent = '⚔︎';
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
  const race = formData.get('race')?.toString() || 'Any';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const classCounts = {
    Assassin: Math.max(0, Math.min(20, Number(formData.get('qtyAssassin') || 0))),
    Cleric: Math.max(0, Math.min(20, Number(formData.get('qtyCleric') || 0))),
    Druid: Math.max(0, Math.min(20, Number(formData.get('qtyDruid') || 0))),
    Fighter: Math.max(0, Math.min(20, Number(formData.get('qtyFighter') || 0))),
    Illusionist: Math.max(0, Math.min(20, Number(formData.get('qtyIllusionist') || 0))),
    'Magic-User': Math.max(0, Math.min(20, Number(formData.get('qtyMage') || 0))),
    Paladin: Math.max(0, Math.min(20, Number(formData.get('qtyPaladin') || 0))),
    Ranger: Math.max(0, Math.min(20, Number(formData.get('qtyRanger') || 0))),
    Thief: Math.max(0, Math.min(20, Number(formData.get('qtyThief') || 0)))
  };

  const flags = {
    nameCharacters: formData.get('nameCharacters') === '1',
    showEquipment: formData.get('showEquipment') === '1',
    showSkills: formData.get('showSkills') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    showRelics: formData.get('showRelics') === '1',
    maxHp: formData.get('maxHp') === '1',
    imageSeparator: formData.get('imageSeparator') === '1'
  };

  await loadRuntimePools();

  const queue = buildClassQueue(classCounts);
  const characters = queue.map((klass) => makeCharacter(rng, klass, { min: lvl1, max: lvl2 }, {
    race,
    sex,
    nameCharacters: flags.nameCharacters,
    showEquipment: flags.showEquipment,
    showSkills: flags.showSkills,
    showDescriptions: flags.showDescriptions,
    showRelics: flags.showRelics,
    maxHp: flags.maxHp
  }));

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      outputType,
      lvl1,
      lvl2,
      sex,
      race,
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
