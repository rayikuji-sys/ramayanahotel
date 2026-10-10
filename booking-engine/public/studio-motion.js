/** Shared, progressive motion for the hotel collection and reservation workspace. */
export function installStudioMotion(root) {
  if (!root) return () => {};
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => media.matches || document.documentElement.dataset.motion === 'reduce';
  const cards = '.studio-reserve-card,.studio-hero-content,.rf-room-card,.rf-media-tile,.rf-feature,.rf-small-cards>.rf-card,.rf-info-tiles>.rf-card,.rf-place,.rf-contact>.rf-card,.ev-package-card,.rf-event-brief,.stay-room,.stay-welcome-copy,.stay-entry-search,.stay-collection-grid article,.ops-metric,.ops-panel,.panel,.summary,.voucher,.ref-addon';
  const surfaces = '.studio-reserve-card,.rf-room-card,.rf-feature,.rf-event-brief,.stay-room,.summary,.ops-panel';
  const tabs = new Set(), seen = new WeakSet(), animations = new Set();
  let frame = 0, pointerFrame = 0, pointerSurface = null, pointerEvent = null;
  function animate(element, keyframes, options) {
    if (reduced() || typeof element.animate !== 'function') return;
    const animation = element.animate(keyframes, options);
    animations.add(animation);
    animation.onfinish = animation.oncancel = () => animations.delete(animation);
  }
  const reveal = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(({target}, index) => {
      reveal.unobserve(target);
      if (seen.has(target)) return;
      seen.add(target);
      // A focused control must never wait behind an entrance animation.
      if (target.contains(document.activeElement)) return;
      animate(target, [{opacity: .15, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {duration: 560, delay: Math.min(index, 3) * 55, easing: 'cubic-bezier(.22,1,.36,1)'});
    });
  }, {threshold: .025});
  function positionTabs() {
    for (const row of tabs) {
      if (!row.isConnected) {resize.unobserve(row); tabs.delete(row); continue;}
      const active = row.querySelector(':scope > button[aria-pressed="true"]');
      if (!active) {row.classList.remove('studio-tabs-ready'); continue;}
      row.style.setProperty('--tab-x', active.offsetLeft + 'px');
      row.style.setProperty('--tab-y', active.offsetTop + 'px');
      row.style.setProperty('--tab-width', active.offsetWidth + 'px');
      row.style.setProperty('--tab-height', active.offsetHeight + 'px');
      row.classList.add('studio-tabs-ready');
    }
  }
  const resize = new ResizeObserver(() => schedule());
  function discover() {
    frame = 0;
    reveal.disconnect();
    root.querySelectorAll(cards).forEach(element => {
      // Avoid animating both a panel and all the cards inside it.
      if (!seen.has(element) && !element.parentElement?.closest(cards)) reveal.observe(element);
    });
    root.querySelectorAll('.rf-pills').forEach(row => {
      if (!tabs.has(row)) {tabs.add(row); resize.observe(row);}
    });
    positionTabs();
  }
  function schedule() {if (!frame) frame = requestAnimationFrame(discover);}
  const mutation = new MutationObserver(schedule);
  mutation.observe(root, {childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed']});
  function clearPointer() {
    cancelAnimationFrame(pointerFrame); pointerFrame = 0;
    pointerSurface?.removeAttribute('data-studio-light');
    pointerSurface?.style.removeProperty('--light-x'); pointerSurface?.style.removeProperty('--light-y');
    pointerSurface = null;
  }
  function move(event) {
    if (reduced() || !finePointer.matches || event.pointerType !== 'mouse') return;
    pointerEvent = event;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const surface = pointerEvent.target.closest(surfaces);
      if (surface !== pointerSurface) clearPointer();
      if (!surface || !root.contains(surface)) return;
      pointerSurface = surface;
      const rect = surface.getBoundingClientRect();
      surface.dataset.studioLight = '';
      surface.style.setProperty('--light-x', (pointerEvent.clientX - rect.left) + 'px');
      surface.style.setProperty('--light-y', (pointerEvent.clientY - rect.top) + 'px');
    });
  }
  function preferenceChanged() {
    if (reduced()) {animations.forEach(animation => animation.cancel()); clearPointer();}
  }
  const preferenceObserver = new MutationObserver(preferenceChanged);
  preferenceObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-motion']});
  root.classList.add('studio-motion-enabled');
  root.addEventListener('pointermove', move, {passive: true});
  root.addEventListener('pointerleave', clearPointer);
  media.addEventListener('change', preferenceChanged);
  finePointer.addEventListener('change', clearPointer);
  discover();
  return () => {
    cancelAnimationFrame(frame); clearPointer(); reveal.disconnect(); mutation.disconnect(); resize.disconnect(); preferenceObserver.disconnect();
    animations.forEach(animation => animation.cancel());
    root.classList.remove('studio-motion-enabled');
    root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', clearPointer);
    media.removeEventListener('change', preferenceChanged); finePointer.removeEventListener('change', clearPointer);
    tabs.forEach(row => {row.classList.remove('studio-tabs-ready'); ['--tab-x','--tab-y','--tab-width','--tab-height'].forEach(key => row.style.removeProperty(key));});
  };
}
