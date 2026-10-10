import {cookies} from 'next/headers';
import {sessionAdmin,sameOrigin} from '@/lib/security';
import {bridgeKey} from '../../../booking-engine/domain/bridge.mjs';

export const runtime='nodejs';
export const dynamic='force-dynamic';

async function proxy(request:Request){
 const url=new URL(request.url);
 const path=url.pathname.slice('/booking'.length)||'/';
 if(request.method==='POST'&&!sameOrigin(request))return Response.json({error:{code:'ORIGIN',message:'Asal permintaan ditolak.'}},{status:403});
 if(path==='/website'){
  const target=url.searchParams.get('path')||'/';
  const destination=new URL(['/','/admin','/contact','/hotel-info','/events','/events/request-proposal','/events/group-accommodation','/rooms'].includes(target)?target:'/',process.env.APP_URL||url);
  if(destination.pathname==='/admin'&&url.searchParams.get('section')==='assets')destination.searchParams.set('section','assets');
  return Response.redirect(destination,302);
 }
 const upstream=new URL(process.env.BOOKING_INTERNAL_URL||'http://127.0.0.1:3003');
 const headers=new Headers({'x-booking-bridge':bridgeKey(),'x-booking-prefix':'/booking','Origin':upstream.origin});
 const jar=await cookies();
 headers.set('Cookie',jar.getAll().filter(c=>c.name.startsWith('rhb_')).map(c=>`${c.name}=${c.value}`).join('; '));
 for(const name of ['content-type','idempotency-key','if-none-match','range','if-range']){const value=request.headers.get(name);if(value)headers.set(name,value);}
 if(path.startsWith('/api/v1/admin')||path.startsWith('/admin/')){
  const admin=sessionAdmin(jar.get('ramayana_session')?.value);
  if(admin)headers.set('x-booking-admin',Buffer.from(JSON.stringify({id:admin.id,email:admin.email})).toString('base64url'));
 }
 try{
  let body:ArrayBuffer|undefined;
  if(request.method==='POST'){
   if(Number(request.headers.get('content-length')||0)>65536)return Response.json({error:{message:'Data terlalu besar.'}},{status:413});
   body=await request.arrayBuffer();if(body.byteLength>65536)return Response.json({error:{message:'Data terlalu besar.'}},{status:413});
  }
  upstream.pathname=path;upstream.search=url.search;
  const response=await fetch(upstream,{method:request.method,headers,body,redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(20000)});
  const out=new Headers();
  for(const name of ['content-type','cache-control','content-disposition','etag','x-correlation-id','location','content-security-policy','content-length','content-range','accept-ranges']){const value=response.headers.get(name);if(value)out.set(name,value);}
  for(const cookie of response.headers.getSetCookie())out.append('set-cookie',cookie.replace('Path=/;','Path=/booking;')+(url.protocol==='https:'?'; Secure':''));
  return new Response(response.body,{status:response.status,headers:out});
 }catch{
  const message='Layanan reservasi belum tersedia. Jalankan npm run dev dari folder proyek untuk menyalakan website dan booking engine bersama.';
  if(path.startsWith('/api/'))return Response.json({error:{code:'BOOKING_UNAVAILABLE',message,retryable:true}},{status:503});
  return new Response(`<!doctype html><html lang="id"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reservasi Ramayana</title><body><main><h1>Reservasi sedang disiapkan</h1><p>${message}</p><p><a href="${url.pathname}">Coba kembali</a> · <a href="/contact">Hubungi hotel</a> · <a href="/">Website hotel</a></p></main></body></html>`,{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
 }
}
export const GET=proxy;
export const HEAD=proxy;
export const POST=proxy;
