'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import type {HotelSettings} from '@/lib/types';
import styles from './scroll-hero.module.css';

export function Hero({settings:s}:{settings:HotelSettings}) {
 const root=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const section=root.current,media=video.current;if(!section||!media)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true;
  const playback=()=>{
   if(visible&&!document.hidden&&!reduced.matches&&media.dataset.userPaused!=='true')void media.play().catch(()=>{});
   else media.pause();
  };
  const loaded=()=>{section.dataset.videoReady='true';playback();};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;playback();});
  observer.observe(section);
  media.addEventListener('loadeddata',loaded);
  reduced.addEventListener('change',playback);
  document.addEventListener('visibilitychange',playback);
  window.addEventListener('ramayana:film-playback',playback);
  if(media.readyState>=2)loaded();else playback();
  return()=>{observer.disconnect();media.pause();media.removeEventListener('loadeddata',loaded);reduced.removeEventListener('change',playback);document.removeEventListener('visibilitychange',playback);window.removeEventListener('ramayana:film-playback',playback);};
 },[s.heroVideo,failed]);
 return <section id="arrival" ref={root} className={styles.hero} aria-label="Welcome to Ramayana Hotel">
  <h1 className={styles.heading} tabIndex={-1}>Ramayana Hotel Makassar</h1>
  <div className={styles.poster}><Image src={s.heroImage} alt="The courtyard at Ramayana Hotel Makassar" fill priority sizes="100vw"/></div>
  {s.heroVideo&&!failed&&<video ref={video} className={styles.video} src={s.heroVideo} preload="metadata" muted loop playsInline disablePictureInPicture aria-hidden="true" onError={()=>setFailed(true)}/>}
  <div className={styles.shade}/>
 </section>;
}
