import { frame, cancelFrame } from 'framer-motion';
import { createCareerRoute, createCareerVerticalRoute } from './careerRoute.js';

const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);
const properties = ['--career-pin-top', '--career-runway', '--career-end-space'];

export function attachCareerTimeline({ root, runway, stage, viewport, track, items, scroll, motion }, { frameLoop = frame, cancel = cancelFrame } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 961px) and (hover: hover) and (pointer: fine)');
  let attached = true;
  let pendingFrame;
  let version = 0;
  let dirty = true;
  let geometry;
  let previousScroll;
  let activeIndex = -1;
  let keyboardFlow = false;
  let failedWidth;
  let direction = 1;
  let previousReadingPoint;

  function clearActive() {
    items.forEach((item) => delete item.dataset.current);
    activeIndex = -1;
  }

  function reset() {
    root.dataset.timelineMode = 'flow';
    properties.forEach((property) => root.style.removeProperty(property));
    motion.x.set(0);
    motion.focus.forEach((value) => value.set(0));
    motion.chapter.set(0);
    motion.route.set(null);
    direction = 1;
    previousReadingPoint = undefined;
    clearActive();
    geometry = undefined;
    previousScroll = undefined;
  }

  function allowed() {
    return (desktop.matches || window.innerWidth <= 960) && !reducedMotion.matches && !keyboardFlow;
  }

  function measureVertical() {
    root.dataset.timelineMode = 'vertical';
    properties.slice(0, 2).forEach((property) => root.style.removeProperty(property));
    motion.x.set(0);
    const rail = track.getBoundingClientRect();
    const origin = rail.top + window.scrollY;
    const centers = items.map((item) => {
      const box = item.querySelector('.career-node')?.getBoundingClientRect();
      return box ? box.top + box.height / 2 - rail.top : NaN;
    });
    if (!Number.isFinite(origin) || !Number.isFinite(rail.height) || rail.height <= 0
      || !centers.length || !centers.every((center, index) => Number.isFinite(center)
        && (index === 0 || center > centers[index - 1]))) return undefined;
    const endSpace = Math.max(window.innerWidth <= 680 ? 72 : 104,
      window.innerHeight / 2 - (rail.height - centers.at(-1)) + 24);
    root.style.setProperty('--career-end-space', `${endSpace.toFixed(3)}px`);
    const radii = centers.map((center, index) => Math.min(window.innerHeight * .3,
      (index > 0 ? center - centers[index - 1] : Infinity) * .85,
      (index < centers.length - 1 ? centers[index + 1] - center : Infinity) * .85));
    const experienceIndex = items.findIndex((item) => item.dataset.chapter === 'experience');
    const chapterBoundary = experienceIndex > 0 ? (centers[experienceIndex - 1] + centers[experienceIndex]) / 2 : 0;
    const chapterRadius = experienceIndex > 0 ? (centers[experienceIndex] - centers[experienceIndex - 1]) / 4 : 1;
    return { mode: 'vertical', origin, centers, radii, trackHeight: rail.height,
      readingAxis: window.innerHeight / 2, experienceIndex, chapterBoundary, chapterRadius };
  }

  function measure() {
    const layoutWidth = window.innerWidth;
    if (!allowed()) return undefined;
    if (layoutWidth <= 960) return measureVertical();
    if (failedWidth === layoutWidth) return undefined;
    root.dataset.timelineMode = 'horizontal';
    const width = viewport.clientWidth;
    const scene = stage.getBoundingClientRect();
    const rail = track.getBoundingClientRect();
    const origin = runway.getBoundingClientRect().top + window.scrollY;
    const centers = items.map((item) => {
      const box = item.querySelector('.career-node')?.getBoundingClientRect();
      if (!box) return NaN;
      return box.left + box.width / 2 - rail.left;
    });
    const distance = centers.at(-1) - centers[0];
    if (![width, scene.height, distance, rail.width].every((value) => Number.isFinite(value) && value > 0)
      || !Number.isFinite(origin) || track.scrollWidth <= width
      || !centers.every((center, index) => Number.isFinite(center) && (index === 0 || center > centers[index - 1]))
      || scene.height > window.innerHeight - 112 - 24) {
      // The flow layout resizes these same observers; retry only after a real layout change.
      failedWidth = layoutWidth;
      return undefined;
    }
    failedWidth = undefined;
    const pinTop = Math.max(112, (window.innerHeight - scene.height) / 2);
    root.style.setProperty('--career-pin-top', `${pinTop.toFixed(3)}px`);
    root.style.setProperty('--career-runway', `${distance.toFixed(3)}px`);
    // The final node must reach the reading axis even when Journey ends the page.
    root.style.setProperty('--career-end-space', `${Math.max(104, window.innerHeight - scene.height - pinTop + 24).toFixed(3)}px`);
    const radii = centers.map((center, index) => Math.min(
      index > 0 ? center - centers[index - 1] : Infinity,
      index < centers.length - 1 ? centers[index + 1] - center : Infinity,
    ) * .9);
    const experienceIndex = items.findIndex((item) => item.dataset.chapter === 'experience');
    const chapterBoundary = experienceIndex > 0 ? (centers[experienceIndex - 1] + centers[experienceIndex]) / 2 : 0;
    const chapterRadius = experienceIndex > 0 ? (centers[experienceIndex] - centers[experienceIndex - 1]) / 4 : 1;
    return { mode: 'horizontal', start: Math.max(0, origin - pinTop), startX: width / 2 - centers[0],
      distance, centers, radii, width, trackWidth: rail.width, experienceIndex, chapterBoundary, chapterRadius };
  }

  function render() {
    pendingFrame = undefined;
    if (!attached || document.visibilityState === 'hidden' || !allowed()) return;
    if (dirty) {
      geometry = measure();
      dirty = false;
      previousScroll = undefined;
      previousReadingPoint = undefined;
      if (!geometry) {
        reset();
        return;
      }
    }
    const position = scroll.get();
    if (!geometry || position === previousScroll) return;
    const vertical = geometry.mode === 'vertical';
    const progress = vertical ? 0 : clamp((position - geometry.start) / geometry.distance);
    const x = vertical ? 0 : geometry.startX - geometry.distance * progress;
    motion.x.set(Number(x.toFixed(3)));
    const { centers, radii, width, experienceIndex, chapterBoundary, chapterRadius } = geometry;
    const readingPoint = vertical ? position + geometry.readingAxis - geometry.origin : width / 2 - x;
    if (previousScroll !== undefined && position !== previousScroll) direction = Math.sign(position - previousScroll);
    if (readingPoint !== previousReadingPoint) {
      motion.route.set(vertical
        ? createCareerVerticalRoute(centers, geometry.trackHeight, readingPoint, direction)
        : createCareerRoute(centers, width, readingPoint, direction, geometry.trackWidth));
      previousReadingPoint = readingPoint;
    }
    centers.forEach((center, index) => {
      const influence = clamp(1 - Math.abs(center - readingPoint) / radii[index]);
      motion.focus[index].set(Number(smoothstep(influence).toFixed(6)));
    });
    const chapter = experienceIndex > 0
      ? smoothstep(clamp((readingPoint - chapterBoundary + chapterRadius) / (chapterRadius * 2)))
      : Number(experienceIndex === 0);
    motion.chapter.set(Number(chapter.toFixed(6)));
    const nextIndex = centers.reduce((closest, center, index) =>
      Math.abs(center - readingPoint) < Math.abs(centers[closest] - readingPoint) ? index : closest, 0);
    if (nextIndex !== activeIndex) {
      if (activeIndex >= 0) delete items[activeIndex].dataset.current;
      items[nextIndex].dataset.current = 'true';
      activeIndex = nextIndex;
    }
    previousScroll = position;
  }

  function schedule() {
    if (!attached || pendingFrame || !allowed() || document.visibilityState === 'hidden') return;
    const currentVersion = ++version;
    pendingFrame = () => {
      if (attached && currentVersion === version) render();
    };
    frameLoop.update(pendingFrame);
  }

  function cancelScheduled() {
    if (pendingFrame) cancel(pendingFrame);
    pendingFrame = undefined;
    version++;
  }

  function invalidate() {
    if (!attached) return;
    dirty = true;
    schedule();
  }

  function layoutChanged() {
    if (!attached) return;
    failedWidth = undefined;
    invalidate();
  }

  function modeChanged() {
    if (!attached) return;
    if (allowed()) layoutChanged();
    else {
      cancelScheduled();
      reset();
      dirty = true;
    }
  }

  function visibilityChanged() {
    if (document.visibilityState === 'hidden') cancelScheduled();
    else layoutChanged();
  }

  function focusChanged(event) {
    const target = event.target;
    if (!attached || keyboardFlow || !(root.matches(':focus-visible') || target?.matches?.(':focus-visible'))) return;
    // Keep keyboard reading in flow so leaving the section cannot add a runway below focus.
    keyboardFlow = true;
    cancelScheduled();
    reset();
    if (target !== root && target?.getBoundingClientRect) {
      const box = target.getBoundingClientRect();
      if (box.top < 112 || box.bottom > window.innerHeight - 24) {
        target.scrollIntoView?.({ block: 'nearest', behavior: 'instant' });
      }
    }
  }

  reset();
  const observer = window.ResizeObserver ? new window.ResizeObserver(invalidate) : null;
  const page = root.closest('main');
  new Set([root, runway, stage, viewport, track, page].filter(Boolean)).forEach((element) => observer?.observe(element));
  const unsubscribeScroll = scroll.on('change', () => {
    if (dirty || scroll.get() !== previousScroll) schedule();
  });
  root.addEventListener('focusin', focusChanged);
  window.addEventListener('resize', layoutChanged, { passive: true });
  window.addEventListener('pageshow', layoutChanged);
  window.visualViewport?.addEventListener('resize', layoutChanged, { passive: true });
  document.addEventListener('visibilitychange', visibilityChanged);
  reducedMotion.addEventListener('change', modeChanged);
  desktop.addEventListener('change', modeChanged);
  document.fonts?.ready.then(layoutChanged);
  schedule();

  return () => {
    attached = false;
    cancelScheduled();
    observer?.disconnect();
    unsubscribeScroll();
    root.removeEventListener('focusin', focusChanged);
    window.removeEventListener('resize', layoutChanged);
    window.removeEventListener('pageshow', layoutChanged);
    window.visualViewport?.removeEventListener('resize', layoutChanged);
    document.removeEventListener('visibilitychange', visibilityChanged);
    reducedMotion.removeEventListener('change', modeChanged);
    desktop.removeEventListener('change', modeChanged);
    reset();
    delete root.dataset.timelineMode;
  };
}
