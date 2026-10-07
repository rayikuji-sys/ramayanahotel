'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowDown, ArrowUpRight, ChevronDown, Crown, SlidersHorizontal} from 'lucide-react';
import type {ContentItem} from '@/lib/types';
import {rupiah, roomFacts} from '@/lib/hotel-profile';
import {ReserveButton} from './site-shell';
import {DetailIcon} from './detail-icon';
import styles from './room-collection.module.css';
import {RoomGallery} from './room-gallery';
import {RoomPhotograph} from './room-photograph';

function RoomFact({icon,label,children}:{icon:string;label:string;children:React.ReactNode}) {
  return <div className={styles.factTile}><DetailIcon name={icon}/><span><small><T>{label}</T></small><strong><T>{children}</T></strong></span></div>;
}
function bedLabel(room:ContentItem) {
  const bed=room.details.bed;
  return bed?.startsWith('Confirm')?'Suite accommodation':bed?.startsWith('Triple')?'Triple category':bed||'Ask Reservations';
}
function PhotoNote({children}:{children:React.ReactNode}) {
  return <p className={styles.photoNote}><DetailIcon name="photo" size={15}/><span><T>{children}</T></span></p>;
}
function AmenityList({items}:{items:string[]}) {
  return <ul className={styles.amenityList}>{items.map(item=><li key={item}><DetailIcon name={item}/><span><T>{item}</T></span></li>)}</ul>;
}

export function RoomCollection({rooms}:{rooms:ContentItem[]}) {
  const [category,setCategory]=useState('All rooms');
  const filtered=rooms.filter(r=>category==='All rooms'||r.category===category);
  return <div className={styles.collection}>
    <section className={styles.opening} aria-labelledby="collection-title" data-scroll-scene>
      <div className={styles.openingPhoto} data-parallax="50"><Image src="/media/1645343294956.jpeg" alt="Warm wood and soft lighting in a Ramayana room" fill priority sizes="(max-width:760px) 100vw, 65vw"/><span className={styles.photoLabel}><T>MAKASSAR, WITH A PERSONAL TOUCH</T></span></div>
      <div className={styles.collectionSeal} aria-hidden="true"><Crown size={24} strokeWidth={1.2}/><span><T>RAMAYANA</T><br/><T>ROOMS & SUITES</T></span></div>
      <div className={styles.openingNote}>
        <span className={styles.kicker}><T>THE ROOM COLLECTION</T></span>
        <h1 id="collection-title" tabIndex={-1}><T>Rest beautifully.</T><br/><em><T>Stay your way.</T></em></h1>
        <p><T>A quiet retreat. A little everyday luxury. Find your own space, and let Makassar unfold around you.</T></p>
        <div className={styles.collectionStats}><span><b><bdi dir="ltr">{rooms.length.toString().padStart(2,'0')}</bdi></b><T>room categories</T></span><i/><span><b><bdi dir="ltr">20–40<small> m²</small></bdi></b><T>space to make your own</T></span></div>
        <a className={styles.exploreLink} href="#choose-room"><T>Discover your room </T><span><ArrowDown size={18}/></span></a>
      </div>
      <span className={styles.openingIndex} aria-hidden="true"><T>THE ART OF FEELING AT HOME — EST. IN MAKASSAR</T></span>
    </section>

    <div id="choose-room" className={styles.choose}>
      <span className={styles.filterLabel}><SlidersHorizontal size={16} strokeWidth={1.4}/><T>YOUR KIND OF COMFORT</T></span>
      <div className={styles.categories} aria-label="Filter room categories">{['All rooms',...new Set(rooms.map(r=>r.category))].map(c=><button key={c} className={category===c?styles.active:''} aria-pressed={category===c} onClick={()=>setCategory(c)}><T>{c}</T></button>)}</div>
    </div>
    <p className={styles.count} aria-live="polite"><span>{filtered.length.toString().padStart(2,'0')}</span> {filtered.length===1?'room category':'room categories'}<T> · Thoughtfully made for your stay</T></p>

    <div className={styles.roomList} key={category}>{filtered.map(room=><article key={room.id} className={styles.roomCard} data-scroll-scene>
      <div className={styles.imageFrame} data-reveal-item="image">
        <RoomGallery room={room}/>
      </div>
      <div className={styles.roomCopy} data-reveal-item="soft">
        <span className={styles.kicker}><Crown size={14} strokeWidth={1.3}/><T>{room.category}</T><T> / RAMAYANA</T></span>
        <h2><Link href={`/rooms/${room.slug}`}><T>{room.title}</T></Link></h2><p><T>{room.description}</T></p>
        <div className={styles.quickFacts}><RoomFact icon="area" label="ROOM SIZE"><T>{room.details.area}</T><T> m²</T></RoomFact><RoomFact icon="bed" label="YOUR REST">{bedLabel(room)}</RoomFact><RoomFact icon="wifi" label="STAY CONNECTED"><T>Free Wi-Fi</T></RoomFact></div>
        <div className={styles.cardBottom}><div className={styles.cardPrice}><span><T>ROOM-ONLY PROMO</T></span><strong>{rupiah(room.details.rate)}<small><T> / night</T></small></strong></div><ReserveButton room={room.slug} className={`button ${styles.reserve}`}><T>Reserve this room</T></ReserveButton></div>
        <Link className={styles.detailLink} href={`/rooms/${room.slug}`}><T>Explore this room </T><ArrowUpRight size={17}/></Link>
      </div>
    </article>)}</div>
    <PhotoNote><T>Photos illustrate Ramayana interiors. Layouts and furnishings vary by room. Promotional rates and availability are confirmed by Reservations.</T></PhotoNote>

    <details className={styles.compare} data-reveal-item="soft"><summary><DetailIcon name="collection"/><span><T>Find your perfect fit.</T><small><T>Compare the room collection</T></small></span><ChevronDown size={22}/></summary><div className={styles.tableScroll}><table><caption><T>Room-only promotional rates · breakfast excluded</T></caption><thead><tr><th><T>Room</T></th><th><T>Size</T></th><th><T>Bed arrangement</T></th><th><T>Promo / night</T></th></tr></thead><tbody>{rooms.map(r=><tr key={r.id}><th><Link href={`/rooms/${r.slug}`}><T>{r.title}</T><T> ↗</T></Link></th><td><T>{r.details.area}</T><T> m²</T></td><td><T>{r.details.bed}</T></td><td>{rupiah(r.details.rate)}</td></tr>)}</tbody></table></div></details>

    <section className={styles.shared} data-reveal-item="soft"><Crown size={30} strokeWidth={1}/><span className={styles.kicker}><T>THE LITTLE EXTRAS</T></span><h2><T>Every stay.</T><br/><em><T>A little more special.</T></em></h2><div className={styles.sharedGrid}>{[['wifi','Complimentary Wi-Fi'],['gym','Gym access'],['reception','24-hour reception'],['dining','Arjuna Resto']].map(([icon,text])=><div key={icon}><DetailIcon name={icon}/><span><T>{text}</T></span></div>)}</div><Link className={styles.detailLink} href="/hotel-info"><T>Everything about your stay </T><ArrowUpRight size={17}/></Link></section>
  </div>;
}

export function RoomDetail({room:r,rooms,policies}:{room:ContentItem;rooms:ContentItem[];policies:ContentItem[]}) {
  const [breakfast,setBreakfast]=useState(false);
  const rate=breakfast&&r.details.breakfastRate?r.details.breakfastRate:r.details.rate;
  const amenities=(r.details.amenities||'').split('|').filter(Boolean);
  const related=rooms.filter(room=>room.id!==r.id).sort((a,b)=>Number(b.category===r.category)-Number(a.category===r.category)).slice(0,2);
  return <main id="main" className={styles.detail}>
    <div className={styles.detailHeading}><Link href="/rooms" className={styles.kicker}><T>ROOMS & SUITES / </T><T>{r.category}</T></Link><div className={styles.ornament} aria-hidden="true"><i/><Crown size={24} strokeWidth={1.1}/><i/></div><h1 tabIndex={-1}><T>{r.title}</T></h1><p><T>Your own little world, in the heart of Makassar.</T></p></div>
    <RoomGallery key={r.id} room={r} detail/>
    {r.slug.endsWith('-triple')&&<PhotoNote>{r.details.photoNote}</PhotoNote>}
    <div className={styles.detailBody}><div className={styles.detailContent}>
      <section className={styles.overview} data-reveal-item="soft"><span className={styles.kicker}><T>SETTLE IN, SLOW DOWN</T></span><h2><T>Comfort, with</T><br/><em><T>room to be you.</T></em></h2><p><T>{r.description}</T></p><dl className={styles.facts}>{roomFacts(r).map(([key,value])=><div key={key}><dt><DetailIcon name={key}/><span><T>{key}</T></span></dt><dd><T>{value}</T></dd></div>)}</dl><PhotoNote><T>{r.details.photoNote}</T></PhotoNote></section>
      <section className={styles.amenities} data-reveal-item="soft"><span className={styles.kicker}><T>CONSIDERED IN EVERY DETAIL</T></span><h2><T>Make yourself at home.</T></h2><AmenityList items={amenities}/>
        <div className={styles.requestFacts}><div><div className={styles.groupHeading}><DetailIcon name="service"/><h3><T>Just ask us</T></h3></div><p><T>Available on request</T></p><AmenityList items={(r.details.onRequest||'').split('|').filter(Boolean)}/></div><div><div className={styles.groupHeading}><DetailIcon name="room"/><h3><T>In selected rooms</T></h3></div><p><T>Let us match your preferences</T></p><AmenityList items={(r.details.selective||'').split('|').filter(Boolean)}/></div></div>
      </section>
      <section className={styles.stayDetails} data-reveal-item="soft"><span className={styles.kicker}><T>A LITTLE PEACE OF MIND</T></span><h2><T>A smooth stay,</T><br/><em><T>from the start.</T></em></h2>{policies.filter(p=>['check-in-and-check-out','breakfast','guest-services','smoking-and-pets','stay-offers'].includes(p.slug)).map((p,i)=><details key={p.id} open={i===0}><summary><DetailIcon name={p.slug}/><span><T>{p.title}</T></span><ChevronDown size={17}/></summary><p><T>{p.description}</T></p></details>)}</section>
    </div>
      <aside className={styles.booking}>
        <div className={styles.bookingCrest}><Crown size={24} strokeWidth={1.1}/><span><T>YOUR NEXT CHAPTER</T></span></div><h3><T>{r.title}</T></h3><p className={styles.rate} aria-live="polite">{rupiah(rate)}<small><T> / night</T></small></p><p className={styles.promo}><T>Promotional offer · subject to availability</T></p>
        {r.details.breakfastRate?<fieldset className={styles.rateOptions}><legend><T>Choose your stay</T></legend><label><input type="radio" name="room-rate" checked={!breakfast} onChange={()=>setBreakfast(false)}/><DetailIcon name="room" size={19}/><span><T>Room only</T><small><T>Breakfast not included</T></small></span></label><label><input type="radio" name="room-rate" checked={breakfast} onChange={()=>setBreakfast(true)}/><DetailIcon name="breakfast" size={19}/><span><T>With breakfast</T><small><T>Breakfast for two guests</T></small></span></label></fieldset>:<div className={styles.breakfast}><DetailIcon name="breakfast"/><p><T>Breakfast, your way.</T><small><T>Available separately. Ask about your preferred package.</T></small></p></div>}
        <ReserveButton room={r.slug} plan={breakfast?'breakfast':'room-only'} className={`button ${styles.bookingButton}`}><T>Reserve this room</T></ReserveButton><p className={styles.bookingNote}><T>Continue to check dates, availability, and your selected room package.</T></p>
        <div className={styles.bookingTimes}><div><DetailIcon name="arrival" size={19}/><span><T>CHECK-IN</T><strong><T>14:00</T></strong></span></div><div><DetailIcon name="departure" size={19}/><span><T>CHECK-OUT</T><strong><T>12:00</T></strong></span></div></div>
      </aside>
    </div>
    <section className={styles.related} data-reveal-item="soft"><div className={styles.relatedHeading}><div><span className={styles.kicker}><T>MORE WAYS TO MAKE IT YOURS</T></span><h2><T>Another way to stay.</T></h2></div><Link className={styles.detailLink} href="/rooms"><T>All rooms </T><ArrowUpRight size={17}/></Link></div><div className={styles.relatedGrid}>{related.map(room=><Link key={room.id} href={`/rooms/${room.slug}`}><div data-parallax="28"><RoomPhotograph room={room} sizes="(max-width:760px) 100vw, 50vw"/></div><span><h3><T>{room.title}</T></h3><small><T>{room.details.area}</T><T> m² · </T>{rupiah(room.details.rate)}<T> / night</T></small><ArrowUpRight size={22}/></span></Link>)}</div></section>
  </main>;
}
