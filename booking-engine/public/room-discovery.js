export function discoverRooms(available,search,filters={}){
 const {type='all',sort='price',savedOnly=false,favorites=[],maxNight=0,availableOnly=false,query=''}=filters;
 const term=query.trim().toLocaleLowerCase();
 return available.map(room=>({...room,available:room.capacity>=search.adults+search.children.length?room.available:0}))
 .filter(room=>(type==='all'||room.id.includes(type))&&(!savedOnly||favorites.includes(room.id))&&(!availableOnly||room.available>0)&&(!term||room.name.toLocaleLowerCase().includes(term))&&(!maxNight||(room.nightly.length&&room.total/room.nightly.length<=maxNight)))
 .sort((a,b)=>(b.available>0)-(a.available>0)||(sort==='space'?b.area-a.area:sort==='price-desc'?b.total-a.total:a.total-b.total));
}
export function readFavorites(raw,catalog){
 try{const parsed=JSON.parse(raw||'[]');return Array.isArray(parsed)?[...new Set(parsed.filter(id=>typeof id==='string'&&catalog.some(r=>r.id===id)))].slice(0,30):[];}catch{return [];}
}
