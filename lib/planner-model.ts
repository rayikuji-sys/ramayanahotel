import {z} from 'zod';
import type {PublicEventRecord} from './events-model.ts';

export const PLANNER_VERSION = 1 as const;
export const presetNames = ['Empty','Theatre','Classroom','Round tables','U-shape'] as const;
export type Preset = typeof presetNames[number];
export const objectSchema = z.object({instanceId:z.string().min(1).max(80),furnitureId:z.string().min(1).max(60),x:z.number().finite(),y:z.number().finite(),rotation:z.number().min(0).max(359),groupId:z.string().max(80).optional(),role:z.enum(['guest','speaker','moderator']).optional()}).strict();
export const savedLayoutSchema = z.object({version:z.literal(1),roomId:z.string().min(1).max(100),roomScaleVersion:z.string().max(80),presetOrigin:z.enum(presetNames),objects:z.array(objectSchema).max(500),guestCount:z.number().int().min(1).max(2000),createdAt:z.string().datetime()}).strict().superRefine((v,ctx)=>{if(new Set(v.objects.map(o=>o.instanceId)).size!==v.objects.length)ctx.addIssue({code:'custom',message:'ID objek layout harus unik.'});});
export type LayoutObject = z.infer<typeof objectSchema>;
export const roleLabels={guest:'Peserta',speaker:'Narasumber',moderator:'Moderator'} as const;
export const roleColors={guest:'#4c5153',speaker:'#9b702f',moderator:'#3d6b8a'} as const;
export type SavedLayout = z.infer<typeof savedLayoutSchema>;
const dimension=z.number().positive().max(1000);
export const furnitureSchema=z.object({id:z.string().regex(/^[a-z0-9-]+$/),type:z.enum(['round-table','rect-table','classroom-table','chair','podium','registration-table']),label:z.string().min(2).max(100),width:dimension,height:dimension,widthMeters:dimension.optional(),heightMeters:dimension.optional(),seatsDefault:z.number().int().min(0).max(16),quantityAvailable:z.number().int().min(0).max(2000).optional(),rotatable:z.boolean(),available:z.boolean(),needsVerification:z.boolean()}).strict();
export const roomConfigSchema=z.object({roomId:z.string().max(100),version:z.string().min(1).max(80),width:dimension,height:dimension,widthMeters:dimension.optional(),heightMeters:dimension.optional(),scaleVerified:z.boolean(),needsDimensionVerification:z.boolean(),inventoryProfileId:z.string().max(80),fixedObjects:z.array(z.object({id:z.string().max(80),label:z.string().max(100),x:z.number(),y:z.number(),width:dimension,height:dimension,protected:z.boolean(),verified:z.literal(true)}).strict()).max(30)}).strict().superRefine((r,ctx)=>{if(r.scaleVerified&&(!r.widthMeters||!r.heightMeters))ctx.addIssue({code:'custom',message:'Skala terverifikasi memerlukan ukuran meter.'});if(r.fixedObjects.some(o=>o.x<0||o.y<0||o.x+o.width>r.width||o.y+o.height>r.height))ctx.addIssue({code:'custom',message:'Zona tetap berada di luar area.'});});
export const plannerConfigSchema=z.object({furniture:z.array(furnitureSchema).min(1).max(20),rooms:z.array(roomConfigSchema).max(20)}).strict().superRefine((v,ctx)=>{if(new Set(v.furniture.map(f=>f.id)).size!==v.furniture.length||new Set(v.rooms.map(r=>r.roomId)).size!==v.rooms.length)ctx.addIssue({code:'custom',message:'ID konfigurasi harus unik.'});if(!v.furniture.some(f=>f.type==='chair'&&f.available))ctx.addIssue({code:'custom',message:'Sediakan kursi untuk susunan otomatis.'});});
export type Furniture = z.infer<typeof furnitureSchema>;
export type RoomConfig = z.infer<typeof roomConfigSchema>;
export type PlannerConfig = z.infer<typeof plannerConfigSchema>;
export type PlannerRoom = RoomConfig & {name:string;floorPlanAsset:string;capacityVerified:boolean;displayCapacity:PublicEventRecord['displayCapacity']};
export type PlannerData = {rooms:PlannerRoom[];furniture:Furniture[]};

// Symbol sizes are normalized illustration units, not measured hotel furniture.
export const defaultFurniture:Furniture[]=[
 {id:'round-table',type:'round-table',label:'Meja bundar',width:10,height:10,seatsDefault:8,rotatable:true,available:true,needsVerification:true},
 {id:'rect-table',type:'rect-table',label:'Meja persegi panjang',width:12,height:5,seatsDefault:4,rotatable:true,available:true,needsVerification:true},
 {id:'classroom-table',type:'classroom-table',label:'Meja classroom',width:10,height:4,seatsDefault:2,rotatable:true,available:true,needsVerification:true},
 {id:'chair',type:'chair',label:'Kursi',width:2.2,height:2.2,seatsDefault:0,rotatable:true,available:true,needsVerification:true},
 {id:'podium',type:'podium',label:'Podium',width:4,height:4,seatsDefault:0,rotatable:true,available:true,needsVerification:true},
];
export function defaultRoom(roomId:string):RoomConfig{return {roomId,version:'concept-v1',width:100,height:80,scaleVerified:false,needsDimensionVerification:true,inventoryProfileId:'hotel-meeting',fixedObjects:[]};}
export function plannerData(records:PublicEventRecord[],config:PlannerConfig):PlannerData{return {furniture:config.furniture.filter(f=>f.available),rooms:records.filter(r=>r.kind==='venue').map(r=>({...config.rooms.find(c=>c.roomId===r.id)||defaultRoom(r.id),name:r.title,floorPlanAsset:r.plan,capacityVerified:r.capacityVerified,displayCapacity:r.displayCapacity}))};}
export const uid=()=>globalThis.crypto.randomUUID();
export function makeObject(furnitureId:string,x:number,y:number):LayoutObject{return {instanceId:uid(),furnitureId,x,y,rotation:0};}
export function objectSize(o:LayoutObject,inventory:Furniture[]){const f=inventory.find(f=>f.id===o.furnitureId);return {width:f?.width||0,height:f?.height||0};}
export function extents(o:LayoutObject,inventory:Furniture[]){const {width:w,height:h}=objectSize(o,inventory),r=o.rotation*Math.PI/180;return {x:(Math.abs(w*Math.cos(r))+Math.abs(h*Math.sin(r)))/2,y:(Math.abs(w*Math.sin(r))+Math.abs(h*Math.cos(r)))/2};}
function corners(o:LayoutObject,inventory:Furniture[]){const {width:w,height:h}=objectSize(o,inventory),r=o.rotation*Math.PI/180;return (inventory.find(f=>f.id===o.furnitureId)?.type==='round-table'?Array.from({length:32},(_,i)=>[Math.cos(i*Math.PI/16)*w/2,Math.sin(i*Math.PI/16)*h/2]):[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]]).map(([x,y])=>({x:o.x+x*Math.cos(r)-y*Math.sin(r),y:o.y+x*Math.sin(r)+y*Math.cos(r)}));}
export function overlaps(a:LayoutObject,b:LayoutObject,inventory:Furniture[]){const ac=corners(a,inventory),bc=corners(b,inventory);return [ac,bc].every(poly=>poly.every((p,i)=>{const q=poly[(i+1)%poly.length],axis={x:q.y-p.y,y:p.x-q.x};const pa=ac.map(c=>c.x*axis.x+c.y*axis.y),pb=bc.map(c=>c.x*axis.x+c.y*axis.y);return Math.min(...pa)<Math.max(...pb)-0.01&&Math.min(...pb)<Math.max(...pa)-0.01;}));}
export function inside(o:LayoutObject,room:RoomConfig,inventory:Furniture[]){const e=extents(o,inventory);return o.x-e.x>=0&&o.y-e.y>=0&&o.x+e.x<=room.width&&o.y+e.y<=room.height;}
export function blocked(o:LayoutObject,room:RoomConfig,inventory:Furniture[]){return room.fixedObjects.some(z=>z.protected&&overlaps(o,{instanceId:z.id,furnitureId:'zone',x:z.x+z.width/2,y:z.y+z.height/2,rotation:0},[...inventory,{...defaultFurniture[0],id:'zone',type:'rect-table',width:z.width,height:z.height}]));}
export function warnings(objects:LayoutObject[],room:PlannerRoom,inventory:Furniture[],preset:Preset){const out:string[]=[];const chairs=objects.filter(o=>inventory.find(f=>f.id===o.furnitureId)?.type==='chair').length;const limit=preset!=='Empty'&&room.capacityVerified?room.displayCapacity[preset]:undefined;
 if(limit&&chairs>limit)out.push('Capacity Review Needed: jumlah kursi melewati kapasitas susunan terverifikasi.');
 if(!room.capacityVerified)out.push('Kapasitas final ruang akan dikonfirmasi Event Sales.');
 if(objects.some(o=>!inside(o,room,inventory)||blocked(o,room,inventory)))out.push('Ada objek di luar area atau pada zona terlindungi.');
 if(objects.some((a,i)=>objects.slice(i+1).some(b=>overlaps(a,b,inventory))))out.push('Ada objek bertumpuk. Geser atau susun ulang sebelum finalisasi.');
 inventory.forEach(f=>{if(f.quantityAvailable!==undefined&&objects.filter(o=>o.furnitureId===f.id).length>f.quantityAvailable)out.push('Jumlah '+f.label+' melebihi inventaris terkonfirmasi.');});return out;
}
export function selection(objects:LayoutObject[],id:string){const item=objects.find(o=>o.instanceId===id);return item?objects.filter(o=>o.instanceId===id||(item.groupId&&o.groupId===item.groupId)):[];}
export function moveSelection(objects:LayoutObject[],id:string,dx:number,dy:number,room:RoomConfig,inventory:Furniture[]){const selected=selection(objects,id);if(!selected.length)return objects;const ids=new Set(selected.map(o=>o.instanceId));const edges=selected.map(o=>{const e=extents(o,inventory);return {left:o.x-e.x,right:o.x+e.x,top:o.y-e.y,bottom:o.y+e.y};});dx=Math.max(-Math.min(...edges.map(e=>e.left)),Math.min(dx,room.width-Math.max(...edges.map(e=>e.right))));dy=Math.max(-Math.min(...edges.map(e=>e.top)),Math.min(dy,room.height-Math.max(...edges.map(e=>e.bottom))));const next=objects.map(o=>ids.has(o.instanceId)?{...o,x:o.x+dx,y:o.y+dy}:o);return next.some(o=>ids.has(o.instanceId)&&blocked(o,room,inventory))?objects:next;}
export function rotateSelection(objects:LayoutObject[],id:string,degrees:number,room:RoomConfig,inventory:Furniture[]){const members=selection(objects,id),anchor=objects.find(o=>o.instanceId===id);if(!anchor||members.some(o=>!inventory.find(f=>f.id===o.furnitureId)?.rotatable))return objects;const ids=new Set(members.map(o=>o.instanceId)),r=degrees*Math.PI/180;const next=objects.map(o=>{if(!ids.has(o.instanceId))return o;const dx=o.x-anchor.x,dy=o.y-anchor.y;return {...o,x:anchor.x+dx*Math.cos(r)-dy*Math.sin(r),y:anchor.y+dx*Math.sin(r)+dy*Math.cos(r),rotation:(o.rotation+degrees+360)%360};});return next.some(o=>!inside(o,room,inventory)||blocked(o,room,inventory))?objects:next;}
export function duplicateSelection(objects:LayoutObject[],id:string,room:RoomConfig,inventory:Furniture[]){const group=uid(),copies=selection(objects,id).map(o=>({...o,instanceId:uid(),...(o.groupId?{groupId:group}:{}),x:o.x+4,y:o.y+4}));return copies.some(o=>!inside(o,room,inventory)||blocked(o,room,inventory))?objects:[...objects,...copies].slice(0,500);}
export function smartChairs(objects:LayoutObject[],id:string,count:number,inventory:Furniture[],room:RoomConfig){
 const table=objects.find(o=>o.instanceId===id),chair=inventory.find(f=>f.type==='chair'),f=inventory.find(f=>f.id===table?.furnitureId);
 if(!table||!chair||!f||!f.type.includes('table'))return objects;
 const group=table.groupId||uid(),members=selection(objects,id);
 // Joined tables keep their original seats; split first to reseat a single table.
 if(members.filter(o=>inventory.find(f=>f.id===o.furnitureId)?.type.includes('table')).length>1)return objects;
 const base=objects.filter(o=>!(o.groupId===group&&o.furnitureId===chair.id)).map(o=>o.instanceId===id?{...o,groupId:group}:o);
 const n=Math.max(1,Math.min(16,Math.floor(count))),panel=table.role==='speaker'||table.role==='moderator';
 const radius=Math.max(f.width,f.height)/2+Math.max(chair.width,chair.height)+.8,angle=table.rotation*Math.PI/180;
 const chairs=Array.from({length:n},(_,i)=>{
  let x:number,y:number,rotation:number;
  if(f.type==='round-table'){const a=2*Math.PI*i/n;x=Math.cos(a)*radius;y=Math.sin(a)*radius;rotation=a*180/Math.PI+90;}
  else{const top=panel||i<Math.ceil(n/2),rowCount=panel?n:top?Math.ceil(n/2):Math.floor(n/2),index=panel?i:top?i:i-Math.ceil(n/2);x=(index-(rowCount-1)/2)*(chair.width+1);y=(top?-1:1)*(f.height/2+chair.height);rotation=top?180:0;}
  return {...makeObject(chair.id,table.x+x*Math.cos(angle)-y*Math.sin(angle),table.y+x*Math.sin(angle)+y*Math.cos(angle)),rotation:(rotation+table.rotation+360)%360,groupId:group,...table.role?{role:table.role}:{}};
 });
 if(base.length+chairs.length>500||chairs.some((o,i)=>!inside(o,room,inventory)||blocked(o,room,inventory)||base.some(p=>overlaps(o,p,inventory))||chairs.slice(i+1).some(p=>overlaps(o,p,inventory))))return objects;
 return [...base,...chairs];
}
export function autoArrange(preset:Preset,guests:number,room:RoomConfig,inventory:Furniture[]):LayoutObject[]{
 if(preset==='Empty')return [];const chair=inventory.find(f=>f.type==='chair');if(!chair)return [];
 const wanted=Math.min(guests,350),out:LayoutObject[]=[];
 const place=(o:LayoutObject)=>{if(inside(o,room,inventory)&&!blocked(o,room,inventory)&&!out.some(a=>overlaps(a,o,inventory))){out.push(o);return true;}return false;};
 if(preset==='Theatre'){const dx=chair.width+1.4,dy=chair.height+1.8;for(let y=8;y<room.height-4&&out.length<wanted;y+=dy)for(let x=4;x<room.width-4&&out.length<wanted;x+=dx){if(Math.abs(x-room.width/2)<3)continue;place(makeObject(chair.id,x,y));}return out;}
 const table=inventory.find(f=>f.type===(preset==='Round tables'?'round-table':preset==='Classroom'?'classroom-table':'rect-table'));if(!table)return [];
 if(preset==='Round tables'){const radius=Math.max(table.width,table.height)/2+Math.max(chair.width,chair.height)+0.8,step=2*radius+chair.width+3;let remaining=wanted;
 for(let y=radius+4;y<room.height-radius-2&&remaining>0;y+=step)for(let x=radius+4;x<room.width-radius-2&&remaining>0;x+=step){const t=makeObject(table.id,x,y),group=smartChairs([t],t.instanceId,Math.min(table.seatsDefault||8,remaining),inventory,room);if(group.length>1&&group.every(o=>!out.some(a=>overlaps(a,o,inventory)))){out.push(...group);remaining-=group.length-1;}}return out;}
 if(preset==='Classroom'){let remaining=wanted;for(let y=10;y<room.height-6&&remaining>0;y+=table.height+chair.height+5)for(let x=table.width/2+4;x<room.width-table.width/2-3&&remaining>0;x+=table.width+5){const t=makeObject(table.id,x,y),g=uid(),seats=Math.min(table.seatsDefault||2,remaining),group=[{...t,groupId:g},...Array.from({length:seats},(_,i)=>({...makeObject(chair.id,x+(i-(seats-1)/2)*(chair.width+1),y+table.height/2+chair.height),groupId:g}))];if(group.every(o=>inside(o,room,inventory)&&!blocked(o,room,inventory)&&!out.some(a=>overlaps(a,o,inventory)))){out.push(...group);remaining-=seats;}}return out;}
 // A conceptual U with chairs along the outer edges; never claims floorplan fidelity.
 const groups:LayoutObject[][]=[];for(let y=16;y<room.height-18;y+=table.width+1){for(const x of [12,room.width-12]){const g=uid(),t={...makeObject(table.id,x,y),rotation:90,groupId:g};groups.push([t,...Array.from({length:2},(_,i)=>({...makeObject(chair.id,x+(x<room.width/2?-1:1)*(table.height/2+chair.width),y+(i-.5)*(chair.width+1)),rotation:x<room.width/2?90:270,groupId:g}))]);}}for(let x=23;x<room.width-20;x+=table.width+1){const g=uid(),t={...makeObject(table.id,x,room.height-12),groupId:g};groups.push([t,...Array.from({length:2},(_,i)=>({...makeObject(chair.id,x+(i-.5)*(chair.width+1),room.height-12+table.height/2+chair.height),groupId:g}))]);}let placed=0;for(const group of groups){if(placed>=wanted)break;const chairs=group.slice(1,1+wanted-placed),all=[group[0],...chairs];if(all.every(o=>inside(o,room,inventory)&&!blocked(o,room,inventory)&&!out.some(a=>overlaps(a,o,inventory)))){out.push(...all);placed+=chairs.length;}}return out;
}
export function validateLayout(layout:SavedLayout,data:PlannerData){const room=data.rooms.find(r=>r.roomId===layout.roomId);if(!room)return 'Venue layout tidak tersedia.';if(layout.roomScaleVersion!==room.version)return 'Konfigurasi ruang berubah. Buka dan simpan kembali layout.';if(layout.objects.some(o=>!data.furniture.some(f=>f.id===o.furnitureId)||!inside(o,room,data.furniture)||blocked(o,room,data.furniture)))return 'Periksa furniture, batas area, dan zona tetap pada layout.';return null;}
