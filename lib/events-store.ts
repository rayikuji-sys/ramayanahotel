import {db} from './db.ts';
import {migrateVenuePhotos,migrateReviewedVenues} from './photo-migration.ts';
import {eventSeeds} from './events-seed.ts';
import type {EventRecord} from './events-model.ts';
function initialise(){const sql=db();sql.exec('CREATE TABLE IF NOT EXISTS event_records(id TEXT PRIMARY KEY,payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS event_attachments(id TEXT PRIMARY KEY,inquiry_id TEXT NOT NULL,filename TEXT NOT NULL,mime TEXT NOT NULL,bytes BLOB NOT NULL);');sql.exec('BEGIN IMMEDIATE');try{if(!sql.prepare('SELECT version FROM migrations WHERE version=3').get()){const insert=sql.prepare('INSERT OR IGNORE INTO event_records VALUES(?,?)');for(const r of eventSeeds)insert.run(r.id,JSON.stringify(r));sql.prepare('INSERT INTO migrations VALUES(3,?)').run(new Date().toISOString());}sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}return sql;}
export function eventRecords(){const sql=initialise();migrateVenuePhotos(sql);migrateReviewedVenues(sql);return (sql.prepare('SELECT payload FROM event_records ORDER BY rowid').all() as {payload:string}[]).map(r=>JSON.parse(r.payload) as EventRecord);}
export function saveEventRecord(record:EventRecord){initialise().prepare('INSERT INTO event_records VALUES(?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(record.id,JSON.stringify({...record,updatedAt:new Date().toISOString()}));}
export function eventDatabase(){return initialise();}

