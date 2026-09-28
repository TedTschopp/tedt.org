import {mkdir,copyFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../../../inside-ai/assets/',import.meta.url));
await mkdir(out+'runtime',{recursive:true});
const source=new URL('../node_modules/onnxruntime-web/dist/',import.meta.url);
for(const name of await readdir(source))if(/^ort-wasm-simd-threaded\.(mjs|wasm)$/.test(name))await copyFile(new URL(name,source),out+'runtime/'+name);
