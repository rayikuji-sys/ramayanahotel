import {copyFileSync,constants,existsSync,realpathSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {root} from '../domain/store.mjs';
const [sourceArg,targetArg]=process.argv.slice(2);
if(!sourceArg||!targetArg)throw Error('Usage: node scripts/restore-copy.mjs data/backups/backup.sqlite data/restored.sqlite');
const dataRoot=realpathSync(resolve(root,'data')),source=realpathSync(resolve(root,sourceArg)),target=resolve(root,targetArg);
if(!source.startsWith(dataRoot+sep)||!target.startsWith(dataRoot+sep)||existsSync(target)||realpathSync(resolve(target,'..'))!==dataRoot)throw Error('Source must be inside booking data. Target must be a new file directly in booking data. Existing files are never replaced.');
const db=new DatabaseSync(source,{readOnly:true});
try {
 if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||db.prepare('PRAGMA foreign_key_check').all().length)throw Error('Backup integrity check failed.');
 if(!db.prepare('SELECT version FROM schema_version WHERE version=1').get())throw Error('Unsupported backup schema.');
}finally{db.close();}
copyFileSync(source,target,constants.COPYFILE_EXCL);
console.log(`Verified restore copy created: ${target}. Set BOOKING_DB to this file only after stopping the booking server and worker.`);
