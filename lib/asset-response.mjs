import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import {assetFile} from './asset-store.mjs';
export function assetResponse(request,key,source=assetFile(key)){
 const headers=new Headers({'Content-Type':source.mime,'Cache-Control':'public, no-cache, must-revalidate','ETag':source.etag,'X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'});
 if(request.headers.get('if-none-match')===source.etag)return new Response(null,{status:304,headers});
 let start=0,end=source.size-1,status=200;const range=request.headers.get('range');
 if(range&&(!request.headers.get('if-range')||request.headers.get('if-range')===source.etag)){
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||!match[1]&&!match[2]){headers.set('Content-Range','bytes */'+source.size);return new Response(null,{status:416,headers});}
  if(!match[1])start=Math.max(0,source.size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=source.size){headers.set('Content-Range','bytes */'+source.size);return new Response(null,{status:416,headers});}
  status=206;headers.set('Content-Range',`bytes ${start}-${end}/${source.size}`);
 }
 headers.set('Content-Length',String(end-start+1));
 return new Response(request.method==='HEAD'?null:Readable.toWeb(createReadStream(source.file,{start,end})),{status,headers});
}
