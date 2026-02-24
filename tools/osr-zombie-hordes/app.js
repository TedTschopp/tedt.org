const toolId = 'zombies';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Generic',
  amount: 0,
  payload: {
    zombies: []
  }
};

const fallbackFirstNames = ['Alex', 'Jamie', 'Morgan', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Drew', 'Parker'];
const fallbackLastNames = ['Walker', 'Turner', 'Hayes', 'Bishop', 'Frost', 'Drake', 'Carter', 'Quinn', 'Hughes', 'Reed'];

let firstNames = fallbackFirstNames;
let lastNames = fallbackLastNames;

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

function pick(rng, list) {
  return list[randomInt(rng, 0, list.length - 1)];
}

function normalizeName(value) {
  return String(value || '')
    .replace(/[^a-zA-Z\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function loadZombieNamePools() {
  firstNames = fallbackFirstNames;
  lastNames = fallbackLastNames;

  if (!window.WizardawnData) {
    return;
  }

  try {
    const newFirst = [];
    const newLast = [];

    if (window.WizardawnData.getMutants) {
      const mutants = await window.WizardawnData.getMutants();
      (mutants || []).forEach((row) => {
        const cleaned = normalizeName(row.name).toLowerCase();
        if (!cleaned) return;
        const titled = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        newFirst.push(titled);
        newLast.push(titled);
      });
    }

    if (window.WizardawnData.getMonstersRpgs) {
      const monsters = await window.WizardawnData.getMonstersRpgs();
      (monsters || []).slice(0, 800).forEach((row) => {
        const cleaned = normalizeName(row.name).toLowerCase();
        if (!cleaned) return;
        const tokens = cleaned.split(' ').filter(Boolean);
        if (!tokens.length) return;
        newFirst.push(tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1));
        newLast.push(tokens[tokens.length - 1].charAt(0).toUpperCase() + tokens[tokens.length - 1].slice(1));
      });
    }

    firstNames = unique([...fallbackFirstNames, ...newFirst]).slice(0, 100);
    lastNames = unique([...fallbackLastNames, ...newLast]).slice(0, 100);
  } catch (error) {
    console.warn('Unable to load zombie name pools from shared data:', error);
    firstNames = fallbackFirstNames;
    lastNames = fallbackLastNames;
  }
}

function damageDie(rng, type) {
  if (type === 'bite') {
    return pick(rng, ['1d4', '1d6', '1d6', '1d6', '1d6', '1d8']);
  }
  return pick(rng, ['1d4', '1d4', '1d4', '1d4', '1d6', '1d8']);
}

function makeZombie(rng, game) {
  const skinColors = ['green', 'light-green', 'dark-green', 'yellowish', 'gray', 'grayish-green', 'sickly'];
  const paleStates = ['rotten', 'dirty', 'blotchy', 'ashen', 'hideous', 'grisly', 'revolting'];
  const hairStates = ['long', 'short', 'curly', 'braided', 'bald'];
  const rotStates = [
    'is missing a left arm',
    'is missing a right hand',
    'has bites all over',
    'has bites and scratches all over',
    'has bullet holes in several places',
    'has severe facial trauma'
  ];
  const clothingStates = [
    'rotten jacket and tattered jeans',
    'bloody hoodie and ripped pants',
    'soiled t-shirt and worn boots',
    'dirty coat and frayed slacks',
    'shredded sweater and muddy shoes'
  ];

  const firstName = pick(rng, firstNames);
  const lastName = pick(rng, lastNames);
  const sex = pick(rng, ['male', 'female']);
  const age = randomInt(rng, 1, 10) === 1 ? 'child' : 'adult';
  const pronoun = sex === 'male' ? 'He' : 'She';
  const possessive = sex === 'male' ? 'his' : 'her';
  const hair = pick(rng, hairStates);
  const bite = damageDie(rng, 'bite');
  const claw = damageDie(rng, 'claw');
  const rot = pick(rng, rotStates);
  const clothing = pick(rng, clothingStates);
  const skinColor = pick(rng, skinColors);
  const pale = pick(rng, paleStates);

  const description = `${firstName} is a ${age} ${sex} zombie that ${pronoun.toLowerCase()} has ${skinColor} skin, ${pale} in appearance. ${pronoun} ${rot}. ${pronoun} wears ${clothing}.`;

  const zombie = {
    name: `${firstName} ${lastName}`,
    sex,
    age,
    attacks: `1 bite / 1 claw`,
    damage: `${bite} bite / ${claw} claw`,
    appearance: {
      skinColor,
      complexion: pale,
      hair,
      rot,
      clothing
    },
    description,
    gameMode: game
  };

  if (game === 'Necropalyx') {
    zombie.necropalyxStats = {
      stamina: randomInt(rng, 10, 60),
      protection: randomInt(rng, 0, 5),
      hit: randomInt(rng, 6, 10),
      move: "12' walk / 120' fast walk"
    };
    zombie.description = `${description} ${pronoun} lashes with ${possessive} teeth and claws.`;
  }

  return zombie;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.zombies.length) {
    output.innerHTML = '<em>No zombies generated yet.</em>';
    return;
  }

  result.payload.zombies.forEach((zombie) => {
    const card = document.createElement('article');
    card.className = 'zombie-card';

    const title = document.createElement('div');
    title.className = 'zombie-title';
    title.textContent = zombie.name;

    const summary = document.createElement('div');
    summary.className = 'zombie-meta';
    summary.textContent = `${zombie.sex}, ${zombie.age} · ${zombie.attacks} · ${zombie.damage}`;

    const desc = document.createElement('p');
    desc.className = 'mb-2';
    desc.textContent = zombie.description;

    card.appendChild(title);
    card.appendChild(summary);
    card.appendChild(desc);

    if (zombie.necropalyxStats) {
      const stats = document.createElement('ul');
      stats.className = 'mb-0';
      stats.innerHTML = `
        <li>Stamina: ${zombie.necropalyxStats.stamina}</li>
        <li>Protection: ${zombie.necropalyxStats.protection}</li>
        <li>Hit: ${zombie.necropalyxStats.hit}</li>
        <li>Move: ${zombie.necropalyxStats.move}</li>
      `;
      card.appendChild(stats);
    }

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Generic';
  const amount = Math.min(100, Math.max(1, Number(formData.get('amount') || 1)));
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadZombieNamePools();

  const zombies = [];
  for (let index = 0; index < amount; index += 1) {
    zombies.push(makeZombie(rng, game));
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    amount,
    payload: {
      zombies
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
Amount: ${lastResult.amount || 0}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
