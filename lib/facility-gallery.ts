import type {ContentItem} from './types.ts';
import {galleryMedia,type GalleryMedia} from './gallery-media.ts';

const collections:Record<string,string[]>={
 'living-room':['lounge'],
 'cozy-outdoor':['courtyard-above','courtyard','courtyard-balcony'],
 'sriwijaya-gym':['gym','gym-treadmill'],
 'mini-library':['lobby'],
};

export function facilityGallery(item:ContentItem):GalleryMedia[]{
 const catalog=galleryMedia([]);
 const selected=(collections[item.slug]||[]).flatMap(id=>catalog.filter(p=>p.id===id));
 const cover=catalog.find(p=>p.src===item.image);
 const photos=item.image?[cover||{id:`facility-${item.slug}`,src:item.image,title:item.title,caption:item.description,category:'Facilities',type:'photo' as const},...selected]:selected;
 return photos.filter((photo,index)=>photos.findIndex(p=>p.src===photo.src)===index);
}
