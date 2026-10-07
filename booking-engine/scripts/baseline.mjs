import {readdirSync,readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'../..'),out=resolve(import.meta.dirname,'../docs/website-baseline.json');
const excluded=new Set(['booking-engine','node_modules','.next','.local','.git','outputs','tmp','build','.sites-runtime','.openai','vendor']);
const files={};
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(excluded.has(e.name)||e.isSymbolicLink())continue;const path=join(dir,e.name);if(e.isDirectory())walk(path);else if(!/\.(sqlite|db)(-wal|-shm)?$|tsbuildinfo$/.test(e.name)&&!e.name.startsWith('.env')&&e.name!=='next-env.d.ts')files[relative(root,path).replaceAll('\\','/')]=createHash('sha256').update(readFileSync(path)).digest('hex');}}
walk(root);mkdirSync(resolve(out,'..'),{recursive:true});
if(process.argv.includes('--verify')){const before=JSON.parse(readFileSync(out,'utf8')).files;const changed=Object.keys(before).filter(k=>before[k]!==files[k]);const added=Object.keys(files).filter(k=>!(k in before));console.log(JSON.stringify({checked:Object.keys(before).length,changed,added}));if(changed.length||added.length)process.exitCode=1;}
else {if(existsSync(out))throw Error('Baseline exists; refusing overwrite');writeFileSync(out,JSON.stringify({created:new Date().toISOString(),scope:'All non-runtime website files; secrets excluded, databases excluded to avoid concurrent runtime noise. Website DB never opened by booking.',files},null,2));console.log('Baseline saved:',Object.keys(files).length,'files');}
