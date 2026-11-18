import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { skills, biography } from '../src/data/portfolio.js';

const root = new URL('../', import.meta.url);
const original = readFileSync(new URL('portfolio-parallax.html', root), 'utf8');

test('public portrait and font match the embedded original assets byte for byte', () => {
  for (const [mime, path] of [['image/png', 'images/portrait.png'], ['font/woff2', 'fonts/geist.woff2']]) {
    const encoded = original.match(new RegExp(`data:${mime};base64,([^"\\s)]+)`))[1];
    assert.deepEqual(readFileSync(new URL(`public/${path}`, root)), Buffer.from(encoded, 'base64'));
  }
});

test('the six Hero logos retain original motion and mobile placement while desktop positions can evolve', () => {
  const cards = [...original.matchAll(/class="skill-position" data-speed="([^"]+)" data-depth="([^"]+)" style="([^"]+)"/g)];
  assert.equal(skills.length, cards.length);
  assert.equal(skills.length, 6);
  assert.deepEqual(skills.map(({ name }) => name), ['Next.js', 'React', 'Flutter', 'TypeScript', 'VS Code', 'Node.js']);
  for (const [index, skill] of skills.entries()) {
    assert.ok(existsSync(new URL(`public${skill.icon}`, root)), `Missing ${skill.icon}`);
    assert.equal(skill.speed, Number(cards[index][1]));
    assert.equal(skill.depth, Number(cards[index][2]));
    const originalStyle = Object.fromEntries(cards[index][3].split('; ').map((part) => part.split(': ')));
    for (const property of Object.keys(originalStyle).filter((key) => key.startsWith('--mobile-') || ['--card-angle', '--stagger'].includes(key))) {
      assert.equal(skill.style[property], originalStyle[property]);
    }
    assert.ok(parseFloat(skill.style['--card-x']) > 0 && parseFloat(skill.style['--card-x']) < 100);
    assert.ok(parseFloat(skill.style['--card-y']) > 0 && parseFloat(skill.style['--card-y']) < 500);
  }
});

test('About biography stays concise and retains the AI focus', () => {
  const originalWords = [...original.matchAll(/<p>(.*?)<\/p>/g)].map((match) => match[1]).join(' ').split(/\s+/).length;
  const text = biography.join(' ');
  assert.equal(biography.length, 2);
  assert.ok(text.split(/\s+/).length < originalWords * .8);
  assert.match(text, /aplikasi AI/);
  assert.match(text, /otomasi/);
});
