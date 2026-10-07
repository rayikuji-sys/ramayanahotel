import {test,after} from 'node:test';import assert from 'node:assert/strict';import {mkdirSync} from 'node:fs';import {randomUUID} from 'node:crypto';
import {bookingHref,bookingDestination} from '../lib/booking-link.ts';
import {DatabaseSync} from 'node:sqlite';
import {migrateHotelProfile} from '../lib/profile-migration.ts';
import {migrateReviewedContent,migrateRoomCollections} from '../lib/photo-migration.ts';
import {profileRooms} from '../lib/hotel-profile.ts';
import {roomGallery} from '../lib/room-gallery.ts';
import {facilityGallery} from '../lib/facility-gallery.ts';
import {existsSync,readFileSync} from 'node:fs';
import {meetingPhotos} from '../lib/meeting-photos.ts';
import {hotelPhotos,venuePhotos} from '../lib/photo-catalog.ts';
import {galleryMedia,eventGalleryMedia} from '../lib/gallery-media.ts';
import {seedItems,defaultSettings} from '../lib/seed-data.ts';
import {suitableVenues} from '../lib/event-guide.ts';
process.env.HOTEL_DB_PATH=`.local/unit-${randomUUID()}.db`;
mkdirSync('.local',{recursive:true});
const {db,content,saveContent,saveInquiry,inquiries,closeDb}=await import('../lib/db.ts');
const {hashPassword,verifyPassword,createSession,sessionAdmin,digest,rateLimit,sameOrigin,readBody,RequestBodyError}=await import('../lib/security.ts');
const {inquirySchema,inquiryUpdateSchema,contentSchema}=await import('../lib/validation.ts');
after(()=>closeDb());

test('booking links carry room, plan, dates and guests without prices or arbitrary redirect targets',()=>{
 const href=bookingHref({room:'junior-suite',plan:'breakfast',checkIn:'2026-11-10',checkOut:'2026-11-12',adults:2,lang:'id'});
 const input=new URL(href,'http://localhost:3001');input.searchParams.set('price','1');input.searchParams.set('redirect','https://example.test');
 const target=bookingDestination(input.searchParams,'https://booking.example.test/');
 assert.equal(target.origin,'https://booking.example.test');
 for(const [key,value] of Object.entries({room:'junior-suite',plan:'breakfast',checkIn:'2026-11-10',checkOut:'2026-11-12',adults:'2',lang:'id',source:'hotel-website'}))assert.equal(target.searchParams.get(key),value);
 assert.equal(target.searchParams.has('price'),false);assert.equal(target.searchParams.has('redirect'),false);
 assert.equal(new URL(bookingHref({lang:'ja'}),'http://localhost').searchParams.get('lang'),'en');
 assert.throws(()=>bookingDestination(input.searchParams,'javascript:alert(1)'));
});

test('latest room and facility delivery is completely placed without duplicating existing photos',()=>{
 const audit=JSON.parse(readFileSync('outputs/room-facility-photo-audit.json','utf8'));
 assert.equal(audit.total,22);assert.equal(audit.reused,19);assert.equal(audit.added,3);
 assert.equal(new Set(audit.photos.map((p:{pixelHash:string})=>p.pixelHash)).size,22);
 const gallery=galleryMedia(content());
 for(const row of audit.photos){
  const matches=hotelPhotos.filter(p=>p.id===row.canonicalId);assert.equal(matches.length,1,row.filename);
  assert.equal(matches[0].category,row.category);assert(existsSync(`public${row.src}`));
  assert.equal(gallery.filter(p=>p.src===row.src).length,1,row.filename);
 }
 assert.equal(hotelPhotos.find(p=>p.id==='room-desk-storage')?.category,'Rooms');
 assert.equal(hotelPhotos.find(p=>p.id==='lobby-artwork')?.category,'Spaces');
 assert.equal(hotelPhotos.find(p=>p.id==='reception-details')?.category,'Spaces');
 assert(!hotelPhotos.find(p=>p.id==='room-desk-storage')?.room);
});

test('facility galleries contain related images once and preserve a staff-selected cover',()=>{
 const items=content().filter(p=>p.kind==='facility');
 for(const item of items){
  const photos=facilityGallery(item);
  assert.equal(new Set(photos.map(p=>p.src)).size,photos.length);
  for(const photo of photos)assert(existsSync(`public${photo.src}`),photo.src);
  if(item.image)assert.equal(photos[0].src,item.image);
 }
 const living=items.find(p=>p.slug==='living-room')!;
 assert(facilityGallery(living).some(p=>p.id==='lounge'));
 assert(!facilityGallery(living).some(p=>['lobby-artwork','corridor-seating','lobby-sofa'].includes(p.id)));
 const library=items.find(p=>p.slug==='mini-library')!;
 assert.equal(library.image,'/media/10003537-593b8f547e82567ea32635bfb055102c.jpeg');
 assert(!facilityGallery(library).some(p=>p.id==='reading-selection'));
 assert(!facilityGallery(living).some(p=>p.category==='Rooms'||p.category==='Dining'));
 assert.equal(facilityGallery({...living,image:'/media/custom-staff.webp'})[0].src,'/media/custom-staff.webp');
 assert.equal(facilityGallery(items.find(p=>p.slug==='mushola')!).length,0);
});

test('every supplied meeting photo is present once, belongs to its source venue and layout, and has a valid asset',()=>{
 const audit=JSON.parse(readFileSync('outputs/meeting-photo-audit.json','utf8'));
 assert.equal(audit.inspected,77);assert.equal(audit.reused,9);assert.equal(audit.added,68);
 assert.equal(meetingPhotos.length,77);
 assert.equal(new Set(meetingPhotos.map(p=>p.sourceHash)).size,77);
 for(const row of audit.photos){
  const matches=hotelPhotos.filter(p=>p.id===row.canonicalId);assert.equal(matches.length,1,row.filename);
  const p=matches[0];assert.equal(p.category,'Meetings & Events');assert.equal(p.sourceHash,row.pixelHash);
  assert.equal(p.venue,row.group.startsWith('erlangga')?'erlangga':'majapahit');
  assert.equal(p.layout,row.group.endsWith('classroom')?'Classroom':row.group.endsWith('round')?'Round tables':'Theatre');
  assert(existsSync(`public${p.src}`),p.src);
  assert.equal(readFileSync(`public${p.src}`).subarray(8,12).toString(),'WEBP');
 }
 assert.equal(venuePhotos('erlangga').length,13);assert.equal(venuePhotos('majapahit').length,64);assert.equal(venuePhotos('ganesha').length,0);
});
test('event and main galleries contain every meeting photograph without duplicate entries',()=>{
 for(const gallery of [galleryMedia([]),eventGalleryMedia()]){
  assert.equal(new Set(gallery.map(p=>p.id)).size,gallery.length);
  assert.equal(new Set(gallery.map(p=>p.src)).size,gallery.length);
  for(const photo of meetingPhotos)assert.equal(gallery.filter(p=>p.id===photo.id).length,1,photo.id);
 }
 const eventPhotos=eventGalleryMedia();assert.equal(eventPhotos.filter(p=>p.venue==='erlangga').length,14);assert.equal(eventPhotos.filter(p=>p.venue==='majapahit').length,66);
});
test('all eight room categories have distinct, available gallery photographs and preserve a selected cover',()=>{
 const rooms=content().filter(x=>x.kind==='room');assert.equal(rooms.length,8);
 for(const room of rooms){
  const photos=roomGallery(room);assert(photos.length>=2,room.slug);
  assert.equal(new Set(photos.map(p=>p.src)).size,photos.length);
  for(const photo of photos)assert(existsSync(`public${photo.src}`),photo.src);
 }
 const deluxe=rooms.find(r=>r.slug==='deluxe-king')!;
 const custom=roomGallery({...deluxe,image:'/media/staff-cover.webp'});
 assert.equal(custom[0].src,'/media/staff-cover.webp');assert.equal(custom.length,roomGallery(deluxe).length+1);
 const original=rooms.find(r=>r.slug==='superior-king')!;
 assert.equal(roomGallery({...original,image:'/media/1645343294956.jpeg'}).length,2);
});
test('new room collections replace explicit pending covers once and preserve staff choices and publication state',()=>{
 const sql=new DatabaseSync(':memory:');
 try{
  sql.exec('CREATE TABLE migrations(version INTEGER PRIMARY KEY,applied_at TEXT); CREATE TABLE content(id TEXT PRIMARY KEY,kind TEXT,slug TEXT,title TEXT,payload TEXT);');
  const pending={...profileRooms.find(r=>r.slug==='deluxe-king')!,image:'',published:false,description:'Staff room description',details:{photoNote:'A photograph identified as Deluxe King is not yet available.',rate:'999'}};
  const staff={...profileRooms.find(r=>r.slug==='junior-suite')!,image:'/media/staff.webp'};
  const insert=sql.prepare('INSERT INTO content VALUES(?,?,?,?,?)');for(const r of [pending,staff])insert.run(r.id,r.kind,r.slug,r.title,JSON.stringify(r));
  migrateRoomCollections(sql);
  const read=(id:string)=>JSON.parse((sql.prepare('SELECT payload FROM content WHERE id=?').get(id) as {payload:string}).payload);
  const result=read(pending.id);assert.equal(result.image,'/media/collection/deluxe-king-bedroom.webp');assert.equal(result.published,false);assert.equal(result.description,pending.description);assert.equal(result.details.rate,'999');assert.deepEqual(read(staff.id),staff);
  const before=sql.prepare('SELECT payload FROM content').all();migrateRoomCollections(sql);assert.deepEqual(sql.prepare('SELECT payload FROM content').all(),before);
 }finally{sql.close();}
});
test('photo review corrects known mismatches without overwriting staff copy or publication controls',()=>{
 const sql=new DatabaseSync(':memory:');
 try{
  sql.exec('CREATE TABLE migrations(version INTEGER PRIMARY KEY,applied_at TEXT); CREATE TABLE content(id TEXT PRIMARY KEY,kind TEXT,slug TEXT,title TEXT,payload TEXT);');
  const insert=sql.prepare('INSERT INTO content VALUES(?,?,?,?,?)');
  const library={...seedItems.find(x=>x.slug==='mini-library')!,image:'/media/collection/hotel-reading-corner.webp',published:false};
  const edited={...seedItems.find(x=>x.slug==='arjuna-resto')!,image:'/media/staff-photo.webp',description:'Staff dining copy',updatedAt:'2026-09-27'};
  const noPhoto={...seedItems.find(x=>x.slug==='mushola')!};
  for(const x of [library,edited,noPhoto])insert.run(x.id,x.kind,x.slug,x.title,JSON.stringify(x));
  migrateReviewedContent(sql);
  const read=(id:string)=>JSON.parse((sql.prepare('SELECT payload FROM content WHERE id=?').get(id) as {payload:string}).payload);
  assert.equal(read(library.id).image,'/media/collection/reading-selection.webp');assert.equal(read(library.id).published,false);
  assert.deepEqual(read(edited.id),edited);assert.equal(read(noPhoto.id).image,'');assert.equal(read(noPhoto.id).active,true);
  const before=sql.prepare('SELECT payload FROM content').all();migrateReviewedContent(sql);assert.deepEqual(sql.prepare('SELECT payload FROM content').all(),before);
 }finally{sql.close();}
});
test('profile migration imports eight categories and 77 rooms while preserving staff changes and publication controls',()=>{
 const sql=new DatabaseSync(':memory:');
 try{
  sql.exec('CREATE TABLE migrations(version INTEGER PRIMARY KEY,applied_at TEXT); CREATE TABLE content(id TEXT PRIMARY KEY,kind TEXT,slug TEXT,title TEXT,payload TEXT,UNIQUE(kind,slug)); CREATE TABLE settings(id INTEGER PRIMARY KEY,payload TEXT);');
  const insert=sql.prepare('INSERT INTO content VALUES(?,?,?,?,?)');for(const item of seedItems)insert.run(item.id,item.kind,item.slug,item.title,JSON.stringify(item));
  sql.prepare('INSERT INTO settings VALUES(1,?)').run(JSON.stringify({...defaultSettings,phone:'TEST-PRESERVE',heroVideo:'/media/custom.mp4'}));
  const original=seedItems.find(i=>i.slug==='superior-king')!;
  const edited={...original,description:'A staff-written description',details:{bed:'Staff bed arrangement'},published:false,updatedAt:'2026-09-19',verifiedBy:'Hotel staff'};
  sql.prepare('UPDATE content SET payload=? WHERE id=?').run(JSON.stringify(edited),edited.id);
  migrateHotelProfile(sql);
  const rows=(sql.prepare("SELECT payload FROM content WHERE kind='room'").all() as {payload:string}[]).map(r=>JSON.parse(r.payload)).filter(r=>r.active);
  assert.equal(rows.length,8);assert.equal(rows.reduce((sum,r)=>sum+Number(r.details.inventory),0),77);
  const preserved=rows.find(r=>r.id===edited.id);assert.equal(preserved.description,edited.description);assert.equal(preserved.details.bed,'Staff bed arrangement');assert.equal(preserved.details.area,'20');assert.equal(preserved.published,false);
  const settings=JSON.parse((sql.prepare('SELECT payload FROM settings').get() as {payload:string}).payload);assert.equal(settings.phone,'TEST-PRESERVE');assert.equal(settings.heroVideo,'/media/custom.mp4');
  const before=sql.prepare('SELECT payload FROM content ORDER BY id').all();migrateHotelProfile(sql);assert.deepEqual(sql.prepare('SELECT payload FROM content ORDER BY id').all(),before);
 }finally{sql.close();}
});
test('only verified, published, active content is public and seed runs once',()=>{const room=content().find(i=>i.kind==='room')!;saveContent({...room,verified:false});assert(!content().some(i=>i.id===room.id));closeDb();assert(!content().some(i=>i.id===room.id));saveContent({...room,active:false});assert(!content().some(i=>i.id===room.id));assert(!content().some(i=>i.kind==='trust'));});
test('publication requires verification and evidence',()=>{const r=content(true).find(i=>i.kind==='room')!;const {verifiedAt,verifiedBy,updatedAt,...input}=r;void verifiedAt;void verifiedBy;void updatedAt;assert(!contentSchema.safeParse({...input,published:true,verified:false}).success);assert(!contentSchema.safeParse({...input,published:true,verified:true,sourceNote:''}).success);assert(!contentSchema.safeParse({...input,image:'https://example.com/test.svg'}).success);});
const valid={kind:'reservation',name:'Test Guest',email:'test@example.com',phone:'+62812345678',message:'',consent:true,source:'/rooms',context:{checkIn:'2099-10-10',checkOut:'2099-10-12',guests:2}};
test('event requests retain planning fields and reject invalid times, layouts, and past dates',()=>{
 const input={...valid,kind:'event',context:{occasion:'Business',guests:80,venue:'Majapahit',layout:'Theatre',duration:'Half day',startTime:'09:30',date:'2099-10-10'}};
 const parsed=inquirySchema.parse(input);assert.deepEqual(parsed.context,input.context);
 for(const extra of [{startTime:'24:01'},{layout:'Unknown'},{date:'2000-01-01'},{guests:0},{guests:30.5}])assert(!inquirySchema.safeParse({...input,context:{...input.context,...extra}}).success);
 const record={...parsed,id:'TEST-EVENT-PLANNING',kind:'event' as const,status:'new' as const,staffNote:'',consentAt:new Date().toISOString(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 saveInquiry(record);closeDb();assert.deepEqual(inquiries().find(i=>i.id===record.id)?.context,input.context);
});
test('venue suggestions respect the selected layout and return no match for oversized or invalid groups',()=>{
 assert.deepEqual(suitableVenues(100,'Theatre').map(v=>v.name),['Majapahit','Erlangga']);
 assert.deepEqual(suitableVenues(100,'Round tables').map(v=>v.name),['Majapahit']);
 assert.deepEqual(suitableVenues(50,'U-shape').map(v=>v.name),['Majapahit','Erlangga']);
 for(const n of [0,-1,30.5,300,2000])assert.equal(suitableVenues(n,'Theatre').length,0);
});
test('rejects consent bypass, invalid dates, reversed dates, spam, excess data',()=>{assert(inquirySchema.safeParse(valid).success);for(const x of [{...valid,consent:false},{...valid,website:'spam'},{...valid,context:{...valid.context,checkOut:'2099-10-09'}},{...valid,context:{...valid.context,checkIn:'2099-02-31'}},{...valid,context:{...valid.context,guests:0}},{...valid,extra:'unexpected'}])assert(!inquirySchema.safeParse(x).success);});
test('requests persist and status changes preserve consent and guest data',()=>{const time=new Date().toISOString();const record={id:'TEST-REQUEST',kind:'reservation' as const,name:'Test Guest',email:'test@example.com',phone:'+62812345678',message:'Test',context:{room:'Superior King'},status:'new' as const,staffNote:'',source:'/',consentAt:time,createdAt:time,updatedAt:time};saveInquiry(record);closeDb();assert.equal(inquiries()[0].name,'Test Guest');saveInquiry({...record,status:'contacted',staffNote:'Called'});assert.equal(inquiries()[0].consentAt,time);assert.equal(inquiries()[0].status,'contacted');});
test('password hashes are salted and session tokens stored only as hashes',()=>{const first=hashPassword('test-secret-long-enough');assert.notEqual(first,hashPassword('test-secret-long-enough'));assert(verifyPassword('test-secret-long-enough',first));assert(!verifyPassword('wrong',first));db().prepare('INSERT INTO admins VALUES(?,?,?)').run('test-admin','admin@example.com',first);const token=createSession('test-admin');assert.equal(sessionAdmin(token)?.id,'test-admin');assert.equal(sessionAdmin('invalid'),null);assert(db().prepare('SELECT token_hash FROM sessions WHERE token_hash=?').get(digest(token)));db().prepare('UPDATE sessions SET expires_at=0').run();assert(!sessionAdmin(token));});
test('rate limits cannot be bypassed by repeated updates in the same window',()=>{assert(rateLimit('test',2,60000));assert(rateLimit('test',2,60000));assert(!rateLimit('test',2,60000));});
test('cross-site mutations and oversized payloads are rejected',async()=>{assert(sameOrigin(new Request('http://localhost:3000/api',{headers:{origin:'http://localhost:3000'}})));assert(!sameOrigin(new Request('http://localhost:3000/api',{headers:{origin:'https://attacker.example'}})));await assert.rejects(readBody(new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({large:'x'.repeat(100)})}),20));});

test('invalid JSON, media types, and oversized requests produce client errors and release the stream',async()=>{
 for(const [body,type,status,max] of [['{','application/json',400,100],['{}','text/plain; application/json',415,100],['"long payload"','application/json',413,4]] as const){
  const request=new Request('http://localhost',{method:'POST',headers:{'Content-Type':type},body});
  await assert.rejects(readBody(request,max),(error:unknown)=>error instanceof RequestBodyError&&error.status===status);
  assert.equal(request.body?.locked,false);
 }
 await assert.rejects(readBody(new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'}})),(error:unknown)=>error instanceof RequestBodyError&&error.status===400);
 assert.deepEqual(await readBody(new Request('http://localhost',{method:'POST',headers:{'Content-Type':'Application/JSON; charset=utf-8'},body:'{"name":"Guest"}'})),{name:'Guest'});
});

test('staff follow-up updates reject impossible dates and preserve optional fields and clearing',()=>{
 const update={id:'TEST-REQUEST',status:'contacted',staffNote:'Called guest'};
 for(const followUpDate of ['2026-02-30','2026-13-01','2026-2-01','not-a-date'])assert.equal(inquiryUpdateSchema.safeParse({...update,followUpDate}).success,false,followUpDate);
 assert.equal(inquiryUpdateSchema.parse({...update,followUpDate:'2028-02-29'}).followUpDate,'2028-02-29');
 assert.equal(inquiryUpdateSchema.parse({...update,followUpDate:''}).followUpDate,'');
 assert.equal(inquiryUpdateSchema.parse(update).followUpDate,undefined);
 assert.equal(inquiryUpdateSchema.safeParse({...update,salesOwner:'x'.repeat(101)}).success,false);
 assert.equal(inquiryUpdateSchema.safeParse(null).success,false);
});

import {siteNavigation,eventNavigation,isNavigationActive} from '../lib/site-navigation.ts';
test('navigation retains all public destinations and event tools',()=>{
 assert.deepEqual(siteNavigation.map(([,slug])=>slug),['','rooms','gallery','facilities','dining','hotel-info','explore','events','contact']);
 const paths=eventNavigation.map(([,path])=>path);
 assert.equal(new Set(paths).size,paths.length);
 for(const path of ['layout-planner','gallery','site-inspection','group-accommodation','request-proposal'])assert.ok(paths.includes(path as typeof paths[number]));
});
test('active navigation matches the current route, not a stale home section',()=>{
 assert.equal(isNavigationActive('/',''),true);
 assert.equal(isNavigationActive('/rooms/deluxe','rooms'),true);
 assert.equal(isNavigationActive('/facilities','rooms'),false);
 assert.equal(isNavigationActive('/rooms-other','rooms'),false);
 assert.equal(isNavigationActive('/events',''),false);
});
