import {cookies} from 'next/headers';
import {sessionAdmin,sameOrigin,readBody} from '@/lib/security';
import {plannerConfig,savePlannerConfig} from '@/lib/planner-store';
import {plannerConfigSchema} from '@/lib/planner-model';
import {audit} from '@/lib/db';
export async function GET(){if(!sessionAdmin((await cookies()).get('ramayana_session')?.value))return Response.json({error:'Please sign in.'},{status:401});return Response.json(plannerConfig(),{headers:{'Cache-Control':'no-store'}});}
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Invalid origin'},{status:403});const admin=sessionAdmin((await cookies()).get('ramayana_session')?.value);if(!admin)return Response.json({error:'Please sign in.'},{status:401});try{const result=plannerConfigSchema.safeParse(await readBody(request,80000));if(!result.success)return Response.json({error:result.error.issues[0].message},{status:400});savePlannerConfig(result.data);audit(admin.id,'planner.config','hotel');return Response.json({ok:true});}catch{return Response.json({error:'Konfigurasi belum tersimpan.'},{status:400});}}
