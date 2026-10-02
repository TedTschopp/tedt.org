(() => {
  'use strict';
  const form = document.getElementById('site-search');
  if (!form) return;
  const input = document.getElementById('site-query');
  const type = document.getElementById('site-type');
  const results = document.getElementById('search-results');
  const count = document.getElementById('search-count');
  let indexPromise;
  let revision = 0;
  let timer;
  async function search() {
    const run = ++revision;
    const query = input.value.trim();
    results.replaceChildren();
    const url = new URL(location.href);
    query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!query) { count.textContent = 'Enter a word or phrase to search.'; return; }
    count.textContent = 'Searching…';
    try {
      indexPromise ||= fetch(form.dataset.index).then(response => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      }).catch(error => { indexPromise = null; throw error; });
      const items = await indexPromise;
      if (run !== revision) return;
      const terms = query.toLocaleLowerCase().split(/\s+/);
      const matches = items.filter(item => (!type.value || item.type === type.value) && terms.every(term => (item.title + ' ' + item.summary + ' ' + item.subjects).toLocaleLowerCase().includes(term)));
      matches.sort((a, b) => Number(b.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) - Number(a.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
      count.textContent = matches.length ? matches.length + ' results' + (matches.length > 40 ? '; showing the first 40. Narrow the search to see more.' : '.') : 'No results. Try another phrase or collection.';
      for (const item of matches.slice(0, 40)) {
        const li = document.createElement('li');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        heading.append(link);
        const paragraph = document.createElement('p');
        paragraph.textContent = item.summary;
        li.append(heading, paragraph);
        results.append(li);
      }
    } catch {
      if (run === revision) count.textContent = 'Search could not load. Try again or browse the Site Directory.';
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); search(); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(search, 180); });
  type.addEventListener('change', search);
  input.value = new URLSearchParams(location.search).get('q') || '';
  if (input.value) search();
})();
