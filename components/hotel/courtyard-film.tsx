'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {LocalizedText as T} from './language-provider';
import {useScrollFilm} from './use-scroll-film';
import styles from './courtyard-film.module.css';

export function CourtyardFilm(){
 const video=useRef<HTMLVideoElement>(null),section=useRef<HTMLElement>(null);const [failed,setFailed]=useState(false);
 useScrollFilm(section,video);
 return <section id="courtyard-film" ref={section} className={`${styles.story} ${failed?styles.still:''}`} aria-labelledby="courtyard-film-heading">
  <div className={styles.stage}>
   <video ref={video} className={styles.film} src="/media/courtyard-film.mp4" poster="/media/courtyard-film.jpg" muted playsInline preload="metadata" disablePictureInPicture aria-label="Courtyard Ramayana" onError={()=>setFailed(true)}/>
   <div className={styles.shade}/>
   <div className={styles.copy}><p className={styles.eyebrow}>RAMAYANA / COURTYARD</p><h2 id="courtyard-film-heading"><T>Langit terbuka.</T><br/><em><T>Waktu terasa lebih pelan.</T></em></h2><Link href="/gallery"><T>Jelajahi foto & video</T><ArrowUpRight size={18}/></Link></div>
   <div className={styles.progress} aria-hidden="true"><span/></div>
  </div>
 </section>;
}
