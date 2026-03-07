const toolId = 'data';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const containerPool = ['wooden chest', 'iron box', 'stone coffer', 'sealed urn', 'travel satchel', 'hidden niche cache'];
const decorationPool = ['faded banner', 'cracked mural', 'broken statue', 'dusty tapestries', 'charred altar', 'etched warning sigil'];
const trapPool = ['needle lock', 'swinging blade', 'pit drop', 'acid spray', 'poison gas vent', 'collapsing floor'];

const paContainerPool = ['cargo crate', 'ammo locker', 'sealed toolkit case', 'vehicle trunk', 'scrap barrel', 'bunker wall safe'];
const paDecorationPool = ['irradiated graffiti', 'rusted machinery', 'burned signage', 'hanging cables', 'collapsed scaffolding', 'broken terminal'];
const paTrapPool = ['shock plate', 'tripwire grenade', 'electro-net launcher', 'falling rebar', 'sonic alarm snare', 'caustic mist valve'];

const sciContainerPool = ['stasis locker', 'alloy crate', 'pressurized canister', 'maintenance pod', 'bio-sample case', 'vacuum-safe compartment'];
const sciDecorationPool = ['flickering holo panel', 'gravity warning placard', 'coolant leak wall', 'drifted cargo straps', 'failed cryo tube', 'navigation star map'];
const sciTrapPool = ['laser grid', 'airlock purge', 'security drone ambush', 'plasma arc conduit', 'gravity inversion burst', 'vacuum breach trigger'];

const currency3 = ['12 gp, 45 sp, 110 cp', '3 gp, 90 sp, 250 cp', '27 gp, 15 sp, 40 cp', '6 gp, 10 sp, 12 cp'];
const currency5 = ['2 pp, 14 gp, 9 ep, 30 sp, 85 cp', '1 pp, 22 gp, 12 ep, 44 sp, 100 cp', '3 pp, 8 gp, 5 ep, 20 sp, 60 cp'];
const paMoney = ['14 domars', '88 credits', '120 bottle caps', '36 scrap tokens'];
const sciMoney = ['15 pc', '63 pc', '110 pc', '42 pc'];

const gems = ['GEM: fire opal', 'GEM: moonstone', 'GEM: blood agate', 'GEM: black pearl'];
const jewels = ['JEWELRY: silver torque', 'JEWELRY: ruby-studded ring', 'JEWELRY: gold filigree chain', 'JEWELRY: platinum brooch'];
const magicItems = ['wand of sparks', 'ring of warding', 'enchanted blade', 'cloak of resistance', 'staff of embers'];
const mundaneTreasures = ['fine silk bundle', 'rare spice crate', 'masterwork tools', 'antique map case', 'artisan lockpick set'];

const paItems = ['plasma coil', 'rad tablets', 'field medic satchel', 'scrap armor panel', 'mutant antidote', 'energy battery'];
const paNormalItems = ['canteen', 'rope spool', 'flare stick', 'metal ration box', 'heavy gloves'];
const sciItems = ['laser cutter', 'holo projector', 'fusion cell', 'nano patcher', 'drone key', 'mag boots'];
const sciNormalItems = ['spare conduit', 'vacuum tape', 'utility tablet', 'repair foam', 'field scanner'];

let runtimePools = {
  containerPool: [...containerPool],
  decorationPool: [...decorationPool],
  trapPool: [...trapPool],
  paContainerPool: [...paContainerPool],
  paDecorationPool: [...paDecorationPool],
  paTrapPool: [...paTrapPool],
  sciContainerPool: [...sciContainerPool],
  sciDecorationPool: [...sciDecorationPool],
  sciTrapPool: [...sciTrapPool],
  magicItems: [...magicItems],
  mundaneTreasures: [...mundaneTreasures],
  paItems: [...paItems],
  paNormalItems: [...paNormalItems],
  sciItems: [...sciItems],
  sciNormalItems: [...sciNormalItems],
};
let runtimePoolsReady = false;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  payload: {
    lines: []
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

function uniqueValues(list) {
  return [...new Set(list.filter(Boolean))];
}

function normalizeItemText(value) {
  return String(value || '').trim().toLowerCase();
}

function chooseFromRows(rows, filterFn) {
  return uniqueValues(rows.filter(filterFn).map((row) => normalizeItemText(row.item)));
}

async function loadRuntimePools() {
  if (runtimePoolsReady) {
    return;
  }

  const [dungeonRows, ttRows, paRows, sciRows, mutants, legend] = await Promise.all([
    window.WizardawnData.getStoreItemsForGames(['DD']),
    window.WizardawnData.getStoreItemsForGames(['TT']),
    window.WizardawnData.getStoreItemsForGames(['MF', 'PA', 'BU']),
    window.WizardawnData.getStoreItemsForGames(['BU']),
    window.WizardawnData.getMutants(),
    window.WizardawnData.getWorldmapLegend(),
  ]);

  const mutantTrapTerms = uniqueValues(
    mutants
      .flatMap((row) => [row.attack1, row.attack2])
      .filter((attack) => attack && attack !== '0')
      .map((attack) => `${String(attack).toLowerCase()} trap`)
  );

  const legendDecorTerms = uniqueValues(
    legend
      .map((row) => row.nameClean)
      .filter((name) => /ruin|tower|temple|cav|forest|swamp|desert|crystal|station|city|outpost/i.test(name))
      .map((name) => `${name.toLowerCase()} marker`)
  );

  runtimePools = {
    containerPool: chooseFromRows(dungeonRows, (row) => ['SUPPLIES', 'PROVISIONER', 'CARPENTER', 'BLACKSMITH'].includes(row.storeCode)).length
      ? chooseFromRows(dungeonRows, (row) => ['SUPPLIES', 'PROVISIONER', 'CARPENTER', 'BLACKSMITH'].includes(row.storeCode))
      : [...containerPool],
    decorationPool: legendDecorTerms.length ? legendDecorTerms : [...decorationPool],
    trapPool: mutantTrapTerms.length ? mutantTrapTerms : [...trapPool],

    paContainerPool: chooseFromRows(paRows, (row) => ['SUPPLIES', 'PROVISIONER', 'MECHANIC', 'VEHICLE'].includes(row.storeCode)).length
      ? chooseFromRows(paRows, (row) => ['SUPPLIES', 'PROVISIONER', 'MECHANIC', 'VEHICLE'].includes(row.storeCode))
      : [...paContainerPool],
    paDecorationPool: chooseFromRows(paRows, (row) => ['BAR', 'TAVERN', 'BAKER'].includes(row.storeCode)).length
      ? chooseFromRows(paRows, (row) => ['BAR', 'TAVERN', 'BAKER'].includes(row.storeCode)).map((item) => `${item} display`)
      : [...paDecorationPool],
    paTrapPool: mutantTrapTerms.length ? mutantTrapTerms : [...paTrapPool],

    sciContainerPool: chooseFromRows(sciRows, (row) => ['MECHANIC', 'VEHICLE', 'SUPPLIES'].includes(row.storeCode)).length
      ? chooseFromRows(sciRows, (row) => ['MECHANIC', 'VEHICLE', 'SUPPLIES'].includes(row.storeCode))
      : [...sciContainerPool],
    sciDecorationPool: legendDecorTerms.length ? legendDecorTerms : [...sciDecorationPool],
    sciTrapPool: mutantTrapTerms.length ? mutantTrapTerms : [...sciTrapPool],

    magicItems: chooseFromRows(dungeonRows, (row) => ['ALCHEMIST', 'PRIEST'].includes(row.storeCode)).length
      ? chooseFromRows(dungeonRows, (row) => ['ALCHEMIST', 'PRIEST'].includes(row.storeCode))
      : [...magicItems],
    mundaneTreasures: chooseFromRows(dungeonRows, (row) => ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode)).length
      ? chooseFromRows(dungeonRows, (row) => ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode))
      : [...mundaneTreasures],

    paItems: chooseFromRows(paRows, (row) => ['MILITARY', 'MECHANIC', 'VEHICLE'].includes(row.storeCode)).length
      ? chooseFromRows(paRows, (row) => ['MILITARY', 'MECHANIC', 'VEHICLE'].includes(row.storeCode))
      : [...paItems],
    paNormalItems: chooseFromRows(paRows, (row) => ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode)).length
      ? chooseFromRows(paRows, (row) => ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode))
      : [...paNormalItems],

    sciItems: chooseFromRows(sciRows, (row) => row.eraCode === 'HI' || ['MECHANIC', 'VEHICLE', 'MILITARY'].includes(row.storeCode)).length
      ? chooseFromRows(sciRows, (row) => row.eraCode === 'HI' || ['MECHANIC', 'VEHICLE', 'MILITARY'].includes(row.storeCode))
      : [...sciItems],
    sciNormalItems: chooseFromRows(sciRows, (row) => row.eraCode === 'LOW' || ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode)).length
      ? chooseFromRows(sciRows, (row) => row.eraCode === 'LOW' || ['SUPPLIES', 'PROVISIONER', 'BAR', 'TAVERN'].includes(row.storeCode))
      : [...sciNormalItems],
  };

  if (ttRows.length) {
    const ttGeneral = chooseFromRows(ttRows, () => true);
    if (ttGeneral.length) {
      runtimePools.containerPool = ttGeneral;
      runtimePools.decorationPool = ttGeneral.map((item) => `${item} set`);
      runtimePools.trapPool = mutantTrapTerms.length ? mutantTrapTerms : runtimePools.trapPool;
      runtimePools.magicItems = ttGeneral;
      runtimePools.mundaneTreasures = ttGeneral;
    }
  }

  runtimePoolsReady = true;
}

function makeSimpleList(rng, amount, pool) {
  return Array.from({ length: amount }, () => pick(rng, pool));
}

function makeTreasureLines(rng, amount, options) {
  const lines = [options.headerOne, options.headerTwo, '--END--'];
  const moneyCount = Math.max(1, Math.floor(amount / 3));
  const itemCount = Math.max(1, amount - moneyCount);

  for (let index = 0; index < moneyCount; index += 1) {
    const roll = randomInt(rng, 1, 100);
    let item = pick(rng, options.currencyPool);
    if (roll >= 80 && roll < 90) item = pick(rng, gems);
    if (roll >= 90) item = pick(rng, jewels);
    lines.push(`${item}   1   0`);
  }

  lines.push('--END--');

  for (let index = 0; index < itemCount; index += 1) {
    const roll = randomInt(rng, 1, 100);
    const item = roll <= 90 ? pick(rng, options.magicPool) : pick(rng, options.normalPool);
    lines.push(`${item}   1   0`);
  }

  return lines;
}

function generateListing(rng, listType, amount) {
  switch (listType) {
    case 'Dungeon Containers':
    case 'T&T 5e Containers':
    case 'T&T 7e/Deluxe Containers':
      return makeSimpleList(rng, amount, runtimePools.containerPool);

    case 'Dungeon Decorations':
    case 'T&T 5e Decorations':
    case 'T&T 7e/Deluxe Decorations':
      return makeSimpleList(rng, amount, runtimePools.decorationPool);

    case 'Dungeon Traps':
    case 'T&T 5e Traps':
    case 'T&T 7e/Deluxe Traps':
      return makeSimpleList(rng, amount, runtimePools.trapPool);

    case 'Dungeon Treasure (5 Denominations)':
      return makeTreasureLines(rng, amount, {
        headerOne: 'Riches   20   1',
        headerTwo: 'Item   1   2',
        currencyPool: currency5,
        magicPool: runtimePools.magicItems,
        normalPool: runtimePools.mundaneTreasures
      });

    case 'Dungeon Treasure (3 Denominations)':
      return makeTreasureLines(rng, amount, {
        headerOne: 'Riches   20   1',
        headerTwo: 'Item   1   2',
        currencyPool: currency3,
        magicPool: runtimePools.magicItems,
        normalPool: runtimePools.mundaneTreasures
      });

    case 'T&T 5e Treasure (Original Weapons/Armor)':
    case 'T&T 5e Treasure (Simple Weapons/Armor)':
    case 'T&T 7e Treasure (Original Weapons/Armor)':
    case 'T&T 7e Treasure (Simple Weapons/Armor)':
    case 'T&T Deluxe Treasure':
      return makeTreasureLines(rng, amount, {
        headerOne: 'Riches   5   1',
        headerTwo: 'Item   1   2',
        currencyPool: currency3,
        magicPool: runtimePools.magicItems,
        normalPool: runtimePools.mundaneTreasures
      });

    case 'Post-Apocalyptic Containers':
      return makeSimpleList(rng, amount, runtimePools.paContainerPool);
    case 'Post-Apocalyptic Decorations':
      return makeSimpleList(rng, amount, runtimePools.paDecorationPool);
    case 'Post-Apocalyptic Traps':
      return makeSimpleList(rng, amount, runtimePools.paTrapPool);
    case 'Post-Apocalyptic Treasure':
      return makeTreasureLines(rng, amount, {
        headerOne: 'Money   20   1',
        headerTwo: 'Item   1   2',
        currencyPool: paMoney,
        magicPool: runtimePools.paItems,
        normalPool: runtimePools.paNormalItems
      });

    case 'Sci-Fi Containers':
      return makeSimpleList(rng, amount, runtimePools.sciContainerPool);
    case 'Sci-Fi Decorations':
      return makeSimpleList(rng, amount, runtimePools.sciDecorationPool);
    case 'Sci-Fi Traps':
      return makeSimpleList(rng, amount, runtimePools.sciTrapPool);
    case 'Sci-Fi Treasure':
      return makeTreasureLines(rng, amount, {
        headerOne: 'Money   20   1',
        headerTwo: 'Item   1   2',
        currencyPool: sciMoney,
        magicPool: runtimePools.sciItems,
        normalPool: runtimePools.sciNormalItems
      });

    default:
      return [];
  }
}

function renderResult(result) {
  output.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'data-header';
  header.textContent = `${result.config.listType} · ${result.payload.lines.length} line(s)`;
  output.appendChild(header);

  const listing = document.createElement('pre');
  listing.className = 'data-listing mb-0';
  listing.textContent = result.payload.lines.join('\n');
  output.appendChild(listing);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await loadRuntimePools();

  const formData = new FormData(form);
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  const listType = formData.get('listType')?.toString() || 'Dungeon Containers';
  const amount = Math.max(10, Math.min(1000, Number(formData.get('amount') || 100)));
  const lines = generateListing(rng, listType, amount);

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      listType,
      amount
    },
    payload: {
      lines
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

~~~
${(lastResult.payload.lines || []).join('\n')}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const escaped = (lastResult.payload.lines || []).join('\n').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${escaped}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
