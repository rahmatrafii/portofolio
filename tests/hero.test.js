import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resume } from '../src/data/portfolio.js';
import { career } from '../src/data/career.js';

test('all rendered navigation and hero actions have real destinations and portrait variants exist', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx');
    const html = renderToStaticMarkup(createElement(App));
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    assert.equal(ids.size, [...html.matchAll(/\bid="([^"]+)"/g)].length, 'IDs must stay unique across all sections');
    for (const [, id] of html.matchAll(/href="#([^"]*)"/g)) assert.ok(ids.has(id), `Missing target #${id}`);
    for (const [, id] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) assert.ok(ids.has(id), `Missing accessible target #${id}`);
    assert.match(html, /Tentang saya/);
    const aboutHeading = html.match(/<h2 id="about-heading">([\s\S]*?)<\/h2>/)[1]
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(aboutHeading, 'Halo, saya Rahmat Rafi Indrayani.', 'full name must retain natural readable spacing');
    assert.match(html, /class="marker-dot" aria-hidden="true"><\/span>Rahmat Rafi Indrayani/);
    assert.match(html, /class="about-sky" aria-hidden="true"/, 'birds remain decorative');
    const aboutMarkup = html.match(/<section class="about"[\s\S]*?<\/section>/)[0];
    assert.equal([...aboutMarkup.matchAll(/class="bird-flight"/g)].length, 4, 'About keeps its original four independent birds');
    assert.equal([...aboutMarkup.matchAll(/class="bird-flight bird-flight-near"/g)].length, 1, 'About adds one separate near-camera bird');
    assert.match(aboutMarkup, /--bird-size:64px[\s\S]*?--bird-blur:1.75px/);
    assert.match(html, /class="about-identity"[\s\S]*class="about-portrait"[\s\S]*class="about-story"/, 'identity, portrait and biography retain a readable source order');
    assert.doesNotMatch(html, /href="#skills"|id="skills"|Lihat eksplorasi|skills-section|project-demo-badge/, 'removed lab and all incoming links must stay absent');
    assert.doesNotMatch(html, /Jelajahi teknologi &amp; ide/);
    assert.ok(html.includes(`href="${resume.url}" download="${resume.fileName}"`), 'CV uses a native download link');
    assert.match(html, /Unduh CV/);
    const cv = readFileSync(new URL(`../public${resume.url}`, import.meta.url));
    assert.equal(cv.subarray(0, 5).toString(), '%PDF-', 'download must reference a real PDF');
    assert.doesNotMatch(html, />Contact</);
    assert.match(html, />Projects</);
    assert.equal([...html.matchAll(/<section\b/g)].length, 5);
    assert.match(html, /href="#journey"/, 'the new timeline has a real navigation target');
    assert.match(html, /id="about"[\s\S]*id="journey"[\s\S]*id="projects"[\s\S]*id="gallery"/, 'Gallery follows Projects without changing the existing section order');
    assert.equal([...html.matchAll(/class="navigation-item"/g)].length, 4);
    const careerMarkup = html.match(/<section class="career"[\s\S]*?<\/section>/)[0];
    assert.match(careerMarkup, /class="career-sky" aria-hidden="true"/);
    assert.equal([...careerMarkup.matchAll(/class="bird-flight"/g)].length, 5, 'Journey gets five decorative birds independent of the horizontal rail');
    assert.equal([...careerMarkup.matchAll(/class="bird-flight bird-flight-near"/g)].length, 1, 'Journey adds one separate near-camera bird');
    assert.match(careerMarkup, /--bird-size:72px[\s\S]*?--bird-blur:2.25px/);
    assert.match(careerMarkup, /class="career-sky"[\s\S]*class="career-window"[\s\S]*class="career-track"/, 'birds remain outside the scroll-transformed track');
    assert.equal([...careerMarkup.matchAll(/class="career-item"/g)].length, 6);
    for (const chapter of career) {
      assert.ok(careerMarkup.includes(`<h3>${chapter.title}</h3>`));
      for (const entry of chapter.entries) assert.ok(careerMarkup.includes(entry.organization));
    }
    assert.match(careerMarkup, /2024<\/time>–sekarang/);
    assert.match(careerMarkup, /PKL/);
    assert.equal([...careerMarkup.matchAll(/Developer &amp; Speaker/g)].length, 3);
    for (const id of ['gdgoc', 'mocap', 'weboender']) {
      const entry = careerMarkup.match(new RegExp(`<li class="career-item"[^>]*data-organization="${id}"[\\s\\S]*?</li>`))[0];
      assert.match(entry, /class="career-affiliation">UIN Maulana Malik Ibrahim Malang<\/p>/);
      assert.match(entry, /class="career-category">Komunitas<\/span>/);
    }
    assert.equal([...careerMarkup.matchAll(/class="career-category"/g)].length, 6, 'categories remain readable text, including PKL');
    assert.match(careerMarkup, /Perguruan tinggi/);
    assert.match(careerMarkup, /Sekolah kejuruan/);
    assert.equal([...careerMarkup.matchAll(/<img\b/g)].length, 6, 'all six supplied organization logos are rendered');
    for (const entry of career.flatMap((chapter) => chapter.entries).filter((entry) => entry.logo)) {
      assert.ok(careerMarkup.includes(`src="${entry.logo}"`));
    }
    assert.doesNotMatch(careerMarkup, /<button\b/, 'the timeline does not add redundant controls');
    assert.equal([...careerMarkup.matchAll(/class="career-diamond"/g)].length, 6);
    assert.equal([...careerMarkup.matchAll(/class="career-route"/g)].length, 1, 'one continuous wave replaces isolated per-item segments');
    assert.equal([...careerMarkup.matchAll(/class="career-light-head"/g)].length, 1, 'only one light travels between all stops');
    assert.match(careerMarkup, /<h2 class="sr-only" id="career-heading">Education &amp; Experience<\/h2>/, 'minimal layout preserves its accessible section heading');
    assert.doesNotMatch(careerMarkup, /career-header|career-chapters|career-footer|career-progress|Scroll untuk mengikuti|Pendidikan dan pengalaman yang/, 'removed visual chrome must not remain in the timeline');
    assert.doesNotMatch(html, /about-process|process-explanation|Pilih tahap pendekatan/, 'removed About controls must not remain in the interface');
    assert.equal([...html.matchAll(/alt="Rafi"/g)].length, 1, 'announce the shared portrait only once');
    assert.equal([...html.matchAll(/class="portrait-traveler"/g)].length, 1, 'only one photo participates in scroll travel');
    const heroMarkup = html.match(/<section class="hero"[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(heroMarkup, /Saya Rafi\.|hero-name|hero-action|Tentang saya/, 'Hero keeps only the role and concise introduction');
    assert.match(heroMarkup, /<h1 id="role">AI Engineer<\/h1>/);
    assert.match(heroMarkup, /<p class="hero-intro">Membangun aplikasi AI dan otomasi untuk memudahkan pekerjaan\.<\/p>/);
    assert.equal([...heroMarkup.matchAll(/class="cloud-track"/g)].length, 2, 'restore both original near/far tracks');
    assert.equal([...heroMarkup.matchAll(/src="\/images\/hero-cloud-bank-2000.webp"/g)].length, 4, 'keep two matching natural-cloud tiles in each track');
    assert.doesNotMatch(heroMarkup, /cloud-drift|cloud-layer-left|cloud-layer-right|\/images\/cloud-(left|right)-/, 'large side cloud banks must not remain in the runtime');
    assert.doesNotMatch(heroMarkup, /portrait-traveler/, 'the fixed overlay must stay outside the Hero containing blocks');
    assert.match(heroMarkup, /class="hero-portrait"[\s\S]*alt="Rafi"/, 'the primary portrait stays accessible in the static Hero');
    assert.match(html, /class="portrait-traveler" aria-hidden="true"/, 'the moving copy must remain decorative');
    assert.match(html, /class="about-portrait" aria-hidden="true"/, 'static About copy remains decorative');
    assert.match(html, /class="about-photo-fallback"/, 'About remains composed without motion enhancement');
    assert.doesNotMatch(html, /Atlas|Flowdesk|Sinyal|Konsep dummy|Jelajahi konsep/);
    for (const [, path] of html.matchAll(/src="(\/(?:images|icons)\/[^" ]+)"/g)) {
      assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing ${path}`);
    }
  } finally {
    await server.close();
  }
});

test('supplied career logos have transparent exteriors and opaque artwork', async () => {
  for (const entry of career.flatMap((chapter) => chapter.entries).filter((entry) => entry.logo)) {
    const asset = new URL(`../public${entry.logo}`, import.meta.url);
    const metadata = await sharp(asset.pathname.replace(/^\/(\w:)/, '$1')).metadata();
    assert.equal(metadata.hasAlpha, true, `${entry.id} needs transparency`);
    assert.ok(metadata.width <= 320 && metadata.height <= 160);
    const alpha = await sharp(readFileSync(asset)).extractChannel('alpha').raw().toBuffer();
    assert.equal(alpha[0], 0, `${entry.id} must not have a rectangular background`);
    assert.ok(alpha.includes(255), `${entry.id} artwork must remain opaque`);
  }
});

test('responsive WebP images preserve proportions and transparency with a smaller transfer size', async () => {
  const original = readFileSync(new URL('../public/images/portrait.png', import.meta.url));
  for (const width of [500, 800]) {
    const image = readFileSync(new URL(`../public/images/portrait-${width}.webp`, import.meta.url));
    const metadata = await sharp(image).metadata();
    assert.equal(metadata.width, width);
    assert.ok(Math.abs(metadata.height / width - 2244 / 1152) < 0.002);
    assert.equal(metadata.hasAlpha, true);
    assert.ok(image.length < original.length * 0.05, 'variant should be less than 5% of the original size');
    const alpha = await sharp(image).extractChannel('alpha').raw().toBuffer();
    assert.equal(alpha[0], 0, 'background must stay transparent');
    assert.ok(alpha.includes(255), 'subject must remain opaque');
  }
});

test('photographic cloud assets retain transparent backgrounds, HD dimensions and bounded transfer sizes', async () => {
  const source = await sharp(readFileSync(new URL('../assets/source/hero-cloud-bank.png', import.meta.url))).metadata();
  assert.equal(source.hasAlpha, true);
  assert.ok(source.width >= 2000);
  for (const [width, budget] of [[1000, 120000], [2000, 350000]]) {
    const image = readFileSync(new URL(`../public/images/hero-cloud-bank-${width}.webp`, import.meta.url));
    const metadata = await sharp(image).metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.hasAlpha, true);
    assert.ok(Math.abs(metadata.height / width - source.height / source.width) < 0.002);
    assert.ok(image.length < budget, `cloud ${width}px exceeds transfer budget`);
    const alpha = await sharp(image).extractChannel('alpha').raw().toBuffer();
    assert.equal(alpha[0], 0);
    assert.ok(alpha.some((value) => value >= 240), 'clouds must remain visible while preserving soft translucent edges');
  }
});

test('desktop and mobile bird assets preserve transparent backgrounds with small transfer sizes', async () => {
  for (const [name, width] of [['about-birds', 600], ['about-birds', 1200], ['about-birds-mobile', 600]]) {
    const image = readFileSync(new URL(`../public/images/${name}-${width}.webp`, import.meta.url));
    const metadata = await sharp(image).metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.hasAlpha, true);
    assert.ok(image.length < 100000, 'background flock must remain a small decorative asset');
    const alpha = await sharp(image).extractChannel('alpha').raw().toBuffer();
    assert.equal(alpha[0], 0, 'empty sky must stay genuinely transparent');
    assert.ok(alpha.some((value) => value > 240), 'birds must remain visible');
  }
});
