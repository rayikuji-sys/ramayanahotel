'use client';
import {MeetingGallery} from './meeting-gallery';
import type {HotelPhoto} from '@/lib/photo-catalog';
export function PhotoStrip({photos,title='In photographs'}:{photos:HotelPhoto[];title?:string}){
 return <MeetingGallery photos={photos.map(photo=>({...photo,type:'photo' as const}))} title={title}/>;
}
