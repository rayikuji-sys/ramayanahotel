'use client';
import {useState} from 'react';
import Image from 'next/image';
import {ArrowLeft,ArrowRight,Download,Expand,ZoomIn,ZoomOut} from 'lucide-react';
import {packageArtwork,packageCover} from '@/lib/package-artwork';
import {Dialog} from './dialog';
import {LocalizedText as T} from './language-provider';

export function PackageArtwork({slug,title,variant='card'}:{slug:string;title:string;variant?:'card'|'hero'|'detail'}){
 const pages=packageArtwork(slug),cover=packageCover(slug);
 const [active,setActive]=useState<number|null>(null),[zoom,setZoom]=useState(false);
 if(!cover||!pages.length)return null;
 const change=(n:number)=>{setActive((n+pages.length)%pages.length);setZoom(false);};
 return <div className={`package-artwork package-artwork-${variant}`}>
  {variant==='detail'?<><div className="brochure-heading"><div><p className="eyebrow"><T>BROSUR PAKET</T></p><h2><T>Lihat setiap detailnya.</T></h2><p><T>Jelajahi desain paket, fasilitas, dan pilihan acara dalam brosur hotel.</T></p></div><span>{String(pages.length).padStart(2,'0')} / <T>DESAIN</T></span></div><div className="brochure-pages">{pages.map((page,i)=><button key={page.id} onClick={()=>change(i)} aria-label={`Buka brosur ${page.title}`}><Image src={page.src} alt={page.title} width={page.width} height={page.height} sizes="(max-width:760px) 90vw, 600px"/><span><T>{page.title}</T><Expand size={18}/></span></button>)}</div><p className="brochure-note"><T>{cover.caption}</T></p></>:<button className="package-cover" onClick={()=>change(0)} aria-label={`Buka brosur ${title}`}><Image src={cover.src} alt={`Desain paket ${title}`} width={cover.width} height={cover.height} sizes={variant==='hero'?'(max-width:760px) 90vw, 650px':'(max-width:760px) 90vw, 550px'}/><span className="package-cover-action"><Expand size={16}/><T>Lihat brosur</T></span></button>}
  {active!==null&&<Dialog title={`Brosur ${title}`} onClose={()=>{setActive(null);setZoom(false);}} wide><div className="brochure-viewer" onKeyDown={e=>{if(e.key==='ArrowRight'&&!zoom){e.preventDefault();change(active+1);}if(e.key==='ArrowLeft'&&!zoom){e.preventDefault();change(active-1);}}}><p className="eyebrow"><T>BROSUR PAKET</T></p><h2><T>{pages[active].title}</T></h2><div className="brochure-tools"><button onClick={()=>setZoom(!zoom)} aria-pressed={zoom}>{zoom?<ZoomOut size={17}/>:<ZoomIn size={17}/>}<T>{zoom?'Perkecil':'Perbesar'}</T></button><a href={pages[active].original} download><Download size={17}/><T>Unduh brosur</T></a><span>{active+1} / {pages.length}</span></div><div className={`brochure-scroll ${zoom?'is-zoomed':''}`} tabIndex={0} aria-label="Gambar brosur, gulir untuk membaca"><Image src={pages[active].original} width={pages[active].width} height={pages[active].height} alt={pages[active].title} unoptimized/></div>{pages.length>1&&<div className="brochure-pagination"><button onClick={()=>change(active-1)} aria-label="Brosur sebelumnya"><ArrowLeft size={18}/></button>{pages.map((p,i)=><button key={p.id} aria-pressed={i===active} onClick={()=>change(i)}>{i+1}</button>)}<button onClick={()=>change(active+1)} aria-label="Brosur berikutnya"><ArrowRight size={18}/></button></div>}<p className="brochure-note"><T>{pages[active].caption}</T></p></div></Dialog>}
 </div>;
}
