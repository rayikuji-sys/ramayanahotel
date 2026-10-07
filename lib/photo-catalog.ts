import {curatedRoomPhotos} from './curated-room-photos.ts';
import {meetingPhotos} from './meeting-photos.ts';
import {supplementalPhotos} from './supplemental-photos.ts';
export type HotelPhoto={id:string;src:string;title:string;category:'Rooms'|'Spaces'|'Facilities'|'Dining'|'Meetings & Events';caption:string;venue?:string;layout?:string;room?:string;source:string;sourceHash?:string};
// Reviewed against all 104 image entries in the three hotel-supplied ZIPs on 2026-09-26.
export const hotelPhotos:HotelPhoto[]=[
 ['dining-corner','Dining beside the music corner','Dining','Wicker dining chairs, warm pendant lights, and a small keyboard stage frame this corner of the restaurant.','Ramayana/ONC05845.JPG','','',''],
 ['restaurant-buffet','A touch of tradition at the buffet','Dining','Woven food covers and a timber canopy bring a traditional detail to the restaurant serving station.','Ramayana/ONC05844.JPG','','',''],
 ['reception-welcome','Your first hello','Spaces','A welcoming gesture at the reception desk, with daylight and greenery just beyond the entrance.','Ramayana/ONC05852.JPG','','',''],
 ['lobby-wicker','Daylight & wicker chairs','Spaces','Two woven armchairs and a small table beside the lobby windows: a bright spot for a quiet conversation.','Ramayana/ONC05853.JPG','','',''],
 ['lobby-sofa','A sofa, a pause, a little comfort','Spaces','A cushioned sofa, paired table lamps, and a textured stone wall create an intimate lobby sitting area.','Ramayana/ONC05854.JPG','','',''],
 ['gym-treadmill','Keep your rhythm','Facilities','Treadmill at the hotel gym.','Ramayana/ONC05859.JPG','','',''],
 ['lounge-gathering','A circle for conversation','Spaces','Armchairs gather around a flower-topped coffee table in a light-filled lounge, with a television nearby.','Ramayana/ONC05864.JPG','','',''],
 ['hotel-staircase','Light between the floors','Spaces','A glass balustrade and silver handrails keep the staircase open to the daylight from the courtyard.','Ramayana/ONC05866.JPG','','',''],
 ['courtyard-balcony','A seat above the courtyard','Spaces','A pair of chairs sits beside the white balustrade, just outside the guest-room doors.','Ramayana/ONC05869.JPG','','',''],
 ['corridor-seating','Carved details, quiet conversations','Spaces','Carved wooden armchairs and a low table turn a guest corridor into a small place to pause.','Ramayana/ONC05870.JPG','','',''],
 ['room-warm-interior','Warm light & an upholstered headboard','Rooms','White linen, a padded headboard, and a circular wall ornament in a Ramayana guest room. The source does not identify its category.','Ramayana/ONC05872.JPG','','',''],
 ['room-tea-coffee','A little everyday comfort','Rooms','Coffee and tea amenities photographed in a hotel room. Inclusions depend on the selected room.','Ramayana/ONC05876.JPG','','',''],
 ['room-vanity','Bathroom details','Rooms','Bathroom vanity photographed at Ramayana. Layout varies by room.','Ramayana/ONC05877.JPG','','',''],
 ['room-workspace','Room for a quiet moment','Rooms','Desk and storage details in a hotel room. Furnishings vary by room.','Ramayana/ONC05879.JPG','','',''],
 ['reading-selection','Makassar, one page at a time','Facilities','Local magazines on a small table invite a closer look at Makassar between outings.','Ramayana/ONC05880.JPG','','',''],
 ['superior-king','Superior King','Rooms','A king bed with white linen, a warm timber headboard, wall lamps, and a writing desk.','Room/Superior Room/1645343294956.jpeg','','','superior-king'],
 ['superior-twin','Superior Twin','Rooms','Two separate beds beneath warm wall lights, with a writing desk and television opposite.','Room/Superior Room/1645343295172.jpeg','','','superior-twin'],
 ['superior-bathroom','Superior · shower room','Rooms','A tiled shower area, towel rail, and toilet in the supplied Superior Room collection.','Room/Superior Room/1645343295161.jpeg','','','superior'],
 ['deluxe-twin','Deluxe Twin','Rooms','Twin beds against a textured feature wall, a bedside table between them, and space for a desk opposite.','Room/Deluxe Room/1645343295138.jpeg','','','deluxe-twin'],
 ['triple-205','Triple room · 205','Rooms','Three separate beds in room 205. Confirm the room category and availability with Reservations.','Room/triple205.png','','',''],
 ['triple-223','Triple room · 223','Rooms','Three separate beds beside a shared headboard, with a writing desk opposite. Room 223; confirm the category and availability with Reservations.','Room/triple223.png','','',''],
].map(([id,title,category,caption,source,venue,layout,room])=>({id,src:`/media/collection/${id}.webp`,title,category:category as HotelPhoto['category'],caption,source,...venue?{venue,layout}:{},...room?{room}:{}}));
hotelPhotos.push(...curatedRoomPhotos,...meetingPhotos,...supplementalPhotos);
export const venuePhotos=(slug:string)=>hotelPhotos.filter(p=>p.venue===slug);
export const roomPhotos=(slug:string)=>hotelPhotos.filter(p=>p.room===slug||(['superior-king','superior-twin'].includes(slug)&&p.room==='superior')||(slug.endsWith('-triple')&&p.id.startsWith('triple-')));
