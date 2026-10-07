export type BookingChoice={room?:string;plan?:'room-only'|'breakfast';checkIn?:string;checkOut?:string;adults?:number;lang?:string};

/** Pass choices only; prices and availability are always checked by the engine. */
export function bookingHref(choice:BookingChoice={}){
 const params=new URLSearchParams({source:'hotel-website',lang:choice.lang==='id'?'id':'en'});
 if(choice.room)params.set('room',choice.room);
 if(choice.plan)params.set('plan',choice.plan);
 for(const key of ['checkIn','checkOut'] as const)if(choice[key])params.set(key,choice[key]);
 if(choice.adults!==undefined)params.set('adults',String(choice.adults));
 return '/book?'+params;
}

export function bookingDestination(params:URLSearchParams,base:string){
 const url=new URL(base);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Invalid booking engine URL');
 url.hash='';
 for(const key of ['room','plan','checkIn','checkOut','adults','lang']){
  url.searchParams.delete(key);
  const value=params.get(key);
  if(value&&value.length<=100)url.searchParams.set(key,value);
 }
 url.searchParams.set('source','hotel-website');
 return url;
}
