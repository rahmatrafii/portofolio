import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { motionValue } from 'framer-motion';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { galleryLayers, galleryPhotos } from '../src/data/gallery.js';
import { attachGallery, galleryProgress, galleryPose, galleryScrollSpring, galleryPointerSpring } from '../src/lib/gallery.js';

const desktop = { width: 1536, height: 776 };
const phaseAt = (top, index) => galleryPose(galleryProgress(-top, 0, 776 * 2.2, 776), index, 9, desktop);

test('depth, layer spacing, rotations and fades reproduce the audit samples', () => {
  const initial = galleryLayers.map((_, index) => phaseAt(564, index));
  assert.deepEqual(initial.map((pose) => Math.round(pose.z)), [-1140, -1340, -1540, -1700, -1700, -1700, -1700, -1700, -1700]);
  assert.deepEqual(initial.map((pose) => pose.rotation), [3, -5, 7, -9, 11, -3, 5, -7, 9]);
  assert.deepEqual(initial.map((pose) => Number(pose.opacity.toFixed(2))), [1, .91, .40, 0, 0, 0, 0, 0, 0]);
  const middle = Array.from({ length: 9 }, (_, index) => phaseAt(-267, index));
  assert.ok(Math.abs(middle[0].z - 372) < 2);
  assert.ok(Math.abs(middle[0].opacity - .24) < .01);
  assert.ok(Math.abs(middle[8].z + 1228) < 2);
  assert.equal(middle[8].opacity, 1);
  for (let i = 1; i < middle.length; i++) assert.ok(Math.abs(middle[i - 1].z - middle[i].z - 200) < 1e-9);
  assert.deepEqual(Array.from({ length: 9 }, (_, i) => Number(phaseAt(-654, i).opacity.toFixed(2))), [0, 0, 0, 0, 0, 0, .32, .89, 1]);
  assert.ok(Array.from({ length: 9 }, (_, index) => phaseAt(-949, index)).every((pose) => pose.opacity === 0));
  assert.deepEqual(galleryScrollSpring, { stiffness: 80, damping: 30, restDelta: .0001 });
  assert.deepEqual(galleryPointerSpring, { stiffness: 60, damping: 25, mass: .5 });
});

test('depth is reversible; pointer shifts only XY, and mobile uses the original depth range', () => {
  for (let index = 0; index < 9; index++) {
    const before = phaseAt(-267, index);
    phaseAt(-716, index);
    assert.deepEqual(phaseAt(-267, index), before);
    const pointer = galleryPose(galleryProgress(267, 0, 776 * 2.2, 776), index, 9, desktop, 1, -1);
    assert.equal(pointer.z, before.z);
    assert.equal(pointer.opacity, before.opacity);
    assert.equal(pointer.rotation, before.rotation);
    assert.notEqual(pointer.transform, before.transform);
  }
  const mobile = { width: 375, height: 812 };
  assert.equal(galleryPose(0, 0, 9, mobile).z, -1200 + .14 / .55 * 1550);
  assert.equal(galleryPose(1, 0, 9, mobile).z, 350);
  const progressForPhase = (phase) => (phase * .55 - .14 + 8 / 9 * .45) / .88;
  assert.equal(galleryPose(progressForPhase(.061), 8, 9, desktop).pointerEvents, 'auto');
  assert.equal(galleryPose(progressForPhase(.059), 8, 9, desktop).pointerEvents, 'none');
  assert.equal(galleryPose(progressForPhase(.861), 8, 9, desktop).pointerEvents, 'none');
});

function environment(t, reduced = false, observing = false) {
  const listeners = new Set();
  function events() {
    const target = new EventTarget();
    target.addEventListener = (type, callback, options) => {
      assert.notEqual(type, 'scroll', 'Gallery must consume the shared scroll MotionValue');
      listeners.add({ target, type, callback });
      EventTarget.prototype.addEventListener.call(target, type, callback, options);
    };
    target.removeEventListener = (type, callback) => {
      for (const listener of listeners) if (listener.target === target && listener.type === type && listener.callback === callback) listeners.delete(listener);
      EventTarget.prototype.removeEventListener.call(target, type, callback);
    };
    return target;
  }
  const preference = Object.assign(events(), { matches: reduced });
  const finePointer = Object.assign(events(), { matches: true });
  const browser = Object.assign(events(), { innerWidth: 1536, innerHeight: 776, scrollY: 0,
    matchMedia: (query) => query.includes('reduced-motion') ? preference : finePointer });
  const document = Object.assign(events(), { visibilityState: 'visible' });
  let reads = 0, stopped = 0, settled = 0, origin = 2000;
  let height = 776 * 2.2;
  const root = { dataset: {}, parentElement: {}, getBoundingClientRect() { reads++; return { top: origin - browser.scrollY, height }; } };
  const scroll = motionValue(0), progress = motionValue(0), viewport = motionValue(desktop), pointerX = motionValue(0), pointerY = motionValue(0);
  const frames = new Set();
  const frameLoop = { read: (callback) => frames.add(callback), update: (callback) => frames.add(callback) };
  globalThis.window = browser;
  globalThis.document = document;
  const observers = [], intersections = [];
  const previousResizeObserver = globalThis.ResizeObserver;
  const previousIntersectionObserver = globalThis.IntersectionObserver;
  if (observing) {
    function observerClass(list) {
      return class {
        constructor(callback) { this.callback = callback; this.targets = new Set(); list.push(this); }
        observe(target) { this.targets.add(target); }
        disconnect() { this.targets.clear(); this.disconnected = true; }
      };
    }
    globalThis.ResizeObserver = observerClass(observers);
    globalThis.IntersectionObserver = observerClass(intersections);
  }
  const cleanup = attachGallery({ root, scroll, progress, viewport, pointerX, pointerY,
    stop() { stopped++; }, settle() { settled++; } }, { frameLoop, cancel: (callback) => frames.delete(callback) });
  t.after(() => {
    cleanup(); delete globalThis.window; delete globalThis.document;
    if (observing) {
      if (previousResizeObserver) globalThis.ResizeObserver = previousResizeObserver;
      else delete globalThis.ResizeObserver;
      if (previousIntersectionObserver) globalThis.IntersectionObserver = previousIntersectionObserver;
      else delete globalThis.IntersectionObserver;
    }
  });
  function flush() { const pending = [...frames]; frames.clear(); pending.forEach((callback) => callback()); }
  function move(y) { browser.scrollY = y; scroll.set(y); flush(); }
  function visibility(value) { document.visibilityState = value; document.dispatchEvent(new Event('visibilitychange')); flush(); }
  function reduce(value) { preference.matches = value; preference.dispatchEvent(new Event('change')); flush(); }
  return { browser, root, scroll, progress, pointerX, pointerY, frames, listeners, observers, intersections, cleanup, flush, move, visibility, reduce,
    shiftOrigin(value) { origin = value; observers[0].callback(); flush(); },
    reads: () => reads, stopped: () => stopped, settled: () => settled, failGeometry() { height = NaN; browser.dispatchEvent(new Event('resize')); flush(); } };
}

test('shared scroll drives the gallery both ways without layout reads during scroll; cleanup cancels pending work', (t) => {
  const e = environment(t);
  e.flush();
  assert.equal(e.root.dataset.galleryEnhanced, 'true');
  const reads = e.reads();
  e.move(2267);
  const middle = e.progress.get();
  assert.ok(Math.abs(phaseAt(-267, 0).z - galleryPose(middle, 0, 9, desktop).z) < 1e-9);
  e.move(2716); e.move(2267);
  assert.equal(e.progress.get(), middle);
  assert.equal(e.reads(), reads);
  e.scroll.set(2400);
  assert.equal(e.frames.size, 1);
  e.cleanup();
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
  e.scroll.set(2600);
  assert.equal(e.frames.size, 0, 'cleanup unsubscribes from the shared scroll');
  assert.deepEqual(e.root.dataset, {});
});

test('reduced motion, hidden tabs, invalid geometry and pointer modality have safe lifecycle paths', (t) => {
  const e = environment(t, true);
  e.flush();
  assert.equal(e.root.dataset.galleryEnhanced, undefined);
  e.reduce(false);
  e.move(2267);
  const pointer = new Event('pointermove');
  Object.assign(pointer, { pointerType: 'mouse', clientX: 1536, clientY: 0 });
  e.browser.dispatchEvent(pointer);
  assert.equal(e.pointerX.get(), 1);
  assert.equal(e.pointerY.get(), -1);
  const touch = new Event('pointermove');
  Object.assign(touch, { pointerType: 'touch', clientX: 0, clientY: 776 });
  e.browser.dispatchEvent(touch);
  assert.equal(e.pointerX.get(), 1);
  e.visibility('hidden');
  const paused = e.progress.get();
  e.move(2700);
  assert.equal(e.progress.get(), paused);
  e.visibility('visible');
  assert.ok(e.progress.get() > paused);
  assert.ok(e.settled() > 0);
  e.reduce(true);
  assert.equal(e.root.dataset.galleryEnhanced, undefined);
  assert.equal(e.pointerX.get(), 0);
  assert.equal(e.pointerY.get(), 0);
  e.reduce(false);
  e.failGeometry();
  assert.equal(e.root.dataset.galleryEnhanced, undefined);
  assert.ok(e.stopped() > 0);
});

test('earlier runway resizing updates the cached origin; offscreen pointer and stale observers do no work', (t) => {
  const e = environment(t, false, true);
  e.flush();
  assert.ok(e.observers[0].targets.has(e.root));
  assert.ok(e.observers[0].targets.has(e.root.parentElement));
  e.move(2267);
  const oldProgress = e.progress.get();
  e.shiftOrigin(2100);
  assert.ok(e.progress.get() < oldProgress);
  assert.equal(e.progress.get(), galleryProgress(2267, 2100, 776 * 2.2, 776));
  const pointer = new Event('pointermove');
  Object.assign(pointer, { pointerType: 'mouse', clientX: 1536, clientY: 0 });
  e.browser.dispatchEvent(pointer);
  assert.equal(e.pointerX.get(), 0);
  e.intersections[0].callback([{ isIntersecting: true }]);
  e.browser.dispatchEvent(pointer);
  assert.equal(e.pointerX.get(), 1);
  e.cleanup();
  e.observers[0].callback();
  e.intersections[0].callback([{ isIntersecting: true }]);
  assert.equal(e.frames.size, 0);
  assert.deepEqual(e.root.dataset, {});
  assert.ok(e.observers[0].disconnected);
  assert.ok(e.intersections[0].disconnected);
});

test('Gallery renders nine passive photos from seven real sources, with native hover and reduced-motion fallback', async () => {
  assert.equal(galleryPhotos.length, 7);
  assert.equal(galleryLayers.length, 9);
  for (const photo of galleryPhotos) {
    assert.ok(existsSync(new URL(`../assets/gallery/${photo.file}`, import.meta.url)));
    for (const width of [480, 960]) assert.ok(existsSync(new URL(`../public/images/gallery/${photo.name}-${width}.webp`, import.meta.url)));
  }
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const { default: Gallery } = await server.ssrLoadModule('/src/components/Gallery.jsx');
    const markup = renderToStaticMarkup(createElement(Gallery, { scroll: motionValue(0) }));
    assert.equal([...markup.matchAll(/<img\b/g)].length, 9);
    assert.equal([...markup.matchAll(/alt=""/g)].length, 2);
    assert.doesNotMatch(markup, /<button|<a\b|tabindex|role="button"/);
    const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
    assert.match(css, /height: 220vh/);
    assert.match(css, /perspective: 1200px/);
    assert.match(css, /perspective: 900px/);
    assert.match(css, /transform 700ms cubic-bezier\(0, 0, \.2, 1\)/);
    assert.match(css, /box-shadow 300ms cubic-bezier\(\.4, 0, \.2, 1\)/);
    assert.match(css, /gallery-frame:hover \.gallery-image \{ transform: scale\(1\.05\)/);
    assert.match(css, /gallery-photo \{ transform: none !important; opacity: 1 !important/);
  } finally { await server.close(); }
});
