const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;

export function readWebsiteHandoff(params){
 if(params.get('source')!=='hotel-website')return null;
 const room=params.get('room')||'';
 const plan=params.get('plan')||'room-only';
 const adults=Number(params.get('adults')||2);
 const checkIn=params.get('checkIn'),checkOut=params.get('checkOut');
 let error='';
 if(room&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(room))error='Pilihan kamar tidak valid. Silakan pilih kembali.';
 if(!['room-only','breakfast'].includes(plan))error='Paket kamar tidak valid. Silakan pilih kembali.';
 if(!Number.isInteger(adults)||adults<1||adults>4)error='Jumlah tamu harus 1–4 dewasa per kamar.';
 if((checkIn||checkOut)&&(!validDate(checkIn)||!validDate(checkOut)||checkOut<=checkIn))error='Tanggal menginap tidak valid. Silakan pilih kembali.';
 return {room,plan,adults:Number.isInteger(adults)&&adults>=1&&adults<=4?adults:2,checkIn,checkOut,lang:params.get('lang')==='id'?'id':'en',error};
}

export function handoffSelection(handoff,available,search){
 if(handoff.error)throw new Error(handoff.error);
 if(!handoff.room)return [];
 const room=available.find(r=>r.id===handoff.room);
 if(!room)throw new Error('Kamar pilihan dari website tidak ditemukan. Silakan pilih kamar lain.');
 if(room.available<1||room.capacity<search.adults+search.children.length)throw new Error('Kamar pilihan dari website tidak tersedia untuk tanggal atau jumlah tamu ini. Ubah pencarian atau pilih kamar lain.');
 return [{roomId:room.id,plan:handoff.plan,adults:search.adults,children:[...search.children]}];
}
