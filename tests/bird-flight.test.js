import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

test('bird sprite has twelve registered wing poses and a consistently right-facing body', async () => {
  const source = readFileSync(new URL('../assets/source/bird-flight.svg', import.meta.url));
  const runtime = readFileSync(new URL('../public/images/bird-flight.svg', import.meta.url));
  assert.deepEqual(runtime, source, 'runtime must match its editable vector source');
  assert.ok(runtime.length < 20000, 'decorative motion must stay a small download');

  const svg = runtime.toString();
  const frames = [...svg.matchAll(/<g id="frame-(\d+)" transform="translate\((\d+) 0\)">([\s\S]*?)<\/g>/g)];
  assert.equal(frames.length, 12);
  const nearWings = new Set();
  const bodies = new Set();
  for (const [index, [, id, x, frame]] of frames.entries()) {
    assert.equal(Number(id), index);
    assert.equal(Number(x), index * 128, 'body registration must not jitter between frames');
    nearWings.add(frame.match(/data-wing="near" d="([^"]+)"/)[1]);
    bodies.add(frame.match(/data-body="right" d="([^"]+)"/)[1]);
    assert.match(frame, /data-beak="right" d="M108,45 L119,47 L108,49 Z"/);
  }
  assert.equal(nearWings.size, 12, 'wing shapes must change, rather than translate one still');
  assert.equal(bodies.size, 1, 'body must remain registered throughout the wingbeat');

  const { data, info } = await sharp(runtime).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1536);
  assert.equal(info.height, 96);
  for (let frame = 0; frame < 12; frame += 1) {
    let visible = 0;
    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < 128; x += 1) {
        const alpha = data[(y * info.width + frame * 128 + x) * 4 + 3];
        if (alpha > 0) visible += 1;
        if (x === 0 || x === 127 || y === 0 || y === 95) {
          assert.equal(alpha, 0, `frame ${frame} must not clip or bleed into its neighbour`);
        }
      }
    }
    assert.ok(visible > 400, `frame ${frame} must contain its complete bird`);
  }
});
