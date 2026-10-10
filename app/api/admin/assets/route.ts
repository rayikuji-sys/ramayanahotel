import {cookies} from 'next/headers';
import {sessionAdmin,sameOrigin,readBody} from '@/lib/security';
import {assetCatalog,assetHistory,replaceAsset,restoreAsset,AssetError} from '@/lib/asset-store.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
async function actor(){return sessionAdmin((await cookies()).get('ramayana_session')?.value);}
export async function GET(request:Request){if(!await actor())return Response.json({error:'Silakan masuk.'},{status:401});const key=new URL(request.url).searchParams.get('key');try{return Response.json(key?{history:assetHistory(key)}:{assets:assetCatalog()},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Aset tidak ditemukan.'},{status:404});}}
export async function POST(request:Request){if(!sameOrigin(request))return Response.json({error:'Asal permintaan ditolak.'},{status:403});const admin=await actor();if(!admin)return Response.json({error:'Silakan masuk.'},{status:401});try{const p=new URL(request.url).searchParams,key=p.get('key')||'',expected=request.headers.get('if-match');if(!expected)throw new AssetError('Versi aset diperlukan.',409);
 if(p.get('action')==='restore'){const body=await readBody(request) as {version:string};if(typeof body.version!=='string')throw new AssetError('Versi tidak valid.');restoreAsset(key,body.version,admin.id,expected);}
 else{const max=60*1024*1024;if(Number(request.headers.get('content-length')||0)>max)throw new AssetError('Berkas melebihi 60 MB.',413);const reader=request.body?.getReader();if(!reader)throw new AssetError('Berkas kosong.');const chunks:Uint8Array[]=[];let total=0;while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>max){await reader.cancel();throw new AssetError('Berkas melebihi 60 MB.',413);}chunks.push(value);}await replaceAsset(key,Buffer.concat(chunks),p.get('name')||'unggahan',admin.id,expected);}
 return Response.json({ok:true,assets:assetCatalog()});
 }catch(error){return Response.json({error:error instanceof AssetError?error.message:'Perubahan aset gagal disimpan.'},{status:error instanceof AssetError?error.status:500});}}
