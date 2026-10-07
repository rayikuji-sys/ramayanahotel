// One-time, read-only import of the hotel's reviewed source catalog. Never connects to website DB.
import {profileRooms,profileSource} from '../../lib/hotel-profile.ts';
import {roomPhotos} from '../../lib/photo-catalog.ts';
import {copyFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,basename} from 'node:path';
const dest=resolve(import.meta.dirname,'../public/assets');mkdirSync(dest,{recursive:true});
const provenance=[];
function copy(src,name=basename(src)){if(!existsSync(src))throw Error('Missing asset: '+src);copyFileSync(src,resolve(dest,name));provenance.push({source:src,target:'public/assets/'+name});return '/assets/'+name;}
const rooms=profileRooms.map(r=>({id:r.slug,name:r.title,area:Number(r.details.area),capacity:r.slug.includes('triple')?3:2,base_rate:Number(r.details.rate),bed:r.details.bed,description:r.description,photos:roomPhotos(r.slug).slice(0,5).map(p=>({src:copy(resolve(import.meta.dirname,'../../public'+p.src)),caption:p.caption})),physicalInventory:Number(r.details.inventory)}));
copy(resolve(import.meta.dirname,'../../public/media/ramayana-logo.png'),'logo.png');copy(resolve(import.meta.dirname,'../../public/media/courtyard-film.jpg'),'courtyard.jpg');
for(const [font,weight] of [['playfair-display',500],['montserrat',400],['montserrat',600]])copy(resolve(import.meta.dirname,`../../node_modules/@fontsource/${font}/files/${font}-latin-${weight}-normal.woff2`));
mkdirSync(resolve(import.meta.dirname,'../database'),{recursive:true});writeFileSync(resolve(import.meta.dirname,'../database/reference.json'),JSON.stringify({source:profileSource,imported:new Date().toISOString(),rooms},null,2));writeFileSync(resolve(import.meta.dirname,'../docs/asset-provenance.json'),JSON.stringify(provenance,null,2));console.log('Copied reviewed room photos and brand assets:',provenance.length);
