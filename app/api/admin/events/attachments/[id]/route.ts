import {cookies} from 'next/headers';
import {sessionAdmin} from '@/lib/security';
import {eventDatabase} from '@/lib/events-store';
import {audit} from '@/lib/db';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const admin=sessionAdmin((await cookies()).get('ramayana_session')?.value);if(!admin)return new Response('Unauthorized',{status:401});
 const {id}=await params;const row=eventDatabase().prepare('SELECT filename,mime,bytes,inquiry_id FROM event_attachments WHERE id=?').get(id) as {filename:string;mime:string;bytes:Uint8Array;inquiry_id:string}|undefined;
 if(!row)return new Response('Not found',{status:404});audit(admin.id,'attachment.download',row.inquiry_id);
 return new Response(new Uint8Array(row.bytes),{headers:{'Content-Type':'application/octet-stream','Content-Disposition':'attachment; filename="'+row.filename.replace(/[^a-zA-Z0-9._ ()-]/g,'_')+'"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
}

