import sharp from 'sharp';
import {mkdir,stat,writeFile} from 'node:fs/promises';
import {join,isAbsolute} from 'node:path';
import {hotelPhotos} from '../lib/photo-catalog.ts';
const root=join(process.cwd(),'.local/photo-import-20260926');
const out=join(process.cwd(),'public/media/collection');await mkdir(out,{recursive:true});
let sourceBytes=0,webBytes=0;const report=[];
for(const p of hotelPhotos){const source=isAbsolute(p.source)?p.source:join(root,p.source);const dest=join(out,p.id+'.webp');const metadata=await sharp(source).metadata();const result=await sharp(source).rotate().resize({width:2000,height:1500,fit:'inside',withoutEnlargement:true}).webp({quality:86,effort:4}).toFile(dest);sourceBytes+=(await stat(source)).size;webBytes+=result.size;report.push({...p,originalWidth:metadata.width,originalHeight:metadata.height,webBytes:result.size})}
await mkdir('outputs',{recursive:true});await writeFile('outputs/photo-placement.json',JSON.stringify({catalogPhotos:hotelPhotos.length,sourceBytes,webBytes,photos:report,reviewNotes:'See meeting-photo-audit.json for all 77 meeting photographs and room-gallery-review.md for room sources. Each meeting photograph has one canonical entry; different camera frames remain available.'},null,2));
console.log(JSON.stringify({photos:hotelPhotos.length,sourceBytes,webBytes}));
