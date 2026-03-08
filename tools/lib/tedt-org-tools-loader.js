(function () {
  if (document.querySelector('link[data-tedt-org-tools-css="true"]')) {
    return;
  }

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-tedt-org-tools-css', 'true');

  if (location.protocol === 'file:') {
    link.href = 'file://' + location.pathname.split('/tools/')[0] + '/tools/lib/tedt-org-tools-local.css';
  } else {
    link.href = '/tools/lib/tedt-org-tools.css';
  }

  document.head.appendChild(link);
})();