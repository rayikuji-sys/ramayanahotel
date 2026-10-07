import {randomUUID} from 'node:crypto';
import {inquirySchema} from '@/lib/validation';
import {content,saveInquiry} from '@/lib/db';
import {clientKey,rateLimit,readBody,RequestBodyError,sameOrigin} from '@/lib/security';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Please submit from this website.'},{status:403});
 try{
  if(!rateLimit(`inquiry:${clientKey(request)}`,process.env.TRUST_PROXY==='true'?8:60,3600000))return Response.json({error:'Too many requests. Please contact the hotel directly.'},{status:429});
  const parsed=inquirySchema.safeParse(await readBody(request));
  if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
  const {context,...x}=parsed.data;
  if(context.room&&!content().some(r=>r.kind==='room'&&r.title===context.room))return Response.json({error:'Please choose a listed room.'},{status:400});
  if(context.occasion&&!content().some(r=>r.kind==='event'&&r.title===context.occasion))return Response.json({error:'Please choose a listed occasion.'},{status:400});
  const now=new Date().toISOString();const id=`RHM-${new Date().getFullYear()}-${randomUUID().slice(0,8).toUpperCase()}`;
  saveInquiry({id,kind:x.kind,name:x.name,email:x.email,phone:x.phone,message:x.message,context,status:'new',staffNote:'',source:x.source,consentAt:now,createdAt:now,updatedAt:now});
  return Response.json({id,message:'Your request has been received. Our team will contact you. This is not a confirmed booking.'},{status:201});
 }catch(error){if(error instanceof RequestBodyError)return Response.json({error:error.message},{status:error.status});return Response.json({error:'We could not save your request. Please try again or contact us directly.'},{status:503});}
}
