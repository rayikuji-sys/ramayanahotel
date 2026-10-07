'use client';
import Image from 'next/image';
import {Crown} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {LocalizedText as T} from './language-provider';

export function RoomPhotograph({room,sizes='100vw',priority=false}:{room:ContentItem;sizes?:string;priority?:boolean}){
 if(room.image)return <Image src={room.image} alt={room.title} fill sizes={sizes} priority={priority} draggable={false}/>;
 return <span className="room-photo-pending"><Crown size={36} strokeWidth={1}/><span>RAMAYANA / <T>{room.category}</T></span><strong><T>{room.title}</T></strong><small><T>Foto kategori ini sedang disiapkan.</T></small></span>;
}
