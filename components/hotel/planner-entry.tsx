'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {Component,useEffect,useState,type ReactNode} from 'react';
import type {PlannerData,SavedLayout} from '@/lib/planner-model';
const Builder=dynamic(()=>import('./room-layout-builder'),{ssr:false,loading:()=> <p role='status'><T>Menyiapkan ruang perencanaan…</T></p>});
class PlannerBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<p role='alert'><T>Interactive layout is temporarily unavailable. Anda tetap dapat memilih susunan standar atau meminta rekomendasi tim Event Sales.</T></p>:this.props.children;}}
export function PlannerEntry({room,guests,layout,onSave}:{room?:string;guests?:number;layout?:SavedLayout;onSave?:(layout:SavedLayout)=>void}){
 const [data,setData]=useState<PlannerData|null>(null),[error,setError]=useState(false),[saved,setSaved]=useState<SavedLayout|null>(null);
 useEffect(()=>{const controller=new AbortController();fetch('/api/events/planner',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setData).catch(e=>{if(e.name!=='AbortError')setError(true);});return()=>controller.abort();},[]);
 return <PlannerBoundary>{error?<p role='alert'><T>Layout interaktif belum tersedia. Anda tetap dapat </T><Link href='/events/request-proposal'><T>meminta proposal dengan rekomendasi hotel</T></Link><T>.</T></p>:data?<Builder initialGuests={guests} data={data} initialRoom={room} initialLayout={layout} onSave={value=>{setSaved(value);onSave?.(value);}}/>:<p role='status'><T>Memuat venue & furniture hotel…</T></p>}{saved&&!onSave&&<div className='lp-continue'><p><T>Layout tersimpan pada perangkat ini.</T></p><Link className='button' href={'/events/request-proposal?venue='+encodeURIComponent(saved.roomId)+'&draft=1'}><T>Lampirkan ke proposal →</T></Link></div>}</PlannerBoundary>;
}
