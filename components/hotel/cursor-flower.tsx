'use client';
import {useEffect, useRef} from 'react';

export function CursorFlower() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    let cleanup = () => {};
    function setup() {
      cleanup();
      const host = layer.current;
      if (!host || media.matches) return;
      let last = 0;
      let previousX = -100, previousY = -100;
      const particles = new Set<Animation>();
      function move(event: PointerEvent) {
        if (!host || event.pointerType !== 'mouse') return;
        if (event.timeStamp - last < 42 || Math.hypot(event.clientX - previousX, event.clientY - previousY) < 8) return;
        last = event.timeStamp; previousX = event.clientX; previousY = event.clientY;
        if (particles.size >= 28) return;
        const petal = document.createElement('span');
        petal.className = 'cursor-petal';
        petal.style.left = `${event.clientX}px`; petal.style.top = `${event.clientY}px`;
        const angle = Math.random() * 90;
        const size = 5 + Math.random() * 5;
        petal.style.width = `${size}px`; petal.style.height = `${size}px`;
        host.appendChild(petal);
        const animation = petal.animate([
          {opacity: 0, transform: `translate(-50%, -50%) rotate(${angle}deg) scale(.3)`},
          {opacity: .7, offset: .18},
          {opacity: 0, transform: `translate(${Math.random() * 38 - 19}px, ${-24 - Math.random() * 24}px) rotate(${angle + 65}deg) scale(.2)`}
        ], {duration: 950 + Math.random() * 300, easing: 'cubic-bezier(.16,.65,.3,1)', fill: 'forwards'});
        particles.add(animation);
        animation.onfinish = () => {petal.remove(); particles.delete(animation);};
      }
      window.addEventListener('pointermove', move, {passive: true});
      cleanup = () => {window.removeEventListener('pointermove', move); particles.forEach(animation => animation.cancel()); particles.clear(); host.replaceChildren();};
    }
    setup(); media.addEventListener('change', setup);
    return () => {cleanup(); media.removeEventListener('change', setup);};
  }, []);
  return <div ref={layer} className="cursor-flower-layer" aria-hidden="true"/>;
}
