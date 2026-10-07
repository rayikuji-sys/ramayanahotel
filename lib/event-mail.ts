import nodemailer from 'nodemailer';
import {deliveryStatus,receiptDb,receiptForAdmin,receiptHtml,receiptPath,type Delivery} from './event-receipts.ts';
export function mailConfigured(){try{return Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.SMTP_FROM&&process.env.APP_URL&&['https:','http:'].includes(new URL(process.env.APP_URL).protocol)&&Number(process.env.SMTP_PORT||465)>0);}catch{return false;}}
type Sender=(message:{to:string;subject:string;html:string;text:string;replyTo:string;messageId:string})=>Promise<unknown>;
/** Durable outbox. A failed email never removes the guest's saved inquiry. */
export async function deliverEventEmails(id:string,send?:Sender):Promise<Delivery[]>{
 const record=receiptForAdmin(id);if(!record)return [];
 if(!send&&!mailConfigured())return deliveryStatus(id);
 const url=new URL(receiptPath(record.token),process.env.APP_URL||'http://localhost:3001').href;
 const transport=send?null:nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||465),secure:process.env.SMTP_SECURE!=='false',auth:{user:process.env.SMTP_USER!,pass:process.env.SMTP_PASS!},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000});
 const sender:Sender=send|| (async message=>{const result=await transport!.sendMail({from:process.env.SMTP_FROM,...message});if(!result.accepted?.length||result.rejected?.length)throw Error('SMTP rejected');});
 await Promise.all(deliveryStatus(id).map(async row=>{
  const sql=receiptDb(),claim=sql.prepare("UPDATE event_delivery SET status='sending',attempts=attempts+1,error='',updated_at=? WHERE inquiry_id=? AND audience=? AND (status IN ('pending','failed') OR (status='sending' AND updated_at<?))").run(Date.now(),id,row.audience,Date.now()-120000);
  if(!claim.changes)return;
  try{await sender({to:row.recipient,replyTo:row.audience==='hotel'?record.receipt.data.email:record.receipt.hotelEmail,subject:`${row.audience==='hotel'?'Permintaan acara baru':'Bukti permintaan acara'} · ${id}`,html:receiptHtml(record.receipt,{url}),text:`Ramayana Hotel Makassar\nReferensi: ${id}\nPermintaan tersimpan. Belum merupakan konfirmasi pemesanan.\nBukti lengkap: ${url}`,messageId:`<${id}.${row.audience}@ramayanahotel.local>`});sql.prepare("UPDATE event_delivery SET status='sent',sent_at=?,updated_at=? WHERE inquiry_id=? AND audience=?").run(new Date().toISOString(),Date.now(),id,row.audience);}
  catch{sql.prepare("UPDATE event_delivery SET status='failed',error='Email belum terkirim. Periksa konfigurasi SMTP lalu coba kembali.',updated_at=? WHERE inquiry_id=? AND audience=?").run(Date.now(),id,row.audience);}
 }));
 transport?.close();return deliveryStatus(id);
}
