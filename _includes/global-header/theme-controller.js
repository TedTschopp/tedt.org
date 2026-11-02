(function () {
  'use strict';
  if (window.TedTTheme) return;
  var root = document.documentElement;
  var key = 'tedt-appearance';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function normalize(value) {
    return value === 'system' || value === 'light dark' ? 'auto' :
      ['light', 'auto', 'dark'].indexOf(value) !== -1 ? value : null;
  }
  function cookie() {
    try {
      var match = document.cookie.match(/(?:^|;\s*)tedt-appearance=([^;]*)/);
      return match ? normalize(decodeURIComponent(match[1])) : null;
    } catch (_) { return null; }
  }
  function stored() {
    var keys = ['color-scheme', 'ai-tedt-theme', 'tools-theme', 'yia-theme', 'theme'];
    for (var i = 0; i < keys.length; i++) {
      try { var value = normalize(localStorage.getItem(keys[i])); if (value) return value; }
      catch (_) { /* Storage is optional. */ }
    }
    return 'auto';
  }
  var preference = cookie() || stored();
  function persist() {
    try {
      var domain = /(^|\.)tedt\.org$/.test(location.hostname) ? '; Domain=tedt.org' : '';
      document.cookie = key + '=' + preference + domain + '; Path=/; Max-Age=31536000; Secure; SameSite=Lax';
      localStorage.setItem('color-scheme', preference);
    } catch (_) { /* Keep the in-memory preference when persistence is blocked. */ }
  }
  function apply() {
    var resolved = preference === 'auto' ? (media.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.bsTheme = resolved;
    root.dataset.colorScheme = preference;
    root.dataset.themePreference = preference === 'auto' ? 'system' : preference;
    root.style.colorScheme = resolved;
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = preference === 'auto' ? 'light dark' : resolved;
    window.dispatchEvent(new CustomEvent('tedt:theme-change', {
      detail: { preference: preference, resolved: resolved }
    }));
    return preference;
  }
  function set(value) { preference = normalize(value) || 'auto'; persist(); return apply(); }
  function refresh() { preference = cookie() || preference; return apply(); }
  window.TedTTheme = { get: function () { return preference; }, set: set, refresh: refresh,
    resolved: function () { return root.dataset.theme; } };
  // Preserve the public site's existing theme API for local controls and tools.
  window.__TedColorScheme = { STORAGE_KEY: 'color-scheme', get: window.TedTTheme.get,
    set: set, refreshAuto: refresh };
  if (media.addEventListener) media.addEventListener('change', apply);
  else media.addListener(apply);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  window.addEventListener('storage', function (event) { if (event.key === 'color-scheme') refresh(); });
  persist();
  apply();
}());
