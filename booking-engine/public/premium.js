import {installStudioMotion} from './studio-motion.js';
const main=document.querySelector('#main'),preference=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>preference.matches||localStorage.getItem('rhb-motion')==='reduce';
function sync(){document.documentElement.dataset.motion=reduced()?'reduce':'full';const btn=document.querySelector('#motion-toggle');if(btn){btn.setAttribute('aria-pressed',String(reduced()));btn.title=reduced()?'Aktifkan animasi':'Kurangi animasi';btn.setAttribute('aria-label',btn.title);}if(reduced())document.getAnimations().forEach(a=>a.cancel());}
document.querySelector('#motion-toggle')?.addEventListener('click',()=>{localStorage.setItem('rhb-motion',reduced()?'full':'reduce');sync();});
preference.addEventListener('change',sync);sync();
installStudioMotion(main);
const navToggle=document.querySelector('#nav-toggle'),navigation=document.querySelector('#booking-nav');
function closeNavigation(){navigation.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Buka menu');}
navToggle?.addEventListener('click',()=>{const open=navigation.classList.toggle('is-open');navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation.classList.contains('is-open')){closeNavigation();navToggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeNavigation();});
navigation?.addEventListener('click',e=>{if(e.target.closest('a'))closeNavigation();});
export function animateAmount(node){if(node&&!reduced())node.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}
export function animatePhoto(node){if(node&&!reduced())node.animate([{opacity:.4,transform:'scale(1.02)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'ease-out'});}

