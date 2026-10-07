import {randomBytes,timingSafeEqual} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';

// Server-only credential. Never included in HTML, client bundles, or logs.
let cachedKey;
export function bridgeKey(){
 if(cachedKey)return cachedKey;
 const project=existsSync(resolve(process.cwd(),'booking-engine/server.mjs'))?process.cwd():resolve(process.cwd(),'..');
 const dir=resolve(project,'.local');
 const file=resolve(dir,'booking-bridge.key');
 mkdirSync(dir,{recursive:true});
 try{writeFileSync(file,randomBytes(32).toString('hex'),{flag:'wx',mode:0o600});}catch(e){if(e.code!=='EEXIST')throw e;}
 cachedKey=readFileSync(file,'utf8').trim();return cachedKey;
}
export function trustedBridge(headers){
 const value=headers['x-booking-bridge'];
 if(typeof value!=='string'||!/^[a-f0-9]{64}$/.test(value))return false;
 return timingSafeEqual(Buffer.from(value),Buffer.from(bridgeKey()));
}
export function bridgeActor(headers){
 if(!trustedBridge(headers)||!headers['x-booking-admin'])return null;
 try{const actor=JSON.parse(Buffer.from(headers['x-booking-admin'],'base64url').toString());
  if(typeof actor.id!=='string'||typeof actor.email!=='string')return null;
  return {id:'website:'+actor.id,email:actor.email,role:'Admin',website:true};
 }catch{return null;}
}
