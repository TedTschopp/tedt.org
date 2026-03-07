const toolId = 'osric_spells';
const form = document.getElementById('tool-form');
const output = document.getElementById('output');
const exportJsonButton = document.getElementById('export-json');
const exportMdButton = document.getElementById('export-md');
const exportHtmlButton = document.getElementById('export-html');
const clericList = document.getElementById('cleric-list');
const druidList = document.getElementById('druid-list');
const illusionistList = document.getElementById('illusionist-list');
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
  spellData = await window.WizardawnData.getOsricSpells();
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

function sortByName(spells) {
  return [...spells].sort((left, right) => left.name.localeCompare(right.name));
}

function renderSpellSelectors() {
  clericList.innerHTML = '';
  druidList.innerHTML = '';
  illusionistList.innerHTML = '';
  mageList.innerHTML = '';

  sortByName(spellData.filter((spell) => spell.mage === 'Cleric')).forEach((spell) => clericList.appendChild(makeSpellCheckbox(spell)));
  sortByName(spellData.filter((spell) => spell.mage === 'Druid')).forEach((spell) => druidList.appendChild(makeSpellCheckbox(spell)));
  sortByName(spellData.filter((spell) => spell.mage === 'Illusionist')).forEach((spell) => illusionistList.appendChild(makeSpellCheckbox(spell)));
  sortByName(spellData.filter((spell) => spell.mage === 'Magic-User')).forEach((spell) => mageList.appendChild(makeSpellCheckbox(spell)));
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

function applyLevelFilter(spells, mins, level) {
  if (!level) return spells;
  if (mins === '1') return spells.filter((spell) => spell.level <= level);
  if (mins === '2') return spells.filter((spell) => spell.level >= level);
  return spells.filter((spell) => spell.level === level);
}

function applyListingFilter(spells, listing) {
  if (!listing) return spells;
  if (listing === 'All') return spells;

  const byMage = spells.filter((spell) => spell.mage === listing);
  if (byMage.length) return byMage;

  const byType = spells.filter((spell) => spell.type === listing);
  if (byType.length) return byType;

  return spells.filter((spell) => String(spell.school || '').toLowerCase().includes(listing.toLowerCase()));
}

function sortSpells(spells, sortMode) {
  const sorted = [...spells];
  sorted.sort((left, right) => {
    if (sortMode === '2') {
      return left.mage.localeCompare(right.mage) || left.name.localeCompare(right.name);
    }
    if (sortMode === '3') {
      return left.mage.localeCompare(right.mage) || left.level - right.level || left.name.localeCompare(right.name);
    }
    if (sortMode === '4') {
      return left.level - right.level || left.name.localeCompare(right.name);
    }
    if (sortMode === '5') {
      return left.level - right.level || left.mage.localeCompare(right.mage) || left.name.localeCompare(right.name);
    }
    return left.name.localeCompare(right.name);
  });
  return sorted;
}

function escapeHtml(text) {
  return String(text).replace(/[<>&]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[character]));
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
    name.textContent = `${spell.name}${spell.reverse ? ' (Reversible)' : ''}`;

    const subtitle = document.createElement('div');
    subtitle.className = 'spell-subtitle';
    subtitle.textContent = `${spell.type} · ${spell.variant || 'Core'}`;

    const meta = document.createElement('div');
    meta.className = 'spell-meta';
    meta.textContent = `Class: ${spell.mage} ${spell.level} · School: ${spell.school || 'Various'}`;

    const stats = document.createElement('div');
    stats.className = 'spell-stats';
    stats.innerHTML = `
      <div><strong>Area:</strong> ${escapeHtml(spell.area || 'n/a')}</div>
      <div><strong>Components:</strong> ${escapeHtml(spell.components || 'n/a')}</div>
      <div><strong>Range:</strong> ${escapeHtml(spell.range || 'n/a')}</div>
      <div><strong>Casting:</strong> ${escapeHtml(spell.casting || 'n/a')}</div>
      <div><strong>Duration:</strong> ${escapeHtml(spell.duration || 'n/a')}</div>
      <div><strong>Saving Throw:</strong> ${escapeHtml(spell.save || 'n/a')}</div>
    `;

    const text = document.createElement('div');
    text.className = 'spell-description';
    text.textContent = spell.description || '';

    card.appendChild(name);
    card.appendChild(subtitle);
    card.appendChild(meta);
    card.appendChild(stats);
    card.appendChild(text);

    if (result.config.extra && spell.refs) {
      const reference = spellData.find((candidate) => candidate.id === spell.refs);
      if (reference) {
        const refBox = document.createElement('div');
        refBox.className = 'spell-reference';
        refBox.innerHTML = `<strong>SPELL REFERENCE:</strong> ${escapeHtml(reference.description || reference.name)}`;
        card.appendChild(refBox);
      }
    }

    output.appendChild(card);
  });

  const note = document.createElement('div');
  note.className = 'small text-muted mt-2';
  note.textContent = 'Data source: db-json-export/osric_spells.json (read-only).';
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
