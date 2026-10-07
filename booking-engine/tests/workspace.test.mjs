import test from 'node:test';
import assert from 'node:assert/strict';
import {discoverRooms,readFavorites} from '../public/room-discovery.js';
import {operationsSummary,filterReservations,reservationCsv} from '../public/staff-model.js';
const rooms=[{id:'king',name:'King',capacity:2,available:2,total:800000,nightly:[{},{}],area:20},{id:'suite',name:'Suite',capacity:4,available:1,total:1500000,nightly:[{},{}],area:50},{id:'twin',name:'Twin',capacity:2,available:0,total:400000,nightly:[{},{}],area:24}];
test('discovery uses per-night budget and excludes inadequate capacity without changing stock',()=>{
 assert.deepEqual(discoverRooms(rooms,{adults:2,children:[]},{maxNight:400000,availableOnly:true}).map(r=>r.id),['king']);
 assert.deepEqual(discoverRooms(rooms,{adults:2,children:[7]},{availableOnly:true}).map(r=>r.id),['suite']);
 assert.equal(rooms[0].available,2);
});
test('saved rooms survive valid persisted data and sorting respects availability',()=>{
 assert.deepEqual(readFavorites('["suite","missing","suite",2]',rooms),['suite']);
 assert.deepEqual(readFavorites('{broken',rooms),[]);
 assert.deepEqual(discoverRooms(rooms,{adults:2,children:[]},{savedOnly:true,favorites:['suite']}).map(r=>r.id),['suite']);
 assert.deepEqual(discoverRooms(rooms,{adults:2,children:[]},{sort:'price-desc'}).map(r=>r.id),['suite','king','twin']);
});
const reservation=(patch={})=>({code:'RMY-001',status:'confirmed',total:800000,created:'2026-10-04T17:00:00Z',guest:{name:'Tamu QA',email:'qa@example.test',company:'Perusahaan QA'},snapshot:{checkIn:'2026-10-05',checkOut:'2026-10-07',rooms:[{name:'King'}]},...patch});
test('operations use WITA boundaries and checkout is not an occupied night',()=>{
 const rows=[reservation(),reservation({status:'cancelled'}),reservation({status:'awaiting_payment',created:'2026-10-04T12:00:00Z'})];
 const stats=operationsSummary(rows,[{created:'2026-10-04T17:00:00Z',kind:'payment',amount:800000},{created:'2026-10-05T01:00:00Z',kind:'refund',amount:200000},{created:'2026-10-04T12:00:00Z',kind:'payment',amount:900000}],'2026-10-05');
 assert.equal(stats.newBookings,2);assert.equal(stats.arrivals,1);assert.equal(stats.waiting,1);assert.equal(stats.netPayments,600000);assert.equal(stats.days.length,7);assert.equal(stats.days[0].inHouse,2);assert.equal(stats.days[2].inHouse,0);
});
test('reservation filters combine status, company and check-in and export escapes formulas',()=>{
 const rows=[reservation(),reservation({code:'RMY-002',status:'cancelled'})];
 assert.equal(filterReservations(rows,{query:' perusahaan ',status:'confirmed',arrival:'2026-10-05'}).length,1);
 assert.equal(filterReservations(rows,{arrival:'2026-10-06'}).length,0);
 const csv=reservationCsv([reservation({guest:{name:'=HYPERLINK("bad")'}})]);
 assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));assert.ok(csv.includes('"800000"'));
});
