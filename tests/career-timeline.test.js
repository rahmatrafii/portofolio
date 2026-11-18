import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachCareerTimeline } from '../src/lib/careerTimeline.js';

function environment(t, { fine = true, reduced = false, hidden = false, resizeObserver = true, width = 1440 } = {}) {
  const listeners = new Set();
  function events() {
    const target = new EventTarget();
    target.addEventListener = (type, callback, options) => {
      listeners.add({ target, type, callback });
      EventTarget.prototype.addEventListener.call(target, type, callback, options);
    };
    target.removeEventListener = (type, callback) => {
      for (const listener of listeners) {
        if (listener.target === target && listener.type === type && listener.callback === callback) listeners.delete(listener);
      }
      EventTarget.prototype.removeEventListener.call(target, type, callback);
    };
    return target;
  }
  function motionValue(value) {
    const subscribers = new Set();
    let writes = 0;
    return {
      get: () => value,
      set(next) {
        if (next === value) return;
        value = next;
        writes++;
        subscribers.forEach((callback) => callback(next));
      },
      on(type, callback) {
        assert.equal(type, 'change');
        subscribers.add(callback);
        return () => subscribers.delete(callback);
      },
      subscriberCount: () => subscribers.size,
      writes: () => writes,
    };
  }
  const desktop = Object.assign(events(), { matches: fine });
  const preference = Object.assign(events(), { matches: reduced });
  const frames = new Map();
  const observers = [];
  let reads = 0;
  let resolveFonts;
  const browser = Object.assign(events(), {
    scrollY: 0,
    innerWidth: width,
    innerHeight: 900,
    matchMedia: (query) => query.includes('reduced-motion') ? preference : desktop,
    requestAnimationFrame() { throw new Error('timeline must share the Motion scheduler'); },
    visualViewport: events(),
    ResizeObserver: resizeObserver ? class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
      observe(target) { this.targets.add(target); }
      disconnect() { this.targets.clear(); this.disconnected = true; }
    } : undefined,
  });
  const document = Object.assign(events(), {
    visibilityState: hidden ? 'hidden' : 'visible',
    fonts: { ready: new Promise((resolve) => { resolveFonts = resolve; }) },
  });
  const properties = new Map();
  const boxes = { origin: 2200, height: 520, viewport: 1120, flowViewport: undefined, pitch: 420, alignment: 0, nodeSize: 16, overflow: true,
    nodeTops: [70, 330, 710, 990, 1270, 1550], flowHeight: 1800 };
  const page = {};
  const root = Object.assign(events(), {
    dataset: {}, focusVisible: false,
    matches: () => root.focusVisible,
    closest: () => page,
    style: {
      setProperty: (key, value) => properties.set(key, value),
      removeProperty: (key) => properties.delete(key),
    },
  });
  const scroll = motionValue(0);
  const motion = { x: motionValue(0), focus: Array.from({ length: 6 }, () => motionValue(0)), chapter: motionValue(0), route: motionValue(null) };
  const runway = { getBoundingClientRect() { reads++; return { top: boxes.origin - browser.scrollY }; } };
  const stage = { getBoundingClientRect() {
    reads++;
    const top = boxes.origin - browser.scrollY;
    const pin = parseFloat(properties.get('--career-pin-top') ?? 112);
    const distance = parseFloat(properties.get('--career-runway') ?? 0);
    const offset = root.dataset.timelineMode === 'horizontal'
      ? Math.max(0, Math.min(distance, browser.scrollY - boxes.origin + pin)) : 0;
    return { top: top + offset, height: boxes.height };
  } };
  const viewport = { get clientWidth() {
    return root.dataset.timelineMode === 'horizontal' ? boxes.viewport : (boxes.flowViewport ?? boxes.viewport);
  } };
  const track = {
    get scrollWidth() { return boxes.overflow ? boxes.viewport + boxes.pitch * 5 : boxes.viewport; },
    getBoundingClientRect() { reads++; return { left: 40 + motion.x.get(), width: track.scrollWidth,
      top: boxes.origin - browser.scrollY, height: boxes.flowHeight }; },
  };
  const items = Array.from({ length: 6 }, (_, index) => ({
    dataset: { chapter: index < 2 ? 'education' : 'experience' },
    getBoundingClientRect() { throw new Error('text block centers must not replace timeline node centers'); },
    querySelector(selector) {
      assert.equal(selector, '.career-node');
      return { getBoundingClientRect() {
        reads++;
        if (root.dataset.timelineMode === 'vertical') return {
          top: boxes.origin + boxes.nodeTops[index] - browser.scrollY - boxes.nodeSize / 2,
          height: boxes.nodeSize, left: 40, width: boxes.nodeSize,
        };
        return { left: 40 + motion.x.get() + boxes.viewport / 2 + boxes.alignment + index * boxes.pitch - boxes.nodeSize / 2,
          width: boxes.nodeSize };
      } };
    },
  }));
  const elements = { root, runway, stage, viewport, track, items, scroll, motion };
  const scheduler = {
    frameLoop: { update(callback) { frames.set(callback, callback); } },
    cancel: (callback) => frames.delete(callback),
  };
  globalThis.window = browser;
  globalThis.document = document;
  const cleanups = [];
  t.after(() => {
    cleanups.toReversed().forEach((cleanup) => cleanup());
    delete globalThis.window;
    delete globalThis.document;
  });
  function attach() {
    scroll.set(browser.scrollY);
    const cleanup = attachCareerTimeline(elements, scheduler);
    cleanups.push(cleanup);
    return cleanup;
  }
  function frame() {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
  }
  function move(y) { browser.scrollY = y; scroll.set(y); frame(); }
  function visibility(value) { document.visibilityState = value; document.dispatchEvent(new Event('visibilitychange')); }
  function focus(target, visible) {
    target.focusVisible = visible;
    const event = new Event('focusin');
    Object.defineProperty(event, 'target', { value: target });
    root.dispatchEvent(event);
  }
  const snapshot = () => ({ x: motion.x.get(), focus: motion.focus.map((value) => value.get()), chapter: motion.chapter.get(), mode: root.dataset.timelineMode,
    active: items.findIndex((item) => item.dataset.current === 'true'), properties: [...properties] });
  return { browser, document, desktop, preference, frames, observers, listeners, boxes, properties, elements, motion, scroll,
    reads: () => reads, attach, frame, move, visibility, focus, snapshot, resolveFonts };
}

test('every node crosses the same centered focus, including the first and final entries, and reverses exactly', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'horizontal');
  assert.equal(e.properties.get('--career-pin-top'), '190.000px');
  assert.equal(e.properties.get('--career-runway'), '2100.000px');
  assert.equal(e.snapshot().active, 0);
  assert.deepEqual(e.snapshot().focus, [1, 0, 0, 0, 0, 0]);
  e.move(2010);
  assert.equal(e.motion.x.get(), 0);
  e.move(3060);
  const middle = e.snapshot();
  assert.equal(middle.x, -1050);
  assert.equal(middle.chapter, 1);
  assert.ok(middle.active === 2 || middle.active === 3);
  assert.equal(e.frames.size, 0);
  e.frame();
  assert.deepEqual(e.snapshot(), middle);
  e.move(4110);
  assert.equal(e.motion.x.get(), -2100);
  assert.deepEqual(e.snapshot().focus, [0, 0, 0, 0, 0, 1]);
  assert.equal(e.snapshot().active, 5);
  const finalNode = e.elements.items[5].querySelector('.career-node').getBoundingClientRect();
  assert.equal(finalNode.left + finalNode.width / 2, 40 + e.boxes.viewport / 2);
  e.move(4300);
  assert.equal(e.motion.x.get(), -2100);
  assert.equal(e.elements.stage.getBoundingClientRect().top, 0, 'CSS sticky releases after the whole travel distance');
  e.move(3060);
  assert.deepEqual(e.snapshot(), middle);
  e.move(0);
  assert.equal(e.motion.x.get(), 0);
  assert.equal(e.motion.chapter.get(), 0);
});

test('wave and single light share actual scroll, stop without extra frames, reverse and clear in fallback', (t) => {
  const e = environment(t);
  const cleanup = e.attach(); e.frame();
  const first = e.motion.route.get();
  assert.equal(first.headX + e.motion.x.get(), e.boxes.viewport / 2);
  const reads = e.reads();
  e.move(2450);
  const forward = e.motion.route.get();
  assert.notEqual(forward.path, first.path);
  assert.equal(forward.headX + e.motion.x.get(), e.boxes.viewport / 2);
  assert.equal(forward.tailX, forward.headX - 90);
  const writes = e.motion.route.writes();
  e.frame(); e.move(2450);
  assert.equal(e.motion.route.writes(), writes, 'stationary actual scroll must not keep a wave running');
  assert.equal(e.reads(), reads, 'no layout or SVG geometry reads during scrub');
  e.move(2500); e.move(2450);
  const reversed = e.motion.route.get();
  assert.equal(reversed.path, forward.path);
  assert.equal(reversed.headX, forward.headX);
  assert.equal(reversed.tailX, reversed.headX + 90);
  e.preference.matches = true;
  e.preference.dispatchEvent(new Event('change'));
  assert.equal(e.motion.route.get(), null);
  cleanup();
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
});

test('the last stop can reach the center when Journey is the final section on the page', (t) => {
  const e = environment(t);
  const cleanup = e.attach(); e.frame();
  const pin = parseFloat(e.properties.get('--career-pin-top'));
  const distance = parseFloat(e.properties.get('--career-runway'));
  const endSpace = parseFloat(e.properties.get('--career-end-space'));
  const maxScroll = e.boxes.origin + e.boxes.height + distance + endSpace - e.browser.innerHeight;
  const lastStop = e.boxes.origin - pin + distance;
  assert.ok(maxScroll >= lastStop + 24, 'page bottom needs space beyond the full horizontal journey');
  e.move(lastStop);
  assert.equal(e.motion.focus.at(-1).get(), 1);
  cleanup();
  assert.equal(e.properties.size, 0);
});

test('passed and upcoming nodes dim continuously and symmetrically as they leave the central focus', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  e.move(2110);
  const before = e.snapshot();
  assert.ok(before.focus[0] > before.focus[1]);
  assert.ok(before.focus[0] < 1 && before.focus[0] > 0);
  e.move(2220);
  const between = e.snapshot();
  assert.equal(between.focus[0], between.focus[1]);
  assert.ok(between.focus[0] > 0 && between.focus[0] < .5);
  assert.deepEqual(between.focus.slice(2), [0, 0, 0, 0]);
  e.move(2221);
  const next = e.snapshot();
  assert.ok(next.focus[0] < between.focus[0] && next.focus[1] > between.focus[1]);
  assert.ok(Math.abs(next.focus[0] - between.focus[0]) < .01, 'a one-pixel scroll cannot jump the halo between entries');
  e.move(2430);
  assert.deepEqual(e.snapshot().focus, [0, 1, 0, 0, 0, 0]);
  e.move(2220);
  assert.deepEqual(e.snapshot(), between);
  e.move(2110);
  assert.deepEqual(e.snapshot(), before);
});

test('the chapter label crossfades only around the Education to Experience boundary and follows reverse scroll', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  e.move(2430);
  assert.equal(e.motion.chapter.get(), 0);
  e.move(2639);
  const before = e.motion.chapter.get();
  e.move(2640);
  assert.equal(e.motion.chapter.get(), .5);
  e.move(2641);
  assert.ok(e.motion.chapter.get() > .5 && e.motion.chapter.get() - before < .02);
  e.move(2850);
  assert.equal(e.motion.chapter.get(), 1);
  e.move(2640);
  assert.equal(e.motion.chapter.get(), .5);
});

test('measurement uses the actual node center and corrects small inset or node-scale changes without losing alignment', (t) => {
  const e = environment(t);
  e.boxes.alignment = 24;
  e.attach(); e.frame();
  assert.equal(e.motion.x.get(), -24);
  assert.equal(e.motion.focus[0].get(), 1);
  const first = e.elements.items[0].querySelector('.career-node').getBoundingClientRect();
  assert.equal(first.left + first.width / 2, 40 + e.boxes.viewport / 2);
  e.boxes.nodeSize = 28;
  e.observers[0].callback(); e.frame();
  assert.equal(e.motion.x.get(), -24);
  e.move(4110);
  assert.equal(e.motion.x.get(), -2124);
  assert.equal(e.motion.focus[5].get(), 1);
});

test('the first measurement uses the full viewport after enhancement, while tall flow cannot create a width retry loop', (t) => {
  const e = environment(t);
  e.boxes.flowViewport = 900;
  e.boxes.viewport = 1440;
  e.attach(); e.frame();
  assert.equal(e.elements.viewport.clientWidth, 1440);
  assert.equal(e.motion.x.get(), 0, 'flow width must not offset the first full-width frame');
  assert.equal(e.motion.focus[0].get(), 1);
  const firstNode = e.elements.items[0].querySelector('.career-node').getBoundingClientRect();
  assert.equal(firstNode.left + firstNode.width / 2, 40 + 1440 / 2);

  e.boxes.height = 820;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.elements.viewport.clientWidth, 900);
  const reads = e.reads();
  for (let i = 0; i < 3; i++) { e.observers[0].callback(); e.frame(); }
  assert.equal(e.reads(), reads, 'mode-dependent widths cannot defeat the fallback guard');
});

test('only the shared scroll value schedules Motion updates and scrolling does not read layout', (t) => {
  const e = environment(t);
  const cleanup = e.attach(); e.frame();
  const reads = e.reads();
  assert.equal(e.scroll.subscriberCount(), 1);
  assert.ok(![...e.listeners].some(({ type }) => type === 'scroll' || type === 'wheel'));
  e.browser.scrollY = 2710;
  e.browser.dispatchEvent(new Event('scroll'));
  assert.equal(e.frames.size, 0);
  e.scroll.set(2710);
  assert.equal(e.frames.size, 1);
  e.frame();
  e.move(2800); e.move(4110); e.move(2710);
  assert.equal(e.reads(), reads);
  const writes = e.motion.x.writes();
  e.move(2710);
  assert.equal(e.motion.x.writes(), writes);
  cleanup();
  assert.equal(e.scroll.subscriberCount(), 0);
});

test('restoration and remeasurement during pinning keep the runway document origin stable', async (t) => {
  const e = environment(t);
  e.browser.scrollY = 2710;
  e.attach(); e.frame();
  const middle = e.snapshot();
  assert.equal(middle.x, -700);
  e.observers[0].callback(); e.frame();
  assert.deepEqual(e.snapshot(), middle);
  assert.ok(e.observers[0].targets.has(e.elements.root.closest('main')), 'preceding About layout changes can invalidate the origin');
  e.boxes.origin += 100;
  e.observers[0].callback(); e.frame();
  assert.equal(e.motion.x.get(), -600);
  e.boxes.viewport = 1000;
  e.boxes.pitch = 400;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.properties.get('--career-runway'), '2000.000px');
  e.browser.dispatchEvent(new Event('pageshow')); e.frame();
  e.resolveFonts(); await Promise.resolve(); e.frame();
  e.browser.visualViewport.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.motion.x.get(), -600);
});

test('wide touch and reduced motion use complete static flow and mode changes clear horizontal values immediately', (t) => {
  const e = environment(t, { fine: false });
  e.attach();
  assert.equal(e.reads(), 0);
  assert.equal(e.frames.size, 0);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  e.desktop.matches = true;
  e.desktop.dispatchEvent(new Event('change')); e.frame(); e.move(2710);
  assert.equal(e.motion.x.get(), -700);
  e.preference.matches = true;
  e.preference.dispatchEvent(new Event('change'));
  assert.equal(e.frames.size, 0);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.motion.x.get(), 0);
  assert.deepEqual(e.snapshot().focus, [0, 0, 0, 0, 0, 0]);
  assert.equal(e.motion.chapter.get(), 0);
  assert.equal(e.properties.size, 0);
  assert.ok(e.elements.items.every((item) => item.dataset.current === undefined));
  e.preference.matches = false;
  e.preference.dispatchEvent(new Event('change')); e.frame();
  assert.equal(e.motion.x.get(), -700);
});

test('mobile has one continuous vertical light and each node glows at viewport center across both chapters', (t) => {
  const e = environment(t, { fine: false, width: 375 });
  e.browser.innerHeight = 812;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'vertical');
  assert.equal(e.motion.x.get(), 0);
  assert.equal(e.properties.has('--career-runway'), false);
  assert.equal(e.properties.has('--career-pin-top'), false);
  assert.deepEqual(e.snapshot().focus, [0, 0, 0, 0, 0, 0]);
  assert.equal(e.motion.route.get().lightOpacity, 0, 'offscreen endpoints must not appear lit');
  const reads = e.reads();
  const path = e.motion.route.get().path;
  for (let index = 0; index < e.boxes.nodeTops.length; index++) {
    e.move(e.boxes.origin + e.boxes.nodeTops[index] - 406);
    const route = e.motion.route.get();
    assert.equal(route.path, path, 'mobile rail geometry stays still while light travels');
    assert.equal(route.headY, e.boxes.nodeTops[index]);
    assert.equal(route.headX, 24);
    assert.equal(route.lightOpacity, 1);
    assert.deepEqual(e.snapshot().focus, e.boxes.nodeTops.map((value, at) => Number(at === index)));
    assert.equal(e.snapshot().active, index);
    const node = e.elements.items[index].querySelector('.career-node').getBoundingClientRect();
    assert.equal(node.top + node.height / 2, 406);
  }
  assert.equal(e.reads(), reads + 6, 'only the explicit test assertions read layout during the entire scroll');
  e.move(e.boxes.origin + 520 - 406);
  const down = e.motion.route.get();
  assert.equal(down.headY, 520, 'the light crosses the Education/Experience gap continuously');
  assert.equal(down.tailY, 600, 'arriving from below puts the tail below the head');
  e.move(e.boxes.origin + 400 - 406);
  e.move(e.boxes.origin + 520 - 406);
  assert.equal(e.motion.route.get().headY, 520);
  assert.equal(e.motion.route.get().tailY, 440);
  const stopped = e.motion.route.get();
  const snapshot = e.snapshot();
  e.frame(); e.move(e.browser.scrollY);
  assert.equal(e.motion.route.get(), stopped);
  assert.deepEqual(e.snapshot(), snapshot);
  assert.equal(e.frames.size, 0);
  assert.ok(![...e.listeners].some(({ type }) => type === 'scroll' || type === 'wheel'));
  const desired = e.boxes.origin + e.boxes.nodeTops.at(-1) - 406;
  const maxScroll = e.boxes.origin + e.boxes.flowHeight + parseFloat(e.properties.get('--career-end-space')) - 812;
  assert.ok(desired <= maxScroll, 'the final node can reach the reading center when Journey ends the page');
});

test('mobile restore, resize and desktop round trip preserve the shared scroll position', (t) => {
  const e = environment(t, { fine: false, width: 375 });
  e.browser.innerHeight = 812;
  e.browser.scrollY = 2504;
  const cleanup = e.attach(); e.frame();
  assert.equal(e.motion.route.get().headY, 710);
  assert.equal(e.motion.focus[2].get(), 1);
  const restored = e.motion.route.get();
  e.observers[0].callback(); e.frame();
  assert.deepEqual(e.motion.route.get(), restored);
  e.browser.innerWidth = 1440; e.browser.innerHeight = 900;
  e.desktop.matches = true;
  e.desktop.dispatchEvent(new Event('change')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'horizontal');
  assert.equal(e.motion.x.get(), -494);
  assert.equal(e.properties.get('--career-runway'), '2100.000px');
  assert.ok(e.motion.route.get().path.includes(' C'), 'desktop retains its existing wave');
  e.browser.innerWidth = 375; e.browser.innerHeight = 812;
  e.desktop.matches = false;
  e.desktop.dispatchEvent(new Event('change')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'vertical');
  assert.equal(e.motion.x.get(), 0);
  assert.deepEqual(e.motion.route.get(), restored);
  assert.equal(e.properties.has('--career-runway'), false);
  cleanup();
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
  assert.equal(e.scroll.subscriberCount(), 0);
  assert.equal(e.motion.route.get(), null);
  assert.equal(e.properties.size, 0);
});

test('mobile reduced motion, keyboard focus, hidden tabs and invalid geometry retain safe fallbacks', (t) => {
  const e = environment(t, { fine: false, width: 375, reduced: true, resizeObserver: false });
  e.browser.innerHeight = 812;
  e.browser.scrollY = 2504;
  e.attach();
  assert.equal(e.frames.size, 0);
  assert.equal(e.reads(), 0);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  e.preference.matches = false;
  e.preference.dispatchEvent(new Event('change')); e.frame();
  assert.equal(e.motion.focus[2].get(), 1);
  e.scroll.set(2510);
  const stale = [...e.frames.values()][0];
  e.visibility('hidden'); stale();
  assert.equal(e.frames.size, 0);
  assert.equal(e.motion.route.get().headY, 710);
  e.boxes.nodeTops[2] = NaN;
  e.visibility('visible'); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.motion.route.get(), null);
  e.boxes.nodeTops[2] = 710;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'vertical');
  e.preference.matches = true;
  e.preference.dispatchEvent(new Event('change'));
  assert.equal(e.motion.route.get(), null);
  assert.equal(e.motion.x.get(), 0);
  assert.equal(e.properties.size, 0);
  e.preference.matches = false;
  e.preference.dispatchEvent(new Event('change')); e.frame();
  e.focus(e.elements.root, false);
  assert.equal(e.elements.root.dataset.timelineMode, 'vertical', 'pointer focus does not cancel the mobile rail');
  e.focus(e.elements.root, true);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.motion.route.get(), null);
  assert.deepEqual(e.snapshot().focus, [0, 0, 0, 0, 0, 0]);
  e.browser.dispatchEvent(new Event('resize')); e.move(3000);
  assert.equal(e.frames.size, 0, 'keyboard reading remains in static flow');
});

test('a tall stage or non-overflowing rail stays in flow without an observer feedback loop', (t) => {
  const e = environment(t);
  e.boxes.height = 820;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  const reads = e.reads();
  for (let i = 0; i < 3; i++) { e.observers[0].callback(); e.frame(); }
  assert.equal(e.reads(), reads, 'the fallback layout cannot retrigger horizontal measurement at the same width');
  e.boxes.height = 520;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'horizontal');
  e.boxes.overflow = false;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.properties.size, 0);
});

test('focus-visible switches to persistent keyboard flow while pointer focus preserves the horizontal journey', (t) => {
  const e = environment(t);
  e.attach(); e.frame(); e.move(2710);
  e.focus(e.elements.root, false);
  assert.equal(e.elements.root.dataset.timelineMode, 'horizontal');
  e.focus(e.elements.root, true);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.motion.x.get(), 0);
  assert.equal(e.properties.size, 0);
  e.elements.root.focusVisible = false;
  e.browser.dispatchEvent(new Event('resize')); e.move(3000);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow', 'leaving focus must not add runway space beneath the next focused section');
  assert.equal(e.frames.size, 0);
});

test('keyboard fallback keeps a focused child visible after the pinned runway is removed', (t) => {
  const e = environment(t);
  e.attach(); e.frame(); e.move(2710);
  let revealed;
  const child = {
    focusVisible: false,
    matches: () => child.focusVisible,
    getBoundingClientRect: () => ({ top: -450, bottom: -400 }),
    scrollIntoView: (options) => { revealed = options; },
  };
  e.focus(child, true);
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.deepEqual(revealed, { block: 'nearest', behavior: 'instant' });
});

test('hidden tabs pause scheduling and StrictMode cleanup rejects stale frames and observers', async (t) => {
  const e = environment(t, { hidden: true, resizeObserver: true });
  const cleanup = e.attach();
  assert.equal(e.frames.size, 0);
  e.visibility('visible'); e.frame();
  e.browser.scrollY = 2710;
  e.scroll.set(2710);
  const stale = [...e.frames.values()][0];
  e.visibility('hidden');
  assert.equal(e.frames.size, 0);
  e.visibility('visible'); stale(); e.frame();
  assert.equal(e.motion.x.get(), -700);
  cleanup();
  assert.equal(e.listeners.size, 0);
  assert.equal(e.scroll.subscriberCount(), 0);
  assert.equal(e.properties.size, 0);
  assert.deepEqual(e.elements.root.dataset, {});
  assert.ok(e.observers[0].disconnected);
  const again = e.attach(); e.frame();
  const current = e.snapshot();
  stale(); e.observers[0].callback();
  assert.deepEqual(e.snapshot(), current);
  e.resolveFonts(); await Promise.resolve(); e.frame();
  again();
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
});

test('invalid geometry and missing ResizeObserver retain readable flow and can recover on resize', (t) => {
  const e = environment(t, { resizeObserver: false });
  e.boxes.viewport = 0;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'flow');
  assert.equal(e.properties.size, 0);
  e.boxes.viewport = 1120;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.timelineMode, 'horizontal');
  e.move(4110);
  assert.equal(e.motion.focus[5].get(), 1);
});
