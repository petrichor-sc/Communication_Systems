import {decidePam,levelBits,noiseValue,quantize,type EncodedMessage} from './transmission.ts';

export const fmt=(n:number,d=2)=>Number(n.toFixed(d)).toString();
export const hex=(n:number)=>n.toString(16).padStart(2,'0').toUpperCase();
export function mixerFrequencies(rf:number,ifFrequency:number){
 const lo=rf-ifFrequency;
 return {rf,lo,difference:Math.abs(rf-lo),sum:rf+lo};
}
export function repetitionEncode(bits:string){return Array.from(bits,b=>b.repeat(3)).join('');}
export function repetitionDecode(bits:string){
 return Array.from({length:Math.floor(bits.length/3)},(_,i)=>bits.slice(i*3,i*3+3).split('').filter(b=>b==='1').length>=2?'1':'0').join('');
}
export function runLengths(text:string){
 const runs:{character:string;count:number}[]=[];
 for(const character of Array.from(text)){
  const last=runs.at(-1);if(last?.character===character)last.count++;else runs.push({character,count:1});
 }
 return runs;
}
export function movingAverage(values:number[],length:number){
 let sum=0;return values.map((v,i)=>{sum+=v;if(i>=length)sum-=values[i-length];return sum/length});
}
export function undoOneSymbolEcho(values:number[],alpha:number){
 const output:number[]=[];
 values.forEach((v,i)=>output.push(v-alpha*(output[i-1]??0)));
 return output;
}
export function frameCorrelation(stream:number[],preamble:number[]){
 const energy=preamble.reduce((s,x)=>s+x*x,0);
 return Array.from({length:Math.max(0,stream.length-preamble.length+1)},(_,i)=>({offset:i,value:preamble.reduce((s,p,j)=>s+p*stream[i+j],0)/energy}));
}
export const demoPreamble=[3,3,3,-3,-3,3,-3];
export type SoftwareOptions={noise:number;echo:number;timing:number;phase:number;frequencyError:number;carrierCorrection:boolean;matched:boolean;equalize:boolean;leading:number};
export const defaultSoftware:SoftwareOptions={noise:.3,echo:.45,timing:0,phase:0,frequencyError:0,carrierCorrection:true,matched:true,equalize:true,leading:3};
// Focused, normalized real-baseband experiment: rectangular pulses, L=16,
// a one-symbol echo, a known carrier mismatch, and a known echo coefficient.
// A boxcar matched filter integrates one rectangular pulse. We sample its
// output at the end of each pulse, including its causal filter delay.
export function softwareReceiver(encoded:EncodedMessage,s:SoftwareOptions){
 const L=16,symbols=encoded.symbols;
 const input=Array.from({length:(symbols.length+2)*L},(_,i)=>{
  const k=Math.floor(i/L),u=i/L;
  const base=(symbols[k]??0)+s.echo*(symbols[k-1]??0)+s.noise*noiseValue(u,19)+s.noise*.5*Math.sin(2*Math.PI*5.3*u);
  const angle=s.carrierCorrection?0:2*Math.PI*s.frequencyError*u+s.phase*Math.PI/180;
  return quantize(base*Math.cos(angle),8,8).value;
 });
 const filtered=movingAverage(input,L);
 const samples=symbols.map((_,k)=>{
  const index=Math.max(0,Math.min(input.length-1,(k+1)*L-1+Math.round(s.timing*L)));
  return {index,u:index/L,value:(s.matched?filtered:input)[index]};
 });
 const corrected=s.equalize?undoOneSymbolEcho(samples.map(x=>x.value),s.echo):samples.map(x=>x.value);
 const decisions=corrected.map(decidePam);
 const stream=[...Array(s.leading).fill(0),...demoPreamble,...decisions];
 const correlations=frameCorrelation(stream,demoPreamble);
 // A frame marker is sought in the acquisition window before the payload.
 const acquisition=correlations.slice(0,s.leading+1);
 const detected=acquisition.reduce((best,p)=>p.value>best.value?p:best,{offset:0,value:-Infinity});
 const payload=stream.slice(detected.offset+demoPreamble.length,detected.offset+demoPreamble.length+symbols.length);
 const bits=payload.map(levelBits).join(''),bytes=Array.from({length:bits.length/8},(_,i)=>parseInt(bits.slice(i*8,i*8+8),2));
 return {L,input,filtered,samples,corrected,decisions,bits,bytes,text:new TextDecoder().decode(new Uint8Array(bytes)),bitErrors:Array.from(bits).filter((b,i)=>b!==encoded.bits[i]).length,stream,correlations,detected};
}
