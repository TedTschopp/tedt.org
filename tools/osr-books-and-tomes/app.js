const toolId = 'books';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Labyrinth Lord',
  config: {
    amount: 1,
    unusual: 0,
    aec: false
  },
  payload: {
    books: []
  }
};

const titleAdjectives = ['Exotic', 'Mysterious', 'Enchanted', 'Marvelous', 'Amazing', 'Astonishing', 'Mystical', 'Astounding', 'Magical', 'Divine', 'Phenomenal', 'Fantastic', 'Incredible', 'Miraculous', 'Wondrous', 'Glorious', 'Dreadful', 'Horrific', 'Terrible', 'Frightful', 'Dire', 'Grim', 'Vile', 'Lost', 'Legendary', 'Mythical', 'Doomed', 'Eternal', 'Spiritual', 'Demonic', 'Holy', 'Heavenly', 'Ancestral', 'Ornate', 'Ultimate', 'Crazed', 'Elven', 'Orcish', 'Dwarvish', 'Gnomish', 'Cursed', 'Sylvan', 'Wizardly', 'Rare', 'Damned', 'Blasphemous', 'Planar', 'Chaotic', 'Haunted', 'Fiendish', 'Sacred', 'Fallen', 'Dark', 'Mighty', 'Unspeakable', 'Forgotten', 'Deathly', 'Undead', 'Infinite'];
const titleNouns = ['Tale', 'Book', 'Adventures', 'Lexicon', 'Writings', 'Omnibus', 'Mystery', 'Manual', 'Folio', 'Diary', 'Tome', 'Story', 'Events', 'History', 'Chronicles', 'Fable', 'Legend', 'Myth', 'Secrets'];
const titleSubjectsStatic = ['Demon', 'Devil', 'Dragon', 'Dwarf', 'Elf', 'Hag', 'Vampire', 'Ghost', 'Lich', 'Templar', 'Thief', 'Illusionist', 'Wizard', 'Cleric', 'Monk', 'Witch', 'Fighter', 'Ranger', 'Barbarian', 'Sage', 'Rogue', 'Paladin', 'Bard', 'Prophet', 'Adventurer', 'King', 'Queen', 'Mage', 'Traveler', 'Sorcerer', 'Hunter', 'Knight', 'Necromancer', 'Shaman'];
const titlePlacesStatic = ['Castle', 'Cave', 'Mansion', 'House', 'Dungeon', 'Forest', 'Desert', 'Tower', 'Mountains', 'Swamp', 'Hills', 'Night', 'Darkness', 'Fog', 'Woods', 'Mist', 'Sky', 'Sea', 'City', 'Village', 'Tomb', 'Crypt'];
const titleRelics = ['Goblet', 'Sword', 'Axe', 'Dagger', 'Armor', 'Crystal', 'Gem', 'Wand', 'Ring', 'Amulet', 'Helm', 'Crown', 'Boots', 'Belt', 'Robe', 'Mirror', 'Shield', 'Scepter', 'Staff', 'Potion', 'Bow', 'Stone', 'Fire', 'Shard'];
const titleConcepts = ['Search', 'Quest', 'Curse', 'Magic', 'Mystery', 'Power', 'Destruction', 'Murder', 'Desire', 'Nature', 'Legend', 'Myth', 'Lies', 'Location'];
const tomeKinds = ['book', 'compendium', 'lexicon', 'manual', 'omnibus', 'tome', 'volume', 'journal', 'almanac', 'diary'];
const artifactAdjectives = ['Evil', 'Vile', 'Cursed', 'Wicked', 'Unholy', 'Hated', 'Ruined', 'Unspeakable', 'Ancient', 'Hallowed'];

const authorFirst = ['Ael', 'Borin', 'Caldus', 'Drevin', 'Eldra', 'Ferran', 'Galen', 'Hadria', 'Ilya', 'Jorik', 'Kaelis', 'Lira', 'Mordan', 'Nyra', 'Orin', 'Phaedra', 'Quint', 'Ravenna', 'Sylas', 'Thorne', 'Ulric', 'Vera', 'Wren', 'Xander', 'Ysra', 'Zorin'];
const authorLast = ['Amberfell', 'Blackroot', 'Coldwyn', 'Duskmere', 'Emberlane', 'Frostweave', 'Grimholt', 'Hallowmere', 'Ironbloom', 'Jadepeak', 'Keenward', 'Lightweaver', 'Mournhill', 'Nightbrook', 'Oakenshade', 'Pyrestone', 'Quickwater', 'Ravencrest', 'Stormveil', 'Thornfield', 'Umberforge', 'Valewarden', 'Wintermere', 'Yrrow', 'Zephyrine'];

let titleSubjects = titleSubjectsStatic;
let titlePlaces = titlePlacesStatic;

const unusualPowers = [
  (rng) => `The book is magical and answers ${randomInt(rng, 2, 10)} questions once per ${pick(rng, ['day', 'week', 'month'])}.`,
  () => 'The book is blank until spoken words are magically inscribed on its pages.',
  () => 'The ink is poisonous; unprotected readers must save versus poison.',
  (rng, context) => `The tome contains lost secrets of the ${pickJob(rng, context)} and grants +1 to ${pickStat(rng, context)} after a week of study.`,
  () => 'The book contains clues about a nearby dungeon location.',
  () => 'The text is readable only by the bonded owner.',
  (rng) => `The book is hollow and hides ${randomInt(rng, 2, 10)} gems.`,
  (rng, context) => `The book is hollow and contains ${randomInt(rng, 2, 30)} ${coinName(context.game, rng)} coins.`,
  () => 'The book contains a hand-drawn treasure map fragment.',
  () => 'The tome contains unfinished research notes for a never-cataloged spell.',
  (rng, context) => `The text grants a ${context.game.includes('Six-Siders') ? `${randomInt(rng, 1, 5)} in 6` : `${randomInt(rng, 1, 10) * 10}%`} chance to identify magical artifacts.`,
  () => 'The pages auto-translate spoken languages while the reader focuses.',
  (rng) => `The volume contains instructions for constructing a golem with roughly ${randomInt(rng, 5, 20) * 5000} gp in materials.`,
  () => 'The book can function as a spellbook and grants a bonus on saving throws while carried.',
  (rng) => `The cover sprouts teeth and attacks as a ${randomInt(rng, 1, 10)} HD creature when opened.`,
  () => 'The book stores hidden spells between marked pages.'
];

const curses = [
  'Cursed: the reader is pulled into the story world and must defeat its villain to escape.',
  'Cursed: the reader becomes compulsively fixated and refuses all other actions for a time.',
  'Cursed: a malign geas binds the reader to the tome\'s unresolved purpose.'
];

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

function makeAuthor(rng) {
  return `${pick(rng, authorFirst)} ${pick(rng, authorLast)}`;
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

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function gameToMonsterCodes(game, aec) {
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

function monsterMatchesGame(row, codes) {
  const source = String(row?.source || '').toUpperCase();
  const creator = String(row?.creator || '').toUpperCase();
  return codes.some((code) => source === code || creator.startsWith(code));
}

function toSubjectFromMonsterName(name) {
  const cleaned = titleCaseWord(String(name || '').split(/[,(]/)[0]);
  const token = cleaned.split(' ')[0] || '';
  if (token.length < 3 || token.length > 16) {
    return null;
  }
  return token;
}

function toPlaceFromLegendName(name) {
  const primary = String(name || '').split(/[(/]/)[0];
  const cleaned = titleCaseWord(primary);
  if (cleaned.length < 3 || cleaned.length > 24) {
    return null;
  }
  return cleaned;
}

async function loadDynamicTitlePools(context) {
  if (!window.WizardawnData?.getMonstersRpgs || !window.WizardawnData?.getWorldmapLegend) {
    return;
  }

  try {
    const [monsters, legends] = await Promise.all([
      window.WizardawnData.getMonstersRpgs(),
      window.WizardawnData.getWorldmapLegend(),
    ]);

    const gameCodes = gameToMonsterCodes(context.game, context.aec);
    const subjectPool = unique(
      monsters
        .filter((row) => monsterMatchesGame(row, gameCodes))
        .map((row) => toSubjectFromMonsterName(row.name))
    );

    const placePool = unique(
      legends
        .map((row) => toPlaceFromLegendName(row.name))
    );

    titleSubjects = unique([...subjectPool, ...titleSubjectsStatic]);
    titlePlaces = unique([...placePool, ...titlePlacesStatic]);
  } catch (error) {
    console.warn('Unable to load dynamic title pools for books:', error);
  }
}

function titleCaseBook(value) {
  return value
    .replace(/\b(Of|And|The|In)\b/g, (word) => word.toLowerCase())
    .replace(/^./, (character) => character.toUpperCase());
}

function makeStandardTitle(rng) {
  const author = makeAuthor(rng);
  const pattern = randomInt(rng, 1, 11);
  let title;

  if (pattern === 1) title = `The ${pick(rng, titleAdjectives)} ${pick(rng, titleNouns)} of the ${pick(rng, titleSubjects)}`;
  else if (pattern === 2) title = `The ${pick(rng, titleNouns)} of the ${pick(rng, titleAdjectives)} ${pick(rng, titleSubjects)}`;
  else if (pattern === 3) title = `The ${pick(rng, titleSubjects)} in the ${pick(rng, titlePlaces)}`;
  else if (pattern === 4) title = `The ${pick(rng, titleNouns)} of the ${pick(rng, titleSubjects)} in the ${pick(rng, titlePlaces)}`;
  else if (pattern === 5) title = `The ${pick(rng, titleAdjectives)} ${pick(rng, titlePlaces)} of the ${pick(rng, titleSubjects)}`;
  else if (pattern === 6) title = `The ${pick(rng, titleConcepts)} of the ${pick(rng, titleAdjectives)} ${pick(rng, titleRelics)} of ${author}`;
  else if (pattern === 7) title = `The ${pick(rng, titleConcepts)} of the ${pick(rng, titleRelics)} of ${author}`;
  else if (pattern === 8) title = `The ${pick(rng, titleRelics)} and the ${pick(rng, titleSubjects)}`;
  else if (pattern === 9) title = `The ${pick(rng, titleSubjects)} and the ${pick(rng, titleRelics)}`;
  else title = `The ${pick(rng, titleNouns)} of ${author} the ${pick(rng, titleSubjects)}`;

  if (randomInt(rng, 1, 100) > 70 && title.startsWith('The ')) title = title.slice(4);
  return titleCaseBook(title);
}

function pickJob(rng, context) {
  if (context.game === 'Swords & Six-Siders') {
    return pick(rng, ['fighter', 'myrmidon', 'wizard', 'thief']);
  }
  if (context.game.includes('Tunnels & Trolls')) {
    return pick(rng, ['warrior', 'wizard', 'rogue', 'leader', 'healer']);
  }
  if (context.game === 'Labyrinth Lord' && context.aec) {
    return pick(rng, ['fighter', 'cleric', 'magic-user', 'thief', 'druid', 'illusionist', 'ranger', 'assassin']);
  }
  return pick(rng, ['fighter', 'cleric', 'magic-user', 'thief']);
}

function pickStat(rng, context) {
  if (context.game.includes('Tunnels & Trolls')) {
    return pick(rng, ['strength', 'intelligence', 'dexterity', 'constitution', 'charisma', 'luck']);
  }
  return pick(rng, ['strength', 'intelligence', 'wisdom', 'dexterity']);
}

function coinName(game, rng) {
  if (game.includes('Tunnels & Trolls')) return 'gold';
  if (game === 'Swords & Six-Siders') return 'coin';
  return pick(rng, ['gold', 'silver', 'electrum']);
}

function makeUnusualBook(rng, context) {
  const cursed = randomInt(rng, 1, 100) > 97;
  const owner = makeAuthor(rng);
  const tomeType = pick(rng, tomeKinds);
  const named = `${owner}${owner.endsWith('s') ? '`' : '`s'} ${cursed ? pick(rng, artifactAdjectives) + ' ' : ''}${tomeType}`;
  const title = titleCaseBook(named);
  const power = cursed ? pick(rng, curses) : pick(rng, unusualPowers)(rng, context);

  return {
    title,
    unusual: true,
    cursed,
    power
  };
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.books.length) {
    output.innerHTML = '<em>No books generated yet.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'books-summary';
  const unusualCount = result.payload.books.filter((book) => book.unusual).length;
  summary.textContent = `${result.payload.books.length} book(s) · ${unusualCount} unusual · ${result.game}`;
  output.appendChild(summary);

  result.payload.books.forEach((book) => {
    const card = document.createElement('article');
    card.className = `book-card ${book.unusual ? 'book-card-unusual' : ''}`;

    const title = document.createElement('div');
    title.className = 'book-title';
    title.textContent = `${book.index}. ${book.title}`;

    card.appendChild(title);

    if (book.unusual) {
      const tag = document.createElement('div');
      tag.className = 'book-tag';
      tag.textContent = book.cursed ? 'Unusual (Cursed)' : 'Unusual';
      card.appendChild(tag);

      const power = document.createElement('div');
      power.className = 'book-power';
      power.textContent = book.power;
      card.appendChild(power);
    }

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Labyrinth Lord';
  const amount = Math.min(100, Math.max(1, Number(formData.get('amount') || 1)));
  const unusual = Math.min(100, Math.max(0, Number(formData.get('unusual') || 0)));
  const aec = formData.get('aec') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const context = { game, aec };
  await loadDynamicTitlePools(context);
  const books = [];

  for (let index = 1; index <= amount; index += 1) {
    const isUnusual = unusual >= randomInt(rng, 1, 100);
    if (isUnusual) {
      books.push({ index, ...makeUnusualBook(rng, context) });
    } else {
      books.push({
        index,
        title: makeStandardTitle(rng),
        unusual: false,
        cursed: false,
        power: null
      });
    }
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      amount,
      unusual,
      aec
    },
    payload: {
      books
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
Books: ${lastResult.payload.books.length}
Unusual: ${lastResult.config.unusual}%

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
