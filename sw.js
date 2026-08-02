---
layout: null
permalink: /sw.js
---
/*
  Homepage hero-media service worker (generated via Liquid & Jekyll)
  - Registered only by the homepage
  - Does not precache hero assets; it caches only media the homepage requests
  - Uses cache-first behavior for those requested hero assets
  - Ignores every fetch whose referrer is not the same-origin homepage

  A root scope is technically required to control `/`. The referrer guard in
  the fetch handler keeps this root-scoped worker inert for every other page.
*/

// --- BUILD-TIME INJECTION (Liquid -> static JS) ---
// We derive an ordered array of hero base names from the YAML data file.
// Each item must have a corresponding .webp and .mp4 in the hero folder.
const HERO_FOLDER = '/img/categories/home-hero-images';
const HERO_MEDIA = [
  {% for h in site.data.homepage_heroes %}'{{ h.base | strip }}'{% unless forloop.last %}, {% endunless %}{% endfor %}
];

// The v4 namespace ensures activation retires the old install-time precache.
// The list hash also rotates the on-demand cache when the configured heroes change.
const SW_VERSION = 'v4-homepage-on-demand-' + (function(list){
  try { return btoa(list.join('|')).replace(/=+$/,'').slice(0,16); } catch(_){ return Date.now().toString(36);} 
})(HERO_MEDIA);
const HERO_CACHE_PREFIX = 'hero-media-cache-';
const HERO_CACHE = HERO_CACHE_PREFIX + SW_VERSION;

const HERO_PATHS = new Set(HERO_MEDIA.flatMap(base => [
  `${HERO_FOLDER}/${base}.webp`,
  `${HERO_FOLDER}/${base}.mp4`
]).map(path => new URL(path, self.location.origin).pathname));

function isHomepageMediaRequest(request, url) {
  if (request.method !== 'GET' || url.origin !== self.location.origin || !HERO_PATHS.has(url.pathname)) {
    return false;
  }

  // Same-origin subresource requests retain the full referrer path. Checking it
  // synchronously lets non-homepage requests bypass respondWith altogether.
  if (!request.referrer) return false;

  try {
    const referrer = new URL(request.referrer);
    return referrer.origin === self.location.origin && referrer.pathname === '/';
  } catch (_) {
    return false;
  }
}

self.addEventListener('install', (event) => {
  // Intentionally no install-time media download.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith(HERO_CACHE_PREFIX) && key !== HERO_CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Cache-first only for hero media initiated by the homepage. All other requests
// return without respondWith, so the browser handles them normally.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!isHomepageMediaRequest(event.request, url)) return;

  event.respondWith(
    caches.open(HERO_CACHE).then(cache =>
      cache.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request).then(response => {
          // Cache complete successful responses. Partial (206) media responses
          // cannot be stored safely by the Cache API.
          if (response.status === 200) {
            cache.put(event.request, response.clone()).catch(() => undefined);
          }
          return response;
        });
      })
    )
  );
});
