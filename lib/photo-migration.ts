import type {DatabaseSync} from 'node:sqlite';
import type {ContentItem} from './types.ts';
import type {EventRecord} from './events-model.ts';
import {reviewedContent} from './reviewed-content.ts';
import {packageCover,packageStories} from './package-artwork.ts';
import {reviewedRoomCovers,roomCollectionNote} from './curated-room-photos.ts';

const replacements:Record<string,[string[],string]>={
 'superior-king':[['/media/room-0.jpg','/media/1645343294956.jpeg'],'superior-king'],
 'superior-twin':[['/media/room-1.jpg','/media/1645343295138.jpeg'],'superior-twin'],
 'deluxe-twin':[['/media/room-3.jpg','/media/1645343295138.jpeg'],'deluxe-twin'],
 'living-room':[['/media/facility-0.jpg'],'lobby-sofa'],
 'mini-library':[['/media/facility-1.jpg'],'hotel-reading-corner'],
 'sriwijaya-gym':[['/media/facility-2.jpg'],'gym-treadmill'],
 'arjuna-resto':[['/media/dining-0.jpg'],'dining-corner'],
};
export function migrateRoomCollections(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=8').get())return;
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=8').get()){sql.exec('COMMIT');return;}
  for(const row of sql.prepare("SELECT id,payload FROM content WHERE kind='room'").all() as {id:string;payload:string}[]){
   const old:ContentItem=JSON.parse(row.payload),cover=reviewedRoomCovers[old.slug];
   // Fill only the explicit pending-photo state left by the earlier review.
   if(!cover||old.image||!old.details.photoNote?.startsWith('A photograph identified as '))continue;
   const next={...old,image:`/media/collection/${cover}.webp`,details:{...old.details,photoNote:roomCollectionNote}};
   sql.prepare('UPDATE content SET payload=? WHERE id=?').run(JSON.stringify(next),row.id);
  }
  sql.prepare('INSERT INTO migrations VALUES(8,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}
export function migrateHotelPhotos(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=4').get())return;
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=4').get()){sql.exec('COMMIT');return;}
  for(const row of sql.prepare('SELECT id,payload FROM content').all() as {id:string;payload:string}[]){
   const old:ContentItem=JSON.parse(row.payload),change=replacements[old.slug];
   // Only replace known starter images; staff-selected photography and publication controls survive.
   if(!change||!change[0].includes(old.image))continue;
   const next={...old,image:`/media/collection/${change[1]}.webp`,details:{...old.details}};
   if(old.kind==='room')next.details.photoNote='Photograph from the hotel-supplied '+old.category+' collection. Layout and furnishings may vary by room.';
   sql.prepare('UPDATE content SET payload=? WHERE id=?').run(JSON.stringify(next),row.id);
  }
  sql.prepare('INSERT INTO migrations VALUES(4,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}
export function migrateVenuePhotos(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=5').get())return;
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=5').get()){sql.exec('COMMIT');return;}
  for(const row of sql.prepare('SELECT id,payload FROM event_records').all() as {id:string;payload:string}[]){
   const record:EventRecord=JSON.parse(row.payload);
   const id=record.slug==='erlangga'?'erlangga-classroom-front':record.slug==='majapahit'?'majapahit-theatre-front':'';
   if(record.kind!=='venue'||!id||!['/media/IMG_20220107_155424.jpg','/media/IMG_20220108_100158.jpg'].includes(record.image))continue;
   sql.prepare('UPDATE event_records SET payload=? WHERE id=?').run(JSON.stringify({...record,image:`/media/collection/${id}.webp`}),row.id);
  }
  sql.prepare('INSERT INTO migrations VALUES(5,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}

export function migrateReviewedContent(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=6').get())return;
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=6').get()){sql.exec('COMMIT');return;}
  for(const row of sql.prepare('SELECT id,payload FROM content').all() as {id:string;payload:string}[]){
   const old:ContentItem=JSON.parse(row.payload),review=reviewedContent[old.slug];
   if(!review||!review.previous.includes(old.image))continue;
   const starter=['2026-09-17','2026-09-18'].includes(old.updatedAt);
   const next={...old,image:review.image,details:{...old.details,...review.photoNote?{photoNote:review.photoNote}:{}}};
   if(starter&&review.description)next.description=review.description;
   if(starter&&review.title)next.title=review.title;
   sql.prepare('UPDATE content SET title=?,payload=? WHERE id=?').run(next.title,JSON.stringify(next),row.id);
  }
  sql.prepare('INSERT INTO migrations VALUES(6,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}

export function migrateReviewedVenues(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=7').get())return;
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=7').get()){sql.exec('COMMIT');return;}
  const row=sql.prepare('SELECT payload FROM event_records WHERE id=?').get('ganesha') as {payload:string}|undefined;
  if(row){const r:EventRecord=JSON.parse(row.payload);if(r.image==='/media/IMG_20220107_155424.jpg')sql.prepare('UPDATE event_records SET payload=? WHERE id=?').run(JSON.stringify({...r,image:'/media/venue-ganesha.png'}),r.id);}
  for(const item of sql.prepare('SELECT id,payload FROM event_records').all() as {id:string;payload:string}[]){
   const r:EventRecord=JSON.parse(item.payload),art=packageCover(r.slug);
   if(r.kind!=='package'||!art)continue;
   const next={...r};
   if(['/media/IMG_20220107_155424.jpg','/media/10003537-b7d0fd9ab1d641aaa9edb62e5ecfe385.jpeg'].includes(r.image))next.image=art.src;
   if(['Pilihan resepsi di Majapahit untuk momen bersama keluarga dan orang terdekat.','Susun acara Anda dari pilihan ruang, jamuan, dan layanan dalam panduan paket hotel.'].includes(r.description))next.description=packageStories[r.slug]||r.description;
   sql.prepare('UPDATE event_records SET payload=? WHERE id=?').run(JSON.stringify(next),item.id);
  }
  sql.prepare('INSERT INTO migrations VALUES(7,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}

// Correct facility identities after the owner's review. Preserve unrelated staff changes.
export function migrateFacilityCorrections(sql:DatabaseSync){
 if(sql.prepare('SELECT version FROM migrations WHERE version=9').get())return;
 const corrections:Record<string,{previous:string[];image:string;description:string}>={
  'living-room':{previous:['/media/facility-0.jpg','/media/collection/lobby-sofa.webp'],image:'/media/1645343295251.jpeg',description:'A sofa and armchairs gather beneath a softly lit circular ceiling. Plants, flowers, and a low coffee table make this shared living room a welcoming place to pause.'},
  'mini-library':{previous:['/media/facility-1.jpg','/media/collection/hotel-reading-corner.webp','/media/collection/reading-selection.webp'],image:'/media/10003537-593b8f547e82567ea32635bfb055102c.jpeg',description:'A newspaper rack beside the window marks the reading corner in the lobby. Browse the available reading material and settle into a nearby seat.'},
 };
 sql.exec('BEGIN IMMEDIATE');
 try{
  if(sql.prepare('SELECT version FROM migrations WHERE version=9').get()){sql.exec('COMMIT');return;}
  for(const row of sql.prepare("SELECT id,payload FROM content WHERE kind='facility'").all() as {id:string;payload:string}[]){const old:ContentItem=JSON.parse(row.payload),next=corrections[old.slug];if(!next||!next.previous.includes(old.image))continue;sql.prepare('UPDATE content SET payload=? WHERE id=?').run(JSON.stringify({...old,image:next.image,description:next.description}),row.id);}
  sql.prepare('INSERT INTO migrations VALUES(9,?)').run(new Date().toISOString());sql.exec('COMMIT');
 }catch(error){sql.exec('ROLLBACK');throw error;}
}
