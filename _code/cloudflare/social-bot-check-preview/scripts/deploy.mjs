import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const WORKER = 'tedt-social-bot-check-preview';
export const ACCOUNT = '13ebf849f1787412dc2c48a262de0407';
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const WRANGLER = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));

export function uploadedVersion(output) {
  const records = output.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  const uploads = records.filter(record => record.type === 'version-upload');
  if (uploads.length !== 1 || uploads[0].version !== 1 ||
      uploads[0].worker_name !== WORKER || !UUID.test(uploads[0].version_id || '') ||
      uploads[0].worker_name_overridden) {
    throw new Error('Wrangler did not identify exactly one version of the intended preview Worker.');
  }
  return uploads[0].version_id;
}

function command(args, env) {
  const result = spawnSync(process.execPath, [WRANGLER, ...args], {
    cwd: ROOT, env, stdio: 'inherit', shell: false,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Wrangler ${args.slice(0, 2).join(' ')} failed.`);
  }
}

export function deploy({ dryRun = false, env = process.env, run = command } = {}) {
  if (!dryRun) {
    if (!env.CLOUDFLARE_API_TOKEN?.trim()) {
      throw new Error('Add CLOUDFLARE_API_TOKEN to the social-bot-check-preview GitHub environment first.');
    }
    if (env.CLOUDFLARE_ACCOUNT_ID !== ACCOUNT) {
      throw new Error('Deployment must use the existing tedt.org Cloudflare account.');
    }
    if (!/^[a-f0-9]{40}$/.test(env.GITHUB_SHA || '')) {
      throw new Error('Deployment must identify the tested GitHub commit.');
    }
  }
  const directory = mkdtempSync(join(tmpdir(), 'tedt-preview-deploy-'));
  const output = join(directory, 'upload.jsonl');
  const childEnv = {
    ...env,
    CI: 'true',
    WRANGLER_SEND_METRICS: 'false',
    WRANGLER_LOG_SANITIZE: 'true',
    WRANGLER_LOG_PATH: join(ROOT, '.wrangler', 'wrangler-ci.log'),
    WRANGLER_OUTPUT_FILE_PATH: output,
  };
  try {
    const upload = ['versions', 'upload', '--name', WORKER];
    if (dryRun) {
      run([...upload, '--dry-run'], childEnv);
      return null;
    }
    const message = `GitHub ${env.GITHUB_SHA}`;
    run([...upload, '--message', message], childEnv);
    // Read Wrangler's deliberate deployment output, never its login credentials.
    const version = uploadedVersion(readFileSync(output, 'utf8'));
    // Version promotion preserves the route and its fail-open setting.
    run(['versions', 'deploy', `${version}@100%`, '--name', WORKER, '--yes', '--message', message], childEnv);
    if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `version_id=${version}\n`);
    return version;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--dry-run')) throw new Error('Only --dry-run is supported.');
    const version = deploy({ dryRun: args.includes('--dry-run') });
    console.log(version ? `Deployed ${WORKER} version ${version}.` : 'Validated version upload without publishing.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
