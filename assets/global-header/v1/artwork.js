/* Keep native picture sources in step with the site's resolved shared theme. */
(function () {
  'use strict';
  function updateArtwork() {
    var theme = document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-bs-theme');
    var dark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.querySelectorAll('picture[data-tedt-artwork] source[data-tedt-dark]').forEach(function (source) {
      var media = dark ? 'all' : 'not all';
      if (source.media !== media) source.media = media;
    });
  }
  window.addEventListener('tedt:theme-change', updateArtwork);
  window.addEventListener('pageshow', updateArtwork);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateArtwork, { once: true });
  else updateArtwork();
}());
