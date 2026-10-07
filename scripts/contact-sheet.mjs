import sharp from 'sharp';import {readdirSync,mkdirSync} from 'node:fs';
const names=readdirSync('public/media').filter(n=>/^(room-|facility-|dining-|164|hero)/.test(n)&&/\.jpe?g$/.test(n));
mkdirSync('outputs',{recursive:true});const layers=[];
for(let i=0;i<names.length;i++){const tile=await sharp(`public/media/${names[i]}`).resize(240,150,{fit:'cover'}).extend({bottom:28,background:'#ffffff'}).composite([{input:Buffer.from(`<svg width="240" height="28"><text x="8" y="18" font-size="12">${names[i]}</text></svg>`),top:150,left:0}]).jpeg().toBuffer();layers.push({input:tile,left:(i%5)*240,top:Math.floor(i/5)*178});}
await sharp({create:{width:1200,height:Math.ceil(names.length/5)*178,channels:3,background:'#fff'}}).composite(layers).jpeg().toFile('outputs/contact-sheet.jpg');
