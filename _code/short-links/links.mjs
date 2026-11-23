export const SHORT_LINK_ORIGIN = 'https://tedt.org';
export const SHORT_CODE = /^[a-z0-9]{8}$/;
export const SHORT_PATH = /^\/s\/([a-z0-9]{8})\/?$/;

const SITE_HOST = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*(?:tedt|tschopp)\.org$/;

export function targetPath(code) {
  return `/assets/short-links/${code}.json`;
}

export function destinationUrl(value) {
  if (typeof value !== 'string' || !/^https:\/\/[^/\\?#\s]/i.test(value) ||
      /[\u0000-\u001f\u007f\\]/.test(value)) {
    throw new Error('Enter a full HTTPS URL on tedt.org or tschopp.org.');
  }

  const url = new URL(value);
  if (url.username || url.password || url.port || !SITE_HOST.test(url.hostname)) {
    throw new Error('Use a tedt.org or tschopp.org host with standard HTTPS.');
  }

  const path = url.pathname.replace(/%73/gi, 's').replace(/%2f|%5c/gi, '/');
  if (['tedt.org', 'www.tedt.org'].includes(url.hostname) && /^\/+s(?:\/|$)/i.test(path)) {
    throw new Error('Enter the full destination instead of a TedT.org short link.');
  }
  return url.href;
}
