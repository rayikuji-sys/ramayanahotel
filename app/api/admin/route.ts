import {cookies} from 'next/headers';
import {randomUUID} from 'node:crypto';
import {audit,content,db,inquiries,saveContent,saveInquiry,settings} from '@/lib/db';
import {digest,readBody,sameOrigin,sessionAdmin} from '@/lib/security';
import {contentSchema,inquiryUpdateSchema,settingsSchema} from '@/lib/validation';
import {eventDatabase} from '@/lib/events-store';
import {plannerConfig} from '@/lib/planner-store';
export const dynamic='force-dynamic';
async function user(){return sessionAdmin((await cookies()).get('ramayana_session')?.value);}
export async function GET(){
 if(!await user())return Response.json({error:'Please sign in.'},{status:401});
 return Response.json({items:content(true),settings:settings(),inquiries:inquiries()},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Invalid origin'},{status:403});
 const admin=await user();if(!admin)return Response.json({error:'Please sign in.'},{status:401});
 try{
  const body=await readBody(request) as {action:string;data:unknown};
  if(body.action==='logout'){
   const jar=await cookies();const token=jar.get('ramayana_session')?.value;if(token)db().prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(token));jar.delete('ramayana_session');return Response.json({ok:true});
  }
  if(body.action==='content'){
   const parsed=contentSchema.safeParse(body.data);if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
   const now=new Date().toISOString();const x=parsed.data;
   saveContent({...x,verifiedBy:x.verified?admin.email:'',verifiedAt:x.verified?now:'',updatedAt:now});audit(admin.id,'content.update',x.id);
  }else if(body.action==='settings'){
   const parsed=settingsSchema.safeParse(body.data);if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
   db().prepare('UPDATE settings SET payload=? WHERE id=1').run(JSON.stringify(parsed.data));audit(admin.id,'settings.update','hotel');
  }else if(body.action==='inquiry'){
   const parsed=inquiryUpdateSchema.safeParse(body.data);if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
   const x=parsed.data;
   const existing=inquiries().find(i=>i.id===x.id);if(!existing)return Response.json({error:'Request not found'},{status:404});
   saveInquiry({...existing,status:x.status,staffNote:x.staffNote,salesOwner:x.salesOwner??existing.salesOwner,followUpDate:x.followUpDate??existing.followUpDate,updatedAt:new Date().toISOString()});audit(admin.id,'inquiry.update',x.id);
  }else if(body.action==='deleteInquiry'){
   plannerConfig();
   const x=body.data as {id:string};if(typeof x.id!=='string')return Response.json({error:'Invalid request'},{status:400});
   const sql=eventDatabase();sql.exec('BEGIN IMMEDIATE');try{sql.prepare('DELETE FROM event_layouts WHERE inquiry_id=?').run(x.id);sql.prepare('DELETE FROM event_attachments WHERE inquiry_id=?').run(x.id);sql.prepare('DELETE FROM inquiries WHERE id=?').run(x.id);sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}audit(admin.id,'inquiry.delete',x.id);
  }else return Response.json({error:'Unknown action',reference:randomUUID()},{status:400});
  return Response.json({ok:true});
 }catch{return Response.json({error:'Unable to save. Check your input and try again.'},{status:400});}
}
