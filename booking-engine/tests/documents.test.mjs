import test from 'node:test';
import assert from 'node:assert/strict';
import {voucher,mountDocument} from '../domain/documents.mjs';
import {controlDocument} from '../domain/control-document.mjs';
import {voucherDetails} from '../domain/voucher-details.mjs';
const reservation={code:'TEST-001',status:'confirmed',total:1550000,paid:1550000,guest:{name:'Guest <script>unsafe</script>',request:'<img src=x>',email:'private@example.test'},quote:{checkIn:'2026-11-12',checkOut:'2026-11-14',nights:2,subtotal:1550000,discount:0,addOns:['celebration','transfer'],extras:[{name:'Dekorasi kamar',total:250000},{name:'Antar-jemput bandara',total:0}],rooms:[{name:'Deluxe King',adults:2,children:[],plan:'breakfast',total:1300000}],policies:{checkIn:'14:00 WITA',checkOut:'12:00 WITA',tax:'Termasuk',cancellation:'Sesuai paket',version:'test'}}};
test('voucher and internal document assets work behind the hotel proxy and standalone',()=>{
 for(const html of [voucher(reservation),controlDocument(reservation)]){
  const mounted=mountDocument(html,'/booking');
  for(const path of ['/voucher.css','/assets/ramayana-official.png','/print.js'])assert.ok(mounted.includes('"/booking'+path+'"'));
  assert.equal(mountDocument(html),html);
  assert.equal(mountDocument(html,'https://untrusted.example'),html);
 }
});
test('voucher distinguishes charged extras from unpriced requests and escapes guest content',()=>{const html=voucher(reservation);assert.match(html,/Dekorasi kamar: Rp 250.000 · termasuk total reservasi/);assert.match(html,/Antar-jemput bandara: menunggu konfirmasi hotel, belum ditagih/);assert.doesNotMatch(html,/<script>unsafe|<img src=x>/);assert.match(html,/E-Voucher/);});
test('internal control document reflects department task states without inventing settlement',()=>{const html=controlDocument(reservation,[{department:'Housekeeping',description:'Dekorasi <b>kamar</b>',due_date:'2026-11-12',status:'accepted'}]);assert.match(html,/Dikerjakan/);assert.match(html,/Dekorasi &lt;b&gt;kamar&lt;\/b&gt;/);assert.match(html,/Provider settlement belum terhubung/);assert.match(html,/Rp 1.550.000/);assert.doesNotMatch(html,/<script>unsafe/);});
test('internal document uses saved room assignment, operational notes and manual settlement',()=>{
 const html=controlDocument(reservation,[],{room_number:'401',notes:'Prepare <cake>',distribution_fee:150000,settled:1000000});
 assert.match(html,/Nomor kamar: 401/);assert.match(html,/Prepare &lt;cake&gt;/);
 assert.match(html,/Terkonfirmasi/);assert.match(html,/Rp 400.000/);
 assert.match(html,/Catatan settlement manual dalam sandbox/);
});
test('voucher states payment balance, recorded method and WITA without exposing guest contacts',()=>{
 const partial={...reservation,created:Date.UTC(2026,10,10,6,28),paid:500000,paymentMethod:'qris'};
 const facts=voucherDetails(partial);assert.equal(facts.balance,1050000);assert.equal(facts.method,'QRIS');assert.match(facts.booked,/14.28 WITA/);assert.doesNotMatch(facts.payment,/lunas/);
 const guest=voucher(partial);assert.match(guest,/Rp 1.050.000/);assert.doesNotMatch(guest,/private@example.test/);assert.match(voucher(partial,'hotel'),/Kontak: private@example.test/);
 const cancelled=voucher({...partial,status:'cancelled'});assert.match(cancelled,/Dibatalkan/);assert.doesNotMatch(cancelled,/Sisa tagihan/);assert.match(cancelled,/Pengembalian dana mengikuti proses Finance/);
});
