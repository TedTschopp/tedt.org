import { randomInt } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SHORT_CODE, SHORT_LINK_ORIGIN, destinationUrl, targetPath } from './links.mjs';

const REGISTRY = '_data/short_links.json';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function checkCode(code) {
  if (typeof code !== 'string' || code.length !== 8 || !SHORT_CODE.test(code)) {
    throw new Error('A short code must contain eight lowercase letters or digits.');
  }
}

function loadRegistry() {
  const records = JSON.parse(readFileSync(REGISTRY, 'utf8'));
  if (!Array.isArray(records)) throw new Error('The short link registry must be an array.');

  const links = new Map();
  for (const { code, url } of records) {
    checkCode(code);
    if (links.has(code)) throw new Error(`Duplicate short code: ${code}`);
    try {
      links.set(code, destinationUrl(url));
    } catch (error) {
      throw new Error(`${code}: ${error.message}`);
    }
  }
  return links;
}

function addLink(links, destination, code) {
  const url = destinationUrl(destination?.trim());
  if (code) {
    checkCode(code);
    if (links.has(code) && links.get(code) !== url) throw new Error(`Code ${code} is already in use.`);
  } else {
    for (const [existingCode, existingUrl] of links) {
      if (existingUrl === url) return existingCode;
    }
    do {
      code = Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
    } while (links.has(code));
  }

  if (!links.has(code)) {
    links.set(code, url);
    const records = [...links].map(([code, url]) => `  ${JSON.stringify({ code, url })}`);
    writeFileSync(REGISTRY, `[\n${records.join(',\n')}\n]\n`);
  }
  return code;
}

function redirectPage(url) {
  const destination = url.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>Continue to the destination</title>
  <link rel="canonical" href="${destination}">
  <meta http-equiv="refresh" content="0; url=${destination}">
</head>
<body>
  <main>
    <h1>Continue to the destination</h1>
    <p><a href="${destination}">${destination}</a></p>
  </main>
</body>
</html>
`;
}

function writePage(site, path, content) {
  const file = join(site, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, { flag: 'wx' });
}

try {
  const [command, value, code] = process.argv.slice(2);
  const links = loadRegistry();
  if (command === 'add') {
    const shortCode = addLink(links, value, code);
    console.log(`${SHORT_LINK_ORIGIN}/s/${shortCode}`);
  } else if (command === 'build' && value) {
    for (const [code, url] of links) {
      writePage(value, `s/${code}/index.html`, redirectPage(url));
      writePage(value, targetPath(code), `${JSON.stringify(url)}\n`);
    }
    console.log(`Built ${links.size} short links.`);
  } else {
    throw new Error('Usage: node _code/short-links/cli.mjs add <url> [code] | build <site-directory>');
  }
} catch (error) {
  console.error(`Short links: ${error.message}`);
  process.exitCode = 1;
}
