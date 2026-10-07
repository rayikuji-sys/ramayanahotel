import {writeFileSync} from 'node:fs';
writeFileSync('app/page.tsx',`import {content,settings} from '@/lib/db';
import {Hero,RoomDiscovery,Facilities,Dining,Journey,Explore,FinalCTA} from '@/components/hotel/chapters';
import {Events} from '@/components/hotel/events';
export const dynamic='force-dynamic';
export default function Home(){const items=content();const hotel=settings();const visible=(id:string)=>items.some(i=>i.kind==='section'&&i.slug===id);return <main id="main"><Hero settings={hotel}/>{visible('rooms')&&<RoomDiscovery rooms={items.filter(i=>i.kind==='room')}/>} {visible('facilities')&&<Facilities items={items.filter(i=>i.kind==='facility')}/>} {visible('dining')&&<Dining items={items.filter(i=>i.kind==='dining')}/>} {visible('services')&&<Journey items={items.filter(i=>i.kind==='service')}/>} {visible('nearby')&&<Explore items={items.filter(i=>i.kind==='place')} settings={hotel}/>} {visible('events')&&<Events items={items.filter(i=>i.kind==='event')} settings={hotel}/>} {visible('guestbook')&&items.some(i=>i.kind==='testimonial')&&<section className="section-pad guestbook container"><p className="eyebrow">THE LIVING GUESTBOOK</p><h2>Stories that stay.</h2>{items.filter(i=>i.kind==='testimonial').map(i=><blockquote key={i.id}><p>{i.description}</p><cite>{i.title}</cite></blockquote>)}</section>}<FinalCTA/></main>;}
`);
writeFileSync('app/layout.tsx',`import type {Metadata} from 'next';
import './globals.css';
import {SiteShell} from '@/components/hotel/site-shell';
import {content,settings} from '@/lib/db';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:{default:'Ramayana Hotel Makassar | Where you feel homey & happy',template:'%s | Ramayana Hotel Makassar'},description:'Discover rooms, dining, and gathering spaces at Ramayana Hotel Makassar. Contact Reservations or plan an event with our team.',icons:{icon:'/favicon.svg'},robots:{index:process.env.PUBLIC_SITE==='true',follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){const hotel=settings();return <html lang="en"><body><SiteShell data={{settings:hotel,items:content()}}>{children}</SiteShell></body></html>;}
`);
writeFileSync('public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#252722"/><text x="32" y="46" text-anchor="middle" font-family="Georgia,serif" font-size="43" fill="#f7f4ee">R</text></svg>');
