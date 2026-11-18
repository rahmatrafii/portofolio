import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachParallax } from '../src/lib/parallax.js';

function createEnvironment({ reduced = false, fine = true } = {}) {
  const listeners = new Set();
  function target() {
    const events = new EventTarget();
    const values = new Map();
    const classes = new Set();
    return Object.assign(events, {
      style: {
        setProperty: (key, value) => values.set(key, value),
        removeProperty: (key) => values.delete(key),
        getPropertyValue: (key) => values.get(key) ?? '',
      },
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name),
      },
      addEventListener(type, callback, options) {
        listeners.add({ events, type, callback });
        EventTarget.prototype.addEventListener.call(events, type, callback, options);
      },
      removeEventListener(type, callback) {
        for (const registration of listeners) {
          if (registration.events === events && registration.type === type && registration.callback === callback) {
            listeners.delete(registration);
          }
        }
        EventTarget.prototype.removeEventListener.call(events, type, callback);
      },
    });
  }

  const motion = Object.assign(target(), { matches: reduced });
  const pointer = Object.assign(target(), { matches: fine });
  const frames = new Map();
  const timers = new Map();
  let nextId = 0;
  let now = 0;
  let layoutReads = 0;
  const browser = Object.assign(target(), {
    scrollY: 0,
    performance: { now: () => now },
    matchMedia: (query) => query.includes('reduced-motion') ? motion : pointer,
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout(callback) { timers.set(++nextId, callback); return nextId; },
    clearTimeout: (id) => timers.delete(id),
  });
  const layer = Object.assign(target(), { dataset: { speed: '0.065', depth: '12' } });
  const scene = Object.assign(target(), {
    querySelectorAll: () => [layer],
    getBoundingClientRect: () => { layoutReads++; return { left: 0, top: 200 - browser.scrollY, width: 1000, height: 600 }; },
  });
  const elements = { background: target(), hero: { get offsetHeight() { layoutReads++; return 900; } }, scene };
  globalThis.window = browser;

  function frame(elapsed = 1000 / 60) {
    now += elapsed;
    const callbacks = Array.from(frames.values());
    frames.clear();
    callbacks.forEach((callback) => callback(now));
  }
  function move() {
    scene.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 1000, clientY: 600 }));
    frame();
  }
  function settle() {
    for (let i = 0; i < 200 && frames.size; i++) frame();
    assert.equal(frames.size, 0, 'animation must stop after settling');
  }
  return { elements, browser, scene, layer, motion, pointer, frames, timers, listeners, frame, move, settle, layoutReads: () => layoutReads };
}

test('scroll and pointer parallax stop and reset when reduced motion is enabled', (t) => {
  const e = createEnvironment();
  const cleanup = attachParallax(e.elements);
  t.after(() => { cleanup(); delete globalThis.window; });
  e.frame();
  e.browser.scrollY = 2000;
  e.browser.dispatchEvent(new Event('scroll'));
  e.frame();
  const initialOffset = parseFloat(e.elements.background.style.getPropertyValue('--cloud-offset'));
  assert.ok(initialOffset > 0 && initialOffset < 144, 'scroll layers should ease toward their target');
  e.settle();
  assert.equal(e.elements.background.style.getPropertyValue('--cloud-offset'), '144.00px');
  assert.equal(e.layer.style.getPropertyValue('--skill-offset'), '0.00px', 'skill folding owns scroll movement');
  e.move();
  assert.ok(parseFloat(e.layer.style.getPropertyValue('--pointer-x')) > 0);

  e.motion.matches = true;
  e.motion.dispatchEvent(new Event('change'));
  e.frame();
  for (const property of ['--skill-offset', '--pointer-x', '--pointer-y']) {
    assert.equal(e.layer.style.getPropertyValue(property), '0.00px');
  }
  assert.equal(e.elements.background.style.getPropertyValue('--cloud-offset'), '0.00px');
  assert.equal(e.scene.classList.contains('entering'), false);
  e.move();
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '0.00px');
});

test('touch pointer and initial reduced-motion preference do not animate', (t) => {
  const e = createEnvironment({ fine: false, reduced: true });
  const cleanup = attachParallax(e.elements);
  t.after(() => { cleanup(); delete globalThis.window; });
  e.move();
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '0.00px');
  assert.equal(e.scene.classList.contains('entering'), false);
  assert.equal(e.timers.size, 0);
});

test('mobile and touch screens stay static even when motion is allowed', (t) => {
  const e = createEnvironment({ fine: false });
  const cleanup = attachParallax(e.elements);
  t.after(() => { cleanup(); delete globalThis.window; });
  e.browser.scrollY = 400;
  e.browser.dispatchEvent(new Event('scroll'));
  e.move();
  assert.equal(e.elements.background.style.getPropertyValue('--cloud-offset'), '0.00px');
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '0.00px');
  assert.equal(e.frames.size, 0);
  assert.equal(e.timers.size, 0);
});

test('60Hz and 120Hz produce the same response after the same elapsed time', () => {
  function response(step, frameCount) {
    const e = createEnvironment();
    const cleanup = attachParallax(e.elements);
    try {
      e.browser.scrollY = 450;
      e.browser.dispatchEvent(new Event('scroll'));
      e.scene.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 1000, clientY: 500 }));
      for (let i = 0; i < frameCount; i++) e.frame(step);
      return ['--cloud-offset', '--pointer-x'].map((key, index) => parseFloat((index ? e.layer : e.elements.background).style.getPropertyValue(key)));
    } finally {
      cleanup();
      delete globalThis.window;
    }
  }
  const normal = response(1000 / 60, 6);
  const fast = response(1000 / 120, 12);
  normal.forEach((value, index) => assert.ok(Math.abs(value - fast[index]) < 0.02));
});

test('scroll and pointer updates do not read layout, and switching to mobile cancels motion', (t) => {
  const e = createEnvironment();
  const cleanup = attachParallax(e.elements);
  t.after(() => { cleanup(); delete globalThis.window; });
  const initialReads = e.layoutReads();
  e.move();
  e.browser.scrollY = 300;
  e.browser.dispatchEvent(new Event('scroll'));
  e.frame();
  assert.equal(e.layoutReads(), initialReads);
  e.pointer.matches = false;
  e.pointer.dispatchEvent(new Event('change'));
  assert.equal(e.frames.size, 0);
  assert.equal(e.elements.background.style.getPropertyValue('--cloud-offset'), '0.00px');
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '0.00px');
});

test('cleanup removes listeners, timers and frames before a StrictMode remount', (t) => {
  const e = createEnvironment();
  t.after(() => { delete globalThis.window; });
  const cleanup = attachParallax(e.elements);
  e.move();
  assert.ok(e.frames.size > 0);
  assert.equal(e.timers.size, 0, 'logo intro must not add a separate entrance timer');
  cleanup();
  assert.equal(e.frames.size, 0);
  assert.equal(e.timers.size, 0);
  assert.equal(e.listeners.size, 0);
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '');
  e.browser.dispatchEvent(new Event('scroll'));
  assert.equal(e.frames.size, 0);

  const cleanupAgain = attachParallax(e.elements);
  e.frame();
  assert.equal(e.layer.style.getPropertyValue('--pointer-x'), '0.00px');
  cleanupAgain();
  assert.equal(e.listeners.size, 0);
});
