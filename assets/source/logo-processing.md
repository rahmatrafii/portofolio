# Logo organisasi

Sumber pengguna tersimpan utuh di `assets/logo/`. Runtime memakai
`public/images/logos/*.webp`, lossless, maksimal 320 x 160, tanpa distorsi.
GDGoC, UIN, Mocap, Weboender sudah memiliki alpha; hanya padding luar dipangkas.
SMKN memiliki latar putih luar. Built-in image_gen dipakai untuk ekstraksi;
hasil transparan disimpan di `smkn-2-bojonegoro-transparent.png` sebelum resize.
Hasil generatif dapat memiliki variasi kecil pada detail emblem dibanding JPEG
asli; bukan pengganti master identitas resmi. Nama organisasi tetap teks asli.

Prompt edit (2026-11-15):

> Background extraction of this exact school badge. Remove ONLY the white
> exterior background outside the dark outer shield border, make exterior
> truly transparent. Preserve badge shape, all lettering exactly SMK NEGERI 2
> BOJONEGORO, cyan field, internal white ribbons and white interior details,
> black gear, red lightning, yellow roof, border, proportions and all colors
> unchanged. No redesign, no new letters. Output tightly framed entire badge
> with small transparent margin.

Simtel ditambahkan dari `assets/logo/simtel.png`, sudah transparan; dipangkas
padding luarnya dan dikonversi lossless ke `public/images/logos/simtel.webp`.
Logo teknologi Skills baru belum disediakan.
