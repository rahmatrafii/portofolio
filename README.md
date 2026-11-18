# Rafi Portfolio

Portofolio AI Engineer yang dikonversi dari `portfolio-parallax.html` ke React +
Vite menggunakan JavaScript dan CSS biasa. Setelah audit UI, hero memiliki
judul profesi dan pengantar singkat, navbar berikon mengikuti section aktif, serta animasi
desktop yang diredam berdasarkan waktu. Hero menargetkan satu layar dengan awan
fotografis yang bergerak lambat secara otomatis.

Scroll roda mouse/trackpad dihaluskan Lenis. Framer Motion menggerakkan foto dan
cerita dari satu MotionValue posisi scroll aktual, dengan satu scheduler untuk
pembaruan Lenis, perhitungan posisi, dan render Motion. Perlambatan singkat setelah
input wheel berhenti telah disetujui pengguna; tidak ada spring tambahan pada foto
atau teks. Touch tetap native, sedangkan reduced motion memakai scroll native
tanpa smoothing.

Hero desktop >=1100px memakai judul AI Engineer besar pada lapisan belakang
foto, deskripsi rata kiri di samping, serta enam logo dalam lengkung longgar.
Mobile/tablet memakai urutan heading, deskripsi, lalu scene. Sapaan Saya Rafi
dan tombol Tentang saya tetap dihapus; navigasi About tersedia di navbar.
Koreografi logo keluar/masuk dan perjalanan foto memakai controller yang sama.
Pelat logo lebih ringan dengan bayangan lembut, tanpa label tambahan.

Hero dan About berbagi satu langit dengan gradient pada `.intro-journey`.
Awan Hero memudar melalui mask vertikal pada wrapper yang tidak bergerak,
sehingga parallax awan tidak memindahkan tepi fade. Awan kecil lama dipulihkan
beserta dua lapisan bertile, posisi, opacity dan geraknya: desktop jauh/dekat
110/78 detik dengan arah berlawanan, mobile 150/110 detik. Keduanya tetap
tampil di mobile. Lifecycle tetap menjeda saat offscreen/tab hidden dan
reduced motion membuatnya statis; bank sisi besar hanya disimpan sebagai arsip.
About memakai empat burung
vektor independen di desktop dan dua di mobile/tablet, dengan sprite 12 frame
untuk kepakan sayap. Burung menghadap dan terbang ke kanan, berulang setelah
keluar area, berhenti saat offscreen/tab hidden, dan statis pada reduced motion.
Sumber aset tercatat di [docs/ASSETS.md](docs/ASSETS.md).

About desktop memiliki tiga kolom: identitas dan CV di kiri, foto di tengah,
serta biografi di kanan. Kedua panel teks dibatasi 352px dan merapat ke sisi
foto, dengan judul nama lebih ringkas dan judul biografi sedikit lebih kuat.
Pada mobile panel kembali lebar penuh. Tombol navy Unduh CV
memakai PDF asli pengguna di
`public/documents/Rahmat-Rafi-Indrayani-CV.pdf` melalui download native.
URL dan nama unduhan disimpan sebagai `resume` di `src/data/portfolio.js`.

Enam logo Hero muncul dari belakang foto dalam tiga pasangan saat halaman
dibuka di atas. Saat scroll, logo menutup terlebih dahulu; foto kemudian turun
lurus dan berhenti pada anchor tengah About. Scroll naik membalik urutannya.
Scroll dapat memotong intro dari pose saat itu, tanpa menunggu animasi selesai.
Setelah foto tiba,
kedua panel teks muncul ke arah luar melalui opacity dan translasi pendek tanpa
mask teks: maksimal 48px desktop presisi/20px touch, dibatasi jarak aman foto.
Stage desktop pointer presisi yang muat di viewport dapat memakai sticky dan ruang scroll tambahan;
konten terlalu tinggi memakai flow dengan gerak lebih pendek. Seluruh gerak
mengikuti posisi scroll aktual, berhenti saat posisi itu diam, dan dapat dibalik.
Di mobile/tablet foto tetap di tengah, di atas identitas dan biografi. Pengantar
Hero mendahului scene agar jalur foto bebas teks. Overlay fixed berada di luar
scene Hero dan memakai koordinat viewport. Glow transparan serta bayangan memberi
kedalaman; wajah tidak memakai rotasi dinamis atau translateZ, dan rim dihapus
dari tampilan.

Setelah About, Education & Experience memuat dua pendidikan dan
empat pengalaman asli dari pengguna. Desktop pointer presisi dengan ruang
vertikal cukup menggeser garis waktu ke samping melalui scroll halaman yang
sama. Jalur memenuhi lebar layar; setiap node melewati fokus tengah dan mendapat
halo serta kejelasan bertahap menurut jaraknya dari pusat. Node sebelumnya dan
berikutnya meredup. Label Education berganti ke Experience, tanpa judul besar,
tab berulang, instruksi, progres bawah, atau footer visual. Heading semantik dan
tautan kembali ke beranda yang muncul saat fokus keyboard tetap tersedia.
Pada mobile <=960px, satu garis vertikal menyambung Education sampai Experience.
Bulatan menyala saat mendekati tengah viewport; cahaya dan ekor bergerak bersama
scroll, dengan penekanan halus pada konten/logo. Touch tetap native tanpa pin.
Reduced motion, fokus keyboard, touch >960px dan konten desktop tinggi memakai
daftar statis lengkap. Navbar Journey menuju `#journey`. Jalur kurva desktop dan
berlian kecil mengikuti mockup yang disetujui. Jalur benar-benar berubah bentuk
saat scroll, dengan satu cahaya menyusuri kurva dan kembali saat scroll dibalik;
node/teks tetap stabil. Hover ringan pada isi/logo. Enam logo pengguna tersedia;
data berada di `src/data/career.js`
tanpa gelar/capaian/bulan rekaan.

## Menjalankan

Gunakan Node.js 22.12+ (lingkungan migrasi: 24.21) dan npm.

```sh
npm install
npm run dev
```

Buka URL Local yang dicetak Vite. Development default: <http://127.0.0.1:5173>.
Website React dijalankan melalui server Vite, bukan dengan membuka `index.html`
langsung sebagai file.

```sh
npm run check    # Tes dan build produksi
npm run build    # Hasil di dist/
npm run preview  # Meninjau hasil build secara lokal
npm run images:optimize # WebP portrait, awan, dan kawanan burung historis dari PNG
```

Saat instalasi ulang dari lockfile, gunakan `npm ci`. Proyek tidak membutuhkan
API key, file `.env`, backend, atau layanan eksternal.

## Peta proyek

| Lokasi | Kegunaan |
| --- | --- |
| `src/components/` | Header, Hero, CloudBackground, BirdBackground, Portrait, About, CareerTimeline |
| `src/data/portfolio.js` | Biografi dan konfigurasi kartu teknologi |
| `src/data/career.js` | Dua pendidikan dan empat pengalaman asli pengguna |
| `src/components/CareerTimeline.jsx` | Dua bab Education/Experience dengan fallback daftar vertikal |
| `src/lib/careerTimeline.js` | Scrub horizontal desktop dan fokus vertikal mobile dari scroll bersama, cache geometri dan fallback |
| `src/lib/parallax.js` | Efek scroll/pointer dan cleanup |
| `src/lib/navigation.js` | Section aktif dan perubahan state header |
| `src/lib/cloudMotion.js` | Lifecycle awan/burung saat section tersembunyi, tab tidak aktif, atau reduced motion |
| `src/lib/smoothScroll.js` | Lenis, MotionValue scroll aktual, anchor/fokus, reduced motion, dan lifecycle |
| `src/lib/portraitJourney.js` | Foto turun ke tengah lalu dua panel terbuka, cache geometri, fallback statis, dan cleanup |
| `src/lib/heroSkills.js` | Fase intro logo, handoff scroll, reverse dini dan pause waktu tab hidden |
| `public/images/bird-flight.svg` | Sprite vektor 12 frame untuk burung runtime |
| `src/styles.css` | Tampilan dan breakpoint |
| `public/` | Foto, SVG, font, dan lisensi font |
| `assets/source/` | Sumber awan hasil imagegen, tidak disalin ke build publik |
| `scripts/optimize-images.mjs` | Pembuatan portrait dan awan responsif dengan sharp (dev dependency) |
| `tests/` | Migrasi, lifecycle animasi, navigasi, render link, dan aset responsif |
| `portfolio-parallax.html` | Referensi HTML awal, dipertahankan utuh |

## Vibe coding

Baca [AGENTS.md](AGENTS.md) sebagai aturan agent. Dokumentasi lanjutan:

- [Arsitektur dan konteks](docs/ARCHITECTURE.md)
- [Acuan desain](docs/DESIGN_SYSTEM.md)
- [Sumber dan pengolahan aset](docs/ASSETS.md)
- [Skill terpasang dan routing](docs/SKILLS.md)
- [Alur kerja dan contoh prompt](docs/WORKFLOW.md)
- [Status dan pekerjaan berikutnya](docs/TASKS.md)
- [Catatan perubahan](CHANGELOG.md)

Enam skill lokal dihubungkan ke `.agents/skills/` di laptop ini, termasuk
Modern Web Guidance sebelum implementasi web sisi klien serta Anti-Slop Design
yang otomatis dirujuk saat coding antarmuka sesuai aturan proyek.
Junction tidak masuk Git; cara memulihkannya ada di `docs/SKILLS.md`. Tidak ada
konfigurasi global agent yang diubah.

Home, About, Journey, dan Projects memiliki target nyata. Judul section adalah
My Projects, dengan tiga folder biru solid: Web Apps, Mobile Apps, AI Integration.
Tiga folder terpusat pada >=1100px dengan lebar maksimal 360px; tablet 761–1099px
memakai dua folder di atas dan satu terpusat di bawah, <=760px satu kolom.
Jarak judul/folder dirapatkan; preview depan berbeda tetapi tetap sementara.
Sampul memiliki ikon timbul browser/ponsel/simpul AI dengan aksen biru/sage/
lavender. Satu pesawat kertas terus melintas melengkung dengan siklus 22 detik
di band antara deskripsi dan folder, tanpa jeda diam di luar area. Lintasan
putus statis dihapus. Mobile menyembunyikan pesawat; reduced motion menampilkan
pesawat diam. Lifecycle attachCloudMotion yang sama menjeda offscreen/tab-hidden/
Home inactive. Saat folder terbuka pesawat tetap bergerak dengan opacity band
.42; transisi navigasi tetap menjeda/menyembunyikannya. Band selebar viewport;
pesawat masuk dari luar tepi kanan dan keluar sepenuhnya di kiri. Hidung mengikuti
arah kurva secara otomatis; jalur acak naik-turun atau satu putaran kecil berganti
ketika di luar layar. Reset tidak terjadi pada tepi konten 1280px. Pesawat 48px
menyisakan ruang aman untuk berputar dalam band tanpa memotong teks/folder.
Klik sampul membuka kipas; lembar menuju koleksi
kategori, lalu kartu dalam koleksi menuju detail proyek. Escape/klik luar
menutup folder; hanya satu terbuka. Navbar dan folder mendukung keyboard serta
reduced motion. Contact tetap disembunyikan sampai kontak asli tersedia.

Koleksi tersedia di `/web-app`, `/mobile-app`, `/ai-integration`;
alamat lama `/mobile-app-ai` dan `/web-app-ai`, termasuk detail, membuka koleksi AI yang sama.
Halaman koleksi memakai galeri kartu: satu karya lebar, kartu pendamping dan
kartu penutup lebar, lalu satu kolom pada <=760px. Screenshot 16:9 menjadi fokus;
ikon panah kembali menggantikan teks/logo dan tombol kategori dihapus. Detail
kembali ke koleksinya lewat panah yang sama; label aksesibel tetap tersedia.
detail memakai `/kategori/slug`. Navigasi internal memakai History API tanpa
refresh dokumen dan tanpa dependency router. Hover menaikkan lembar 14px tanpa
merombak tumpukan. Klik satu lembar mengangkat lalu melayangkan keempatnya ke
atas melalui lengkung kecil, tanpa pembesaran. Lembar asli bergerak utuh 550ms,
mulai setiap 80ms pada clock yang sama, dan keluar seluruhnya dari tepi atas.
URL berubah dan kategori langsung terungkap sesudah lembar terakhir keluar;
total deklarasi maju 900ms termasuk reveal. Kembali dari koleksi
melalui tautan Home atau Back browser memulihkan posisi/folder, lalu keempat
kartu turun langsung sampai masuk ke folder dalam satu animasi per lembar.
Tidak ada pergantian ke clone atau fase angkat/pendaratan yang berhenti di tengah.
Reduced motion berpindah langsung;
kunjungan kategori langsung tidak mengarang lembar asal. Home dipertahankan
dalam DOM dengan driver tidak aktif selama koleksi tampil. Modified click,
download, tautan eksternal dan anchor di Home tetap memakai perilaku native.
Server produksi perlu fallback
ke `index.html` untuk URL tersebut; Vite dev/preview sudah mendukungnya.
Data ada di `src/data/projects.js`. Atas permintaan pengguna, masing-masing
kategori diisi empat kartu sementara memakai ulang tiga gambar `assets/projects/`.
Label sementara di Home dihapus atas permintaan pengguna; keterangan isi
sementara tetap terlihat pada koleksi dan detail. Gambar
dioptimalkan menjadi WebP 960x540 (16:9, contain) melalui `npm run images:optimize`.
Section Skills/lab navy tetap dihapus; enam logo teknologi Hero tetap tersedia.

Portrait memakai WebP 500px (~52 KB) dan 800px (~92 KB) dengan `srcSet`/`sizes`.
PNG asli tetap disimpan. Awan runtime memakai WebP 1000px (~72 KB) dan 2000px
(~253 KB) dari assets/source/cloud-bank.png. Sumber/prompt tercatat di
docs/ASSETS.md; bank sisi cloud-left/right tersimpan sebagai arsip.

Hero memakai fallback `100vh`/`100svh`/`100dvh`, dengan konten tetap dapat menambah
tinggi saat layar pendek atau teks diperbesar. Parallax hanya berjalan pada
viewport >=900px dengan pointer presisi. Drift awan tetap tersedia di mobile
sesuai arahan pengguna. Tombol jeda telah dihapus. Reduced motion menonaktifkan
drift, parallax, dan entrance. Loop awan otomatis dijeda
saat hero tidak terlihat atau tab disembunyikan.

Pembukaan logo Hero berlangsung maksimal 720ms desktop/580ms touch, lalu
seluruh gerak mengikuti scroll aktual. Mobile memakai rentang penutupan lebih
pendek; reduced motion langsung menampilkan logo/foto lengkap tanpa gerak.

Perjalanan foto mengikuti posisi scroll aktual dari Lenis/native dan skala
seragam, tanpa mengubah proporsi wajah. Foto mencapai anchor tengah dan ukuran
akhirnya sebelum kedua panel teks terungkap ke luar.
Pada stage yang muat, CSS sticky dan spacer `::after` pada runway menjaga
komposisi tetap terlihat; spacer menambah tinggi konten dalam flow, bukan padding.
Setelah fase selesai, foto dan cerita kembali mengikuti dokumen. Koordinat overlay
tetap diperbarui selama scroll setelah fase selesai agar foto ikut keluar layar
bersama About. Pada mobile,
layar pendek, atau teks diperbesar yang membuat stage terlalu tinggi, konten
tetap mengalir vertikal dan tidak ditahan sebagai satu biografi panjang.

Wrapper kedua panel tetap diam untuk pengukuran. Anak `.about-panel-inner`
menerima transform dan opacity dari MotionValue. Gerak dibatasi agar tetap
menyisakan ruang terhadap foto; tidak ada mask/clip huruf, timer reveal, atau
spring pengejar tambahan. Scroll naik menutup kedua panel lalu mengembalikan
foto ke Hero. Kenyamanan mouse/trackpad tetap perlu diuji langsung.

Foto utama pada anchor Hero tetap berada dalam accessibility tree dengan alt
Rafi; ketika enhancement aktif, foto statis ini transparan dan overlay dekoratif
menjadi satu foto yang terlihat. Pada reduced motion atau ketika enhancement
tidak aktif, overlay disembunyikan dan Hero serta About menampilkan foto statis
masing-masing tanpa pin atau runway tambahan. Runtime React tetap memerlukan
JavaScript. Salinan overlay dan About dekoratif agar pembaca layar tidak
mengumumkan foto yang sama berulang. Cerita tetap dalam accessibility tree;
fokus keyboard dan reduced motion menghapus opacity serta transform kedua panel
dan langsung mengaktifkan tautannya. Guard CSS aksesibilitas harus tetap
mengalahkan transform/opacity inline milik Motion. Saat :focus-visible berada
di About atau keturunannya, traveler disembunyikan dan foto fallback About
ditampilkan agar lapisan foto Hero tidak menutupi teks/fokus. Fokus mouse/touch
pada CV tidak memaksa pergantian foto atau transform panel, sehingga scroll
balik tetap menampilkan traveler. Tombol CV aktif sejak panel mulai muncul;
pointerdown primer menghentikan inertia pada posisi aktual dan membatalkan
request fokus navbar lama, tanpa memblokir download native atau blur tombol.

Lenis menghaluskan wheel dengan `lerp: .18` dan `syncTouch: false`; foto serta
teks tidak diberi `useSpring` kedua. Saat Lenis aktif, `html.lenis` memakai
`scroll-behavior: auto` agar CSS smooth scroll tidak ikut mengendalikan halaman.
Tautan dalam halaman memakai scroll-padding/margin CSS, memperbarui hash, dan
bergerak selama 900ms dengan ease-in-out. Home menuju awal halaman; About
menuju akhir reveal desktop, atau posisi arrival/anchor aman pada mobile/flow.
Fokus baru dipindah dengan `preventScroll` setelah posisi akhir dirender,
sehingga guard aksesibilitas About tidak mengganti foto di tengah perjalanan.
Foto fallback memakai ukuran dan crop traveler yang sama. Input baru dapat
membatalkan navigasi; callback lama tidak mengambil fokus lagi. Scroll pointer
atau history melepas fokus section milik navigasi agar traveler dapat kembali;
fokus keyboard/anak konten tetap dilindungi. Keyboard tetap memakai perilaku native.
Tab hidden atau reduced motion menghentikan driver Lenis; cleanup melepas
scheduler, listener, dan instance untuk StrictMode.

Pemeriksaan visual desktop/mobile masih perlu dilakukan; lihat status verifikasi
di `docs/TASKS.md`.
