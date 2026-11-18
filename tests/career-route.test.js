import assert from 'node:assert/strict';
import { test } from 'node:test';
import { careerNodeY, createCareerRoute, createCareerVerticalRoute } from '../src/lib/careerRoute.js';

const centers = [600, 1020, 1440, 1860, 2280, 2700];
const routeAt = (x, direction = 1) => createCareerRoute(centers, 1440, x, direction, 3540);
const curves = (path) => [...path.matchAll(/C([^C]+)/g)].map((match) => match[1].trim().split(/\s+/).map(Number));

test('vertical light stays on one fixed rail, clamps its endpoints and reverses the tail', () => {
  const stops = [70, 330, 710, 990, 1270, 1550];
  const down = createCareerVerticalRoute(stops, 1800, 520, 1);
  const up = createCareerVerticalRoute(stops, 1800, 520, -1);
  assert.equal(down.path, 'M24 70 L24 1550');
  assert.equal(up.path, down.path);
  assert.equal(down.headY, up.headY);
  assert.equal(down.tailY, 440);
  assert.equal(up.tailY, 600);
  assert.equal(down.viewBox, '0 0 48 1800');
  for (const point of stops) {
    assert.equal(createCareerVerticalRoute(stops, 1800, point, 1).headY, point);
    assert.equal(createCareerVerticalRoute(stops, 1800, point, 1).lightOpacity, 1);
  }
  const before = createCareerVerticalRoute(stops, 1800, -100, 1);
  const after = createCareerVerticalRoute(stops, 1800, 1700, -1);
  assert.equal(before.headY, 70); assert.equal(before.tailY, 70);
  assert.equal(after.headY, 1550); assert.equal(after.tailY, 1550);
  assert.equal(before.lightOpacity, 0); assert.equal(after.lightOpacity, 0);
});

test('the wave changes shape with scroll while every node and its tangent stay fixed', () => {
  const first = routeAt(600);
  const moved = routeAt(870);
  assert.notEqual(first.path, moved.path, 'actual geometry must deform, not only shift or fade');
  for (const route of [first, moved, routeAt(2300)]) {
    const segments = curves(route.path);
    centers.forEach((x, index) => {
      const incoming = segments.find((curve) => curve[4] === x);
      assert.ok(incoming);
      assert.equal(incoming[5], careerNodeY(index));
      assert.equal(incoming[3], careerNodeY(index), 'horizontal tangent avoids a cusp at the fixed stop');
    });
    assert.ok(!route.path.includes('NaN'));
    assert.equal(segments.length, 56, 'one small rail keeps the paint geometry bounded');
  }
});

test('one light stays on the wave, crosses every node continuously and reverses its trail', () => {
  for (let index = 0; index < centers.length; index++) {
    const x = centers[index];
    const at = routeAt(x);
    assert.equal(at.headX, x);
    assert.equal(at.headY, careerNodeY(index));
    assert.equal(at.tailX, x - 90);
    assert.ok(at.light.endsWith(`${x} ${careerNodeY(index)}`));
    const before = routeAt(x - .01);
    const after = routeAt(x + .01);
    assert.ok(Math.abs(before.headY - after.headY) < .01, 'no light jump at segment or chapter boundaries');
    const reversed = routeAt(x, -1);
    assert.equal(reversed.path, at.path, 'wave geometry depends on position rather than elapsed time or direction');
    assert.equal(reversed.headX, at.headX);
    assert.equal(reversed.headY, at.headY);
    assert.equal(reversed.tailX, x + 90);
  }
  assert.deepEqual(routeAt(1410), routeAt(1410), 'stationary scroll produces exactly the same frame');
});

test('deformation stays within eight pixels of its resting curve across the full journey', () => {
  for (let x = centers[0]; x <= centers.at(-1); x += 7) {
    const route = routeAt(x);
    const index = Math.min(centers.length - 2, Math.floor((x - centers[0]) / 420));
    const t = (x - centers[index]) / 420;
    const base = careerNodeY(index) + (careerNodeY(index + 1) - careerNodeY(index)) * t * t * (3 - 2 * t);
    assert.ok(Math.abs(route.headY - base) <= 8.001);
    assert.ok(route.headY > 0 && route.headY < 48, 'wave stays clear of copy and viewport clipping');
  }
});

test('the traveling head follows the rendered cubic rail within a small fraction of one pixel', () => {
  for (let x = centers[0]; x <= centers.at(-1); x += 5) {
    const route = routeAt(x);
    const start = route.path.match(/^M(-?[\d.]+) (-?[\d.]+)/);
    let px = Number(start[1]);
    let py = Number(start[2]);
    for (const [ax, ay, bx, by, ex, ey] of curves(route.path)) {
      if (x >= px && x <= ex) {
        const t = (x - px) / (ex - px);
        const y = (1 - t) ** 3 * py + 3 * (1 - t) ** 2 * t * ay + 3 * (1 - t) * t * t * by + t ** 3 * ey;
        assert.ok(Math.abs(route.headY - y) < .04, `light detached from curve at ${x}`);
        break;
      }
      px = ex;
      py = ey;
    }
  }
});
