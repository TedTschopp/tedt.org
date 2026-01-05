import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IGNORE = [
  /\.min\.js$/i,
  /bootstrap\.bundle\.min\.js$/i,
  /webmention\.min\.js$/i,
];

const ROOTS = [
  'js',
  'mastodon',
  'tools',
  'sw.js',
];

function isIgnored(path) {
  return IGNORE.some((re) => re.test(path));
}

function hasJekyllFrontMatter(path) {
  // Jekyll allows front matter in any file to enable Liquid processing.
  // Those sources are not valid JavaScript until rendered by Jekyll.
  try {
    const head = readFileSync(path, { encoding: 'utf8' }).slice(0, 2048);
    return head.startsWith('---\n') || head.startsWith('---\r\n');
  } catch {
    return false;
  }
}

function walk(path, out) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const entry of readdirSync(path)) {
      walk(join(path, entry), out);
    }
    return;
  }
  if (!st.isFile()) return;
  if (!path.endsWith('.js') && !path.endsWith('.mjs')) return;
  if (isIgnored(path)) return;
  if (hasJekyllFrontMatter(path)) return;
  out.push(path);
}

const files = [];
for (const root of ROOTS) {
  try {
    walk(root, files);
  } catch {
    // ignore missing roots
  }
}

let failures = 0;
for (const file of files) {
  const r = spawnSync(process.platform === 'win32' ? 'node.exe' : 'node', ['--check', file], {
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    failures += 1;
    process.stderr.write(`\n[JS SYNTAX ERROR] ${file}\n`);
    if (r.stdout) process.stderr.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
  }
}

console.log(`Checked ${files.length} JS files; failures=${failures}`);
process.exit(failures === 0 ? 0 : 1);
