(() => {
'use strict';
// Sample once on load. Nothing rotates or changes while a reader uses the page.
function pickStories(stories, count = 3, random = Math.random) {
  const pool = [...new Map(stories.map(story => [story.id, story])).values()];
  const limit = Math.min(count, pool.length);
  for (let index = 0; index < limit; index += 1) {
    const next = index + Math.floor(random() * (pool.length - index));
    [pool[index], pool[next]] = [pool[next], pool[index]];
  }
  return pool.slice(0, limit);
}

function mountFeaturedFolklore(document) {
  const section = document.querySelector('[data-featured-folklore]');
  const data = document.getElementById('featured-folklore-data');
  if (!section || !data || section.dataset.featuredInitialized) return;
  let stories;
  try { stories = JSON.parse(data.textContent).stories; } catch { return; }
  if (!Array.isArray(stories) || stories.length < 3) return;
  const chosen = pickStories(stories);
  if (chosen.length !== 3) return;
  section.querySelectorAll('[data-featured-story]').forEach((card, index) => {
    const story = chosen[index];
    const link = card.querySelector('[data-featured-link]');
    const image = card.querySelector('[data-featured-image]');
    const teaser = card.querySelector('[data-featured-teaser]');
    card.dataset.storyId = story.id;
    link.href = story.url;
    link.textContent = story.title;
    teaser.textContent = story.teaser;
    image.alt = story.image.alt;
    image.srcset = story.image.srcset;
    image.src = story.image.src;
  });
  section.dataset.featuredInitialized = 'true';
}

if (typeof document !== 'undefined') mountFeaturedFolklore(document);

if (typeof module !== 'undefined' && module.exports) module.exports = { pickStories, mountFeaturedFolklore };
})();
