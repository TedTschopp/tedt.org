const toolId = 'names';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const categoryLabels = {
  demon: 'Demon Names',
  dragon: 'Dragon Names',
  dwarf: 'Dwarf Names',
  elf_f: 'Elf Female Names',
  elf_m: 'Elf Male Names',
  delf_f: 'Dark Elf Female Names',
  delf_m: 'Dark Elf Male Names',
  fairy: 'Fairy Names',
  catf: 'Feline Humanoid Female Names',
  catm: 'Feline Humanoid Male Names',
  female: 'Generic Female Names',
  male: 'Generic Male Names',
  generic: 'Generic Names',
  gnome: 'Gnome Names',
  goblin: 'Goblin Names',
  holm_f: 'Holmesian Female Names',
  holm_m: 'Holmesian Male Names',
  human_f: 'Human Female Names',
  human_m: 'Human Male Names',
  imp: 'Imp Names',
  lizardman: 'Lizardman Names',
  orc: 'Orc Names',
  ratman: 'Ratman Names',
  spell: 'Spell Names',
  tavern: 'Tavern Names',
  village: 'Village Names',
  wizard: 'Wizard Names',
  wolf: 'Wolfen Humanoid Names',
  hb_aqm: 'Hyborian Aquilonian Male Names',
  hb_aqf: 'Hyborian Aquilonian Female Names',
  hb_cim: 'Hyborian Cimmerian Male Names',
  hb_cif: 'Hyborian Cimmerian Female Names',
  hb_stm: 'Hyborian Stygian Male Names',
  hb_stf: 'Hyborian Stygian Female Names'
};

const firstSyllables = ['Al', 'Bel', 'Cor', 'Dor', 'El', 'Fen', 'Gal', 'Har', 'Il', 'Jar', 'Kor', 'Lor', 'Mor', 'Nar', 'Or', 'Per', 'Quor', 'Ral', 'Sel', 'Tor', 'Ul', 'Vor', 'Wen', 'Xal', 'Yor', 'Zel'];
const middleSyllables = ['a', 'e', 'i', 'o', 'u', 'ae', 'ia', 'or', 'ur', 'an', 'en', 'in', 'on', 'un'];
const endSyllables = ['dor', 'ion', 'mir', 'thas', 'vyn', 'drak', 'wyn', 'ric', 'ros', 'var', 'gorn', 'las', 'mere', 'dun', 'thor'];

const surnames = ['Ashborne', 'Blackwell', 'Cinderhall', 'Duskmere', 'Elderroot', 'Frostvale', 'Glimmerfen', 'Hallowmere', 'Ironridge', 'Jadewood', 'Keenblade', 'Lightward', 'Moonbrook', 'Nightgrove', 'Oakfall', 'Pyrecrest', 'Quickwater', 'Ravenstone', 'Stormhold', 'Thornfield'];
const placeStarts = ['Amber', 'Brindle', 'Cinder', 'Dawn', 'Ebon', 'Frost', 'Gold', 'Hollow', 'Iron', 'Jasper', 'Kings', 'Lone', 'Moon', 'North', 'Oak', 'Pine', 'Queens', 'River', 'Stone', 'Thorn'];
const placeEnds = ['ford', 'gate', 'haven', 'keep', 'mere', 'port', 'rest', 'rock', 'stead', 'watch', 'wick', 'wood', 'vale', 'reach', 'cross'];
const tavernStarts = ['The Rusty', 'The Silver', 'The Golden', 'The Broken', 'The Laughing', 'The Howling', 'The Crimson', 'The Crooked', 'The Wandering', 'The Hidden'];
const tavernEnds = ['Tankard', 'Lion', 'Crow', 'Sword', 'Crown', 'Flagon', 'Owl', 'Stag', 'Moon', 'Wolf'];
const spellPrefixes = ['Arcane', 'Mystic', 'Infernal', 'Celestial', 'Eldritch', 'Runic', 'Ancient', 'Forgotten'];
const spellNouns = ['Flare', 'Binding', 'Ward', 'Storm', 'Veil', 'Lance', 'Grasp', 'Pulse', 'Nova', 'Torrent'];

const dynamicPools = {
  demon: [],
  dragon: [],
  goblin: [],
  orc: [],
  lizardman: [],
  ratman: [],
  wolf: [],
  tavernStarts: [],
  tavernEnds: [],
  placeStarts: [],
  placeEnds: [],
  spellNouns: [],
  wizardTitles: [],
};

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    categories: []
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
  if (state === 0) state = 31313131;
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

function titleCaseWord(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : '')
    .join(' ')
    .trim();
}

function firstWord(value) {
  return titleCaseWord(String(value || '').split(/[,(]/)[0]).split(' ')[0] || '';
}

function loadMonsterDerivedPools(monsters) {
  const entries = Array.isArray(monsters) ? monsters : [];
  const names = entries.map((row) => String(row.name || '')).filter(Boolean);

  dynamicPools.demon = unique(names.filter((name) => /demon|devil|fiend|imp/i.test(name)).map(firstWord));
  dynamicPools.dragon = unique(names.filter((name) => /dragon|wyrm/i.test(name)).map(firstWord));
  dynamicPools.goblin = unique(names.filter((name) => /goblin|hobgoblin|bugbear/i.test(name)).map(firstWord));
  dynamicPools.orc = unique(names.filter((name) => /\borc\b/i.test(name)).map(firstWord));
  dynamicPools.lizardman = unique(names.filter((name) => /lizard|troglodyte|saur/i.test(name)).map(firstWord));
  dynamicPools.ratman = unique(names.filter((name) => /rat|wererat/i.test(name)).map(firstWord));
  dynamicPools.wolf = unique(names.filter((name) => /wolf|worg|werewolf/i.test(name)).map(firstWord));
}

function loadLegendDerivedPools(legendRows) {
  const labels = (Array.isArray(legendRows) ? legendRows : [])
    .map((row) => titleCaseWord(row.name || ''))
    .filter(Boolean);

  dynamicPools.placeStarts = unique(labels.map((label) => label.split(' ')[0]).filter((value) => value.length > 2));
  dynamicPools.placeEnds = unique(labels.map((label) => {
    const words = label.split(' ');
    return words[words.length - 1];
  }).filter((value) => value.length > 2));

  dynamicPools.tavernStarts = unique(labels.slice(0, 16).map((label) => `The ${label.split(' ')[0]}`));
  dynamicPools.tavernEnds = unique(labels.map((label) => label.split(' ').slice(-1)[0]).filter((value) => value.length > 2));
  dynamicPools.spellNouns = unique(labels.map((label) => label.split(' ')[0]).filter((value) => value.length > 3));
}

function loadMutantDerivedPools(mutants) {
  const names = (Array.isArray(mutants) ? mutants : [])
    .map((row) => firstWord(row.name || ''))
    .filter(Boolean);

  dynamicPools.wizardTitles = unique(names.slice(0, 20).map((name) => `${name}caller`));
}

async function loadDynamicPools() {
  if (!window.WizardawnData?.getMonstersRpgs || !window.WizardawnData?.getWorldmapLegend || !window.WizardawnData?.getMutants) {
    return;
  }

  try {
    const [monsters, legends, mutants] = await Promise.all([
      window.WizardawnData.getMonstersRpgs(),
      window.WizardawnData.getWorldmapLegend(),
      window.WizardawnData.getMutants(),
    ]);
    loadMonsterDerivedPools(monsters);
    loadLegendDerivedPools(legends);
    loadMutantDerivedPools(mutants);
  } catch (error) {
    console.warn('Unable to load dynamic pools for names:', error);
  }
}

function pickFromPoolOr(rng, pool, fallback) {
  return pool.length ? pick(rng, pool) : fallback();
}

function makeCoreName(rng, parts = 2) {
  const first = pick(rng, firstSyllables);
  const middle = Array.from({ length: Math.max(0, parts - 1) }, () => pick(rng, middleSyllables)).join('');
  const last = pick(rng, endSyllables);
  return `${first}${middle}${last}`;
}

function makeTwoPartName(rng, firstParts = 2) {
  return `${makeCoreName(rng, firstParts)} ${pick(rng, surnames)}`;
}

function makeNameForCategory(rng, category) {
  switch (category) {
    case 'demon': return `${pickFromPoolOr(rng, dynamicPools.demon, () => makeCoreName(rng, 3))} the ${pick(rng, ['Corrupter', 'Tormentor', 'Defiler', 'Devourer'])}`;
    case 'dragon': return pickFromPoolOr(rng, dynamicPools.dragon, () => `${pick(rng, ['Azh', 'Vyr', 'Thra', 'Qor'])}${makeCoreName(rng, 2)}`);
    case 'dwarf': return `${makeCoreName(rng, 1)} ${pick(rng, ['Ironbeard', 'Stonehelm', 'Bronzefist', 'Anvilborn'])}`;
    case 'elf_f': return makeTwoPartName(rng, 3);
    case 'elf_m': return makeTwoPartName(rng, 2);
    case 'delf_f': return `${pick(rng, ['Xy', 'Sha', 'Vel', 'Nys'])}${makeCoreName(rng, 2)}`;
    case 'delf_m': return `${pick(rng, ['Driz', 'Mal', 'Vor', 'Zel'])}${makeCoreName(rng, 2)}`;
    case 'fairy': return `${makeCoreName(rng, 1)} of the ${pick(rng, ['Glen', 'Moss', 'Dawn', 'Moon'])}`;
    case 'catf': return `${pick(rng, ['Sha', 'Miri', 'Kali', 'Rhea'])}${makeCoreName(rng, 1)}`;
    case 'catm': return `${pick(rng, ['Rakh', 'Tigr', 'Naru', 'Khan'])}${makeCoreName(rng, 1)}`;
    case 'female': return makeTwoPartName(rng, 2);
    case 'male': return makeTwoPartName(rng, 2);
    case 'generic': return randomInt(rng, 1, 2) === 1 ? makeTwoPartName(rng, 2) : makeCoreName(rng, 2);
    case 'gnome': return `${makeCoreName(rng, 1)} ${pick(rng, ['Cogwink', 'Tinkerroot', 'Copperthumb', 'Bristlecap'])}`;
    case 'goblin': return pickFromPoolOr(rng, dynamicPools.goblin, () => `${pick(rng, ['Gr', 'Sk', 'Ug', 'Br'])}${makeCoreName(rng, 1)}`);
    case 'holm_f': return `${pick(rng, ['Alys', 'Bree', 'Cora', 'Della'])} ${pick(rng, ['of Greykeep', 'of Dunford', 'of Blackmere'])}`;
    case 'holm_m': return `${pick(rng, ['Aldo', 'Bram', 'Cedric', 'Dain'])} ${pick(rng, ['of Greykeep', 'of Dunford', 'of Blackmere'])}`;
    case 'human_f': return makeTwoPartName(rng, 2);
    case 'human_m': return makeTwoPartName(rng, 2);
    case 'imp': return `${pick(rng, ['Imp', 'Nib', 'Zix', 'Rik'])}${makeCoreName(rng, 1)}`;
    case 'lizardman': return pickFromPoolOr(rng, dynamicPools.lizardman, () => `${pick(rng, ['Ss', 'Kra', 'Zha', 'Tri'])}${makeCoreName(rng, 2)}`);
    case 'orc': return pickFromPoolOr(rng, dynamicPools.orc, () => `${pick(rng, ['Gor', 'Mug', 'Thr', 'Ur'])}${makeCoreName(rng, 1)}`);
    case 'ratman': return pickFromPoolOr(rng, dynamicPools.ratman, () => `${pick(rng, ['Skrit', 'Rikk', 'Vesh', 'Snik'])}${makeCoreName(rng, 1)}`);
    case 'spell': return `${pick(rng, spellPrefixes)} ${pickFromPoolOr(rng, dynamicPools.spellNouns, () => pick(rng, spellNouns))}`;
    case 'tavern': return `${pickFromPoolOr(rng, dynamicPools.tavernStarts, () => pick(rng, tavernStarts))} ${pickFromPoolOr(rng, dynamicPools.tavernEnds, () => pick(rng, tavernEnds))}`;
    case 'village': return `${pickFromPoolOr(rng, dynamicPools.placeStarts, () => pick(rng, placeStarts))}${pickFromPoolOr(rng, dynamicPools.placeEnds, () => pick(rng, placeEnds)).toLowerCase()}`;
    case 'wizard': return `${makeCoreName(rng, 3)} ${pickFromPoolOr(rng, dynamicPools.wizardTitles, () => pick(rng, ['the Wise', 'the Grey', 'Starcaller', 'Runebinder']))}`;
    case 'wolf': return pickFromPoolOr(rng, dynamicPools.wolf, () => `${pick(rng, ['Fang', 'Rime', 'Howl', 'Grey'])}${makeCoreName(rng, 1)}`);
    case 'hb_aqm': return `${pick(rng, ['Aurel', 'Cassan', 'Valen', 'Rost'])} ${pick(rng, ['of Aquilonia', 'Lion-Banner', 'Westmark'])}`;
    case 'hb_aqf': return `${pick(rng, ['Livia', 'Sera', 'Yvane', 'Maris'])} ${pick(rng, ['of Aquilonia', 'Lion-Banner', 'Westmark'])}`;
    case 'hb_cim': return `${pick(rng, ['Conall', 'Brann', 'Kael', 'Tarn'])} ${pick(rng, ['of Cimmeria', 'Frostborn', 'Black Hills'])}`;
    case 'hb_cif': return `${pick(rng, ['Maeve', 'Runa', 'Talia', 'Brenna'])} ${pick(rng, ['of Cimmeria', 'Frostborn', 'Black Hills'])}`;
    case 'hb_stm': return `${pick(rng, ['Zafir', 'Nekhet', 'Khamun', 'Setar'])} ${pick(rng, ['of Stygia', 'Sand Veil', 'Black River'])}`;
    case 'hb_stf': return `${pick(rng, ['Nafira', 'Sethra', 'Amunet', 'Khepri'])} ${pick(rng, ['of Stygia', 'Sand Veil', 'Black River'])}`;
    default: return makeCoreName(rng, 2);
  }
}

function renderResult(result) {
  output.innerHTML = '';
  const categories = result.payload.categories;
  if (!categories.length) {
    output.innerHTML = '<em>Select one or more categories, then generate.</em>';
    return;
  }

  categories.forEach((group) => {
    const card = document.createElement('article');
    card.className = 'names-card';
    const listHtml = group.names.map((entry) => `<li>${entry}</li>`).join('');
    card.innerHTML = `<div class="names-title">${group.label}</div><ul class="mb-0">${listHtml}</ul>`;
    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);
  const amount = Math.max(1, Math.min(100, Number(formData.get('amount') || 10)));
  const categories = formData.getAll('category').map((entry) => entry.toString());

  await loadDynamicPools();

  const generated = categories.map((category) => ({
    key: category,
    label: categoryLabels[category] || category,
    names: Array.from({ length: amount }, () => makeNameForCategory(rng, category))
  }));

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      amount,
      categories
    },
    payload: {
      categories: generated
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
