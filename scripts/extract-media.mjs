import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const html=readFileSync('references/prototype.html','utf8');
mkdirSync('public/media',{recursive:true});
for(const [key,prefix] of [['roomData','room'],['facilities','facility'],['dining','dining']]){
 const part=html.slice(html.indexOf(`const ${key}=`)).split('];')[0];let index=0;
 for(const match of part.matchAll(/img:'data:image\/(\w+);base64,([^']+)'/g))writeFileSync(`public/media/${prefix}-${index++}.${match[1]==='jpeg'?'jpg':match[1]}`,Buffer.from(match[2],'base64'));
 console.log(prefix,index);
}
const hero=html.match(/\.hero-media[^\n]+?data:image\/(\w+);base64,([A-Za-z0-9+/=]+)/);
if(hero)writeFileSync(`public/media/hero.${hero[1]==='jpeg'?'jpg':hero[1]}`,Buffer.from(hero[2],'base64'));
