import assert from 'node:assert/strict';
import {cosine,aliasFrequency,averagePower,spectrum} from '../src/signals.ts';
import {sanitizeEntries,mergeEntries,parseBackup,makeMarkdown,notebookStorageKey} from '../src/storage.ts';
import {encodeText,receiveMessage,defaultRadio,quantize,shapedValue,raisedCosine,adcSample} from '../src/transmission.ts';
assert.equal(aliasFrequency(600,1000),400);
assert.equal(aliasFrequency(12,20),8);
assert.equal(aliasFrequency(30,20),10);
assert.ok(Math.abs(averagePower(cosine(4,2).slice(0,-1).map(p=>p.y))-2)<1e-10);
const squared=spectrum(cosine(3).map(p=>({x:p.x,y:p.y**2})),10);
assert.ok(squared.some(p=>p.x===0&&Math.abs(p.y-.5)<1e-10));
assert.ok(squared.some(p=>p.x===6&&Math.abs(p.y-.25)<1e-10));
const sections=[{id:'oscillators',title:'Lecture 1 · Oscillators',ref:'§3.2'}],ids=new Set(sections.map(s=>s.id));
const entry={entryId:'oscillators',notes:'My observation\n\n## My own heading\nA = 2',completed:true,updatedAt:'2026-10-22T00:00:00Z'};
const entries={oscillators:entry};
for(const format of ['communication-systems-backup','signal-notes-backup']){
 const backup=JSON.stringify({format,version:1,entries});
 assert.equal(parseBackup(backup,ids,sections).oscillators.notes,entry.notes);
 assert.equal(parseBackup(backup,ids,sections).oscillators.completed,true);
}
const markdown=makeMarkdown(entries,sections);
assert.ok(markdown.startsWith('# Communication Systems\n'));
for(const text of [markdown,markdown.replace('# Communication Systems','# Signal Notes — Communication Systems')]){
 assert.equal(parseBackup(text,ids,sections).oscillators.notes,entry.notes);
 assert.equal(parseBackup(text,ids,sections).oscillators.completed,true);
}
const merged=mergeEntries(entries,{oscillators:{...entry,notes:'Another observation',completed:false}});
assert.ok(merged.oscillators.notes.includes('My observation'));
assert.ok(merged.oscillators.notes.includes('Another observation'));
assert.equal(merged.oscillators.completed,true);
assert.equal(mergeEntries(merged,{oscillators:{...entry,notes:'Another observation'}}).oscillators.notes,merged.oscillators.notes);
assert.throws(()=>parseBackup('{"format":"wrong"}',ids,sections));
assert.throws(()=>sanitizeEntries({oscillators:{...entry,notes:0}},ids));
assert.equal(notebookStorageKey('/repo/'),notebookStorageKey('/repo/index.html'));
assert.notEqual(notebookStorageKey('/repo/'),notebookStorageKey('/other/'));
const hello=encodeText('Hello');
assert.deepEqual(hello.bytes,[0x48,0x65,0x6c,0x6c,0x6f]);
assert.equal(hello.bits.length,40);
assert.equal(hello.symbols.length,20);
assert.deepEqual(hello.symbols.slice(0,4),[-1,-3,1,-3]);
for(const text of ['Hello','Hi 🌊','é','\u0000','', '1010']){
 const encoded=encodeText(text);
 for(const pulse of ['rectangular','raised-cosine'])for(const adcBits of [2,3,6,8]){
  const decoded=receiveMessage(encoded,{...defaultRadio,pulse,adcBits});
  assert.equal(decoded.text,text,`${JSON.stringify(text)} with ${pulse}, ${adcBits}-bit ADC`);
  assert.equal(decoded.bitErrors,0);
 }
}
assert.equal(encodeText('🌊').bytes.length,4);
assert.ok(receiveMessage(hello,{...defaultRadio,adcBits:1}).bitErrors>0,'A one-bit ADC cannot distinguish four amplitudes.');
assert.equal(receiveMessage(hello,{...defaultRadio,gain:.25}).text,'Hello');
assert.ok(receiveMessage(hello,{...defaultRadio,gain:.25,correctGain:false}).bitErrors>0);
assert.equal(quantize(1,2).value,1);
assert.equal(quantize(-3,2).binary,'00');
assert.equal(quantize(99,6).code,63);
assert.equal(quantize(-99,6).code,0);
assert.equal(quantize(4,6).clipped,true);
assert.ok(Number.isFinite(raisedCosine(1/(2*.35))));
for(let i=0;i<hello.symbols.length;i++)assert.ok(Math.abs(shapedValue(hello.symbols,i+.5,'raised-cosine')-hello.symbols[i])<1e-9);
const noisy={...defaultRadio,noise:1.5};
assert.deepEqual(receiveMessage(hello,noisy),receiveMessage(hello,noisy),'Noise is repeatable for a given seed.');
assert.ok(receiveMessage(hello,noisy).bitErrors>0);
for(const d of receiveMessage(hello,{...defaultRadio,timing:.2}).decisions){
 const measured=adcSample(hello.symbols,d.index,{...defaultRadio,timing:.2});
 assert.equal(d.input,measured.input,'DSP uses an actual ADC sample.');
 assert.equal(d.u*defaultRadio.samplesPerSymbol,d.index);
}
console.log('Passed: signal calculations; JSON/Markdown backups; legacy compatibility; UTF-8 bytes and PAM mapping; clean end-to-end recovery; raised-cosine symbol centers; ADC clipping and codes; resolution, gain, and noise failures; actual sample timing.');
