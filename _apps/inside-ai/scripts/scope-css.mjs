import {readFile,writeFile} from 'node:fs/promises';
import postcss from 'postcss';
import prefix from 'postcss-prefix-selector';
const path=new URL('../../../inside-ai/assets/inside-ai.css',import.meta.url);
const css=await readFile(path,'utf8');
const output=await postcss([prefix({
  prefix:'#inside-ai-app',
  transform(prefix,selector,prefixed){return selector.includes('#inside-ai-app')?selector:prefixed;}
})]).process(css,{from:undefined,map:false});
await writeFile(path,output.css);
