import {cookies} from 'next/headers';
import {sessionAdmin} from '@/lib/security';
import {plannerConfig} from '@/lib/planner-store';
import {eventDatabase} from '@/lib/events-store';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){if(!sessionAdmin((await cookies()).get('ramayana_session')?.value))return Response.json({error:'Please sign in.'},{status:401});const {id}=await params;plannerConfig();const row=eventDatabase().prepare('SELECT payload FROM event_layouts WHERE inquiry_id=?').get(id) as {payload:string}|undefined;if(!row)return Response.json({error:'Layout not found.'},{status:404});return new Response(row.payload,{headers:{'Content-Type':'application/json','Cache-Control':'no-store',...(new URL(request.url).searchParams.has('download')?{'Content-Disposition':'attachment; filename=ramayana-layout.json'}:{})}});}
