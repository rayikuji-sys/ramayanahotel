import test from 'node:test';
import assert from 'node:assert/strict';
import {addDays,calendarMonth,validateStay,retainRooms} from '../public/stay-search.js';
const today='2026-10-04',stay={checkIn:'2026-10-14',checkOut:'2026-10-16',adults:2,children:[]};
test('date editing rejects impossible, past, reversed and overlong stays',()=>{
 assert.equal(validateStay(stay,undefined,today),2);
 for(const patch of [{checkIn:'2026-02-30'},{checkIn:'2026-10-03'},{checkOut:'2026-10-14'},{checkOut:'2026-11-14'},{checkIn:'2027-10-05',checkOut:'2027-10-06'}])assert.throws(()=>validateStay({...stay,...patch},undefined,today));
 assert.equal(validateStay({...stay,checkOut:'2026-11-13'},undefined,today),30);
});
test('children require explicit ages including zero; occupancy is bounded',()=>{
 assert.equal(validateStay({...stay,children:[0,17]},undefined,today),2);
 for(const patch of [{children:[null]},{children:[18]},{children:[0,1,2]},{adults:0},{adults:5}])assert.throws(()=>validateStay({...stay,...patch},undefined,today));
});
test('calendar crosses leap years and December without timezone drift',()=>{
 assert.equal(addDays('2028-02-28',1),'2028-02-29');
 assert.equal(addDays('2026-12-31',1),'2027-01-01');
 const feb=calendarMonth(2028,1).filter(d=>d.inside);
 assert.equal(feb.length,29);assert.equal(feb.at(-1).date,'2028-02-29');
 assert.equal(calendarMonth(2026,12).find(d=>d.inside).date,'2027-01-01');
});
test('a changed search preserves valid rooms but removes capacity and stock conflicts',()=>{
 const rooms=[{roomId:'king',plan:'breakfast',adults:2,children:[]},{roomId:'king',plan:'room-only',adults:2,children:[]},{roomId:'triple',plan:'breakfast',adults:2,children:[]}];
 const available=[{id:'king',capacity:2,available:1},{id:'triple',capacity:3,available:2}];
 const result=retainRooms(rooms,available,stay);
 assert.deepEqual(result.kept.map(r=>r.roomId),['king','triple']);assert.equal(result.removed.length,1);
 const family=retainRooms(rooms,available,{...stay,children:[5]});
 assert.equal(family.kept.length,1);assert.deepEqual(family.kept[0].children,[5]);assert.equal(family.removed.length,2);
 assert.deepEqual(rooms[2].children,[],'does not mutate the previous search before a successful quote');
});
