import {optimizedAsset} from '@/lib/asset-store.mjs';
import {assetResponse} from '@/lib/asset-response.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){try{const p=new URL(request.url).searchParams;const key=p.get('key')||'';return assetResponse(request,key,await optimizedAsset(key,Number(p.get('w')),Number(p.get('q'))));}catch{return new Response('Gambar tidak tersedia.',{status:404});}}
export const HEAD=GET;
