# Prompt awan Hero editorial (arsip, bukan runtime)

Dibuat 15 November 2026 melalui built-in imagegen, transparent_background: true.
Input referensi: assets/source/hero-editorial-reference.png. Referensi hanya
menentukan karakter awan; foto, teks dan logo tetap elemen React terpisah.
Hasil sumber: assets/source/cloud-left.png dan cloud-right.png (1024 x 1536 RGBA).
WebP responsif: public/images/cloud-{left,right}-{600,1024}.webp.
Aset ini sudah diganti kembali dengan cloud-bank lama atas permintaan pengguna.
Hasil tetap diarsipkan; pipeline images:optimize kini hanya mengolah awan runtime.

## Kiri

```text
Use case: photorealistic-natural. Asset type: production transparent cloud bank for an animated portfolio hero.
The input image is a WEBSITE MOCKUP used ONLY as reference for the photographic white clouds. Extract/recreate the natural cloud character, not the interface.
Generate ONLY one tall side-bank of HD photorealistic white cumulus clouds on a genuinely transparent alpha background. Portrait canvas about 2:3, highly detailed, luminous sunlit white billowing tops, airy soft wisps, cool pale blue shadows, soft diffuse daylight. Match the majestic rising cloud towers at the outside edges of the reference, not a horizontal ribbon. The mass rises from the bottom edge up the outer side of the canvas, with irregular rounded peaks and generous transparent sky on the inner side and at the top. Full lower body cloud volume, with wispy feathered edges that dissolve to alpha; avoid any straight cut or artificial rectangular edge except the bottom where the cloud may continue out of frame. These layers will be composited on #9dcbea to #eff6fb pale blue sky.
NO person, face, jacket, typography, logo, card, navigation, UI, letters, birds, horizon, ocean, landscape, mountains, sun disc, solid blue sky, black background, white background, checkerboard baked into pixels, watermarks or illustration. Preserve finely translucent edges and actual transparency. High resolution with natural photographic cloud micro-detail.
Composition: the cloud bank is anchored along the LEFT side and lower-left of the portrait canvas, rising high at the extreme left and sloping down toward the lower RIGHT. Keep the upper-right 45% of canvas mostly fully transparent. Separate natural cloud turrets with light and shadow; not a fluffy solid wall. Show only this LEFT bank.
```

## Kanan

```text
Use case: photorealistic-natural. Asset type: production transparent cloud bank for an animated portfolio hero.
The input image is a WEBSITE MOCKUP used ONLY as reference for the photographic white clouds. Extract/recreate the natural cloud character, not the interface.
Generate ONLY one tall side-bank of HD photorealistic white cumulus clouds on a genuinely transparent alpha background. Portrait canvas about 2:3, highly detailed, luminous sunlit white billowing tops, airy soft wisps, cool pale blue shadows, soft diffuse daylight. Match the majestic rising cloud towers at the outside edges of the reference, not a horizontal ribbon. The mass rises from the bottom edge up the outer side of the canvas, with irregular rounded peaks and generous transparent sky on the inner side and at the top. Full lower body cloud volume, with wispy feathered edges that dissolve to alpha; avoid any straight cut or artificial rectangular edge except the bottom where the cloud may continue out of frame. These layers will be composited on #9dcbea to #eff6fb pale blue sky.
NO person, face, jacket, typography, logo, card, navigation, UI, letters, birds, horizon, ocean, landscape, mountains, sun disc, solid blue sky, black background, white background, checkerboard baked into pixels, watermarks or illustration. Preserve finely translucent edges and actual transparency. High resolution with natural photographic cloud micro-detail.
Composition: the cloud bank is anchored along the RIGHT side and lower-right of the portrait canvas, rising high at the extreme right and sloping down toward the lower LEFT. Keep the upper-left 45% of canvas mostly fully transparent. Use an organic different silhouette, with two prominent luminous cloud towers and soft wisps, not a mirrored copy. Show only this RIGHT bank.
```

