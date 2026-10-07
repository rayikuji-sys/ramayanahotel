'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Expand,LayoutGrid,MapPin} from 'lucide-react';
import {LocalizedText as T,useLanguage} from './language-provider';
import {translateText} from '@/lib/translations';
import type {GalleryMedia} from '@/lib/gallery-media';
import {MediaLightbox} from './visual-gallery';
import styles from './meeting-gallery.module.css';

const venueNames:Record<string,string>={erlangga:'Erlangga',majapahit:'Majapahit',other:'Other spaces'};
export function MeetingGallery({photos,title='Explore by room and arrangement.',compact=false}:{photos:GalleryMedia[];title?:string;compact?:boolean}){
 const {locale}=useLanguage();
 const [venue,setVenue]=useState('all'),[layout,setLayout]=useState('all'),[active,setActive]=useState<number|null>(null);
 const venues=[...new Set(photos.map(p=>p.venue||'other'))];
 const inVenue=photos.filter(p=>venue==='all'||(p.venue||'other')===venue);
 const arrangements=[...new Set(inVenue.map(p=>p.layout).filter((v):v is string=>!!v))];
 const filtered=inVenue.filter(p=>layout==='all'||p.layout===layout);
 // The overview offers a short preview; the dedicated gallery and venue pages include every frame.
 const shown=compact?filtered.slice(0,6):filtered;
 if(!photos.length)return null;
 return <section className={styles.collection} aria-label={translateText('Meeting photographs',locale)}>
  <header className={styles.heading}><div><p className="eyebrow"><T>PHOTOGRAPHED AT RAMAYANA</T></p><h2><T>{title}</T></h2></div><p><T>Browse the arrangements, then open a photograph to see the full frame.</T></p></header>
  <div className={styles.toolbar}>
   {venues.length>1&&<div className={styles.venueFilters} role="group" aria-label={translateText('Venue',locale)}><span><MapPin size={15}/><T>Venue</T></span>{['all',...venues].map(v=><button key={v} type="button" aria-pressed={venue===v} onClick={()=>{setVenue(v);setLayout('all');setActive(null);}}><T>{v==='all'?'All venues':venueNames[v]||v}</T><small>{v==='all'?photos.length:photos.filter(p=>(p.venue||'other')===v).length}</small></button>)}</div>}
   <div className={styles.layoutFilters} role="group" aria-label={translateText('Arrangement',locale)}><span><LayoutGrid size={15}/><T>Arrangement</T></span>{['all',...arrangements].map(l=><button key={l} type="button" aria-pressed={layout===l} onClick={()=>{setLayout(l);setActive(null);}}><T>{l==='all'?'All arrangements':l}</T><small>{l==='all'?inVenue.length:inVenue.filter(p=>p.layout===l).length}</small></button>)}</div>
  </div>
  <div className={styles.resultLine}><span aria-live="polite">{filtered.length} <T>photos</T>{venue!=='all'&&<> · <T>{venueNames[venue]||venue}</T></>}{layout!=='all'&&<> · <T>{layout}</T></>}</span><span><Expand size={14}/><T>Select a photograph to explore the details.</T></span></div>
  <div className={styles.grid} key={`${venue}-${layout}`} data-meeting-grid>
   {shown.map((photo,i)=><button type="button" key={photo.id} className={styles.card} aria-label={`${translateText('View',locale)} ${translateText(photo.title,locale)}`} onClick={()=>setActive(i)} style={{animationDelay:`${Math.min(i,5)*45}ms`}}>
    <span className={styles.frame}><Image src={photo.src} alt={translateText(photo.caption,locale)} fill sizes="(max-width:620px) 92vw, (max-width:1000px) 45vw, 30vw"/><span className={styles.expand}><Expand size={18}/></span><span className={styles.number}>{String(i+1).padStart(2,'0')}</span></span>
    <span className={styles.caption}><span className={styles.tags}><span><MapPin size={12}/><T>{venueNames[photo.venue||'other']||photo.venue||'Other spaces'}</T></span><span><LayoutGrid size={12}/><T>{photo.layout}</T></span></span><strong><T>{photo.title}</T></strong><span className={styles.description}><T>{photo.caption}</T></span></span>
   </button>)}
  </div>
  {compact&&<Link href="/events/gallery" className={styles.allLink}><span><T>View all photos</T><small>{photos.length} <T>photos</T></small></span><ArrowUpRight size={21}/></Link>}
  {active!==null&&filtered[active]&&<MediaLightbox items={filtered} index={active} onIndex={setActive} onClose={()=>setActive(null)}/>}
 </section>;
}
