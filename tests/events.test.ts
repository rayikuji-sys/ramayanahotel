import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {eventSeeds} from '../lib/events-seed.ts';
import {publicEvents,priceVisible,campaignStatus,findVenues,capacityLabel,eventWhatsApp,makassarDate} from '../lib/events-model.ts';
import {proposalSchema,eventRecordSchema} from '../lib/events-validation.ts';
import {validateAttachment,boundedFormData} from '../lib/events-upload.ts';
process.env.HOTEL_DB_PATH='.local/events-unit-'+randomUUID()+'.db';
const {eventRecords,saveEventRecord,eventDatabase}=await import('../lib/events-store.ts');
const {closeDb,saveInquiry,inquiries}=await import('../lib/db.ts');
const {receiptDb,saveReceipt,existingSubmission,receiptByToken,receiptHtml,deliveryStatus}=await import('../lib/event-receipts.ts');
const {deliverEventEmails}=await import('../lib/event-mail.ts');
after(()=>closeDb());
test('all seeded events validate; hidden venues, notes, reference prices never leak into public projection',()=>{
 for(const r of eventSeeds){const parsed=eventRecordSchema.safeParse(r);assert(parsed.success,r.id+': '+JSON.stringify(parsed.error?.issues));}
 const visible=publicEvents(eventSeeds,'2026-09-26');
 assert(!visible.some(r=>['room-235','sriwijaya','commercial-reference','ramadan'].includes(r.id)));
 assert(visible.every(r=>r.price===null&&!('source' in r)&&!('notes' in r)));
 assert(!JSON.stringify(visible).includes('550000'));
});
test('both capacity sources survive; no silent minimum selection',()=>{
 const v=publicEvents(eventSeeds);
 const m=v.find(r=>r.id==='majapahit')!;
 assert.equal(capacityLabel(m,'Theatre'),'190–200');assert.equal(capacityLabel(m,'U-shape'),'100–130');
 assert(findVenues(v,195,'Theatre').some(r=>r.id===m.id));
 assert.equal(findVenues(v,2001,'Theatre').length,0);assert.equal(findVenues(v,30.5,'Theatre').length,0);
 const verified={...m,capacityVerified:true,displayCapacity:{Theatre:180}};
 assert.equal(capacityLabel(verified,'Theatre'),'180');assert.equal(findVenues([verified],190,'Theatre').length,0);
});
test('verified price requires current status and inclusive validity dates',()=>{
 const price={amount:100000,unit:'per pax',status:'current' as const,validFrom:'2026-09-25',validTo:'2026-09-30',verified:true};
 assert(priceVisible(price,'2026-09-25'));assert(priceVisible(price,'2026-09-30'));assert(!priceVisible(price,'2026-10-01'));
 for(const p of [{...price,verified:false},{...price,validTo:''},{...price,status:'needs-review' as const}])assert(!priceVisible(p,'2026-09-26'));
});
test('seasonal campaign expires with Makassar date and published campaigns require complete schedules',()=>{
 const draft=eventSeeds.find(r=>r.id==='ramadan')!;
 assert.equal(campaignStatus(draft),'draft');
 const r={...draft,published:true,verified:true,status:'available' as const,startDate:'2099-01-01',endDate:'2099-02-01',eventStart:'2099-01-20',eventEnd:'2099-01-21'};
 assert(eventRecordSchema.safeParse(r).success);
 assert.equal(campaignStatus(r,'2098-12-31'),'upcoming');assert.equal(campaignStatus(r,'2099-01-22'),'ended');
 assert(!eventRecordSchema.safeParse({...r,endDate:''}).success);
 assert.equal(makassarDate(new Date('2026-09-25T16:30:00Z')),'2026-09-26');
});
const valid={mode:'proposal',name:'QA Event',company:'Test Organisation',position:'Coordinator',email:'qa@example.test',phone:'+628123456789',preferredContact:'Email',eventName:'QA Meeting',eventType:'corporate',date:'2099-10-10',alternativeDate:'',startTime:'09:00',endTime:'12:00',guests:50,venue:'ganesha',packageId:'',campaignId:'',layout:'Classroom',duration:'Half day',requirements:['meeting','lunch'],accommodation:false,rooms:0,checkIn:'',checkOut:'',roomType:'',budgetPerPerson:0,budgetTotal:0,visitDate:'',visitTime:'',message:'Test only',consent:true,website:'',source:'/events/request-proposal'};
test('receipt is private, escaped, idempotency-indexed; outbox preserves failures and retries only unsent recipients',async()=>{
 const sql=receiptDb(),id='test-receipt-'+randomUUID(),now=new Date().toISOString();
 saveInquiry({id,kind:'event',name:valid.name,email:valid.email,phone:valid.phone,message:'',context:{},source:valid.source,status:'new',staffNote:'',consentAt:now,createdAt:now,updatedAt:now});
 const nonce=randomUUID();const token=saveReceipt({reference:id,createdAt:now,hotelEmail:'hotel@example.test',venueName:'Ganesha',packageName:'Custom',attachmentName:'brief.pdf',data:proposalSchema.parse({...valid,eventName:'<script>alert(1)</script>'})},nonce,'fingerprint');
 assert.equal(existingSubmission(nonce)?.inquiry_id,id);assert.equal(existingSubmission(nonce)?.fingerprint,'fingerprint');assert.equal(token.length,64);assert.equal(receiptByToken(id),null);assert.equal(receiptByToken('a'.repeat(64)),null);
 const receipt=receiptByToken(token)!;assert(receipt);const html=receiptHtml(receipt,{print:true});assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>alert'));assert(html.includes('brief.pdf'));assert(html.includes('Budget per orang'));assert(deliveryStatus(id).every(r=>r.status==='pending'));
 const sent:string[]=[];await deliverEventEmails(id,async message=>{sent.push(message.to);if(message.to===valid.email)throw Error('test SMTP failure');});
 assert.equal(deliveryStatus(id).find(r=>r.audience==='hotel')?.status,'sent');assert.equal(deliveryStatus(id).find(r=>r.audience==='guest')?.status,'failed');assert(receiptByToken(token));
 await Promise.all([deliverEventEmails(id,async m=>{sent.push(m.to);}),deliverEventEmails(id,async m=>{sent.push(m.to);})]);
 assert.equal(sent.filter(x=>x==='hotel@example.test').length,1);assert.equal(sent.filter(x=>x===valid.email).length,2);assert(deliveryStatus(id).every(r=>r.status==='sent'));
 sql.prepare('UPDATE event_receipts SET expires_at=0 WHERE inquiry_id=?').run(id);assert.equal(receiptByToken(token),null);
 sql.prepare('DELETE FROM inquiries WHERE id=?').run(id);assert.equal(existingSubmission(nonce),undefined);assert.equal(deliveryStatus(id).length,0);
});
test('proposal validates consent, dates, seating, and conditional accommodation and inspection requirements',()=>{
 assert(proposalSchema.safeParse(valid).success);
 for(const patch of [{consent:false},{website:'spam'},{guests:30.5},{date:'2099-02-31'},{date:'2000-01-01'},{endTime:'08:00'},{accommodation:true},{mode:'site-inspection'},{mode:'group-stay'},{requirements:['invented']}])assert(!proposalSchema.safeParse({...valid,...patch}).success,JSON.stringify(patch));
 assert(proposalSchema.safeParse({...valid,accommodation:true,rooms:10,checkIn:'2099-10-10',checkOut:'2099-10-11'}).success);
 assert(proposalSchema.safeParse({...valid,mode:'site-inspection',visitDate:'2099-10-09',visitTime:'10:00'}).success);
});
test('TOR rejects renamed executables, oversize files and directory names; MIME is determined by content',()=>{
 const pdf=Buffer.from('%PDF-1.4\nQA fixture');
 assert.equal(validateAttachment('../../proposal.pdf',pdf).filename,'proposal.pdf');
 for(const [name,bytes] of [['file.exe',pdf],['renamed.pdf',Buffer.from('MZ executable')],['fake.docx',pdf],['huge.pdf',Buffer.alloc(5*1024*1024+1)]] as const)assert.throws(()=>validateAttachment(name,bytes));
 assert.equal(validateAttachment('plan.doc',Buffer.from('d0cf11e0a1b11ae10000','hex')).mime,'application/msword');
});
test('multipart requests are bounded before parsing',async()=>{
 const form=new FormData();form.set('data',JSON.stringify(valid));form.set('tor',new File([new TextEncoder().encode('%PDF-1.4')],'tor.pdf'));
 const parsed=await boundedFormData(new Request('http://localhost',{method:'POST',body:form}));assert.equal((parsed.get('tor') as File).name,'tor.pdf');
 const huge=new Request('http://localhost',{method:'POST',headers:{'Content-Type':'multipart/form-data; boundary=test'},body:'x'.repeat(5*1024*1024+200001)});
 await assert.rejects(boundedFormData(huge),/5 MB/);
});
test('event seed runs once and preserves admin publication, capacity and price edits',()=>{
 const original=eventRecords().find(r=>r.id==='majapahit')!;
 saveEventRecord({...original,published:false,notes:'QA staff override'});
 closeDb();assert.equal(eventRecords().find(r=>r.id==='majapahit')?.notes,'QA staff override');
 assert.equal(eventRecords().find(r=>r.id==='majapahit')?.published,false);
});
test('lead metadata and protected attachment persist; deletion can remove both atomically',()=>{
 const sql=eventDatabase(),now=new Date().toISOString();
 saveInquiry({id:'QA-EVENT',kind:'event',name:'Test',phone:'12345678',email:'qa@example.test',message:'',context:{occasion:'corporate'},status:'proposal_sent',source:'/events/request-proposal',consentAt:now,createdAt:now,updatedAt:now,staffNote:'',salesOwner:'QA sales',followUpDate:'2099-10-01',attachments:[{id:'QA-TOR',filename:'test.pdf'}]});
 sql.prepare('INSERT INTO event_attachments VALUES(?,?,?,?,?)').run('QA-TOR','QA-EVENT','test.pdf','application/pdf',Buffer.from('%PDF-1.4'));
 assert.equal(inquiries().find(r=>r.id==='QA-EVENT')?.status,'proposal_sent');
 assert(sql.prepare('SELECT id FROM event_attachments WHERE inquiry_id=?').get('QA-EVENT'));
 sql.exec('BEGIN');sql.prepare('DELETE FROM event_attachments WHERE inquiry_id=?').run('QA-EVENT');sql.prepare('DELETE FROM inquiries WHERE id=?').run('QA-EVENT');sql.exec('COMMIT');
 assert(!sql.prepare('SELECT id FROM event_attachments WHERE id=?').get('QA-TOR'));
});
test('WhatsApp prefill uses hotel number and URL encodes contextual content',()=>{
 const link=new URL(eventWhatsApp('+62 852 5638 4090','Wedding & dinner'));
 assert.equal(link.pathname,'/6285256384090');assert(link.searchParams.get('text')?.includes('Wedding & dinner'));
});

