import {roomPhotos,type HotelPhoto} from './photo-catalog.ts';
import type {ContentItem} from './types.ts';

// These are older exports of the same cover photograph, not additional angles.
const coverAliases:Record<string,string[]>={
 'superior-king':['/media/1645343294956.jpeg'],
 'deluxe-twin':['/media/1645343295138.jpeg'],
};
export function roomGallery(room:Pick<ContentItem,'id'|'slug'|'title'|'image'|'description'|'details'>):HotelPhoto[]{
 const photos=roomPhotos(room.slug);
 const known=photos.find(p=>p.src===room.image);
 if(known)return [known,...photos.filter(p=>p!==known)];
 if(!room.image||coverAliases[room.slug]?.includes(room.image))return photos;
 // Preserve a staff-selected cover while retaining the reviewed room collection.
 return [{id:`${room.id}-cover`,src:room.image,title:room.title,caption:room.details.photoNote||room.description,category:'Rooms',room:room.slug,source:'Hotel content dashboard'},...photos];
}
