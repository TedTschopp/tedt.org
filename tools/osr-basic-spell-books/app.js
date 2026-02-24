const toolId = 'llb_spells';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');
const clericList = document.getElementById('cleric-list');
const elfList = document.getElementById('elf-list');
const mageList = document.getElementById('mage-list');

let spellData = [];

let lastResult = {
  tool: toolId,
  generatedAt: null,
  seed: null,
  config: {
    sort: '1',
    extra: false,
    listing: '',
    mins: '0',
    level: null
  },
  payload: {
    spells: []
  }
};

async function loadSpellData() {
  spellData = await window.WizardawnData.getLabLordSpells();
  renderSpellSelectors();
}

function makeSpellCheckbox(spell) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-check spell-item';

  const input = document.createElement('input');
  input.className = 'form-check-input';
  input.type = 'checkbox';
  input.id = `spell-${spell.id}`;
  input.name = `spell_${spell.id}`;
  input.value = String(spell.id);

  const label = document.createElement('label');
  label.className = 'form-check-label';
  label.setAttribute('for', input.id);
  label.textContent = spell.name;

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  return wrapper;
}

function renderSpellSelectors() {
  clericList.innerHTML = '';
  elfList.innerHTML = '';
  mageList.innerHTML = '';

  const clericSpells = spellData.filter((spell) => spell.class === 'Cleric').sort((a, b) => a.name.localeCompare(b.name));
  const elfSpells = spellData.filter((spell) => spell.class === 'Mage' && spell.level < 6).sort((a, b) => a.name.localeCompare(b.name));
  const mageSpells = spellData.filter((spell) => spell.class === 'Mage').sort((a, b) => a.name.localeCompare(b.name));

  clericSpells.forEach((spell) => clericList.appendChild(makeSpellCheckbox(spell)));
  elfSpells.forEach((spell) => elfList.appendChild(makeSpellCheckbox(spell)));
  mageSpells.forEach((spell) => mageList.appendChild(makeSpellCheckbox(spell)));
}

function applyLevelFilter(spells, mins, level) {
  if (!level) return spells;
  if (mins === '1') return spells.filter((spell) => spell.level <= level);
  if (mins === '2') return spells.filter((spell) => spell.level >= level);
  return spells.filter((spell) => spell.level === level);
}

function applyListingFilter(spells, listing) {
  if (!listing) return spells;
  if (listing === 'All') return spells.filter((spell) => spell.class === 'Cleric' || spell.class === 'Mage');
  if (listing === 'Cleric') return spells.filter((spell) => spell.class === 'Cleric');
  if (listing === 'Magic-User') return spells.filter((spell) => spell.class === 'Mage');
  if (listing === 'Elf') return spells.filter((spell) => spell.class === 'Mage' && spell.level < 6);
  return spells;
}

function sortSpells(spells, sortMode) {
  const sorted = [...spells];
  sorted.sort((left, right) => {
    if (sortMode === '2') {
      return left.class.localeCompare(right.class) || left.name.localeCompare(right.name);
    }
    if (sortMode === '3') {
      return left.class.localeCompare(right.class) || left.level - right.level || left.name.localeCompare(right.name);
    }
    if (sortMode === '4') {
      return left.level - right.level || left.name.localeCompare(right.name);
    }
    if (sortMode === '5') {
      return left.level - right.level || left.class.localeCompare(right.class) || left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });
  return sorted;
}

function selectedSpellIds() {
  const formData = new FormData(form);
  const ids = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('spell_')) {
      ids.push(Number(value));
    }
  }
  return new Set(ids);
}

function renderResult(result) {
  output.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'spellbook-summary';
  summary.textContent = `Rendered ${result.payload.spells.length} spell(s) · sort mode ${result.config.sort} · listing ${result.config.listing || 'specific selection'}`;
  output.appendChild(summary);

  if (!result.payload.spells.length) {
    output.innerHTML += '<em>No spells matched current criteria.</em>';
    return;
  }

  result.payload.spells.forEach((spell) => {
    const card = document.createElement('article');
    card.className = 'spell-card';

    const name = document.createElement('div');
    name.className = 'spell-name';
    name.textContent = spell.name;

    const meta = document.createElement('div');
    meta.className = 'spell-meta';
    const displayClass = spell.class === 'Cleric' ? 'Cleric' : 'Magic-User/Elf';
    meta.textContent = `Class: ${displayClass} · Level: ${spell.level} · Duration: ${spell.duration} · Range: ${spell.range}`;

    const text = document.createElement('div');
    text.textContent = spell.text;

    card.appendChild(name);
    card.appendChild(meta);
    card.appendChild(text);
    output.appendChild(card);
  });

  const note = document.createElement('div');
  note.className = 'small text-muted mt-2';
  note.textContent = 'Data source: db-json-export/lablord_spells.json (read-only).';
  output.appendChild(note);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const sort = formData.get('sort')?.toString() || '1';
  const extra = formData.get('extra') === '1';
  const listing = formData.get('listing')?.toString() || '';
  const mins = formData.get('mins')?.toString() || '0';
  const levelRaw = Number(formData.get('level') || 0);
  const level = levelRaw > 0 ? levelRaw : null;
  const seed = formData.get('seed')?.toString().trim() || null;

  let spells = [...spellData];
  if (listing) {
    spells = applyListingFilter(spells, listing);
    spells = applyLevelFilter(spells, mins, level);
  } else {
    const selected = selectedSpellIds();
    spells = spells.filter((spell) => selected.has(spell.id));
  }

  spells = sortSpells(spells, sort);

  if (extra) {
    spells = spells.map((spell) => ({
      ...spell,
      text: `${spell.text}${spell.ref ? ' [Reference included]' : ''}`
    }));
  }

  lastResult = {
    tool: toolId,
    generatedAt: window.WizardawnCore.nowISO(),
    seed,
    config: {
      sort,
      extra,
      listing,
      mins,
      level
    },
    payload: {
      spells
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
Spells: ${lastResult.payload.spells.length}
Sort: ${lastResult.config.sort}
Listing: ${lastResult.config.listing || 'specific selection'}

~~~json
${JSON.stringify(lastResult, null, 2)}
~~~`;
  window.WizardawnCore.exportMarkdown(`${toolId}-output.md`, markdown);
});

exportHtmlButton.addEventListener('click', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${toolId} output</title></head><body><pre>${JSON.stringify(lastResult, null, 2).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</pre></body></html>`;
  window.WizardawnCore.exportHTML(`${toolId}-output.html`, html);
});

loadSpellData().catch((error) => {
  output.innerHTML = `<div class="alert alert-danger">Failed to load spell data: ${error.message}</div>`;
});
