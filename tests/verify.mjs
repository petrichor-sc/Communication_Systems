import assert from 'node:assert/strict';
import {cosine,aliasFrequency,averagePower,spectrum} from '../src/signals.ts';
import {sanitizeEntries,mergeEntries,parseBackup,makeMarkdown,notebookStorageKey} from '../src/storage.ts';
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
console.log('Passed: aliases, signal power, nonlinear spectrum, backup round-trip, Markdown headings, non-destructive import, validation, repository storage isolation.');
