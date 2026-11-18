import { frame, cancelFrame } from 'framer-motion';

const clamp = (value) => Math.max(0, Math.min(1, value));
export const galleryScrollSpring = { stiffness: 80, damping: 30, restDelta: .0001 };
export const galleryPointerSpring = { stiffness: 60, damping: 25, mass: .5 };

export function galleryProgress(scroll, top, height, viewportHeight) {
  const distance = height - viewportHeight * .7;
  return distance > 0 ? clamp((scroll - top + viewportHeight * .3) / distance) : 0;
}

export function galleryPose(progress, index, total, { width, height }, pointerX = 0, pointerY = 0) {
  const mobile = width < 768;
  const phase = clamp((.14 + progress * .88 - index / total * .45) / .55);
  const z = (mobile ? -1200 : -1700) + phase * (mobile ? 1550 : 2200);
  const opacity = Math.min(clamp(phase / .18), clamp((.98 - phase) / .16));
  const angle = index * 137.5 * Math.PI / 180;
  const pointerDistance = mobile ? 20 : 45;
  const x = Math.cos(angle) * width * (.28 + index % 3 * .08) - pointerX * pointerDistance;
  const y = Math.sin(angle) * height * (.26 + index % 2 * .09) - pointerY * pointerDistance;
  const rotation = (index % 2 === 0 ? 1 : -1) * (3 + index % 5 * 2);
  return { z, opacity, rotation, pointerEvents: phase > .06 && phase < .86 ? 'auto' : 'none',
    transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateZ(${rotation}deg)` };
}

export function attachGallery({ root, scroll, progress, viewport, pointerX, pointerY, settle, stop },
  { frameLoop = frame, cancel = cancelFrame } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let attached = true;
  let geometry;
  let nearby = false;

  function update() {
    if (!attached || !geometry || document.visibilityState === 'hidden' || reducedMotion.matches) return;
    progress.set(galleryProgress(scroll.get(), geometry.top, geometry.height, geometry.viewportHeight));
  }

  function measure() {
    if (!attached || reducedMotion.matches || document.visibilityState === 'hidden') return;
    root.dataset.galleryEnhanced = 'true';
    const box = root.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (![box.top, box.height, width, height].every(Number.isFinite) || box.height <= height || width <= 0 || height <= 0) {
      delete root.dataset.galleryEnhanced;
      geometry = undefined;
      stop();
      return;
    }
    geometry = { top: box.top + window.scrollY, height: box.height, viewportHeight: height };
    viewport.set({ width, height });
    update();
    settle();
  }

  function scheduleMeasure() { if (attached) frameLoop.read(measure); }
  function scheduleUpdate() { if (attached) frameLoop.update(update); }

  function synchronize() {
    cancel(measure);
    cancel(update);
    stop();
    if (reducedMotion.matches) {
      delete root.dataset.galleryEnhanced;
      geometry = undefined;
      pointerX.set(0);
      pointerY.set(0);
      settle();
    } else if (document.visibilityState !== 'hidden') scheduleMeasure();
  }

  function pointerMove(event) {
    if (!nearby || !geometry || reducedMotion.matches || !finePointer.matches
      || document.visibilityState === 'hidden' || event.pointerType !== 'mouse') return;
    pointerX.set(2 * (event.clientX / window.innerWidth - .5));
    pointerY.set(2 * (event.clientY / window.innerHeight - .5));
  }

  const unsubscribe = scroll.on('change', scheduleUpdate);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleMeasure) : undefined;
  observer?.observe(root);
  // Earlier sticky runways can move the gallery without changing its own height.
  if (root.parentElement) observer?.observe(root.parentElement);
  const intersection = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
    if (attached) {
      nearby = entries.some((entry) => entry.isIntersecting);
      root.dataset.galleryNearby = String(nearby);
    }
  }, { rootMargin: '250px' }) : undefined;
  intersection?.observe(root);
  if (!intersection) { nearby = true; root.dataset.galleryNearby = 'true'; }
  window.addEventListener('resize', scheduleMeasure, { passive: true });
  window.addEventListener('pageshow', scheduleMeasure);
  window.addEventListener('pointermove', pointerMove, { passive: true });
  document.addEventListener('visibilitychange', synchronize);
  reducedMotion.addEventListener('change', synchronize);
  finePointer.addEventListener('change', synchronize);
  synchronize();

  return () => {
    attached = false;
    unsubscribe();
    cancel(measure);
    cancel(update);
    observer?.disconnect();
    intersection?.disconnect();
    window.removeEventListener('resize', scheduleMeasure);
    window.removeEventListener('pageshow', scheduleMeasure);
    window.removeEventListener('pointermove', pointerMove);
    document.removeEventListener('visibilitychange', synchronize);
    reducedMotion.removeEventListener('change', synchronize);
    finePointer.removeEventListener('change', synchronize);
    stop();
    delete root.dataset.galleryEnhanced;
    delete root.dataset.galleryNearby;
  };
}
