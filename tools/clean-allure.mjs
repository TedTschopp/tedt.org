import { rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Best practice: generate Allure report from a clean results directory per run.
// We keep .gitkeep files so the folders exist in the repo.

const allureResults = join('reports', 'allure', 'allure-results');
const allureLatest = join('reports', 'allure', 'latest');

rmSync(allureResults, { recursive: true, force: true });
rmSync(allureLatest, { recursive: true, force: true });

mkdirSync(allureResults, { recursive: true });
mkdirSync(allureLatest, { recursive: true });

writeFileSync(join(allureResults, '.gitkeep'), '', 'utf8');
writeFileSync(join(allureLatest, '.gitkeep'), '', 'utf8');

console.log('Cleaned Allure directories:', allureResults, allureLatest);
