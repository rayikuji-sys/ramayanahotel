import {Fault,integer,text,today,uid,audit} from './booking.mjs';
import {transaction} from './store.mjs';

export const defaultSettings={hotelName:'Ramayana Hotel Makassar',phone:'+62 411 4669090',email:'ramayanahotelmksr@gmail.com',address:'Jl. Gunung Bawakaraeng No. 121, Makassar',checkIn:'14:00',checkOut:'12:00',extraBed:200000,decoration:250000};
export function experienceSettings(db){const row=db.prepare('SELECT payload FROM booking_settings WHERE id=1').get();return {...defaultSettings,...row?JSON.parse(row.payload):{}};}
export function saveExperienceSettings(db,input,actor){
 const out={};for(const key of ['hotelName','phone','email','address'])out[key]=text(input[key],key==='address'?300:150,key,3);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)||!/^[+\d ()-]{7,30}$/.test(out.phone))throw new Fault('SETTINGS','Kontak hotel tidak valid.');
 for(const key of ['checkIn','checkOut']){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input[key]))throw new Fault('SETTINGS','Jam hotel tidak valid.');out[key]=input[key];}
 for(const key of ['extraBed','decoration'])out[key]=integer(input[key],0,10000000,key);
 transaction(db,()=>{db.prepare('INSERT INTO booking_settings VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(JSON.stringify(out));audit(db,actor,'settings-updated','hotel');});return out;
}
export function addOnPricing(db,addOns,nights,quantities={},roomCount=1){
 if(!quantities||typeof quantities!=='object'||Array.isArray(quantities))throw new Fault('ADD_ON','Jumlah layanan tidak valid.');
 const config=experienceSettings(db),lines=[];
 for(const id of addOns){const quantity=id==='extra-bed'?integer(quantities[id]??1,1,roomCount,'Extra bed'):1;
  const unitPrice=id==='extra-bed'?config.extraBed:id==='celebration'?config.decoration:0;
  lines.push({id,name:({'extra-bed':'Extra Bed',celebration:'Dekorasi kamar',transfer:'Antar-Jemput Bandara','late-checkout':'Late Check-out'})[id],quantity,unitPrice,unit:id==='extra-bed'?'night':'stay',total:unitPrice*quantity*(id==='extra-bed'?nights:1),status:unitPrice?'priced':'requested'});
 }return lines;
}
export function promoDiscount(db,code,total){
 if(!code)return 0;
 const p=db.prepare('SELECT * FROM booking_promos WHERE code=?').get(code);
 if(p){if(!p.active||p.valid_from>today()||p.valid_to<today())throw new Fault('PROMO','Kode sudah berakhir atau belum aktif.');return Math.floor(total*p.percent/100);}
 if(code==='SANDBOX10')return Math.floor(total/10);
 throw new Fault('PROMO','Kode tidak tersedia. Hubungi Sales untuk kode perusahaan/acara.');
}
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export function savePromo(db,input,actor){const code=text(input.code,40,'Kode',3).toUpperCase();if(!/^[A-Z0-9-]+$/.test(code))throw new Fault('PROMO','Format kode tidak valid.');if(!date(input.from)||!date(input.to)||input.from>input.to)throw new Fault('PROMO','Periode tidak valid.');const title=text(input.title,150,'Nama',2),percent=integer(input.percent,0,100,'Diskon');transaction(db,()=>{db.prepare('INSERT INTO booking_promos VALUES(?,?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET title=excluded.title,percent=excluded.percent,valid_from=excluded.valid_from,valid_to=excluded.valid_to,active=excluded.active').run(code,title,percent,input.from,input.to,input.active===true?1:0);audit(db,actor,'promo-updated',code);});}
export function saveOperations(db,input,actor){
 const r=db.prepare('SELECT * FROM reservations WHERE id=?').get(text(input.id,100,'Reservasi',1));if(!r)throw new Fault('NOT_FOUND','Reservasi tidak ditemukan.',404);
 const roomNumber=text(input.roomNumber||'',100,'Nomor kamar'),notes=text(input.notes||'',3000,'Catatan');
 const old=db.prepare('SELECT * FROM reservation_operations WHERE reservation_id=?').get(r.id);
 const fee=integer(input.distributionFee??old?.distribution_fee??0,0,r.total,'Potongan distribusi'),settled=integer(input.settled??old?.settled??0,0,r.total-fee,'Settlement');
 if(input.settlementDate&&!date(input.settlementDate))throw new Fault('SETTLEMENT','Tanggal settlement tidak valid.');
 transaction(db,()=>{db.prepare('INSERT INTO reservation_operations VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(reservation_id) DO UPDATE SET room_number=excluded.room_number,notes=excluded.notes,distribution_fee=excluded.distribution_fee,settled=excluded.settled,settlement_date=excluded.settlement_date,updated_by=excluded.updated_by,updated_at=excluded.updated_at').run(r.id,roomNumber,notes,fee,settled,input.settlementDate??old?.settlement_date??'',actor,Date.now());audit(db,actor,'operations-updated',r.id);});
}
export function serviceRequest(db,reservation,input){if(reservation.status!=='confirmed')throw new Fault('STATUS','Layanan hanya dapat diminta untuk reservasi terkonfirmasi.',409);const service=text(input.service,40,'Layanan',1);if(!['transfer','celebration','extra-bed','late-checkout'].includes(service))throw new Fault('SERVICE','Layanan tidak ditemukan.');const note=text(input.note||'',1000,'Catatan');const id=uid();transaction(db,()=>{db.prepare("INSERT INTO requests VALUES(?,?, 'service',?,'pending',?)").run(id,reservation.id,JSON.stringify({service,note}),Date.now());db.prepare("INSERT INTO tasks VALUES(?,?,?,?,?,'pending')").run(uid(),reservation.id,service==='celebration'?'Housekeeping':'FO',service+': '+note,JSON.parse(reservation.snapshot).checkIn);audit(db,'guest','service-requested',reservation.id);});return {id,status:'pending'};}
export function overview(db){return {settings:experienceSettings(db),promos:db.prepare('SELECT * FROM booking_promos ORDER BY code').all(),operations:db.prepare('SELECT * FROM reservation_operations').all(),paymentMethods:db.prepare('SELECT * FROM payment_methods').all(),ledger:db.prepare('SELECT * FROM ledger ORDER BY created DESC').all()};}
