import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachProjectModal } from '../src/lib/projectModal.js';

const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function scene(t, { reduced = false, animate = true, connected = true } = {}) {
  const registrations = new Set();
  function target() {
    const node = new EventTarget();
    node.addEventListener = (type, callback, options) => {
      registrations.add({ node, type, callback });
      EventTarget.prototype.addEventListener.call(node, type, callback, options);
    };
    node.removeEventListener = (type, callback, options) => {
      for (const record of registrations) {
        if (record.node === node && record.type === type && record.callback === callback) registrations.delete(record);
      }
      EventTarget.prototype.removeEventListener.call(node, type, callback, options);
    };
    return node;
  }
  const animations = [];
  const focus = [];
  function style() {
    return { overflow: '', transform: '', opacity: '', visibility: '',
      setProperty(name, value) { this[name] = value; }, removeProperty(name) { delete this[name]; } };
  }
  function element(rect = { left: 80, top: 60, width: 800, height: 450 }) {
    const node = Object.assign(target(), { style: style(), dataset: {}, hidden: false, isConnected: true,
      getBoundingClientRect: () => ({ ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height }),
      focus(options) { focus.push({ node, options }); doc.activeElement = node; },
      setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { delete this[name]; },
      querySelector: () => closeButton,
    });
    if (animate) node.animate = (keyframes, options) => {
      let resolve, reject;
      const animation = { node, keyframes, options, active: true, done: false,
        finished: new Promise((done, fail) => { resolve = done; reject = fail; }),
        finish() { this.done = true; resolve(); },
        cancel() { this.active = false; reject(new Error('cancelled')); },
      };
      animations.push(animation);
      return animation;
    };
    return node;
  }
  const media = Object.assign(target(), { matches: reduced });
  const doc = Object.assign(target(), { visibilityState: 'visible', body: { style: style() }, documentElement: { style: style() } });
  doc.body.style.overflow = 'clip';
  const browser = Object.assign(target(), {
    innerWidth: 1280, innerHeight: 900, scrollY: 420,
    matchMedia: () => media,
    getComputedStyle(node) {
      const pose = animations.findLast(animation => animation.node === node && animation.active && animation.done)?.keyframes.at(-1) ?? {};
      return { transform: node.pose ?? pose.transform ?? (node.style.transform || 'none'),
        opacity: pose.opacity ?? (node.style.opacity || '1'), borderRadius: '14px' };
    },
  });
  const closeButton = element();
  const dialog = Object.assign(element(), {
    open: false,
    contains: (node) => node === closeButton || node === dialog,
    showModal() { this.open = true; closeButton.focus({ preventScroll: true }); },
    close() { if (this.open) { this.open = false; this.dispatchEvent(new Event('close')); } },
  });
  const elements = { dialog, panel: element(), image: element(), flight: element(), ripple: element(), glint: element(), details: element(), backdrop: element(),
    source: element({ left: 150, top: 340, width: 320, height: 180 }), trigger: element(), onClose() { closed++; } };
  elements.source.isConnected = connected;
  elements.flight.hidden = true;
  let closed = 0;
  const cleanup = attachProjectModal(elements, { browser, doc });
  t.after(cleanup);
  function emit(node, type, values = {}) {
    const event = new Event(type, { cancelable: true });
    Object.entries(values).forEach(([key, value]) => Object.defineProperty(event, key, { value }));
    node.dispatchEvent(event);
    return event;
  }
  async function finish() {
    for (let i = 0; i < 5; i++) {
      animations.filter(animation => animation.active && !animation.done).forEach(animation => animation.finish());
      await flush();
    }
  }
  return { ...elements, browser, doc, media, animations, registrations, focus, closeButton, emit, finish, cleanup, get closed() { return closed; } };
}

test('the project popup opens as a modal and closing restores scroll lock and trigger focus once', async (t) => {
  const e = scene(t);
  assert.equal(e.dialog.open, true);
  assert.equal(e.doc.body.style.overflow, 'hidden');
  assert.equal(e.doc.activeElement, e.closeButton);
  await e.finish();
  e.emit(e.dialog, 'cancel');
  await e.finish();
  assert.equal(e.dialog.open, false);
  assert.equal(e.doc.body.style.overflow, 'clip');
  assert.equal(e.closed, 1);
  assert.equal(e.doc.activeElement, e.trigger);
  assert.deepEqual(e.focus.at(-1).options, { preventScroll: true });
  assert.equal(e.browser.scrollY, 420, 'closing does not move the collection');
});

test('Escape during entrance closes from the visible pose and ignores late entrance completions', async (t) => {
  const e = scene(t);
  const entrance = [...e.animations];
  e.flight.pose = 'matrix(.6,0,0,.6,32,48)';
  const event = e.emit(e.dialog, 'cancel');
  assert.equal(event.defaultPrevented, true, 'native Escape waits for the controlled close');
  assert.equal(e.animations.findLast(animation => animation.node === e.flight).keyframes[0].transform,
    e.flight.pose, 'the reverse flight starts from the entrance pose currently on screen');
  await e.finish();
  assert.equal(e.closed, 1);
  const focused = e.doc.activeElement;
  entrance.forEach(animation => animation.finish());
  await flush();
  assert.equal(e.dialog.open, false);
  assert.equal(e.closed, 1);
  assert.equal(e.doc.activeElement, focused);
});

test('only the backdrop closes the popup; clicks on its content remain inside', async (t) => {
  const e = scene(t);
  await e.finish();
  e.emit(e.dialog, 'click', { target: e.details });
  await flush();
  assert.equal(e.closed, 0);
  assert.equal(e.dialog.open, true);
  e.emit(e.dialog, 'click', { target: e.backdrop });
  e.emit(e.dialog, 'click', { target: e.backdrop });
  await e.finish();
  assert.equal(e.dialog.open, false);
  assert.equal(e.closed, 1);
});

test('a missing source image falls back to a normal popup and its close button remains usable', async (t) => {
  const e = scene(t, { connected: false });
  await e.finish();
  assert.equal(e.dialog.open, true);
  assert.equal(e.animations.filter(animation => animation.node === e.flight).length, 0);
  e.closeButton.closest = (selector) => selector === '[data-modal-close]' ? e.closeButton : null;
  e.emit(e.dialog, 'click', { target: e.closeButton });
  await e.finish();
  assert.equal(e.closed, 1);
  assert.equal(e.doc.activeElement, e.trigger);
});

test('hiding the tab closes the modal and releases scroll without taking focus back', async (t) => {
  const e = scene(t);
  const focusCount = e.focus.length;
  e.doc.visibilityState = 'hidden';
  e.emit(e.doc, 'visibilitychange');
  assert.equal(e.dialog.open, false);
  assert.equal(e.closed, 1);
  assert.equal(e.doc.body.style.overflow, 'clip');
  assert.equal(e.focus.length, focusCount);
  await e.finish();
  assert.equal(e.closed, 1, 'the suspended entrance cannot complete the modal again');
});

for (const mode of ['reduced motion', 'no animation API']) {
  test(`${mode} still provides an operable popup without an image flight`, async (t) => {
    const e = scene(t, { reduced: mode === 'reduced motion', animate: mode !== 'no animation API' });
    await e.finish();
    assert.equal(e.dialog.open, true);
    assert.equal(e.animations.filter(animation => animation.node === e.flight).length, 0);
    e.emit(e.dialog, 'cancel');
    await e.finish();
    assert.equal(e.dialog.open, false);
    assert.equal(e.closed, 1);
    assert.equal(e.doc.body.style.overflow, 'clip');
  });
}

test('panel scroll, resize and motion preference changes settle the entrance without blocking close', async (t) => {
  const e = scene(t);
  e.emit(e.panel, 'scroll');
  await flush();
  assert.equal(e.image.style.visibility, '', 'scrolling content restores the actual image instead of retaining a floating snapshot');
  assert.equal(e.flight.hidden, true);
  e.emit(e.browser, 'resize');
  await flush();
  assert.equal(e.dialog.open, true);
  e.media.matches = true;
  e.emit(e.media, 'change');
  await flush();
  e.emit(e.dialog, 'cancel');
  await e.finish();
  assert.equal(e.dialog.open, false);
  assert.equal(e.closed, 1);
});

test('cleanup cancels animations and listeners without restoring stale focus or running onClose', async (t) => {
  const e = scene(t);
  const old = [...e.animations];
  const focused = e.doc.activeElement;
  e.cleanup();
  assert.equal(e.dialog.open, false);
  assert.equal(e.doc.body.style.overflow, 'clip');
  assert.equal(e.registrations.size, 0);
  assert.ok(e.animations.every(animation => !animation.active));
  old.forEach(animation => animation.finish());
  await flush();
  assert.equal(e.closed, 0);
  assert.equal(e.doc.activeElement, focused);
});
