import type {Metadata} from 'next';
import {notFound,redirect} from 'next/navigation';
import {eventRecords} from '@/lib/events-store';
import {publicEvents,categories} from '@/lib/events-model';
import {settings} from '@/lib/db';
import {EventsExperience} from '@/components/hotel/events-experience';
export const dynamic='force-dynamic';
type Props={params:Promise<{path?:string[]}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
const pages:Record<string,string>={'':'Meetings & Celebrations',venues:'Venue & ruang meeting',gallery:'Galeri ruang & susunan acara',packages:'Paket acara','request-proposal':'Minta proposal acara','site-inspection':'Jadwalkan kunjungan venue','group-accommodation':'Acara & kamar rombongan',seasonal:'Program seasonal',ramadan:'Ramadan & buka bersama','new-years-eve':'New Year’s Eve',...Object.fromEntries(categories.map(c=>[c.slug,c.title]))};
function resolve(path:string[]=[]){
 const records=publicEvents(eventRecords());
 if(path.length===2&&['venues','packages'].includes(path[0])){
  const record=records.find(r=>r.slug===path[1]&&r.kind===(path[0]==='venues'?'venue':'package'));if(!record)return null;
  return {records,record,page:path[0],title:record.title};
 }
 if(path.length<=1&&pages[path[0]||''])return {records,record:undefined,page:path[0]||'',title:pages[path[0]||'']};
 return null;
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const path=(await params).path||[],data=resolve(path);if(!data)return {title:'Halaman tidak ditemukan',robots:{index:false}};
 const description=data.record?.description||'Rencanakan meeting, wedding, dan acara Anda di Ramayana Hotel Makassar. Jelajahi venue dan paket, lalu minta proposal yang sesuai kebutuhan.';
 const origin=process.env.APP_URL||'http://localhost:3001',url=origin+'/events'+(path.length?'/'+path.join('/'):'');
 return {title:data.title,description,alternates:{canonical:url},openGraph:{title:data.title+' | Ramayana Hotel Makassar',description,url,locale:'id_ID',images:[origin+(data.record?.image||'/media/IMG_20220107_155424.jpg')]},...['request-proposal','site-inspection','group-accommodation'].includes(data.page)?{robots:{index:false,follow:true}}:{}};
}
export default async function Page({params,searchParams}:Props){
 const path=(await params).path||[];
 if(path[0]==='bukber'&&path.length===1)redirect('/events/ramadan');
 const data=resolve(path);if(!data)notFound();
 const query=await searchParams,initial:Record<string,string>={};
 for(const key of ['venue','package','campaign','type','guests','layout','date','duration','intent','draft'])if(typeof query[key]==='string')initial[key]=query[key] as string;
 for(const [key,kind] of [['venue','venue'],['package','package'],['campaign','campaign']] as const){const match=data.records.find(r=>r.kind===kind&&(r.id===initial[key]||r.slug===initial[key]));if(match)initial[key]=match.id;}
 const origin=process.env.APP_URL||'http://localhost:3001';
 const crumbs=[{name:'Home',url:origin},{name:'Events',url:origin+'/events'},...path.length?[{name:data.title,url:origin+'/events/'+path.join('/')}]:[]];
 const hotel=settings();
 const schema:object[]=[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))}];
 if(data.record?.price){const r=data.record;schema.push({'@context':'https://schema.org','@type':'Offer',name:r.title,price:r.price!.amount,priceCurrency:'IDR',validFrom:r.price!.validFrom,validThrough:r.price!.validTo,url:origin+'/events/packages/'+r.slug,seller:{'@type':'Hotel',name:hotel.name,address:hotel.address}});}
 if(['seasonal','ramadan','new-years-eve'].includes(data.page)){for(const r of data.records.filter(r=>r.kind==='campaign'&&r.status!=='ended'&&r.eventStart&&r.eventEnd&&(data.page==='seasonal'||r.category===(data.page==='ramadan'?'ramadan':'new-year')))){schema.push({'@context':'https://schema.org','@type':'Event',name:r.title,description:r.description,startDate:r.eventStart,endDate:r.eventEnd,eventStatus:'https://schema.org/EventScheduled',image:origin+r.image,location:{'@type':'Place',name:hotel.name,address:hotel.address},organizer:{'@type':'Hotel',name:hotel.name,url:origin}});}}
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><EventsExperience records={data.records} record={data.record} page={data.page} initial={initial} settings={settings()}/></>;
}

