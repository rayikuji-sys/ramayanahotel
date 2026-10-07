'use client';
import {useEffect,type RefObject,type Dispatch,type SetStateAction} from 'react';
export function useScrollCarousel(host:RefObject<HTMLElement|null>,count:number,setIndex:Dispatch<SetStateAction<number>>){
 useEffect(()=>{
  const element=host.current;if(!element||count<2)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');const roomy=matchMedia('(min-width:1100px) and (min-height:780px)');let frame=0,last=-1;
  const render=()=>{frame=0;const enabled=roomy.matches&&!reduced.matches;element.dataset.scrollCarousel=String(enabled);const rect=element.getBoundingClientRect();const progress=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height-innerHeight)));element.style.setProperty('--carousel-progress',String(progress));if(!enabled){last=-1;return;}const segment=Math.min(count-1,Math.floor(progress*count));if(rect.top<=0&&rect.bottom>=innerHeight&&segment!==last){last=segment;setIndex(segment);}};
  const queue=()=>{if(!frame)frame=requestAnimationFrame(render);};
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);reduced.addEventListener('change',queue);queue();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);delete element.dataset.scrollCarousel;};
 },[host,count,setIndex]);
}
