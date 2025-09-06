---
layout: null
permalink: /sw.js
---
/*
  Service Worker for hero media caching (auto-generated via Liquid & Jekyll)
  - Builds hero asset list from _data/homepage_heroes.yml automatically
  - Version hash changes when the hero list changes (cache bust)
  - Cache-first strategy (ideal for large immutable media)
  - To add/remove heroes: add media files + update _data/homepage_heroes.yml (no sw.js edit needed)
*/

// --- BUILD-TIME INJECTION (Liquid -> static JS) ---
// We derive an ordered array of hero base names from the YAML data file.
// Each item must have a corresponding .webp and .mp4 in the hero folder.
const HERO_FOLDER = '/img/categories/home-hero-images';
const HERO_MEDIA = [
  {% for h in site.data.homepage_heroes %}'{{ h.base | strip }}'{% unless forloop.last %}, {% endunless %}{% endfor %}
];

// Generate a simple version hash from the concatenated list (small heuristic to bust cache when list changes)
const SW_VERSION = 'v3-hero-cache-' + (function(list){
  try { return btoa(list.join('|')).replace(/=+$/,'').slice(0,16); } catch(_){ return Date.now().toString(36);} 
})(HERO_MEDIA);
const HERO_CACHE = 'hero-media-cache-' + SW_VERSION;

const PRECACHE_URLS = HERO_MEDIA.flatMap(base => [
  `${HERO_FOLDER}/${base}.webp`,
  `${HERO_FOLDER}/${base}.mp4`
]);

// Helper: add immutable caching headers (cannot modify actual network response headers here, but
// keeping logic for potential future Workbox migration / documentation.)
function putIntoCache(cache, request, response) {
  return cache.put(request, response);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(HERO_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => !k.startsWith('hero-media-cache-') || k !== HERO_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Cache-first strategy for hero media (immutable assets). Falls back to network if missing.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith(`${HERO_FOLDER}/hero-`) && /\.(webp|mp4)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(resp => {
          // Only cache successful (status 200) responses.
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(HERO_CACHE).then(cache => putIntoCache(cache, event.request, clone));
          }
            return resp;
        }).catch(() => cached); // If network fails and we have something cached, return it.
      })
    );
  }
});
