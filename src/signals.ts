export type Point={x:number;y:number};
export function cosine(f:number,a=1,phase=0,n=512,duration=1):Point[]{return Array.from({length:n+1},(_,i)=>({x:i*duration/n,y:a*Math.cos(2*Math.PI*f*i*duration/n+phase)}));}
export function aliasFrequency(f:number,fs:number){return Math.abs(((f+fs/2)%fs+fs)%fs-fs/2);}
export function averagePower(values:number[]){return values.reduce((s,v)=>s+v*v,0)/Math.max(1,values.length);}
export function gaussian(n:number){let seed=72537;const u=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return(seed+1)/4294967297;};return Array.from({length:n},()=>Math.sqrt(-2*Math.log(u()))*Math.cos(2*Math.PI*u()));}
export function spectrum(data:Point[],max=40):Point[]{const values=data.slice(0,-1).map(d=>d.y),n=values.length;const result:Point[]=[];for(let k=-max;k<=max;k++){let re=0,im=0;for(let i=0;i<n;i++){re+=values[i]*Math.cos(2*Math.PI*k*i/n);im-=values[i]*Math.sin(2*Math.PI*k*i/n);}const mag=Math.hypot(re,im)/n;if(mag>0.008)result.push({x:k,y:mag});}return result;}
