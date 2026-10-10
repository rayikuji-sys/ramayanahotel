import PDFDocument from 'pdfkit';
import {resolve} from 'node:path';
import {root} from './store.mjs';
import {assetBytes} from '../../lib/asset-store.mjs';
import {money} from './documents.mjs';
import {voucherDetails} from './voucher-details.mjs';
const statuses={confirmed:'TERKONFIRMASI',awaiting_payment:'MENUNGGU PEMBAYARAN',cancelled:'DIBATALKAN',expired:'KEDALUWARSA',payment_review:'PEMBAYARAN DITINJAU'};
const date=value=>new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value));
export function createVoucherPdf(r,audience='guest'){return new Promise((done,reject)=>{
 const doc=new PDFDocument({size:'A4',margins:{top:42,bottom:68,left:42,right:42},bufferPages:true,info:{Title:`Ramayana E-Voucher ${r.code}`,Author:'Ramayana Hotel Makassar',Subject:'BUKTI SIMULASI - BUKAN RESERVASI HOTEL NYATA'}}),chunks=[];
 doc.on('data',chunk=>chunks.push(chunk));doc.on('end',()=>done(Buffer.concat(chunks)));doc.on('error',reject);
 try{
 doc.registerFont('Body',resolve(root,'public/assets/montserrat-latin-400-normal.ttf'));doc.registerFont('Bold',resolve(root,'public/assets/montserrat-latin-600-normal.ttf'));doc.registerFont('Display',resolve(root,'public/assets/playfair-display-latin-500-normal.ttf'));
 const q=r.quote,facts=voucherDetails(r),hotel=audience==='hotel',ink='#252a31',gold='#8c6b3d',muted='#626b75',line='#e1ded7',left=42,width=511,right=553;let y=0;
 const text=(value,x,top,w=width,size=9,font='Body',color=ink,options={})=>{doc.font(font).fontSize(size).fillColor(color).text(String(value??''),x,top,{width:w,lineGap:3,...options});return doc.y;};
 const height=(copy,w=width,size=9,font='Body')=>doc.font(font).fontSize(size).heightOfString(String(copy??''),{width:w,lineGap:3});
 const rule=top=>doc.moveTo(left,top).lineTo(right,top).lineWidth(.6).strokeColor(line).stroke();
 const label=(copy,x,top,w=width)=>text(copy,x,top,w,7,'Bold',gold,{characterSpacing:.8});
 function header(continued=false){doc.rect(0,0,595.28,7).fill(gold);doc.image(assetBytes('booking:ramayana-official.png'),left,18,{fit:[108,47]});label(hotel?'SALINAN INTERNAL HOTEL':'DIRECT RESERVATIONS',305,31,248);text('MAKASSAR, INDONESIA',305,47,248,8,'Body',muted);rule(78);y=92;if(continued){text('Rincian menginap / lanjutan',left,y,width,18,'Display');y+=38;}}
 function ensure(space){if(y+space>752){doc.addPage();header(true);}}
 function heading(number,title){ensure(58);label(number,left,y,25);text(title,left+30,y-4,width-30,15,'Display');y+=23;}
 function paragraph(copy,size=8.5){const h=height(copy,width,size);if(h<=600){ensure(h+9);y=text(copy,left,y,width,size,'Body',muted)+9;return;}for(const part of String(copy).match(/[\s\S]{1,800}/g)||[String(copy)]){ensure(height(part,width,size)+9);y=text(part,left,y,width,size,'Body',muted)+9;}}
 header();label('E-VOUCHER RESERVASI',left,y);y+=18;text(hotel?'Kesiapan setiap kedatangan.':'Menginap dengan tenang.',left,y,width,26,'Display');y+=34;
 const refHeight=Math.max(56,height(r.code,300,17,'Bold')+31);doc.roundedRect(left,y,width,refHeight,8).fill(ink);text('REFERENSI RESERVASI',left+17,y+12,300,7,'Body','#d8c6a6',{characterSpacing:1});text(r.code,left+17,y+23,300,17,'Bold','#ffffff');text(statuses[r.status]||r.status.toUpperCase(),368,y+20,165,8,'Bold','#f4e6ca',{align:'right'});y+=refHeight+9;label('BUKTI SIMULASI - BUKAN RESERVASI HOTEL NYATA',left,y);y+=20;
 label('TAMU UTAMA',left,y,320);label('DIPESAN PADA',383,y,170);y+=14;const guestBottom=text(r.guest.leadGuest||r.guest.name,left,y,320,17,'Display');const bookedBottom=text(facts.booked,383,y,170,8,'Body',muted);y=Math.max(guestBottom,bookedBottom)+7;paragraph(`Pemesan: ${r.guest.name}. ${facts.adults} dewasa${facts.children?' / '+facts.children+' anak':''} / ${q.rooms.length} kamar.`,8);
 if(hotel)paragraph(`Kontak tamu: ${r.guest.email||'-'} / ${r.guest.phone||'-'}`,8);
 ensure(78);doc.roundedRect(left,y,width,67,8).fill('#f5f1e9');label('CHECK-IN',left+15,y+11,195);label('CHECK-OUT',left+298,y+11,195);text(date(q.checkIn),left+15,y+25,195,14,'Display');text(date(q.checkOut),left+298,y+25,195,14,'Display');text(q.policies.checkIn,left+15,y+48,195,8,'Body',muted);text(q.policies.checkOut,left+298,y+48,195,8,'Body',muted);text(q.nights,left+219,y+16,72,22,'Display',gold,{align:'center'});text('MALAM',left+219,y+44,72,7,'Body',gold,{align:'center'});y+=77;
 heading('01','Kamar & pengalaman menginap');
 for(const [index,room]of q.rooms.entries()){
  const details=`${room.plan==='breakfast'?'Dengan sarapan':'Kamar saja'} / ${room.adults} dewasa${room.children?.length?' / '+room.children.length+' anak (usia '+room.children.join(', ')+')':''}`;
  const h=height(room.name,345,10,'Bold')+height(details,345,8)+18;ensure(h+5);let bottom=text(`${String(index+1).padStart(2,'0')}  ${room.name}`,left,y,345,10,'Bold');text(money(room.total),395,y,158,10,'Bold',ink,{align:'right'});bottom=text(details,left,bottom+4,345,8,'Body',muted);y=bottom+7;rule(y);y+=7;
 }
 for(const extra of q.extras||[]){const h=height(extra.name,300,8)+18;ensure(h+5);const bottom=text(extra.name,left,y,300,8);text(extra.total?money(extra.total):'Menunggu konfirmasi',360,y,193,8,'Body',muted,{align:'right'});y=Math.max(bottom,doc.y)+8;}
 ensure(138);y+=4;heading('02','Rincian pembayaran');const top=y;
 label('METODE',left,top,230);text(facts.method,left,top+14,230,9,'Bold');text(q.policies.tax,left,top+34,230,8,'Body',muted);text(facts.payment,left,top+59,230,8,'Body',muted);
 for(const [title,value,bold]of [['Subtotal',q.subtotal,false],['Diskon',q.discount?-q.discount:0,false],['Total reservasi',r.total,true],['Pembayaran bersih',r.paid,false],...['confirmed','awaiting_payment','payment_review'].includes(r.status)?[['Sisa tagihan',facts.balance,false]]:[]]){
  if(bold){doc.roundedRect(310,y-4,243,25,4).fill('#f5f1e9');}text(title,320,y,113,8,bold?'Bold':'Body');text(money(value),424,y,119,bold?11:9,bold?'Bold':'Body',ink,{align:'right'});y+=bold?27:17;
 }y=Math.max(y,top+90)+10;
 const arrival=`Perkiraan tiba: ${r.guest.arrival?r.guest.arrival+' WITA':'belum diberikan'}. ${r.guest.request||'Tidak ada permintaan khusus.'}`;
 ensure(32+Math.min(600,height(arrival,width,8.5)));heading('03','Permintaan & informasi kedatangan');paragraph(arrival);
 if((q.extras||[]).some(x=>!x.total))paragraph('Layanan tanpa harga masih menunggu konfirmasi hotel dan belum ditagih.');
 paragraph('Bawa identitas resmi dan referensi reservasi saat check-in. Seluruh waktu menggunakan WITA (UTC+8).');
 ensure(32+Math.min(600,height(q.policies.cancellation,width,8.5)));heading('04','Kebijakan pembatalan');paragraph(q.policies.cancellation);paragraph(`Kebijakan reservasi: ${q.policies.version}. Status pada dokumen berlaku saat diterbitkan; lihat Kelola Reservasi untuk pembaruan.`,7.5);
 const pages=doc.bufferedPageRange();for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);doc.page.margins.bottom=0;rule(772);text('RAMAYANA HOTEL MAKASSAR',left,783,390,7,'Bold',gold);text('Jl. Gunung Bawakaraeng No. 121, Makassar',left,796,410,7,'Body',muted);text('+62 411 4669090 / ramayanahotelmksr@gmail.com',left,809,430,7,'Body',muted);text(`${i+1} / ${pages.count}`,495,796,58,8,'Body',gold,{align:'right'});}
 doc.end();
 }catch(error){doc.destroy();reject(error);}
});}
