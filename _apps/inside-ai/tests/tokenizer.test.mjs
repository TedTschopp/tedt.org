import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GPT2Tokenizer,validateContext,tokenIdsForPrompt} from '../src/lib/tokenizer.js';
const tokenizer=new GPT2Tokenizer(JSON.parse(await readFile(new URL('../public/tokenizer/tokenizer.json',import.meta.url))));
// Golden IDs generated independently with Hugging Face tokenizers 0.23.2, using the same pinned JSON.
const golden=JSON.parse(await readFile(new URL('./tokenizer-golden.json',import.meta.url)));
for(const item of golden)test(`GPT-2 BPE golden: ${JSON.stringify(item.text)}`,()=>{assert.deepEqual(tokenizer.encode(item.text),item.ids);assert.equal(tokenizer.decode(item.ids),item.decoded);});
test('token limits count actual BPE tokens, with a reserved generation slot',()=>{
 assert.throws(()=>validateContext([]),/at least one/);assert.throws(()=>validateContext(Array(33).fill(1)),/32-token/);
 assert.equal(validateContext(Array(32).fill(1)).length,32);assert.throws(()=>validateContext(Array(32).fill(1),{reserve:1}),/31 tokens/);
 assert.throws(()=>validateContext([NaN]),/Invalid/);assert.throws(()=>validateContext([50257]),/Invalid/);
 assert.ok(tokenizer.encode('🙂'.repeat(20)).length>32);
});

test('generated split-Unicode IDs survive display decoding until an edit',()=>{
 const original=[8582];const display=tokenizer.decode(original);
 assert.notDeepEqual(tokenizer.encode(display),original);
 assert.deepEqual(tokenIdsForPrompt(tokenizer,display,original),original);
 assert.deepEqual(tokenIdsForPrompt(tokenizer,'Edited',original),tokenizer.encode('Edited'));
});
