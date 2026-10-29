import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(process.env.HEADER_TEST_BUILD || '_site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  try {
    let file = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.global-header.config.mjs', ...process.argv.slice(2)], {
    stdio: 'inherit', env: { ...process.env, HEADER_TEST_BUILD: root, HEADER_TEST_URL: `http://127.0.0.1:${server.address().port}` }
  });
  process.exitCode = await new Promise((resolve, reject) => { child.once('exit', code => resolve(code ?? 1)); child.once('error', reject); });
} finally { server.closeAllConnections(); server.close(); }
