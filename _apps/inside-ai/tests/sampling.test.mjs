import test from 'node:test';
import assert from 'node:assert/strict';
import {distribution,sample} from '../src/lib/sampling.js';
const sum=a=>a.reduce((s,x)=>s+x.probability,0);
test('top-p uses all vocabulary, not the first 50 display candidates',()=>{
 const d=distribution(Array(100).fill(0),1,{type:'top-p',value:.9});
 assert.equal(d.filter(x=>x.probability>0).length,90);assert.ok(Math.abs(sum(d)-1)<1e-12);
 assert.ok(sample(d,()=>.99).rank>50);assert.equal(d[0].topPProbability,.01);
});
test('top-k filtering occurs after stable full-vocabulary softmax',()=>{
 const d=distribution([1000,999,998,997],1,{type:'top-k',value:2});
 assert.equal(d.length,4);assert.equal(d.filter(x=>x.probability>0).length,2);assert.ok(Math.abs(sum(d)-1)<1e-12);assert.ok(d[0].topPProbability<d[0].probability);
 assert.equal(sample(d,()=>0).tokenId,0);assert.equal(sample(d,()=>.999).tokenId,1);
});
test('temperature flattens distribution and invalid controls fail clearly',()=>{
 const cold=distribution([3,1],.1,{type:'top-k',value:2});const hot=distribution([3,1],2,{type:'top-k',value:2});assert.ok(cold[0].probability>hot[0].probability);
 for(const t of [0,-1,NaN,Infinity])assert.throws(()=>distribution([1],t));
 assert.throws(()=>distribution([1],1,{type:'top-k',value:0}));assert.throws(()=>distribution([1],1,{type:'top-p',value:1.1}));assert.throws(()=>distribution([NaN],1));
});
test('top-p=1 and oversized k retain the complete vocabulary',()=>{
 for(const sampling of [{type:'top-p',value:1},{type:'top-k',value:100}])assert.equal(distribution([1,2,3],1,sampling).filter(x=>x.probability>0).length,3);
});
