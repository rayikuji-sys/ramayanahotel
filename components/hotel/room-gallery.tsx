'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowLeft,ArrowRight,Expand,Images} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {roomGallery} from '@/lib/room-gallery';
import {LocalizedText as T,useLanguage} from './language-provider';
import {translateText} from '@/lib/translations';
import {MediaLightbox} from './visual-gallery';
import {RoomPhotograph} from './room-photograph';
import styles from './room-gallery.module.css';

export function RoomGallery({room,detail=false,priority=false}:{room:ContentItem;detail?:boolean;priority?:boolean}){
 const photos=roomGallery(room);
 const [index,setIndex]=useState(0),[open,setOpen]=useState(false);
 const gesture=useRef<{x:number;y:number}|null>(null),swiped=useRef(false);
 const strip=useRef<HTMLDivElement>(null);
 const {locale}=useLanguage();
 const label=(text:string)=>translateText(text,locale);
 const active=photos[index]||photos[0];
 const move=(direction:number)=>setIndex(current=>(current+direction+photos.length)%photos.length);
 useEffect(()=>{
  const row=strip.current,selected=row?.children[index] as HTMLElement|undefined;
  if(!row||!selected)return;
  // Scroll only the thumbnail row; changing a photo must not move the page.
  row.scrollLeft=selected.offsetLeft-(row.clientWidth-selected.clientWidth)/2;
 },[index]);
 if(!active)return <div className={styles.empty}><RoomPhotograph room={room}/></div>;
 const items=photos.map(photo=>({...photo,type:'photo' as const}));
 return <section className={`${styles.gallery} ${detail?styles.detail:''}`} aria-label={`${room.title} · ${label('Photo gallery')}`} aria-roledescription="carousel" onKeyDown={event=>{
  if(open||photos.length<2)return;
  if(event.key==='ArrowRight'){event.preventDefault();move(1);}
  if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
  if(event.key==='Home'){event.preventDefault();setIndex(0);}
  if(event.key==='End'){event.preventDefault();setIndex(photos.length-1);}
 }}>
  <div className={styles.stage}>
   <div className={styles.backdrop} style={{backgroundImage:`url("${active.src}")`}} aria-hidden="true"/>
   <button className={styles.photograph} aria-label={`${label('View all photos')} · ${room.title}`} aria-haspopup="dialog" onClick={event=>{if(!swiped.current||event.detail===0)setOpen(true);}} onPointerDown={event=>{
    swiped.current=false;
    gesture.current={x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);
   }} onPointerCancel={()=>{gesture.current=null;}} onPointerUp={event=>{
    const start=gesture.current;gesture.current=null;if(!start)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    if(photos.length>1&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){swiped.current=true;move(dx<0?1:-1);}
   }}>
    {photos.map((photo,i)=><Image key={photo.id} className={i===index?styles.visible:styles.hidden} src={photo.src} alt={i===index?label(photo.caption):''} aria-hidden={i!==index} fill sizes={detail?'(max-width:760px) 100vw, 90vw':'(max-width:760px) 100vw, 55vw'} loading={(detail||priority)&&i===0?'eager':'lazy'} draggable={false}/>)}
   </button>
   <span className={styles.badge}><Images size={15}/><span>{photos.length} <T>photos</T></span></span>
   <div className={styles.controls}>
    <div className={styles.navigation}><button aria-label={label('Previous photo')} disabled={photos.length<2} onClick={()=>move(-1)}><ArrowLeft size={18}/></button><span aria-live="polite" aria-atomic="true"><bdi>{String(index+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</bdi></span><button aria-label={label('Next photo')} disabled={photos.length<2} onClick={()=>move(1)}><ArrowRight size={18}/></button></div>
    <button className={styles.expand} aria-label={`${label('View all photos')} · ${room.title}`} aria-haspopup="dialog" onClick={()=>setOpen(true)}><Expand size={17}/><span><T>View all photos</T></span></button>
   </div>
  </div>
  <div className={styles.caption} aria-live="polite" aria-atomic="true"><strong><T>{active.title}</T></strong><p><T>{active.caption}</T></p></div>
  <div className={styles.thumbnails} ref={strip} aria-label={label('Choose a photo')}>
   {photos.map((photo,i)=><button key={photo.id} aria-label={`${i+1}. ${label(photo.title)}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><Image src={photo.src} alt="" fill sizes="100px"/><span>{String(i+1).padStart(2,'0')}</span></button>)}
  </div>
  {open&&<MediaLightbox items={items} index={index} onIndex={setIndex} onClose={()=>setOpen(false)}/>}
 </section>;
}
