(() => {
  'use strict';
  const form = document.getElementById('tool-filters');
  if (!form) return;
  const input = document.getElementById('tool-search');
  const status = document.getElementById('tool-status');
  const cards = [...document.querySelectorAll('.ia-tool-card')];
  function filter() {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const matches = terms.every(term => card.textContent.toLocaleLowerCase().includes(term)) && (!status.value || card.dataset.toolStatus === status.value);
      card.hidden = !matches;
      if (matches) count++;
    }
    for (const section of document.querySelectorAll('.ia-tool-section')) {
      section.hidden = ![...section.querySelectorAll('.ia-tool-card')].some(card => !card.hidden);
    }
    document.getElementById('tool-count').textContent = count + ' of ' + cards.length + ' tools shown.';
    document.getElementById('tools-empty').hidden = count !== 0;
  }
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  input.addEventListener('input', filter);
  status.addEventListener('change', filter);
  filter();
})();
