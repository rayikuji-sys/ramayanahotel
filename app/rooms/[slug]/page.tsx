import {notFound,redirect} from 'next/navigation';import type {Metadata} from 'next';
import {content} from '@/lib/db';import {RoomDetail} from '@/components/hotel/room-collection';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const room=content().find(i=>i.kind==='room'&&i.slug===slug);return {title:room?.title||'Room not found',description:room?.description};}
export default async function Room({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const items=content();const rooms=items.filter(i=>i.kind==='room');const room=rooms.find(i=>i.slug===slug);
 if(!room){if(slug==='family-room')redirect('/rooms/superior-triple');if(slug==='suite')redirect('/rooms/ramayana-suite');notFound();}
 return <RoomDetail room={room} rooms={rooms} policies={items.filter(i=>i.kind==='policy')}/>;
}
