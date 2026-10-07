'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight,Maximize2,Play,X} from 'lucide-react';
import type {GalleryMedia} from '@/lib/gallery-media';
import styles from './visual-gallery.module.css';

export function MediaLightbox({items,index,onIndex,onClose}:{items:GalleryMedia[];index:number;onIndex:(index:number)=>void;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);const media=items[index];
  const gesture=useRef<{x:number;y:number}|null>(null);
  const strip=useRef<HTMLDivElement>(null);
  useEffect(()=>{const row=strip.current,button=row?.children[index] as HTMLElement|undefined;if(!row||!button)return;const bounds=row.getBoundingClientRect(),item=button.getBoundingClientRect();row.scrollBy({left:item.left-bounds.left-(bounds.width-item.width)/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});},[index]);
  useEffect(()=>{const previous=document.activeElement as HTMLElement;const dialog=ref.current;const overflow=document.body.style.overflow;dialog?.showModal();document.body.style.overflow='hidden';return()=>{dialog?.close();document.body.style.overflow=overflow;previous?.focus();};},[]);
  const next=(direction:number)=>onIndex((index+direction+items.length)%items.length);
  return <dialog ref={ref} className={styles.lightbox} aria-label="Photos and videos viewer" onCancel={onClose} onClick={event=>{if(event.target===ref.current)onClose();}} onKeyDown={event=>{if((event.target as HTMLElement).tagName==='VIDEO')return;if(event.key==='ArrowRight'){event.preventDefault();next(1);}if(event.key==='ArrowLeft'){event.preventDefault();next(-1);}}}>
    <div className={styles.lightboxHead}><span><T>RAMAYANA / </T>{media.category.toUpperCase()}</span><span>{String(index+1).padStart(2,'0')}<T> / </T>{String(items.length).padStart(2,'0')}</span><button aria-label="Close media viewer" onClick={onClose}><X/></button></div>
    <div className={styles.mediaStage} style={{touchAction:media.type==='photo'?'pan-y pinch-zoom':undefined}} onPointerDown={event=>{if(media.type==='photo'){gesture.current={x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);}}} onPointerCancel={()=>{gesture.current=null;}} onPointerUp={event=>{const start=gesture.current;gesture.current=null;if(!start)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)next(dx<0?1:-1);}}>{media.type==='video'?<video key={media.src} src={media.src} poster={media.poster} controls playsInline preload="metadata" aria-label={media.title}/>:<Image key={media.src} src={media.src} alt={media.title} fill sizes="95vw" unoptimized draggable={false}/>}</div>
    <div className={styles.lightboxFoot}><button aria-label="Previous photo or video" onClick={()=>next(-1)}><ArrowLeft/></button><div aria-live="polite"><h2 style={{color:"#f8f2e6"}}><T>{media.title}</T></h2><p><T>{media.caption}</T></p></div><button aria-label="Next photo or video" onClick={()=>next(1)}><ArrowRight/></button></div>
    <div ref={strip} className={styles.thumbnails} aria-label="Choose a photo or video">{items.map((item,i)=><button key={item.id} aria-label={`Show ${item.title}`} aria-pressed={i===index} onClick={()=>onIndex(i)}><Image src={item.poster||item.src} alt="" fill sizes="84px"/>{item.type==='video'&&<Play size={16}/>}</button>)}</div>
  </dialog>;
}

export function VisualGallery({media}:{media:GalleryMedia[]}) {
  const [category,setCategory]=useState('All');const [active,setActive]=useState<number|null>(null);
  const [venue,setVenue]=useState('all'),[layout,setLayout]=useState('all');
  const eventMedia=media.filter(m=>m.category==='Meetings & Events');
  const venues=[...new Set(eventMedia.map(m=>m.venue||'other'))];
  const venueMedia=eventMedia.filter(m=>venue==='all'||(m.venue||'other')===venue);
  const arrangements=[...new Set(venueMedia.map(m=>m.layout).filter((l):l is string=>!!l))];
  const categories=['All','Rooms','Spaces','Facilities','Dining','Meetings & Events',...(media.some(m=>m.type==='video')?['Films']:[])];
  const filtered=media.filter(m=>(category==='All'||m.category===category)&&(category!=='Meetings & Events'||((venue==='all'||(m.venue||'other')===venue)&&(layout==='all'||m.layout===layout))));
  return <section className={styles.gallery} aria-label="Ramayana photo and video collection">
    <div className={styles.intro}><span className={styles.index}><T>RAMAYANA / PHOTOS & VIDEOS</T></span><h1 tabIndex={-1}><T>Look a little closer.</T><br/><em><T>Feel a little more.</T></em></h1><p><T>Quiet corners. Open skies. Moments together.</T><br/><T>Explore the places that make Ramayana feel like home.</T></p></div>
    <div className={styles.filters} aria-label="Filter photos and videos">{categories.map(c=><button key={c} onClick={()=>{setCategory(c);setVenue('all');setLayout('all');setActive(null);}} aria-pressed={category===c} className={category===c?styles.selected:''}><T>{c}</T><sup>{c==='All'?media.length:media.filter(m=>m.category===c).length}</sup></button>)}</div>
    <div className={styles.eventFilters} hidden={category!=='Meetings & Events'}><label><T>Venue</T><select value={venue} onChange={e=>{setVenue(e.target.value);setLayout('all');setActive(null);}}><option value="all"><T>All venues</T></option>{venues.map(v=><option key={v} value={v}>{v==='erlangga'?'Erlangga':v==='majapahit'?'Majapahit':<T>Other spaces</T>}</option>)}</select></label><label><T>Arrangement</T><select value={layout} onChange={e=>{setLayout(e.target.value);setActive(null);}}><option value="all"><T>All arrangements</T></option>{arrangements.map(l=><option key={l} value={l}><T>{l}</T></option>)}</select></label></div>
    <div className={styles.collectionLine}><span aria-live="polite">{category==='All'?'The complete collection':category}<T> · </T><T>{filtered.length}</T><T> moments</T></span><span><T>SELECT A FRAME TO EXPLORE </T><ArrowUpRight size={13}/></span></div>
    <div key={`${category}-${venue}-${layout}`} className={styles.mosaic}>{filtered.map((m,i)=><button key={m.id} className={styles.tile} onClick={()=>setActive(i)} aria-label={`${m.type==='video'?'Watch':'View'} ${m.title}`} style={{animationDelay:`${Math.min(i,6)*65}ms`}}><Image src={m.poster||m.src} alt={m.title} fill sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 60vw"/><span className={styles.tileShade}/><span className={styles.number}>{String(i+1).padStart(2,'0')}</span>{m.type==='video'&&<span className={styles.play}><Play fill="currentColor" size={24}/></span>}<span className={styles.tileCaption}><span><small><T>{m.category}</T></small><strong><T>{m.title}</T></strong></span>{m.type==='video'?<Play size={19}/>:<Maximize2 size={18}/>}</span></button>)}</div>
    <div className={styles.endnote}><span><T>✧</T></span><p><T>Some places are best experienced in person.</T></p><Link className="text-link" href="/rooms"><T>Find your room </T><ArrowUpRight size={17}/></Link></div>
    {active!==null&&filtered[active]&&<MediaLightbox items={filtered} index={active} onIndex={setActive} onClose={()=>setActive(null)}/>}
  </section>;
}
