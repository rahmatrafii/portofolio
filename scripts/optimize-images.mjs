import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { galleryPhotos } from '../src/data/gallery.js';

const images = new URL('../public/images/', import.meta.url);
await mkdir(new URL('gallery/', images), { recursive: true });
for (const { file, name } of galleryPhotos) {
  for (const width of [480, 960]) {
    const output = await sharp(fileURLToPath(new URL(`../assets/gallery/${file}`, import.meta.url)))
      .autoOrient()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(fileURLToPath(new URL(`gallery/${name}-${width}.webp`, images)));
    console.log(`gallery/${name}-${width}.webp: ${output.width} x ${output.height}, ${output.size} bytes`);
  }
}
await mkdir(new URL('projects/', images), { recursive: true });
// Crop browser scrollbars and the next section; keep the original project artwork intact.
for (const [source, name, crop] of [
  ['image.png', 'business', { left: 62, top: 4, width: 1776, height: 891 }],
  ['image copy.png', 'rafniture', { left: 0, top: 4, width: 1898, height: 810 }],
  ['image copy 2.png', 'travel', { left: 0, top: 2, width: 1899, height: 878 }],
]) {
  const output = await sharp(fileURLToPath(new URL(`../assets/projects/${source}`, import.meta.url)))
    .extract(crop)
    .resize(960, 540, { fit: 'contain', background: '#ffffff' })
    .webp({ quality: 84, effort: 6 })
    .toFile(fileURLToPath(new URL(`projects/${name}.webp`, images)));
  console.log(`projects/${name}.webp: ${output.width} x ${output.height}, ${output.size} bytes`);
}
for (const width of [500, 800]) {
  const output = await sharp(fileURLToPath(new URL('portrait.png', images)))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 100, effort: 6 })
    .toFile(fileURLToPath(new URL(`portrait-${width}.webp`, images)));
  console.log(`portrait-${width}.webp: ${output.width} x ${output.height}, ${output.size} bytes`);
}

for (const [name, quality] of [['cloud-bank', 88], ['hero-cloud-bank', 80]]) {
  const cloudSource = new URL(`../assets/source/${name}.png`, import.meta.url);
  for (const width of [1000, 2000]) {
    const output = await sharp(fileURLToPath(cloudSource))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, alphaQuality: 100, effort: 6 })
      .toFile(fileURLToPath(new URL(`${name}-${width}.webp`, images)));
    console.log(`${name}-${width}.webp: ${output.width} x ${output.height}, ${output.size} bytes`);
  }
}

for (const [name, widths] of [['about-birds', [600, 1200]], ['about-birds-mobile', [600]]]) {
  for (const width of widths) {
    const output = await sharp(fileURLToPath(new URL(`../assets/source/${name}.png`, import.meta.url)))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 100, effort: 6 })
      .toFile(fileURLToPath(new URL(`${name}-${width}.webp`, images)));
    console.log(`${name}-${width}.webp: ${output.width} x ${output.height}, ${output.size} bytes`);
  }
}
