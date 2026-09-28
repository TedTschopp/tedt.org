// Normalize and filter the full vocabulary; never use a display slice for sampling.
export function distribution(logits, temperature=0.8, sampling={type:'top-k',value:5}) {
  if(!logits?.length || !Number.isFinite(temperature) || temperature<=0) throw new Error('Temperature must be positive.');
  if(!['top-k','top-p'].includes(sampling.type))throw new Error('Unknown sampling method.');
  if(sampling.type==='top-k'&&(!Number.isInteger(sampling.value)||sampling.value<1))throw new Error('Top-k must be a positive integer.');
  if(sampling.type==='top-p'&&(!Number.isFinite(sampling.value)||sampling.value<=0||sampling.value>1))throw new Error('Top-p must be between zero and one.');
  const sorted=Array.from(logits,(logit,tokenId)=>({tokenId,logit,scaledLogit:logit/temperature})).sort((a,b)=>b.logit-a.logit);
  if(!Number.isFinite(sorted[0].logit)||sorted.some(x=>Number.isNaN(x.logit)||x.logit===Infinity))throw new Error('Invalid model logits.');
  const max=sorted[0].scaledLogit;
  let sum=0;
  for(const item of sorted) {item.expLogit=Math.exp(item.scaledLogit-max);sum+=item.expLogit;}
  let cumulative=0;
  for(const item of sorted) {item.topPProbability=item.expLogit/sum;cumulative+=item.topPProbability;item.cumulativeProbability=cumulative;}
  let cutoff=sampling.type==='top-k'? Math.min(sampling.value,sorted.length)-1:sorted.findIndex(x=>x.cumulativeProbability>=sampling.value);
  if(cutoff<0)cutoff=sorted.length-1;
  const mass=sorted[cutoff].cumulativeProbability;
  return sorted.map((item,rank)=>({...item,rank,cutoffIndex:cutoff,probability:rank<=cutoff?item.topPProbability/mass:0,topKLogit:rank<=cutoff?item.scaledLogit:-Infinity}));
}
export function sample(items, random=Math.random) {
  const draw=random();
  if(!Number.isFinite(draw)||draw<0||draw>=1)throw new Error('Invalid random draw.');
  let cumulative=0, last;
  for(const item of items){if(item.probability>0)last=item;cumulative+=item.probability;if(draw<cumulative)return item;}
  if(!last)throw new Error('No candidate token.');
  return last;
}
