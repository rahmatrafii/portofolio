import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readSheetPose, floatSheetFrames, localSheetFrames, createSheetTransition } from '../src/lib/projectTransition.js';

const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);

function nativeScene({ controlled = false, mobile = false } = {}) {
  const animations = [];
  const stats = { maxFlights: 0 };
  function node() {
    const element = { style: { transform: '', transition: '', visibility: '', zIndex: '' }, dataset: {}, children: [],
      setAttribute() {},
      append(...children) { children.forEach((child) => { child.parent = element; element.children.push(child); });
        stats.maxFlights = Math.max(stats.maxFlights, element.children.filter((child) => child.className === 'project-transition-sheet').length); },
      remove() { if (element.parent) element.parent.children = element.parent.children.filter((child) => child !== element); },
      animate(keyframes, options) {
        let resolve, reject;
        const animation = { element, keyframes, options, active: true, done: !controlled,
          finished: controlled ? new Promise((done, fail) => { resolve = done; reject = fail; }) : Promise.resolve(),
          finish() { animation.done = true; resolve?.(); },
          cancel() { animation.active = false; reject?.(Error('cancelled')); },
        };
        animations.push(animation);
        return animation;
      },
    };
    return element;
  }
  const doc = { body: node(), createElement: node, timeline: { currentTime: 1000 } };
  const tilt = node();
  const page = node();
  const metadata = [node(), node()];
  const folder = { querySelector: () => ({ getBoundingClientRect: () => ({ top: 320, height: 320 }) }),
    querySelectorAll: () => sheets };
  const inners = [], sheets = [], classes = [];
  const sources = ['/business.webp', '/rafniture.webp', '/travel.webp', '/business.webp'];
  function transform(element) {
    return animations.findLast((animation) => animation.active && animation.done && animation.element === element
      && animation.keyframes.at(-1).transform)?.keyframes.at(-1).transform
      || element.style.transform || 'matrix(1,0,0,1,0,0)';
  }
  for (let i = 0; i < 4; i++) {
    const inner = node();
    inner.offsetWidth = 320; inner.offsetHeight = 180;
    inner.querySelector = () => ({ currentSrc: sources[i] });
    inner.getBoundingClientRect = () => {
      const y = Number(transform(inner).match(/translateY\((-?[\d.]+)px\)/)?.[1] ?? 0);
      return { left: 100 + i * 12, top: 250 + i * 18 + y, width: 320, height: 180, bottom: 430 + i * 18 + y };
    };
    const classSet = new Set();
    const sheet = Object.assign(node(), { querySelector: () => inner,
      closest: (selector) => selector === '.folder-tilt' ? tilt : folder,
      classList: { add: (name) => classSet.add(name), remove: (name) => classSet.delete(name) },
    });
    sheet.dataset.sheetIndex = String(i);
    inners.push(inner); sheets.push(sheet); classes.push(classSet);
  }
  const targets = sheets.map((_, i) => {
    const image = node();
    image.dataset.projectIndex = String(i);
    image.offsetWidth = mobile ? 327 : 584;
    image.offsetHeight = image.offsetWidth * 9 / 16;
    image.getBoundingClientRect = () => ({ left: mobile ? 24 : 100 + (i % 2) * 616,
      top: mobile ? 420 + i * 320 : 350 + Math.floor(i / 2) * 460, width: image.offsetWidth, height: image.offsetHeight });
    return image;
  });
  page.querySelectorAll = (selector) => selector.startsWith('.project-card > img') ? targets : metadata;
  const browser = { innerWidth: mobile ? 375 : 1440, innerHeight: mobile ? 812 : 900,
    getComputedStyle: (element) => ({ transform: transform(element), borderRadius: targets.includes(element) ? '14px' : '12px',
      boxShadow: targets.includes(element) ? 'none' : '0px 5px 12px rgba(22, 62, 91, .15)' }) };
  return { doc, browser, inners, sheets, animations, classes, tilt, page, targets, metadata, sources, folder, stats };
}

function parseTransform(transform) {
  const match = transform.match(/translate3d\(([-+\d.eE]+)px, ([-+\d.eE]+)px, 0\) rotate\(([-+\d.eE]+)deg\)/);
  assert.ok(match, transform);
  return { x: Number(match[1]), y: Number(match[2]), angle: Number(match[3]) };
}
function assertClean(e) {
  assert.equal(e.doc.body.children.length, 0);
  assert.ok(e.animations.every((animation) => !animation.active));
  e.inners.forEach((inner) => assert.deepEqual(inner.style, { transform: '', transition: '', visibility: '', zIndex: '' }));
  e.sheets.forEach((sheet) => assert.equal(sheet.style.zIndex, ''));
  assert.ok(e.classes.every((set) => !set.size));
  assert.deepEqual(e.tilt.style, { transform: '', transition: '', visibility: '', zIndex: '' });
  assert.deepEqual(e.page.dataset, {});
}

test('sheet geometry keeps fractional dimensions and the real resting rotation', () => {
  const angle = -8 * Math.PI / 180;
  const sheet = { querySelector: () => ({ offsetWidth: 320, offsetHeight: 180,
    getBoundingClientRect: () => ({ left: 80, top: 200, width: 342, height: 222 }) }) };
  const pose = readSheetPose(sheet, { getComputedStyle: () => ({ transform: `matrix(${Math.cos(angle)},${Math.sin(angle)},0,1,0,0)` }) });
  assert.equal(pose.cx, 251); assert.equal(pose.cy, 311);
  assert.equal(pose.width / pose.height, 16 / 9); close(pose.angle, -8);
  assert.equal(readSheetPose({ querySelector: () => null }, {}), null);
});

test('the upward path never stops or reverses between its endpoints and clears the complete rotated card', () => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    for (const index of [0, 1, 2, 3]) {
      const initial = { cx: viewport.width / 2, cy: 420, angle: -8 + index * 5, width: 320, height: 180 };
      const frames = floatSheetFrames(initial, viewport, index);
      const poses = frames.map((frame) => parseTransform(frame.transform));
      close(poses[0].x + initial.width / 2, initial.cx); close(poses[0].y + initial.height / 2, initial.cy);
      poses.forEach((pose, step) => {
        if (step) assert.ok(pose.y < poses[step - 1].y);
        assert.ok(Math.abs(pose.x + initial.width / 2 - initial.cx) <= 32);
        assert.ok(frames[step].opacity >= 0 && frames[step].opacity <= 1);
        assert.ok(!frames[step].easing, 'one easing spans the full journey instead of restarting at a seam');
        assert.doesNotMatch(frames[step].transform, /scale|perspective|translateZ/);
      });
      const last = poses.at(-1);
      const radians = last.angle * Math.PI / 180;
      const lowerEdge = last.y + initial.height / 2 + (Math.abs(initial.width * Math.sin(radians)) + Math.abs(initial.height * Math.cos(radians))) / 2;
      assert.ok(lowerEdge < -16);
      assert.ok(Math.abs(last.angle) <= 4);
      assert.equal(frames.at(-1).opacity, 0);
    }
  }
  assert.equal(floatSheetFrames(null, { width: 375, height: 812 }, 0), null);
  assert.equal(floatSheetFrames({ cx: 0, cy: 0, width: 0, height: 180, angle: 0 }, { width: 375, height: 812 }, 0), null);
});

test('inverse fan coordinates retain the exact viewport curve and hover position without a source-to-clone handoff', () => {
  for (const angle of [-8, 0, 2.7, 8]) {
    for (const resting of ['none', 'matrix(1,0,0,1,0,-14)', 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,2,-14,0,1)']) {
      const pose = { cx: 440.1, cy: 520.7, width: 320.5, height: 180.28125, angle };
      const world = floatSheetFrames(pose, { width: 1440, height: 900 }, 2);
      const local = localSheetFrames(world, pose, resting);
      const restX = resting.startsWith('matrix3d') ? 2 : 0;
      const restY = resting === 'none' ? 0 : -14;
      const cos = Math.cos(angle * Math.PI / 180), sin = Math.sin(angle * Math.PI / 180);
      const first = parseTransform(local[0].transform);
      close(first.x, restX); close(first.y, restY); close(first.angle, 0);
      local.forEach((frame, step) => {
        const actual = parseTransform(frame.transform);
        const expected = parseTransform(world[step].transform);
        const dx = actual.x - restX, dy = actual.y - restY;
        close(pose.cx + dx * cos - dy * sin, expected.x + pose.width / 2);
        close(pose.cy + dx * sin + dy * cos, expected.y + pose.height / 2);
        close(angle + actual.angle, expected.angle);
        assert.equal(frame.opacity, world[step].opacity);
      });
      const restored = parseTransform(local[0].transform);
      close(restored.x, restX); close(restored.y, restY);
    }
  }
});

for (const mobile of [false, true]) {
  test(`each original sheet has one continuous departure on ${mobile ? '375px' : 'desktop'}, with no visual clone or lift phase`, async () => {
    const e = nativeScene({ mobile });
    const stack = e.sheets.map((sheet) => sheet.style.zIndex);
    const transition = createSheetTransition(e.sheets[0], e);
    let commits = 0;
    assert.equal(await transition.leaveFolder(e.page, () => commits++), true);
    assert.equal(commits, 1);
    const flights = e.animations.filter((animation) => e.inners.includes(animation.element));
    assert.equal(flights.length, 4);
    assert.deepEqual(flights.map((animation) => e.inners.indexOf(animation.element)), [3, 2, 1, 0]);
    flights.forEach((animation) => {
      const frames = animation.keyframes.map((frame) => parseTransform(frame.transform));
      close(frames[0].x, 0); close(frames[0].y, 0); close(frames[0].angle, 0);
      frames.forEach((frame, step) => { if (step) assert.ok(frame.y < frames[step - 1].y); });
      assert.equal(animation.keyframes[0].opacity, 1);
      assert.equal(animation.keyframes.at(-1).opacity, 0);
      assert.equal(animation.options.fill, 'both');
    });
    assert.deepEqual(e.sheets.map((sheet) => sheet.style.zIndex), stack);
    assert.ok(e.inners.every((inner) => inner.style.visibility === ''));
    assert.equal(e.stats.maxFlights, 0, 'no duplicate image takes over at the folder lip');
    assert.equal(e.doc.body.children[0].children.length, 1, 'the only overlay is the page backdrop');
    await transition.reveal();
    transition.dispose(); assertClean(e);
  });
}

test('one common clock overlaps complete departures and commits only after the last sheet exits', async () => {
  const e = nativeScene({ controlled: true });
  const transition = createSheetTransition(e.sheets[1], e);
  let commits = 0;
  const pending = transition.leaveFolder(e.page, () => commits++);
  const flights = e.animations.filter((animation) => e.inners.includes(animation.element));
  assert.equal(flights.length, 4);
  assert.equal(new Set(flights.map((animation) => animation.startTime)).size, 1);
  assert.deepEqual(flights.map((animation) => animation.options.delay), [0, 80, 160, 240]);
  const scheduledCount = e.animations.length;
  for (const current of flights) {
    assert.equal(commits, 0);
    current.finish(); await flush();
    assert.equal(e.animations.length, scheduledCount, 'finishing a phase cannot start a new lift or insertion animation');
  }
  e.animations.find((animation) => animation.element === e.tilt).finish();
  const backdrop = e.animations.find((animation) => animation.element.className === 'project-transition-backdrop');
  const last = flights.at(-1);
  assert.equal(backdrop.options.delay + backdrop.options.duration, last.options.delay + last.options.duration);
  backdrop.finish();
  assert.equal(await pending, true); assert.equal(commits, 1);
  const reveal = transition.reveal();
  const blend = e.animations.at(-1);
  assert.ok(last.options.delay + last.options.duration + blend.options.duration <= 900);
  blend.finish(); await reveal;
  transition.dispose(); assertClean(e);
});

test('returning uses one native animation all the way into each original folder slot, without landing and insertion phases', async () => {
  const e = nativeScene({ controlled: true });
  const transition = createSheetTransition(e.sheets[3], e);
  let completed = false;
  const pending = transition.returnToFolder(e.page).then((result) => { completed = true; return result; });
  const flights = e.animations.filter((animation) => e.inners.includes(animation.element));
  assert.equal(flights.length, 4);
  assert.equal(new Set(flights.map((animation) => animation.startTime)).size, 1);
  flights.forEach((animation, index) => {
    const poses = animation.keyframes.map((frame) => parseTransform(frame.transform));
    assert.equal(animation.element, e.inners[index]);
    assert.equal(animation.keyframes[0].opacity, 0);
    assert.equal(animation.keyframes.at(-1).opacity, 1);
    poses.forEach((pose, step) => { if (step) assert.ok(pose.y > poses[step - 1].y); });
    close(poses.at(-1).x, 0); close(poses.at(-1).y, 0); close(poses.at(-1).angle, 0);
  });
  const scheduledCount = e.animations.length;
  flights[0].finish(); await flush();
  assert.equal(completed, false);
  assert.equal(e.animations.length, scheduledCount, 'there is no late insertion callback that can introduce a pause');
  e.animations.forEach((animation) => animation.finish());
  assert.equal(await pending, true);
  assert.equal(e.stats.maxFlights, 0);
  assert.ok(e.inners.every((inner) => inner.style.visibility === ''));
  transition.dispose(); assertClean(e);
});

for (const method of ['leaveFolder', 'returnToFolder']) {
  test(`cancelling ${method} restores original geometry and visibility and cancels pending followers`, async () => {
    const e = nativeScene({ controlled: true });
    const transition = createSheetTransition(e.sheets[0], e);
    let commits = 0;
    const pending = transition[method](e.page, () => commits++);
    const flights = e.animations.filter((animation) => e.inners.includes(animation.element));
    flights[0].finish(); await flush();
    transition.dispose(); e.animations.forEach((animation) => animation.finish());
    assert.equal(await pending, false); assert.equal(commits, 0);
    assertClean(e);
  });
}

test('missing collection slots or invalid sheet geometry fall back without hidden content', async () => {
  const e = nativeScene();
  const transition = createSheetTransition(e.sheets[0], e);
  e.targets.pop();
  assert.equal(await transition.returnToFolder(e.page), false);
  e.inners[1].offsetWidth = 0;
  e.inners[1].getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 });
  assert.equal(await transition.leaveFolder(e.page), false);
  transition.dispose(); assertClean(e);
  assert.equal(createSheetTransition(e.sheets[0], e), null);
});
