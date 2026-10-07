'use client';
import {useEffect,useMemo,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Plus,Minus,Sun,Armchair,Dumbbell,BookOpen,Images,Sparkles} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {facilityGallery} from '@/lib/facility-gallery';
import {translateText} from '@/lib/translations';
import {LocalizedText as T,useLanguage} from './language-provider';
import {MediaLightbox} from './visual-gallery';
import styles from './facilities-discovery.module.css';

const order=['cozy-outdoor','living-room','sriwijaya-gym','mini-library'];
const icons:Record<string,typeof Sun>={'cozy-outdoor':Sun,'living-room':Armchair,'sriwijaya-gym':Dumbbell,'mini-library':BookOpen};

export function Facilities({items:allItems,full=false}:{items:ContentItem[];full?:boolean}){
 const items=useMemo(()=>allItems.filter(item=>!!item.image).sort((a,b)=>(order.indexOf(a.slug)<0?99:order.indexOf(a.slug))-(order.indexOf(b.slug)<0?99:order.indexOf(b.slug))),[allItems]);
 const [selected,setSelected]=useState(0),[photo,setPhoto]=useState<number|null>(null);
 useEffect(()=>{
  if(!full)return;
  const select=(hash:string)=>{const index=items.findIndex(item=>`#${item.slug}`===hash);if(index>=0)setSelected(index);};
  const sync=()=>select(window.location.hash);
  const frame=requestAnimationFrame(sync);
  const click=(event:MouseEvent)=>{const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;if(link&&link.origin===location.origin&&link.pathname===location.pathname)select(link.hash);};
  window.addEventListener('hashchange',sync);document.addEventListener('click',click);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('hashchange',sync);document.removeEventListener('click',click);};
 },[full,items]);
 const {locale}=useLanguage();const label=(text:string)=>translateText(text,locale);
 const active=selected<items.length?selected:0;const item=items[active];
 if(!item)return null;
 const photos=facilityGallery(item);
 return <section id="facilities" className={`${styles.spaces} ${full?styles.full:''}`} aria-label={label('Spaces at Ramayana')}>
  <div className={styles.inner}>
   {!full&&<header className={styles.heading}>
    <div data-reveal-item><p className={styles.eyebrow}><T>03 / LIFE AT RAMAYANA</T></p><h2><T>Stay a little.</T><br/><em><T>Feel right at home.</T></em></h2></div>
    <p data-reveal-item><T>Open skies, quiet corners, and time for yourself. Discover the spaces that make a stay feel special.</T></p>
   </header>}
   <div className={styles.experience}>
    <div className={styles.visual} data-reveal-item="image">
     <div className={styles.imageStack}>
      <button className={styles.mainPhoto} onClick={()=>setPhoto(0)} aria-haspopup="dialog" aria-label={`${label('View all photos')} · ${item.title}`}>
       {items.map((space,i)=><span key={space.id} className={`${styles.scene} ${i===active?styles.activeScene:''}`} aria-hidden={i!==active}><Image src={space.image} alt={i===active?label(space.title):''} fill sizes="(max-width:760px) 94vw, 56vw" draggable={false}/></span>)}
       <span className={styles.photoLabel}><Images size={16}/>{photos.length} <T>photos</T><ArrowUpRight size={18}/></span>
      </button>
      <span className={styles.corner} aria-hidden="true">RAMAYANA<br/><em>moments</em></span>
     </div>
     <div className={styles.visualFoot}><span>{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><span><T>A different pace.</T></span></div>
    </div>
    <div className={styles.choices}>
     {items.map((space,i)=>{const Icon=icons[space.slug]||Sparkles;const isActive=i===active;return <article key={space.id} id={full?space.slug:undefined} className={`${styles.place} ${isActive?styles.activePlace:''}`}>
      <h3><button id={`space-${space.slug}-trigger`} aria-expanded={isActive} aria-controls={`space-${space.slug}-panel`} onClick={()=>setSelected(i)}><span className={styles.icon}><Icon size={22} strokeWidth={1.25}/></span><span><small><T>{space.category}</T></small><T>{space.title}</T></span>{isActive?<Minus size={18}/>:<Plus size={18}/>}</button></h3>
      <div className={styles.panel} id={`space-${space.slug}-panel`} role="region" aria-labelledby={`space-${space.slug}-trigger`} hidden={!isActive}>
       <button className={styles.mobilePhoto} onClick={()=>setPhoto(0)} aria-label={`${label('View all photos')} · ${space.title}`} aria-haspopup="dialog"><Image src={space.image} alt={label(space.title)} fill sizes="94vw"/><span><Images size={16}/><T>View all photos</T><ArrowUpRight size={18}/></span></button>
       <p><T>{space.description}</T></p>
       <button className={styles.galleryLink} onClick={()=>setPhoto(0)} aria-haspopup="dialog"><T>Explore in photographs</T><ArrowUpRight size={17}/></button>
      </div>
     </article>;})}
     {!full&&<Link className={styles.allSpaces} href="/facilities"><T>All facilities & services</T><ArrowUpRight size={18}/></Link>}
    </div>
   </div>
  </div>
  {photo!==null&&photos[photo]&&<MediaLightbox items={photos} index={photo} onIndex={setPhoto} onClose={()=>setPhoto(null)}/>}
 </section>;
}
