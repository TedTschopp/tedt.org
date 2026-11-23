import { SHORT_LINK_ORIGIN, SHORT_PATH, destinationUrl, targetPath } from './links.mjs';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.hostname === 'tedt.org' && SHORT_PATH.exec(url.pathname);
    if (!match || !['GET', 'HEAD'].includes(request.method)) return fetch(request);

    // Fetch the published destination outside this Worker's route.
    const target = new URL(targetPath(match[1]), SHORT_LINK_ORIGIN);
    try {
      const entry = await fetch(target, {
        redirect: 'manual',
        cf: { cacheTtlByStatus: { '200-299': 60, '300-599': -1 } },
      });
      if (entry.ok) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: destinationUrl(await entry.json()),
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex',
          },
        });
      }
    } catch {
      // GitHub Pages can still serve the browser redirect if the lookup fails.
    }
    return fetch(request);
  },
};
