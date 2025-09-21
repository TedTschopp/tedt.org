export default async function globalTeardown() {
  const proc = (global as any).__JEKYLL_PROC__;
  if (proc) {
    try { proc.kill('SIGINT'); } catch {}
  }
}
