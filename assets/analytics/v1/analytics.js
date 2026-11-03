---
layout: null
---
/* Shared browser analytics v1. Configuration is built by tedt.org; consumers embed this URL. */
(function () {
  'use strict';
  var settings = {{ site.analytics | jsonify }};
  var w = window, d = document, embed = d.currentScript;
  var host = w.location.hostname.toLowerCase();
  if (w.__TedTAnalyticsV1 || !settings.enabled || w.location.protocol !== 'https:' ||
      !(host === 'tedt.org' || host.endsWith('.tedt.org'))) return;
  var blockedPath = /^\/(?:auth|api|mcp|payments?|checkout|billing|callback|logout)(?:\/|$)/i;
  var sensitiveQuery = /^(?:code|state|token|access_token|refresh_token|id_token|session|secret|api_key|key)$/i;
  var current = new URL(w.location.href);
  if (blockedPath.test(current.pathname) || Array.from(current.searchParams.keys()).some(function (key) { return sensitiveQuery.test(key); })) return;
  var masked = (embed && embed.dataset.privacy === 'masked') ||
    /^(?:member(?:-preview)?|tools|evals|plotto|islands|randomtables|random-constellations|spieldose)\.tedt\.org$/.test(host) ||
    /^\/(?:tools|RPG|inside-ai|game-theory|math-guide)(?:\/|$)/i.test(current.pathname);
  w.__TedTAnalyticsV1 = { version: '1.0.0', masked: masked };

  // Apply the privacy boundary before loading a vendor SDK, including future DOM content.
  function maskContent() {
    d.documentElement.setAttribute('data-clarity-mask', 'true');
    d.querySelectorAll('[data-clarity-unmask]').forEach(function (node) { node.removeAttribute('data-clarity-unmask'); });
  }
  if (masked) {
    maskContent();
    new MutationObserver(function (records) {
      if (records.some(function (record) { return record.type === 'childList' || record.attributeName === 'data-clarity-unmask'; })) maskContent();
    }).observe(d.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-clarity-unmask'] });
  }
  function urlForAnalytics(value, privateMode) {
    try {
      var url = new URL(value, w.location.href);
      if (privateMode) return url.origin + url.pathname;
      Array.from(url.searchParams.keys()).forEach(function (key) { if (sensitiveQuery.test(key)) url.searchParams.delete(key); });
      url.hash = '';
      return url.href;
    } catch (_) { return ''; }
  }
  function load(src, attributes) {
    var script = d.createElement('script');
    script.async = true; script.src = src;
    Object.keys(attributes || {}).forEach(function (key) { script.setAttribute(key, attributes[key]); });
    script.onerror = function () { /* Analytics failure must never block the page. */ };
    d.head.appendChild(script);
  }
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  var ga = settings.ga4 || {}, clarity = settings.clarity || {}, cf = settings.cloudflare || {};
  function event(name, parameters) {
    if (ga.measurement_id) w.gtag('event', name, Object.assign({ send_to: ga.measurement_id }, parameters));
  }
  var lastPage;
  function pageView() {
    if (blockedPath.test(w.location.pathname)) return;
    var location = urlForAnalytics(w.location.href, masked);
    if (lastPage === location) return;
    lastPage = location;
    event('page_view', { page_location: location,
      page_title: masked ? 'Private workspace' : d.title,
      page_referrer: d.referrer ? urlForAnalytics(d.referrer, true) : '' });
  }
  if (ga.measurement_id && settings.provider === 'ga4') {
    w.gtag('js', new Date());
    w.gtag('config', ga.measurement_id, { send_page_view: false, anonymize_ip: true,
      allow_google_signals: false, allow_ad_personalization_signals: false, transport_type: 'beacon',
      page_location: urlForAnalytics(w.location.href, masked), page_title: masked ? 'Private workspace' : d.title,
      page_referrer: d.referrer ? urlForAnalytics(d.referrer, true) : '' });
    pageView();
    if (!d.querySelector('script[src*="googletagmanager.com/gtag/js"]')) load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga.measurement_id));
  }
  if (clarity.enabled && clarity.project_id && !d.querySelector('script[src*="clarity.ms/tag/"]')) {
    w.clarity = w.clarity || function () { (w.clarity.q = w.clarity.q || []).push(arguments); };
    load('https://www.clarity.ms/tag/' + encodeURIComponent(clarity.project_id));
  }
  // A deferred embed sees Cloudflare's server-injected tag before creating a manual one.
  if (cf.enabled && cf.token && !d.querySelector('script[data-cf-beacon],script[src*="static.cloudflareinsights.com/beacon.min.js"]')) {
    load('https://static.cloudflareinsights.com/beacon.min.js', { 'data-cf-beacon': JSON.stringify({ token: cf.token, spa: true }) });
  }
  d.addEventListener('click', function (e) {
    var target = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!target) return;
    var href = target.getAttribute('href');
    if (!href || /^(?:#|mailto:|tel:|javascript:)/i.test(href)) return;
    if (/^(?:data:|blob:)/i.test(href)) {
      if (ga.track_file_downloads && target.hasAttribute('download')) event('file_download', { link_domain: host });
      return;
    }
    var url;
    try { url = new URL(href, w.location.href); } catch (_) { return; }
    if (blockedPath.test(url.pathname) || Array.from(url.searchParams.keys()).some(function (key) { return sensitiveQuery.test(key); })) return;
    var download = target.hasAttribute('download') || /\.(?:pdf|zip|csv|tsv|json|xml|txt|docx?|xlsx?|pptx?|epub|mp3|mp4|webm)$/i.test(url.pathname);
    if (ga.track_file_downloads && download) {
      var name = url.pathname.split('/').pop() || '';
      event('file_download', Object.assign({ link_domain: url.hostname }, masked ? {} : {
        file_name: name, file_extension: name.includes('.') ? name.split('.').pop().toLowerCase() : '', link_url: urlForAnalytics(url.href, false)
      }));
    } else if (ga.track_outbound_links && url.origin !== w.location.origin) {
      event('outbound_click', Object.assign({ link_domain: url.hostname }, masked ? {} : {
        link_url: urlForAnalytics(url.href, false), link_text: (target.textContent || '').trim().slice(0, 120)
      }));
    }
  }, true);
  function search(input, hint) {
    if (masked || !ga.track_search || !input) return;
    var term = (input.value || '').trim();
    if (!term || input.dataset.analyticsLastSearch === term) return;
    input.dataset.analyticsLastSearch = term;
    event('search', { search_term: term.slice(0, 100), search_location: hint || w.location.pathname });
  }
  d.addEventListener('submit', function (e) {
    if (e.target instanceof HTMLFormElement) search(e.target.querySelector('input[type="search"],input[name="q"],input[name="query"],input[name="search"],input[name*="search"]'), w.location.pathname);
  }, true);
  d.addEventListener('change', function (e) {
    if (e.target instanceof HTMLInputElement && e.target.type === 'search') search(e.target, e.target.id || e.target.name);
  }, true);
  ['pushState', 'replaceState'].forEach(function (method) {
    var original = w.history[method];
    w.history[method] = function () { var result = original.apply(this, arguments); w.setTimeout(pageView, 0); return result; };
  });
  w.addEventListener('popstate', pageView);
})();
