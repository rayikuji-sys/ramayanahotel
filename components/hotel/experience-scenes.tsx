'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {Photo,SectionHeading,useSwipe} from './chapters';
import {DetailIcon} from './detail-icon';
import {track} from '@/lib/analytics';

export function Dining({items}:{items:ContentItem[]}) {
 const [index,setIndex]=useState(0);
 const choose=(n:number)=>{setIndex((n+items.length)%items.length);track('dining_select');};
 const swipe=useSwipe(()=>choose(index+1),()=>choose(index-1));
 const selected=items[index];if(!selected)return null;
 return <section id="dining" className="dining-stories section-pad" aria-label="Dining at Ramayana"><div className="container">
  <SectionHeading number="04" label="SAVOUR THE MOMENT" title={<><T>A table.</T><br/><em><T>A little togetherness.</T></em></>} copy="From a quiet coffee to a meal worth lingering over. There’s a place for your kind of moment."/>
  <div className="dining-story-grid">
   <div className="dining-deck" data-reveal-item="soft" {...swipe} role="region" aria-roledescription="carousel" aria-label="Dining photographs" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();choose(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();choose(index-1);}}}>
    {items.map((item,i)=>{let offset=(i-index+items.length)%items.length;if(offset>items.length/2)offset-=items.length;return <div key={item.id} className={`dining-slide ${offset===0?'is-current':''}`} style={{'--offset':offset} as React.CSSProperties} aria-hidden={i!==index}><Photo src={item.image} alt={i===index?item.title:''} sizes="(max-width:760px) 85vw, 52vw"/><span>{String(i+1).padStart(2,'0')}<T> / </T>{String(items.length).padStart(2,'0')}</span></div>;})}
   </div>
   <div className="dining-story-copy"><div key={selected.id} className="scene-copy" aria-live="polite"><p className="eyebrow"><T>RAMAYANA / DINING</T></p><h3><T>{selected.title}</T></h3><p><T>{selected.description}</T></p><Link href="/contact" className="text-link"><T>Plan a meal with us </T><ArrowUpRight size={17}/></Link></div>
    <div className="scene-controls"><button className="icon-button outline" onClick={()=>choose(index-1)} aria-label="Previous dining scene"><ArrowLeft size={19}/></button><div className="scene-dots">{items.map((item,i)=><button key={item.id} aria-label={`Show ${item.title}`} aria-pressed={index===i} onClick={()=>choose(i)}><span/></button>)}</div><button className="icon-button outline" onClick={()=>choose(index+1)} aria-label="Next dining scene"><ArrowRight size={19}/></button></div>
   </div>
  </div>
 </div></section>;
}


export function Journey({items}:{items:ContentItem[]}) {
 const [index,setIndex]=useState(0);const selected=items[index];const choose=(i:number)=>setIndex((i+items.length)%items.length);
 const swipe=useSwipe(()=>choose(index+1),()=>choose(index-1));if(!selected)return null;
 return <section id="services" className="section-pad journey-stories"><div className="container"><SectionHeading number="05" label="THOUGHTFULLY, AT EVERY STEP" title={<><T>The art of</T><br/><em><T>feeling at home.</T></em></>} copy="A warm welcome. An unhurried stay. The small gestures that make a journey feel personal."/>
  <div className="journey-story" data-reveal-item="soft" {...swipe}>
   <div className="journey-photo" data-parallax="24"><Photo src={selected.image||'/media/collection/reception-welcome.webp'} alt={selected.title+' at Ramayana Hotel'} sizes="(max-width:760px) 100vw, 60vw"/><span className="journey-photo-label"><T>RAMAYANA / YOUR STAY</T></span></div>
   <div className="journey-note"><span className="journey-count" aria-hidden="true"><T>0</T>{index+1}</span><div className="scene-copy" key={selected.id} aria-live="polite"><DetailIcon name={selected.title}/><h3><T>{selected.title}</T></h3><p><T>{selected.description}</T></p><Link href="/hotel-info" className="text-link"><T>The details of your stay </T><ArrowUpRight size={17}/></Link></div><div className="journey-actions"><button className="icon-button outline" aria-label="Previous stay moment" onClick={()=>choose(index-1)}><ArrowLeft size={18}/></button><span>{index+1}<T> of </T><T>{items.length}</T></span><button className="icon-button outline" aria-label="Next stay moment" onClick={()=>choose(index+1)}><ArrowRight size={18}/></button></div></div>
  </div><div className="journey-steps" aria-label="Your stay moments">{items.map((item,i)=><button key={item.id} onClick={()=>choose(i)} aria-pressed={i===index}><span><T>0</T>{i+1}</span><T>{item.title}</T><i/></button>)}</div>
 </div></section>;
}
