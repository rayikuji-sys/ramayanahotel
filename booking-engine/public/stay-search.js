// Date-only values are deliberately calculated in UTC, independently of browser timezone.
export const addDays=(value,days)=>new Date(Date.parse(value)+days*86400000).toISOString().slice(0,10);
export const hotelToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function validateStay(stay,t=(id)=>id,today=hotelToday()){
  const valid=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
  if(!valid(stay.checkIn)||!valid(stay.checkOut))throw Error(t('Lengkapi tanggal check-in dan check-out.','Enter valid check-in and check-out dates.'));
  const nights=(Date.parse(stay.checkOut)-Date.parse(stay.checkIn))/86400000;
  if(stay.checkIn<today||stay.checkIn>addDays(today,365)||nights<1||nights>30)throw Error(t('Pilih 1–30 malam, dengan kedatangan dalam 365 hari ke depan.','Choose 1–30 nights, arriving within the next 365 days.'));
  if(!Number.isInteger(stay.adults)||stay.adults<1||stay.adults>4||!Array.isArray(stay.children)||stay.children.length>2||stay.children.some(x=>!Number.isInteger(x)||x<0||x>17))throw Error(t('Pilih 1–4 dewasa dan maksimal 2 anak; lengkapi usia anak.','Choose 1–4 adults and up to 2 children; enter every child’s age.'));
  return nights;
}
export function calendarMonth(year,month){
  const first=new Date(Date.UTC(year,month,1));
  const offset=(first.getUTCDay()+6)%7;
  return Array.from({length:42},(_,i)=>{
    const d=new Date(Date.UTC(year,month,1+i-offset));
    return {date:d.toISOString().slice(0,10),day:d.getUTCDate(),inside:d.getUTCMonth()===first.getUTCMonth()};
  });
}
export function retainRooms(rooms,available,stay){
  const used=new Map(),kept=[],removed=[];
  for(const item of rooms){
    const room=available.find(r=>r.id===item.roomId),count=(used.get(item.roomId)||0)+1;
    if(!room||room.capacity<stay.adults+stay.children.length||room.available<count){removed.push(item);continue;}
    used.set(item.roomId,count);kept.push({...item,adults:stay.adults,children:[...stay.children]});
  }
  return {kept,removed};
}
