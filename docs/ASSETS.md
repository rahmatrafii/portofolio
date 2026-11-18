# Aset visual

## Latar galeri (2026-11-18)

- `public/images/gallery-contours.svg`: SVG lokal buatan kode, dua kelompok
  kurva kontur dengan mask tengah kosong; opacity ditentukan CSS.
- `public/images/gallery-grain.svg`: tile monokrom 128x128, feTurbulence statis
  seed17/stitchTiles, dirender sebagai background berulang pada opacity .015.
  Filter dibatasi tile kecil, bukan filter pada viewport/foto.

Keduanya dekoratif di dalam wrapper aria-hidden yang mengabaikan pointer.
Tidak ada imagegen, gambar eksternal, animasi atau driver JS tambahan.
SVG tetap tajam pada berbagai density tanpa varian raster/resolusi.

## Galeri kegiatan (2026-11-18)

Tujuh foto asli dari `assets/gallery/` dipakai menjadi sembilan lapisan;
dua foto pertama diulang di akhir sesuai pilihan pengguna. Sumber tetap utuh.
`src/data/gallery.js` mencatat pemetaan, urutan dan teks alternatif tanpa
mengarang nama acara. Dua salinan ulang memakai alt kosong.

| Sumber | Nama runtime di public/images/gallery |
| --- | --- |
| IMG_0815.JPG | award-480/960.webp |
| 1000277882.jpg | community-480/960.webp |
| gambar wa.jpeg | poster-480/960.webp |
| IMG_2836.JPG | workshop-480/960.webp |
| IMG_0985.JPG | gathering-480/960.webp |
| IMG_3464.JPG | gdg-480/960.webp |
| IMG_3417.JPG | team-480/960.webp |

Regenerasi memakai `npm run images:optimize`: autoOrient membetulkan EXIF
(khususnya IMG_0985), resize 480/960 tanpa memperbesar sumber, WebP quality 84.
Runtime memakai srcSet/lazy loading; bingkai 4:5 melakukan crop tengah lewat
object-fit cover seperti referensi. IMG_3417 memakai object-position 15% center
agar subjek paling kiri masuk bingkai; foto lain tetap di tengah.
Tidak ada hotlink atau foto baru rekaan.

## Pratinjau Projects sementara (2026-11-16)

Pengguna meminta tiga screenshot di assets/projects dipakai ulang menjadi
empat kartu per kategori. Nama tampilan memakai Pratinjau, bukan klaim proyek
asli. PNG sumber dipertahankan; optimizer mencrop scrollbar dan potongan
section berikutnya sebelum contain ke kanvas putih 960x540, lalu WebP quality 84.
Semua kartu 16:9; gambar tidak diregangkan atau digambar ulang.

| Sumber | Runtime | Ukuran |
| --- | --- | --- |
| assets/projects/image.png | public/images/projects/business.webp | 20.798 byte |
| assets/projects/image copy.png | public/images/projects/rafniture.webp | 29.896 byte |
| assets/projects/image copy 2.png | public/images/projects/travel.webp | 30.992 byte |

Crop diperbarui 17 November 2026 dan dicatat di scripts/optimize-images.mjs:
business (62,4,1776,891), rafniture (0,4,1898,810), travel (0,2,1899,878),
masing-masing dalam urutan left/top/width/height pada PNG asli. Perbarui area
crop jika screenshot sumber diganti. Ketiga WebP baru sudah diperiksa langsung.

Regenerasi: npm run images:optimize. Bentuk folder dibuat dengan SVG inline
dan gradient CSS/SVG, tanpa gambar raster folder atau tekstur awan.

## Awan sisi Hero editorial (arsip, 2026-11-15)

Dibuat melalui **built-in imagegen** dengan alpha asli, memakai mockup yang
disetujui sebagai referensi kontur/pencahayaan. Foto, teks, logo dan navbar tidak
menjadi bagian aset. Referensi disimpan di assets/source/hero-editorial-reference.png.
Prompt final lengkap: [hero-clouds.md](prompts/hero-clouds.md).

| Sumber RGBA 1024 x 1536 | Ukuran sumber | WebP 600px | WebP 1024px |
| --- | --- | --- | --- |
| assets/source/cloud-left.png | 1.634.724 byte | public/images/cloud-left-600.webp (79.946 byte) | public/images/cloud-left-1024.webp (183.034 byte) |
| assets/source/cloud-right.png | 1.571.769 byte | public/images/cloud-right-600.webp (71.708 byte) | public/images/cloud-right-1024.webp (152.034 byte) |

Empat lapisan far/near ini pernah dipakai pada revisi editorial, lalu dihapus
dari runtime atas permintaan pengguna. Sumber/hasil tetap tersimpan, tetapi
tidak dimuat halaman dan tidak lagi diregenerasi oleh npm run images:optimize.
Encoding arsip memakai alphaQuality 100 dan quality 86.

Aset dikompositkan pada #9dcbea untuk pemeriksaan tepi/transparansi pada
output/qa/cloud-sides.png. Ini bukan screenshot halaman atau bukti FPS.
Tes pada revisi sebelumnya memeriksa alpha/dimensi/budget arsip tersebut;
tes runtime kini kembali memeriksa cloud-bank horizontal di bawah.

## Logo teknologi Hero (2026-11-15)

Hero menampilkan hanya logomark, tanpa label terlihat: Next.js, React, Flutter,
TypeScript, VS Code, Node.js. Alt tetap menamai teknologi. SVG disimpan lokal
di public/icons, tidak mengandalkan hotlink runtime. Geometri/warna merek asli
dipertahankan. Enam aset sudah dirender bersama untuk pemeriksaan bentuk;
ini bukan screenshot halaman.

| Aset | Sumber |
| --- | --- |
| nextjs.svg | [Vercel brands](https://vercel.com/geist/brands), [SVG simbol hitam](https://vercel.com/geist/brands/assets/nextjs-symbol-black.svg) |
| react.svg | [SVG React](https://react.dev/images/brand/logo_dark.svg) |
| flutter.svg | [Flutter brand](https://flutter.dev/brand), [SVG logomark](https://flutter.dev/assets/icon_flutter.817b4a56b047d0d36b338dd9ffd44dbd.svg) |
| typescript.svg | Aset proyek sebelum revisi ini, dipertahankan |
| vscode.svg | [VS Code brand](https://code.visualstudio.com/brand), vscode.svg dari paket visual-studio-code-icons.zip |
| nodejs.svg | [Node.js branding](https://nodejs.org/en/about/branding/), [SVG hex](https://nodejs.org/static/logos/nodejsHex.svg) |

Logo hanya menunjukkan teknologi yang dipilih pengguna, bukan dukungan atau
afiliasi pemilik merek. Ikon teknologi lama tetap tersimpan sebagai sumber
historis, tidak dirender oleh Hero aktif.

## Logo tag teknologi Projects (2026-11-17)

- Next.js, React dan Flutter memakai kembali SVG lokal dari sumber yang
  tercatat pada bagian Hero di atas; enam logo Hero tidak berubah.
- public/icons/supabase.svg (1.107 byte) berasal dari
  [Supabase Brand Guidelines](https://supabase.com/brand), berkas
  [ikon SVG resmi](https://supabase.com/brand-assets/supabase-icon-green-transparent.svg).
  Berkas disimpan lokal tanpa mengubah isi, warna atau proporsi.
- Tambahan aset lokal untuk kombinasi teknologi pilihan pengguna:

| Aset | Ukuran | Sumber |
| --- | --- | --- |
| public/icons/laravel.svg | 2.857 byte | [Laravel artwork resmi](https://github.com/laravel/art/blob/master/logo-mark/5%20svg/3%20rgb/1%20Full%20Color/laravel-mark-rgb-red.svg) |
| public/icons/firebase.svg | 1.367 byte | [Firebase Brand Guidelines](https://firebase.google.com/brand-guidelines/), [SVG logomark](https://firebase.google.com/static/downloads/brand-guidelines/SVG/logo-logomark.svg) |
| public/icons/java.svg | 1.540 byte | [Devicon Java](https://github.com/devicons/devicon/blob/master/icons/java/java-original.svg) |
| public/icons/gemini.svg | 2.836 byte | [Lobe Icons Gemini](https://github.com/lobehub/lobe-icons/blob/master/packages/static-svg/icons/gemini-color.svg) |
| public/icons/tailwindcss.svg | 689 byte | [Devicon Tailwind CSS](https://github.com/devicons/devicon/blob/master/icons/tailwindcss/tailwindcss-original.svg) |
| public/icons/vite.svg | 1.276 byte | [Devicon Vite](https://github.com/devicons/devicon/blob/master/icons/vitejs/vitejs-original.svg) |
| public/icons/php.svg | 4.624 byte | [Devicon PHP](https://github.com/devicons/devicon/blob/master/icons/php/php-original.svg) |
| public/icons/dart.svg | 710 byte | [Devicon Dart](https://github.com/devicons/devicon/blob/master/icons/dart/dart-original.svg) |
| public/icons/postgresql.svg | 9.178 byte | [Devicon PostgreSQL](https://github.com/devicons/devicon/blob/master/icons/postgresql/postgresql-original.svg) |
| public/icons/sqlite.svg | 2.422 byte | [Devicon SQLite](https://github.com/devicons/devicon/blob/master/icons/sqlite/sqlite-original.svg) |
| public/icons/android.svg | 3.827 byte | [Devicon Android](https://github.com/devicons/devicon/blob/master/icons/android/android-original.svg) |

- Lisensi Devicon dan Lobe Icons disertakan di
  public/icons/THIRD_PARTY_NOTICES.txt. Berkas SVG disimpan tanpa perubahan warna
  atau proporsi, tanpa hotlink runtime.
- Logo dirender contain 24x24. Kartu memakai lingkaran putih 40px dengan overlap
  ringan 6px, maksimum empat logo dan +N; nama memakai title native/sr-only.
  Detail memakai bidang putih 36px dan nama terlihat. Alt logo tetap kosong
  agar tidak menduplikasi nama. Seluruh 19 logo stack sudah dirender dan
  diperiksa di output/qa/technology-icons-full.png; ini bukan verifikasi
  layout browser.
- Kombinasi teknologi mengikuti pilihan pengguna pada data preview; label
  Contoh teknologi dihapus atas permintaan pengguna. Stack lengkap memakai
  ulang TypeScript, JavaScript, Node.js dan Motion dari aset yang sudah ada.
  Tujuh tambahan tetap SVG asli tanpa perubahan warna/proporsi atau hotlink.

## Burung bergerak About (runtime aktif)

- Ilustrasi vektor original, bukan foto atau unduhan stok. Sumber dan runtime
  identik: `assets/source/bird-flight.svg` dan `public/images/bird-flight.svg`.
- Sprite 1536 × 96 berisi 12 frame terdaftar berukuran 128 × 96, sekitar 13 KB.
  Posisi badan/kepala tetap; bentuk sayap berubah melalui kepakan dan melayang.
  Semua kepala/paruh menghadap kanan dan lintasan CSS bergerak kiri ke kanan.
- BirdBackground memakai empat individu dengan ukuran, fase, dan durasi berbeda
  (38–52 detik). CSS menyembunyikan dua terakhir pada <=960px.
- CSS menahan pose melayang selama 74% siklus, lalu memainkan kepakan dengan
  steps(12). Reset lintasan terjadi di luar wrapper yang terpotong.
  Lifecycle attachCloudMotion menjeda saat offscreen/tab hidden dan membuat
  komposisi statis pada reduced motion, tanpa scheduler JavaScript tambahan.
- SVG dipakai langsung, tidak memerlukan images:optimize. Tes memeriksa
  kelengkapan frame, perbedaan pose, alpha, registrasi badan, arah dan budget.
  Strip pose telah dirender dan diperiksa; gerak halaman belum diuji di browser.

## Burung fotografis About (arsip tahap sebelumnya)

- Dibuat pada 15 November 2026 melalui **built-in imagegen** dengan alpha asli.
- Sumber: `assets/source/about-birds.png` (enam burung) dan
  `assets/source/about-birds-mobile.png` (tiga burung), masing-masing 2172 x 724.
- Aset desktop lama: `public/images/about-birds-600.webp` (11.724 byte) dan
  `public/images/about-birds-1200.webp` (29.092 byte). Runtime mobile:
  `public/images/about-birds-mobile-600.webp` (9.378 byte).
- Implementasi lama memakai picture untuk memilih tiga burung pada <=960px.
  Aset ini dipertahankan tetapi tidak dipakai oleh BirdBackground aktif.
  Semua aset dekoratif;
  gambar berada di atas komposisi, di belakang isi, dengan opacity lembut.
- Gerak berasal dari CSS `birds-flight` infinite: 44 detik desktop/48 detik
  mobile. Flock keluar seluruhnya sebelum reset; tidak ada kepakan cepat.
  BirdBackground menggunakan lifecycle attachCloudMotion untuk pause offscreen,
  tab hidden, serta reduced motion. Tidak menambah scheduler JavaScript.
  Reduced motion menampilkan burung statis. PNG sumber disimpan di luar public.
- `npm run images:optimize` meregenerasi seluruh WebP burung, portrait, dan awan.
  Gambar sumber serta WebP telah diperiksa langsung; tes memverifikasi alpha,
  ukuran, dan transfer <100 KB. Komposisi halaman/FPS belum diuji di browser.

### Prompt final desktop

```text
Use case: photorealistic-natural. Asset type: transparent photographic flock of distant birds for a pale blue sky AI engineer portfolio website. Generate exactly six small natural seabirds gliding, isolated together on a genuinely transparent alpha background. Wide panoramic composition about 3:1: a loose organic flock in a gently rising diagonal, varied spacing and sizes, all six complete birds fully inside the frame with generous clear transparent margins. Birds viewed at a distance from below and side, credible feather and wing anatomy, different calm extended-wing gliding poses, subtly photographic not graphic icons, cool slate blue-gray silhouettes with soft daylight detail, no pure black, no bright colors. The flock will be displayed about 500 CSS pixels wide in a calm elegant background above a portrait, so each bird must have a readable small silhouette and the total flock must remain airy. Background: true transparent alpha everywhere outside the six birds. Constraints: birds only, no clouds, no sky rectangle, no ground, no horizon, no sun, no particles, no letters, no text, no watermark, no frame, no motion blur, no checkerboard baked into pixels, no cartoon, no repeated identical M shapes. High resolution, refined natural photography.
```

### Prompt final mobile

```text
Use case: photorealistic-natural. Asset type: transparent mobile background flock for a pale blue AI engineer portfolio. Generate exactly three small natural seabirds gliding together on a genuinely transparent alpha background. Wide panoramic 3:1 composition, loose gently rising diagonal with airy spacing, one slightly nearer bird and two smaller distant birds, all complete inside frame with generous transparent margins. Natural photographic feather detail, credible bird anatomy, varied extended-wing gliding poses, viewed at a distance from below and side. Cool slate blue-gray, softly lit, restrained detail, not black icons. Birds only: no sky rectangle, clouds, land, horizon, text, watermark, motion blur, cartoon, frame, or baked checkerboard. Must match a calm realistic six-seabird flock on desktop. Displayed at about 280 CSS pixels wide as subtle background, so clear small silhouettes.
```

## Awan Hero alami (runtime aktif, 2026-11-18)

- Pengganti khusus Hero, dibuat dengan **built-in imagegen**. Aset bergaya
  fotografis hasil generasi, bukan foto asli atau unduhan stok.
- Sumber assets/source/hero-cloud-bank.png: 2172 x 724, RGBA, 1.457.016 byte.
  Formasi lebih rendah dan renggang, dengan fragmen/ukuran tidak seragam,
  bayangan tipis serta tepian uap semitransparan.
- Runtime public/images/hero-cloud-bank-1000.webp (97.468 byte) dan
  hero-cloud-bank-2000.webp (344.022 byte), WebP quality 80/alphaQuality 100.
  Regenerasi: npm run images:optimize.
- Dua track/tile, geometri, kecepatan dan lifecycle lama tetap. File cloud-bank
  lama dipertahankan untuk header koleksi agar perubahan terbatas ke section 1.
- Prompt lengkap: [hero-clouds-natural.md](prompts/hero-clouds-natural.md).
  Perbandingan awan lama/baru di atas #bddef1 telah diperiksa pada
  output/qa/hero-cloud-comparison.png. Hasil WebP final dikompositkan pada
  output/qa/hero-cloud-natural.png. Ini pemeriksaan aset, bukan screenshot
  browser atau bukti sambungan animasi pada perangkat.

## Awan fotografis horizontal lama (header koleksi dan arsip Hero)

- Dibuat pada 15 November 2026 melalui **built-in imagegen**, bukan CLI/API
  tambahan dan bukan unduhan stok.
- Sumber tersimpan di `assets/source/cloud-bank.png`: 2172 x 724, RGBA,
  1.307.580 byte. Sumber berada di luar `public/` agar tidak ikut bundle statis.
- Runtime: `public/images/cloud-bank-1000.webp` (71.904 byte) dan
  `public/images/cloud-bank-2000.webp` (252.516 byte), dengan alpha dipertahankan.
- Regenerasi ukuran/encoding: `npm run images:optimize`. Ini mengolah sumber
  yang tersimpan, tidak memanggil model gambar lagi.
- Kedua lapisan menggunakan aset yang sama melalui tile identik; file hanya
  perlu dimuat sekali oleh cache browser. Mask CSS melembutkan tepi horizontal.
- Aset sudah diperiksa sendiri dan dikompositkan pada `#9dcbea` untuk QA.
  Ini belum membuktikan komposisi halaman, sambungan visual bergerak, atau FPS
  pada browser/perangkat sebenarnya.

### Prompt final

```text
Use case: photorealistic-natural. Asset type: transparent photographic cloud ribbon for an AI engineer portfolio website with pale blue sky #9dcbea and navy typography. Generate a single panoramic, horizontally elongated bank of real white cumulus clouds viewed from the side, against a genuinely transparent alpha background. Style: high-resolution natural daylight photography, finely detailed vapor and soft wisps, realistic cloud volume, soft cool pale-blue shadows, diffuse daylight from upper left. Composition: wide landscape about 2:1, one continuous low cloud bank across the middle/lower half, varied organic heights, complete cloud silhouettes fully inside image, ample transparent padding above and below, both horizontal edges naturally dissipate to complete transparency so this asset can repeat with no hard seam. The main white clouds should be clearly readable when composited on light blue, with luminous tops and gentle darker undersides. Constraints: cloud only, true transparency in all empty areas, no blue sky rectangle, no horizon, no land, no sun, no stars, no rain, no text, no watermark, no frames, no illustration, no artificial radial-gradient blobs, no checkerboard baked into the pixels. Preserve all feathered translucent edges.
```

## Portrait dan font

`public/images/portrait.png` dan `public/fonts/geist.woff2` berasal dari proyek
awal dan tetap dipertahankan. Portrait runtime menggunakan WebP 500px/800px
melalui `srcSet`/`sizes`. `npm run images:optimize` membuat ulang kedua ukuran
portrait beserta ukuran awan. Lisensi font ada di `public/fonts/OFL.txt`.

## CV asli

- PDF diberikan pengguna dari `CV - Rahmat Rafi Indrayani.pdf`, disalin tanpa
  mengubah isi ke `public/documents/Rahmat-Rafi-Indrayani-CV.pdf` (131.722 byte).
- SHA-256 sumber dan salinan telah dibandingkan dan identik. Berkas bukan CV
  hasil generasi dan tidak memakai data dummy.
- `resume` pada src/data/portfolio.js menentukan URL serta nama file unduhan.
  Tombol About memakai atribut download native; endpoint lokal melayani
  application/pdf. Perbarui berkas asli dan konfigurasi bersama bila CV berubah.
