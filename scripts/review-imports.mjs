import sharp from 'sharp';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
import {join,relative} from 'node:path';
const root=join(process.cwd(),'.local/photo-import-20260926');
async function walk(dir){const files=[];for(const f of await readdir(dir,{withFileTypes:true})){const p=join(dir,f.name);if(f.isDirectory())files.push(...await walk(p));else if(/\.(jpe?g|png|webp)$/i.test(f.name))files.push(p)}return files.sort()}
const files=await walk(root);const out=join(root,'../photo-review');await mkdir(out,{recursive:true});
const manifest=[];const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
for(let page=0;page<Math.ceil(files.length/24);page++){
 const items=files.slice(page*24,(page+1)*24);const layers=[];
 for(let k=0;k<items.length;k++) {const file=items[k],n=page*24+k;const meta=await sharp(file).metadata();manifest.push({index:n,file:relative(root,file),width:meta.width,height:meta.height});const left=k%4*350,top=Math.floor(k/4)*255;layers.push({input:await sharp(file).rotate().resize(340,205,{fit:'inside'}).jpeg({quality:76}).toBuffer(),left,top});const parts=relative(root,file).split(/[\\/]/);const label=escape(`${n}: ${parts.at(-2)} / ${parts.at(-1)}`);layers.push({input:Buffer.from(`<svg width="350" height="45"><rect width="350" height="45" fill="white"/><text x="5" y="17" font-family="Arial" font-size="11">${label.slice(0,53)}</text><text x="5" y="34" font-family="Arial" font-size="11">${label.slice(53)}</text></svg>`),left,top:top+208})}
 await sharp({create:{width:1400,height:Math.ceil(items.length/4)*255,channels:3,background:'#eeeeee'}}).composite(layers).jpeg({quality:86}).toFile(join(out,`sheet-${page+1}.jpg`));
}
await writeFile(join(out,'manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({count:files.length,sheets:Math.ceil(files.length/24),out}));
