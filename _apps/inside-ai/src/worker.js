import * as ort from 'onnxruntime-web/wasm';
import {loadModel} from './lib/model-loader.js';
import {validateContext} from './lib/tokenizer.js';
ort.env.wasm.numThreads=1;
ort.env.wasm.proxy=false;
ort.env.wasm.wasmPaths=new URL('/inside-ai/assets/runtime/',self.location.origin).href;
ort.env.logLevel='error';
let session=null,controller=null,running=false;
const send=(type,payload={})=>self.postMessage({type,...payload});
self.onmessage=async({data})=>{
  if(data.type==='cancel'){controller?.abort();return;}
  try {
    if(data.type==='load') {
      if(session){send('ready');return;}
      controller=new AbortController();
      const result=await loadModel({signal:controller.signal,onProgress:p=>send('progress',p)});
      send('initializing',{cacheAvailable:result.cacheAvailable});
      session=await ort.InferenceSession.create(result.bytes,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
      if(controller.signal.aborted){await session.release();session=null;send('cancelled');return;}
      send('ready',{cacheAvailable:result.cacheAvailable});
    }
    if(data.type==='infer') {
      if(!session)throw new Error('Enable the live model first.');
      if(running)throw new Error('Wait for the current prediction.');
      validateContext(data.ids);running=true;
      const input=new ort.Tensor('int64',BigInt64Array.from(data.ids,BigInt),[1,data.ids.length]);
      const outputs=await session.run({input});
      const linear=outputs.linear_output;
      if(!linear||linear.data.length!==50257)throw new Error('Unexpected prediction shape.');
      const logits=Array.from(linear.data), attention={};
      for(const [name,tensor] of Object.entries(outputs)) {
        if(/^block_\d+_attn_head_\d+_attn(?:_scaled|_masked|_softmax|_dropout)?$/.test(name)) {
          const n=data.ids.length;
          if(tensor.data.length!==n*n)throw new Error('Unexpected attention shape.');
          const values=Array.from(tensor.data);
          if(/_softmax$|_dropout$/.test(name)){
            for(let row=0;row<n;row++){const weights=values.slice(row*n,(row+1)*n);if(weights.some(v=>!Number.isFinite(v)||v<0||v>1.00001)||Math.abs(weights.reduce((s,v)=>s+v,0)-1)>0.0001)throw new Error('Invalid attention probabilities.');}
          }
          attention[name]={data:Array.from({length:n},(_,row)=>values.slice(row*n,(row+1)*n))};
        }
      }
      if(Object.keys(attention).length!==720)throw new Error('The model is missing its attention outputs.');
      send('result',{requestId:data.requestId,ids:data.ids,logits,outputs:attention});
      input.dispose();Object.values(outputs).forEach(t=>t.dispose());running=false;
    }
  } catch(error) {running=false;send(error.name==='AbortError'?'cancelled':'error',{message:error.message,requestId:data.requestId});}
};
