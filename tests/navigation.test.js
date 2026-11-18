import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachNavigation } from '../src/lib/navigation.js';

function environment(t) {
  const frames = new Map();
  let nextId = 0;
  let disconnected = false;
  const browser = Object.assign(new EventTarget(), {
    scrollY: 0,
    innerHeight: 800,
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
  });
  globalThis.window = browser;
  globalThis.document = { documentElement: { scrollHeight: 2100 } };
  t.after(() => { delete globalThis.window; delete globalThis.document; });
  const sections = [['home', 0], ['about', 820], ['journey', 1800]].map(([id, top]) => ({
    id, getBoundingClientRect: () => ({ top: top - browser.scrollY }),
  }));
  function frame() {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
  }
  function scroll(y) {
    browser.scrollY = y;
    browser.dispatchEvent(new Event('scroll'));
    frame();
  }
  return { browser, sections, frames, frame, scroll, disconnected: () => disconnected };
}

test('active section follows reading position, reaches the short last section, and avoids redundant renders', (t) => {
  const e = environment(t);
  const updates = [];
  const cleanup = attachNavigation(e.sections, (state) => updates.push(state));
  e.frame();
  assert.deepEqual(updates.at(-1), { activeId: 'home', scrolled: false });
  e.scroll(700);
  assert.deepEqual(updates.at(-1), { activeId: 'about', scrolled: true });
  const count = updates.length;
  e.scroll(800);
  assert.equal(updates.length, count);
  e.scroll(1300);
  assert.equal(updates.at(-1).activeId, 'journey');
  e.scroll(0);
  assert.deepEqual(updates.at(-1), { activeId: 'home', scrolled: false });
  cleanup();
  assert.ok(e.disconnected());
  e.browser.dispatchEvent(new Event('scroll'));
  assert.equal(e.frames.size, 0);
});

test('header scroll state uses hysteresis and cleanup cancels pending frames', (t) => {
  const e = environment(t);
  let state;
  const cleanup = attachNavigation(e.sections, (next) => { state = next; });
  e.frame();
  e.scroll(49);
  assert.ok(state.scrolled);
  e.scroll(30);
  assert.ok(state.scrolled, 'small direction changes must not flicker the header');
  e.scroll(16);
  assert.equal(state.scrolled, false);
  e.scroll(30);
  assert.equal(state.scrolled, false);
  e.browser.dispatchEvent(new Event('resize'));
  assert.equal(e.frames.size, 1);
  cleanup();
  assert.equal(e.frames.size, 0);
});
