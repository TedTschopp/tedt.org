/* Compatibility bridge for older pages. New builds use the shared v1 embed. */
(function () {
  if (window.__TedTAnalyticsV1 || document.querySelector('script[data-tedt-analytics="v1"]')) return;
  var script = document.createElement('script');
  script.src = 'https://tedt.org/assets/analytics/v1/analytics.js';
  script.defer = true;
  script.dataset.tedtAnalytics = 'v1';
  script.dataset.privacy = 'standard';
  document.head.appendChild(script);
})();
