import {AirVent, Armchair, Bath, BedDouble, Building2, Clock3, Coffee, Crown, DoorOpen, Dumbbell, Gift, Headphones, HeartHandshake, Info, KeyRound, Laptop, LogIn, LogOut, Luggage, MapPin, Maximize, Phone, Refrigerator, Shirt, Sparkles, Tv, Utensils, Waves, Wifi, Wind, type LucideIcon} from 'lucide-react';

const icons:Record<string,LucideIcon> = {
  area:Maximize, bed:BedDouble, collection:Crown, wifi:Wifi, gym:Dumbbell,
  breakfast:Coffee, arrival:LogIn, departure:LogOut, reception:Clock3,
  room:KeyRound, photo:Info, service:Headphones, offer:Gift,
};
const rules:Array<[RegExp,LucideIcon]> = [
  [/air conditioning/i,AirVent], [/wi.fi/i,Wifi], [/tv|television/i,Tv],
  [/desk/i,Laptop], [/bathroom/i,Bath], [/mineral water/i,Waves],
  [/coffee|tea|breakfast/i,Coffee], [/telephone|phone/i,Phone],
  [/hair dryer/i,Wind], [/iron|laundry/i,Shirt], [/mini bar|refrigerator/i,Refrigerator],
  [/sofa|living/i,Armchair], [/dining|resto/i,Utensils], [/room size/i,Maximize],
  [/bed/i,BedDouble], [/collection|suite/i,Crown], [/check-in|arrive/i,LogIn],
  [/depart|check-out/i,LogOut], [/guest-services|assistance/i,Headphones],
  [/stay-offers/i,Gift], [/smoking-and-pets/i,HeartHandshake],
  [/hotel-at-a-glance/i,Building2], [/room-comforts|settle/i,KeyRound],
  [/explore/i,MapPin], [/welcome/i,DoorOpen], [/luggage/i,Luggage],
];

export function DetailIcon({name, size=21, className}:{name:string;size?:number;className?:string}) {
  const Icon = icons[name] || rules.find(([pattern])=>pattern.test(name))?.[1] || Sparkles;
  return <span className={`detail-icon ${className||''}`} aria-hidden="true"><Icon size={size} strokeWidth={1.35}/></span>;
}
