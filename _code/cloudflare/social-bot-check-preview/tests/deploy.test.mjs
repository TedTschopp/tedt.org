import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { test } from 'node:test';
import { ACCOUNT, WORKER, deploy, uploadedVersion } from '../scripts/deploy.mjs';

const VERSION = '975b9fec-49ac-4f5f-97aa-f8d16e89ca7a';
const ENV = { CLOUDFLARE_API_TOKEN: 'test-only-token', CLOUDFLARE_ACCOUNT_ID: ACCOUNT, GITHUB_SHA: 'a'.repeat(40) };
const RECORD = { type: 'version-upload', version: 1, worker_name: WORKER, version_id: VERSION };

test('only the identified version of this Worker can be promoted', () => {
  assert.equal(uploadedVersion(JSON.stringify(RECORD)), VERSION);
  for (const records of [
    [{ ...RECORD, worker_name: 'another-worker' }],
    [{ ...RECORD, version_id: null }],
    [{ ...RECORD, version_id: `${VERSION}; arbitrary-command` }],
    [{ ...RECORD, worker_name_overridden: true }],
    [{ ...RECORD, version: 2 }],
    [RECORD, RECORD],
    [],
  ]) assert.throws(() => uploadedVersion(records.map(record => JSON.stringify(record)).join('\n')));
  assert.throws(() => uploadedVersion('not JSON'));
});

test('missing credentials, the wrong account or an untested commit cannot start an upload', () => {
  for (const env of [
    { ...ENV, CLOUDFLARE_API_TOKEN: '' },
    { ...ENV, CLOUDFLARE_ACCOUNT_ID: 'another-account' },
    { ...ENV, GITHUB_SHA: 'main' },
  ]) {
    assert.throws(() => deploy({ env, run() { assert.fail('no deployment command may run'); } }));
  }
});

test('dry validation uses no credential and cannot activate a version', () => {
  const calls = [];
  assert.equal(deploy({ dryRun: true, env: {}, run(args) { calls.push(args); } }), null);
  assert.deepEqual(calls, [['versions', 'upload', '--name', WORKER, '--dry-run']]);
});

test('a failed or unidentified upload leaves the active version untouched', () => {
  for (const failure of ['upload', 'metadata']) {
    const calls = [];
    assert.throws(() => deploy({ env: ENV, run(args, env) {
      calls.push(args);
      if (failure === 'upload') throw new Error('Fixture upload failure');
      writeFileSync(env.WRANGLER_OUTPUT_FILE_PATH, JSON.stringify({ ...RECORD, worker_name: 'another-worker' }));
    } }));
    assert.equal(calls.length, 1, 'an unsafe upload must never be promoted');
  }
});

test('successful deployment promotes the uploaded version at 100 percent without editing routes', () => {
  const calls = [];
  const result = deploy({ env: ENV, run(args, env) {
    calls.push(args);
    assert.equal(env.CLOUDFLARE_API_TOKEN, ENV.CLOUDFLARE_API_TOKEN);
    assert.ok(!args.includes(ENV.CLOUDFLARE_API_TOKEN), 'credentials stay out of command arguments');
    if (args[1] === 'upload') writeFileSync(env.WRANGLER_OUTPUT_FILE_PATH, JSON.stringify(RECORD) + '\n');
  } });
  assert.equal(result, VERSION);
  assert.deepEqual(calls.map(args => args.slice(0, 3)), [
    ['versions', 'upload', '--name'], ['versions', 'deploy', `${VERSION}@100%`],
  ]);
  assert.ok(calls[1].includes('--yes'));
  assert.ok(calls.every(args => !args.includes('triggers')));
});

test('a failed promotion cannot be reported as a successful release', () => {
  let calls = 0;
  assert.throws(() => deploy({ env: ENV, run(args, env) {
    calls++;
    if (args[1] === 'upload') writeFileSync(env.WRANGLER_OUTPUT_FILE_PATH, JSON.stringify(RECORD));
    else throw new Error('Fixture promotion failure');
  } }), /promotion failure/);
  assert.equal(calls, 2);
});
