'use client';

import {useEffect, useRef} from 'react';
import {flushSync} from 'react-dom';
import {usePathname} from 'next/navigation';
import {installStudioMotion} from '../../booking-engine/public/studio-motion.js';

export function StudioMotion() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/admin')) return;
    const root = document.querySelector('main');
    if (root) return installStudioMotion(root);
  }, [pathname]);
  return null;
}

/** Animate actual keyed positions after a filter/sort, keeping React state and focus intact. */
export function useCollectionMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {animations.current.forEach(animation => animation.cancel()); animations.current = [];};
    media.addEventListener('change', stop);
    return () => {stop(); media.removeEventListener('change', stop);};
  }, []);
  function change(update: () => void) {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    const elements = () => Array.from(ref.current?.querySelectorAll<HTMLElement>(':scope > [data-studio-key]') || []);
    const previous = new Map(elements().map(element => [element.dataset.studioKey, element.getBoundingClientRect()]));
    flushSync(update);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elements().forEach(element => {
      const before = previous.get(element.dataset.studioKey), after = element.getBoundingClientRect();
      if (!before || after.bottom < 0 || after.top > innerHeight) return;
      const dx = before.left - after.left, dy = before.top - after.top;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      animations.current.push(element.animate([
        {transform: `translate(${dx}px,${dy}px)`, opacity: before ? 1 : .15},
        {transform: 'translate(0,0)', opacity: 1}
      ], {duration: 420, easing: 'cubic-bezier(.22,1,.36,1)'}));
    });
  }
  return {ref, change};
}
