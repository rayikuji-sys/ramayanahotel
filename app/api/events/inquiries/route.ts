import {randomUUID,createHash} from 'node:crypto';
import {EVENTS_EMAIL,receiptDb,existingSubmission,saveReceipt,receiptPath,deliveryStatus} from '@/lib/event-receipts';
import {deliverEventEmails,mailConfigured} from '@/lib/event-mail';
import {saveInquiry} from '@/lib/db';
import {eventRecords,eventDatabase} from '@/lib/events-store';
import {publicEvents,campaignStatus,makassarDate} from '@/lib/events-model';
import {proposalSchema} from '@/lib/events-validation';
import {boundedFormData,validateAttachment} from '@/lib/events-upload';
import {sameOrigin,clientKey,rateLimit} from '@/lib/security';
import {publicPlanner} from '@/lib/planner-store';
import {validateLayout} from '@/lib/planner-model';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Permintaan tidak diizinkan.'},{status:403});
 if(!rateLimit('event:'+clientKey(request),process.env.TRUST_PROXY==='true'?8:40,3600000))return Response.json({error:'Terlalu banyak permintaan. Coba kembali nanti.'},{status:429});
 try{
  const form=await boundedFormData(request);const raw=form.get('data');
  if(typeof raw!=='string'||raw.length>180000)throw new Error('Data permintaan tidak valid.');
  const parsed=proposalSchema.safeParse(JSON.parse(raw));
  if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
  const v=parsed.data;const records=publicEvents(eventRecords());
  const planner=v.customLayout?publicPlanner():null;
  if(v.customLayout&&planner){const error=validateLayout(v.customLayout,planner);if(error)return Response.json({error},{status:400});}
  for(const [key,kind] of [['venue','venue'],['packageId','package'],['campaignId','campaign']] as const){
   if(v[key]&&!records.some(r=>r.id===v[key]&&r.kind===kind))throw new Error('Pilihan '+key+' tidak tersedia. Pilih kembali.');
  }
  if(v.campaignId){const campaign=records.find(r=>r.id===v.campaignId)!;if(!campaign.inquiryEnabled||['ended','sold-out','draft'].includes(campaignStatus(campaign))||(campaign.bookingDeadline&&campaign.bookingDeadline<makassarDate()))throw new Error('Permintaan untuk program ini sudah ditutup.');}
  const tor=form.get('tor');let attachment:{id:string;filename:string;mime:string;bytes:Buffer}|undefined;
  if(tor instanceof File&&tor.size){const bytes=Buffer.from(await tor.arrayBuffer());attachment={id:randomUUID(),...validateAttachment(tor.name,bytes),bytes};}
  const nonce=form.get('submissionId');const submissionId=typeof nonce==='string'&&/^[a-f0-9-]{36}$/i.test(nonce)?nonce:randomUUID();
  const fingerprint=createHash('sha256').update(JSON.stringify(v)).update(attachment?.filename||'').update(attachment?.bytes||'').digest('hex');
  receiptDb();const previous=existingSubmission(submissionId);
  if(previous){if(previous.fingerprint!==fingerprint)return Response.json({error:'Permintaan ini sudah tersimpan dengan detail berbeda. Muat ulang halaman untuk membuat permintaan baru.'},{status:409});return Response.json({ok:true,reference:previous.inquiry_id,receiptUrl:receiptPath(previous.token),delivery:await deliverEventEmails(previous.inquiry_id),emailConfigured:mailConfigured(),hotelEmail:EVENTS_EMAIL},{headers:{'Cache-Control':'no-store'}});}
  const id='RHM-EVT-'+new Date().getFullYear()+'-'+randomUUID().slice(0,8).toUpperCase(),now=new Date().toISOString();
  const {name,email,phone,message,source,consent,website,requirements,customLayout,...brief}=v;void consent;void website;
  const context=Object.fromEntries(Object.entries(brief).map(([k,x])=>[k,typeof x==='boolean'?(x?'Ya':'Tidak'):x])) as Record<string,string|number>;
  context.requirements=requirements.join(', ');context.occasion=v.eventType;
  if(customLayout)context.customLayout='attached';
  const sql=eventDatabase();let token='';sql.exec('BEGIN IMMEDIATE');
  try{
   saveInquiry({id,kind:'event',name,email,phone,message,source,context,status:'new',staffNote:'',consentAt:now,createdAt:now,updatedAt:now,...attachment?{attachments:[{id:attachment.id,filename:attachment.filename}]}:{}});
   if(attachment)sql.prepare('INSERT INTO event_attachments VALUES(?,?,?,?,?)').run(attachment.id,id,attachment.filename,attachment.mime,attachment.bytes);
   if(customLayout&&planner)sql.prepare('INSERT INTO event_layouts VALUES(?,?)').run(id,JSON.stringify({layout:customLayout,room:planner.rooms.find(r=>r.roomId===customLayout.roomId),furniture:planner.furniture}));
   token=saveReceipt({reference:id,createdAt:now,hotelEmail:EVENTS_EMAIL,venueName:records.find(r=>r.id===v.venue)?.title||'Rekomendasi hotel',packageName:records.find(r=>r.id===v.packageId)?.title||'Susun bersama tim hotel',attachmentName:attachment?.filename||'',data:v,...customLayout&&planner?{planner:{layout:customLayout,room:planner.rooms.find(r=>r.roomId===customLayout.roomId)!,furniture:planner.furniture}}:{}},submissionId,fingerprint);
   sql.exec('COMMIT');
  }catch(e){sql.exec('ROLLBACK');throw e;}
  const delivery=await deliverEventEmails(id).catch(()=>deliveryStatus(id));
  return Response.json({ok:true,reference:id,receiptUrl:receiptPath(token),delivery,emailConfigured:mailConfigured(),hotelEmail:EVENTS_EMAIL,message:'Permintaan diterima. Tim hotel akan menghubungi Anda; jadwal belum terkonfirmasi.'},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof Error&&['TOR','Isi berkas','Berkas','Pilihan','Permintaan untuk'].some(s=>e.message.startsWith(s))?e.message:'Permintaan belum tersimpan. Periksa isian dan coba kembali.'},{status:400});}
}

