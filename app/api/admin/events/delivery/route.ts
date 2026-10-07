import {cookies} from 'next/headers';
import {sessionAdmin,sameOrigin,readBody} from '@/lib/security';
import {audit} from '@/lib/db';
import {receiptForAdmin,receiptPath,deliveryStatus} from '@/lib/event-receipts';
import {deliverEventEmails,mailConfigured} from '@/lib/event-mail';
export const runtime='nodejs';
export const dynamic='force-dynamic';
async function user(){return sessionAdmin((await cookies()).get('ramayana_session')?.value);}
function result(id:string){const r=receiptForAdmin(id);return {configured:mailConfigured(),delivery:deliveryStatus(id),receiptUrl:r?receiptPath(r.token):null};}
export async function GET(request:Request){if(!await user())return Response.json({error:'Please sign in.'},{status:401});return Response.json(result(new URL(request.url).searchParams.get('id')||''),{headers:{'Cache-Control':'no-store'}});}
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Invalid origin'},{status:403});const admin=await user();if(!admin)return Response.json({error:'Please sign in.'},{status:401});try{const body=await readBody(request) as {id?:string};if(typeof body.id!=='string'||!receiptForAdmin(body.id))return Response.json({error:'Bukti tidak ditemukan.'},{status:404});await deliverEventEmails(body.id);audit(admin.id,'event.email.retry',body.id);return Response.json(result(body.id),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Status email belum dapat diperbarui.'},{status:400});}}
