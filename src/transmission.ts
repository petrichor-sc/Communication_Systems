export type PulseShape = 'rectangular' | 'raised-cosine';
export type EncodedCharacter = {character:string; bytes:number[]; byteOffset:number};
export type EncodedMessage = {characters:EncodedCharacter[]; bytes:number[]; bits:string; symbols:number[]};
export type RadioSettings = {pulse:PulseShape; symbolRate:number; carrierCycles:number; gain:number; noise:number; seed:number; adcBits:number; samplesPerSymbol:number; timing:number; correctGain:boolean};
export const defaultRadio:RadioSettings = {pulse:'rectangular',symbolRate:4,carrierCycles:6,gain:1,noise:0,seed:7,adcBits:6,samplesPerSymbol:8,timing:0,correctGain:true};
export const pamAlphabet = [{bits:'00',level:-3},{bits:'01',level:-1},{bits:'10',level:1},{bits:'11',level:3}];
export function encodeText(text:string):EncodedMessage {
 const encoder=new TextEncoder();let byteOffset=0;
 const characters=Array.from(text).map(character=>{const bytes=Array.from(encoder.encode(character));const item={character,bytes,byteOffset};byteOffset+=bytes.length;return item});
 const bytes=characters.flatMap(c=>c.bytes),bits=bytes.map(b=>b.toString(2).padStart(8,'0')).join('');
 return {characters,bytes,bits,symbols:Array.from({length:bits.length/2},(_,k)=>2*parseInt(bits.slice(2*k,2*k+2),2)-3)};
}
export function raisedCosine(x:number,beta=.35):number {
 if(Math.abs(x)<1e-9)return 1;
 const sinc=Math.sin(Math.PI*x)/(Math.PI*x);
 if(Math.abs(1-4*beta*beta*x*x)<1e-8)return Math.PI/4*sinc;
 return sinc*Math.cos(Math.PI*beta*x)/(1-4*beta*beta*x*x);
}
// Time u is measured in symbol intervals. Symbols peak at k + 1/2.
export function shapedValue(symbols:number[],u:number,pulse:PulseShape):number {
 if(pulse==='rectangular')return symbols[Math.floor(u)]??0;
 let value=0;
 for(let k=Math.max(0,Math.floor(u)-7);k<Math.min(symbols.length,Math.ceil(u)+7);k++)value+=symbols[k]*raisedCosine(u-k-.5);
 return value;
}
function uniform(n:number,seed:number){let v=Math.imul(n+1,0x45d9f3b)^Math.imul(seed+1,0x27d4eb2d);v=Math.imul(v^(v>>>16),0x45d9f3b);return ((v^(v>>>16))>>>0)/4294967296;}
// A repeatable, band-limited noise illustration; frequencies stay below 0.6 Rs.
export function noiseValue(u:number,seed:number):number {
 let value=0;for(let k=0;k<16;k++)value+=Math.cos(2*Math.PI*((.04+.56*uniform(k,seed))*u+uniform(k+31,seed)));
 return value*Math.sqrt(2/16);
}
export function channelValue(symbols:number[],u:number,s:RadioSettings){return s.gain*shapedValue(symbols,u,s.pulse)+(s.noise? s.noise*noiseValue(u,s.seed):0);}
export function quantize(value:number,bits:number,range=4){
 const levels=2**bits,step=2*range/levels,code=Math.max(0,Math.min(levels-1,Math.floor((value+range)/step)));
 return {code,binary:code.toString(2).padStart(bits,'0'),value:-range+(code+.5)*step,step,clipped:value< -range||value>=range};
}
export function decidePam(value:number){return value< -2?-3:value<0?-1:value<2?1:3;}
export function levelBits(value:number){return ((value+3)/2).toString(2).padStart(2,'0');}
export function adcSample(symbols:number[],index:number,s:RadioSettings){
 const u=index/s.samplesPerSymbol,input=channelValue(symbols,u,s),q=quantize(input,s.adcBits);
 return {index,u,input,...q};
}
export function receiveMessage(encoded:EncodedMessage,s:RadioSettings){
 const decisions=encoded.symbols.map((original,k)=>{
  const index=Math.max(0,Math.min(encoded.symbols.length*s.samplesPerSymbol-1,Math.round((k+.5+s.timing)*s.samplesPerSymbol)));
  const sample=adcSample(encoded.symbols,index,s),corrected=sample.value/(s.correctGain?s.gain:1),decided=decidePam(corrected);
  return {...sample,original,corrected,decided,bits:levelBits(decided),error:decided!==original};
 });
 const bits=decisions.map(d=>d.bits).join(''),bytes=Array.from({length:bits.length/8},(_,i)=>parseInt(bits.slice(i*8,i*8+8),2));
 const bitErrors=Array.from(bits).reduce((sum,b,i)=>sum+Number(b!==encoded.bits[i]),0);
 return {decisions,bits,bytes,text:new TextDecoder().decode(new Uint8Array(bytes)),bitErrors,symbolErrors:decisions.filter(d=>d.error).length};
}
