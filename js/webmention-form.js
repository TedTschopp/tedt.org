/* Progressive enhancement; the native POST form works without this script. */
(() => {
  'use strict';
  for (const form of document.querySelectorAll('[data-webmention-form]')) {
    if (form.dataset.enhanced || !window.fetch || !window.AbortController || !window.URLSearchParams) continue;
    form.dataset.enhanced = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[role="status"]');
      button.disabled = true;
      status.textContent = 'Submitting your Webmention…';
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new URLSearchParams(new FormData(form)),
          credentials: 'omit',
          redirect: 'error',
          signal: controller.signal,
        });
        status.textContent = response.ok
          ? 'Queued for verification and moderation. Approved responses appear after the next refresh.'
          : 'The receiver did not accept this request. Check that your public page links to this article and try again.';
      } catch {
        status.replaceChildren(document.createTextNode('Submission status could not be confirmed. '));
        const link = document.createElement('a');
        link.href = form.action;
        link.textContent = 'Open the receiver’s submission form.';
        status.append(link);
      } finally {
        window.clearTimeout(timeout);
        button.disabled = false;
      }
    });
  }
})();
