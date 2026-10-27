<script>
  import {onMount,onDestroy,tick,setContext} from 'svelte';
  import {writable,derived} from 'svelte/store';
  import Diagram from './Diagram.svelte';
  import Katex from './utils/Katex.svelte';
  import {tokens,tokenIds,modelData,predictedToken,temperature,sampling,blockIdx,blockIdxTemp,attentionHeadIdx,attentionHeadIdxTemp,expandedBlock,isFetchingModel,isModelRunning,isLoaded,weightPopover} from './store';
  import {ex0} from './constants/examples/ex0';
  import {GPT2Tokenizer,validateContext,CONTEXT_LIMIT,tokenIdsForPrompt} from './lib/tokenizer.js';
  import {distribution,sample} from './lib/sampling.js';
  import {MODEL_CACHE} from './lib/model-loader.js';
  import {outputRows,OUTPUT_ROW_LIMITS,DEFAULT_OUTPUT_ROW_LIMIT} from './lib/output-rows.js';
  import {textPages} from './utils/textbookPages';
  import {gsap} from './utils/gsap';
  const examples=[ex0,{prompt:'Artificial Intelligence is transforming the'},{prompt:'As the spaceship was approaching the'},{prompt:'On the deserted planet they discovered a'},{prompt:'IEEE VIS conference highlights the'}];
  const exampleLoaders=[null,()=>import('./constants/examples/ex1'),()=>import('./constants/examples/ex2'),()=>import('./constants/examples/ex3'),()=>import('./constants/examples/ex4')];
  let exampleIndex=0, currentResult=ex0, prompt=ex0.prompt, tokenizer=null, worker=null;
  let status='Recorded examples are ready. The live model has not been downloaded.',phase='examples',mode='recorded',error='',busy=false,loadedBytes=0,totalBytes=656662664;
  let cacheNote='',requestId=0,pendingGenerate=false,selectedStage='attn_softmax',queryRow=ex0.tokens.length-1,dialog,activeTopic=null,returnFocus=null;
  let localTokenIds=ex0.tokenIds,full=[],candidates=[],sampled=null,stale=false;
  const diagramRowLimit=writable(DEFAULT_OUTPUT_ROW_LIMIT);
  const visibleOutput=derived([modelData,diagramRowLimit],([$modelData,$diagramRowLimit])=>outputRows($modelData?.probabilities||[],$diagramRowLimit));
  setContext('diagram-output',{rowLimit:diagramRowLimit,visibleOutput});
  $: if(tokenizer && currentResult) {
    full=distribution(currentResult.logits,$temperature,$sampling);
    candidates=full.slice(0,50).map(item=>({...item,token:tokenizer.decode([item.tokenId])}));
    sampled=sample(full);sampled={...sampled,token:tokenizer.decode([sampled.tokenId])};
    modelData.set({...currentResult,probabilities:candidates,sampled});predictedToken.set(sampled);
  }
  $: if(tokenizer) {localTokenIds=tokenIdsForPrompt(tokenizer,prompt,currentResult.tokenIds);stale=localTokenIds.join(',')!==currentResult.tokenIds.join(',');}
  $: matrix=currentResult.outputs?.[`block_${$blockIdx}_attn_head_${$attentionHeadIdx}_${selectedStage}`]?.data || [];
  $: queryRow=Math.min(queryRow,currentResult.tokens.length-1);
  $: selectedWeights=matrix[queryRow]||[];
  $: retained=full.filter(x=>x.probability>0).length;
  $: shownMass=candidates.reduce((sum,x)=>sum+x.probability,0);
  const percent=value=>Number.isFinite(value)?(100*value).toFixed(2)+'%':'—';
  const valueText=value=>value===null||value===-Infinity?'−∞ (masked)':Number.isFinite(value)?value.toFixed(5):'—';
  const shownToken=value=>value.replace(/ /g,'·').replace(/\n/g,'↵').replace(/\t/g,'⇥') || '[end of text]';

  onMount(async()=>{
    isLoaded.set(true);isFetchingModel.set(false);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.globalTimeline.timeScale(1000);
    try {
      const response=await fetch('/inside-ai/assets/tokenizer/tokenizer.json');
      if(!response.ok)throw new Error('Tokenizer could not load. Reload this page to try again.');
      tokenizer=new GPT2Tokenizer(await response.json());
    }catch(e){error=e.message;}
    window.addEventListener('insideai:explain',explainEvent);
  });
  onDestroy(()=>{worker?.terminate();window.removeEventListener('insideai:explain',explainEvent);});
  function setResult(result,newMode) {
    currentResult=result;mode=newMode;tokens.set(result.tokens);tokenIds.set(result.tokenIds);queryRow=result.tokens.length-1;
  }
  async function chooseExample() {
    requestId++;pendingGenerate=false;busy=true;isModelRunning.set(false);error='';
    try{if(!examples[exampleIndex].tokenIds)examples[exampleIndex]=(await exampleLoaders[exampleIndex]())['ex'+exampleIndex];}catch{error='This recorded example could not load. Try again when the page is connected.';busy=false;return;}
    busy=false;prompt=examples[exampleIndex].prompt;setResult(examples[exampleIndex],'recorded');expandedBlock.set({id:null});
    if(phase==='ready')status='Live model is ready. Recorded example selected; inspect the prompt or generate to use live results.';
  }
  function reset() {temperature.set(0.8);sampling.set({type:'top-k',value:5});blockIdxTemp.set(0);attentionHeadIdxTemp.set(0);blockIdx.set(0);attentionHeadIdx.set(0);chooseExample();}
  function setSamplingMode(event){sampling.set({type:event.target.value,value:event.target.value==='top-k'?5:0.9});}
  function setSamplingValue(event){sampling.set({...$sampling,value:Number(event.target.value)});}
  function enableModel() {
    if(['loading','initializing','ready'].includes(phase))return;
    phase='loading';loadedBytes=0;error='';status='Downloading the live model. You can cancel and keep exploring the examples.';
    worker?.terminate();worker=new Worker(new URL('./worker.js',import.meta.url),{type:'module'});
    const activeWorker=worker;
    worker.onmessage=({data})=>{
      if(worker!==activeWorker)return;
      if(data.type==='progress'){loadedBytes=data.loaded;totalBytes=data.total;cacheNote=data.cacheAvailable?'Validated chunks are cached in this browser.':'Browser storage is unavailable or full. This session still works; a later visit may download again.';}
      if(data.type==='initializing'){phase='initializing';status='Download verified. Preparing GPT-2 in your browser…';}
      if(data.type==='ready'){phase='ready';status='Live model ready. Prompts stay in this browser.';runPrompt();}
      if(data.type==='cancelled'){phase='examples';status='Download cancelled. Recorded examples are ready.';}
      if(data.type==='error'){
        if(data.requestId && data.requestId!==requestId)return;
        error=data.message;busy=false;isModelRunning.set(false);pendingGenerate=false;
        if(phase!=='ready'){phase='error';status='The live model could not load. Recorded examples remain available.';}else{status='The prediction failed. Edit the prompt or select a recorded example to continue.';}
      }
      if(data.type==='result' && data.requestId===requestId){
        const result={...data,tokenIds:data.ids,tokens:data.ids.map(id=>tokenizer.decode([id]))};
        setResult(result,'live');busy=false;isModelRunning.set(false);status='Live model ready. Prediction and attention values came from this browser run.';
        if(pendingGenerate){pendingGenerate=false;appendToken(result);}
      }
    };
    worker.onerror=()=>{if(worker!==activeWorker)return;worker.terminate();worker=null;phase='error';busy=false;pendingGenerate=false;isModelRunning.set(false);error='The browser could not run the model worker. Try reloading or use a desktop browser with more free memory.';status='Recorded examples remain available.';};
    worker.postMessage({type:'load'});
  }
  function cancelDownload() {worker?.terminate();worker=null;phase='examples';busy=false;status='Download cancelled. Recorded examples are ready. Validated chunks can be reused on retry.';}
  function backToExamples(){if(phase==='loading'||phase==='initializing')cancelDownload();chooseExample();}
  async function clearCache(){
    if(phase==='loading'||phase==='initializing')cancelDownload();
    try{await caches.delete(MODEL_CACHE);cacheNote='Inside AI model cache cleared. Other website caches were preserved.';}catch{cacheNote='This browser does not allow cache access. No stored files were changed.';}
  }
  function infer(ids){validateContext(ids);busy=true;isModelRunning.set(true);error='';status='Running GPT-2 in this browser…';requestId++;worker.postMessage({type:'infer',ids,requestId});}
  function runPrompt(){try{if(phase!=='ready')throw new Error('Enable the live model to inspect a custom prompt.');infer(tokenizer.encode(prompt));}catch(e){error=e.message;}}
  function appendToken(result){
    try{
      validateContext(result.tokenIds,{reserve:1});
      const chosen=sample(distribution(result.logits,$temperature,$sampling));
      if(chosen.tokenId===50256){status='GPT-2 selected the end-of-text token. Reset or edit the prompt to continue.';return;}
      const ids=[...result.tokenIds,chosen.tokenId];prompt=tokenizer.decode(ids);infer(ids);
    }catch(e){error=e.message;}
  }
  function generate(){
    if(!tokenizer||phase!=='ready'||busy)return;
    try{validateContext(localTokenIds,{reserve:1});if(stale||mode!=='live'){pendingGenerate=true;infer(localTokenIds);}else appendToken(currentResult);}catch(e){error=e.message;}
  }
  function explainEvent(event){showTopic(event.detail);}
  async function showTopic(id){activeTopic=textPages.find(page=>page.id===id)||textPages[0];returnFocus=document.activeElement;await tick();dialog.showModal();}
  function closeTopic(){dialog.close();returnFocus?.focus();}
  function expand(id){expandedBlock.set({id:$expandedBlock.id===id?null:id});}
</script>

<div class="ia-workbench" data-testid="app-ready" data-ready={Boolean(tokenizer)} data-mode={mode} data-token-count={currentResult.tokenIds.length}>
  <div class="ia-evidence"><span class="ia-kicker" data-testid="evidence-mode">{mode==='live'?'Live model':'Recorded example'}</span><span>GPT-2 · 12 blocks · 12 heads per block · 124M parameters</span></div>
  <div class="ia-controls">
    <label class="ia-field">Prepared example
      <select data-testid="example-select" bind:value={exampleIndex} on:change={chooseExample} disabled={busy}>
        {#each examples as example,index}<option value={index}>{example.prompt}</option>{/each}
      </select>
    </label>
    <label class="ia-field ia-prompt">Your prompt
      <textarea data-testid="prompt-input" rows="2" bind:value={prompt} maxlength="3000" aria-describedby="ia-context-note" spellcheck="false" disabled={busy}></textarea>
    </label>
    <div class="ia-command-row">
      <p id="ia-context-note" class:ia-invalid={localTokenIds.length>32}>{localTokenIds.length} / 32 tokens, including generated tokens. Spaces are part of tokens.</p>
      <div class="ia-actions"><button class="ia-button" on:click={runPrompt} disabled={phase!=='ready'||busy||!tokenizer}>Inspect prompt</button><button class="ia-button ia-primary" data-testid="generate-token" on:click={generate} disabled={phase!=='ready'||busy||!tokenizer||localTokenIds.length>=CONTEXT_LIMIT}>Generate one token</button><button class="ia-button" data-testid="reset-example" on:click={reset} disabled={busy}>Reset example</button></div>
    </div>
    {#if stale}<p class="ia-hint">The diagram still shows the last inspected prompt. {phase==='ready'?'Select Inspect prompt to update it.':'Enable the live model to inspect your own text.'}</p>{/if}
  </div>

  <div class="ia-model">
    <div><strong>Try the model on your own words</strong><p>Live generation runs locally and needs approximately 657 MB of model data plus working memory. Prepared examples need no model download.</p></div>
    <div class="ia-actions">
      {#if phase==='loading'||phase==='initializing'}<button class="ia-button" data-testid="cancel-download" on:click={cancelDownload}>Cancel download</button>
      {:else if phase!=='ready'}<button class="ia-button ia-primary" data-testid="enable-model" on:click={enableModel} disabled={!tokenizer}>{phase==='error'?'Retry live model — approximately 657 MB':'Enable live model — approximately 657 MB'}</button>{/if}
      <button class="ia-button" on:click={backToExamples} disabled={busy}>Back to examples</button><button class="ia-button" data-testid="clear-cache" on:click={clearCache}>Clear model cache</button>
    </div>
    <p class="ia-status" data-testid="model-status" role="status" aria-live="polite">{status}</p>
    {#if phase==='loading'||phase==='initializing'}<label class="ia-progress-label">{(loadedBytes/1000000).toFixed(1)} / {(totalBytes/1000000).toFixed(1)} MB verified<progress data-testid="model-progress" max={totalBytes} value={loadedBytes}></progress></label>{/if}
    {#if cacheNote}<p class="ia-hint">{cacheNote}</p>{/if}
    {#if error}<p class="ia-error" role="alert">{error}</p>{/if}
  </div>

  <div class="ia-sampling">
    <label class="ia-field">Temperature <output>{$temperature.toFixed(2)}</output><input aria-label="Temperature" data-testid="temperature-control" type="range" min="0.1" max="2" step="0.05" bind:value={$temperature} /></label>
    <label class="ia-field">Sampling method<select data-testid="sampling-mode" value={$sampling.type} on:change={setSamplingMode}><option value="top-k">Top-k</option><option value="top-p">Top-p (nucleus)</option></select></label>
    <label class="ia-field">{$sampling.type==='top-k'?'Keep the top k tokens':'Keep this probability mass'}<input aria-label="Sampling value" data-testid="sampling-value" type="number" min={$sampling.type==='top-k'?1:0.01} max={$sampling.type==='top-k'?50257:1} step={$sampling.type==='top-k'?1:0.01} value={$sampling.value} on:change={(event)=>{const value=Number(event.target.value);if(Number.isFinite(value)&&value>0&&value<=($sampling.type==='top-k'?50257:1)&&($sampling.type==='top-p'||Number.isInteger(value)))setSamplingValue(event);else event.target.value=$sampling.value;}} /></label>
    <button class="ia-button ia-explain" on:click={()=>showTopic('temperature')}>How sampling works</button>
  </div>

  <div class="ia-token-strip" aria-label="Inspected prompt tokens">{#each currentResult.tokens as token,index}<button title={`Token ${index+1}, ID ${currentResult.tokenIds[index]}`} class:ia-selected={queryRow===index} on:click={()=>queryRow=index}><span>{shownToken(token)}</span><small>{currentResult.tokenIds[index]}</small></button>{/each}</div>
  <p class="ia-hint">Select a token to inspect its attention below. · marks a space; ↵ marks a newline. Token pieces can split a word or a Unicode character.</p>

  <div class="ia-diagram-controls">
    <label class="ia-field">Transformer block<select data-testid="layer-select" bind:value={$blockIdxTemp}>{#each Array(12) as _,i}<option value={i}>Block {i+1} of 12</option>{/each}</select></label>
    <label class="ia-field">Attention head<select data-testid="head-select" bind:value={$attentionHeadIdxTemp}>{#each Array(12) as _,i}<option value={i}>Head {i+1} of 12</option>{/each}</select></label>
    <div class="ia-actions"><button class="ia-button" aria-pressed={$expandedBlock.id==='embedding'} on:click={()=>expand('embedding')}>Expand embeddings</button><button class="ia-button" aria-pressed={$expandedBlock.id==='attention'} on:click={()=>expand('attention')}>Expand attention</button><button class="ia-button" aria-pressed={$expandedBlock.id==='softmax'} on:click={()=>expand('softmax')}>Expand probabilities</button><button class="ia-button" on:click={()=>expandedBlock.set({id:null})}>Collapse diagram</button></div>
  </div>
  <div class="ia-actions" aria-label="Illustrative weight explanations"><span>Inspect an operation:</span>{#each [['qkv','Q/K/V projection'],['attention','Attention output'],['mlpUp','MLP expansion'],['mlpDown','MLP projection'],['softmax','Vocabulary projection']] as [id,label]}<button class="ia-button" on:click={()=>{expandedBlock.set({id:null});weightPopover.set(id);}}>{label}</button>{/each}<button class="ia-button" on:click={()=>weightPopover.set(null)}>Close weight explanation</button></div>
  <p id="ia-diagram-note" class="ia-evidence-note"><strong>{mode==='live'?'Measured in this browser':'Recorded from GPT-2'}:</strong> token IDs, attention matrices, logits, and probabilities. <strong>Illustrative:</strong> embedding, Q/K/V, weight, and MLP vector colors show structure; they are not measured activations.</p>
  <!-- Scrollable regions need keyboard focus for arrow-key scrolling. -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="ia-diagram-scroll" role="region" aria-label="Transformer architecture diagram, scroll horizontally" aria-describedby="ia-diagram-note" tabindex="0">
    <div class="ia-diagram-canvas" class:ia-expanded={!!$expandedBlock.id} style="--min-screen-width:1500px;--min-column-width:34px;--predicted-color:#b74617;"><Diagram /></div>
  </div>
  <div class="ia-output-controls" role="group" aria-label="Diagram output display">
    <p data-testid="diagram-output-count" data-shown={$visibleOutput.rows.length} data-retained={$visibleOutput.retainedCount}>Showing {$visibleOutput.rows.length} of {$visibleOutput.retainedCount.toLocaleString()} retained tokens, highest probability first.</p>
    <label class="ia-output-limit">Diagram row limit
      <select data-testid="diagram-row-limit" bind:value={$diagramRowLimit}>{#each OUTPUT_ROW_LIMITS as limit}<option value={limit}>{limit}</option>{/each}</select>
    </label>
    <a href="#ia-next-heading">Leading {candidates.length} candidates and logits</a>
    <p>Sampling uses all 50,257 tokens.</p>
  </div>
  <p class="ia-hint">The complete architecture is wider than small screens. Scroll within the diagram, or use the measured-data tables below. All explanation topics are also available at the end of the workbench.</p>

  <div class="ia-reading-grid">
    <section class="ia-data-section" aria-labelledby="ia-attention-heading">
      <h3 id="ia-attention-heading">Read the Attention</h3>
      <p>Block {$blockIdx+1}, head {$attentionHeadIdx+1}. Each row shows which earlier tokens the selected token can attend to.</p>
      <label class="ia-field">Attention stage<select bind:value={selectedStage}><option value="attn">Q × Kᵀ scores</option><option value="attn_scaled">Scaled scores ÷ √64</option><option value="attn_masked">Causal mask</option><option value="attn_softmax">Softmax attention weights</option><option value="attn_dropout">After dropout (inference)</option></select></label>
      <label class="ia-field">Query token<select bind:value={queryRow}>{#each currentResult.tokens as token,i}<option value={i}>{i+1}: {shownToken(token)}</option>{/each}</select></label>
      <!-- Scrollable tables need keyboard focus when content exceeds the viewport. -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div class="ia-table-scroll" tabindex="0" role="region" aria-label="Attention data"><table data-testid="attention-table"><caption>Attention from token {queryRow+1}: {shownToken(currentResult.tokens[queryRow]||'')} · block {$blockIdx+1}, head {$attentionHeadIdx+1}</caption><thead><tr><th scope="col">Key token</th><th scope="col">Value</th><th scope="col">Visibility</th></tr></thead><tbody>{#each selectedWeights as value,i}<tr><th scope="row">{i+1}: <code>{shownToken(currentResult.tokens[i])}</code></th><td>{valueText(value)}</td><td>{i>queryRow?'Future token': 'Available'}</td></tr>{/each}</tbody></table></div>
      <details><summary>Attention equation</summary><Katex math={String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V`} /><p>Each head has 64 dimensions. M masks future tokens with −∞, so their softmax weights are zero. Dropout is disabled during this inference run.</p></details>
    </section>
    <section class="ia-data-section" aria-labelledby="ia-next-heading">
      <h3 id="ia-next-heading">What Could Come Next?</h3>
      <p data-testid="numerical-output" data-probability-sum={full.reduce((sum,item)=>sum+item.probability,0)}>{retained.toLocaleString()} of 50,257 tokens retained. Displaying the leading 50 candidates ({percent(shownMass)} of filtered probability).</p>
      <!-- Scrollable tables need keyboard focus when content exceeds the viewport. -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div class="ia-table-scroll ia-probability-table" tabindex="0" role="region" aria-label="Next-token probabilities"><table><caption>Full-vocabulary normalization at temperature {$temperature.toFixed(2)}</caption><thead><tr><th scope="col">Candidate</th><th scope="col">Logit</th><th scope="col">Before filter</th><th scope="col">After filter</th></tr></thead><tbody>{#each candidates as item}<tr><th scope="row"><code>{shownToken(item.token)}</code><small>ID {item.tokenId}</small></th><td>{item.logit.toFixed(3)}</td><td>{percent(item.topPProbability)}</td><td>{percent(item.probability)}</td></tr>{/each}</tbody></table></div>
      <details><summary>Probability and sampling equations</summary><Katex math={String.raw`p_i=\frac{\exp(z_i/T)}{\sum_{j=1}^{50257}\exp(z_j/T)}`} /><p>Temperature T changes the spread of probabilities. Top-k keeps the k highest probabilities. Top-p keeps the smallest leading set whose total probability reaches p. The retained set is normalized again before drawing a token.</p></details>
    </section>
  </div>
  <section class="ia-glossary" aria-labelledby="ia-explanations-heading"><h3 id="ia-explanations-heading">Explore the Moving Parts</h3><p>Open a short explanation. The vector diagrams illustrate dimensions and operations; attention and prediction tables contain recorded or live model values.</p><div class="ia-topic-list">{#each textPages as topic}<button class="ia-button" on:click={()=>showTopic(topic.id)}>{topic.title.replace('What is Transformer?','What Is a Transformer?').replace('How Transformers Work?','How Transformers Work')}</button>{/each}</div></section>
  <dialog bind:this={dialog} class="ia-topic-dialog" on:close={()=>returnFocus?.focus()} aria-labelledby="ia-topic-title"><button class="ia-button ia-dialog-close" on:click={closeTopic}>Close explanation</button>{#if activeTopic}<h3 id="ia-topic-title">{activeTopic.title}</h3><div>{@html activeTopic.content || '<p>This step transforms each token representation before the next block. The diagram illustrates its dimensions; colored vectors are schematic.</p>'}</div><p class="ia-evidence-note">Embedding, Q/K/V, and MLP colored vectors are illustrative. Use the attention and prediction tables for measured values.</p>{/if}</dialog>
</div>
