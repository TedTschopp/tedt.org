(() => {
  'use strict';
  const section = document.querySelector('[data-patreon-membership]');
  if (!section) return;
  const status = section.querySelector('[data-membership-status]');
  const root = section.querySelector('[data-membership-tiers]');
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  (async () => {
    try {
      const response = await fetch(section.dataset.apiUrl, { credentials: 'omit', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Membership options are temporarily unavailable. Please try again shortly.');
      const data = await response.json();
      for (const tier of data.tiers) {
        if (!tier.published || tier.amount_cents <= 0) continue;
        const column = element('div', undefined, 'col-12 col-md-6 col-xl-4');
        const card = element('article', undefined, 'card h-100');
        const body = element('div', undefined, 'card-body');
        body.append(element('h3', tier.title, 'h4'));
        body.append(element('p', new Intl.NumberFormat(undefined, { style: 'currency', currency: data.campaign.currency }).format(tier.amount_cents / 100), 'lead'));
        if (tier.description) body.append(element('p', tier.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()));
        const destination = new URL(tier.url);
        if (destination.protocol !== 'https:' || !['patreon.com', 'www.patreon.com'].includes(destination.hostname)) throw new Error('The membership link could not be verified.');
        const link = element('a', 'View Membership on Patreon', 'btn btn-primary');
        link.href = destination.href;
        link.rel = 'noreferrer';
        body.append(link);
        card.append(body);
        column.append(card);
        root.append(column);
      }
      status.textContent = data.stale ? 'These options are being refreshed. Check Patreon for the latest details.' : root.children.length ? 'Choose a membership on Patreon, then sign in to the member library.' : 'No paid membership options are currently available.';
    } catch (error) { root.replaceChildren(); status.textContent = error.message; }
  })();
})();
