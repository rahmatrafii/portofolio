import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachCloudMotion } from '../src/lib/cloudMotion.js';

function environment(t, { hidden = false, reduced = false, observer = true } = {}) {
  const listeners = new Set();
  function eventTarget() {
    const events = new EventTarget();
    events.addEventListener = (type, callback) => {
      listeners.add({ events, type, callback });
      EventTarget.prototype.addEventListener.call(events, type, callback);
    };
    events.removeEventListener = (type, callback) => {
      for (const registration of listeners) {
        if (registration.events === events && registration.type === type && registration.callback === callback) {
          listeners.delete(registration);
        }
      }
      EventTarget.prototype.removeEventListener.call(events, type, callback);
    };
    return events;
  }

  const media = Object.assign(eventTarget(), { matches: reduced });
  const page = Object.assign(eventTarget(), { visibilityState: hidden ? 'hidden' : 'visible' });
  const observers = [];
  const browser = {
    matchMedia: () => media,
    IntersectionObserver: observer ? class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target) { this.target = target; }
      disconnect() { this.disconnected = true; }
    } : undefined,
  };
  const hero = {};
  const background = { dataset: {} };
  globalThis.window = browser;
  globalThis.document = page;
  t.after(() => { delete globalThis.window; delete globalThis.document; });

  function intersect(isIntersecting, index = observers.length - 1) {
    observers[index].callback([{ target: hero, isIntersecting }]);
  }
  function visibility(value) {
    page.visibilityState = value;
    page.dispatchEvent(new Event('visibilitychange'));
  }
  function motion(value) {
    media.matches = value;
    media.dispatchEvent(new Event('change'));
  }
  return { hero, background, observers, listeners, intersect, visibility, motion };
}

test('clouds run only while hero is visible, tab is visible, and reduced motion is off', (t) => {
  const e = environment(t);
  const cleanup = attachCloudMotion(e);
  assert.equal(e.background.dataset.playing, 'false', 'wait for initial intersection before animating');
  e.intersect(true);
  assert.equal(e.background.dataset.playing, 'true');
  e.intersect(false);
  assert.equal(e.background.dataset.playing, 'false');
  e.intersect(true);
  e.visibility('hidden');
  assert.equal(e.background.dataset.playing, 'false');
  e.visibility('visible');
  assert.equal(e.background.dataset.playing, 'true');
  e.motion(true);
  assert.equal(e.background.dataset.playing, 'false');
  e.visibility('hidden');
  e.motion(false);
  assert.equal(e.background.dataset.playing, 'false', 'motion setting must not override hidden tab');
  e.visibility('visible');
  assert.equal(e.background.dataset.playing, 'true');
  cleanup();
});

test('initially hidden or reduced-motion pages stay paused, with visible fallback without IntersectionObserver', (t) => {
  const e = environment(t, { hidden: true, reduced: true, observer: false });
  const cleanup = attachCloudMotion(e);
  assert.equal(e.background.dataset.playing, 'false');
  e.visibility('visible');
  assert.equal(e.background.dataset.playing, 'false');
  e.motion(false);
  assert.equal(e.background.dataset.playing, 'true');
  cleanup();
});

test('cleanup stops clouds and removes listeners, including queued callbacks across remount', (t) => {
  const e = environment(t);
  const cleanup = attachCloudMotion(e);
  e.intersect(true);
  assert.equal(e.listeners.size, 2);
  cleanup();
  assert.ok(e.observers[0].disconnected);
  assert.equal(e.listeners.size, 0);
  assert.equal(e.background.dataset.playing, 'false');
  e.intersect(true, 0);
  e.visibility('hidden');
  assert.equal(e.background.dataset.playing, 'false');

  e.visibility('visible');
  const cleanupAgain = attachCloudMotion(e);
  e.intersect(true);
  assert.equal(e.background.dataset.playing, 'true');
  e.intersect(false, 0);
  assert.equal(e.background.dataset.playing, 'true', 'stale observer cannot change current controller state');
  cleanupAgain();
  assert.equal(e.listeners.size, 0);
  assert.ok(e.observers[1].disconnected);
});
