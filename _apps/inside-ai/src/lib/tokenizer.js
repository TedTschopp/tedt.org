// GPT-2's byte-level BPE, using the pinned Xenova/gpt2 tokenizer.json.
// GPT-2 regex and byte mapping originate in OpenAI's MIT-licensed GPT-2 encoder.
export class GPT2Tokenizer {
  constructor(config) {
    if (config.model?.type !== 'BPE' || config.pre_tokenizer?.type !== 'ByteLevel') throw new Error('Unsupported tokenizer configuration.');
    this.vocab = config.model.vocab;
    this.tokens = Object.fromEntries(Object.entries(this.vocab).map(([token, id]) => [id, token]));
    this.ranks = new Map(config.model.merges.map((pair, rank) => [Array.isArray(pair) ? pair.join(' ') : pair, rank]));
    const bytes = [...Array.from({length:94},(_,i)=>i+33),...Array.from({length:12},(_,i)=>i+161),...Array.from({length:82},(_,i)=>i+174)];
    const chars = [...bytes];
    for (let byte=0, added=0;byte<256;byte++) if (!bytes.includes(byte)) { bytes.push(byte); chars.push(256+added++); }
    this.encoder = Object.fromEntries(bytes.map((byte,i)=>[byte,String.fromCodePoint(chars[i])]));
    this.decoder = Object.fromEntries(bytes.map((byte,i)=>[String.fromCodePoint(chars[i]),byte]));
    this.cache = new Map();
  }
  encode(text) {
    const parts = text.split(/(<\|endoftext\|>)/g).flatMap(piece=>piece==='<|endoftext|>'?[piece]:(piece.match(/'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu) || []));
    const output=[];
    for (const part of parts) {
      if(part==='<|endoftext|>'){output.push(50256);continue;}
      const encoded=Array.from(new TextEncoder().encode(part),byte=>this.encoder[byte]).join('');
      let word=this.cache.get(encoded);
      if (!word) {
        word=Array.from(encoded);
        while(word.length>1) {
          let best=Infinity, pair;
          for(let i=0;i<word.length-1;i++) { const p=word[i]+' '+word[i+1],rank=this.ranks.get(p); if(rank<best){best=rank;pair=[word[i],word[i+1]];} }
          if(!pair) break;
          const merged=[];
          for(let i=0;i<word.length;i++) { if(word[i]===pair[0]&&word[i+1]===pair[1]){merged.push(word[i]+word[++i]);}else merged.push(word[i]); }
          word=merged;
        }
        this.cache.set(encoded,word);
      }
      for(const piece of word) { const id=this.vocab[piece]; if(id===undefined)throw new Error('Tokenizer could not encode text.'); output.push(id); }
    }
    return output;
  }
  decode(ids) {
    const bytes=[];
    for(const id of ids) {
      if(id===50256)continue;
      const token=this.tokens[id];
      if(token===undefined)throw new Error('Unknown token ID.');
      for(const char of token)bytes.push(this.decoder[char]);
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
}
export const CONTEXT_LIMIT = 32;
export function validateContext(ids, {reserve=0}={}) {
  if(!Array.isArray(ids)||!ids.length)throw new Error('Enter a prompt containing at least one token.');
  if(ids.some(id=>!Number.isInteger(id)||id<0||id>=50257))throw new Error('Invalid token ID.');
  if(ids.length+reserve>CONTEXT_LIMIT)throw new Error(`Use at most ${CONTEXT_LIMIT-reserve} tokens${reserve?' to leave room for the next token':''}. This explorer has a 32-token context limit.`);
  return ids;
}

// A generated token can end in the middle of UTF-8; keep its exact IDs until the visitor edits the text.
export function tokenIdsForPrompt(tokenizer, text, previousIds) {
  return text===tokenizer.decode(previousIds) ? previousIds : tokenizer.encode(text);
}
