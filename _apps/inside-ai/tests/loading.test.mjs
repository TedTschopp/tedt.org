import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifiedBytes,validateManifest,loadModel,MODEL_CACHE} from '../src/lib/model-loader.js';
const hash=data=>createHash('sha256').update(data).digest('hex');
const chunks=[new Uint8Array([1,2]),new Uint8Array([3,4])];
const manifest={files:chunks.map((b,i)=>({path:`part${i}`,bytes:b.length,sha256:hash(b)})),totalBytes:4,sha256:hash(new Uint8Array([1,2,3,4]))};
const manifestUrl='https://models.example/version/manifest.json';
const fetcher=async url=>url.endsWith('manifest.json')?new Response(JSON.stringify(manifest)):new Response(chunks[Number(url.slice(-1))]);
const opts={fetcher,manifestUrl,manifestValidator:m=>m};
test('missing, corrupt and truncated chunks fail before inference',async()=>{
 await assert.rejects(verifiedBytes(new Response('missing',{status:404}),manifest.files[0]),/Download failed/);
 await assert.rejects(verifiedBytes(new Response(new Uint8Array([1])),manifest.files[0]),/Size check/);
 await assert.rejects(verifiedBytes(new Response(new Uint8Array([1,9])),manifest.files[0]),/Integrity check/);
 assert.throws(()=>validateManifest(manifest),/Unexpected/);
});
test('unavailable or full storage still permits a validated in-memory model',async()=>{
 for(const cacheStorage of [{open:async()=>{throw Error('denied');}},{open:async()=>({match:async()=>undefined,put:async()=>{throw Error('quota');}})}]){
 const progress=[];const result=await loadModel({...opts,cacheStorage,onProgress:p=>progress.push(p)});
 assert.deepEqual(result.bytes,new Uint8Array([1,2,3,4]));assert.equal(result.cacheAvailable,false);assert.equal(progress.at(-1).loaded,4);
 }
});
test('corrupt cached chunks are discarded and fetched again',async()=>{
 const deleted=[],opened=[];let requests=0;
 const cacheStorage={open:async name=>{opened.push(name);return {match:async()=>new Response(new Uint8Array([9,9])),delete:async url=>deleted.push(url),put:async()=>{}};}};
 const result=await loadModel({...opts,cacheStorage,fetcher:async url=>{requests++;return fetcher(url);}});
 assert.deepEqual(result.bytes,new Uint8Array([1,2,3,4]));assert.equal(requests,3);assert.equal(deleted.length,2);assert.deepEqual(opened,[MODEL_CACHE]);
});
test('cancellation stops before the next chunk and interrupted fetches reject',async()=>{
 const controller=new AbortController();let progress=0;
 await assert.rejects(loadModel({...opts,cacheStorage:undefined,signal:controller.signal,onProgress:()=>{progress++;controller.abort();}}),{name:'AbortError'});assert.equal(progress,1);
 await assert.rejects(loadModel({...opts,fetcher:async()=>{throw new TypeError('offline');}}),/offline/);
});
