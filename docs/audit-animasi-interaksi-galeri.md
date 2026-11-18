# Audit animasi dan interaksi galeri di bawah Portofolio

Pengamatan 18 November 2026 pada Chrome desktop, viewport 1536 × 776 px. Lingkup audit adalah kolase sembilan foto di antara kartu Portofolio dan Contact, sesuai gambar referensi. [Website portofolio](https://ekawahyu-portofolio.vercel.app/)

Catatan ini memadukan pengujian di browser dan pembacaan nilai yang diterapkan pada elemen. Durasi hover berasal dari CSS. Posisi, opasitas, dan kedalaman di bawah merupakan sampel dari sesi uji. Posisi gulir dapat berbeda pada ukuran layar lain.

## 1. Urutan dari masuk sampai keluar viewport

| Fase | Gerak yang teramati | Kondisi setelah gerak stabil |
|---|---|---|
| Mendekati galeri dari Portofolio | Ujung foto mulai masuk dari bawah layar sementara kartu Portofolio masih terlihat di atas. Tiga foto pertama sudah punya opasitas saat galeri mulai masuk. | Foto acara SOS 26 di kanan, grup Sinau Bareng di kiri, dan potret dua orang di atas membentuk kolase kecil. Dua gambar terakhir pada trio ini bisa tampak lebih pudar sesuai posisi gulir. |
| Area galeri mengisi layar | Area foto menempel di bagian atas viewport. Foto yang lebih dekat tampak membesar dan bergerak menjauhi pusat perspektif. Foto dari lapisan belakang muncul bertahap dengan fade-in. | Foto berukuran berbeda, miring ke kiri atau kanan, dan saling menumpuk sebagian. Komposisi yang mirip dengan gambar referensi terlihat pada fase ini. |
| Scroll dilanjutkan | Foto depan terus mendekat, membesar, menyebar ke tepi, dan mulai memudar. Tepi viewport memotong foto yang melewatinya. Foto lain menyusul dari posisi yang lebih dalam. | Foto SOS 26, misalnya, sempat berukuran besar dan transparan di kanan sementara foto lain masih tampak penuh. |
| Mendekati akhir | Foto awal hilang satu per satu. Lapisan terakhir menempati area berbeda, termasuk foto grup Hology di bawah, grup peraih penghargaan di kiri atas, dan potret dengan piala di kanan. | Pada salah satu sampel akhir, foto Hology tampak pudar, foto grup penghargaan hampir penuh, dan potret berpiala masih utuh. |
| Keluar menuju Contact | Seluruh foto akhirnya memudar dan area galeri lepas dari posisi menempel. Latar kontur tetap terlihat saat foto sudah hilang. | Ada jeda visual sebelum isi Contact muncul. Penanda aktif navigasi atas kemudian berpindah dari Portfolio ke Contact. |
| Scroll balik ke atas | Foto kembali muncul dari fase akhir, lalu susunan berbalik menuju komposisi awal. | Laju dan komposisi mengikuti posisi scroll. Setelah gerak menyusul dan stabil, foto berhenti berubah kedalaman pada posisi tersebut. |

Pada fase awal saat area menempel, terlihat **garis vertikal tipis** di tengah bawah. Elemen ini berukuran 1 × 20 px, berjarak 32 px dari bawah, dan mengabaikan input pointer. Opasitasnya terbaca 0 pada fase kolase yang lebih padat dan fase akhir. Ambang tepat perubahan opasitasnya belum diukur.

## 2. Parameter gerak yang terbaca

- Galeri menempati **220vh**. Area yang menampilkan foto setinggi **100svh**, menempel dengan `top: 0`, memotong konten di tepi, dan memakai perspektif **1200 px** dengan lapisan 3D.
- Foto memakai `translate3d` untuk posisi horizontal, vertikal, dan kedalaman. `rotateZ` tetap per foto saat scroll. Kedalaman yang berbeda membuat foto terlihat membesar dengan laju berbeda meski nilai Z antarlapisan bergerak bersama.
- Pada sampel yang belum mencapai batas, jarak antarlapisan adalah **200 px** pada sumbu Z. Nilai yang terlihat dibatasi sekitar **−1700 px** di belakang dan **+500 px** di depan.
- Foto yang sangat jauh transparan, lebih jelas ketika mendekat, lalu memudar lagi sebelum mencapai batas depan. Dari sampel yang cocok dengan perubahan linear, rentang fade-in diperkirakan **−1700 sampai −1304 px** dan fade-out **+104 sampai +456 px**. Angka ini hasil inferensi dari nilai Z dan opasitas yang terbaca.
- Gerak foto dapat menyusul setelah posisi scroll halaman sudah berubah. Sebagai contoh, pada satu posisi halaman yang sama, kedalaman berubah dalam pembacaan awal lalu stabil di pembacaan berikutnya. Durasi dan kurva penyusulnya belum diukur.
- Semua kartu pada desktop ini mempunyai lebar dasar **285 px**, rasio **4:5**, sudut membulat **16 px**, dan gambar `object-fit: cover`. Ukuran tampak berubah karena perspektif.

| Urutan lapisan | Foto | Rotasi tetap | Z saat galeri masih di bawah layar | Opasitas awal terbaca |
|---:|---|---:|---:|---:|
| 1 | `gal-9.jpeg` | +3° | −1140 px | 1,00 |
| 2 | `gal-8.jpeg` | −5° | −1340 px | 0,91 |
| 3 | `gal-7.jpeg` | +7° | −1540 px | 0,40 |
| 4 | `gal-6.jpeg` | −9° | −1700 px | 0 |
| 5 | `gal-5.jpeg` | +11° | −1700 px | 0 |
| 6 | `gal-4.jpeg` | −3° | −1700 px | 0 |
| 7 | `gal-3.jpeg` | +5° | −1700 px | 0 |
| 8 | `gal-2.jpeg` | −7° | −1700 px | 0 |
| 9 | `gal-1.jpeg` | +9° | −1700 px | 0 |

Contoh titik pengamatan. Posisi dihitung relatif terhadap tepi atas galeri. Nilai negatif berarti tepi atas galeri sudah melewati bagian atas layar.

| Tepi atas galeri | Kedalaman dan opasitas yang teramati |
|---:|---|
| +564 px | Tiga lapisan pertama berada pada kondisi awal. Enam lapisan berikutnya transparan. |
| +230 px | Trio awal tetap dominan. Z ketiganya sekitar −1130, −1330, dan −1530 px. |
| −88 px | Delapan foto terlihat. Enam lapisan pertama penuh, `gal-3` sekitar 84% dan `gal-2` sekitar 34%. |
| −267 px | Sembilan gambar memiliki opasitas di atas nol. `gal-9` sudah di depan pada Z sekitar +372 px dan memudar ke 24%. `gal-1` sudah penuh pada Z sekitar −1228 px. |
| −654 px | Tiga lapisan terakhir tersisa dengan opasitas sekitar 32%, 89%, dan 100%. |
| −716 px | Dua lapisan terakhir tersisa dengan opasitas sekitar 35% dan 92%. Area galeri masih menempel. |
| −949 px | Seluruh foto sudah transparan. Area sticky mulai keluar dari atas viewport. |

## 3. Gerak pointer dan hover

| Kondisi | Hasil uji |
|---|---|
| Pointer bergeser di area galeri | Posisi X dan Y tumpukan bergeser ringan walau scroll tetap. Arah pergeserannya bergantian antarlapisan, memberi efek parallax. Kedalaman Z dan rotasi tetap pada pengujian ini. |
| Pointer masuk ke bagian foto yang dapat menerima input | Kursor berbentuk tangan. Gambar di dalam bingkai membesar ke **105%** dengan durasi **700 ms**, easing `cubic-bezier(0,0,.2,1)`. Sudut dan bingkai tetap, sehingga gambar yang diperbesar terpotong di tepinya. |
| Bayangan saat hover | Bayangan normal dua lapis (`0 8px 20px` pada 14% dan `0 2px 6px` pada 8%) beralih ke bayangan lebih tegas (`0 12px 24px` pada 18%) dalam **300 ms**, easing `cubic-bezier(.4,0,.2,1)`. |
| Pointer pindah ke foto lain atau area kosong | Hover foto sebelumnya lepas dan gambar serta bayangan kembali melalui transisi yang sama. Saat beberapa foto bertumpuk, bagian yang berada di bawah kartu lain tidak menerima hover dari titik yang tertutup. |
| Foto transparan atau cukup pudar | Browser menonaktifkan input pointer pada lapisan tertentu. Pada sampel, foto dengan opasitas sekitar 35% bisa masih terlihat tetapi `pointer-events` sudah `none`, sementara foto pada sekitar 40% menerima input. Ambang pastinya belum dipastikan. |

## 4. Klik, fokus, dan kondisi setelah aksi

| Aksi | Hasil uji desktop |
|---|---|
| Klik kiri pada foto | **Kesembilan foto diuji satu per satu** setelah gerak scroll stabil. Masing-masing menerima hover pada area yang diklik, tetapi klik tidak menghasilkan modal, pembesaran tambahan, perubahan kedalaman, perpindahan scroll, atau navigasi. Zoom yang terlihat berasal dari hover. |
| Klik ulang pada foto | Tidak muncul keadaan terpilih atau perubahan susunan yang menetap. |
| Klik area kosong di antara foto | Fokus tetap di halaman dan kolase tidak berubah kedalaman. Pemindahan pointer bisa tetap menggeser foto sedikit melalui parallax. |
| Tekan Escape setelah klik foto | Tidak terjadi perubahan pada kolase. |
| Tekan Tab setelah klik foto | Fokus berpindah ke kolom Contact pada percobaan. Di dalam galeri, sembilan foto terpapar sebagai gambar dengan nama generik `Gallery photo`. Kartu berupa `div` tanpa `tabindex`. Tidak ditemukan tautan atau tombol galeri. |

**Pembeda saat pengujian**. Klik pertama sempat bertepatan dengan perubahan kedalaman setelah scroll. Pada pengujian ulang dengan Z yang sudah stabil, kesembilan klik mempertahankan Z dan posisi halaman. Perubahan pertama tercatat sebagai gerak scroll yang menyusul.

## 5. Catatan UI/UX

- **Yang bekerja**. Pergeseran kedalaman, ukuran, dan transparansi memberi ritme pada perpindahan dari Portofolio menuju Contact. Scroll balik mengembalikan komposisi sehingga pengguna dapat melihat foto yang terlewat.
- **Prioritas 1**. Kursor tangan dan efek hover memberi kesan bahwa foto bisa dibuka, tetapi klik tidak memunculkan detail. Jika galeri memang dekoratif, gunakan kursor biasa. Jika foto dimaksudkan untuk dibuka, berikan tombol yang dapat difokuskan dan aksi yang konsisten.
- **Prioritas 2**. Nama `Gallery photo` diulang pada sembilan gambar, sehingga pembaca layar tidak mendapat konteks tiap foto. Beri teks alternatif yang membedakan acara atau subjek untuk foto yang informatif.
- **Prioritas 3**. Setelah foto terakhir memudar, latar sempat kosong sebelum Contact. Memperpendek jeda dapat membantu pengguna memahami bahwa masih ada konten di bawah.

Pengujian mencakup scroll dua arah dan klik kiri di Chrome desktop. Perilaku touch, ukuran layar lain, reduced motion, dan durasi tepat efek yang mengikuti scroll belum diuji.
