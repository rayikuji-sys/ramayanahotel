import type {HotelPhoto} from './photo-catalog.ts';

// Visually reviewed against the hotel's original, named room collections.
export const curatedRoomPhotos:HotelPhoto[]=[
 ['deluxe-king-bedroom','deluxe-king','Deluxe King · bedroom','A king bed, patterned wallpaper, warm wall lamps, and a desk beside the television.','Style Deluxe King Room/IMG_20220421_144803.jpg'],
 ['deluxe-king-layout','deluxe-king','Deluxe King · another perspective','The view from beside the bed toward the television, storage, and vanity.','Style Deluxe King Room/IMG_20220421_140319.jpg'],
 ['deluxe-king-coffee','deluxe-king','Deluxe King · tea & coffee corner','A kettle and cups tucked into the open shelving beside the wardrobe.','Style Deluxe King Room/IMG_20220421_145103.jpg'],
 ['deluxe-king-desk','deluxe-king','Deluxe King · writing desk','A curved writing desk with a woven chair and a small floral arrangement.','Style Deluxe King Room/IMG_20220421_145155.jpg'],
 ['junior-suite-bedroom','junior-suite','Junior Suite · bedroom & seating','White linen, patterned armchairs, and a circular wall ornament frame this Junior Suite.','Style Junior Suite Room/IMG-20220506-WA0004.jpg'],
 ['junior-suite-bedside','junior-suite','Junior Suite · bedside view','The king bed and pair of patterned armchairs, viewed toward the wardrobe.','Style Junior Suite Room/IMG-20220506-WA0007.jpg'],
 ['junior-suite-desk','junior-suite','Junior Suite · writing desk','A compact writing desk with a woven chair, magazines, and an open luggage shelf.','Style Junior Suite Room/IMG-20220506-WA0010.jpg'],
 ['junior-suite-vanity','junior-suite','Junior Suite · vanity','A stone-topped vanity, wall mirror, and neatly arranged bathroom details.','Style Junior Suite Room/IMG-20220506-WA0011.jpg'],
 ['junior-suite-shower','junior-suite','Junior Suite · shower room','A glass shower partition, tiled walls, and fresh towels in the Junior Suite bathroom.','Style Junior Suite Room/IMG-20220506-WA0013.jpg'],
 ['ramayana-suite-bedroom','ramayana-suite','Ramayana Suite · bedroom & lounge','The suite brings a king bed and a cushioned sofa together beneath warm lighting.','Style Ramayana Suite Room/IMG_20220422_133937.jpg'],
 ['ramayana-suite-sofa','ramayana-suite','Ramayana Suite · sofa corner','A dark sofa with patterned cushions faces the television beside the suite dining area.','Style Ramayana Suite Room/IMG_20220422_134929.jpg'],
 ['ramayana-suite-dining','ramayana-suite','Ramayana Suite · dining perspective','A view from the dining table toward the bedroom, desk, and decorative wall mirrors.','Style Ramayana Suite Room/IMG_20220422_134645.jpg'],
 ['ramayana-suite-desk','ramayana-suite','Ramayana Suite · writing desk','A desk lamp, curved writing surface, and a collection of small decorative mirrors.','Style Ramayana Suite Room/IMG-20220506-WA0019.jpg'],
 ['ramayana-suite-shower','ramayana-suite','Ramayana Suite · shower room','A glass-enclosed shower beside the bathroom vanity and window.','Style Ramayana Suite Room/IMG-20220506-WA0016.jpg'],
 ['ramayana-suite-bedside','ramayana-suite','Ramayana Suite · bedside view','The king bed beside full-height curtains and a round decorative mirror.','Style Ramayana Suite Room/IMG-20220506-WA0014.jpg'],
 ['deluxe-twin-window','deluxe-twin','Deluxe Twin · window-side view','Two separate beds beside full-height curtains, with warm light on the textured feature wall.','Bangunan/images (96).jpeg'],
].map(([id,room,title,caption,source])=>({id,room,title,caption,category:'Rooms',src:`/media/collection/${id}.webp`,source:`C:/Ramayana Hotel/${source}`}));

export const reviewedRoomCovers:Record<string,string>={
 'deluxe-king':'deluxe-king-bedroom',
 'junior-suite':'junior-suite-bedroom',
 'ramayana-suite':'ramayana-suite-bedroom',
};
export const roomCollectionNote='Photographs from the hotel’s named room collection. Layout, styling, and furnishings may vary by room.';
