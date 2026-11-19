import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const path = '_data/folklore/migration.json';
if (existsSync(path)) {
  const migration = JSON.parse(readFileSync(path));
  if (migration.version !== 1 || migration.origin !== 'https://folklore.tschopp.org' || !migration.routes['/folklore/']) throw new Error('Invalid folklore migration configuration');
  const homepage = readFileSync('_site/folklore/index.html', 'utf8');
  if (!homepage.includes('content="0; url=https://folklore.tschopp.org/"')) throw new Error('Migration configured without its built homepage redirect');
  console.log('Folklore search is independently built at https://folklore.tschopp.org/search/.');
} else {
  const result = spawnSync('node_modules/.bin/pagefind', ['--site', '_site', '--glob', 'folklore/stories/*/index.html', '--output-subdir', 'folklore/pagefind'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
