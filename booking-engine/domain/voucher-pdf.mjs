import PDFDocument from 'pdfkit';
import {resolve} from 'node:path';
import {root} from './store.mjs';
import {money} from './documents.mjs';
const statuses={confirmed:'TERKONFIRMASI',awaiting_payment:'MENUNGGU PEMBAYARAN',cancelled:'DIBATALKAN',expired:'KEDALUWARSA',payment_review:'PEMBAYARAN DITINJAU'};
const date=value=>new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value));
export function createVoucherPdf(r,audience='guest') {return new Promise((resolvePdf,reject)=>{
 const doc=new PDFDocument({size:'A4',margins:{top:44,bottom:60,left:42,right:42},bufferPages:true,info:{Title:`Ramayana ${audience==='hotel'?'Hotel Reservation':'Stay Voucher'} ${r.code}`,Author:'Ramayana Hotel Makassar',Subject:'BUKTI SIMULASI - BUKAN RESERVASI HOTEL NYATA'}}),chunks=[];
 doc.on('data',b=>chunks.push(b));doc.on('end',()=>resolvePdf(Buffer.concat(chunks)));doc.on('error',reject);
 try{doc.registerFont('Body',resolve(root,'public/assets/montserrat-latin-400-normal.ttf'));doc.registerFont('Bold',resolve(root,'public/assets/montserrat-latin-600-normal.ttf'));doc.registerFont('Display',resolve(root,'public/assets/playfair-display-latin-500-normal.ttf'));
 const hotel=audience==='hotel',q=r.quote,left=42,right=553,width=511,ink='#332a20',gold='#886b40',muted='#6f6455';let y=0;
 const text=(value,x,top,w=width,size=9,font='Body',color=ink,extra={})=>{doc.font(font).fontSize(size).fillColor(color).text(String(value??''),x,top,{width:w,lineGap:3,...extra});return doc.y;};
 const rule=(top)=>doc.moveTo(left,top).lineTo(right,top).lineWidth(.6).strokeColor('#ded2c0').stroke();
 function pageHeader(continuation=false){doc.rect(0,0,595.28,80).fill('#ebe1d1');doc.image(resolve(root,'public/assets/logo.png'),left,20,{width:124});text(hotel?'HOTEL RESERVATION SHEET':'YOUR PRIVATE STAY VOUCHER',322,25,231,7,'Body',gold,{align:'right',characterSpacing:1});text(r.code,322,43,231,11,'Bold',ink,{align:'right'});y=96;if(continuation){text('Rincian reservasi - lanjutan',left,y,width,15,'Display');y+=30;}}
 function ensure(height){if(y+height>744){doc.addPage();pageHeader(true);}}
 function label(value,x,top,w=width){return text(value,x,top,w,7,'Bold',gold,{characterSpacing:.9});}
 function paragraphHeight(value,size=9){doc.font('Body').fontSize(size);return doc.heightOfString(String(value),{width,lineGap:3})+7;}
 function paragraph(value,size=9){ensure(paragraphHeight(value,size));y=text(value,left,y,width,size)+7;}
 function heading(value,following=40){ensure(28+following);y=text(value,left,y,width,15,'Display')+8;}
 pageHeader();label('MAKASSAR / DIRECT RESERVATIONS',left,y);y+=16;y=text(hotel?'A thoughtful welcome starts here.':'Your next chapter, at Ramayana.',left,y,width,25,'Display')+10;
 label(`${statuses[r.status]||r.status.toUpperCase()}  /  BUKTI SIMULASI`,left,y);y+=20;rule(y);y+=16;
 label('TAMU UTAMA',left,y);y+=16;y=text(r.guest.leadGuest||r.guest.name,left,y,width,20,'Display')+8;paragraph(`Pemesan: ${r.guest.name}  |  ${q.rooms.length} kamar  |  ${q.nights} malam`,9);
 if(hotel)paragraph(`Kontak: ${r.guest.email}  /  ${r.guest.phone}`,9);
 ensure(75);doc.roundedRect(left,y,width,63,8).fill('#f5f0e7');label('CHECK-IN',left+16,y+12,220);label('CHECK-OUT',left+285,y+12,210);text(date(q.checkIn),left+16,y+27,230,13,'Display');text(date(q.checkOut),left+285,y+27,210,13,'Display');text(q.policies.checkIn,left+16,y+46,220,8,'Body',muted);text(q.policies.checkOut,left+285,y+46,210,8,'Body',muted);y+=75;
 heading('Pilihan kamar & paket');
 for(const [index,room]of q.rooms.entries()){ensure(62);text(`${String(index+1).padStart(2,'0')}  ${room.name}`,left,y,340,10,'Bold');text(money(room.total),399,y,154,10,'Bold',ink,{align:'right'});y+=18;const detail=`${room.plan==='breakfast'?'Dengan sarapan':'Kamar saja'} / ${room.adults} dewasa${room.children.length?' / '+room.children.length+' anak (usia '+room.children.join(', ')+')':''}`;y=text(detail,left+20,y,450,8,'Body',muted)+12;rule(y);y+=12;}
 ensure(104);const top=y;label('RINGKASAN PEMBAYARAN',left,top,245);text(q.policies.tax,left,top+19,238,8,'Body',muted);let financeY=top;for(const [title,value,bold]of [['Subtotal',q.subtotal,false],['Diskon',q.discount?-q.discount:0,false],['Total reservasi',r.total,true],['Pembayaran bersih',r.paid,false]]){text(title,310,financeY,116,bold?9:8,bold?'Bold':'Body');text(money(value),418,financeY,135,bold?11:9,bold?'Bold':'Body',ink,{align:'right'});financeY+=bold?22:18;}y=financeY+9;rule(y);y+=16;
 const personal=`Perkiraan tiba: ${r.guest.arrival?r.guest.arrival+' WITA':'belum diberikan'}. ${r.guest.request||'Tidak ada catatan khusus.'}`;
 const notes=[[personal,9],[`Layanan diminta: ${q.addOns.join(', ')||'Tidak ada'}. Layanan tambahan belum disetujui dan belum ditagih.`,8]];
 if(hotel)notes.push(['Front Office: verifikasi identitas saat kedatangan, tetapkan nomor kamar, dan koordinasikan layanan tambahan sebelum mengonfirmasi kepada tamu.',8]);
 const policies=[[q.policies.cancellation,8],['Bawa identitas resmi dan referensi reservasi. Semua waktu menggunakan WITA (UTC+8). Dokumen ini adalah bukti simulasi, bukan reservasi kamar hotel nyata.',8],[`Kebijakan tersimpan: ${q.policies.version}. Status dokumen berlaku saat diterbitkan; periksa kembali melalui Kelola Reservasi.`,7]];
 const columnWidth=243,columnHeight=items=>32+items.reduce((sum,[copy,size])=>{doc.font('Body').fontSize(size);return sum+doc.heightOfString(copy,{width:columnWidth,lineGap:3})+7;},0);
 const noteHeight=Math.max(columnHeight(notes),columnHeight(policies));
 if(noteHeight<=200){ensure(noteHeight);const column=(title,items,x)=>{let cy=text(title,x,y,columnWidth,15,'Display')+10;for(const [copy,size]of items)cy=text(copy,x,cy,columnWidth,size)+7;return cy;};const endNotes=column(hotel?'Persiapan kedatangan':'Sentuhan personal',notes,left),endPolicies=column('Informasi sebelum tiba',policies,310);y=Math.max(endNotes,endPolicies);}
 else {heading(hotel?'Persiapan kedatangan':'Sentuhan personal',paragraphHeight(personal));for(const [copy,size]of notes)paragraph(copy,size);heading('Informasi sebelum tiba',policies.reduce((height,[copy,size])=>height+paragraphHeight(copy,size),0));for(const [copy,size]of policies)paragraph(copy,size);}
 const pages=doc.bufferedPageRange();for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);doc.page.margins.bottom=0;rule(765);text('RAMAYANA HOTEL MAKASSAR',left,777,400,7,'Bold',gold);text('Jl. Gunung Bawakaraeng No. 121 / +62 411 4669090',left,792,420,7,'Body',muted);text('ramayanahotelmksr@gmail.com',left,805,400,7,'Body',muted);text(`${i+1} / ${pages.count}`,490,793,63,8,'Body',gold,{align:'right'});}
 doc.end();}catch(error){doc.destroy();reject(error);}
});}
