---
layout: null
permalink: /assets/global-header/v1/header.js
---
{% include global-header/theme-controller.js %}
(function () {
  'use strict';
  if (customElements.get('tedt-global-header')) return;
  var navigation = {{ site.data.site_navigation | jsonify }};
  var sites = {{ site.data.header_sites | jsonify }};
  var assetRoot = new URL('.', document.currentScript.src).href;
  function element(tag, attributes, text) {
    var node = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function isCurrent(href) {
    var url = new URL(href, location.href);
    return url.origin === location.origin && url.pathname === location.pathname && (!url.hash || url.hash === location.hash);
  }
  class TedTGlobalHeader extends HTMLElement {
    connectedCallback() {
      if (this._initialized || window.top !== window.self) {
        if (window.top !== window.self) this.hidden = true;
        return;
      }
      this._initialized = true;
      document.documentElement.dataset.tedtGlobalHeader = 'true';
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.append(element('slot'));
      var stylesheet = element('link', { rel: 'stylesheet', href: assetRoot + 'header.css' });
      stylesheet.addEventListener('load', () => this.render());
      shadow.append(stylesheet);
      // Keep the light-DOM fallback until the stylesheet loads successfully.
    }
    render() {
      var shadow = this.shadowRoot;
      var site = sites.find(item => item.host === location.hostname || item.key === this.getAttribute('site'));
      var active = this.getAttribute('section') || (site && site.section) || '';
      var bar = element('nav', { class: 'bar', 'aria-label': 'Primary' });
      var brand = element('a', { class: 'brand', href: 'https://tedt.org/', rel: 'me' });
      brand.append(element('img', { src: assetRoot + 'logo.svg', width: '48', height: '48', alt: 'Ted Tschopp home' }));
      bar.append(brand);
      var toggle = element('button', { type: 'button', class: 'toggle', 'aria-label': 'Toggle navigation', 'aria-controls': 'global-navigation', 'aria-expanded': 'false' }, '☰');
      bar.append(toggle);
      var panel = element('div', { id: 'global-navigation', class: 'panel' });
      var list = element('ul', { class: 'sections' });
      navigation.forEach(section => {
        var item = element('li', { class: 'section' });
        var link = element('a', { class: 'section-link', href: section.url }, section.title);
        if (active === section.key) link.dataset.active = 'true';
        if (isCurrent(section.url)) link.setAttribute('aria-current', 'page');
        item.append(link);
        var disclosure = element('button', { type: 'button', class: 'disclosure', 'aria-label': 'Show ' + section.title + ' menu', 'aria-expanded': 'false', 'aria-controls': section.key + '-links' });
        disclosure.append(element('span', { 'aria-hidden': 'true' }, '▾'));
        item.append(disclosure);
        var children = element('ul', { class: 'children', id: section.key + '-links', hidden: '' });
        [{ title: section.title + ' Overview', url: section.url }].concat(section.children || []).forEach(child => {
          var row = element('li');
          var anchor = element('a', { href: child.url }, child.title);
          if (isCurrent(child.url)) anchor.setAttribute('aria-current', 'page');
          row.append(anchor); children.append(row);
        });
        disclosure.addEventListener('click', () => {
          var open = disclosure.getAttribute('aria-expanded') !== 'true';
          this.closeMenus(); disclosure.setAttribute('aria-expanded', String(open)); children.hidden = !open;
        });
        item.append(children); list.append(item);
      });
      panel.append(list);
      var theme = element('div', { class: 'theme', role: 'group', 'aria-label': 'Color scheme' });
      [['light', 'Light', '☀'], ['auto', 'System', '◐'], ['dark', 'Dark', '☾']].forEach(choice => {
        var button = element('button', { type: 'button', 'aria-label': choice[1], title: choice[1], 'data-preference': choice[0], 'aria-pressed': 'false' }, choice[2]);
        button.addEventListener('click', () => window.TedTTheme.set(choice[0])); theme.append(button);
      });
      panel.append(theme); bar.append(panel); shadow.querySelector('slot').replaceWith(bar);
      this.dataset.ready = 'true';
      var desktop = matchMedia('(min-width: 1200px)');
      var closePanel = () => { panel.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); this.closeMenus(); };
      toggle.addEventListener('click', () => {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        closePanel(); panel.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open));
      });
      shadow.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        var expanded = shadow.querySelector('.disclosure[aria-expanded="true"]');
        if (expanded) { this.closeMenus(); expanded.focus(); }
        else if (!desktop.matches && toggle.getAttribute('aria-expanded') === 'true') { closePanel(); toggle.focus(); }
      });
      shadow.addEventListener('click', event => { if (event.target.closest('a')) closePanel(); });
      this._outside = event => { if (!event.composedPath().includes(this)) closePanel(); };
      document.addEventListener('click', this._outside);
      shadow.addEventListener('focusout', () => { queueMicrotask(() => { if (!shadow.activeElement) this.closeMenus(); }); });
      this._viewport = closePanel; desktop.addEventListener('change', this._viewport); this._desktop = desktop;
      this._theme = () => theme.querySelectorAll('button').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.preference === window.TedTTheme.get()));
      });
      window.addEventListener('tedt:theme-change', this._theme); this._theme();
    }
    closeMenus() {
      this.shadowRoot.querySelectorAll('.disclosure').forEach(button => button.setAttribute('aria-expanded', 'false'));
      this.shadowRoot.querySelectorAll('.children').forEach(menu => { menu.hidden = true; });
    }
    disconnectedCallback() {
      document.removeEventListener('click', this._outside); window.removeEventListener('tedt:theme-change', this._theme);
      if (this._desktop) this._desktop.removeEventListener('change', this._viewport);
    }
  }
  customElements.define('tedt-global-header', TedTGlobalHeader);
}());
