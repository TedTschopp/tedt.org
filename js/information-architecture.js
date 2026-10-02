(() => {
  'use strict';
  const skip = document.querySelector('.ia-skip-link');
  if (skip) {
    const main = document.querySelector('main');
    if (main && !document.getElementById('main-content')) {
      main.id = 'main-content';
      main.tabIndex = -1;
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.ia-navbar a');
    const collapse = document.getElementById('navbarNavDarkDropdown');
    if (link && collapse?.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    }
  });
})();
