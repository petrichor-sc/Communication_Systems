export type Entry={entryId:string;notes:string;completed:boolean;updatedAt:string;dirty?:boolean};
export type EntryMap=Record<string,Entry>;
export type Section={id:string;title:string;ref:string};
export function scopePath(path:string){const cleaned=path.replace(/\/index\.html$/,'/');return cleaned.endsWith('/')?cleaned:cleaned+'/';}
export function notebookStorageKey(path:string){return 'signal-notes-pages-v1:'+scopePath(path);}
export function sanitizeEntries(input:unknown,knownIds:Set<string>):EntryMap{
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('This backup does not contain a valid notebook.');
 const result:EntryMap={};
 for(const[id,value]of Object.entries(input)){
  if(!knownIds.has(id))continue;
  if(!value||typeof value!=='object')throw Error('An entry in this backup is invalid.');
  const v=value as Partial<Entry>;
  if(v.entryId!==id||typeof v.notes!=='string'||v.notes.length>60000||typeof v.completed!=='boolean')throw Error('An entry has an invalid format or exceeds 60,000 characters.');
  result[id]={entryId:id,notes:v.notes,completed:v.completed,updatedAt:typeof v.updatedAt==='string'?v.updatedAt:new Date().toISOString(),dirty:false};
 }
 return result;
}
export function mergeEntries(existing:EntryMap,incoming:EntryMap):EntryMap{
 const result={...existing};
 for(const[id,value]of Object.entries(incoming)){
  const old=result[id];let notes=value.notes;
  if(old?.notes.trim()){
   if(!notes.trim()||old.notes===notes||old.notes.includes(notes))notes=old.notes;
   else if(!notes.includes(old.notes))notes=old.notes+'\n\n--- Imported notes ---\n\n'+notes;
  }
  if(notes.length>60000)throw Error('Merging would exceed the note limit for '+id+'. Existing notes have not been changed.');
  result[id]={...value,notes,completed:Boolean(old?.completed||value.completed),updatedAt:new Date().toISOString(),dirty:false};
 }
 return result;
}
export function parseBackup(text:string,knownIds:Set<string>,sections:Section[]):EntryMap{
 if(text.trimStart().startsWith('{')){
  let backup:any;try{backup=JSON.parse(text)}catch{throw Error('This JSON backup could not be read.')}
  if(!['communication-systems-backup','signal-notes-backup'].includes(backup.format)||backup.version!==1)throw Error('Use a Communication Systems backup JSON, or an exported notebook Markdown file.');
  return sanitizeEntries(backup.entries,knownIds);
 }
 if(!/^# (?:Communication Systems|Signal Notes)(?:[ \t]|$)/m.test(text))throw Error('This does not look like a Communication Systems Markdown export.');
 const headings=Array.from(text.matchAll(/^## (.+)$/gm)).map(match=>({match,section:sections.find(s=>s.title===match[1].trim())})).filter(item=>item.section);
 const entries:EntryMap={};
 for(let i=0;i<headings.length;i++){
  const {match,section}=headings[i];if(!section)continue;
  const start=match.index!+match[0].length,end=i+1<headings.length?headings[i+1].match.index!:text.length;
  const lines=text.slice(start,end).split('\n');
  while(lines.length&&!lines[0].trim())lines.shift();if(lines[0]?.startsWith('Book:'))lines.shift();
  let completed=false;if(lines[0]?.startsWith('Status:'))completed=lines.shift()!.includes('Reviewed');
  const notes=lines.join('\n').trim();entries[section.id]={entryId:section.id,notes:notes==='_No personal notes yet._'?'':notes,completed,updatedAt:new Date().toISOString()};
 }
 if(!Object.keys(entries).length)throw Error('No matching lecture or exercise notes were found in that file.');
 return sanitizeEntries(entries,knownIds);
}
export function makeMarkdown(entries:EntryMap,sections:Section[]){return '# Communication Systems\n\nExported '+new Date().toLocaleDateString()+'\n\n'+sections.filter(s=>entries[s.id]?.notes||entries[s.id]?.completed).map(s=>'## '+s.title+'\n\nBook: '+s.ref+'\nStatus: '+(entries[s.id]?.completed?'Reviewed':'In progress')+'\n\n'+(entries[s.id]?.notes||'_No personal notes yet._')+'\n').join('\n');}
export function downloadFile(filename:string,text:string,type:string){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
