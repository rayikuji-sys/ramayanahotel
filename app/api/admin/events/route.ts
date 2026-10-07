import {cookies} from 'next/headers';
import {sameOrigin,sessionAdmin,readBody} from '@/lib/security';
import {eventRecords,saveEventRecord} from '@/lib/events-store';
import {eventRecordSchema} from '@/lib/events-validation';
import {audit} from '@/lib/db';
export async function GET(){if(!sessionAdmin((await cookies()).get('ramayana_session')?.value))return Response.json({error:'Please sign in.'},{status:401});return Response.json({records:eventRecords()},{headers:{'Cache-Control':'no-store'}});}
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Invalid origin'},{status:403});
 const admin=sessionAdmin((await cookies()).get('ramayana_session')?.value);if(!admin)return Response.json({error:'Please sign in.'},{status:401});
 try{const parsed=eventRecordSchema.safeParse(await readBody(request,64000));if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
 const r=parsed.data;if(eventRecords().some(x=>x.id!==r.id&&x.kind===r.kind&&x.slug===r.slug))return Response.json({error:'Slug sudah digunakan.'},{status:409});
 saveEventRecord(r);audit(admin.id,'events.update',r.id);return Response.json({ok:true});
 }catch{return Response.json({error:'Perubahan belum tersimpan.'},{status:400});}
}

