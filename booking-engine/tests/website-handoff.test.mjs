import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readWebsiteHandoff,handoffSelection} from '../public/website-handoff.js';

const params=new URLSearchParams({source:'hotel-website',room:'junior-suite',plan:'breakfast',adults:'2',lang:'id',checkIn:'2026-11-10',checkOut:'2026-11-12',price:'1'});
const search={adults:2,children:[]};
test('website room slugs map to all eight booking categories with the requested plan',()=>{
 const rooms=JSON.parse(readFileSync(new URL('../database/reference.json',import.meta.url))).rooms;
 for(const room of rooms)for(const plan of ['room-only','breakfast']){
  const query=new URLSearchParams(params);query.set('room',room.id);query.set('plan',plan);
  const handoff=readWebsiteHandoff(query);
  assert.deepEqual(handoffSelection(handoff,[{...room,available:1}],search),[{roomId:room.id,plan,adults:2,children:[]}]);
  assert.equal('price' in handoff,false);
 }
});
test('unavailable, unknown and over-capacity choices are never silently replaced',()=>{
 const handoff=readWebsiteHandoff(params);
 assert.throws(()=>handoffSelection(handoff,[],search),/tidak ditemukan/);
 assert.throws(()=>handoffSelection(handoff,[{id:handoff.room,available:0,capacity:4}],search),/tidak tersedia/);
 assert.throws(()=>handoffSelection(handoff,[{id:handoff.room,available:2,capacity:1}],search),/tidak tersedia/);
});
test('invalid dates, plans and occupants cannot bypass handoff validation',()=>{
 for(const patch of [{checkIn:'2026-02-30'},{checkOut:'2026-11-09'},{adults:'2000'},{adults:'1.5'},{plan:'free'},{room:'<script>'}]){
  const query=new URLSearchParams(params);for(const [key,value] of Object.entries(patch))query.set(key,value);
  assert.ok(readWebsiteHandoff(query).error);
 }
 assert.equal(readWebsiteHandoff(new URLSearchParams()),null);
 const generic=readWebsiteHandoff(new URLSearchParams({source:'hotel-website'}));
 assert.equal(generic.error,'');assert.deepEqual(handoffSelection(generic,[],search),[]);
});
