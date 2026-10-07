import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
export const root=resolve(import.meta.dirname,'..');
export function openStore(path=resolve(root,process.env.BOOKING_DB||'data/booking-sandbox.sqlite')){
 if(path!==':memory:'){path=resolve(path);if(!path.startsWith(root+ '/'.replace('/',process.platform==='win32'?'\\':'/')))throw Error('Booking database must remain inside booking-engine');mkdirSync(dirname(path),{recursive:true});}
 const db=new DatabaseSync(path);db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=8000;');db.exec(readFileSync(resolve(root,'database/schema.sql'),'utf8'));if(!db.prepare('PRAGMA table_info(notifications)').all().some(c=>c.name==='auto_dispatch'))db.exec('ALTER TABLE notifications ADD COLUMN auto_dispatch INTEGER NOT NULL DEFAULT 0');if(!db.prepare('PRAGMA table_info(notifications)').all().some(c=>c.name==='document_json'))db.exec("ALTER TABLE notifications ADD COLUMN document_json TEXT NOT NULL DEFAULT '{}'");return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
