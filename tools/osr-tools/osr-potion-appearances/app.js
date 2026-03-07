const toolId = 'potions';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');

const potionCatalog = {
  OSRIC: ['Oil of Etherealness', 'Oil of Slipperiness', 'Philtre of Love', 'Philtre of Persuasiveness', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Gaseous Form', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Potion of Plant Control', 'Potion of Polymorph', 'Potion of Speed', 'Potion of Super-Heroism', 'Potion of Sweet Water', 'Potion of Treasure Finding', 'Potion of Water Breathing'],
  'Labyrinth Lord': ['Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Oil of Etherealness', 'Oil of Slipperiness', 'Philter of Love', 'Potion of Plant Control', 'Potion of Poison', 'Potion of Polymorph', 'Potion of Speed', 'Potion of Super-Heroism', 'Potion of Sweet Water', 'Potion of Treasure Finding', 'Potion of Undead Control', 'Potion of Water Breathing'],
  'BD&D': ['Poison', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Control Animal', 'Potion of Control Dragon', 'Potion of Control Giant', 'Potion of Control Human', 'Potion of Control Plant', 'Potion of Control Undead', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Potion of Polymorph Self', 'Potion of Speed', 'Potion of Treasure Finding'],
  'AD&D': ['Oil of Etherealness', 'Oil of Slipperiness', 'Philter of Love', 'Philter of Persuasiveness', 'Poison', 'Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Climbing', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Extra-Healing', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Potion of Plant Control', 'Potion of Polymorph Self', 'Potion of Speed', 'Potion of Super-Heroism', 'Potion of Sweet Water', 'Potion of Treasure Finding', 'Potion of Water Breathing'],
  BFRPG: ['Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Control Animal', 'Potion of Control Dragon', 'Potion of Control Giant', 'Potion of Control Human', 'Potion of Control Plant', 'Potion of Control Undead', 'Potion of Delusion', 'Potion of Diminution', 'Potion of ESP', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Longevity', 'Poison', 'Potion of Polymorph Self', 'Potion of Speed', 'Potion of Treasure Finding'],
  'Swords & Wizardry': ['Potion of Animal Control', 'Potion of Clairaudience', 'Potion of Clairvoyance', 'Potion of Diminution', 'Potion of Dragon Control', 'Potion of Ethereality', 'Potion of Fire Resistance', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Heroism', 'Potion of Invisibility', 'Potion of Invulnerability', 'Potion of Levitation', 'Potion of Plant Control', 'Poison', 'Potion of Slipperiness', 'Potion of Treasure Finding', 'Potion of Undead Control', 'Potion of Extra Healing', 'Potion of Healing'],
  'Swords & Six-Siders': ['Poison', 'Potion of Flying', 'Potion of Gaseous Form', 'Potion of Giant Strength', 'Potion of Growth', 'Potion of Healing', 'Potion of Invisibility', 'Potion of Levitation', 'Potion of Neutralize Poison', 'Potion of Remove Disease', 'Potion of Remove Paralysis', 'Potion of Shrinking', 'Potion of Stone to Flesh'],
  'Tunnels & Trolls 5th Edition': ['Acid Resistance Potion', 'Animal Domination Potion', 'Blessing Elixir', 'Cold Resistance Mixture', 'Dragon Breath Potion', 'Flying Potion', 'Giant Strength Potion', 'Healing Potion', 'Invisibility Potion', 'Levitation Potion', 'Life Giving Elixir', 'Polymorph Potion', 'Speed Potion', 'Treasure Seeking Potion', 'Underwater Breathing Potion'],
  'Tunnels & Trolls 7th Edition': ['Acid Resistance Potion', 'Animal Domination Potion', 'Blessing Elixir', 'Cold Resistance Mixture', 'Dragon Breath Potion', 'Flying Potion', 'Giant Strength Potion', 'Healing Potion', 'Invisibility Potion', 'Levitation Potion', 'Life Giving Elixir', 'Polymorph Potion', 'Speed Potion', 'Treasure Seeking Potion', 'Underwater Breathing Potion'],
  'Tunnels & Trolls Deluxe': ['Acid Resistance Potion', 'Animal Domination Potion', 'Blessing Elixir', 'Cold Resistance Mixture', 'Dragon Breath Potion', 'Flying Potion', 'Giant Strength Potion', 'Healing Potion', 'Invisibility Potion', 'Levitation Potion', 'Life Giving Elixir', 'Polymorph Potion', 'Speed Potion', 'Treasure Seeking Potion', 'Underwater Breathing Potion']
};

const adndUaExtras = ['Elixir of Health', 'Elixir of Life', 'Elixir of Madness', 'Elixir of Youth', 'Oil of Acid Resistance', 'Oil of Disenchantment', 'Oil of Elemental Invulnerability', 'Oil of Fiery Burning', 'Oil of Fumbling', 'Oil of Impact', 'Oil of Timelessness', 'Philter of Beauty', 'Philter of Glibness', 'Philter of Stammering & Stuttering', 'Potion of Fire Breath', 'Potion of Rainbow Hues', 'Potion of Ventriloquism', 'Potion of Vitality'];
const llAecExtras = ['Potion of Brass Dragon Control', 'Potion of Bronze Dragon Control', 'Potion of Copper Dragon Control', 'Potion of Gold Dragon Control', 'Potion of Silver Dragon Control'];

const lookList = ['bubbling', 'cloudy', 'effervescent', 'fuming', 'oily', 'smoky', 'syrupy', 'vaporous', 'viscous', 'watery', 'clear', 'flecked', 'layered', 'luminous', 'rainbowed'];
const flavorList = ['acidic', 'bilious', 'bitter', 'burning', 'buttery', 'dusty', 'earthy', 'fiery', 'fishy', 'greasy', 'herbal', 'honeyed', 'lemony', 'meaty', 'metallic', 'milky', 'musty', 'oniony', 'peppery', 'perfumy', 'salty', 'sugary', 'sour', 'spicy', 'sweet', 'tart', 'vinegary', 'watery'];
const colorFamily = ['brown', 'sea green', 'midnight blue', 'aquamarine', 'lemon yellow', 'mint', 'dandelion', 'carrot orange', 'wild strawberry', 'scarlet', 'gold', 'umber', 'canary', 'eggplant', 'blue', 'magenta', 'fuchsia', 'gray', 'jungle green', 'bluish gray', 'apricot', 'forest green', 'white', 'snow white', 'pine green', 'silver', 'copper', 'spring green', 'turquoise blue', 'bluish violet', 'violet', 'bluish green', 'blush', 'pink', 'salmon', 'orchid', 'maize', 'lime', 'desert sand', 'orange', 'blood red', 'tan', 'almond', 'yellow', 'shamrock', 'burnt sienna', 'reddish purple', 'chestnut', 'yellowish orange', 'black', 'royal purple', 'sunset orange', 'purple', 'asparagus', 'fern', 'sky blue', 'green', 'peach', 'cornflower', 'burnt orange', 'teal blue', 'plum', 'indigo', 'reddish orange', 'yellowish green', 'red', 'mulberry', 'antique brass', 'lavender', 'mahogany', 'sunglow', 'thistle', 'reddish brown', 'olive green'];
const colorList = ['brassy (metallic)', 'bronze (metallic)', 'coppery (metallic)', 'gold (metallic)', 'silvery (metallic)', 'steely (metallic)', 'fuchsia (violet)', 'heliotrope (violet)', 'lake (violet)', 'lavender (violet)', 'lilac (violet)', 'magenta (violet)', 'mauve (violet)', 'plum (violet)', 'puce (violet)', 'purple (violet)', 'bone (white)', 'colorless (white)', 'ivory (white)', 'pearl (white)', 'amber (yellow)', 'buff (yellow)', 'citrine (yellow)', 'cream (yellow)', 'fallow (yellow)', 'flaxen (yellow)', 'ochre (yellow)', 'peach (yellow)', 'saffron (yellow)', 'straw (yellow)', 'dove (gray)', 'dun (gray)', 'neutral (gray)', 'carmine (red)', 'cerise (red)', 'cherry (red)', 'cinnabar (red)', 'coral (red)', 'crimson (red)', 'madder (red)', 'maroon (red)', 'pink (red)', 'rose (red)', 'ruby (red)', 'russet (red)', 'rust (red)', 'sanguine (red)', 'scarlet (red)', 'vermilion (red)', 'chocolate (brown)', 'ecru (brown)', 'fawn (brown)', 'mahogany (brown)', 'tan (brown)', 'terra cotta (brown)', 'aquamarine (brown)', 'emerald (brown)', 'olive (brown)', 'azure (blue)', 'cerulean (blue)', 'indigo (blue)', 'sapphire (blue)', 'turquoise (blue)', 'ultramarine (blue)', 'ebony (black)', 'inky (black)', 'pitchy (black)', 'sable (black)', 'sooty (black)', 'apricot (orange)', 'flame (orange)', 'golden (orange)', 'salmon (orange)', 'tawny (orange)'];

let dynamicFlavorList = flavorList;

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  game: 'Fantasy',
  config: {
    amount: 10,
    ua: false,
    aec: false
  },
  payload: {
    entries: []
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

function gameToStoreCodes(game, aec) {
  if (game === 'OSRIC') return ['OSRIC'];
  if (game === 'AD&D') return ['AD'];
  if (game === 'BFRPG') return ['BFRPG'];
  if (game === 'BD&D') return ['BX'];
  if (game === 'Swords & Wizardry') return ['SW'];
  if (game === 'Swords & Six-Siders') return ['SX'];
  if (game.includes('Tunnels & Trolls')) return ['TT'];
  if (game === 'Labyrinth Lord') return aec ? ['LL', 'AEC'] : ['LL'];
  if (game === 'Fantasy') return [];
  return ['LL'];
}

function cleanItemLabel(item) {
  return String(item || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function toFlavorNote(item) {
  const text = cleanItemLabel(item);
  if (!text) return null;
  if (!/\b(herb|sage|garlic|belladonna|feverfew|rue|ink|oil|water|powder|dust|resin|moss|glue|incense)\b/i.test(text)) {
    return null;
  }
  const token = text.split(' ')[0];
  if (!token || token.length < 3) return null;
  return `${token}-like`;
}

async function loadFlavorPools(game, aec) {
  if (!window.WizardawnData?.getStoreItemsByStore) {
    return;
  }

  try {
    const gameCodes = gameToStoreCodes(game, aec);
    const rows = await window.WizardawnData.getStoreItemsByStore(gameCodes, ['ALCHEMIST', 'SUPPLIES']);
    if (!Array.isArray(rows) || !rows.length) {
      dynamicFlavorList = flavorList;
      return;
    }

    const extracted = rows
      .map((row) => toFlavorNote(row.item))
      .filter(Boolean);

    const merged = [...new Set([...extracted, ...flavorList])];
    dynamicFlavorList = merged.length ? merged : flavorList;
  } catch (error) {
    console.warn('Unable to load potions flavor pools from store_items:', error);
    dynamicFlavorList = flavorList;
  }
}

function buildCatalog(game, ua, aec) {
  let list = [...(potionCatalog[game] || [])];
  if (game === 'AD&D' && ua) list = [...list, ...adndUaExtras];
  if (game === 'Labyrinth Lord' && aec) list = [...list, ...llAecExtras];
  return list;
}

function makeAppearance(rng) {
  const look = pick(rng, lookList);
  let text = look === 'layered' ? `This potion is ${look}` : `This liquid looks ${look}`;
  if (look === 'flecked') text += ` [${pick(rng, colorFamily)} colored]`;
  if (look === 'layered') text += ` [colors of ${pick(rng, colorFamily)}, ${pick(rng, colorFamily)}, and ${pick(rng, colorFamily)}]`;
  text += ` in appearance. It also has a ${pick(rng, dynamicFlavorList)} taste and smell to it. It seems to be ${pick(rng, colorList)} in color.`;
  return text;
}

function renderResult(result) {
  output.innerHTML = '';

  if (!result.payload.entries.length) {
    output.innerHTML = '<em>No potion output generated yet.</em>';
    return;
  }

  const summary = document.createElement('div');
  summary.className = 'potions-summary';
  summary.textContent = `${result.payload.entries.length} entry(ies) · ${result.game}`;
  output.appendChild(summary);

  result.payload.entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'potion-card';

    const title = document.createElement('div');
    title.className = 'potion-title';
    title.textContent = entry.name ? `${entry.line}. ${entry.name}` : `${entry.line}.`;
    card.appendChild(title);

    const desc = document.createElement('div');
    desc.className = 'potion-desc';
    desc.textContent = entry.appearance;
    card.appendChild(desc);

    output.appendChild(card);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const game = formData.get('game')?.toString() || 'Fantasy';
  const amountRaw = Math.max(0, Number(formData.get('amount') || 0));
  const amount = Math.min(100, amountRaw);
  const ua = formData.get('ua') === '1';
  const aec = formData.get('aec') === '1';
  const seed = formData.get('seed')?.toString().trim() || null;
  const rng = makeRng(seed || `${Date.now()}-${Math.random()}`);

  await loadFlavorPools(game, aec);

  let entries = [];
  if (game === 'Fantasy') {
    const count = Math.max(1, amount || 10);
    entries = Array.from({ length: count }, (_, index) => ({ line: index + 1, name: null, appearance: makeAppearance(rng) }));
  } else if (amount > 0) {
    entries = Array.from({ length: amount }, (_, index) => ({ line: index + 1, name: null, appearance: makeAppearance(rng) }));
  } else {
    const catalog = buildCatalog(game, ua, aec);
    entries = catalog.map((name, index) => ({ line: index + 1, name, appearance: makeAppearance(rng) }));
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    game,
    config: {
      amount,
      ua,
      aec
    },
    payload: {
      entries
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
Entries: ${lastResult.payload.entries.length}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});
