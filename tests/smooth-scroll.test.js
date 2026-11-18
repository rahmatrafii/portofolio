import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachSmoothScroll } from '../src/lib/smoothScroll.js';
import { resume } from '../src/data/portfolio.js';

function environment(t, { reduced = false, hidden = false } = {}) {
  const listeners = new Set();
  function events() {
    const target = new EventTarget();
    target.addEventListener = (type, callback, options) => {
      listeners.add({ target, type, callback });
      EventTarget.prototype.addEventListener.call(target, type, callback, options);
    };
    target.removeEventListener = (type, callback, options) => {
      for (const item of listeners) {
        if (item.target === target && item.type === type && item.callback === callback) listeners.delete(item);
      }
      EventTarget.prototype.removeEventListener.call(target, type, callback, options);
    };
    return target;
  }
  const media = Object.assign(events(), { matches: reduced });
  const history = [];
  const browser = Object.assign(events(), {
    scrollY: 125,
    matchMedia: () => media,
    location: { hash: '' },
    history: { pushState(state, unused, hash) { history.push(hash); browser.location.hash = hash; } },
  });
  const targets = new Map();
  const page = Object.assign(events(), {
    visibilityState: hidden ? 'hidden' : 'visible',
    documentElement: {},
    getElementById: (id) => targets.get(id),
  });
  browser.getComputedStyle = (element) => element === page.documentElement
    ? { scrollPaddingTop: '80px' } : { scrollMarginTop: '16px' };
  const instances = [];
  class MockLenis {
    constructor(options) { this.options = options; this.handlers = new Set(); this.times = []; this.targets = []; this.targetScroll = browser.scrollY; instances.push(this); }
    on(type, handler) { assert.equal(type, 'scroll'); this.handlers.add(handler); return () => this.handlers.delete(handler); }
    emit() { this.handlers.forEach((handler) => handler({ scroll: 9999 })); }
    raf(timestamp) {
      this.times.push(timestamp);
      if (this.pendingY !== undefined) browser.scrollY = this.pendingY;
      this.emit();
    }
    resize() { this.resized = (this.resized ?? 0) + 1; this.targetScroll = browser.scrollY; }
    scrollTo(target, options) { this.targets.push(target); this.navigationOptions = options; }
    stop() { this.stops = (this.stops ?? 0) + 1; this.pendingY = undefined; this.targetScroll = browser.scrollY; }
    start() { this.starts = (this.starts ?? 0) + 1; }
    destroy() { this.destroyed = true; this.handlers.clear(); }
  }
  const reads = new Set();
  const postRenders = new Set();
  const persistent = new Set();
  const frameLoop = {
    read(callback, keepAlive = false) { reads.add(callback); if (keepAlive) persistent.add(callback); },
    postRender(callback) { postRenders.add(callback); },
  };
  const cancel = (callback) => { reads.delete(callback); persistent.delete(callback); postRenders.delete(callback); };
  let value;
  const values = [];
  const scroll = { set(next) { value = next; values.push(next); } };
  globalThis.window = browser;
  globalThis.document = page;
  const cleanups = [];
  t.after(() => {
    for (const cleanup of cleanups.toReversed()) cleanup();
    delete globalThis.window;
    delete globalThis.document;
  });
  const navigation = {};
  function attach() { const cleanup = attachSmoothScroll(scroll, { LenisClass: MockLenis, frameLoop, cancel, navigation }); cleanups.push(cleanup); return cleanup; }
  function frame(timestamp = 100) {
    [...reads].forEach((callback) => {
      if (!persistent.has(callback)) reads.delete(callback);
      callback({ timestamp });
    });
    [...postRenders].forEach((callback) => { postRenders.delete(callback); callback(); });
  }
  function nativeScroll(y) { browser.scrollY = y; browser.dispatchEvent(new Event('scroll')); }
  function motion(next) { media.matches = next; media.dispatchEvent(new Event('change')); }
  function visibility(next) { page.visibilityState = next; page.dispatchEvent(new Event('visibilitychange')); }
  function click(href, overrides = {}, linkOverrides = {}) {
    const link = { target: '', hasAttribute: () => false, getAttribute: () => href,
      focus() { page.activeElement = link; page.dispatchEvent(new Event('focusin')); }, ...linkOverrides };
    const event = new Event('click', { cancelable: true });
    Object.defineProperties(event, {
      target: { value: { closest: () => link } },
      button: { value: 0 },
      ...Object.fromEntries(Object.entries(overrides).map(([key, item]) => [key, { value: item }])),
    });
    page.dispatchEvent(event);
    return event;
  }
  function pressResume(button = 0) {
    const event = new Event('pointerdown', { cancelable: true });
    Object.defineProperties(event, {
      button: { value: button },
      target: { value: { closest: (selector) => selector === '.about-download' ? {} : null } },
    });
    browser.dispatchEvent(event);
    return event;
  }
  function key(name, editable = false) {
    const event = new Event('keydown', { cancelable: true });
    Object.defineProperties(event, { key: { value: name }, target: { value: { closest: () => editable ? {} : null } } });
    browser.dispatchEvent(event);
    return event;
  }
  return { browser, page, instances, targets, history, reads, postRenders, navigation, values, listeners, attach, frame, nativeScroll,
    motion, visibility, click, key, pressResume, value: () => value };
}

test('project navigation can pause, restore and resume the shared scroll driver without adding another loop', (t) => {
  const e = environment(t);
  e.browser.scrollTo = ({ top }) => { e.browser.scrollY = top; };
  const cleanup = e.attach();
  e.navigation.pause();
  assert.equal(e.instances[0].destroyed, true);
  assert.equal(e.reads.size, 0);
  e.navigation.restore(3200);
  assert.equal(e.browser.scrollY, 3200);
  assert.equal(e.value(), 3200);
  e.navigation.resume();
  assert.equal(e.instances.length, 2);
  assert.equal(e.reads.size, 1);
  e.navigation.restore(3400);
  assert.equal(e.instances[1].targets.at(-1), 3400);
  assert.equal(e.instances[1].navigationOptions.immediate, true);
  cleanup();
  assert.equal(e.reads.size, 0);
  for (const method of ['pause', 'resume', 'restore']) assert.equal(e.navigation[method], undefined);
});

test('Lenis uses Motion read frames and publishes actual native positions without a second interpolator', (t) => {
  const e = environment(t);
  e.attach();
  const instance = e.instances[0];
  assert.equal(instance.options.autoRaf, false);
  assert.equal(instance.options.smoothWheel, true);
  assert.equal(instance.options.syncTouch, false, 'touch keeps native inertia');
  assert.equal(instance.options.lerp, .18);
  assert.equal(instance.options.anchors, false, 'one accessible anchor handler owns navigation');
  assert.equal(e.value(), 125);
  instance.pendingY = 201;
  e.frame(1234);
  assert.deepEqual(instance.times, [1234], 'Motion timestamps are forwarded in milliseconds');
  assert.equal(e.value(), 201, 'publish the browser position instead of the emitted destination');
  e.nativeScroll(345);
  assert.equal(e.value(), 345, 'native keyboard, touch and scrollbar scrolling still update the source');
  assert.equal(e.reads.size, 1);
});

test('reduced motion and hidden tabs release Lenis, retain native fallback and resume from the actual restored position', (t) => {
  const e = environment(t, { reduced: true });
  e.attach();
  assert.equal(e.instances.length, 0);
  assert.equal(e.reads.size, 0);
  e.nativeScroll(400);
  assert.equal(e.value(), 400);
  e.motion(false);
  const instance = e.instances[0];
  assert.equal(e.reads.size, 1);
  const staleFrame = [...e.reads][0];
  e.visibility('hidden');
  assert.ok(instance.destroyed);
  assert.equal(e.reads.size, 0);
  staleFrame({ timestamp: 9999 });
  assert.deepEqual(instance.times, []);
  e.browser.scrollY = 620;
  e.visibility('visible');
  assert.equal(e.value(), 620);
  assert.equal(e.instances.length, 2);
  staleFrame({ timestamp: 10000 });
  assert.equal(e.instances[1].times.length, 0, 'a stale frame cannot tick the replacement instance');
  e.motion(true);
  assert.ok(e.instances[1].destroyed);
  assert.equal(e.reads.size, 0);
});

test('fragment navigation keeps the hash and defers focus until completion and Motion postRender', (t) => {
  const e = environment(t);
  const focusCalls = [];
  const about = { focus: (options) => focusCalls.push(options) };
  e.targets.set('about', about);
  e.attach();
  const event = e.click('#about');
  assert.ok(event.defaultPrevented, 'the native fragment jump must not race Lenis');
  assert.deepEqual(e.instances[0].targets, [about]);
  assert.deepEqual(e.history, ['#about']);
  assert.deepEqual(focusCalls, [], 'About focus must not hide the traveling portrait');
  const options = e.instances[0].navigationOptions;
  assert.equal(options.duration, .9);
  assert.equal(options.lock, false, 'user input may interrupt the route');
  assert.deepEqual([0, .25, .5, .75, 1].map(options.easing), [0, .0625, .5, .9375, 1]);
  options.onComplete();
  assert.deepEqual(focusCalls, [], 'completion in read must allow the final update/render first');
  e.frame();
  assert.deepEqual(focusCalls, [{ preventScroll: true }]);
  e.click('#about');
  assert.deepEqual(e.history, ['#about'], 'repeated navigation does not add duplicate history entries');
  for (const [href, options] of [['#missing', {}], ['#%ZZ', {}], ['/elsewhere', {}], ['#about', { ctrlKey: true }], ['#about', { button: 1 }]]) {
    assert.equal(e.click(href, options).defaultPrevented, false);
  }
  e.motion(true);
  assert.equal(e.click('#about').defaultPrevented, false, 'reduced motion uses normal browser fragment navigation');
});

test('pressing CV holds the current scroll position and one click keeps the native PDF download', (t) => {
  const e = environment(t);
  e.attach();
  const instance = e.instances[0];
  const cv = { blur() { throw new Error('CV focus must not be removed to repair scroll'); } };
  e.page.activeElement = cv;
  instance.pendingY = 900;
  assert.equal(e.pressResume().defaultPrevented, false);
  assert.equal(instance.stops, 1);
  assert.equal(instance.starts, 1);
  const click = e.click(resume.url, {}, { hasAttribute: (name) => name === 'download' });
  assert.equal(click.defaultPrevented, false, 'the first click is available to the browser download action');
  assert.equal(e.page.activeElement, cv, 'pointer focus does not need a blur or second click');
  assert.deepEqual(instance.targets, [], 'downloading does not start another anchor animation');
  assert.deepEqual(e.history, []);
  e.frame();
  assert.equal(e.value(), 125, 'residual wheel inertia cannot move the target between press and release');
  e.nativeScroll(0); e.frame();
  assert.equal(e.value(), 0, 'the next manual reverse scroll remains connected to the shared source');
  assert.equal(e.reads.size, 1);
});

test('a CV press cancels an unfinished anchor handoff without stealing download focus', (t) => {
  const e = environment(t);
  let focused = 0;
  e.targets.set('about', { focus() { focused++; } });
  e.attach();
  e.click('#about');
  const instance = e.instances[0];
  const oldComplete = instance.navigationOptions.onComplete;
  oldComplete();
  assert.equal(e.postRenders.size, 1);
  assert.equal(e.pressResume().defaultPrevented, false);
  e.click(resume.url, {}, { hasAttribute: (name) => name === 'download' });
  oldComplete(); e.frame();
  assert.equal(focused, 0);
  assert.equal(e.postRenders.size, 0);
  assert.equal(instance.stops, 1);
  assert.deepEqual(e.history, ['#about'], 'CV must not add a fragment history entry');
});

test('CV remains a native link in reduced motion and a secondary press does not stop normal wheel motion', (t) => {
  const e = environment(t, { reduced: true });
  e.attach();
  assert.equal(e.pressResume().defaultPrevented, false);
  assert.equal(e.click(resume.url, {}, { hasAttribute: (name) => name === 'download' }).defaultPrevented, false);
  assert.equal(e.instances.length, 0);
  assert.equal(e.reads.size, 0);
  e.motion(false);
  const instance = e.instances[0];
  instance.pendingY = 300;
  e.pressResume(2); e.frame();
  assert.equal(instance.stops, undefined);
  assert.equal(e.value(), 300);
});

test('native navigation keys cancel wheel inertia without intercepting editing or keyboard defaults', (t) => {
  const e = environment(t);
  e.attach();
  const instance = e.instances[0];
  instance.pendingY = 900;
  assert.equal(e.key('PageDown').defaultPrevented, false);
  assert.equal(instance.stops, 1);
  assert.equal(instance.starts, 1);
  e.nativeScroll(425);
  e.frame();
  assert.equal(e.value(), 425, 'the old wheel target cannot pull a keyboard scroll back');
  e.key('ArrowDown', true);
  assert.equal(instance.stops, 1, 'editable arrow keys remain owned by their control');
  e.key('Tab', true);
  assert.equal(instance.stops, 2, 'focus navigation is allowed to escape an editable field');
});

test('Home and About navigate to shared portrait endpoints, with CSS offsets applied once in flow', (t) => {
  const e = environment(t);
  const about = { focus() {}, getBoundingClientRect: () => ({ top: 975 }) };
  e.targets.set('about', about);
  e.targets.set('home', { focus() {} });
  e.navigation.about = { end: 1500, arrival: 900, pinned: true };
  e.attach();
  const instance = e.instances[0];
  e.click('#about');
  assert.equal(instance.targets.at(-1), 1500, 'desktop reaches the end of the reveal, beyond the section anchor');
  e.click('#home');
  assert.equal(instance.targets.at(-1), 0);
  e.navigation.about.pinned = false;
  e.click('#about');
  assert.equal(instance.targets.at(-1), 1004, 'flow anchor = 975 + 125 - 80 - 16');
  e.navigation.about.arrival = 1100;
  e.click('#about');
  assert.equal(instance.targets.at(-1), 1100, 'the portrait arrives before its fallback becomes visible');
});

const interruptions = {
  wheel: (e) => e.browser.dispatchEvent(new Event('wheel', { cancelable: true })),
  touch: (e) => e.browser.dispatchEvent(new Event('touchstart', { cancelable: true })),
  pointer: (e) => e.browser.dispatchEvent(new Event('pointerdown', { cancelable: true })),
  focus: (e) => e.page.dispatchEvent(new Event('focusin')),
  resize: (e) => e.browser.dispatchEvent(new Event('resize')),
  history: (e) => e.browser.dispatchEvent(new Event('popstate')),
  keyboard: (e) => assert.equal(e.key('Tab').defaultPrevented, false),
  hidden: (e) => e.visibility('hidden'),
  reduced: (e) => e.motion(true),
  pageshow: (e) => e.browser.dispatchEvent(new Event('pageshow')),
  cleanup: (e, cleanup) => cleanup(),
};
for (const [name, interrupt] of Object.entries(interruptions)) {
  test(`${name} interruption cancels a pending focus handoff and rejects stale completion`, (t) => {
    const e = environment(t);
    let focused = 0;
    e.targets.set('about', { focus() { focused++; } });
    const cleanup = e.attach();
    e.click('#about');
    const complete = e.instances[0].navigationOptions.onComplete;
    complete();
    const staleFocus = [...e.postRenders][0];
    interrupt(e, cleanup);
    assert.equal(e.postRenders.size, 0);
    complete(); staleFocus(); e.frame();
    assert.equal(focused, 0, 'the old request cannot steal focus after user input or teardown');
  });
}

test('a newer anchor cancels the old route and synchronous completion still waits for postRender', (t) => {
  const e = environment(t);
  const focused = [];
  e.targets.set('about', { focus() { focused.push('about'); } });
  e.targets.set('home', { focus() { focused.push('home'); } });
  e.attach();
  const instance = e.instances[0];
  e.click('#about');
  const oldComplete = instance.navigationOptions.onComplete;
  instance.scrollTo = (target, options) => {
    assert.equal(target, 0);
    options.onComplete();
  };
  e.click('#home');
  oldComplete();
  assert.deepEqual(focused, []);
  e.frame();
  assert.deepEqual(focused, ['home']);
  assert.equal(instance.stops, 1, 'a newer route releases the previous destination');
});

test('manual scroll releases only navigation-owned section focus, preserving explicit child and keyboard focus', (t) => {
  const e = environment(t);
  let blurs = 0;
  const about = {
    focus() { e.page.activeElement = about; },
    blur() { blurs++; e.page.activeElement = undefined; },
  };
  e.targets.set('about', about);
  e.attach();
  function arrive() { e.click('#about'); e.instances[0].navigationOptions.onComplete(); e.frame(); }
  arrive();
  e.browser.dispatchEvent(new Event('wheel'));
  assert.equal(blurs, 1, 'the traveler can reverse on manual scroll after arrival');
  arrive();
  e.browser.dispatchEvent(new Event('popstate'));
  assert.equal(blurs, 2, 'restoring Home must not leave the traveler hidden by About focus');
  arrive();
  e.page.activeElement = { blur() { throw new Error('never blur a CV link or another child'); } };
  e.page.dispatchEvent(new Event('focusin'));
  e.browser.dispatchEvent(new Event('wheel'));
  assert.equal(blurs, 2);
  arrive();
  e.key('Tab');
  e.browser.dispatchEvent(new Event('wheel'));
  assert.equal(blurs, 2, 'keyboard-owned focus keeps the accessibility fallback');
});

test('Back and Forward restoration cancel an old smooth target without overriding the restored browser position', (t) => {
  const e = environment(t);
  e.attach();
  const instance = e.instances[0];
  for (const restored of [60, 470]) {
    instance.pendingY = 900;
    const event = new Event('popstate', { cancelable: true });
    e.browser.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false, 'browser history and scroll restoration remain native');
    e.nativeScroll(restored);
    e.frame();
    assert.equal(e.value(), restored, 'the old animation must not pull the browser away from the restored entry');
    assert.equal(instance.targetScroll, restored, 'the next wheel event starts from restored position even if its native event was skipped');
    assert.equal(e.reads.size, 1, 'history alignment is a one-off read on the existing Motion clock');
  }
  assert.equal(instance.stops, 2);
  assert.equal(instance.starts, 2);
});

test('resize, pageshow and StrictMode cleanup do not retain stale frames or listeners', (t) => {
  const e = environment(t);
  const cleanup = e.attach();
  const first = e.instances[0];
  const oldFrame = [...e.reads][0];
  e.browser.dispatchEvent(new Event('resize'));
  assert.equal(first.resized, 1);
  e.browser.scrollY = 700;
  e.browser.dispatchEvent(new Event('pageshow'));
  assert.ok(first.destroyed);
  assert.equal(e.value(), 700);
  assert.equal(e.instances.length, 2);
  cleanup();
  assert.equal(e.reads.size, 0);
  assert.equal(e.listeners.size, 0);
  oldFrame({ timestamp: 800 });
  const secondCleanup = e.attach();
  e.frame(900);
  assert.deepEqual(e.instances[2].times, [900]);
  oldFrame({ timestamp: 1000 });
  assert.deepEqual(e.instances[2].times, [900]);
  secondCleanup();
  assert.equal(e.reads.size, 0);
  assert.equal(e.listeners.size, 0);
});
