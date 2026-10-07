const day=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
const active=r=>['confirmed','awaiting_payment','payment_review'].includes(r.status);
export function operationsSummary(reservations,ledger,date){
 const dates=Array.from({length:7},(_,i)=>new Date(Date.parse(date)+i*86400000).toISOString().slice(0,10));
 return {newBookings:reservations.filter(r=>day(r.created)===date).length,arrivals:reservations.filter(r=>r.status==='confirmed'&&r.snapshot.checkIn===date).length,waiting:reservations.filter(r=>r.status==='awaiting_payment').length,netPayments:ledger.filter(l=>day(l.created)===date).reduce((n,l)=>n+(l.kind==='payment'?l.amount:l.kind==='refund'?-l.amount:0),0),days:dates.map(date=>({date,arrivals:reservations.filter(r=>r.status==='confirmed'&&r.snapshot.checkIn===date).length,inHouse:reservations.filter(r=>active(r)&&r.snapshot.checkIn<=date&&r.snapshot.checkOut>date).reduce((n,r)=>n+r.snapshot.rooms.length,0)}))};
}
export function filterReservations(rows,{query='',status='',arrival=''}={}){
 const term=query.trim().toLocaleLowerCase();return rows.filter(r=>(!status||r.status===status)&&(!arrival||r.snapshot.checkIn===arrival)&&(!term||[r.code,r.guest.name,r.guest.email,r.guest.company||''].some(v=>String(v).toLocaleLowerCase().includes(term))));
}
export function reservationCsv(rows){
 const cell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
 return '\uFEFF'+[['Kode','Tamu','Check-in','Check-out','Kamar','Status','Total IDR'],...rows.map(r=>[r.code,r.guest.name,r.snapshot.checkIn,r.snapshot.checkOut,r.snapshot.rooms.map(x=>x.name).join(' / '),r.status,r.total])].map(row=>row.map(cell).join(',')).join('\r\n');
}
