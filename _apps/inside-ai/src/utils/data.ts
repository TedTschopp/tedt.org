import { modelData, predictedToken } from '~/store';
import { distribution, sample } from '~/lib/sampling.js';
export function adjustTemperature({tokenizer,logits,temperature,sampling}) {
 const full=distribution(logits,temperature,sampling);
 const sampled=sample(full);
 const format=(item)=>({...item,token:tokenizer.decode([item.tokenId])});
 const probabilities=full.slice(0,50).map(format);
 const chosen=format(sampled);
 modelData.update(data=>({...data,probabilities,sampled:chosen}));
 predictedToken.set(chosen);
 return {full,probabilities,sampled:chosen};
}
