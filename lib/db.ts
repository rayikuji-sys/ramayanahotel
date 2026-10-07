import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {seedItems,defaultSettings} from './seed-data.ts';
import {migrateHotelProfile} from './profile-migration.ts';
import {migrateHotelPhotos,migrateReviewedContent,migrateRoomCollections,migrateFacilityCorrections} from './photo-migration.ts';
import type {ContentItem,HotelSettings,Inquiry} from './types.ts';
let connection:DatabaseSync|undefined;
export function db(){
 if(connection)return connection;
 const path=resolve(process.env.HOTEL_DB_PATH||'data/hotel.db');mkdirSync(dirname(path),{recursive:true});
 const sql=new DatabaseSync(path);sql.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS content(id TEXT PRIMARY KEY,kind TEXT NOT NULL,slug TEXT NOT NULL,title TEXT NOT NULL,payload TEXT NOT NULL, UNIQUE(kind,slug));
 CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,kind TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',payload TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS admins(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,admin_id TEXT NOT NULL REFERENCES admins(id),expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,admin_id TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS inquiries_created ON inquiries(created_at DESC);
 CREATE INDEX IF NOT EXISTS content_kind ON content(kind);`);
 if(!sql.prepare('SELECT version FROM migrations WHERE version=1').get()){
  sql.exec('BEGIN IMMEDIATE');try{const stmt=sql.prepare('INSERT OR IGNORE INTO content VALUES(?,?,?,?,?)');for(const x of seedItems)stmt.run(x.id,x.kind,x.slug,x.title,JSON.stringify(x));sql.prepare('INSERT OR IGNORE INTO settings VALUES(1,?)').run(JSON.stringify(defaultSettings));sql.prepare('INSERT INTO migrations VALUES(1,?)').run(new Date().toISOString());sql.exec('COMMIT');}catch(error){sql.exec('ROLLBACK');throw error;}
 }
 migrateHotelProfile(sql);
 migrateHotelPhotos(sql);
 migrateReviewedContent(sql);
 migrateRoomCollections(sql);
 migrateFacilityCorrections(sql);
 connection=sql;return sql;
}
export function content(all=false):ContentItem[]{return (db().prepare('SELECT payload FROM content').all() as {payload:string}[]).map(x=>JSON.parse(x.payload) as ContentItem).filter(x=>all||(x.published&&x.verified&&x.active)).sort((a,b)=>a.sortOrder-b.sortOrder);}
export function settings():HotelSettings{return JSON.parse((db().prepare('SELECT payload FROM settings WHERE id=1').get() as {payload:string}).payload);}
export function saveContent(x:ContentItem){db().prepare('INSERT INTO content VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,slug=excluded.slug,title=excluded.title,payload=excluded.payload').run(x.id,x.kind,x.slug,x.title,JSON.stringify(x));}
export function inquiries():Inquiry[]{return (db().prepare('SELECT payload FROM inquiries ORDER BY created_at DESC LIMIT 1000').all() as {payload:string}[]).map(x=>JSON.parse(x.payload));}
export function saveInquiry(x:Inquiry){db().prepare('INSERT INTO inquiries VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,payload=excluded.payload').run(x.id,x.kind,x.status,JSON.stringify(x),x.createdAt);}
export function audit(admin:string,action:string,target:string){db().prepare('INSERT INTO audit VALUES(?,?,?,?,?)').run(randomUUID(),admin,action,target,new Date().toISOString());}
export function closeDb(){connection?.close();connection=undefined;}
