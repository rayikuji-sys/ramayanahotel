import sharp from 'sharp';
import {copyFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const root=process.argv[2]||'C:/Users/ramay/OneDrive/Documents/Desktop/Data Full/Brosur 2';
const out='public/media/packages';await mkdir(out,{recursive:true});
const files=[['wedding-collection','1(1).png'],['wedding-details','2(1).png'],['wedding-anggun','3(1).png'],['private-business','Private Bussines Package.png'],['birthday','Promo Birthday Flayer.png'],['community','Salinan dari Promo Birthday Flayer (1).png'],['gathering','Salinan dari Promo Birthday Flayer (2).png'],['socialita','Salinan dari Promo Socialita.png'],['romantic-dinner','Salinan dari Salinan dari Promo Birthday Flayer (1).png'],['manasik','Salinan dari Salinan dari Promo Birthday Flayer.png']];
const report=[];
for(const [id,file] of files){const source=join(root,file);const meta=await sharp(source).metadata();await copyFile(source,join(out,id+'.png'));const web=await sharp(source).webp({quality:92,effort:5}).toFile(join(out,id+'.webp'));report.push({id,source,width:meta.width,height:meta.height,webBytes:web.size});}
// A single unchanged brochure panel is used only as the cover. The viewer shows the complete original spread.
for(const [i,name] of ['bahagia','cantik','indah'].entries()){const left=Math.round(i*2000/3),right=Math.round((i+1)*2000/3);await sharp(join(out,'wedding-details.png')).extract({left,top:0,width:right-left,height:1545}).webp({quality:92}).toFile(join(out,`wedding-${name}-panel.webp`));}
await sharp(join(out,'wedding-anggun.png')).extract({left:0,top:0,width:667,height:1545}).webp({quality:92}).toFile(join(out,'wedding-anggun-panel.webp'));
await writeFile('outputs/package-artwork.json',JSON.stringify(report,null,2));console.log(`Imported ${files.length} original brochures and four wedding cover panels.`);
