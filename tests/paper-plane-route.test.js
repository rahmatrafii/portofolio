import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPaperPlaneRoute, attachPaperPlaneRoute } from '../src/lib/paperPlaneRoute.js';

function curves(path) {
  const commands = path.match(/[MC][^MC]+/g);
  let point = commands[0].slice(1).trim().split(/\s+/).map(Number);
  return commands.slice(1).map((command) => {
    const values = command.slice(1).trim().split(/\s+/).map(Number);
    const points = [point, values.slice(0, 2), values.slice(2, 4), values.slice(4)];
    point = points[3];
    return points;
  });
}

test('random waves and loops stay inside their safe corridor, enter from outside right and leave outside left', () => {
  const routes = new Set();
  const types = new Set();
  for (const width of [761, 1100, 1920, 2560]) {
    for (let seed = 1; seed <= 80; seed++) {
      let state = seed;
      const random = () => ((state = state * 16807 % 2147483647) - 1) / 2147483646;
      const route = createPaperPlaneRoute(width, 88, random);
      routes.add(route);
      const segments = curves(route);
      types.add(segments.length);
      assert.ok(segments[0][0][0] > width + 80);
      assert.ok(segments.at(-1)[3][0] < -80);
      const halfDiagonalWithShadow = Math.hypot(48, 38.4) / 2 + 3;
      for (const points of segments) {
        // Bézier curves lie within their control hull; the full rotating plane also fits.
        points.forEach(([x, y]) => {
          assert.ok(Number.isFinite(x) && Number.isFinite(y));
          assert.ok(y - halfDiagonalWithShadow > 0);
          assert.ok(y + halfDiagonalWithShadow < 88);
        });
      }
      for (let i = 1; i < segments.length; i++) {
        const previous = segments[i - 1], next = segments[i];
        assert.deepEqual(previous[3], next[0]);
        const a = [previous[3][0] - previous[2][0], previous[3][1] - previous[2][1]];
        const b = [next[1][0] - next[0][0], next[1][1] - next[0][1]];
        assert.ok(a[0] * b[0] + a[1] * b[1] > 0, 'the nose does not reverse abruptly at a curve join');
        assert.ok(Math.abs(a[0] * b[1] - a[1] * b[0]) < .1);
      }
      if (segments.length === 6) {
        assert.deepEqual(segments[1][0], segments[4][3], 'the looping route closes one full turn');
        assert.ok(segments[2][3][1] < segments[1][0][1]);
      }
    }
  }
  assert.equal(routes.size, 320);
  assert.deepEqual([...types].sort(), [2, 6]);
  assert.equal(createPaperPlaneRoute(0, 88), null);
  assert.equal(createPaperPlaneRoute(1920, NaN), null);
});

function scene(observer = true) {
  let box = { width: 1440, height: 88 };
  let reads = 0, writes = 0;
  const properties = new Map();
  const sky = { dataset: {}, style: {
    setProperty: (key, value) => { writes++; properties.set(key, value); },
    removeProperty: (key) => properties.delete(key),
  }, getBoundingClientRect() { reads++; return box; } };
  const plane = new EventTarget();
  const browser = new EventTarget();
  const observers = [];
  if (observer) browser.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  };
  function iteration(animationName = 'paper-plane-flight') {
    const event = new Event('animationiteration');
    Object.defineProperty(event, 'animationName', { value: animationName });
    plane.dispatchEvent(event);
  }
  return { sky, plane, browser, properties, observers, iteration,
    reads: () => reads, writes: () => writes, resize(width) { box = { width, height: 88 }; observers[0]?.callback(); browser.dispatchEvent(new Event('resize')); } };
}

for (const observer of [true, false]) {
  test(`route regeneration only happens at offscreen iteration boundaries or resize; cleanup is safe ${observer ? 'with observer' : 'with fallback'}`, () => {
    const e = scene(observer);
    const cleanup = attachPaperPlaneRoute(e, e.browser);
    assert.equal(e.sky.dataset.routeReady, 'true');
    assert.equal(e.writes(), 1);
    const reads = e.reads();
    e.iteration();
    assert.equal(e.writes(), 2);
    assert.equal(e.reads(), reads, 'iteration never reads layout');
    e.iteration('unrelated');
    assert.equal(e.writes(), 2);
    e.resize(1100);
    assert.equal(e.writes(), 3);
    e.resize(1100);
    assert.equal(e.writes(), 3, 'unchanged geometry does not reroll the path');
    cleanup();
    assert.equal(e.properties.size, 0);
    assert.equal(e.sky.dataset.routeReady, undefined);
    if (observer) assert.equal(e.observers[0].disconnected, true);
    e.iteration(); e.resize(1920);
    assert.equal(e.writes(), 3);
  });
}
