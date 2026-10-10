import test from 'node:test';
import assert from 'node:assert/strict';
import {guestDirectory,reportData,ledgerCsv,hotelDay} from '../public/reference-workspace.js';
test('guest and company directories aggregate only matching contacts',()=>{
 const rows=[{id:'1',guest:{name:'A',email:'A@example.test',company:'Hotel A'}},{id:'2',guest:{name:'A',email:'a@example.test',company:'hotel a'}},{id:'3',guest:{name:'B',email:'b@example.test',company:''}}];
 assert.deepEqual(guestDirectory(rows).map(x=>x.rows.length),[2,1]);assert.equal(guestDirectory(rows,true).length,1);assert.equal(guestDirectory(rows,true)[0].rows.length,2);
});
test('reports filter inclusive hotel dates and subtract refunds',()=>{
 const ledger=[{kind:'payment',created:Date.parse('2026-10-08T17:00:00Z'),amount:650000},{kind:'refund',created:Date.parse('2026-10-09T15:00:00Z'),amount:50000},{kind:'payment',created:Date.parse('2026-10-09T17:00:00Z'),amount:100000}];
 assert.equal(hotelDay(ledger[0].created),'2026-10-09');const r=reportData(ledger,{from:'2026-10-09',to:'2026-10-09'});assert.equal(r.net,600000);assert.equal(r.rows.length,2);assert.deepEqual(r.days,[['2026-10-09',600000]]);assert.equal(reportData(ledger,{kind:'refund'}).net,-50000);
});
test('CSV escapes formula-leading booking references',()=>{
 const csv=ledgerCsv([{created:Date.parse('2026-10-09'),kind:'payment',amount:100,reservation_id:'1'}],[{id:'1',code:'=1+1'}]);assert.ok(csv.includes('"\'=1+1"'));
});
