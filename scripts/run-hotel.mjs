import {spawn,spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

const root=resolve(import.meta.dirname,'..');
const mode=process.argv[2]==='start'?'start':'dev';
const port=Number(process.env.BOOKING_PORT||3003);
const websitePort=Number(process.env.HOTEL_PORT||3001);
if(!Number.isInteger(port)||port<1||port>65535||!Number.isInteger(websitePort)||websitePort<1||websitePort>65535||port===websitePort)throw Error('Port website dan booking harus berbeda dan valid.');
const internal=`http://127.0.0.1:${port}`;
const children=[];let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children){if(child.exitCode!==null)continue;if(process.platform==='win32')spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});else child.kill();}process.exitCode=code;}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
async function ready(){try{const r=await fetch(internal+'/api/v1/health',{signal:AbortSignal.timeout(1200)});const b=await r.json();return r.ok&&b.ok&&b.inventory==='isolated-sandbox-allotment';}catch{return false;}}
function launch(args,env={}){const child=spawn(process.execPath,args,{cwd:root,env:{...process.env,...env},stdio:'inherit',windowsHide:true});children.push(child);child.on('error',e=>{console.error(e.message);stop(1);});child.on('exit',code=>{if(!stopping){console.error('Layanan berhenti. Jalankan ulang npm run '+mode);stop(code||1);}});return child;}
if(!await ready()){
 launch(['booking-engine/server.mjs'],{BOOKING_PORT:String(port)});
 let healthy=false;for(let n=0;n<50&&!stopping;n++){if(await ready()){healthy=true;break;}await delay(200);}
 if(!healthy){console.error('Booking engine tidak siap; periksa port '+port);stop(1);} 
}
if(!stopping){
 console.log(`Ramayana: website http://localhost:${websitePort} · reservasi http://localhost:${websitePort}/booking · admin http://localhost:${websitePort}/admin`);
 launch(['node_modules/next/dist/bin/next',mode,...(mode==='dev'?['--webpack']:[]),'-p',String(websitePort)],{BOOKING_INTERNAL_URL:internal});
}
