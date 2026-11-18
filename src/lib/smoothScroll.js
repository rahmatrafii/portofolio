import Lenis from 'lenis';
import { cancelFrame, frame } from 'framer-motion';

const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab', 'Escape']);
const easeInOutCubic = (t) => t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

export function attachSmoothScroll(scroll, { LenisClass = Lenis, frameLoop = frame, cancel = cancelFrame, navigation = {} } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let attached = true;
  let lenis;
  let tick;
  let unsubscribe;
  let pendingNavigation;
  let navigationFocus;

  function cancelNavigation() {
    if (pendingNavigation) cancel(pendingNavigation.focusFrame);
    pendingNavigation = undefined;
  }

  function interruptNavigation() {
    if (!pendingNavigation) return;
    cancelNavigation();
    releaseInertia();
  }

  function pointerInput(event) {
    if (event.type === 'pointerdown' && event.button === 0 && event.target?.closest?.('.about-download')) {
      // Hold the visible link in place between pointerdown and its native download click.
      cancelNavigation();
      releaseInertia();
    } else interruptNavigation();
    releaseNavigationFocus();
  }

  function releaseNavigationFocus() {
    // Only release focus we placed on a section; keyboard/child focus keeps its accessibility guard.
    if (navigationFocus === document.activeElement) navigationFocus?.blur();
    navigationFocus = undefined;
  }

  function focusInput(event) {
    interruptNavigation();
    if (event.target !== navigationFocus) navigationFocus = undefined;
  }

  function publish() {
    if (attached && document.visibilityState !== 'hidden') scroll.set(window.scrollY);
  }

  function release() {
    cancelNavigation();
    if (tick) cancel(tick);
    cancel(resize);
    unsubscribe?.();
    lenis?.destroy();
    lenis = tick = unsubscribe = undefined;
  }

  function synchronize() {
    if (!attached) return;
    release();
    publish();
    if (reducedMotion.matches || document.visibilityState === 'hidden') return;
    const instance = new LenisClass({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: .18,
      anchors: false,
    });
    lenis = instance;
    unsubscribe = instance.on('scroll', publish);
    tick = ({ timestamp }) => {
      if (!attached || instance !== lenis || document.visibilityState === 'hidden') return;
      instance.raf(timestamp);
      // Use the position the browser painted, not Lenis's destination or fractional target.
      publish();
    };
    frameLoop.read(tick, true);
  }

  function resize() {
    if (!attached) return;
    interruptNavigation();
    lenis?.resize();
    publish();
  }

  function navigate(event) {
    if (!lenis || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target?.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const hash = link.getAttribute('href');
    if (!hash?.startsWith('#') || hash.length < 2) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    interruptNavigation();
    // Keep focus at the activated link while the photo is traveling, including on touch browsers.
    link.focus({ preventScroll: true });
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    let destination = id === 'home' ? 0 : target;
    const about = navigation.about;
    if (id === 'about' && about && [about.end, about.arrival].every(Number.isFinite)) {
      const padding = parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const anchor = target.getBoundingClientRect().top + window.scrollY - padding - margin;
      destination = about.pinned ? about.end : Math.max(about.arrival, anchor);
    }
    const request = { instance: lenis };
    request.focusFrame = () => {
      if (!attached || pendingNavigation !== request || request.instance !== lenis) return;
      pendingNavigation = undefined;
      navigationFocus = target;
      target.focus({ preventScroll: true });
    };
    pendingNavigation = request;
    lenis.scrollTo(destination, {
      duration: .9,
      easing: easeInOutCubic,
      lock: false,
      onComplete() {
        // Lenis completes in read; let the final portrait update/render finish before the focus handoff.
        if (pendingNavigation === request) frameLoop.postRender(request.focusFrame);
      },
    });
  }

  function keyboard(event) {
    if (!lenis || event.defaultPrevented || !navigationKeys.has(event.key)) return;
    if (event.key !== 'Tab' && event.target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    // Release wheel inertia before the browser performs native keyboard or focus scrolling.
    cancelNavigation();
    navigationFocus = undefined;
    releaseInertia();
  }

  function releaseInertia() {
    lenis?.stop();
    lenis?.start();
    publish();
  }

  function restoreHistory() {
    cancelNavigation();
    releaseNavigationFocus();
    releaseInertia();
    // Browser restoration runs after popstate; align Lenis's next wheel target on the next read.
    frameLoop.read(resize);
  }

  const controls = {
    pause() { releaseInertia(); release(); },
    resume: synchronize,
    restore(position) {
      cancelNavigation();
      lenis?.resize();
      if (lenis) lenis.scrollTo(position, { immediate: true });
      else window.scrollTo({ top: position, behavior: 'instant' });
      publish();
    },
  };
  Object.assign(navigation, controls);

  window.addEventListener('scroll', publish, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pageshow', synchronize);
  window.addEventListener('popstate', restoreHistory);
  window.addEventListener('keydown', keyboard);
  window.addEventListener('wheel', pointerInput, { passive: true, capture: true });
  window.addEventListener('touchstart', pointerInput, { passive: true, capture: true });
  window.addEventListener('pointerdown', pointerInput, { passive: true, capture: true });
  document.addEventListener('click', navigate);
  document.addEventListener('focusin', focusInput);
  document.addEventListener('visibilitychange', synchronize);
  reducedMotion.addEventListener('change', synchronize);
  synchronize();

  return () => {
    attached = false;
    release();
    window.removeEventListener('scroll', publish);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pageshow', synchronize);
    window.removeEventListener('popstate', restoreHistory);
    window.removeEventListener('keydown', keyboard);
    window.removeEventListener('wheel', pointerInput, true);
    window.removeEventListener('touchstart', pointerInput, true);
    window.removeEventListener('pointerdown', pointerInput, true);
    document.removeEventListener('click', navigate);
    document.removeEventListener('focusin', focusInput);
    document.removeEventListener('visibilitychange', synchronize);
    reducedMotion.removeEventListener('change', synchronize);
    for (const [key, value] of Object.entries(controls)) {
      if (navigation[key] === value) delete navigation[key];
    }
  };
}
