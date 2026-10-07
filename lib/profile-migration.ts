import type {DatabaseSync} from 'node:sqlite';
import type {ContentItem,HotelSettings} from './types.ts';
import {profileRooms,profilePolicies,profileFaqs} from './hotel-profile.ts';

export function migrateHotelProfile(sql:DatabaseSync) {
  if(sql.prepare('SELECT version FROM migrations WHERE version=2').get())return;
  sql.exec('BEGIN IMMEDIATE');
  try {
    if(sql.prepare('SELECT version FROM migrations WHERE version=2').get()){sql.exec('COMMIT');return;}
    const upsert=sql.prepare('INSERT INTO content VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,payload=excluded.payload');
    for(const next of [...profileRooms,...profilePolicies,...profileFaqs]) {
      const row=sql.prepare('SELECT payload FROM content WHERE kind=? AND slug=?').get(next.kind,next.slug) as {payload:string}|undefined;
      const old:ContentItem|undefined=row?JSON.parse(row.payload):undefined;
      // Replace untouched starter copy; retain staff edits and all publication controls.
      const starter=old?.updatedAt==='2026-09-17'&&old?.verifiedBy==='Source material';
      const item=old?{...next,...old,details:{...next.details,...old.details},...(starter?{description:next.description,image:next.image,category:next.category,sortOrder:next.sortOrder,details:next.details,sourceNote:next.sourceNote,updatedAt:next.updatedAt}:{} )}:next;
      upsert.run(item.id,item.kind,item.slug,item.title,JSON.stringify(item));
    }
    for(const slug of ['family-room','suite']) {
      const row=sql.prepare('SELECT payload FROM content WHERE kind=? AND slug=?').get('room',slug) as {payload:string}|undefined;
      if(!row)continue;
      const old:ContentItem=JSON.parse(row.payload);
      if(old.updatedAt==='2026-09-17'&&old.verifiedBy==='Source material')sql.prepare('UPDATE content SET payload=? WHERE id=?').run(JSON.stringify({...old,active:false}),old.id);
    }
    const row=sql.prepare('SELECT payload FROM settings WHERE id=1').get() as {payload:string};
    const settings:HotelSettings=JSON.parse(row.payload);
    if(!settings.heroVideo){settings.heroVideo='/media/arrival-scroll.mp4';sql.prepare('UPDATE settings SET payload=? WHERE id=1').run(JSON.stringify(settings));}
    sql.prepare('INSERT INTO migrations VALUES(2,?)').run(new Date().toISOString());
    sql.exec('COMMIT');
  }catch(error){sql.exec('ROLLBACK');throw error;}
}
