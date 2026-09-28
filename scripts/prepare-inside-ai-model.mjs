// Prepare the real, immutable model once for browser tests; never place it in _site.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const base = 'https://tedtschopp.github.io/inside-ai-models/gpt2-bfe50afba10b9b56/';
const directory = resolve(process.env.INSIDE_AI_MODEL_FIXTURES || 'tmp/inside-ai-model-fixtures');
await mkdir(directory, { recursive: true });
const response = await fetch(new URL('manifest.json', base));
if (!response.ok) throw new Error(`Model manifest returned ${response.status}`);
const manifest = await response.json();
if (manifest.id !== 'gpt2-bfe50afba10b9b56' || manifest.files.length !== 63 || manifest.totalBytes !== 656662664) throw new Error('Unexpected model manifest');
await writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest));
const digest = data => createHash('sha256').update(data).digest('hex');
const valid = (data, file) => data.length === file.bytes && digest(data) === file.sha256;
let cursor = 0;
async function download() {
  while (cursor < manifest.files.length) {
    const file = manifest.files[cursor++];
    if (!/^gpt2[.]onnx[.]part[0-9]+$/.test(file.path)) throw new Error('Invalid model filename');
    const target = join(directory, file.path);
    try { if (valid(await readFile(target), file)) continue; } catch {}
    const part = await fetch(new URL(file.path, base));
    if (!part.ok) throw new Error(`${file.path} returned ${part.status}`);
    const data = Buffer.from(await part.arrayBuffer());
    if (!valid(data, file)) throw new Error(`Integrity failure: ${file.path}`);
    await writeFile(target, data);
  }
}
await Promise.all(Array.from({ length: 4 }, download));
const complete = createHash('sha256');
for (const file of manifest.files) complete.update(await readFile(join(directory, file.path)));
if (complete.digest('hex') !== manifest.sha256) throw new Error('Full model integrity failure');
console.log(`Verified ${manifest.files.length} model files (${manifest.totalBytes} bytes).`);
