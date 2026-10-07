import {cookies} from 'next/headers';
import {db} from '@/lib/db';
import {clientKey,createSession,hashPassword,rateLimit,readBody,RequestBodyError,sameOrigin,verifyPassword} from '@/lib/security';
const dummy=hashPassword('invalid-account-timing-padding');
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Invalid origin'},{status:403});
 try{
  if(!rateLimit(`login:${clientKey(request)}`,10,900000))return Response.json({error:'Too many attempts. Please wait 15 minutes.'},{status:429});
  const body=await readBody(request,2000) as {email?:unknown;password?:unknown};
  if(!body||typeof body.email!=='string'||typeof body.password!=='string'||body.password.length>256)return Response.json({error:'Invalid credentials'},{status:400});
  const admin=db().prepare('SELECT * FROM admins WHERE email=?').get(body.email.trim().toLowerCase()) as {id:string;password_hash:string}|undefined;
  const valid=verifyPassword(body.password,admin?.password_hash||dummy);
  if(!admin||!valid)return Response.json({error:'Email or password is incorrect.'},{status:401});
  (await cookies()).set('ramayana_session',createSession(admin.id),{httpOnly:true,secure:process.env.COOKIE_SECURE==='true'||process.env.APP_URL?.startsWith('https://'),sameSite:'strict',path:'/',maxAge:28800});
  return Response.json({ok:true});
 }catch(error){if(error instanceof RequestBodyError)return Response.json({error:error.message},{status:error.status});return Response.json({error:'Sign-in is temporarily unavailable.'},{status:503});}
}
