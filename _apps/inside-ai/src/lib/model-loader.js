export const MODEL_MANIFEST = 'https://tedtschopp.github.io/inside-ai-models/gpt2-bfe50afba10b9b56/manifest.json';
export const MODEL_CACHE = 'tedt-inside-ai-gpt2-bfe50afba10b9b56-v1';
export const MODEL_BYTES = 656662664;
const HASH = /^[a-f0-9]{64}$/;
export function validateManifest(m) {
  if(m.schemaVersion!==1 || m.format!=='onnx' || m.totalBytes!==MODEL_BYTES || m.sha256!=='ccf64e934094054603c5b7bd98191f0fd2ea0315a81e9e0d8104070f64413119' || m.files?.length!==63)throw new Error('Unexpected model manifest.');
  let bytes=0;
  for(let i=0;i<m.files.length;i++){const f=m.files[i];if(f.path!==`gpt2.onnx.part${i}`||!Number.isInteger(f.bytes)||f.bytes<=0||f.bytes>10485760||!HASH.test(f.sha256))throw new Error('Invalid model chunk manifest.');bytes+=f.bytes;}
  if(bytes!==m.totalBytes)throw new Error('Model size does not match manifest.');
  return m;
}
export async function verifiedBytes(response,file,subtle=crypto.subtle) {
  if(!response.ok)throw new Error(`Download failed (${response.status}).`);
  const data=await response.arrayBuffer();
  if(data.byteLength!==file.bytes)throw new Error(`Size check failed for ${file.path}.`);
  const hash=Array.from(new Uint8Array(await subtle.digest('SHA-256',data)),b=>b.toString(16).padStart(2,'0')).join('');
  if(hash!==file.sha256)throw new Error(`Integrity check failed for ${file.path}. Retry the download.`);
  return new Uint8Array(data);
}
export async function loadModel({signal,onProgress=()=>{},fetcher=fetch,cacheStorage=globalThis.caches,manifestUrl=MODEL_MANIFEST,manifestValidator=validateManifest}={}) {
  const response=await fetcher(manifestUrl,{signal,cache:'no-cache'});
  if(!response.ok)throw new Error(`Model manifest unavailable (${response.status}).`);
  const manifest=manifestValidator(await response.json());
  let cache=null,cacheAvailable=true;
  try {cache=await cacheStorage?.open(MODEL_CACHE);if(!cache)cacheAvailable=false;}catch{cacheAvailable=false;}
  const merged=new Uint8Array(manifest.totalBytes);
  let offset=0;
  for(const file of manifest.files) {
    signal?.throwIfAborted();
    const url=new URL(file.path,manifestUrl).href;
    let data,cached;
    try {cached=await cache?.match(url);}catch{cacheAvailable=false;}
    if(cached){try{data=await verifiedBytes(cached,file);}catch{try{await cache?.delete(url);}catch{} }}
    if(!data) {
      const network=await fetcher(url,{signal,cache:'no-cache'});
      data=await verifiedBytes(network,file);
      signal?.throwIfAborted();
      if(cache)try{await cache.put(url,new Response(data,{headers:{'Content-Type':'application/octet-stream'}}));}catch{cache=null;cacheAvailable=false;}
    }
    merged.set(data,offset);offset+=data.byteLength;
    onProgress({loaded:offset,total:manifest.totalBytes,cacheAvailable});
  }
  signal?.throwIfAborted();
  // Every chunk is authenticated above; checking the assembled artifact also detects ordering mistakes.
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',merged)),b=>b.toString(16).padStart(2,'0')).join('');
  if(digest!==manifest.sha256)throw new Error('Assembled model integrity check failed.');
  return {bytes:merged,cacheAvailable};
}
