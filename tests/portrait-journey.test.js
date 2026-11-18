import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attachPortraitJourney } from '../src/lib/portraitJourney.js';

function environment(t, { fine = true, reduced = false, hidden = false, resizeObserver = true, withSkills = false, width = 1280 } = {}) {
  const listeners = new Set();
  function events() {
    const target = new EventTarget();
    target.addEventListener = (type, callback, options) => {
      listeners.add({ target, type, callback });
      EventTarget.prototype.addEventListener.call(target, type, callback, options);
    };
    target.removeEventListener = (type, callback) => {
      for (const item of listeners) {
        if (item.target === target && item.type === type && item.callback === callback) listeners.delete(item);
      }
      EventTarget.prototype.removeEventListener.call(target, type, callback);
    };
    return target;
  }
  const motion = Object.assign(events(), { matches: reduced });
  const pointer = Object.assign(events(), { matches: fine });
  const frames = new Map();
  const observers = [];
  let layoutReads = 0;
  let resolveFonts;
  let clock = 0;
  const browser = Object.assign(events(), {
    scrollY: 0, innerHeight: 800, innerWidth: width,
    matchMedia: (query) => query.includes('reduced-motion') ? motion : pointer,
    requestAnimationFrame() { throw new Error('portrait updates must use the Motion scheduler'); },
    visualViewport: events(),
    ResizeObserver: resizeObserver ? class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
      observe(target) { this.targets.add(target); }
      disconnect() { this.disconnected = true; this.targets.clear(); }
    } : undefined,
  });
  const page = Object.assign(events(), {
    visibilityState: hidden ? 'hidden' : 'visible',
    fonts: { ready: new Promise((resolve) => { resolveFonts = resolve; }) },
  });
  const boxes = {
    source: { left: 400, top: 200, width: 400, height: 600 },
    target: { left: 450, top: 1000, width: 300, height: 500 },
    story: { left: 100, top: 1060, width: 300, height: 420 },
    details: { left: 800, top: 1060, width: 300, height: 420 },
    runway: { left: 40, top: 900, width: 1120, height: 600 },
    stage: { left: 40, top: 900, width: 1120, height: 600 },
  };
  const values = new Map();
  const storyValues = new Map();
  const writes = new Map();
  const style = (map) => ({
    setProperty: (key, value) => {
      writes.set(key, (writes.get(key) ?? 0) + 1);
      map.set(key, value);
    },
    removeProperty: (key) => map.delete(key),
  });
  function motionValue(initial, map, property) {
    let value = initial;
    const subscribers = new Set();
    return {
      get: () => value,
      set(next) {
        const previous = value;
        value = next;
        if (map) style(map).setProperty(property, next);
        if (!Object.is(previous, next)) subscribers.forEach((callback) => callback(next));
      },
      on(type, callback) {
        assert.equal(type, 'change');
        subscribers.add(callback);
        return () => subscribers.delete(callback);
      },
      subscriberCount: () => subscribers.size,
    };
  }
  const sharedScroll = motionValue(0);
  const animation = {
    x: motionValue(0, values, '--portrait-x'),
    y: motionValue(0, values, '--portrait-y'),
    scale: motionValue(1, values, '--portrait-scale'),
    arrival: motionValue(0, values, '--portrait-arrival'),
    storyX: motionValue(0, storyValues, '--about-story-x'),
    detailsX: motionValue(0, storyValues, '--about-details-x'),
    storyY: motionValue(0, storyValues, '--about-story-y'),
    detailsY: motionValue(0, storyValues, '--about-details-y'),
    opacity: motionValue(1, storyValues, '--about-reveal'),
    detailsOpacity: motionValue(1, storyValues, '--about-details-reveal'),
  };
  if (withSkills) animation.skills = Array.from({ length: 6 }, () => ({
    x: motionValue(0), y: motionValue(0), scale: motionValue(1), opacity: motionValue(0),
  }));
  const scheduler = {
    now: () => clock,
    frameLoop: { update(callback) { frames.set(callback, callback); } },
    cancel: (callback) => frames.delete(callback),
  };
  const root = { dataset: {}, style: style(storyValues) };
  function element(name) {
    return {
      getBoundingClientRect() {
        layoutReads++;
        const pinned = root.dataset.aboutLayout === 'pinned';
        const span = pinned ? parseFloat(storyValues.get('--about-runway')) : 0;
        const turn = boxes.runway.top - parseFloat(storyValues.get('--about-pin-top'));
        const hold = pinned ? Math.max(0, Math.min(span, browser.scrollY - turn)) : 0;
        const moved = ['stage', 'target', 'story', 'details'].includes(name) ? hold : 0;
        return { ...boxes[name], top: boxes[name].top + moved - browser.scrollY,
          height: boxes[name].height + (name === 'runway' ? span : 0) };
      },
    };
  }
  const elements = { root, hero: {}, navigation: {}, source: element('source'), target: element('target'),
    story: element('story'), details: element('details'), runway: element('runway'), stage: element('stage'),
    traveler: { style: style(values) }, scroll: sharedScroll, motion: animation };
  if (withSkills) elements.cards = Array.from({ length: 6 }, (_, index) => ({
    getBoundingClientRect() {
      layoutReads++;
      return { left: index < 3 ? 200 : 900, top: 300 + (index % 3) * 100 - browser.scrollY, width: 64, height: 64 };
    },
  }));
  globalThis.window = browser;
  globalThis.document = page;
  const cleanups = [];
  t.after(() => {
    for (const cleanup of cleanups.toReversed()) cleanup();
    delete globalThis.window;
    delete globalThis.document;
  });
  function attach() {
    sharedScroll.set(browser.scrollY);
    const cleanup = attachPortraitJourney(elements, scheduler);
    cleanups.push(cleanup);
    return cleanup;
  }
  function frame(elapsed = 16) {
    clock += elapsed;
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
  }
  function scroll(y) { browser.scrollY = y; sharedScroll.set(y); frame(); }
  function mode(value) { motion.matches = value; motion.dispatchEvent(new Event('change')); }
  function visibility(value) { page.visibilityState = value; page.dispatchEvent(new Event('visibilitychange')); }
  const value = (key) => parseFloat(values.get(`--portrait-${key}`));
  const storyValue = (key) => parseFloat(storyValues.get(`--about-${key}`));
  const snapshot = () => ({ photo: [...values], story: [...storyValues], mode: { ...root.dataset } });
  function assertDefaults() {
    assert.deepEqual(Object.fromEntries(Object.entries(animation).filter(([key]) => key !== 'skills').map(([key, value]) => [key, value.get()])),
      { x: 0, y: 0, scale: 1, arrival: 0, storyX: 0, detailsX: 0, storyY: 0, detailsY: 0, opacity: 1, detailsOpacity: 1 });
    assert.ok(!['--portrait-left', '--portrait-width', '--portrait-height'].some((property) => values.has(property)));
    assert.ok(!['--about-interaction', '--about-pin-top', '--about-runway', '--about-photo-width', '--about-photo-height'].some((property) => storyValues.has(property)));
    assert.equal(elements.navigation.about, undefined, 'disabled geometry must not remain a navigation destination');
  }
  return { elements, browser, page, boxes, pointer, frames, observers, listeners, values, storyValues, writes, sharedScroll, animation, assertDefaults,
    value, storyValue, snapshot, frame, scroll, mode, visibility, attach, resolveFonts, layoutReads: () => layoutReads };
}

test('navigation endpoints and the fallback fit share portrait geometry across pinned, flow and teardown', (t) => {
  const e = environment(t);
  const cleanup = e.attach(); e.frame();
  assert.deepEqual(e.elements.navigation.about, { end: 1388, arrival: 788, pinned: true });
  assert.equal(e.storyValues.get('--about-photo-width'), '300.000px');
  assert.equal(e.storyValues.get('--about-photo-height'), '450.000px', 'match uniform traveler scale rather than stretching to the 500px anchor');
  e.scroll(e.elements.navigation.about.end);
  const target = e.elements.target.getBoundingClientRect();
  assert.equal(e.value('y'), target.top + target.height - parseFloat(e.storyValues.get('--about-photo-height')));
  assert.equal(e.storyValue('reveal'), 1);
  e.pointer.matches = false;
  e.pointer.dispatchEvent(new Event('change')); e.frame();
  assert.equal(e.elements.navigation.about.pinned, false);
  assert.equal(e.elements.navigation.about.arrival, 732);
  assert.equal(e.elements.navigation.about.end, 988);
  e.mode(true);
  e.assertDefaults();
  e.mode(false); e.frame();
  assert.ok(e.elements.navigation.about);
  cleanup();
  e.assertDefaults();
});

test('the portrait lands in the center before both columns open and reverses exactly', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.aboutLayout, 'pinned');
  assert.deepEqual(['x', 'y', 'scale'].map(e.value), [0, 200, 1]);
  assert.deepEqual(['left', 'width', 'height'].map(e.value), [400, 400, 600]);
  assert.equal(e.storyValue('reveal'), 0);
  assert.equal(e.storyValues.get('--about-interaction'), 'none');
  for (const y of [100, 300, 600, 788]) {
    e.scroll(y);
    assert.equal(e.value('x'), 0, 'vertical descent retains the original horizontal center');
    assert.equal(e.storyValue('reveal'), 0, 'both columns remain hidden until the photo arrives');
  }
  assert.equal(e.value('scale'), .75);
  assert.equal(e.value('y'), 262);
  assert.equal(e.value('y') + e.browser.scrollY + e.boxes.source.height * e.value('scale'), 1500,
    'descent finishes at the centered target bottom before the columns open');
  e.scroll(1088);
  const middle = e.snapshot();
  assert.equal(e.value('x'), 0);
  assert.equal(e.value('y'), 262);
  assert.equal(e.storyValue('reveal'), .5);
  assert.equal(e.storyValue('story-x'), 19);
  assert.equal(e.storyValue('details-x'), -19);
  assert.equal(e.frames.size, 0);
  e.frame();
  assert.deepEqual(e.snapshot(), middle, 'no trailing animation runs after native scroll stops');
  e.scroll(1388);
  assert.deepEqual(['x', 'y', 'scale'].map(e.value), [0, 262, .75]);
  assert.equal(e.storyValue('story-x'), 0);
  assert.equal(e.storyValue('details-x'), 0);
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.storyValues.get('--about-interaction'), 'auto');
  e.scroll(2500);
  assert.equal(e.value('y'), -850, 'the finished photo leaves the viewport together with its stage');
  assert.equal(e.frames.size, 0);
  e.scroll(1088);
  assert.deepEqual(e.snapshot(), middle, 'reverse scroll restores the same composition');
  e.scroll(788);
  assert.equal(e.value('x'), 0);
  assert.equal(e.storyValue('reveal'), 0);
  e.scroll(0);
  assert.deepEqual(['x', 'y', 'scale'].map(e.value), [0, 200, 1]);
});

const skillSnapshot = (e) => e.animation.skills.map((card) => Object.fromEntries(Object.entries(card).map(([key, value]) => [key, value.get()])));

test('Hero logos emerge, close before descent and reopen after the photo returns', (t) => {
  const e = environment(t, { withSkills: true });
  e.attach(); e.frame();
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0 && card.scale === .45));
  e.frame(720);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 1 && card.scale === 1 && card.x === 0 && card.y === 0));
  assert.equal(e.frames.size, 0);
  const reads = e.layoutReads();
  e.scroll(80);
  const half = skillSnapshot(e);
  assert.deepEqual(['y', 'scale'].map(e.value), [200, 1]);
  e.scroll(160);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0 && card.scale === .45));
  assert.deepEqual(['y', 'scale'].map(e.value), [200, 1], 'photo holds until every logo is behind it');
  e.scroll(300);
  assert.ok(e.value('scale') < 1);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0));
  e.scroll(788);
  assert.deepEqual(['y', 'scale'].map(e.value), [262, .75]);
  e.scroll(80);
  assert.deepEqual(skillSnapshot(e), half);
  assert.deepEqual(['y', 'scale'].map(e.value), [200, 1]);
  assert.equal(e.layoutReads(), reads, 'fold and descent share cached geometry');
  assert.equal(e.frames.size, 0);
});

test('scroll can take over an unfinished logo intro without a jump or trailing animation', (t) => {
  const e = environment(t, { withSkills: true });
  e.attach(); e.frame(); e.frame(100);
  const before = skillSnapshot(e);
  e.scroll(.01);
  skillSnapshot(e).forEach((card, index) => {
    for (const key of ['x', 'y', 'scale', 'opacity']) assert.ok(Math.abs(card[key] - before[index][key]) < .02);
  });
  assert.equal(e.frames.size, 0);
  const stopped = skillSnapshot(e);
  e.frame(2000);
  assert.deepEqual(skillSnapshot(e), stopped);
  e.scroll(60); e.scroll(0);
  assert.ok(skillSnapshot(e).every((card) => card.scale === 1 && card.opacity === 1));
});

test('touch has a shorter logo fold and reduced motion shows the complete static Hero', (t) => {
  const e = environment(t, { withSkills: true, fine: false });
  e.attach(); e.frame(); e.frame(580);
  assert.ok(skillSnapshot(e).every((card) => card.scale === 1));
  e.scroll(96);
  assert.equal(e.elements.root.dataset.aboutLayout, 'flow');
  assert.equal(e.value('scale'), 1);
  assert.equal(e.value('y') + e.browser.scrollY, e.boxes.source.top);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0));
  e.mode(true);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 1 && card.scale === 1 && card.x === 0 && card.y === 0));
  assert.equal(e.frames.size, 0);
});

test('hidden tabs pause the logo intro and stale frames cannot survive cleanup', (t) => {
  const e = environment(t, { withSkills: true });
  const cleanup = e.attach(); e.frame(); e.frame(100);
  const pose = skillSnapshot(e);
  const stale = [...e.frames.values()][0];
  e.visibility('hidden'); e.frame(5000);
  assert.deepEqual(skillSnapshot(e), pose);
  e.visibility('visible'); e.frame(0);
  assert.deepEqual(skillSnapshot(e), pose);
  cleanup();
  const after = skillSnapshot(e);
  stale(); e.frame(1000);
  assert.deepEqual(skillSnapshot(e), after);
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
  assert.equal(e.sharedScroll.subscriberCount(), 0);
});

test('restoring or resizing mid-journey never restarts the logo intro or exposes hidden logos', (t) => {
  const e = environment(t, { withSkills: true });
  e.browser.scrollY = 1088;
  e.attach(); e.frame();
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0));
  assert.equal(e.frames.size, 0);
  e.boxes.source.width = 320;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 0 && Number.isFinite(card.y)));
  e.scroll(0);
  assert.ok(skillSnapshot(e).every((card) => card.opacity === 1 && card.scale === 1 && card.x === 0 && card.y === 0));
  assert.equal(e.frames.size, 0);
});

test('the shared scroll value drives Motion updates without a competing native listener', (t) => {
  const e = environment(t);
  const cleanup = e.attach(); e.frame();
  assert.equal(e.sharedScroll.subscriberCount(), 1);
  assert.ok(![...e.listeners].some((listener) => listener.type === 'scroll'));
  e.browser.scrollY = 1088;
  e.browser.dispatchEvent(new Event('scroll'));
  assert.equal(e.frames.size, 0, 'native events do not introduce a second animation source');
  assert.equal(e.value('x'), 0);
  e.sharedScroll.set(1088);
  assert.equal(e.frames.size, 1, 'the shared value schedules one Motion update');
  e.frame();
  assert.equal(e.storyValue('reveal'), .5);
  cleanup();
  assert.equal(e.sharedScroll.subscriberCount(), 0);
  const settled = e.snapshot();
  e.scroll(1200);
  assert.deepEqual(e.snapshot(), settled, 'a removed controller cannot mutate React-owned values');
  e.animation.x.set(7);
  assert.equal(e.animation.x.get(), 7, 'cleanup leaves the React-owned MotionValue usable');
});

test('CV accepts pointer input as soon as its panel appears and becomes inert only when fully hidden', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  assert.equal(e.storyValues.get('--about-interaction'), 'none');
  e.scroll(788);
  assert.equal(e.storyValues.get('--about-interaction'), 'none');
  e.scroll(848);
  assert.ok(e.storyValue('reveal') > 0 && e.storyValue('reveal') < .1);
  assert.equal(e.storyValues.get('--about-interaction'), 'auto', 'a visible CV must not wait for the 90% reveal threshold');
  e.scroll(1088);
  assert.equal(e.frames.size, 0);
  e.scroll(1388);
  assert.equal(e.storyValues.get('--about-interaction'), 'auto');
  e.scroll(1088);
  assert.equal(e.storyValues.get('--about-interaction'), 'auto', 'reverse scroll keeps the visible link usable');
  e.scroll(788);
  assert.equal(e.storyValues.get('--about-interaction'), 'none');
  e.mode(true);
  assert.equal(e.storyValues.has('--about-interaction'), false, 'the static fallback keeps native links available');
});

test('the phase join is level and the sticky stage and photo keep the same viewport alignment', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  const photoTop = () => e.value('y');
  e.scroll(787);
  const approaching = photoTop(787);
  for (const scroll of [788, 789, 900, 1088, 1300, 1388]) {
    e.scroll(scroll);
    assert.equal(photoTop(scroll), 262);
    assert.equal(e.elements.stage.getBoundingClientRect().top, 112);
  }
  assert.ok(Math.abs(approaching - 262) < .002, 'descent decelerates into the centered hold');
});

test('a small layout alignment correction happens during descent instead of a second sideways phase', (t) => {
  const e = environment(t);
  e.boxes.target.left += 4;
  e.attach(); e.frame();
  e.scroll(394);
  assert.equal(e.value('x'), 2);
  assert.equal(e.storyValue('reveal'), 0);
  e.scroll(788);
  assert.equal(e.value('x'), 4);
  const arrival = e.snapshot();
  e.scroll(1088);
  assert.equal(e.value('x'), 4, 'the reveal holds the measured target center');
  e.scroll(1388);
  assert.equal(e.value('x'), 4);
  e.scroll(788);
  assert.deepEqual(e.snapshot(), arrival);
  e.scroll(394);
  assert.equal(e.value('x'), 2);
});

test('both columns reveal within the free space beside the photo without clipping their text', (t) => {
  const e = environment(t);
  e.boxes.story.width = 324;
  e.boxes.details.left = 776;
  e.attach(); e.frame();
  assert.equal(e.storyValue('story-x'), 14);
  assert.equal(e.storyValue('details-x'), -14);
  e.scroll(1088);
  assert.equal(e.storyValue('reveal'), .5);
  const photoLeft = e.boxes.source.left + e.boxes.source.width / 2 + e.value('x') - e.boxes.source.width * e.value('scale') / 2;
  const photoRight = photoLeft + e.boxes.source.width * e.value('scale');
  assert.ok(e.boxes.story.left + e.boxes.story.width + e.storyValue('story-x') + 12 <= photoLeft);
  assert.ok(e.boxes.details.left + e.storyValue('details-x') - 12 >= photoRight);
  assert.ok(![...e.storyValues.keys()].some((key) => /clip|feather|mask/.test(key)));
  const middle = e.snapshot();
  e.scroll(1388);
  assert.equal(e.storyValue('story-x'), 0);
  assert.equal(e.storyValue('details-x'), 0);
  e.scroll(1088);
  assert.deepEqual(e.snapshot(), middle);
});

test('the reveal uses a short outward travel and arrives with fully readable text', (t) => {
  const e = environment(t);
  e.boxes.story.width = 200;
  e.boxes.details.left = 900;
  e.attach(); e.frame();
  assert.equal(e.storyValue('story-x'), 48);
  assert.equal(e.storyValue('details-x'), -48);
  e.scroll(1088);
  assert.equal(e.storyValue('story-x'), 24);
  assert.equal(e.storyValue('details-x'), -24);
  e.scroll(1328);
  const approaching = e.snapshot();
  assert.ok(e.storyValue('reveal') > .9 && e.storyValue('reveal') < 1);
  e.scroll(1388);
  assert.equal(e.storyValue('story-x'), 0);
  assert.equal(e.storyValue('details-x'), 0);
  assert.equal(e.storyValue('reveal'), 1);
  e.scroll(1328);
  assert.deepEqual(e.snapshot(), approaching, 'reverse scroll restores both columns exactly');
});

test('the fixed overlay follows raw scroll after the journey and only remeasures its size when invalidated', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  for (const scroll of [788, 1088, 1388, 1488, 1588, 2500]) e.scroll(scroll);
  assert.equal(e.value('y'), -850);
  assert.ok(e.value('y') + e.boxes.source.height * e.value('scale') < 0, 'the photo does not remain over Journey');
  assert.equal(e.value('x'), 0);
  for (const property of ['--portrait-left', '--portrait-width', '--portrait-height', '--about-pin-top', '--about-runway']) {
    assert.equal(e.writes.get(property), 1, `${property} must not be rewritten on each scroll frame`);
  }
  const writeCount = e.writes.get('--portrait-y');
  e.scroll(2500);
  assert.equal(e.writes.get('--portrait-y'), writeCount, 'a duplicate native position produces no style writes');
  e.scroll(1488);
  assert.equal(e.value('y'), 162, 'scrolling back returns to the same document-aligned position');
  assert.equal(e.frames.size, 0);
});

test('both columns share one smooth reversible progress while the centered photo holds still', (t) => {
  const e = environment(t);
  e.attach(); e.frame();
  let previousStory = e.storyValue('story-x');
  let previousDetails = e.storyValue('details-x');
  let previousReveal = 0;
  const initialStory = previousStory;
  for (let step = 0; step <= 20; step++) {
    e.scroll(788 + 600 * step / 20);
    assert.equal(e.value('x'), 0);
    assert.equal(e.value('y'), 262);
    assert.ok(e.storyValue('story-x') <= previousStory);
    assert.ok(e.storyValue('details-x') >= previousDetails);
    assert.ok(e.storyValue('reveal') >= previousReveal);
    assert.ok(Math.abs(e.storyValue('details-x') + e.storyValue('story-x')) < .001);
    assert.ok(Math.abs(e.storyValue('reveal') + e.storyValue('story-x') / initialStory - 1) < .00002);
    assert.equal(e.frames.size, 0);
    previousStory = e.storyValue('story-x');
    previousDetails = e.storyValue('details-x');
    previousReveal = e.storyValue('reveal');
  }
});

test('mobile panels reveal in separate reading areas after the photo lands and reverse without trailing motion', (t) => {
  const e = environment(t, { fine: false, width: 375 });
  e.browser.innerHeight = 812;
  e.boxes.source = { left: 64, top: 360, width: 247, height: 440 };
  e.boxes.target = { left: 57.5, top: 900, width: 260, height: 390 };
  e.boxes.story = { left: 24, top: 1390, width: 327, height: 360 };
  e.boxes.details = { left: 24, top: 1790, width: 327, height: 300 };
  e.boxes.stage.height = 950;
  e.boxes.runway.height = 950;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.aboutLayout, 'flow');
  assert.equal(e.storyValue('runway'), 0);
  assert.equal(e.storyValue('story-x'), 0);
  assert.equal(e.storyValue('details-x'), 0);
  assert.equal(e.storyValue('story-y'), 18);
  assert.equal(e.storyValue('details-y'), 16);
  e.scroll(510);
  assert.equal(e.value('x'), 0);
  assert.equal(e.storyValue('reveal'), 0);
  assert.equal(e.storyValue('details-reveal'), 0);
  assert.equal(e.value('arrival'), 1, 'both panels wait for the centered photo');
  const reads = e.layoutReads();
  e.scroll(639.92);
  assert.equal(e.value('x'), 0);
  assert.equal(e.storyValue('reveal'), 0, 'the identity does not finish offscreen');
  e.scroll(756.64);
  assert.equal(e.storyValue('reveal'), .5);
  assert.equal(e.storyValue('story-y'), 9);
  assert.equal(e.storyValue('details-reveal'), 0, 'biography waits until its own reading area');
  assert.equal(e.storyValues.get('--about-interaction'), 'auto', 'the partially visible CV remains usable');
  const identityMiddle = e.snapshot();
  e.scroll(837.84);
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.storyValue('details-reveal'), 0);
  e.scroll(1156.64);
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.storyValue('details-reveal'), .5);
  assert.equal(e.storyValue('details-y'), 8);
  const biographyMiddle = e.snapshot();
  e.frame(1000);
  assert.deepEqual(e.snapshot(), biographyMiddle, 'stationary native scroll leaves no timer or spring running');
  e.scroll(1237.84);
  assert.equal(e.storyValue('details-reveal'), 1);
  assert.equal(e.storyValue('details-y'), 0);
  e.scroll(1156.64);
  assert.deepEqual(e.snapshot(), biographyMiddle);
  e.scroll(756.64);
  assert.deepEqual(e.snapshot(), identityMiddle);
  e.scroll(675.4);
  assert.equal(e.storyValue('reveal'), 0);
  assert.equal(e.storyValues.get('--about-interaction'), 'none');
  e.scroll(2000);
  assert.equal(e.value('x'), 0);
  assert.equal(e.value('y'), -1100, 'the photo settles in the actual unpinned target and scrolls offscreen');
  assert.equal(e.storyValue('story-x'), 0);
  assert.equal(e.storyValue('details-x'), 0);
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.storyValue('details-reveal'), 1);
  assert.equal(e.layoutReads(), reads, 'both reading ranges use the existing cached measurement');
  assert.ok(![...e.values.keys()].some((key) => key.includes('rotate')), 'the photo plane has no scroll-driven rotation');
  e.pointer.matches = true;
  e.pointer.dispatchEvent(new Event('change')); e.frame();
  assert.ok(![...e.values.keys()].some((key) => key.includes('rotate')));
  e.mode(true);
  e.assertDefaults();
});

test('mobile restore and breakpoint changes resynchronize both panels and clear vertical travel on desktop', (t) => {
  const e = environment(t, { fine: false, width: 375 });
  e.boxes.story.top = 1500;
  e.boxes.details.top = 1900;
  e.boxes.stage.height = 1300;
  e.boxes.runway.height = 1300;
  e.browser.scrollY = 1276;
  const cleanup = e.attach(); e.frame();
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.storyValue('details-reveal'), .5);
  const restored = e.snapshot();
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.deepEqual(e.snapshot(), restored);
  e.browser.innerWidth = 1280;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.storyValue('story-y'), 0);
  assert.equal(e.storyValue('details-y'), 0);
  assert.equal(e.storyValue('details-reveal'), e.storyValue('reveal'));
  e.browser.innerWidth = 375;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.deepEqual(e.snapshot(), restored, 'returning to mobile uses the current position rather than replaying entry');
  cleanup();
  e.assertDefaults();
  assert.equal(e.listeners.size, 0);
  assert.equal(e.sharedScroll.subscriberCount(), 0);
});

test('a tall desktop stage also uses the compact range instead of a long pinned range', (t) => {
  const e = environment(t);
  e.boxes.stage.height = 900;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.aboutLayout, 'flow');
  e.scroll(1000);
  assert.equal(e.storyValue('story-x'), 0, 'the short flow range has completed');
  assert.equal(e.value('y'), 50);
  assert.equal(e.storyValue('runway'), 0);
});

test('a short touch stage keeps native flow even when it fits inside the viewport', (t) => {
  const e = environment(t, { fine: false });
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.aboutLayout, 'flow');
  assert.equal(e.storyValue('runway'), 0);
  e.scroll(732);
  assert.equal(e.value('arrival'), 1);
  assert.equal(e.storyValue('reveal'), 0, 'the columns wait for the native-flow photo arrival');
  e.scroll(1000);
  assert.equal(e.storyValue('reveal'), 1);
  assert.equal(e.value('x'), 0);
  const photoBottom = e.value('y') + e.boxes.source.height * e.value('scale');
  const target = e.elements.target.getBoundingClientRect();
  assert.equal(photoBottom, target.top + target.height, 'the photo lands on the actual unpinned target');
});

test('reduced motion removes travel, pinning and all enhancement state immediately', (t) => {
  const e = environment(t, { reduced: true });
  e.attach();
  assert.equal(e.frames.size, 0);
  assert.equal(e.layoutReads(), 0);
  e.scroll(1088);
  assert.equal(e.elements.root.dataset.portraitMotion, 'false');
  assert.equal(e.values.size, 0);
  e.mode(false); e.frame();
  assert.equal(e.value('y'), 262);
  e.browser.scrollY = 1200;
  e.sharedScroll.set(1200);
  e.mode(true);
  assert.equal(e.frames.size, 0);
  assert.equal(e.elements.root.dataset.portraitMotion, 'false');
  assert.equal(e.elements.root.dataset.aboutLayout, undefined);
  e.assertDefaults();
  e.mode(false); e.frame();
  assert.equal(e.value('y'), 262, 'reenabling motion resynchronizes the fixed viewport position');
});

test('restore and resize while pinned reconstruct flow geometry without reading layout during scroll', async (t) => {
  const e = environment(t);
  e.browser.scrollY = 1088;
  e.attach(); e.frame();
  const middle = e.snapshot();
  assert.equal(e.value('y'), 262, 'initial restored scroll starts at the right viewport composition');
  const initialReads = e.layoutReads();
  assert.equal(initialReads, 6);
  assert.equal(e.observers[0].targets.size, 8);
  e.scroll(100); e.scroll(300); e.scroll(1088);
  assert.equal(e.layoutReads(), initialReads);
  e.observers[0].callback();
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.layoutReads(), initialReads + 6);
  assert.deepEqual(e.snapshot(), middle, 'remeasuring an already sticky target cannot add its hold twice');
  e.boxes.target.top = 1200;
  e.browser.dispatchEvent(new Event('pageshow')); e.frame();
  e.scroll(2500);
  assert.equal(e.value('y'), -650);
  e.resolveFonts(); await Promise.resolve(); e.frame();
  e.browser.visualViewport.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.layoutReads(), initialReads + 24);
});

test('invalid geometry and unavailable ResizeObserver preserve a visible static fallback until resize', (t) => {
  const e = environment(t, { resizeObserver: false });
  e.boxes.source.width = 0;
  e.attach(); e.frame();
  assert.equal(e.elements.root.dataset.portraitMotion, 'false');
  assert.equal(e.elements.root.dataset.aboutLayout, undefined);
  e.assertDefaults();
  e.boxes.source.width = 400;
  e.browser.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.elements.root.dataset.portraitMotion, 'true');
});

test('mid-scroll resize can leave pinning and still land exactly in the new landscape target', (t) => {
  const e = environment(t);
  e.attach(); e.frame(); e.scroll(1088);
  const previousReads = e.layoutReads();
  e.browser.innerHeight = 375;
  e.pointer.matches = false;
  e.boxes.source = { left: 315, top: 358, width: 182, height: 248 };
  e.boxes.target = { left: 256, top: 694, width: 300, height: 466.666667 };
  e.boxes.runway.top = 620;
  e.boxes.stage.top = 620;
  e.boxes.stage.height = 900;
  e.boxes.runway.height = 900;
  e.browser.dispatchEvent(new Event('resize'));
  e.browser.visualViewport.dispatchEvent(new Event('resize')); e.frame();
  assert.equal(e.layoutReads(), previousReads + 6);
  assert.equal(e.elements.root.dataset.aboutLayout, 'flow');
  assert.equal(e.storyValue('runway'), 0);
  assert.ok([...e.values.values()].every((value) => Number.isFinite(parseFloat(value))));
  e.scroll(2500);
  const { source, target } = e.boxes;
  const scale = e.value('scale');
  const left = source.left + source.width / 2 + e.value('x') - source.width * scale / 2;
  const bottom = e.value('y') + e.browser.scrollY + source.height * scale;
  assert.ok(Math.abs(left - target.left) < .002);
  assert.ok(Math.abs(bottom - target.top - target.height) < .002);
  assert.deepEqual(['left', 'width', 'height'].map(e.value), [315, 182, 248]);
  assert.ok(![...e.values.keys()].some((key) => key.includes('rotate')));
  e.scroll(0);
  assert.deepEqual(['x', 'y', 'scale'].map(e.value), [0, 358, 1]);
});

test('hidden tabs cancel frames and cleanup rejects late callbacks across StrictMode remounts', async (t) => {
  const e = environment(t, { hidden: true });
  const cleanup = e.attach();
  assert.equal(e.frames.size, 0);
  e.visibility('visible'); e.frame();
  e.browser.scrollY = 1088;
  e.sharedScroll.set(1088);
  const staleFrame = [...e.frames.values()][0];
  e.visibility('hidden');
  assert.equal(e.frames.size, 0);
  e.visibility('visible'); staleFrame();
  e.browser.scrollY = 1000;
  e.sharedScroll.set(1000);
  assert.equal(e.frames.size, 1);
  e.frame(); e.scroll(1088);
  assert.equal(e.value('y'), 262);
  cleanup();
  assert.equal(e.listeners.size, 0);
  e.assertDefaults();
  assert.deepEqual(e.elements.root.dataset, {});
  assert.ok(e.observers[0].disconnected);
  const cleanupAgain = e.attach(); e.frame();
  const current = e.snapshot();
  staleFrame(); e.observers[0].callback();
  e.resolveFonts(); await Promise.resolve();
  assert.deepEqual(e.snapshot(), current);
  assert.equal(e.frames.size, 1, 'only the current fonts callback may schedule');
  cleanupAgain();
  assert.equal(e.frames.size, 0);
  assert.equal(e.listeners.size, 0);
});
