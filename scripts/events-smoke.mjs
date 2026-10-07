import {randomUUID,randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const port=3002,origin='http://127.0.0.1:'+port;
process.env.HOTEL_DB_PATH='.local/events-smoke-'+randomUUID()+'.db';
process.env.APP_URL=origin;
// Keep the isolated smoke test from sending real notifications.
process.env.SMTP_HOST='';
process.env.TRUST_PROXY='false';
process.env.COOKIE_SECURE='false';
const {db,closeDb}=await import('../lib/db.ts');
const {hashPassword}=await import('../lib/security.ts');
const {eventRecords}=await import('../lib/events-store.ts');
const password=randomBytes(24).toString('hex');
db().prepare('INSERT INTO admins VALUES(?,?,?)').run('qa-admin','qa-events@example.test',hashPassword(password));
eventRecords();closeDb();
let logs='';const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p',String(port)],{cwd:process.cwd(),env:process.env,windowsHide:true,stdio:['ignore','pipe','pipe']});
server.stdout.on('data',b=>{logs+=b;});server.stderr.on('data',b=>{logs+=b;});
let checks=0;
try{
 for(let attempt=0;attempt<50;attempt++){if(server.exitCode!==null)throw new Error('QA server exited: '+logs);try{const r=await fetch(origin+'/events');if(r.status===200)break;}catch{}await new Promise(r=>setTimeout(r,600));}
 for(const path of ['/','/events','/events/venues','/events/venues/ganesha','/events/packages','/events/packages/wedding-bahagia','/events/corporate-meeting','/events/government-meeting','/events/wedding','/events/gathering','/events/birthday','/events/manasik','/events/romantic-dinner','/events/seasonal','/events/ramadan','/events/new-years-eve','/events/layout-planner','/events/request-proposal','/events/site-inspection','/events/group-accommodation','/rooms','/gallery']){
  const r=await fetch(origin+path);assert.equal(r.status,200,path);const html=await r.text();assert(html.includes('<main'),path+' missing main');if(path.startsWith('/events')){assert(!html.includes('commercial-reference'),path+' leaked internal records');assert(!html.includes('28500000'),path+' leaked unverified prices');}checks++;
 }
 assert.equal((await fetch(origin+'/events/venues/room-235')).status,404);checks++;
 assert.equal((await fetch(origin+'/events/packages/nonexistent')).status,404);checks++;
 const redirect=await fetch(origin+'/events/bukber',{redirect:'manual'});assert.equal(redirect.status,307);assert.equal(redirect.headers.get('location'),'/events/ramadan');checks++;
 assert.equal((await fetch(origin+'/api/admin/events')).status,401);assert.equal((await fetch(origin+'/api/admin/events/attachments/missing')).status,401);checks+=2;
 const login=await fetch(origin+'/api/admin/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'qa-events@example.test',password})});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];checks++;
 const auth={Cookie:cookie,Origin:origin,'Content-Type':'application/json'};
 for(const path of ['/api/inquiries','/api/admin/login']){
  for(const [body,type,status] of [['{','application/json',400],['null','application/json',400],['{}','text/plain',415],['"'+'x'.repeat(25000)+'"','application/json',413]]){
   const response=await fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':type},body});assert.equal(response.status,status,path+' invalid request');checks++;
  }
 }
 const records=(await (await fetch(origin+'/api/admin/events',{headers:auth})).json()).records;assert(records.length>25);checks++;
 const payload={mode:'proposal',name:'QA Event',company:'QA Test',position:'Coordinator',email:'qa@example.test',phone:'+628123456789',preferredContact:'Email',eventName:'QA meeting',eventType:'corporate',date:'2099-10-10',alternativeDate:'',startTime:'09:00',endTime:'12:00',guests:50,venue:'ganesha',packageId:'private-business',campaignId:'',layout:'Classroom',duration:'Half day',requirements:['meeting','lunch'],accommodation:false,rooms:0,checkIn:'',checkOut:'',roomType:'',budgetPerPerson:0,budgetTotal:0,visitDate:'',visitTime:'',message:'Automated QA fixture',consent:true,website:'',source:'/events/request-proposal'};
 function form(data=payload,file='%PDF-1.4\nQA fixture',name='tor.pdf'){const f=new FormData();f.set('data',JSON.stringify(data));if(file!==null)f.set('tor',new File([file],name,{type:'application/pdf'}));return f;}
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:'https://example.test'},body:form()})).status,403);checks++;
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form({...payload,consent:false})})).status,400);checks++;
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form(payload,'MZ executable')})).status,400);checks++;
 const planner=await (await fetch(origin+'/api/events/planner')).json();assert.equal(planner.rooms.length,4);assert(!planner.rooms.some(r=>r.roomId==='room-235'));checks++;
 const customLayout={version:1,roomId:'ganesha',roomScaleVersion:planner.rooms.find(r=>r.roomId==='ganesha').version,presetOrigin:'Empty',guestCount:50,objects:[{instanceId:'test-chair',furnitureId:'chair',x:30,y:30,rotation:0}],createdAt:new Date().toISOString()};
 assert.equal((await fetch(origin+'/api/admin/planner')).status,401);checks++;
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form({...payload,setupType:'custom',customLayout:{...customLayout,roomId:'majapahit'}})})).status,400);checks++;
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form({...payload,setupType:'custom',customLayout:{...customLayout,objects:[{...customLayout.objects[0],x:-1}]}})})).status,400);checks++;
 payload.setupType='custom';payload.customLayout=customLayout;
 const result=await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form()});assert.equal(result.status,201,await result.clone().text());const receipt=await result.json();assert(receipt.reference.startsWith('RHM-EVT-'));checks++;
 const admin=(await (await fetch(origin+'/api/admin',{headers:auth})).json());const lead=admin.inquiries.find(i=>i.id===receipt.reference);assert.equal(lead.context.company,'QA Test');assert.equal(lead.attachments.length,1);const attachmentId=lead.attachments[0].id;checks++;
 assert.equal((await fetch(origin+'/api/admin/events/attachments/'+attachmentId)).status,401);checks++;
 const download=await fetch(origin+'/api/admin/events/attachments/'+attachmentId,{headers:auth});assert.equal(download.status,200);assert(download.headers.get('content-disposition').includes('attachment'));assert((await download.text()).startsWith('%PDF'));checks++;
 assert.equal((await fetch(origin+'/api/admin/events/layouts/'+lead.id)).status,401);checks++;
 const savedLayout=await (await fetch(origin+'/api/admin/events/layouts/'+lead.id,{headers:auth})).json();assert.equal(savedLayout.layout.objects.length,1);assert.equal(savedLayout.room.roomId,'ganesha');assert.equal(lead.context.customLayout,'attached');checks++;
 const update=await fetch(origin+'/api/admin',{method:'POST',headers:auth,body:JSON.stringify({action:'inquiry',data:{id:lead.id,status:'proposal_sent',staffNote:'QA fixture',salesOwner:'QA Sales',followUpDate:'2099-10-01'}})});assert.equal(update.status,200);checks++;
 const invalidUpdate=await fetch(origin+'/api/admin',{method:'POST',headers:auth,body:JSON.stringify({action:'inquiry',data:{id:lead.id,status:'closed',staffNote:'Invalid date',followUpDate:'2099-02-30'}})});assert.equal(invalidUpdate.status,400);checks++;
 const preserved=(await (await fetch(origin+'/api/admin',{headers:auth})).json()).inquiries.find(i=>i.id===lead.id);assert.equal(preserved.followUpDate,'2099-10-01');assert.equal(preserved.status,'proposal_sent');checks++;
 const sample=records.find(r=>r.id==='private-business');
 const save=await fetch(origin+'/api/admin/events',{method:'POST',headers:auth,body:JSON.stringify({...sample,title:'QA edited package',published:false})});assert.equal(save.status,200,await save.clone().text());assert(!(await (await fetch(origin+'/events/packages')).text()).includes('QA edited package'));checks++;
 const expiredCampaign={...records.find(r=>r.id==='ramadan'),published:true,verified:true,status:'available',startDate:'2020-01-01',endDate:'2020-02-01',eventStart:'2020-01-10',eventEnd:'2020-01-11'};
 assert.equal((await fetch(origin+'/api/admin/events',{method:'POST',headers:auth,body:JSON.stringify(expiredCampaign)})).status,200);
 const expiredPage=await (await fetch(origin+'/events/ramadan')).text();assert(expiredPage.includes('Program sebelumnya'));assert(!expiredPage.includes('Tanyakan program'));checks++;
 assert.equal((await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form({...payload,packageId:'',campaignId:'ramadan',eventType:'ramadan'},null)})).status,400);checks++;
 for(const mode of ['site-inspection','group-stay']){
  const data={...payload,packageId:'',mode,...mode==='site-inspection'?{visitDate:'2099-10-09',visitTime:'10:00'}:{accommodation:true,rooms:10,checkIn:'2099-10-10',checkOut:'2099-10-11'}};
  const r=await fetch(origin+'/api/events/inquiries',{method:'POST',headers:{Origin:origin},body:form(data,null)});assert.equal(r.status,201,await r.clone().text());checks++;
 }
 assert.equal((await fetch(origin+'/api/admin',{method:'POST',headers:auth,body:JSON.stringify({action:'deleteInquiry',data:{id:lead.id}})})).status,200);
 assert.equal((await fetch(origin+'/api/admin/events/attachments/'+attachmentId,{headers:auth})).status,404);checks++;
 assert.equal((await fetch(origin+'/api/admin/events/layouts/'+lead.id,{headers:auth})).status,404);checks++;
 console.log('PASS: '+checks+' HTTP assertions; routes, private uploads, CRM, CMS, and campaign closure.');
}catch(error){writeFileSync('.local/events-smoke-server.log',logs);console.error(error);process.exitCode=1;}
finally{server.kill();closeDb();}

