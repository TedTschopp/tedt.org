import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  PLAYWRIGHT_ALLURE: '1'
};

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['playwright', 'test', 'tests/a11y'],
  {
    stdio: 'inherit',
    env
  }
);

process.exit(result.status ?? 1);
