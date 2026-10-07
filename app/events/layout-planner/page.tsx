import type {Metadata} from 'next';
import Link from 'next/link';
import {PlannerEntry} from '@/components/hotel/planner-entry';
export const metadata:Metadata={title:'Atur Layout Acara Anda',robots:{index:false,follow:true}};
export default async function Page({searchParams}:{searchParams:Promise<{room?:string}>}){const {room}=await searchParams;return <main id='main' lang='id' className='lp-page'><header className='lp-intro'><Link href='/events'>Events / Planning studio</Link><p className='eyebrow'>MADE FOR YOUR OCCASION</p><h1>Atur layout<br/><em>acara Anda.</em></h1><p>Visualisasikan susunan meja dan kursi sesuai kebutuhan acara Anda sebelum mengirim proposal.</p></header><PlannerEntry room={room}/></main>;}
