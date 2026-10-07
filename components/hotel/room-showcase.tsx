'use client';
import {useRef,useState,type PointerEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowLeft,ArrowRight,ArrowUpRight,Images} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {roomFacts} from '@/lib/hotel-profile';
import {roomGallery} from '@/lib/room-gallery';
import {translateText} from '@/lib/translations';
import {track} from '@/lib/analytics';
import {LocalizedText as T,useLanguage} from './language-provider';
import {DetailIcon} from './detail-icon';
import styles from './room-showcase.module.css';
import {useScrollCarousel} from './use-scroll-carousel';

export function RoomDiscovery({rooms}:{rooms:ContentItem[]}){
 const [index,setIndex]=useState(0);
 const section=useRef<HTMLElement>(null);
 useScrollCarousel(section,rooms.length,setIndex);
 const gesture=useRef<{x:number;y:number;dragged:boolean}|null>(null);
 const swiped=useRef(false);
 const {locale}=useLanguage();
 const label=(text:string)=>translateText(text,locale);
 const activeIndex=index<rooms.length?index:0;
 const room=rooms[activeIndex];
 const categories=[...new Set(rooms.map(item=>item.category))];
 const choose=(next:number)=>{setIndex((next+rooms.length)%rooms.length);track('room_select');};
 const move=(event:PointerEvent<HTMLAnchorElement>)=>{
  const start=gesture.current;if(!start)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;
  if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.4){start.dragged=true;swiped.current=true;event.currentTarget.setPointerCapture(event.pointerId);}
 };
 if(!room)return null;
 return <section ref={section} id="rooms" className={styles.rooms} aria-labelledby="room-gallery-heading">
  <div className={styles.inner}>
   <header className={styles.heading}>
    <div data-reveal-item><p className={styles.eyebrow}><T>02 / ROOMS & SUITES</T></p><h2 id="room-gallery-heading"><T>A little room.</T><br/><em><T>All your own.</T></em></h2></div>
    <div className={styles.headingSide} data-reveal-item><p><T>From a quiet escape for two to a suite with space to linger. Find your place at Ramayana.</T></p><Link href="/rooms" className={styles.allRooms}><T>Explore all rooms</T><ArrowUpRight size={18}/></Link></div>
   </header>
   <div className={styles.collection} role="region" aria-roledescription="carousel" aria-label={label('Room collection')} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();choose(activeIndex+(event.key==='ArrowRight'?1:-1));}}}>
    <div className={styles.visual} data-reveal-item="image">
     <Link href={`/rooms/${room.slug}`} className={styles.photograph} aria-label={`${label('Full room details')} · ${room.title}`} onDragStart={event=>event.preventDefault()}
      onPointerDown={event=>{swiped.current=false;if(event.button===0)gesture.current={x:event.clientX,y:event.clientY,dragged:false};}}
      onPointerMove={move} onPointerCancel={()=>{gesture.current=null;}}
      onPointerUp={event=>{const start=gesture.current;gesture.current=null;if(!start)return;const dx=event.clientX-start.x;if(start.dragged&&Math.abs(dx)>45)choose(activeIndex+(dx<0?1:-1));}}
      onClick={event=>{if(swiped.current&&event.detail!==0){event.preventDefault();return;}track('room_detail_open',{room:room.slug});}}>
      {rooms.map((item,i)=>{const first=roomGallery(item)[0];const src=item.image||first?.src;return <span key={item.id} className={`${styles.frame} ${i===activeIndex?styles.current:''}`} aria-hidden={i!==activeIndex}>{src?<Image src={src} alt={i===activeIndex?label(item.image?item.title:first?.caption||item.title):''} fill sizes="(max-width:760px) 94vw, 62vw" draggable={false}/>:<span className={styles.photoPending}><Images size={34} strokeWidth={1}/><T>Photography for this category is being prepared.</T></span>}</span>;})}
      <span className={styles.photoBadge}><Images size={16}/>{roomGallery(room).length} <T>photos</T></span>
      <span className={styles.openIcon} aria-hidden="true"><ArrowUpRight size={25} strokeWidth={1.3}/></span>
     </Link>
     <div className={styles.pictureFooter}><span>RAMAYANA HOTEL · MAKASSAR</span><span><T>Made for your stay.</T></span></div>
     {!room.image&&room.slug.endsWith('-triple')&&<p className={styles.sourceNote}><T>Triple-room example. Confirm the category with Reservations.</T></p>}
    </div>
    <div className={styles.copyPanel}>
     <div className={styles.categoryNav} aria-label={label('Room collection')}>{categories.map(category=><button key={category} aria-pressed={room.category===category} onClick={()=>choose(rooms.findIndex(item=>item.category===category))}><T>{category}</T></button>)}</div>
     <div key={room.id} className={styles.copy} aria-live="polite" aria-atomic="true">
      <span className={styles.roomNumber} aria-hidden="true">{String(activeIndex+1).padStart(2,'0')}</span>
      <h3><T>{room.title}</T></h3><p className={styles.description}><T>{room.description}</T></p>
      <dl className={styles.facts}>{roomFacts(room).slice(0,2).map(([name,value])=><div key={name}><dt><DetailIcon name={name} size={19}/><T>{name}</T></dt><dd><T>{value}</T></dd></div>)}</dl>
      <Link className={styles.detailLink} href={`/rooms/${room.slug}`}><T>Discover this room</T><ArrowUpRight size={19}/></Link>
     </div>
     <div className={styles.navigation}><span className={styles.count}><bdi>{String(activeIndex+1).padStart(2,'0')}<span> / {String(rooms.length).padStart(2,'0')}</span></bdi></span><div className={styles.progress} aria-hidden="true">{rooms.map((item,i)=><i key={item.id} className={i===activeIndex?styles.selected:''}/>)}</div><div className={styles.arrows}><button onClick={()=>choose(activeIndex-1)} disabled={rooms.length<2} aria-label={label('Previous room')}><ArrowLeft size={19}/></button><button onClick={()=>choose(activeIndex+1)} disabled={rooms.length<2} aria-label={label('Next room')}><ArrowRight size={19}/></button></div></div>
    </div>
   </div>
  </div>
 </section>;
}
