export const DAY = 86_400_000;
export const HOUR = 3_600_000;

export function parseTime(value) {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? time : null;
}

export function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function publicOrigin(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Enter a valid HTTPS Mastodon server.'); }
  const host = url.hostname;
  if (!httpsUrl(value) || (url.port && url.port !== '443') || !host.includes('.') ||
      host.includes(':') || /^\d+(\.\d+){3}$/.test(host) ||
      /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host)) {
    throw new Error('Use a public Mastodon domain over HTTPS, such as mastodon.social.');
  }
  return url.origin;
}

export function textLength(text) {
  const plain = String(text || '').replace(/https?:\/\/\S+/g, '').trim();
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(plain)).length;
  }
  return Array.from(plain).length;
}

// A detached template is inert: even embedded images do not make requests.
// No API-supplied HTML, images, scripts, or links are inserted into the page.
export function htmlText(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html || '');
  const fragment = template.content;
  fragment.querySelectorAll('script, style, iframe, object, img, video, audio, source').forEach(node => node.remove());
  fragment.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
  fragment.querySelectorAll('p, div, blockquote, li').forEach(node => node.append('\n'));
  return (fragment.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
}

export function createClient(signal) {
  let requests = 0;
  async function get(value) {
    signal.throwIfAborted();
    const url = httpsUrl(value);
    if (!url) throw new Error('The API endpoint must use HTTPS.');
    const controller = new AbortController();
    const abort = () => controller.abort(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(() => controller.abort(new Error('The server took too long to respond. Try again.')), 20_000);
    requests++;
    try {
      const response = await fetch(url, {
        signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        let detail = '';
        try {
          const body = await response.json();
          detail = String(body.message || body.error || '').slice(0, 180);
        } catch { /* Some servers return an HTML error. */ }
        const messages = {
          401: 'This server requires authentication for this public API. Try the account’s home server.',
          403: 'This server does not allow this public API request.',
          404: 'The account or public post was not found on this server.',
          429: 'The server’s request limit was reached. Wait before checking again.',
        };
        const error = new Error(messages[response.status] || `The public API returned HTTP ${response.status}${detail ? `: ${detail}` : '.'}`);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      signal.throwIfAborted();
      if (controller.signal.aborted) throw controller.signal.reason;
      if (error instanceof TypeError) {
        throw new Error('The public API could not be reached. The server may be offline or may block browser access (CORS). Try again or use the account’s home server.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    }
  }
  return { get, get requests() { return requests; } };
}

export async function mapConcurrent(items, work, signal, concurrency = 3) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      signal.throwIfAborted();
      const index = next++;
      await work(items[index], index);
    }
  }));
}
