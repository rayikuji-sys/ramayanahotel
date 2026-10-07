// HTTP integration regression: private databases and spare ports, leaving active servers untouched.
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,existsSync,rmSync,mkdirSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createServer} from 'node:net';
import {randomUUID} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
import {openStore} from '../booking-engine/domain/store.mjs';
import {seed} from '../booking-engine/scripts/seed.mjs';
import {today} from '../booking-engine/domain/booking.mjs';
import {bridgeKey} from '../booking-engine/domain/bridge.mjs';

const root=resolve(import.meta.dirname,'..');
if(!existsSync(resolve(root,'.next/BUILD_ID')))throw Error('Run npm run build before the integration test.');
mkdirSync(resolve(root,'booking-engine/data'),{recursive:true});
const temp=mkdtempSync(resolve(root,'booking-engine/data/integration-'));
const children=[];
async function port(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
function launch(args,env){const p=spawn(process.execPath,args,{cwd:root,env:{...process.env,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';p.stdout.on('data',x=>output+=x);p.stderr.on('data',x=>output+=x);children.push(p);return {p,output:()=>output};}
async function ready(url,process){let last='';for(let i=0;i<40;i++){if(process.p.exitCode!==null)throw Error('Startup failed: '+process.output());try{const r=await fetch(url,{signal:AbortSignal.timeout(1500)});if(r.ok)return;last=r.status+' '+(await r.text()).slice(0,500);}catch(e){last=e.message;}await delay(300);}throw Error('Startup timed out: '+last+'\n'+process.output());}
try{
 const enginePort=await port(),websitePort=await port(),engine='http://127.0.0.1:'+enginePort,website='http://127.0.0.1:'+websitePort;
 const file=resolve(temp,'booking.sqlite'),sql=openStore(file);seed(sql);sql.close();
 process.env.HOTEL_DB_PATH=resolve(temp,'hotel.sqlite');
 const {db,closeDb}=await import('../lib/db.ts');
 const {createSession}=await import('../lib/security.ts');
 const adminId=randomUUID();db().prepare('INSERT INTO admins VALUES(?,?,?)').run(adminId,'integration@example.test','disabled-password');
 const adminCookie='ramayana_session='+createSession(adminId);closeDb();
 const stack=launch(['scripts/run-hotel.mjs','start'],{BOOKING_PORT:String(enginePort),HOTEL_PORT:String(websitePort),BOOKING_DB:file,BOOKING_MODE:'sandbox',BOOKING_EMAIL_ENABLED:'false',BOOKING_EMAIL_AUTOSEND:'false',APP_URL:website,BOOKING_ENGINE_URL:'',HOTEL_DB_PATH:process.env.HOTEL_DB_PATH});
 await ready(engine+'/api/v1/health',stack);
 await ready(website+'/booking/api/v1/health',stack);
 const jar=new Map();
 async function call(path,data,headers={},useCookies=true){
  const r=await fetch(website+'/booking/api/v1/'+path,{method:data===undefined?'GET':'POST',headers:{Origin:website,'Content-Type':'application/json',...(useCookies?{Cookie:[...jar].map(([k,v])=>k+'='+v).join('; ')}:{}),...headers},...(data!==undefined?{body:JSON.stringify(data)}:{})});
  for(const cookie of r.headers.getSetCookie()){assert.match(cookie,/Path=\/booking;/);assert.match(cookie,/HttpOnly/);const [k,v]=cookie.split(';')[0].split('=');jar.set(k,v);}
  return {status:r.status,body:await r.json(),headers:r.headers};
 }
 const date=n=>new Date(Date.parse(today())+n*86400000).toISOString().slice(0,10);
 const query=new URLSearchParams({room:'junior-suite',plan:'breakfast',checkIn:date(10),checkOut:date(12),adults:'2',lang:'id'});
 const handoff=await fetch(website+'/book?'+query,{redirect:'manual'});assert.equal(handoff.status,307);
 const destination=new URL(handoff.headers.get('location'));assert.equal(destination.origin,website);assert.equal(destination.pathname,'/booking');for(const [key,value]of query)assert.equal(destination.searchParams.get(key),value);
 const forwarded=await fetch(website+'/book?'+query,{redirect:'manual',headers:{'x-forwarded-host':'untrusted.example','x-forwarded-proto':'https'}});assert.equal(new URL(forwarded.headers.get('location')).origin,website,'Configured public origin wins over internal and untrusted forwarded hosts');
 const html=await (await fetch(destination)).text();assert.match(html,/<base href="\/booking\/">/);
 for(const asset of ['app.js','paths.js','hotel-brand.css','assets/courtyard.jpg'])assert.equal((await fetch(website+'/booking/'+asset)).status,200,asset);
 assert.equal((await call('admin')).status,401);
 assert.equal((await call('admin',undefined,{'x-booking-bridge':bridgeKey(),'x-booking-admin':Buffer.from(JSON.stringify({id:adminId,email:'spoof@example.test'})).toString('base64url')})).status,401,'Client headers must never grant staff access');
 const forged=await fetch(engine+'/api/v1/admin',{headers:{'x-booking-bridge':'x'.repeat(64),'x-booking-admin':'forged'}});assert.equal(forged.status,401);
 const snapshot=await call('admin',undefined,{Cookie:adminCookie});assert.equal(snapshot.status,200);assert.equal(snapshot.body.actor.id,'website:'+adminId);
 assert.equal((await call('checkout-session',{}, {Origin:'https://untrusted.example'})).status,403);
 const prefs=(await call('admin/experience',undefined,{Cookie:adminCookie})).body.settings;
 const changed=await call('admin/settings',{...prefs,decoration:270000},{Cookie:adminCookie});assert.equal(changed.status,200);
 assert.equal((await call('experience')).body.settings.decoration,270000);
 assert.equal((await call('admin/promo',{code:'QA-PROMO',title:'Integration promo',percent:10,from:today(),to:date(30),active:true},{Cookie:adminCookie})).status,200);
 const input={checkIn:date(10),checkOut:date(12),rooms:[{roomId:'junior-suite',adults:2,children:[],plan:'breakfast'}],addOns:['celebration'],promo:'QA-PROMO',source:'hotel-website'};
 const q=await call('quotes',input);assert.equal(q.status,201);assert.equal(q.body.rooms[0].total,1600000);assert.equal(q.body.extrasTotal,270000);assert.equal(q.body.total,q.body.subtotal-q.body.discount);
 const holdKey=randomUUID(),held=await call('holds',{quoteId:q.body.id},{'Idempotency-Key':holdKey});assert.equal(held.status,201);assert.equal((await call('holds',{quoteId:q.body.id},{'Idempotency-Key':holdKey})).body.id,held.body.id);
 assert.equal((await call('checkout-session',{})).status,200);
 const payload={holdId:held.body.id,guest:{name:'Isolated integration test',email:'qa@example.test',phone:'+628000000000',consent:true}},reserveKey=randomUUID();
 const bookingResult=await call('reservations',payload,{'Idempotency-Key':reserveKey});assert.equal(bookingResult.status,201);assert.equal((await call('reservations',payload,{'Idempotency-Key':reserveKey})).body.id,bookingResult.body.id);
 const pay=(await call('payments',{})).body;assert.ok(pay.id);assert.equal((await call('sandbox/settle',{paymentId:pay.id,status:'paid'})).body.status,'confirmed');
 const final=(await call('booking')).body;assert.equal(final.paid,final.total);assert.equal(final.quote.source,'hotel-website');
 const latest=(await call('admin',undefined,{Cookie:adminCookie})).body;assert.ok(latest.reservations.some(r=>r.id===final.id&&r.status==='confirmed'));assert.equal(latest.totals.paid,final.total);
 const cookie=[...jar].map(([k,v])=>k+'='+v).join('; ');
 const pdf=await fetch(website+'/booking/voucher.pdf',{headers:{Cookie:cookie}});assert.equal(pdf.status,200);assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,5).toString(),'%PDF-');
 assert.equal((await fetch(website+'/booking/admin/voucher.pdf?id='+final.id,{headers:{Cookie:adminCookie}})).status,200);
 assert.equal((await fetch(website+'/booking/admin/voucher.pdf?id='+final.id)).status,401);
 const returnLink=await fetch(website+'/booking/website?path=/admin',{redirect:'manual'});assert.equal(returnLink.headers.get('location'),website+'/admin');
 console.log('PASS: website handoff, same-origin proxy/assets/cookies, staff SSO + spoof rejection, settings/promo sync, idempotent booking, payment, admin totals, guest/internal PDF. Isolated databases only.');
}finally{
 await Promise.all(children.reverse().map(p=>new Promise(resolveStop=>{if(p.exitCode!==null)return resolveStop();p.once('exit',resolveStop);if(process.platform==='win32')spawnSync('taskkill',['/PID',String(p.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});else p.kill();})));
 const target=resolve(temp);assert.ok(target.startsWith(resolve(root,'booking-engine/data')+sep));rmSync(target,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}
