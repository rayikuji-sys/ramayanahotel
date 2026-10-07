import type {ContentItem} from './types.ts';

// Facts supplied by the hotel. This newer profile takes precedence over the older brochure.
export const profileSource = 'Ramayana_Hotel_Makassar (1).txt supplied by hotel; room inventory, dimensions, published promotional rates and guest policies. Brochure: in-room amenities. Imported 2026-09-18. Rates subject to hotel confirmation.';
function record(kind: ContentItem['kind'], slug: string, title: string, description: string, details: Record<string,string>, sortOrder: number, image = '', category = ''): ContentItem {
  return {id:`${kind}-${slug}`,kind,slug,title,description,details,sortOrder,image,category,published:true,verified:true,active:true,sourceNote:profileSource,verifiedBy:'Hotel supplied profile',verifiedAt:'2026-09-18',updatedAt:'2026-09-18'};
}
const rooms = [
  ['superior-king','Superior King','Superior','20','4','299000','King bed','/media/1645343294956.jpeg','Warm wood, soft lighting, and a comfortable king bed. A welcoming 20 m² retreat after a day in Makassar.'],
  ['superior-twin','Superior Twin','Superior','20','29','299000','Twin beds','/media/1645343295138.jpeg','Two separate beds and everyday comforts in a thoughtfully arranged 20 m² space. Settle in, recharge, and start the next day together.'],
  ['deluxe-king','Deluxe King','Deluxe','22','10','349000','King bed','/media/1645343294956.jpeg','A little more space to make your own. Enjoy 22 m² of familiar comforts, a king bed, and a warm setting for an unhurried stay.'],
  ['deluxe-twin','Deluxe Twin','Deluxe','22','26','349000','Twin beds','/media/1645343295138.jpeg','A 22 m² room with separate beds for shared journeys. An easy place to unwind between business plans and time out in the city.'],
  ['superior-triple','Superior Triple','Triple','32','2','499000','Triple room · confirm bed arrangement','/media/1645343295138.jpeg','Make room for a shared stay. This 32 m² triple category brings extra space for your travelling companions.'],
  ['deluxe-triple','Deluxe Triple','Triple','32','4','549000','Triple room · confirm bed arrangement','/media/1645343295138.jpeg','A generous 32 m² setting for time together. Share your preferred bed arrangement with our team when planning your stay.'],
  ['junior-suite','Junior Suite','Suites','36','1','700000','Confirm bed arrangement with Reservations','/media/room-0.jpg','Take a little more time for yourself. Our 36 m² Junior Suite offers room to settle in and make your visit feel personal.'],
  ['ramayana-suite','Ramayana Suite','Suites','40','1','900000','Confirm bed arrangement with Reservations','/media/room-1.jpg','Our most spacious room category, with 40 m² for a slower, more comfortable stay. A special space for your Makassar chapter.'],
];
export const profileRooms = rooms.map(([slug,title,category,area,inventory,rate,bed,image,description],index) => record('room',slug,title,description,{
  area,inventory,rate,bed,breakfast:'Not included in the room-only promotional rate',
  ...(slug==='junior-suite'?{breakfastRate:'800000'}:slug==='ramayana-suite'?{breakfastRate:'1000000'}:{}),
  photoNote:'Representative Ramayana room interior. Layout and furnishings vary by room; confirm your preferred configuration with Reservations.',
  amenities:'Air conditioning|Free Wi-Fi|LED / cable TV|Work desk|Bathroom amenities|Complimentary mineral water|Coffee / tea making facilities|Internal telephone',
  onRequest:'Hair dryer|Iron',
  selective:'Mini bar / refrigerator|Sofa|Dining area',
},index,image,category));

export const profilePolicies = [
  record('policy','check-in-and-check-out','Arrive & depart','Check-in from 14:00. Check-out before 12:00. Our reception is available 24 hours. Early arrival and late departure can be arranged with the hotel and may incur an additional charge.',{checkIn:'14:00',checkOut:'12:00'},0),
  record('policy','breakfast','Breakfast, your way','Breakfast is served from 07:00 to 10:00. Additional breakfast is offered at Rp 55,000 per guest; confirm your selected package with Reservations. Superior and Deluxe room-only promotional rates exclude breakfast; suite breakfast packages are also available.',{hours:'07:00–10:00',additionalRate:'55000'},1),
  record('policy','hotel-at-a-glance','77 rooms. A warm welcome.','Choose from eight room categories across four floors, with lift access, free Wi-Fi, a restaurant, a gym, and parking.',{rooms:'77',floors:'4',categories:'8'},2),
  record('policy','guest-services','Little things, taken care of','24-hour reception and room service, luggage storage, laundry, and multilingual assistance. Airport transfers, car rental, and bicycle rental can be requested; charges and availability are confirmed by the hotel.',{},3),
  record('policy','room-comforts','Everyday comforts','Air conditioning, Wi-Fi, television, a work desk, bathroom amenities, mineral water, and coffee / tea making facilities. Hair dryers and irons are available on request. Mini bars, sofas, and dining areas are available in selected rooms.',{},4),
  record('policy','smoking-and-pets','A comfortable shared space','Pets are not permitted. Please request a non-smoking room and ask reception about any designated smoking areas.',{},5),
  record('policy','stay-offers','A little extra with your stay','Our room promotion includes complimentary Wi-Fi, gym access, a welcome drink, and a laundry or snack benefit. Ask Reservations which benefits apply to your selected offer.',{},6),
];
export const profileFaqs = [
  record('faq','when-can-i-check-in','When can I check in and check out?','Check-in starts at 14:00 and check-out is before 12:00. For early check-in or late check-out, contact our 24-hour reception; additional charges may apply.',{},3),
  record('faq','is-breakfast-included','Is breakfast included?','Room-only promotional rates exclude breakfast. Additional breakfast is offered at Rp 55,000 per guest, served from 07:00 to 10:00. Junior Suite and Ramayana Suite also have packages with breakfast for two.',{},4),
];

export function rupiah(value?:string) {
  const amount=Number(value);
  return value&&Number.isFinite(amount)&&amount>0?`Rp ${new Intl.NumberFormat('id-ID').format(amount)}`:'';
}
export function roomFacts(room:ContentItem):Array<[string,string]> {
  return [['Room size',room.details.area?`${room.details.area} m²`:'Contact Reservations'],['Bed configuration',room.details.bed||'Contact Reservations'],['Room collection',room.category]].filter((fact):fact is [string,string]=>!!fact[1]);
}
