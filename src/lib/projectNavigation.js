import { frame, cancelFrame } from 'framer-motion';
import { projectCategories, projects, resolveProjectRoute } from '../data/projects.js';
import { createSheetTransition } from './projectTransition.js';

let sequence = 0;
const newKey = () => `${Date.now().toString(36)}-${++sequence}`;

export function validProjectOrigin(origin) {
  return origin && projectCategories.some((category) => category.slug === origin.category)
    && Number.isInteger(origin.index) && origin.index >= 0 && origin.index < 4
    && [origin.scrollY, origin.width, origin.height, origin.folderTop].every(Number.isFinite)
    && origin.scrollY >= 0 && origin.width > 0 && origin.height > 0 ? origin : null;
}

export function canNavigateProjectLink(event, link, location) {
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
    || event.shiftKey || event.altKey || link.hasAttribute('download')
    || (link.target && link.target !== '_self')) return false;
  let url;
  try { url = new URL(link.href, location.href); } catch { return false; }
  return url.origin === location.origin && resolveProjectRoute(url.pathname).type !== 'not-found';
}

export function attachProjectNavigation({ render, home, page, navigation }, {
  browser = window, doc = document, frameLoop = frame, cancel = cancelFrame,
  makeTransition = createSheetTransition,
} = {}) {
  const reduced = browser.matchMedia('(prefers-reduced-motion: reduce)');
  const positions = new Map();
  const images = new Map();
  const previousRestoration = browser.history.scrollRestoration;
  let attached = true;
  let pending;
  let homeMounted = resolveProjectRoute(browser.location.pathname).type === 'home';
  let current = readEntry(browser.history.state);

  function readEntry(state) {
    const saved = state?.portfolio;
    return { key: typeof saved?.key === 'string' ? saved.key : newKey(),
      href: browser.location.pathname + browser.location.search + browser.location.hash,
      scrollY: Number.isFinite(saved?.scrollY) && saved.scrollY >= 0 ? saved.scrollY : browser.scrollY,
      origin: validProjectOrigin(saved?.origin) };
  }

  function route(entry) { return resolveProjectRoute(new URL(entry.href, browser.location.href).pathname); }
  function live(job) { return attached && pending === job; }
  function moving(job) { return live(job) && !job.fast; }
  // Input during a Home return settles the landing instead of restoring the outgoing collection.
  function canCancel(job) { return !job.pop && !job.committed && route(job.target).type !== 'home'; }

  function show(entry, extra = {}) {
    const target = route(entry);
    if (target.type === 'home') homeMounted = true;
    render({ route: target, homeMounted, showHome: target.type === 'home', ...extra });
  }

  function remember(pop) {
    current.scrollY = browser.scrollY;
    positions.set(current.key, current.scrollY);
    if (!pop) {
      const state = browser.history.state;
      if (state?.portfolio?.key !== current.key) current = { ...current, key: newKey() };
      current.href = browser.location.pathname + browser.location.search + browser.location.hash;
      browser.history.replaceState({ ...state, portfolio: current }, '');
    }
  }

  function nextFrame(job) {
    if (!live(job)) return Promise.resolve(false);
    return new Promise((resolve) => {
      const wait = { resolve, callback: null };
      wait.callback = () => { job.waits.delete(wait); resolve(live(job)); };
      job.waits.add(wait);
      frameLoop.postRender(wait.callback);
    });
  }

  function clearVisuals(job) {
    job.waits.forEach((wait) => { cancel(wait.callback); wait.resolve(false); });
    job.waits.clear();
    job.transition?.dispose();
    job.transition = null;
    job.fade?.cancel();
    job.fade = null;
    job.view?.skipTransition();
    job.view = null;
  }

  function focusDestination(job) {
    if (doc.visibilityState === 'hidden') return;
    const target = route(job.target).type === 'home'
      ? findSheet(job.origin) ?? home()?.querySelector('#projects')
      : page()?.querySelector('h1');
    target?.focus({ preventScroll: true });
  }

  function finish(job) {
    if (!live(job)) return;
    clearVisuals(job);
    pending = null;
    delete doc.documentElement.dataset.projectTransition;
    browser.history.scrollRestoration = previousRestoration;
    if (route(current).type === 'home') navigation.resume?.();
    focusDestination(job);
  }

  function commit(job) {
    if (!live(job) || job.committed) return;
    job.committed = true;
    const state = { ...(job.pop ? browser.history.state : {}), portfolio: job.target };
    if (route(job.target).type === 'home' && job.origin) state.projectFolder = job.origin.category;
    if (job.pop) browser.history.replaceState(state, '', job.target.href);
    else browser.history.pushState(state, '', job.target.href);
    current = job.target;
    show(current, { restoredFolder: job.origin?.category });
    if (route(current).type === 'home') doc.title = 'Rafi | AI Engineer';
    else browser.scrollTo({ top: current.scrollY, behavior: 'instant' });
  }

  function findSheet(origin) {
    if (!origin) return null;
    return home()?.querySelector(`.project-folder[data-category="${origin.category}"] .folder-sheet[data-sheet-index="${origin.index}"]`);
  }

  function restoreHome(job) {
    let y = job.target.scrollY;
    const origin = job.origin;
    if (origin) {
      y = origin.scrollY;
      if (browser.innerWidth !== origin.width || browser.innerHeight !== origin.height) {
        const folder = findSheet(origin)?.closest('.project-folder').querySelector('.folder-body');
        if (folder) y = folder.getBoundingClientRect().top + browser.scrollY
          - Math.max(140, Math.min(origin.folderTop, browser.innerHeight * .45));
      }
    } else {
      const hash = new URL(job.target.href, browser.location.href).hash;
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { /* Invalid fragments use the saved position. */ }
      const target = id && home()?.querySelector(`#${browser.CSS.escape(id)}`);
      if (target) y = target.getBoundingClientRect().top + browser.scrollY
        - (parseFloat(browser.getComputedStyle(doc.documentElement).scrollPaddingTop) || 112);
    }
    y = Math.max(0, y || 0);
    if (navigation.restore) navigation.restore(y);
    else browser.scrollTo({ top: y, behavior: 'instant' });
    job.target.scrollY = browser.scrollY;
  }

  async function immediate(job) {
    if (!live(job) || job.fast) return;
    job.fast = true;
    clearVisuals(job);
    commit(job);
    if (route(job.target).type === 'home') {
      if (!await nextFrame(job)) return;
      restoreHome(job);
      if (!await nextFrame(job)) return;
    }
    finish(job);
  }

  function abort() {
    if (!pending) return;
    const previous = pending;
    pending = null;
    clearVisuals(previous);
    delete doc.documentElement.dataset.projectTransition;
    browser.history.scrollRestoration = previousRestoration;
    show(current);
    if (route(current).type === 'home') {
      navigation.resume?.();
      navigation.restore?.(current.scrollY);
    } else browser.scrollTo({ top: current.scrollY, behavior: 'instant' });
  }

  async function preload(category) {
    const sources = new Set(projects.filter((project) => project.category === category).map((project) => project.image));
    await Promise.all([...sources].map((src) => {
      if (!images.has(src)) {
        const image = new browser.Image();
        image.src = src;
        images.set(src, image.decode ? image.decode().catch(() => {}) : Promise.resolve());
      }
      return images.get(src);
    }));
  }

  async function travel(job) {
    const target = route(job.target);
    if (target.type === 'home') {
      homeMounted = true;
      show(current, { homeMounted: true, showHome: true, returning: true,
        outgoingScroll: current.scrollY, restoredFolder: job.origin?.category });
      // Home's existing Motion controllers measure first; restore scroll before measuring the landing slot.
      if (!await nextFrame(job) || !moving(job)) return;
      restoreHome(job);
      if (!await nextFrame(job) || !moving(job)) return;
      const sheet = findSheet(job.origin);
      if (sheet && !reduced.matches) job.transition = makeTransition(sheet, { browser, doc });
      if (job.transition) await job.transition.returnToFolder(page());
      if (!moving(job)) return;
      commit(job);
      finish(job);
      return;
    }

    const previous = route(current);
    const sharedImage = previous.category?.slug === target.category?.slug
      && ((previous.type === 'category' && target.type === 'detail')
        || (previous.type === 'detail' && target.type === 'category'));
    if (sharedImage && doc.startViewTransition && !reduced.matches) {
      job.view = doc.startViewTransition(() => { if (moving(job)) commit(job); });
      job.view.ready.catch(() => {});
      await job.view.finished.catch(() => {});
      if (moving(job)) { commit(job); finish(job); }
      return;
    }

    if (job.source && !reduced.matches) {
      navigation.pause?.();
      await preload(target.category.slug);
      if (!moving(job)) return;
      show(current, { incoming: target });
      if (!await nextFrame(job) || !moving(job)) return;
      job.transition = makeTransition(job.source, { browser, doc });
      if (job.transition) {
        if (!await job.transition.leaveFolder(page(), () => { if (moving(job)) commit(job); })) {
          if (moving(job)) void immediate(job);
          return;
        }
        if (!moving(job)) return;
      }
    }
    if (!moving(job)) return;
    commit(job);
    if (job.transition) await job.transition.reveal();
    else if (!reduced.matches && page()?.animate) {
      job.fade = page().animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: 'ease-out' });
      await job.fade.finished.catch(() => {});
    }
    if (moving(job)) finish(job);
  }

  function navigate(url, { pop = false, state, source } = {}) {
    abort();
    remember(pop);
    const from = route(current);
    const targetRoute = resolveProjectRoute(url.pathname);
    const sameCategory = targetRoute.category?.slug === from.category?.slug;
    const backToCollection = !pop && from.type === 'detail' && targetRoute.type === 'category' && sameCategory;
    const sheetIndex = Number(source?.dataset.sheetIndex);
    let origin = current.origin;
    if (source) {
      const category = source.closest('.project-folder');
      origin = validProjectOrigin({ category: category.dataset.category, index: sheetIndex,
        scrollY: browser.scrollY, width: browser.innerWidth, height: browser.innerHeight,
        folderTop: category.querySelector('.folder-body').getBoundingClientRect().top });
    }
    const target = pop ? readEntry(state) : { key: newKey(), href: url.pathname + url.search + url.hash,
      scrollY: targetRoute.type === 'home' ? origin?.scrollY ?? 0 : backToCollection ? current.returnScroll ?? 0 : 0,
      origin: targetRoute.type !== 'home' && targetRoute.category?.slug === origin?.category ? origin : null };
    // The detail's back link is a push, not a pop, so the collection position travels with it.
    if (!pop && from.type === 'category' && targetRoute.type === 'detail' && sameCategory) target.returnScroll = browser.scrollY;
    target.scrollY = positions.get(target.key) ?? target.scrollY;
    const job = { target, origin, source, pop, waits: new Set(), committed: false, fast: false };
    pending = job;
    browser.history.scrollRestoration = 'manual';
    doc.documentElement.dataset.projectTransition = 'true';
    if (reduced.matches || doc.visibilityState === 'hidden') void immediate(job);
    else void travel(job).catch(() => { if (live(job)) void immediate(job); });
  }

  function click(event) {
    const link = event.target?.closest?.('a[href]');
    if (!canNavigateProjectLink(event, link, browser.location)) return;
    const url = new URL(link.href, browser.location.href);
    if (url.pathname === browser.location.pathname && url.search === browser.location.search) {
      if (url.hash !== browser.location.hash || link.getAttribute('href')?.startsWith('#')) {
        if (pending) abort();
        return;
      }
      event.preventDefault();
      return;
    }
    event.preventDefault();
    navigate(url, { source: link.matches('.folder-sheet') ? link : undefined });
  }

  function pop(event) {
    const url = new URL(browser.location.href);
    if (new URL(current.href, url).pathname === url.pathname) {
      abort();
      current = readEntry(event.state);
      return;
    }
    navigate(url, { pop: true, state: event.state });
  }

  function interrupt() { if (pending) void immediate(pending); }
  function pointerInput() {
    if (!pending) return;
    if (canCancel(pending)) abort();
    else interrupt();
  }
  function keyboard(event) {
    if (!pending || !['Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return;
    if (event.key === 'Escape' && canCancel(pending)) abort();
    else interrupt();
  }

  doc.addEventListener('click', click, { capture: true });
  doc.addEventListener('keydown', keyboard, { capture: true });
  browser.addEventListener('popstate', pop);
  browser.addEventListener('resize', interrupt);
  browser.addEventListener('pointerdown', pointerInput, { capture: true });
  browser.addEventListener('wheel', interrupt, { passive: true, capture: true });
  browser.addEventListener('touchstart', interrupt, { passive: true, capture: true });
  doc.addEventListener('visibilitychange', interrupt);
  reduced.addEventListener('change', interrupt);
  return () => {
    attached = false;
    if (pending) clearVisuals(pending);
    pending = null;
    delete doc.documentElement.dataset.projectTransition;
    browser.history.scrollRestoration = previousRestoration;
    doc.removeEventListener('click', click, { capture: true });
    doc.removeEventListener('keydown', keyboard, { capture: true });
    browser.removeEventListener('popstate', pop);
    browser.removeEventListener('resize', interrupt);
    browser.removeEventListener('pointerdown', pointerInput, { capture: true });
    browser.removeEventListener('wheel', interrupt, { capture: true });
    browser.removeEventListener('touchstart', interrupt, { capture: true });
    doc.removeEventListener('visibilitychange', interrupt);
    reduced.removeEventListener('change', interrupt);
  };
}
