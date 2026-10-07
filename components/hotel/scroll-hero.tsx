'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowDown} from 'lucide-react';
import type {HotelSettings} from '@/lib/types';
import {ReserveButton} from './site-shell';
import styles from './scroll-hero.module.css';

export function Hero({settings:s}:{settings:HotelSettings}) {
  const root=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const section=root.current,media=video.current;
    if(!section||!media)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,target=0,disposed=false;
    const seek=()=>{
      if(disposed||reduced.matches||!Number.isFinite(media.duration)||media.seeking)return;
      // Keep the final decoded frame visible instead of seeking beyond the media timeline.
      const next=Math.min(Math.max(0,media.duration-1/30),target*media.duration);
      if(Math.abs(media.currentTime-next)>.025)media.currentTime=next;
    };
    const render=()=>{
      frame=0;
      const rect=section.getBoundingClientRect();
      const viewport=section.firstElementChild as HTMLElement|null;
      target=reduced.matches?0:Math.max(0,Math.min(1,-rect.top/Math.max(1,section.offsetHeight-(viewport?.offsetHeight||window.innerHeight))));
      section.style.setProperty('--progress',String(target));
      section.style.setProperty('--copy-opacity',String(Math.max(0,1-target*5)));
      section.style.setProperty('--copy-y',`${-target*90}px`);
      const copy=section.querySelector<HTMLElement>(`.${styles.copy}`);
      if(copy){copy.inert=target>=.2;copy.style.pointerEvents=target>=.2?'none':'auto';}
      section.dataset.scrubProgress=target.toFixed(3);
      seek();
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(render);};
    const loaded=()=>{media.pause();section.dataset.videoReady='true';queue();};
    media.addEventListener('loadeddata',loaded);media.addEventListener('seeked',seek);
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);reduced.addEventListener('change',queue);
    if(media.readyState>=2)loaded();render();
    return()=>{disposed=true;cancelAnimationFrame(frame);media.removeEventListener('loadeddata',loaded);media.removeEventListener('seeked',seek);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);};
  },[s.heroVideo,failed]);
  return <section id="arrival" ref={root} className={`${styles.hero} ${!s.heroVideo||failed?styles.stillHero:''}`} aria-label="Welcome to Ramayana Hotel">
    <div className={styles.viewport}>
      <div className={styles.poster}><Image src={s.heroImage} alt="The courtyard at Ramayana Hotel Makassar" fill priority sizes="100vw"/></div>
      {s.heroVideo&&!failed&&<video ref={video} className={styles.video} src={s.heroVideo} preload="auto" muted playsInline disablePictureInPicture aria-label="Ramayana hotel arrival film, controlled by scrolling" onError={()=>setFailed(true)}/>}
      <div className={styles.shade}/>
      <div className={styles.copy}><p className="eyebrow"><T>RAMAYANA HOTEL · MAKASSAR</T></p><h1 tabIndex={-1}><T>A little closer</T><br/><T>to </T><em><T>feeling home.</T></em></h1><p><T>{s.intro}</T></p><div className="hero-actions"><ReserveButton/><a className="button glass" href="#rooms"><T>Discover your stay </T><ArrowDown size={16}/></a></div></div>
      {failed&&<span className={styles.fallback}><T>Welcome to Ramayana · Explore our rooms below</T></span>}
    </div>
  </section>;
}
