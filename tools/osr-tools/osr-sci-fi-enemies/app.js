const toolId = 'scifim';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const robotFuel = ['steam', 'clockworks', 'alien technology', 'petroleum', 'electricity', 'radiation', 'plutonium cells', 'nuclear cores', 'xormite cells'];
const robotMetal = ['iron', 'aluminium', 'steel', 'plastoid', 'durasteel', 'crystal alloy', 'adamant', 'promethium', 'unobtainium'];
const locomotion = ['legs', 'tracks', 'treads', 'wheels', 'hover', 'anti-gravity', 'water propulsion', 'rotor', 'stationary', 'wings'];
const handWeapons = ['claw', 'pincer', 'fist', 'jaw', 'drill'];
const botJobs = ['combat', 'retrieval', 'spying', 'guarding', 'escorting', 'exploration'];

const mutantTraits = ['bioluminescent skin', 'chitin plating', 'extra ocular sensors', 'acidic saliva', 'telepathic pulse', 'camouflage hide', 'electrostatic touch', 'regenerative tissues'];
const mutantOrigin = ['wasteland survivor', 'gene-lab escapee', 'derelict station drifter', 'radiation-born predator', 'terraforming byproduct', 'void-adapted scavenger'];
const mutantWeapons = ['clawed appendages', 'toxic spines', 'shock tendrils', 'bone scythes', 'kinetic tail', 'plasma gland'];

const namesA = ['AX', 'BR', 'CT', 'DX', 'EN', 'FK', 'GL', 'HR', 'IX', 'JN', 'KR', 'LM', 'NV', 'QZ', 'RT', 'SX', 'TR', 'VX'];

const fallbackMutantBases = [
  { name: 'wolf', attack1: 'bite', attack2: 'claw' },
  { name: 'spider', attack1: 'bite', attack2: '0' },
  { name: 'boar', attack1: 'tusks', attack2: '0' },
  { name: 'bear', attack1: 'claw', attack2: 'bite' },
];

const fallbackAlienNames = ['void stalker', 'star crawler', 'rift hunter', 'derelict lurker'];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    robots: [],
    beings: []
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
  if (state === 0) state = 99887766;
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

function damageDie(rng) {
  return pick(rng, ['1d4', '1d6', '1d8', '1d10', '1d12']);
}

function makeRobot(rng, terrain) {
  const level = randomInt(rng, 1, 20);
  const fuel = pick(rng, robotFuel);
  const metal = pick(rng, robotMetal);
  const movementType = pick(rng, locomotion);
  const job = pick(rng, botJobs);
  const attacks = randomInt(rng, 1, 3);
  const weapon = pick(rng, handWeapons);
  const speed = movementType === 'stationary' ? 0 : randomInt(rng, 30, 180);
  const salvage = Math.max(5, 100 - ((level - 1) * 5));

  const code = `${pick(rng, namesA)}-${randomInt(rng, 10, 99)}${pick(rng, namesA)}`;
  const title = `${code} ${job === 'combat' ? 'Battle' : job === 'spying' ? 'Recon' : 'Utility'} Bot`;

  return {
    type: 'Robot',
    name: title,
    level,
    armor: randomInt(rng, 2, 12),
    hp: randomInt(rng, 8, 20) + (level * 3),
    fuel,
    construction: metal,
    movement: `${movementType} (${speed}')`,
    role: job,
    attacks: `${attacks} ${weapon}${attacks > 1 ? 's' : ''}`,
    damage: Array.from({ length: attacks }, () => `${damageDie(rng)} ${weapon}`).join(' / '),
    salvagePercent: salvage,
    habitat: terrain || (movementType === 'water propulsion' ? 'rivers & lakes' : 'varied terrain'),
    notes: `Designed for ${job} protocols with ${fuel} power architecture.`
  };
}

function makeBeing(rng, game, terrain) {
  const level = randomInt(rng, 1, 20);
  const isAlien = game === 'Space Ryft' || randomInt(rng, 1, 100) > 50;
  const type = isAlien ? 'Alien' : 'Mutant';

  const mutantBases = window.__wizMutantBases || fallbackMutantBases;
  const alienNames = window.__wizAlienNames || fallbackAlienNames;
  const mutantBase = pick(rng, mutantBases);
  const mutantName = mutantBase?.name || 'creature';
  const attack1 = mutantBase?.attack1 || 'claw';
  const attack2 = mutantBase?.attack2 || '0';
  const baseAttack = attack2 && attack2 !== '0' ? `${attack1}/${attack2}` : attack1;
  const alienBase = pick(rng, alienNames);

  const primaryTrait = pick(rng, mutantTraits);
  const secondaryTrait = pick(rng, mutantTraits.filter((trait) => trait !== primaryTrait));
  const weapon = pick(rng, mutantWeapons);

  return {
    type,
    name: isAlien
      ? `Alien ${alienBase}-${randomInt(rng, 10, 99)}`
      : `Mutant ${mutantName}-${randomInt(rng, 10, 99)}`,
    level,
    armor: randomInt(rng, 1, 9),
    hp: randomInt(rng, 6, 18) + (level * 2),
    origin: pick(rng, mutantOrigin),
    traits: [primaryTrait, secondaryTrait],
    attacks: randomInt(rng, 1, 3),
    damage: `${damageDie(rng)} ${isAlien ? weapon : baseAttack}`,
    habitat: terrain || pick(rng, ['ruins', 'wastelands', 'orbital wreckage', 'fungal caverns', 'dust plains']),
    morale: randomInt(rng, 4, 12),
    notes: `${type} adapted for hostile zones and opportunistic predation.`
  };
}

async function loadCreatureData() {
  if (window.__wizScifimDataReady) {
    return;
  }

  const [mutants, alienMonsters] = await Promise.all([
    window.WizardawnData.getMutants(),
    window.WizardawnData.getMonsterNamesForCreatorPrefixes(['BU', 'MF'])
  ]);

  window.__wizMutantBases = mutants.length
    ? mutants.map((row) => ({ name: row.name, attack1: row.attack1, attack2: row.attack2 }))
    : fallbackMutantBases;
  window.__wizAlienNames = alienMonsters.length ? alienMonsters : fallbackAlienNames;
  window.__wizScifimDataReady = true;
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'scifi-summary';
  summary.textContent = `${result.payload.robots.length} robot(s), ${result.payload.beings.length} mutant/alien being(s)`;
  output.appendChild(summary);

  if (result.payload.robots.length) {
    const robotHeader = document.createElement('h2');
    robotHeader.className = 'h6 mt-2';
    robotHeader.textContent = 'Robots';
    output.appendChild(robotHeader);

    result.payload.robots.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'scifi-card';
      card.innerHTML = `
        <div class="scifi-title">${entry.name} (L${entry.level})</div>
        <div class="scifi-line">AC ${entry.armor} · HP ${entry.hp} · MV ${entry.movement} · Salvage ${entry.salvagePercent}%</div>
        <div class="scifi-line">Fuel: ${entry.fuel} · Build: ${entry.construction} · Role: ${entry.role}</div>
        <div class="scifi-line">Attacks: ${entry.attacks} (${entry.damage})</div>
        <div class="scifi-line">Habitat: ${entry.habitat}</div>
        <div class="scifi-line">${entry.notes}</div>
      `;
      output.appendChild(card);
    });
  }

  if (result.payload.beings.length) {
    const beingHeader = document.createElement('h2');
    beingHeader.className = 'h6 mt-2';
    beingHeader.textContent = result.config.game === 'Space Ryft' ? 'Aliens' : 'Mutants / Aliens';
    output.appendChild(beingHeader);

    result.payload.beings.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'scifi-card';
      card.innerHTML = `
        <div class="scifi-title">${entry.name} (${entry.type}, L${entry.level})</div>
        <div class="scifi-line">AC ${entry.armor} · HP ${entry.hp} · Morale ${entry.morale}</div>
        <div class="scifi-line">Origin: ${entry.origin}</div>
        <div class="scifi-line">Traits: ${entry.traits.join(', ')}</div>
        <div class="scifi-line">Attacks: ${entry.attacks} (${entry.damage})</div>
        <div class="scifi-line">Habitat: ${entry.habitat}</div>
        <div class="scifi-line">${entry.notes}</div>
      `;
      output.appendChild(card);
    });
  }

  if (!result.payload.robots.length && !result.payload.beings.length) {
    output.innerHTML = '<em>No enemies generated. Increase robot or mutant counts.</em>';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadCreatureData();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const config = {
    game: formData.get('game')?.toString() || 'Mutant Future',
    robots: Math.max(0, Math.min(100, Number(formData.get('robots') || 0))),
    mutants: Math.max(0, Math.min(100, Number(formData.get('mutants') || 0))),
    terrain: formData.get('terrain')?.toString().trim() || ''
  };

  const robots = Array.from({ length: config.robots }, () => makeRobot(rng, config.terrain));
  const beings = Array.from({ length: config.mutants }, () => makeBeing(rng, config.game, config.terrain));

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config,
    payload: {
      robots,
      beings
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
Game: ${lastResult.config?.game || 'n/a'}
Robots: ${lastResult.payload.robots.length}
Mutants/Aliens: ${lastResult.payload.beings.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
