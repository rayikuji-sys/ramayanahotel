'use client';
import {useEffect,type RefObject} from 'react';
/** Native scrolling drives paused media; never intercept wheel or touch gestures. */
export function useScrollFilm(sectionRef:RefObject<HTMLElement|null>,videoRef:RefObject<HTMLVideoElement|null>){
 useEffect(()=>{
  const section=sectionRef.current,video=videoRef.current;if(!section||!video)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,target=0,disposed=false;
  const seek=()=>{if(disposed||reduced.matches||!Number.isFinite(video.duration)||video.seeking)return;const time=Math.min(Math.max(0,video.duration-1/30),target*video.duration);if(Math.abs(video.currentTime-time)>.035)video.currentTime=time;};
  const render=()=>{frame=0;const rect=section.getBoundingClientRect();const stage=section.firstElementChild as HTMLElement;target=reduced.matches?0:Math.min(1,Math.max(0,-rect.top/Math.max(1,section.offsetHeight-stage.offsetHeight)));section.style.setProperty('--film-progress',String(target));section.dataset.scrubProgress=target.toFixed(3);seek();};
  const queue=()=>{if(!frame)frame=requestAnimationFrame(render);};
  const ready=()=>{video.pause();section.dataset.videoReady='true';queue();};
  video.addEventListener('loadeddata',ready);video.addEventListener('seeked',seek);window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);reduced.addEventListener('change',queue);
  if(video.readyState>=2)ready();queue();
  return()=>{disposed=true;cancelAnimationFrame(frame);video.removeEventListener('loadeddata',ready);video.removeEventListener('seeked',seek);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);};
 },[sectionRef,videoRef]);
}
