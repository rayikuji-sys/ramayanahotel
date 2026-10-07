'use client';
import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';

const clamp = (value:number) => Math.min(1, Math.max(0, value));

export function MotionEffects() {
  const pathname = usePathname();
  const chapterLabel = useRef<HTMLSpanElement>(null);
  const chapterMeter = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const meter = chapterMeter.current;
    const label = chapterLabel.current;
    let cleanup = () => {};

    function setup() {
      cleanup();
      if (media.matches) return;
      const main = document.querySelector('main');
      if (!main) return;
      const targets = new Set<HTMLElement>();
      const photos = new Set<HTMLElement>();
      const visiblePhotos = new Set<HTMLElement>();
      const tilts = new Set<HTMLElement>();
      let frame = 0, discoveryFrame = 0;
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('motion-visible');
          reveal.unobserve(entry.target);
        });
      }, {threshold: .06, rootMargin: '0px 0px -24px'});
      const photoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) visiblePhotos.add(element);
          else visiblePhotos.delete(element);
        });
        schedule();
      }, {rootMargin: '80px'});

      function move(event:PointerEvent) {
        if (event.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
        const element = event.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        element.style.setProperty('--tilt-x', `${(y - .5) * -3}deg`);
        element.style.setProperty('--tilt-y', `${(x - .5) * 3}deg`);
        element.style.setProperty('--glow-x', `${x * 100}%`);
        element.style.setProperty('--glow-y', `${y * 100}%`);
      }
      function leave(event:PointerEvent) {
        const element = event.currentTarget as HTMLElement;
        element.style.removeProperty('--tilt-x'); element.style.removeProperty('--tilt-y');
      }
      function addReveal(element:HTMLElement, kind='rise', index=0) {
        if (targets.has(element)) return;
        targets.add(element); element.dataset.motion = kind;
        element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 75}ms`);
        // Keep the initial viewport and restored browser positions readable immediately.
        if (element.getBoundingClientRect().top < innerHeight - 24) element.classList.add('motion-visible');
        else reveal.observe(element);
      }
      function discover() {
        discoveryFrame = 0;
        main!.querySelectorAll<HTMLElement>('[data-reveal]').forEach(section => {
          if (section.classList.contains('facility-section')) return;
          const children = section.querySelectorAll<HTMLElement>('.section-heading > *, .dining-copy, .dining-visual, .journey article, .explore-grid, .event-picker, .event-builder');
          if (children.length) children.forEach((child,i) => addReveal(child, child.classList.contains('dining-visual') ? 'image' : 'rise', i % 3));
          else if (section.classList.contains('final-cta') && section.lastElementChild instanceof HTMLElement) addReveal(section.lastElementChild);
          else addReveal(section);
        });
        main!.querySelectorAll<HTMLElement>('[data-reveal-item], .page-intro > *, .info-item, .detail-rows article').forEach((element,i) => addReveal(element, element.dataset.revealItem || 'rise', i % 3));
        main!.querySelectorAll<HTMLElement>('[data-parallax], .dining-visual, .final-photo').forEach(element => {
          if (photos.has(element)) return;
          photos.add(element); photoObserver.observe(element);
        });
        main!.querySelectorAll<HTMLElement>('[data-depth], .dining-visual, .event-visual').forEach(element => {
          if (tilts.has(element)) return;
          tilts.add(element); element.dataset.tilt = '';
          element.addEventListener('pointermove', move, {passive:true}); element.addEventListener('pointerleave', leave);
        });
        // Filters replace cards; release the detached nodes and their listeners.
        targets.forEach(element => {if (!element.isConnected) {reveal.unobserve(element); targets.delete(element);}});
        photos.forEach(element => {if (!element.isConnected) {photoObserver.unobserve(element); photos.delete(element); visiblePhotos.delete(element);}});
        tilts.forEach(element => {if (!element.isConnected) {element.removeEventListener('pointermove',move); element.removeEventListener('pointerleave',leave); tilts.delete(element);}});
        schedule();
      }
      const scenes = Array.from(main.querySelectorAll<HTMLElement>(':scope > section[id], [data-scroll-scene]'));
      const labels:Record<string,string> = {arrival:'01 / The arrival',rooms:'02 / Your room',facilities:'03 / The little moments',dining:'04 / At the table',services:'05 / Your stay',nearby:'06 / Around Makassar',events:'07 / Together'};
      function render() {
        frame = 0;
        const pageProgress = clamp(scrollY / Math.max(1, root.scrollHeight - innerHeight));
        root.style.setProperty('--page-progress', String(pageProgress));
        document.querySelector('.site-header')?.classList.toggle('scrolled', scrollY > 36);
        visiblePhotos.forEach(element => {
          const rect = element.getBoundingClientRect();
          const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
          const distance = innerWidth < 761 ? 14 : Number(element.dataset.parallax || 36);
          element.style.setProperty('--image-drift', `${((progress - .5) * distance).toFixed(2)}px`);
        });
        let active:HTMLElement | undefined;
        scenes.forEach(scene => {
          const rect = scene.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > innerHeight) return;
          scene.style.setProperty('--scene-progress', clamp((innerHeight - rect.top) / (innerHeight + rect.height)).toFixed(3));
          if (rect.top < innerHeight * .55 && rect.bottom > innerHeight * .4) active = scene;
        });
        if (meter) {meter.dataset.visible = String(!!active && active.id !== 'arrival'); meter.style.setProperty('--chapter-progress', String(pageProgress));}
        if (active && label && labels[active.id]) label.textContent = labels[active.id];
      }
      function schedule() {if (!frame) frame = requestAnimationFrame(render);}
      const mutation = new MutationObserver(records => {
        if (records.some(record => Array.from(record.addedNodes).some(node => node instanceof HTMLElement)) && !discoveryFrame) discoveryFrame = requestAnimationFrame(discover);
      });
      const focus = (event:FocusEvent) => {
        const element = event.target instanceof Element ? event.target.closest('[data-motion]') : null;
        element?.classList.add('motion-visible');
      };
      root.classList.add('motion-ready'); discover();
      mutation.observe(main, {childList:true, subtree:true});
      window.addEventListener('scroll', schedule, {passive:true}); window.addEventListener('resize', schedule); main.addEventListener('focusin', focus);
      cleanup = () => {
        reveal.disconnect(); photoObserver.disconnect(); mutation.disconnect();
        cancelAnimationFrame(frame); cancelAnimationFrame(discoveryFrame);
        window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule); main.removeEventListener('focusin',focus);
        root.classList.remove('motion-ready'); root.style.removeProperty('--page-progress');
        targets.forEach(element => {delete element.dataset.motion; element.classList.remove('motion-visible'); element.style.removeProperty('--reveal-delay');});
        photos.forEach(element => element.style.removeProperty('--image-drift'));
        scenes.forEach(element => element.style.removeProperty('--scene-progress'));
        tilts.forEach(element => {delete element.dataset.tilt; element.removeEventListener('pointermove',move); element.removeEventListener('pointerleave',leave); ['--tilt-x','--tilt-y','--glow-x','--glow-y'].forEach(key => element.style.removeProperty(key));});
        if (meter) meter.dataset.visible = 'false';
      };
    }
    setup(); media.addEventListener('change',setup);
    return () => {cleanup(); media.removeEventListener('change',setup);};
  }, [pathname]);

  return <div className="page-progress" aria-hidden="true"/>;
}
