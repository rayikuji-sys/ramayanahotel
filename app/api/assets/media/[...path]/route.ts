import {assetResponse} from '@/lib/asset-response.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{path:string[]}>}){try{return assetResponse(request,'website:'+(await params).path.join('/'));}catch{return new Response('Aset tidak ditemukan.',{status:404});}}
export const HEAD=GET;
