import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHeroSkillsReveal } from '../src/lib/heroSkills.js';

test('six logos open in three symmetric pairs and complete within 720ms', () => {
  const reveal = createHeroSkillsReveal(6);
  assert.deepEqual(reveal.sample(0, 160, 0, false), [0, 0, 0, 0, 0, 0]);
  const first = reveal.sample(0, 160, 100, false);
  assert.ok(first[0] > first[1] && first[1] > first[2]);
  for (let index = 0; index < 3; index++) assert.equal(first[index], first[index + 3]);
  assert.deepEqual(reveal.sample(0, 160, 720, false), [1, 1, 1, 1, 1, 1]);
  assert.equal(reveal.active(), false);
  assert.deepEqual(reveal.sample(160, 160, 800, false), [0, 0, 0, 0, 0, 0]);
  assert.deepEqual(reveal.sample(0, 160, 900, false), [1, 1, 1, 1, 1, 1]);
});

test('scroll interrupts the intro from its current pose and an early reverse opens smoothly', () => {
  const reveal = createHeroSkillsReveal(6);
  reveal.sample(0, 160, 0, false);
  const pose = reveal.sample(0, 160, 140, false);
  const moved = reveal.sample(.01, 160, 150, false);
  moved.forEach((value, index) => assert.ok(Math.abs(value - pose[index]) < .00001));
  const closing = reveal.sample(60, 160, 170, false);
  const reverse = reveal.sample(59.99, 160, 180, false);
  reverse.forEach((value, index) => assert.ok(Math.abs(value - closing[index]) < .00001));
  assert.equal(reveal.active(), false);
  assert.deepEqual(reveal.sample(0, 160, 200, false), [1, 1, 1, 1, 1, 1]);
  const half = reveal.sample(80, 160, 210, false);
  reveal.sample(120, 160, 220, false);
  assert.deepEqual(reveal.sample(80, 160, 230, false), half, 'after handoff the scrub reverses exactly');
});

test('touch is shorter, restored scroll skips intro, and hidden time is excluded', () => {
  const mobile = createHeroSkillsReveal(6);
  mobile.sample(0, 96, 0, true);
  assert.deepEqual(mobile.sample(0, 96, 580, true), [1, 1, 1, 1, 1, 1]);
  assert.equal(mobile.active(), false);
  const restored = createHeroSkillsReveal(6);
  assert.deepEqual(restored.sample(400, 160, 0, false), [0, 0, 0, 0, 0, 0]);
  assert.equal(restored.active(), false);
  const reveal = createHeroSkillsReveal(6);
  reveal.sample(0, 160, 0, false);
  const before = reveal.sample(0, 160, 100, false);
  reveal.pause(100); reveal.resume(5100);
  assert.deepEqual(reveal.sample(0, 160, 5100, false), before);
  reveal.reset();
  assert.equal(reveal.active(), false);
  assert.deepEqual(reveal.sample(0, 160, 6000, false), [1, 1, 1, 1, 1, 1]);
});
