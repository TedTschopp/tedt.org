import { spawn } from 'child_process';
import * as http from 'http';

async function waitForServer(url: string, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const attempt = () => {
      http.get(url, res => {
        if (res.statusCode && res.statusCode < 500) resolve();
        else if (Date.now() - start > timeoutMs) reject(new Error('Server did not become ready in time'));
        else setTimeout(attempt, 1000);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Server did not become ready in time'));
        else setTimeout(attempt, 1000);
      });
    };
    attempt();
  });
}

export default async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4000';
  if (process.env.NO_JEKYLL) return;
  const proc = spawn('bundle', ['exec', 'jekyll', 'serve', '--quiet', '--port', '4000'], {
    stdio: 'inherit',
    env: { ...process.env, JEKYLL_ENV: 'production' }
  });
  (global as any).__JEKYLL_PROC__ = proc;
  await waitForServer(base);
}
