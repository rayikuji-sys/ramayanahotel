import {blocked,inside,makeObject,moveSelection,objectSize,overlaps,selection,uid,type Furniture,type LayoutObject,type RoomConfig} from './planner-model.ts';

export function panelMeeting(guests:number,room:RoomConfig,inventory:Furniture[]){
 const panel=addPanelSet(addPanelSet([],'speaker',room,inventory,{x:room.width/2-9,y:10}),'moderator',room,inventory,{x:room.width/2+9,y:10});
 const chair=inventory.find(f=>f.type==='chair');if(!chair)return panel;
 const dx=chair.width+1.5,dy=chair.height+2,aisle=5;
 const maxColumns=Math.max(2,2*Math.floor((room.width-10-aisle)/dx/2)),columns=Math.min(maxColumns,guests<=40?10:guests<=100?14:18),rows=Math.ceil(Math.min(guests,350)/columns);
 let remaining=Math.min(guests,350);
 for(let row=0;row<rows&&remaining>0;row++){
  const count=Math.min(columns,remaining),left=Math.ceil(count/2);
  for(let i=0;i<count;i++){const x=i<left?room.width/2-aisle/2-(left-i-.5)*dx:room.width/2+aisle/2+(i-left+.5)*dx,o=makeObject(chair.id,x,24+row*dy);if(inside(o,room,inventory)&&!blocked(o,room,inventory)&&!panel.some(p=>overlaps(o,p,inventory)))panel.push(o);}
  remaining-=count;
 }
 return panel;
}

export function placeInFreeSpace(existing:LayoutObject[],group:LayoutObject[],room:RoomConfig,inventory:Furniture[]){
 if(!group.length||existing.length+group.length>500)return null;
 const anchor=group[0];
 const candidates=[{x:anchor.x,y:anchor.y}];
 for(let y=6;y<room.height;y+=3)for(let x=6;x<room.width;x+=3)candidates.push({x,y});
 candidates.sort((a,b)=>Math.hypot(a.x-anchor.x,a.y-anchor.y)-Math.hypot(b.x-anchor.x,b.y-anchor.y));
 for(const p of candidates){const next=group.map(o=>({...o,x:o.x+p.x-anchor.x,y:o.y+p.y-anchor.y}));if(next.every(o=>inside(o,room,inventory)&&!blocked(o,room,inventory)&&!existing.some(other=>overlaps(o,other,inventory))))return next;}
 return null;
}

export function addPanelSet(objects:LayoutObject[],role:'speaker'|'moderator',room:RoomConfig,inventory:Furniture[],position?:{x:number;y:number}){
 const table=inventory.find(f=>f.type==='rect-table'),chair=inventory.find(f=>f.type==='chair');if(!table||!chair)return objects;
 const groupId=uid(),count=role==='speaker'?2:1,x=position?.x??room.width/2,y=position?.y??10;
 const items:LayoutObject[]=[{...makeObject(table.id,x,y),role,groupId},...Array.from({length:count},(_,i)=>({...makeObject(chair.id,x+(i-(count-1)/2)*(chair.width+1.5),y-table.height/2-chair.height),role,groupId,rotation:180}))];
 const free=placeInFreeSpace(objects,items,room,inventory);return free?[...objects,...free]:objects;
}

/** Join flush edges in the table's own axes; preserve chairs and existing groups. */
export function joinTables(objects:LayoutObject[],id:string,room:RoomConfig,inventory:Furniture[],threshold=3){
 const anchor=objects.find(o=>o.instanceId===id),definition=inventory.find(f=>f.id===anchor?.furnitureId);
 if(!anchor||!definition||!['rect-table','classroom-table','registration-table'].includes(definition.type))return objects;
 const members=selection(objects,id),moving=new Set(members.map(o=>o.instanceId));
 const candidates:{distance:number;dx:number;dy:number;target:LayoutObject}[]=[];
 for(const source of members){const sf=inventory.find(f=>f.id===source.furnitureId);if(!sf||!['rect-table','classroom-table','registration-table'].includes(sf.type))continue;
  for(const target of objects){const tf=inventory.find(f=>f.id===target.furnitureId);if(moving.has(target.instanceId)||!tf||!['rect-table','classroom-table','registration-table'].includes(tf.type)||Math.abs((source.rotation-target.rotation+360)%180)>.01)continue;
   const a=source.rotation*Math.PI/180,ss=objectSize(source,inventory),ts=objectSize(target,inventory);
   for(const [lx,ly] of [[(ss.width+ts.width)/2,0],[-(ss.width+ts.width)/2,0],[0,(ss.height+ts.height)/2],[0,-(ss.height+ts.height)/2]]){const dx=target.x+lx*Math.cos(a)-ly*Math.sin(a)-source.x,dy=target.y+lx*Math.sin(a)+ly*Math.cos(a)-source.y,distance=Math.hypot(dx,dy);if(distance<=threshold)candidates.push({distance,dx,dy,target});}
  }
 }
 for(const candidate of candidates.sort((a,b)=>a.distance-b.distance)){
  const moved=moveSelection(objects,id,candidate.dx,candidate.dy,room,inventory),updated=moved.find(o=>o.instanceId===id)!;
  if(Math.abs(updated.x-anchor.x-candidate.dx)>.001||Math.abs(updated.y-anchor.y-candidate.dy)>.001)continue;
  if(moved.some(o=>moving.has(o.instanceId)&&moved.some(other=>!moving.has(other.instanceId)&&overlaps(o,other,inventory))))continue;
  const targets=new Set(selection(objects,candidate.target.instanceId).map(o=>o.instanceId)),groupId=candidate.target.groupId||anchor.groupId||uid();
  return moved.map(o=>moving.has(o.instanceId)||targets.has(o.instanceId)?{...o,groupId}:o);
 }
 return objects;
}

export function setSelectionRole(objects:LayoutObject[],id:string,role:NonNullable<LayoutObject['role']>){const ids=new Set(selection(objects,id).map(o=>o.instanceId));return objects.map(o=>ids.has(o.instanceId)?{...o,role}:o);}
