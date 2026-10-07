import type {ContentItem} from './types.ts';
import {hotelPhotos} from './photo-catalog.ts';
import {meetingPhotoAliases} from './meeting-photos.ts';
export type GalleryMedia={id:string;title:string;category:string;src:string;type:'photo'|'video';poster?:string;caption:string;venue?:string;layout?:string};
const meetingDetails:Record<string,{venue?:string;layout:string}>={
 'meeting-round':{venue:'erlangga',layout:'Round tables'},'meeting-u':{layout:'U-shape'},'meeting-banquet':{venue:'majapahit',layout:'Round tables'},'meeting-long':{venue:'majapahit',layout:'Classroom'},
};
const photography:Array<[string,string,string,string,string]>= [
 ['courtyard','The open-air courtyard','Spaces','10003537-b7d0fd9ab1d641aaa9edb62e5ecfe385.jpeg','Umbrella-shaded tables, climbing greenery, and circular stone patterns beneath the white balconies.'],
 ['lounge','A living room between journeys','Spaces','1645343295251.jpeg','A sofa and armchairs gather around a low table, with warm ceiling lighting and leafy greenery.'],
 ['dining','Arjuna Resto · around the table','Dining','10003537-8f73b1be0adc21dbe8bc2baffe3af347.jpeg','Dark dining tables and woven chairs in an open room, with a serving counter along the back wall.'],
 ['courtyard-above','White balconies, open skies','Spaces','10003537-24f3a2a972bcada2d9cfa75f9cd9ef2c.jpeg','An upper-floor view across the courtyard, its parasols, patterned floor, and surrounding balconies.'],
 ['gym','Sriwijaya Gym','Facilities','10003537-d5026931c6aead2c5e43e34e70a77677.jpeg','A treadmill, stationary bicycle, and strength machine in a bright room lined with mirrors.'],
 ['lobby','The lobby, in daylight','Spaces','10003537-593b8f547e82567ea32635bfb055102c.jpeg','A wide view through the lobby, from the reading display and lounge seats toward reception.'],
 ['meeting-round','Erlangga · round tables','Meetings & Events','IMG_20220107_155424.jpg','Round tables dressed in cream, with a lectern and speakers’ table at the front of Erlangga.'],
 ['bicycles','A different way to explore','Facilities','10003537-a3c03ca793d772cd151c4468f6fb4083.jpeg','Bicycles beside the glass-fronted gym. Ask reception about rental options and availability.'],
 ['corridor','Conversations between the columns','Spaces','1645343295238.jpeg','White columns, a carved wooden sofa, and occasional chairs line the bright guest corridor.'],
 ['lounge-seating','A seat by the windows','Spaces','10003537-96a28487708113454379b6470c3437ef.jpeg','Armchairs, a sofa, and a coffee table form a shared sitting area beside the tall windows.'],
 ['meeting-u','A U-shaped meeting arrangement','Meetings & Events','IMG_9246.JPG','Long tables and cream-covered chairs surround an open centre, with a projection screen beside the stage.'],
 ['meeting-banquet','Majapahit · banquet arrangement','Meetings & Events','IMG_20220109_103606.jpg','Cream-dressed round tables fill Majapahit, viewed from beside the speakers’ table.'],
 ['meeting-long','Majapahit · classroom arrangement','Meetings & Events','IMG_20220114_160047.jpg','Rows of dark-covered tables and cream chairs face the presentation area, with an aisle through the centre.'],
];
export function galleryMedia(items:ContentItem[],video=''):GalleryMedia[]{
 const reviewed:GalleryMedia[]=hotelPhotos.map(photo=>({...photo,type:'photo'}));
 const paths=new Set(reviewed.map(photo=>photo.src));
 const roomPhotos:GalleryMedia[]=items.filter(i=>i.kind==='room'&&i.image&&!paths.has(i.image)).filter((r,i,all)=>all.findIndex(x=>x.image===r.image)===i).map(r=>({id:`room-${r.id}`,title:r.title,category:'Rooms',src:r.image,type:'photo',caption:r.details.photoNote||r.description}));
 const photos:GalleryMedia[]=photography.map(([id,title,category,file,caption])=>({id,title,category,src:`/media/${file}`,type:'photo',caption,...meetingDetails[id]}));
 const result=[photos[0],...reviewed.filter(p=>['superior-king','superior-twin'].includes(p.id)),photos[1],photos[2],...roomPhotos,...photos.slice(3),...reviewed.filter(p=>!['superior-king','superior-twin'].includes(p.id))];
 if(video)result.splice(5,0,{id:'arrival-film',title:'Arrival · courtyard at ground level',category:'Films',src:video,poster:photos[0].src,type:'video',caption:'The arrival film: a closer view of the umbrella-shaded tables at the centre of Ramayana.'});
 result.splice(6,0,{id:'courtyard-film',title:'Courtyard · a view from the balcony',category:'Films',src:'/media/courtyard-film.mp4',poster:'/media/courtyard-film.jpg',type:'video',caption:'An eight-second moving view of the white balconies, open sky, parasols, and circular stone patterns in the courtyard.'});
 const seen=new Set<string>();
 return result.filter(photo=>{const key=meetingPhotoAliases[photo.src]||photo.src;if(seen.has(key))return false;seen.add(key);return true;});
}
export function eventGalleryMedia():GalleryMedia[]{
 const photos=galleryMedia([]).filter(p=>p.category==='Meetings & Events');
 const preferred=['erlangga-classroom-front','majapahit-round-front','majapahit-theatre-front','erlangga-classroom-stage','majapahit-round-stage','majapahit-theatre-stage'];
 return [...preferred.flatMap(id=>photos.filter(p=>p.id===id)),...photos.filter(p=>!preferred.includes(p.id)),{id:'event-courtyard',title:'The open-air courtyard',category:'Meetings & Events',src:'/media/10003537-b7d0fd9ab1d641aaa9edb62e5ecfe385.jpeg',type:'photo',layout:'Lounge',caption:'Umbrella-shaded tables, climbing greenery, and circular stone patterns beneath the white balconies.'}];
}
