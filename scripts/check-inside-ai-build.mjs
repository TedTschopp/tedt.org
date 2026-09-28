import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const directory = 'inside-ai/assets';
function snapshot(path = directory, result = {}) {
  for (const item of readdirSync(path, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const file = join(path, item.name);
    if (item.isDirectory()) snapshot(file, result);
    else result[relative(directory, file)] = createHash('sha256').update(readFileSync(file)).digest('hex');
  }
  return result;
}
const before = snapshot();
const build = spawnSync('npm', ['--prefix', '_apps/inside-ai', 'run', 'build'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);
const after = snapshot();
if (JSON.stringify(before) !== JSON.stringify(after)) {
  console.error('Inside AI generated assets are stale. Build the app and commit its generated assets.');
  process.exit(1);
}
console.log('Inside AI generated assets match a fresh build.');
