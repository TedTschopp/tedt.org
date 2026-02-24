const toolId = 'bxadvg';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const classLimits = {
  Cleric: 14,
  Dwarf: 12,
  Elf: 10,
  Fighter: 14,
  Halfling: 8,
  'Magic-User': 14,
  Thief: 14
};

const alignments = ['Lawful', 'Neutral', 'Chaotic'];
const skillsByClass = {
  Cleric: ['Turn Undead', 'Divine Rituals', 'Religious Lore'],
  Dwarf: ['Stonecunning', 'Trap Detection', 'Hardy Resistance'],
  Elf: ['Keen Senses', 'Arcane Insight', 'Wilderness Lore'],
  Fighter: ['Weapon Mastery', 'Tactical Positioning', 'Shield Use'],
  Halfling: ['Stealth', 'Missile Precision', 'Alertness'],
  'Magic-User': ['Spellcraft', 'Arcane Research', 'Scroll Deciphering'],
  Thief: ['Open Locks', 'Find/Remove Traps', 'Move Silently']
};
const gearByClass = {
  Cleric: ['mace', 'shield', 'holy symbol', 'chain armor'],
  Dwarf: ['battle axe', 'helmet', 'shield', 'leather backpack'],
  Elf: ['long sword', 'bow', 'quiver', 'spellbook'],
  Fighter: ['sword', 'shield', 'chain armor', 'bedroll'],
  Halfling: ['short sword', 'sling', 'pouch of stones', 'traveler cloak'],
  'Magic-User': ['dagger', 'spellbook', 'robes', 'ink and quill'],
  Thief: ['short sword', 'leather armor', 'lockpicks', 'dark hood']
};

const firstNames = ['Aldric', 'Bera', 'Cassandra', 'Dorian', 'Elric', 'Fiona', 'Gareth', 'Helga', 'Iris', 'Joran', 'Kael', 'Lyra', 'Mira', 'Nolan', 'Orin', 'Petra', 'Quinn', 'Rhea', 'Soren', 'Talia', 'Ulric', 'Vera', 'Wren', 'Xara', 'Yorik', 'Zara'];
const lastNames = ['Amberfall', 'Brightwood', 'Crowley', 'Duskhelm', 'Emberstone', 'Frostvale', 'Glimmerforge', 'Highriver', 'Ironwood', 'Jadebrook', 'Keenblade', 'Lightfoot', 'Moonfall', 'Nightbreeze', 'Oakenshield', 'Pyrestar', 'Quickstride', 'Ravenmark', 'Stoneweaver', 'Thornfield'];

const spellPool = ['Light', 'Sleep', 'Magic Missile', 'Detect Magic', 'Charm Person', 'Shield', 'Invisibility', 'Web', 'Fireball', 'Fly', 'Cure Light Wounds', 'Bless', 'Hold Person', 'Dispel Magic'];
const magicItems = ['+1 weapon', 'cloak of protection', 'ring of feather falling', 'boots of elvenkind', 'minor healing draught', 'wand fragment'];

const FALLBACK_FIRST_NAMES = [...firstNames];
const FALLBACK_LAST_NAMES = [...lastNames];
const FALLBACK_SPELL_POOL = [...spellPool];
const FALLBACK_MAGIC_ITEMS = [...magicItems];

let runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
let runtimeLastNames = [...FALLBACK_LAST_NAMES];
let runtimeSpellPool = [...FALLBACK_SPELL_POOL];
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

function resetRuntimePools() {
  runtimeFirstNames = [...FALLBACK_FIRST_NAMES];
  runtimeLastNames = [...FALLBACK_LAST_NAMES];
  runtimeSpellPool = [...FALLBACK_SPELL_POOL];
  runtimeMagicItems = [...FALLBACK_MAGIC_ITEMS];
}

function isRelicLikeItem(label) {
  return /amulet|ring|wand|staff|scroll|cloak|bracer|sword|blade|helm|helmet|orb|idol|talisman|relic|potion/i.test(label);
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
      const [legendRows, monsters, spells, stores] = await Promise.all([
        window.WizardawnData.getWorldmapLegend(),
        window.WizardawnData.getMonstersForGame('BX'),
        window.WizardawnData.getLabLordSpells(),
        window.WizardawnData.getStoreItemsForGames(['BX'])
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

      const relics = uniqueStrings((stores || [])
        .map((row) => toTitleCase(row.item || ''))
        .filter((item) => item.length >= 4 && item.length <= 48)
        .filter((item) => isRelicLikeItem(item)));
      if (relics.length) {
        runtimeMagicItems = uniqueStrings([...runtimeMagicItems, ...relics]);
      }
    } catch (error) {
      console.warn('bxadvg runtime enrichment failed; using fallback pools', error);
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
    lvl2: 14,
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
  if (state === 0) state = 123456789;
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

function rollStat(rng, favored = false) {
  const rolls = [randomInt(rng, 3, 18), randomInt(rng, 3, 18), randomInt(rng, 3, 18), randomInt(rng, 3, 18)];
  return favored ? Math.max(...rolls) : randomInt(rng, 3, 18);
}

function statsForClass(rng, klass) {
  const favored = {
    Cleric: 'wisdom',
    Dwarf: 'strength',
    Elf: 'strength',
    Fighter: 'strength',
    Halfling: 'dexterity',
    'Magic-User': 'intelligence',
    Thief: 'dexterity'
  };

  const stats = {
    strength: rollStat(rng, favored[klass] === 'strength'),
    intelligence: rollStat(rng, favored[klass] === 'intelligence'),
    wisdom: rollStat(rng, favored[klass] === 'wisdom'),
    dexterity: rollStat(rng, favored[klass] === 'dexterity'),
    constitution: rollStat(rng, false),
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

function hitDiceByClass(klass) {
  if (klass === 'Magic-User' || klass === 'Thief') return 4;
  if (klass === 'Cleric' || klass === 'Elf' || klass === 'Halfling') return 6;
  return 8;
}

function hitPoints(rng, klass, level) {
  const die = hitDiceByClass(klass);
  let total = 0;
  for (let index = 0; index < level; index += 1) {
    total += randomInt(rng, 1, die);
  }
  return Math.max(1, total);
}

function makeName(rng) {
  return `${pick(rng, runtimeFirstNames)} ${pick(rng, runtimeLastNames)}`;
}

function makeSpells(rng, klass, level) {
  if (!['Cleric', 'Magic-User', 'Elf'].includes(klass) || level < 2) return [];
  const count = Math.min(6, Math.max(1, Math.floor(level / 2)));
  const chosen = new Set();
  while (chosen.size < count) chosen.add(pick(rng, runtimeSpellPool));
  return [...chosen];
}

function ageForClass(rng, klass, level) {
  const base = klass === 'Dwarf' ? 60 : klass === 'Elf' ? 90 : klass === 'Halfling' ? 45 : 18;
  return base + randomInt(rng, 0, 20) + level;
}

function buildClassQueue(counts) {
  const queue = [];
  Object.entries(counts).forEach(([klass, count]) => {
    for (let index = 0; index < count; index += 1) queue.push(klass);
  });
  if (!queue.length) queue.push('Fighter');
  return queue;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.characters.length) {
    output.innerHTML = '<em>No adventurers generated.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'guild-summary';
  summary.textContent = `${result.payload.characters.length} adventurer(s) · ${result.config.outputType}`;
  output.appendChild(summary);

  result.payload.characters.forEach((character, index) => {
    const card = document.createElement('article');
    card.className = 'guild-card';

    const title = document.createElement('div');
    title.className = 'guild-title';
    title.textContent = `${index + 1}. ${character.name || '(Unnamed)'} — ${character.gender} ${character.class} L${character.level}`;
    card.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'guild-meta';
    meta.textContent = `HP ${character.hp} · AC ${character.ac} · XP ${character.xp}${character.alignment ? ` · ${character.alignment}` : ''}${character.age ? ` · Age ${character.age}` : ''}`;
    card.appendChild(meta);

    const stats = document.createElement('div');
    stats.className = 'guild-stats';
    const s = character.stats;
    stats.textContent = `STR ${s.strength} / INT ${s.intelligence} / WIS ${s.wisdom} / DEX ${s.dexterity} / CON ${s.constitution} / CHA ${s.charisma}`;
    card.appendChild(stats);

    if (character.skills?.length) {
      const sk = document.createElement('div');
      sk.className = 'guild-block';
      sk.textContent = `Skills: ${character.skills.join(', ')}`;
      card.appendChild(sk);
    }
    if (character.equipment?.length) {
      const eq = document.createElement('div');
      eq.className = 'guild-block';
      eq.textContent = `Gear: ${character.equipment.join(', ')}`;
      card.appendChild(eq);
    }
    if (character.spells?.length) {
      const sp = document.createElement('div');
      sp.className = 'guild-block';
      sp.textContent = `Spells: ${character.spells.join(', ')}`;
      card.appendChild(sp);
    }
    if (character.description) {
      const ds = document.createElement('div');
      ds.className = 'guild-block';
      ds.textContent = character.description;
      card.appendChild(ds);
    }

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const outputType = formData.get('outputType')?.toString() || 'Character Listing';
  const lvl1Raw = Math.max(1, Math.min(14, Number(formData.get('lvl1') || 1)));
  const lvl2Raw = Math.max(1, Math.min(14, Number(formData.get('lvl2') || 14)));
  const lvl1 = Math.min(lvl1Raw, lvl2Raw);
  const lvl2 = Math.max(lvl1Raw, lvl2Raw);
  const sex = formData.get('sex')?.toString() || 'Any';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const counts = {
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
    showEquipment: formData.get('showEquipment') === '1',
    showSkills: formData.get('showSkills') === '1',
    showSpells: formData.get('showSpells') === '1',
    showAlignment: formData.get('showAlignment') === '1',
    showAge: formData.get('showAge') === '1',
    showDescriptions: formData.get('showDescriptions') === '1',
    showRelics: formData.get('showRelics') === '1'
  };

  await loadRuntimePools();

  const queue = buildClassQueue(counts);
  const characters = queue.map((klass) => {
    const cap = classLimits[klass] || 14;
    const level = Math.min(cap, randomInt(rng, lvl1, lvl2));
    const gender = sex === 'Any' ? (randomInt(rng, 0, 1) ? 'Male' : 'Female') : sex;
    const stats = statsForClass(rng, klass);
    const hp = hitPoints(rng, klass, level);
    const ac = randomInt(rng, 3, 8);
    const xp = level * randomInt(rng, 800, 2000);
    const alignment = flags.showAlignment ? pick(rng, alignments) : null;
    const age = flags.showAge ? ageForClass(rng, klass, level) : null;
    const name = flags.nameCharacters ? makeName(rng) : null;

    const equipment = flags.showEquipment ? [...gearByClass[klass], ...(flags.showRelics && randomInt(rng, 1, 5) === 1 ? [pick(rng, runtimeMagicItems)] : [])] : [];
    const skills = flags.showSkills ? skillsByClass[klass] : [];
    const spells = flags.showSpells ? makeSpells(rng, klass, level) : [];
    const description = flags.showDescriptions && flags.nameCharacters
      ? `${name} is a seasoned ${klass.toLowerCase()} known for discipline and practical dungeon instincts.`
      : null;

    return {
      class: klass,
      level,
      gender,
      name,
      stats,
      hp,
      ac,
      xp,
      alignment,
      age,
      equipment,
      skills,
      spells,
      description
    };
  });

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      outputType,
      lvl1,
      lvl2,
      sex,
      classCounts: counts,
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
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
