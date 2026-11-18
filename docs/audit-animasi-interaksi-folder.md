# Audit animasi dan interaksi — folder About

Sumber: https://ekawahyu-portofolio.vercel.app/  
Tanggal pengamatan: 16 November 2026.  
Lingkup: tiga folder **Projects, Certificates, Awards** pada gambar pengguna, dari kemunculan di viewport sampai aksi menuju Portofolio. Website tidak diubah.

## Metode dan tingkat kepastian

- **Teruji**: dilakukan langsung melalui Chrome desktop; kondisi diperiksa melalui tampilan dan accessibility tree.
- **CSS terverifikasi**: nilai dibaca dari stylesheet halaman yang sedang terbuka. Durasi merupakan nilai deklarasi, bukan pengukuran video/frame.
- **Belum teruji**: disebutkan secara eksplisit; jangan diperlakukan sebagai perilaku yang sudah dibuktikan.
- Viewport pengamatan sekitar 1536 × 776 px. Mobile/touch tidak diuji.
- Hover folder dikonfirmasi melalui keadaan `:hover` pada DOM, tanpa membuka folder: pointer ditempatkan pada area belakang folder yang tidak memiliki aksi buka. Respons terhadap perpindahan pointer dibuktikan oleh perubahan variabel posisi pointer.

## 1. Struktur dan kondisi awal

| Folder | Angka yang terlihat | Lembar pratinjau | Isi visual |
|---|---:|---:|---|
| Projects | 6 | 4 | Tumpukan screenshot proyek |
| Certificates | 6 | 4 | Tumpukan sertifikat |
| Awards | 5 | 4 | Tumpukan penghargaan |

**Teruji:** angka total berbeda dari jumlah lembar preview. Accessibility label tombol utama menyebut `4 items`, sedangkan label visual menampilkan 6/6/5. Angka tersebut bukan bukti animasi menghitung dari nol.

Setiap folder tersusun atas bayangan bawah, panel belakang bertab, empat lembar gambar, sampul depan gelap transparan dengan garis tepi/refleksi, label jumlah dan kategori di kiri bawah, serta tombol tiga titik di kanan bawah. Lembar berada di belakang sampul depan sehingga bagian bawah gambarnya tertutup.

## 2. Urutan ketika pertama tampil di viewport

Urutan berikut didukung aturan CSS keadaan sebelum/sesudah atribut `data-entered`. Kemunculan folder terlihat saat pengguliran, tetapi ambang IntersectionObserver dan waktu antarfolder tidak diukur.

| Urutan | Elemen | Sebelum masuk | Keadaan akhir dan transisi CSS |
|---|---|---|---|
| 1 | Panel belakang dan rim | Transparan; turun 22 px | Naik ke posisi normal; posisi 1 s, opacity 0,9 s |
| 2 | Empat lembar preview | Transparan; offset tambahan −120 px | Turun ke susunan stack; translate dan opacity 0,9 s |
| 3 | Sampul depan | Transparan; turun 46 px | Naik ke posisi normal; translate/opacity 1 s, delay 0,42 s |
| 4 | Tombol tiga titik | Transparan; skala 0,6 | Opacity menjadi 1 dalam 0,6 s; skala menjadi 1 dalam 0,7 s; delay keduanya 0,7 s |
| Paralel | Bayangan bawah | Opacity 0 | Muncul dengan transisi opacity 0,9 s |
| Pada pemasangan elemen | Angka jumlah | Opacity 0; turun 5 px | Fade dan naik selama 0,5 s (`gf-roll`) |

Lembar memiliki depth 3, 2, 1, 0. Delay masuk translate/opacity adalah `0,18 s + depth × 0,09 s`: **0,45 / 0,36 / 0,27 / 0,18 s**. Jadi ada stagger per lapisan, bukan semua lembar bergerak serempak.

Easing utama: `cubic-bezier(.2,.8,.2,1)`. Easing gerak membuka/menyebar: `cubic-bezier(.22,1,.36,1)`.

**Teruji saat keluar viewport:** sesudah folder digulir sampai seluruhnya di atas layar, `data-entered="true"` tetap tersimpan pada ketiganya. Ini mendukung entrance yang tidak di-reset pada pengguliran tersebut; replay sesudah reload merupakan siklus baru dan tidak diukur frame demi frame.

## 3. Diam / tertutup

**Teruji:** ketiga folder terlihat sebagai stack ringkas; sampul depan tegak dan sebagian kecil gambar mengintip di atasnya. Tidak ada modal atau perpindahan halaman ketika hanya melihat section.

Parameter CSS keadaan dasar:

- Hinge sampul: 0°.
- Lift lembar: +42 px.
- Spread horizontal: 0 px; fan tambahan: 0°.
- Jarak tumpukan berdasarkan depth: 15 px.
- Ada sedikit offset horizontal dan rotasi berbeda per lembar; susunan sengaja tidak sepenuhnya sejajar.
- Tidak ditemukan animasi loop khusus pada komponen folder dalam aturan CSS yang diperiksa.

## 4. Hover folder tertutup

**Teruji pada Projects; aturan CSS sama untuk tiga folder.** Hover membuka folder sedikit tanpa mengubah `aria-expanded` menjadi true dan tanpa navigasi.

- Sampul depan berengsel dari bawah: `perspective(760px) rotateX(-11deg)`.
- Lembar naik: variabel lift berubah dari +42 menjadi −34 px.
- Preview menyebar sedikit: spread 8 px, fan 1,4°, stack 10 px.
- Transform lembar bertransisi 0,75 s dengan delay `depth × 40 ms`.
- Sampul bertransisi 0,8 s.
- Keseluruhan isi memperoleh tilt mengikuti posisi pointer: perspektif 1400 px, rotasi X `py × −3°`, Y `px × 4°`; transisi 0,18 s linear.
- Refleksi radial pada sampul mengikuti pointer: pusat X `50% + px × 46%`, pusat Y `30% + py × 40%`.
- Bayangan bawah bergeser horizontal berlawanan arah: `px × −6 px`.
- Layer artwork belakang mempunyai offset parallax `px × −7 px`, `py × −6 px`, skala 1,02; transform bertransisi 1,1 s.

`px` dan `py` di sini adalah nilai pointer ternormalisasi, bukan satuan piksel. Saat pointer diuji pada bagian atas Projects, halaman memperbarui nilainya menjadi sekitar `0.014` dan `−0.540`.

**Saat pointer meninggalkan folder:** aturan hover berhenti dan properti kembali melalui transisi. Namun `:focus-within` juga memicu keadaan terbuka sedikit. Karena itu setelah klik, menggeser pointer keluar saja dapat tetap menyisakan keadaan setengah terbuka selama fokus masih berada di dalam folder.

## 5. Klik sampul / tombol utama

**Teruji pada ketiga folder.**

1. Klik sampul depan mengubah tombol dari `Open [kategori], 4 items` menjadi `Close [kategori], 4 items` dan `aria-expanded=true`.
2. Empat preview terangkat tinggi dan menyebar seperti kipas.
3. Sampul depan miring lebih jauh; bagian gambar menjadi jauh lebih terlihat.
4. Tidak langsung membuka modal maupun halaman detail.

Parameter keadaan terbuka penuh:

| Properti | Nilai |
|---|---:|
| Hinge sampul | −24° |
| Lift dasar | −96 px |
| Spread | 40 px |
| Fan | 5° |
| Stack berdasarkan depth | 30 px |

Transform lembar adalah gabungan offset kecil masing-masing, `slot × spread`, lift, `−depth × stack`, serta rotasi `offset rotasi + slot × fan`. Nilai slot: −1, −⅓, +⅓, +1.

**Penutupan yang teruji:**

- Klik tombol utama lagi → folder menutup melalui transisi kebalikan.
- Buka folder lain → folder sebelumnya menutup; hanya satu folder terbuka penuh dalam pengujian.
- Klik ruang kosong di luar → folder terbuka menutup.
- Tekan Escape saat Awards terbuka → Awards menutup.
- Pilih `Close folder` pada menu → folder menutup dan menu ditutup.

## 6. Hover dan fokus lembar preview

**CSS terverifikasi; hover setiap lembar satu per satu belum diuji visual.** Berlaku ketika folder mempunyai `data-open`:

- Lembar yang dihover atau mendapat `:focus-visible` naik tambahan 18 px.
- Rotasi menjadi `slot × fan × 0,6`, sehingga orientasinya sedikit lebih lurus dibanding posisi kipas.
- Bayangan berubah menjadi lebih tinggi/luas: offset Y 22 px, blur 40 px, spread −12 px pada deklarasi state ini.
- Delay transform dihilangkan agar respons hover segera dimulai.
- Saat pointer keluar, lembar kembali ke transform susunan terbuka.
- Fokus keyboard memberi outline biru 2 px dengan offset 2 px.

## 7. Klik lembar preview

**Teruji menggunakan satu lembar pada masing-masing kategori**, bukan semua 12 lembar secara individual.

| Asal klik | Hasil yang diamati |
|---|---|
| Preview Projects | Berpindah turun ke konten Portofolio Projects; bukan langsung ke halaman detail proyek |
| Preview Certificates | Berpindah turun ke Portofolio dan mengaktifkan kategori Certificates; enam kartu sertifikat tersedia |
| Preview Awards | Berpindah turun ke Portofolio dan mengaktifkan kategori Awards; lima kartu penghargaan tersedia |

Perpindahan berlangsung di dokumen yang sama. Pada observasi URL tetap root website. Area tujuan berwarna terang, berbeda dari About yang gelap. Navigasi atas akhirnya mengikuti section Portfolio dan penanda aktif birunya berpindah. Ini adalah efek lanjutan dari aksi folder, bukan modal pembesaran gambar.

Keadaan folder terbuka sempat tetap tersimpan setelah perpindahan ke konten; jangan mengasumsikan semua aksi navigasi selalu me-reset folder.

## 8. Tombol tiga titik

**Teruji pada ketiga kategori.** Tombol mempunyai label `More options for [kategori]`.

### Hover / tekan

**CSS terverifikasi:**

- Hover: tombol naik 2 px, transform 0,35 s.
- Selama ditekan (`:active`): kembali ke Y=0 dan mengecil menjadi 0,93; durasi 0,12 s.
- Saat menu terbuka (`aria-expanded=true`): tombol berskala 0,96.
- Fokus keyboard: outline biru 2 px, offset 3 px.

### Membuka menu

- Klik tiga titik membuka menu mengambang di atas tombol, bukan membuka penuh folder.
- Item pertama langsung mendapat fokus dalam pengujian.
- Menu gelap transparan dengan sudut membulat, bayangan dan backdrop blur 12 px.
- Posisi desain: kanan 22 px, bawah 90 px dalam stage folder.
- Dari opacity 0, turun 6 px dan skala 0,94 → opacity 1, posisi normal dan skala 1.
- Opacity bertransisi 0,2 s; transform 0,32 s; titik asal transform kanan bawah.
- Saat tutup: fade dan menyusut/bergeser kembali; visibility disembunyikan setelah delay 0,32 s.

### Isi menu dan aksi

| Kondisi | Item pertama | Item kedua |
|---|---|---|
| Folder tertutup | Open folder | Explore All Projects / Certificates / Awards |
| Folder terbuka | Close folder | Explore All Projects / Certificates / Awards |

- **Teruji:** `Open folder` membuka kipas penuh dan menutup menu.
- **Teruji:** `Close folder` menutup kipas dan menu.
- **Teruji pada ketiga Explore All:** berpindah ke section Portofolio dan menampilkan kategori yang sesuai; menu ditutup.
- **Teruji:** klik tombol tiga titik yang sama lagi menutup menu.
- **Teruji:** Escape menutup menu Projects dan mengembalikan fokus ke tombol tiga titik.
- **CSS terverifikasi:** hover atau fokus item menu memberi latar putih transparan 9% pada tema gelap; tidak ditemukan gerak khusus pada teks item.
- Klik luar ketika menu terbuka saja belum diuji secara terpisah dari klik luar pada folder terbuka.

## 9. Fokus keyboard dan preferensi gerak

**CSS terverifikasi:**

- `:focus-within` menghasilkan hinge/lift/spread seperti hover; tilt mengikuti pointer dibatasi selector `:hover`.
- Fokus terlihat pada tombol utama menggarisbawahi judul dengan ketebalan 1,5 px dan offset 4 px.
- Rim sampul meningkat dari stroke 2,4 menjadi 5 saat tombol utama `:focus-visible`.
- Aturan `prefers-reduced-motion: reduce` meniadakan durasi/delay transisi dan animasi pada turunan folder, serta menonaktifkan transform tilt.

**Belum teruji:** alur Tab lengkap, aktivasi Enter/Space di seluruh kontrol, navigasi panah menu, dan pengujian sistem dengan reduced motion aktif. Escape sudah diuji sebagaimana dicatat di atas.

## 10. Efek pendukung yang ada di CSS, tetapi pemicunya tidak terbukti

Dicatat agar tidak keliru disamakan dengan animasi viewport yang benar-benar digunakan:

- Canvas artwork awalnya opacity 0 dan blur: belakang blur 14 px + saturasi 0,6; lembar blur 10 px. Atribut `data-ready` menghilangkan blur dan memunculkan canvas, dengan transisi belakang 1,2 s dan lembar 0,9 s. Aktivasi saat sesi ini tidak direkam.
- `gf-drop`: lembar turun dari −160 px, rotasi −6°, opacity 0 → posisi/rotasi normal, opacity 1; 0,65 s. Belum terbukti dipicu oleh interaksi section ini.
- `gf-bump`: sampul mengecil sesaat ke skala `0,99 0,985` lalu kembali; durasi 0,5 s, delay 0,3 s. Pemicu belum terbukti.
- Ikon plus memiliki `gf-turn` −90° → 0°, 0,6 s. Tombol yang tampil di section ini adalah tiga titik; aksi tambah/plus tidak terlihat dan tidak diuji.

## 11. Catatan UI/UX singkat

- **Sudah bekerja:** metafora folder konsisten dan respons hover berbeda dari buka penuh; pengguna mendapat feedback visual sebelum berpindah ke koleksi lengkap.
- **Masalah teramati:** lembar preview tidak mempunyai nama aksesibel maupun teks pada tombolnya. Pengguna pembaca layar sulit membedakan isi setiap lembar. Prioritas: berikan nama proyek/sertifikat pada tiap tombol.
- **Masalah teramati:** label aksesibel menyebut 4 items sementara angka visual 6/6/5. Prioritas: jelaskan bahwa empat lembar adalah preview dari total koleksi.
- **Perkiraan dampak:** preview tampak seperti dokumen individual, tetapi klik mengarah ke kategori. Sebagian pengguna mungkin mengharapkan pembesaran/detail item. Perjelas aksi dengan label seperti “Lihat semua Certificates”, atau arahkan tiap preview ke item yang sesuai.

## Batas kelengkapan

Dokumen mencatat kondisi yang ditemukan pada section gambar, dengan parameter CSS pendukung. Ini bukan klaim pengujian menyeluruh semua perangkat dan semua frame. Yang belum dipastikan: hover tiap lembar secara individual, seluruh 12 tujuan klik, breakpoint mobile/touch, ambang viewport persis, waktu navigasi scroll, dan pemicu efek tambahan yang disebut pada bagian 10. Hero, seluruh animasi timeline Education/Experience, carousel Portofolio dan form Contact berada di luar lingkup section gambar.
