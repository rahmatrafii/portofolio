# Status proyek

## Latar kontur galeri (2026-11-18)

- [x] Kontur organik lokal di dua tepi, tengah lebih samar, opacity .055/.04.
- [x] Grain tile128px/opacity .015, statis dengan fade atas/bawah 160px.
- [x] Dekorasi terpisah dari stage 3D, aria-hidden dan pointer-events:none.
- [x] npm run check lulus 152 tes/build, kedua SVG runtime HTTP200. Pratinjau
  aset desktop/375px diperiksa di output/qa/gallery-background-desktop.png dan
  gallery-background-mobile.png; alpha tengah kontur nol dan grain bervariasi.
- [ ] QA halaman browser, keyboard dan reduced motion: browser host unavailable.

## Galeri mengikuti audit (2026-11-18)

- [x] Baca audit dan periksa kode website acuan untuk nilai spring, offset,
  ambang pointer, susunan spiral dan parameter mobile yang belum tercatat pasti.
- [x] Tambahkan galeri setelah Projects, sembilan lapisan dari tujuh foto asli
  dengan dua salinan ulang sesuai pilihan pengguna; WebP 480/960 dan alt berbeda.
- [x] Terapkan kedalaman/fade dua arah, sticky/perspektif, pointer, hover,
  garis bawah serta klik tanpa aksi; gunakan scroll App/scheduler Motion.
- [x] Sediakan reduced motion statis, pause hidden, lepas saat inactive,
  invalid geometry fallback dan cleanup listener/observer/subscription/spring.
- [x] npm run check: 152 tes dan build produksi lulus; modul Gallery dan
  gambar WebP pada preview lokal HTTP 200. Tes mencakup perubahan origin akibat
  runway sebelumnya serta callback observer setelah cleanup.
- [ ] QA visual desktop/375px, keyboard dan reduced motion: browser host tidak
  tersedia; Computer Use menghentikan akses karena URL Chrome tidak terverifikasi.
  Tes parameter/simulasi tidak membuktikan kesamaan visual atau FPS.

## Selesai: Anti-Slop Design otomatis untuk coding UI

- [x] Hubungkan skill lokal ke `.agents/skills/anti-slop-design` melalui junction.
- [x] Wajibkan pemakaian saat coding/review UI dengan mode produk yang sudah
  ada dan scope terbatas; dokumentasikan sumber serta pemulihan entry proyek.

## Selesai: Modern Web Guidance untuk coding proyek

- [x] Hubungkan instalasi resmi ke entry skill lokal melalui junction.
- [x] Tambahkan routing wajib sebelum implementasi web sisi klien di AGENTS.md
  serta perbarui inventaris dan instruksi pemulihan skill.

## Revisi aktif: awan section pertama lebih alami

- [x] Aset Hero baru dengan formasi rendah/renggang, bayangan ringan dan
  tepian transparan; header koleksi tetap memakai cloud-bank lama.
- [x] Simpan sumber, prompt/provenance dan WebP responsif 1000/2000;
  optimizer menjaga alpha dan batas transfer 120/350 KB.
- [x] Periksa perbandingan aset serta komposit WebP final pada warna langit.
- [x] npm run check lulus 146 tes dan build produksi.
- Visual halaman desktop/375px, keyboard dan reduced motion belum diperiksa
  langsung: browser host tidak tersedia; computer-use berhenti karena alat
  tidak dapat memastikan URL Chrome. Tes lifecycle bukan pengganti QA visual.

## Revisi aktif: scrollbar popup sesuai tema

- [x] Track biru sangat muda, thumb biru abu membulat, hover/active navy dan
  tanpa panah bawaan pada WebKit; jalur 10px dengan gutter stabil.
- [x] Fallback standar thin, forced colors memakai sistem, hanya CSS panel.
- [x] npm run check lulus 146 tes dan build.
- Verifikasi visual desktop/375px belum dilakukan karena akses browser belum
  tersedia; perubahan tidak menambah handler atau mengubah perilaku scroll.

## Revisi aktif: popup proyek di website

- [x] Terapkan popup di runtime, bukan hanya demo: gambar/CTA memakai button
  tanpa href dan membuka satu dialog, URL/scroll koleksi tetap.
- [x] Panel responsif dengan header/tutup sticky dan seluruh teknologi.
  Animasi gambar 660ms, riak sekali, reverse 420ms dan fallback reduced motion.
- [x] Tombol tutup/Escape/backdrop, interupsi entrance, resize/scroll panel/
  hidden, fokus, overflow lock dan cleanup StrictMode ditangani.
- [x] Regresi anchor lama direproduksi lewat SSR, lalu lulus setelah konversi.
  npm run check lulus 146 tes dan build; modul/CSS runtime HTTP 200.
- URL detail lama tetap fallback. Pengunjung yang masih membuka URL tersebut
  perlu kembali ke koleksi untuk mencoba tombol popup yang baru.
- Pemeriksaan visual desktop/375px, keyboard dan reduced motion belum dapat
  dilakukan karena browser access host tidak tersedia.

## Revisi aktif: interupsi animasi kembali ke Home

- [x] Telusuri rollback koleksi: pointerdown/Escape menjalankan abort sebelum
  return commit, walaupun Home sudah ditampilkan di bawah lapisan koleksi.
- [x] Input saat kembali menyelesaikan Home; pembatalan keberangkatan dan
  pengambilalihan navigasi/history baru tetap memakai aturan sebelumnya.
- [x] Empat regresi gagal sebelum fix dan lulus sesudahnya; mencakup fase
  persiapan/pendaratan, URL/scroll/history serta promise/fokus lama.
- [x] npm run check lulus 136 tes dan build produksi.
- Verifikasi melalui harness navigasi; browser langsung belum tersedia.

## Revisi aktif: kilap folder Home

- [x] Pantulan mengikuti pointer folder pada sampul/ikon/gambar memakai
  variabel yang sudah ada; fade 180ms, tanpa loop atau driver JS baru.
- [x] Sampul depan transparan tipis .9, ikon .84, nama/fokus tetap pekat.
  Lapisan tidak menangkap pointer; guard touch/reduced motion/fokus/navigasi.
- [x] npm run check lulus 132 tes dan build produksi; review sumber CSS/JSX
  memastikan hit area dan tumpukan folder dipertahankan.
- Pemeriksaan visual desktop/375px, keyboard dan reduced motion belum dapat
  dilakukan: browser access host masih tidak tersedia.

## Revisi aktif: hapus garis hover gambar

- [x] Hapus garis tambahan saat gambar di-hover; border statis dan outline
  fokus keyboard dipertahankan, tanpa perubahan navigasi atau CTA.
- [x] npm run check lulus 132 tes dan build.
- Pemeriksaan visual browser belum diulang karena akses sesi belum tersedia.

## Revisi aktif: target navigasi kartu

- [x] Detail hanya dibuka melalui gambar atau Lihat proyek. Kartu memakai
  article; judul/teknologi/+N/latar tidak menjadi link atau kontrol fokus.
- [x] Dua link bernama aksesibel dengan outline fokus. Feedback tombol
  dibatasi hover/fokus/press tombol; gambar/index tetap direct child kartu.
- [x] npm run check lulus 132 tes dan build, termasuk dua link per kartu dan
  router tidak mengintersep klik area tanpa link.
- Pemeriksaan UI desktop/375px, keyboard dan reduced motion belum diulang;
  akses browser pada sesi ini belum tersedia.

## Revisi aktif: stack lengkap dan tombol kartu

- [x] Semua dua belas preview memiliki 5–6 teknologi yang relevan, tanpa
  duplikasi dalam satu proyek. Empat logo ditampilkan dan sisanya +1/+2.
- [x] Tambahkan tujuh logo SVG lokal dan dokumentasi sumber/lisensi.
- [x] CTA navy dengan panah biru pucat; feedback hover/fokus/press melalui
  CSS dan tanpa kontrol bersarang. Reduced motion menghapus gerak/transisi.
- [x] npm run check lulus 132 tes dan build produksi. Seluruh 19 logo diperiksa
  sebagai aset; route/modul/ikon preview HTTP 200.
- Verifikasi visual desktop/375px, keyboard dan reduced motion belum dapat
  dilakukan: inventaris browser melaporkan browser access host unavailable.

## Revisi aktif: logo teknologi bertumpuk dan +N

- [x] Maksimal empat logo dalam lingkaran 40px, logo 24px dan overlap 6px;
  counter +N terpisah hanya saat jumlah melebihi empat.
- [x] Nama sr-only/title native; detail menampilkan semua logo/nama. Tidak ada
  tombol bersarang atau target fokus baru di kartu.
- [x] Footer membungkus sesuai ruang. Data teknologi yang disetujui tetap sama.
- [x] npm run check lulus 132 tes dan build, termasuk 1/4/5/6 logo, +1/+2,
  nama aksesibel, detail lengkap dan data kosong. Modul/CSS preview HTTP 200.
- Pemeriksaan visual browser belum diulang; kendala tangkapan jendela pada
  revisi sebelumnya masih membatasi verifikasi desktop/375px langsung.

## Revisi aktif: kombinasi teknologi dan footer logo

- [x] Hapus label Contoh teknologi; bedakan stack per kartu sesuai daftar
  Web/Mobile dan pasangan Next.js+Gemini atau Flutter+Gemini pada AI.
- [x] Footer ber-divider, logo dalam bidang putih dengan nama tetap terlihat;
  wrapping responsif dan aksi turun di mobile. Referensi dicatat di arsitektur.
- [x] Empat SVG baru dan lisensi terkait disimpan lokal. Kedelapan logo
  dirender dan diperiksa pada output/qa/technology-icons.png.
- [x] npm run check lulus 132 tes dan build produksi; modul preview HTTP 200.
  Tes meliputi kategori, pasangan AI, label dihapus dan stack kosong.
- Pemeriksaan visual browser belum diulang; verifikasi desktop/375px langsung
  masih memiliki kendala tangkapan jendela dari revisi sebelumnya.

## Revisi aktif: tag teknologi kartu

- [x] Ganti label kategori dengan maksimal tiga tag berlogo/nama dari data
  technologies; tag membungkus dan aksi mendapat baris sendiri pada <=760px.
- [x] Flutter/Supabase menjadi contoh visual untuk preview dengan label
  Contoh teknologi. Stack kosong/tidak tersedia tidak mendapat fallback.
- [x] Logo Flutter lokal dipakai ulang; SVG resmi Supabase disimpan lokal.
- [x] npm run check lulus 131 tes dan build; modul/ikon preview HTTP 200.
  Tes mencakup penanda contoh, batas tag dan data teknologi kosong.
- Pemeriksaan visual browser belum diulang; verifikasi desktop/375px langsung
  masih memiliki kendala tangkapan jendela dari revisi sebelumnya.

## Revisi aktif: ornamen kartu

- [x] Tambahkan ikon kategori 18px memakai SVG yang sama dengan folder Home.
  Teks label tetap tersedia; ikon aria-hidden/focusable=false.
- [x] Dot grid statis 96px/opacity .05 di pojok kanan atas kartu, di belakang
  gambar/teks; tidak menangkap pointer atau memotong outline fokus.
- [x] npm run check lulus 130 tes dan build; modul ikon/CSS preview HTTP 200.
- Pemeriksaan visual browser belum diulang; kendala tangkapan jendela pada
  revisi sebelumnya masih membatasi verifikasi desktop/375px langsung.

## Revisi aktif: header kategori lebih berani

- [x] Judul poster kapital besar, deskripsi di kanan, panah diagonal dekoratif
  dan satu divider; <=960px satu kolom dengan tinggi serta wrapping alami.
- [x] Kartu Studio yang disetujui tetap sama. Scope heading hanya kategori,
  tanpa perubahan konten, route, fokus atau animasi baru.
- [x] npm run check lulus 130 tes dan build produksi; CSS/modul preview HTTP 200.
  Tes markup mencakup scope detail serta panah aria-hidden/focusable=false.
- [ ] Verifikasi visual desktop/375px, keyboard dan reduced motion aktual.
  Tangkapan jendela Chrome target gagal karena crop di luar monitor.

## Revisi aktif: kartu Studio pilihan A

- [x] Samakan semua panel ke biru muda #e1f2fc sesuai revisi pengguna;
  terapkan screenshot berbingkai tipis, judul serta baris
  kategori dan Lihat proyek dengan panah lingkaran sesuai gambar pilihan A.
- [x] Grid seragam dua kolom, <=760px satu kolom. Pertahankan satu anchor per
  kartu, img direct child/indeks, fokus, navigasi serta hilangnya disclaimer.
- [x] Hover/fokus/active tanpa gerakan atau loop kartu; panah dekoratif,
  tanpa target fokus baru. Tidak menambah dependency atau scheduler.
- [x] npm run check lulus 130 tes dan build produksi.
- [ ] Verifikasi visual desktop/375px, keyboard dan reduced motion aktual.
  Computer Use berhenti saat validasi URL sebelum preview terbaru dimuat ulang.

## Revisi aktif: hapus disclaimer dan usulan visual kartu

- [x] Hapus paragraf disclaimer yang diminta dari koleksi/detail dan bersihkan
  CSS terkait; nama Pratinjau, metadata temporary serta navigasi dipertahankan.
- [x] Perbarui tes markup dan dokumentasi. npm run check lulus 130 tes dan
  build produksi; modul preview HTTP 200 sudah tanpa disclaimer.
- [x] Buat gambar perbandingan Studio, Editorial dan Navy memakai built-in
  imagegen serta screenshot lokal sebagai referensi. Gambar adalah usulan;
  gaya kartu runtime belum diganti pada revisi ini.
- Pemeriksaan visual browser tidak diulang untuk penghapusan paragraf ini.

## Revisi aktif: galeri koleksi editorial

- [x] Header ringkas, satu awan samar, cover tanpa panel/bayangan, caption
  20–24px dan aksi konsisten. Dua kolom seragam, <=760px satu kolom.
- [x] Hover underline tanpa geser/zoom; outline keyboard tetap tersedia.
  Pesawat hanya Projects Home. Pertahankan route, fokus dan indeks gambar.
- [x] Crop screenshot pada optimizer; PNG asli disimpan. Ketiga hasil WebP
  960x540 sudah diperiksa langsung; konten proyek sementara tetap jujur.
- [x] npm run images:optimize berhasil; npm run check lulus 130 tes dan build.
- [x] Layout baru terlihat pada Chrome desktop, cover baru diperiksa terpisah.
- [ ] Lengkapi pemeriksaan desktop setelah reload aset, 375px, keyboard serta
  reduced motion. Computer Use berhenti saat tidak dapat memastikan URL aktif.

## Revisi aktif: ukuran kartu koleksi seragam

- [x] Seluruh kartu memakai ukuran dan tampilan sama, dua kolom berurutan
  ke bawah; <=760px satu kolom. Hapus varian kartu utama/penutup lebar.
- [x] Pertahankan screenshot 16:9, tautan, indeks gambar dan navigasi kembali;
  perbarui tes markup serta panduan layout koleksi.
- [x] npm run check lulus 130 tes dan build produksi; preview /mobile-app
  HTTP 200 menyajikan komponen dan CSS grid baru.
- [ ] Verifikasi visual desktop/375px, keyboard dan reduced motion aktual.
  Computer Use berhenti karena tidak dapat memastikan URL tab Chrome aktif.

## Revisi aktif: panah kembali detail memulihkan posisi koleksi

- [x] Simpan scroll koleksi pada entri detail dan pulihkan saat panah kembali
  detail menuju koleksinya; kunjungan langsung dan kategori lain tetap dari atas.
- [x] Tes navigasi baru: detail kembali ke posisi kartu, entri langsung tetap 0;
  npm run check lulus 130 tes dan build produksi.
- [ ] Verifikasi browser desktop/375px dan reduced motion aktual; browser desktop
  tidak terhubung ke sesi ini, jadi hasil visual belum diperiksa langsung.

## Revisi aktif: galeri kartu halaman koleksi

- [x] Baca anti-slop-design yang sudah terpasang di instalasi personal;
  tidak menginstal ulang atau mengubah konfigurasi global.
- [x] Galeri screenshot 16:9; susunan awal utama/pendamping/penutup digantikan
  grid seragam pada revisi 17 November. Geist/navy/sky tetap dipertahankan.
- [x] Ganti kembali ke portofolio dengan panah 48px dan label aksesibel;
  detail kembali ke koleksinya. Hapus tombol perpindahan kategori.
- [x] Disclaimer sementara setelah grid, tanpa kalimat placeholder berulang;
  gambar pertama eager. Pertahankan route, index gambar, fokus dan transisi.
- [x] npm run check: 126 tes dan build produksi lulus, termasuk navigasi,
  aksesibilitas markup panah, hilangnya tab kategori, detail dan animasi kembali.
- [ ] Verifikasi browser desktop/375px, keyboard dan reduced motion aktual;
  browser access host tidak tersedia. HTTP halaman dan modul baru sudah 200.

## Revisi aktif: My Projects dengan tiga koleksi

- [x] Judul My Projects; kategori Web Apps, Mobile Apps, AI Integration.
- [x] Hapus label Pratinjau sementara di Home beserta CSS yang tidak dipakai;
  keterangan isi sementara di koleksi/detail tetap ada.
- [x] Ikon timbul browser/ponsel/simpul AI dengan aksen biru/sage/lavender pada
  sampul; satu pesawat terus melintas pada siklus 22s tanpa jeda diam. Garis
  putus dihapus. Band lintasan di atas folder tidak memotong judul/isi.
- [x] Band selebar viewport; pesawat masuk dari luar kanan dan keluar di kiri.
  Hidung mengikuti tangent motion-path, tanpa kemiringan tetap.
- [x] Jalur gelombang/loop acak per lintasan; ganti jalur di luar layar, cache
  geometri dengan ResizeObserver, cleanup listener/var. Pesawat 48px dengan
  ruang aman berputar tanpa clipping; tidak ada timer/RAF tambahan.
- [x] Lifecycle attachCloudMotion yang sama menjeda offscreen/tab-hidden/
  inactive/reduced motion. Folder terbuka tetap bergerak dengan opacity band .42;
  navigasi tetap pause/hidden. Mobile hidden, reduced motion statis, SVG noninteraktif.
- [x] Tiga folder desktop terpusat, maksimal 360px; tablet dua atas dan satu
  terpusat di bawah, mobile satu kolom. Rapikan jarak deskripsi/folder.
- [x] Masing-masing empat preview sementara, urutan gambar depan berbeda;
  deskripsi koleksi membedakan fokus tiap kategori tanpa klaim proyek asli.
- [x] /ai-integration menggantikan kategori AI terpisah; tautan lama kategori
  dan detail tetap membuka koleksi AI. Navigasi dan animasi lama dipertahankan.
- [x] npm run check: 126 tes dan build produksi lulus.
- [ ] Verifikasi visual desktop/375px, keyboard dan reduced motion langsung.

## Revisi aktif: gerak lembar utuh tanpa jeda di batas folder

- [x] Navigasi kategori/detail/Home melalui History API, tanpa refresh dan
  dependency router; tautan native tetap tersedia untuk tab baru/download.
- [x] Hover/fokus naik 14px dengan transisi 260ms; urutan z-index tetap.
- [x] Lembar asli memakai satu animasi dari dalam folder sampai keluar layar;
  550ms dengan offset 0/80/160/240ms, ukuran dan urutan z-index tetap.
- [x] Hilangkan fase angkat, pergantian clone, serta restart easing. Konversi
  inverse rotasi menjaga jalur viewport dan translasi hover pada lembar asli.
- [x] Lengkung horizontal kecil, sudut menuju +/-3deg, fade di tepi atas dan
  seluruh lembar keluar viewport. Hapus jalur kamera/zoom; transform/opacity native.
- [x] Kategori disiapkan invisible/inert; URL berubah sesudah empat lembar lewat,
  lalu halaman koleksi terungkap tanpa hold tambahan. Total maju 900ms.
- [x] Kembali: halaman memudar, setiap lembar asli turun sampai masuk folder
  dalam satu animasi 590ms, tanpa callback insertion lanjutan.
- [x] Simpan DOM/state Home, nonaktifkan driver ketika hidden, pulihkan layout
  lewat postRender Motion dan driver scroll yang sama sebelum mengukur slot.
- [x] Back/Forward, direct entry, fokus, reduced motion, breakpoint berubah,
  input baru, pembatalan, hidden dan cleanup diperiksa lewat tes terarah.
- [x] npm run check: 122 tes dan build produksi lulus; endpoint/modul baru
  tersedia di preview lokal melalui pemeriksaan HTTP.
- [ ] Verifikasi visual desktop/375px, keyboard, reduced motion dan FPS:
  browser access host tidak tersedia. Chrome lokal berhasil dipilih, tetapi
  capture saat memeriksa Projects gagal dengan "window crop is outside captured
  monitor" dan tetap gagal setelah satu pemulihan jendela. Tes bukan bukti
  performa atau rasa gerak.

## Revisi aktif: perbaikan label navbar

- [x] Lebar navbar desktop mengikuti konten, empat kolom tetap sama lebar;
  Journey/Projects tidak dipecah di tengah kata dan indikator tetap proporsional.
- [x] Mobile mempertahankan empat kolom dengan ikon di atas label satu baris.
- [x] npm run check lulus 96 tes/build; CSS baru tersedia pada preview lokal.
- [ ] Periksa visual desktop/375px, keyboard dan reduced motion langsung:
  browser access host tidak tersedia.

## Riwayat: Projects awal dengan empat folder kategori

- [x] Folder biru solid tanpa tekstur awan, tab kanan/sampul tinggi, empat
  sejajar >=1100px, dua kolom 761–1099px, satu kolom <=760px. Semua kartu 16:9.
- [x] Sampul hanya menampilkan nama kategori, tanpa teks/panah Lihat koleksi;
  akses kategori tetap melalui empat lembar saat folder dibuka.
- [x] Entrance berlapis, hover ringan, kipas saat klik, satu folder terbuka,
  Escape/klik luar, fokus keyboard, reduced motion dan cleanup.
- [x] Klik lembar menuju kategori; kartu kategori menuju detail, link kembali,
  judul halaman dan fallback path salah. Tanpa dependency router.
- [x] Empat kartu sementara per kategori, memakai ulang tiga aset pengguna
  di assets/projects; runtime WebP, penanda sementara pada semua halaman.
- [x] npm run check: 96 tes dan build lulus, termasuk route, SSR dan rasio aset.
- [ ] Periksa visual desktop/375px, keyboard, reduced motion dan rasa animasi:
  Computer Use dihentikan alat karena URL Chrome tidak dapat diverifikasi.
- [ ] Ganti konten sementara dengan detail/screenshot asli per kategori.

## Revisi aktif: Journey mobile tersambung dengan fokus tengah viewport

- [x] Satu rail vertikal Education sampai Experience, bulatan, judul bab
  menjorok dan fallback CSS antar bab tanpa memotong teks.
- [x] Fokus kontinu, kepala/ekor cahaya sesuai arah scroll, penekanan ringan
  konten/logo. Scroll touch tetap native tanpa pin atau driver tambahan.
- [x] Cache geometri, ruang akhir node terakhir, restore/resize lintas mode,
  reduced motion, fokus keyboard, hidden/cleanup dan invalid geometry diuji.
- [x] npm run check lulus 93 tes serta build; regresi horizontal/wave desktop lulus.
- [ ] Verifikasi optis desktop/375px, keyboard dan performa gerak di perangkat
  asli: browser access host tidak tersedia. Tes bukan pemeriksaan visual.

## Revisi aktif: About mobile dengan hierarki dan reveal bertahap

- [x] Sapaan kecil, nama dua kelompok, foto lebih ringkas dan profesi/CV
  dalam baris responsif yang dapat membungkus pada layar sempit/zoom.
- [x] Identitas/CV menunggu foto tiba; biografi membuka saat area bacanya
  mendekat. Dua kelompok memakai scroll/controller yang sama, tanpa pin touch.
- [x] Periksa reverse/diam, restore/resize lintas breakpoint, CV saat reveal,
  reduced motion dan cleanup lewat tes; desktop tetap reveal serempak.
- [x] npm run check lulus 89 tes dan build produksi.
- [ ] Preview visual desktop/375px, keyboard dan reduced motion langsung:
  browser access host tidak tersedia. Tes tidak membuktikan kecocokan optis.

## Revisi aktif: kembali ke awan kecil lama sepenuhnya

- [x] Pulihkan cloud-bank asli, dua lapisan bertile, posisi/opacity/mask serta
  arah/delay/durasi desktop 110/78s dan mobile 150/110s sesuai acuan sebelumnya.
- [x] Hapus runtime cloud-breathe, bank sisi besar dan override mobile baru;
  perintah optimasi kembali memakai sumber awan lama. Aset sisi tetap arsip.
- [x] Blok CSS desktop dicocokkan persis dengan acuan lama; aturan mobile,
  reduced motion, fade dan shared sky juga diperiksa. Driver tidak berubah.
- [x] Layout editorial/foto/logo, koreografi About, navbar dan perbaikan CV tetap.
- [x] npm run check lulus 88 tes dan build produksi.
- [ ] Kesamaan visual desktop/375px, loop dan keyboard langsung: browser access
  host tidak tersedia. Pemeriksaan source bukan bukti visual 100% di browser.

## Revisi aktif: gerak awan lebih terlihat

- [x] Near menjadi 48–112px/16px dalam 24–30s; far 28–48px/8px dalam 42–50s.
- [x] Mobile memakai near 24–40px/8px; fase berbeda dan loop tetap halus.
- [x] Batas gerak tetap di dalam overscan sisi; pause/reduced motion tetap.
- [x] npm run check lulus 89 tes dan build produksi.
- [ ] Preview desktop/375px, reduced motion dan kelancaran loop langsung:
  browser access host tidak tersedia.

## Revisi aktif: Hero editorial dan awan bergerak halus

- [x] Judul besar di belakang portrait desktop, copy kiri, orbit logo lebih
  organik dan pelat lebih ringan; mobile/tablet tetap urutan baca yang utuh.
- [x] Generate dua bank awan sisi dari mockup melalui built-in imagegen,
  simpan sumber RGBA/prompt, optimalkan WebP 600/1024, pertahankan aset lama.
- [x] Empat lapisan dekat/jauh, gerak kecil 10–22px/3–6px selama 58–80s;
  mobile dua lapisan. Lifecycle pause/reduced motion lama digunakan ulang.
- [x] Aset dikompositkan pada warna langit dan diperiksa; alpha/ukuran/budget
  serta empat layer runtime diverifikasi. Ini bukan screenshot halaman.
- [x] npm run images:optimize selesai; npm run check lulus 89 tes dan build,
  termasuk regresi CV, anchor, foto/logo, reduced motion dan cleanup.
- [ ] Preview halaman desktop/375px, keyboard, cloud loop dan FPS langsung:
  browser access host tidak tersedia. Kecocokan optis belum terverifikasi browser.

## Revisi aktif: CV sekali klik dan foto kembali ke Hero

- [x] Aktifkan pointer CV sejak panel mulai muncul, bukan menunggu reveal 90%.
- [x] Batasi guard foto/teks pada focus-visible; fokus pointer tidak mengganti
  traveler dengan foto statis atau memindahkan target klik.
- [x] Pointerdown CV menahan posisi aktual dengan melepas inertia Lenis dan
  membatalkan callback fokus navbar lama, tanpa preventDefault/blur CV.
- [x] Regresi download native satu click, early reveal/reverse, callback lama,
  reduced motion, keyboard, history dan cleanup diperiksa dalam tes.
- [x] npm run check lulus 88 tes dan build produksi.
- [ ] Verifikasi browser desktop/375px, urutan pointerdown/focus/click, Tab dan
  unduhan aktual: browser access host tidak tersedia. Tes bukan bukti UI langsung.

## Revisi aktif: keseimbangan teks About

- [x] Kedua panel desktop dibatasi 352px dan merapat ke sisi foto; grid tetap
  center secara vertikal dengan kolom samping setara.
- [x] Judul nama sekitar 10% lebih kecil, tracking dan jarak vertikal dirapikan;
  judul biografi sedikit diperbesar/diperkuat, paragraf tetap terbaca.
- [x] Mobile tetap satu kolom lebar penuh; nama 36–45px, tanpa offset desktop.
- [x] Perubahan hanya CSS; copy, CV, posisi foto, controller dan guard tetap.
- [x] npm run check lulus 85 tes dan build produksi.
- [ ] QA optis desktop/375px, keyboard/reduced motion: browser access host
  tidak tersedia. Tes geometri/lifecycle bukan verifikasi visual browser.

## Revisi aktif: Hero lebih ringkas

- [x] Hapus Saya Rafi dan CTA Tentang saya; navbar About tetap tersedia.
- [x] Ringkas deskripsi dan satukan di bawah AI Engineer pada semua breakpoint.
- [x] Kecilkan logo/pelat 10% desktop dan 8% mobile, tanpa mengubah koreografi.
- [x] Hapus CSS sapaan/CTA dan layout pengantar kiri yang tidak digunakan.
- [x] npm run check lulus 85 tes dan build produksi; render heading/anchor diperiksa.
- [ ] Preview visual desktop/375px, keyboard dan reduced motion: browser access
  host tidak tersedia. Build dan tes tidak membuktikan hasil visual langsung.

## Revisi aktif: navigasi Hero/About

- [x] Anchor bergerak 900ms ease-in-out; wheel .18 dan touch native tetap.
- [x] About menuju endpoint controller yang sama, dengan tujuan flow lebih pendek.
- [x] Fokus ditunda hingga Motion postRender; guard keyboard tetap aktif.
- [x] Fallback foto cocok dengan fit traveler; scroll pointer dapat membalik
  perjalanan setelah navigasi tanpa terkunci oleh fokus section.
- [x] Input baru, klik berulang, resize/history/hidden/mode/cleanup membatalkan
  navigasi dan menolak callback fokus lama; termasuk completion sinkron.
- [x] npm run check lulus 85 tes dan build produksi.
- [ ] QA visual transisi desktop/375px, keyboard dan reduced motion langsung:
  browser access host tidak tersedia.

## Revisi aktif: logo Hero sebelum perjalanan foto

- [x] Tiga pasangan logo muncul dari belakang badan foto saat load atas.
- [x] Scroll menutup logo dahulu lalu menggerakkan foto, tanpa runway tambahan.
- [x] Scroll bisa memotong intro, berhenti dan reverse dari pose aktual.
- [x] Mobile lebih singkat; reduced motion statis lengkap; tab hidden pause.
- [x] Hapus timer/CSS entrance dan offset scroll parallax logo lama.
- [x] npm run check lulus 70 tes dan build, termasuk handoff/restore/resize/cleanup.
- [ ] QA visual occlusion, clearance wajah, keyboard/375px/reduced motion dan
  FPS langsung: browser access host tidak tersedia.

## Revisi aktif: logo Hero

- [x] Next.js, React, Flutter, TypeScript, VS Code, Node.js, hanya logo terlihat.
- [x] Lima SVG lokal dari sumber resmi; TypeScript lama digunakan ulang.
- [x] Posisi/motion/responsivitas tetap; pratinjau enam aset diperiksa.
- [x] npm run check lulus 62 tes dan build.
- [ ] Preview halaman desktop/375px: browser access host tidak tersedia.

## Revisi aktif: nama lengkap

- [x] Header dan judul About memakai Rahmat Rafi Indrayani.
- [x] Nama boleh membungkus tanpa ellipsis; dot marker tetap proporsional.
- [x] npm run check lulus 62 tes dan build.
- [ ] QA visual nama panjang desktop/375px: browser host tidak tersedia.

## Revisi aktif: hapus section Skills/lab navy

- [x] Section biru beserta toolkit/kartu dummy dan kode khususnya dihapus.
- [x] Navbar tiga tujuan nyata; tautan Skills/eksplorasi dihapus, aksi CV tetap.
- [x] Hero masih memiliki enam kartu teknologi asli.
- [x] Ruang akhir Journey cukup untuk node terakhir mencapai pusat.
- [x] npm run check lulus 62 tes dan build, termasuk cek semua target anchor.
- [ ] QA visual desktop/375px dan keyboard/reduced motion langsung: browser
  access host tidak tersedia.

Bagian di bawah merekam tahap sebelumnya; section Skills telah dihapus.

## Revisi aktif: burung dekat dengan blur

- [x] About mendapat 1 burung 64px/blur 1.75px pada kiri atas.
- [x] Journey mendapat 1 burung 72px/blur 2.25px pada band bawah informasi.
- [x] Fase/lintasan berbeda, putaran 76/84s dengan jeda di luar canvas.
- [x] Mobile dan reduced motion menyembunyikan tambahan; burung kecil tetap.
- [x] npm run check lulus 65 tes dan build, termasuk SSR satu tambahan per scene.
- [ ] QA visual desktop/mobile, blur/clearance/ritme langsung: browser host
  tidak tersedia. Timing berbeda tidak menjamin tak pernah muncul bersamaan.

## Revisi aktif: burung Journey

- [x] Lima burung desktop: tiga di atas, dua di bawah; tiga pada mobile.
- [x] Lintasan, ukuran, kecepatan, opacity dan fase berbeda dari About.
- [x] Layer di luar track, tanpa perubahan geometri timeline atau scheduler baru.
- [x] Lifecycle pause/reduced motion/cleanup yang sudah ada dipakai kembali.
- [x] npm run check lulus 65 tes dan build; SSR About tetap 4, Journey 5.
- [ ] QA visual desktop/375px, keyboard/reduced motion dan kelancaran langsung:
  browser access host tidak tersedia.

## Revisi aktif: gelombang dan perjalanan cahaya

- [x] Satu SVG berubah bentuk mengikuti posisi aktual scroll, amplitudo 8px.
- [x] Kepala/ekor cahaya menyusuri kurva secara kontinu dan dapat dibalik.
- [x] Penanda, teks dan logo tetap stabil; envelope nol di setiap node.
- [x] Tanpa scheduler/RAF/listener scroll baru; pause/flow/cleanup tetap aman.
- [x] npm run check lulus 65 tes dan build; selisih hitungan kepala/kurva <0.04px.
- [ ] QA visual desktop/375px, keyboard/reduced motion langsung serta FPS:
  browser access host tidak tersedia. Mode mobile/touch tetap vertikal statis.

## Revisi aktif: hierarki tipografi dan afiliasi

- [x] Ketiga komunitas memiliki afiliasi UIN Maulana Malik Ibrahim Malang.
- [x] Jurusan/peran semibold, identitas medium, angka tabular dan kategori kecil.
- [x] Label Perguruan tinggi, Sekolah kejuruan, Komunitas, PKL konsisten.
- [x] Cek kontras warna sekunder pada opacity .74; guard motion tetap.
- [x] npm run check lulus 60 tes dan build, termasuk afiliasi ketiga komunitas.
- [ ] QA visual desktop/375px dan fokus/reduced motion langsung: browser host
  tidak tersedia. Build bukan bukti tampilan visual.

## Revisi aktif: implementasi mockup jalur penerbangan

- [x] Kurva tersambung dari Education ke Experience, berlian dan connector.
- [x] Sorotan lokal mengikuti scroll aktual, reversible, tanpa scheduler baru.
- [x] Identitas/logo/tahun ringkas, peran lebih utama; hover inner -3px/1.04.
- [x] Logo Simtel asli dipasang sebagai WebP; enam logo tersedia.
- [x] Guard mobile, fokus keyboard dan reduced motion tetap dipertahankan.
- [x] npm run check lulus 60 tes dan build.
- [ ] QA visual desktop/375px, hover/keyboard/reduced motion langsung: akses
  browser host tidak tersedia dan Computer Use berhenti karena URL Chrome
  tidak dapat dipastikan untuk pemeriksaan kebijakan. FPS belum diukur.

Bagian di bawah merekam verifikasi dan tahap implementasi sebelumnya.

## Logo pengguna

- [x] Cocokkan lima logo dengan Education dan Experience, bukan teknologi Skills.
- [x] Hapus latar luar SMKN, pertahankan detail putih internal dan sumber asli.
- [x] Pasang WebP transparan dengan contain, ruang tetap dan opacity timeline.
- [x] npm run check: 60 tes dan build lulus; semua logo memiliki alpha transparan.
- [ ] QA visual desktop/375px: browser access host tidak tersedia.


## Revisi aktif: rail penuh dan sorotan tengah

- [x] Hapus judul besar, deskripsi, tab duplikat, instruksi, progres bawah dan
  footer dari tampilan utama. Heading semantik dan skip link keyboard tetap ada.
- [x] Full viewport tanpa clip internal, fade 40px pada tepi layar. Inset dan
  pengukuran node memastikan node pertama/terakhir melewati fokus yang sama.
- [x] Halo, opacity dan scale berubah kontinu menurut jarak node dari pusat;
  node sebelum/sesudah meredup simetris. Teks pasif opacity .74 tetap terbaca.
- [x] Label Education/Experience mengikuti scroll, tanpa kata bertumpuk.
  Fallback mobile/reduced motion/fokus menampilkan daftar utuh tanpa halo.
- [x] Perbaiki pengukuran lebar setelah fullwidth aktif dan guard fallback
  mode agar tidak ada koreksi posisi frame pertama atau observer loop.
- [x] npm run check lulus 59 tes dan build; HTTP 200 CSS/komponen terbaru.
- [ ] QA visual desktop/375px, keyboard/reduced motion langsung dan FPS:
  browser access host tidak tersedia. Source/tes bukan bukti visual.

Bagian di bawah merekam tahap implementasi sebelumnya.

## Education & Experience

- [x] Section baru setelah About sebelum Skills, menu Journey dengan target nyata.
- [x] Dua pendidikan dan empat pengalaman asli tersimpan di career.js; setiap
  bab terbaru dahulu, tiga pengalaman 2025 mengikuti urutan pengguna.
- [x] Desktop memiliki satu rail horizontal, enam titik, label bab dan progres;
  scroll aktual yang sama menggerakkan rail secara reversibel, lalu sticky lepas.
- [x] Mobile/touch, reduced motion, konten tinggi dan keyboard memakai flow
  vertikal utuh. Fokus terlihat melatch flow; tidak ada teks yang dipudarkan.
- [x] Navbar empat tujuan dan indikator 25%; mobile ikon di atas label, marker
  disembunyikan <=960px. Tidak menambah dependency atau logo rekaan.
- [x] npm run check lulus 55 tes dan build; endpoint komponen/controller/data
  preview terbaru HTTP 200. Sembilan tes baru mencakup logika/lifecycle timeline.
- [ ] Logo menunggu aset asli dari pengguna, sesuai kesepakatan.
- [ ] QA visual desktop/375px, keyboard/reduced motion langsung, serta FPS:
  browser access host tidak tersedia; source/tes bukan bukti visual.

## Penyesuaian keseimbangan teks About

- [x] Identitas desktop mengikuti lebar isi dan merapat ke foto; grid/foto
  tetap terpusat. Judul maksimum 64px, sekitar 11% lebih kecil dari sebelumnya.
- [x] Heading kanan dibatasi 18ch dengan balanced wrapping; body line-height
  1.75 dan sela paragraf 16px. Panel tetap dapat bertambah tinggi.
- [x] Mobile kembali ke lebar penuh, judul maksimum 50px; guard fokus,
  reduced motion dan controller scroll tetap dipertahankan.
- [x] npm run check lulus 46 tes dan build; CSS preview lokal HTTP 200 terbaru.
- [ ] QA visual akhir desktop/375px, keyboard dan reduced motion langsung:
  browser access host tidak tersedia.

## Revisi aktif: langit menyatu dan About terpusat

- [x] Hero/About memakai satu gradient dasar pada intro-journey; warna solid
  section dihapus. Wrapper awan yang diam memudar ke transparan di bawah Hero.
- [x] About tiga kolom: identitas/CV asli, foto tengah, biografi/tautan nyata
  Lihat eksplorasi ke Skills. Pada <=960px foto mendahului kedua blok teks.
- [x] Foto turun lalu tetap di tengah; dua sisi membuka pendek bersamaan,
  sepenuhnya mengikuti scroll aktual dan dapat dibalik. Mask teks dihapus.
- [x] Empat burung individual dengan sprite 12 pose sayap, melayang/kepakan,
  kepala dan lintasan menuju kanan; dua burung mobile, lifecycle tetap.
- [x] Fokus pada About menampilkan kedua kolom penuh dan foto fallback;
  reduced motion statis, konten tinggi/mobile memakai flow tanpa pin.
- [x] npm run check: 46 tes dan build lulus. Tes mencakup reverse, sambungan
  fase, koreksi pusat saat resize, ruang aman teks, touch flow termasuk stage
  pendek yang muat viewport, lifecycle,
  render CTA asli, dan sprite sayap. Aset sprite diperiksa langsung.
- [ ] QA visual desktop/375px, keyboard, reduced motion serta kelancaran gerak:
  browser access host tidak tersedia. Tes sumber/simulasi bukan bukti visual.

Bagian di bawah adalah catatan pekerjaan tahap sebelumnya, bukan spesifikasi aktif.

## CTA CV dan burung infinite

- [x] Tombol navy Unduh CV menggantikan tautan About ke Skills, memakai PDF asli
  pengguna dan download native. Konfigurasi resume di portfolio.js.
- [x] PDF 131.722 byte disalin ke public/documents; SHA-256 sumber/salinan identik.
- [x] Kawanan memakai penerbangan CSS infinite 44 detik desktop/48 detik mobile;
  loop reset di luar area, guard memakai lifecycle awan yang sudah ada.
- [x] Hapus skyProgress lama; pause offscreen/tab hidden serta reduced motion
  statis dipertahankan tanpa scheduler JavaScript tambahan.
- [x] 43 tes dan build lulus; native download, PDF asli, lifecycle, serta kode
  terbaru diverifikasi. HTTP PDF: 200 application/pdf, 131.722 byte.
- [ ] QA langsung desktop/375px, keyboard/reduced motion, dan sambungan loop:
  host browser tidak tersedia. Hasil source/tes bukan bukti visual.

## Langit terbuka dan tipografi About

- [x] Judul tiga baris yang menjelaskan fokus AI, dua paragraf ringkas, dan
  gradasi langit yang meneruskan Hero; portrait tetap menjadi fokus komposisi.
- [x] Generate enam burung desktop/tiga mobile dengan built-in imagegen,
  simpan sumber PNG serta WebP responsif; prompt/provenance di ASSETS.md.
- [x] Kawanan mengikuti skyProgress dari scroll/controller Motion yang sama;
  reversible, tanpa loop, touch lebih pendek, reduced motion statis.
- [x] Mask cerita dilepas pada endpoint dan dipulihkan saat reverse;
  reset/cleanup menghapus state endpoint serta mengembalikan progres burung.
- [x] images:optimize dan npm run check selesai: 43 tes serta build lulus.
  Aset diperiksa langsung; HTTP memverifikasi kode dan gambar terbaru.
- [ ] QA visual halaman desktop/375px, keyboard serta reduced motion langsung,
  dan FPS: host browser tidak tersedia. Tes simulasi bukan bukti visual.

Terakhir diperbarui: 15 November 2026.

## Fondasi dan audit sebelumnya

- [x] React + Vite, JavaScript, CSS biasa, npm lockfile; HTML historis dipertahankan.
- [x] Komponen/data terpisah, aset lokal, AGENTS.md, dokumentasi vibe coding,
  dan empat junction skill lokal.
- [x] Home/About/Skills memiliki target nyata. Projects/Contact disembunyikan
  sesuai jawaban pengguna karena data asli belum tersedia.
- [x] Navbar fixed, indikator section aktif, hysteresis, serta cleanup.
- [x] Parallax berdasarkan waktu, cache geometri, entrance transform/opacity,
  pengantar Rafi, CTA About, dan area link minimal 44px.
- [x] Portrait WebP 500px/800px, original dipertahankan.

## Penyempurnaan viewport, awan, dan navbar

- [x] Hero min-height fallback 100vh/100svh/100dvh; scene memakai ruang tersisa.
- [x] Pengantar tetap dalam flow, termasuk grid desktop lebar, agar teks dapat
  menambah tinggi section. Label navbar dapat membungkus saat teks membesar.
- [x] Ikon outline Home/About/Skills konsisten dengan label dan feedback input.
- [x] Awan fotografis transparan dihasilkan melalui built-in imagegen. Sumber
  `assets/source/cloud-bank.png` (~1,3 MB) berada di luar public.
- [x] Awan WebP responsif 1000px (71.904 byte) dan 2000px (252.516 byte), dua
  lapisan bertile, periode desktop 110/78 detik dan mobile 150/110 detik.
- [x] Awan otomatis; lifecycle menghentikan drift ketika hero offscreen,
  tab hidden, atau reduced motion. Cleanup aman untuk StrictMode.
- [x] Regenerasi portrait dan awan melalui `npm run images:optimize`.
- [x] Prompt/provenance aset didokumentasikan di [ASSETS.md](ASSETS.md).

Parallax dan entrance statis di mobile; drift awan tetap tersedia sesuai arahan
pengguna. Reduced motion menonaktifkan drift. Tombol jeda telah dihapus.

## Redesign section 2 dan lab section 3

- [x] About memakai heading editorial, biografi, dan tautan nyata ke Skills.
  Panel proses dari tahap awal telah diganti dengan foto sesuai arahan berikutnya.
- [x] Section 3 menjadi lab navy dengan toolkit enam teknologi, Atlas sebagai
  feature, serta Flowdesk dan Sinyal sebagai konsep pendamping.
- [x] Data dummy diizinkan pengguna, disimpan di `src/data/explorations.js`,
  dan ditandai pada pengantar serta tiap konsep. Tidak ada klaim hasil proyek.
- [x] Detail tujuan/pendekatan/contoh memakai `details`/`summary` native;
  preview memakai SVG/CSS tanpa aset raster atau dependency baru.
- [x] Reveal sekali per kelompok dengan fallback terbaca, fokus keyboard,
  reduced motion, dan cleanup aman untuk StrictMode.
- [x] CSS menyiapkan susunan desktop/mobile serta konten yang dapat bertambah
  tinggi, termasuk caption dan preview dummy. Label navbar
  diberi `white-space: normal` agar pembungkusan teks tidak diwarisi dari pill.

## Perjalanan foto Hero–About dan kedalaman 3D

- [x] Kartu proses, state tahap, data pendekatan, dan gaya yang tidak dipakai
  dihapus. Foto utama menjadi penghubung kedua section.
- [x] Anchor sumber tetap di Hero; traveler bergerak dengan transform ke anchor
  About melalui controller di App. Posisi akhir mengikuti dokumen.
- [x] Skala seragam, perjalanan mengikuti scroll native dan dapat dibalik,
  geometri tersimpan tanpa pembacaan layout pada setiap scroll.
- [x] Tujuan di kanan biografi desktop dan di atas biografi <=960px. Pengantar
  Hero mendahului scene <1280px agar jalur tidak melintasi teks/CTA.
- [x] Bidang arch/rim/bayangan memberi kedalaman CSS; kemiringan ringan hanya
  pada desktop pointer presisi. Touch memakai rotasi nol, tanpa pointer tracking.
- [x] Reduced motion atau enhancement tidak aktif memakai foto statis di kedua
  slot. Salinan About dekoratif; runtime React tetap memerlukan JavaScript.
- [x] Resize/orientasi, font, pageshow, visual viewport, tab hidden, dan cleanup
  ditangani. Tidak ada dependency atau aset foto baru.

## Transisi dua fase dan bio ringkas

- [x] Foto turun lurus dengan X nol sebelum bergeser kanan. Fase mendatar
  mengompensasi scroll agar tinggi foto di viewport tetap stabil.
- [x] Cerita masuk dari kanan ke kiri memakai progress fase mendatar yang sama.
  Revisi berikutnya mengganti penundaan clearance penuh dengan clip ruang foto.
  Tidak memakai reveal sekali.
- [x] Urutan foto dan cerita dapat dibalik dari posisi saat itu dan berhenti
  ketika scroll berhenti; tanpa timer atau autoplay.
- [x] Bio dipadatkan menjadi dua paragraf. Cerita desktop maksimal 420px dan
  heading maksimal 60px; mobile tetap satu kolom.
- [x] Target mobile/tablet bergeser 12px ke kanan, dengan lebar yang menyisakan
  ruang agar foto tetap muat. Touch tetap tanpa rotasi 3D.
- [x] Cerita tetap dalam accessibility tree, default/reduced motion terbaca,
  dan fokus keyboard langsung menampilkannya.
- [x] `npm run check` setelah integrasi transisi dua fase lulus: 29 tes dan
  build produksi. Tes mencakup urutan fase, tinggi viewport saat geser,
  clearance teks, pembalikan/berhenti, mobile, orientasi, dan bio lebih ringkas.

## Reveal tipografi About

- [x] Label, dua baris judul, dua paragraf, dan CTA menjadi enam kelompok
  berurutan dengan easing saat tiba; tidak lagi memudarkan satu blok sekaligus.
- [x] Mask horizontal pada wrapper diam mengikuti ruang yang ditinggalkan foto;
  progress tiap bagian berjalan sejak fase mendatar, tanpa menunggu seluruh
  lebar cerita bebas.
- [x] Judul terbuka dari mask baris dengan perspektif ringan. Gerak body lebih
  pendek; touch tanpa kemiringan tulisan atau blur.
- [x] Scroll mundur/berhenti, fokus keyboard, reduced motion, fallback statis,
  dan cleanup dipertahankan. Isi tetap dalam accessibility tree.
- [x] `npm run check` setelah integrasi reveal tipografi lulus: 30 tes dan build
  produksi. Pengujian mencakup urutan/easing bagian, mask ruang foto, reverse,
  berhenti, mobile, reduced motion, cleanup, dan heading semantik.

## Revisi cerita keluar dari belakang foto

- [x] Rencana terbaru tercatat di [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): foto turun
  sampai posisi akhir vertikal About sebelum fase kanan/kiri dimulai.
- [x] Integrasi runway/stage, mode pinned bila muat, dan flow untuk konten tinggi.
- [x] Cerita satu blok keluar dari belakang foto dengan clip wrapper diam;
  menggantikan stagger enam bagian dan lipatan judul.
- [x] Rentang scroll lebih panjang, pembalikan tepat, dan berhenti ketika posisi
  scroll diam; tanpa animasi pengejar atau dependency baru.
- [x] Mobile tetap foto di atas biografi dengan geser kanan 24px; touch tanpa rotasi.
- [x] Fokus keyboard, reduced motion, restore/resize saat pinned, dan cleanup
  dipertahankan dalam pemeriksaan source serta tes.
- [x] `npm run check` lulus 32 tes dan build produksi. HTTP memverifikasi App,
  About, controller, dan CSS terbaru pada preview lokal. Fokus keyboard diperiksa
  dari source; tes simulasi mencakup reduced motion, resize/restore, dan cleanup.
  QA visual desktop/375px/keyboard/reduced motion langsung serta FPS masih belum
  dilakukan karena host browser tidak tersedia.

## Stabilisasi foto dan tepi reveal

- [x] Rencana perbaikan tercatat di [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): overlay
  viewport dan tepi cerita gradasi, dengan dua fase serta susunan akhir tetap.
- [x] Traveler dekoratif berada di luar scene Hero; anchor/foto utama statis
  menyimpan geometri dan alt Rafi. Enhancement menampilkan satu foto saja.
- [x] Posisi overlay mengikuti koordinat viewport dan tetap diperbarui setelah
  fase selesai agar foto keluar bersama About, tanpa gerak pengejar.
- [x] Rotasi dinamis wajah dan translateZ dihapus; arch/rim/bayangan tetap memberi
  kedalaman tanpa dependency baru.
- [x] Garis clip keras diganti mask gradasi; feather desktop/touch lebih lembut
  dan menyusut ke nol agar teks akhir sepenuhnya jelas.
- [x] Fokus/reduced motion, gerak balik, stop, fallback flow, resize/restore,
  serta cleanup dipertahankan melalui pemeriksaan source dan tes.
- [x] `npm run check` lulus 34 tes dan build produksi. Tes mencakup koordinat
  viewport, keluarnya foto setelah fase akhir, pembalikan, feather yang hilang
  pada posisi akhir, caching ukuran, serta overlay di luar Hero. HTTP memverifikasi
  App, controller, dan CSS terbaru. Pemeriksaan fokus dan mask CSS berasal dari
  source; kelancaran visual desktop/mobile, keyboard langsung, dan FPS belum
  diperiksa karena host browser tidak tersedia.

Keluhan getaran berasal dari pengamatan pengguna. Pemeriksaan source menemukan
kompensasi native scroll pada traveler lama bersama stage sticky sebagai
kemungkinan penyebabnya; belum ada pembuktian profiling visual. Batas clip biner
terlihat pada source. Kelancaran hasil dan batas optik tetap perlu QA browser.

## Framer Motion dan smooth scroll Lenis

- [x] Pengguna menyetujui Framer Motion untuk animasi serta Lenis untuk scroll
  halaman, termasuk perlambatan singkat setelah input wheel berhenti.
- [x] Dependency `framer-motion` dan `lenis` tercatat di package/npm lockfile.
- [x] Driver Lenis memakai fase read Motion dan satu MotionValue scroll aktual;
  wheel halus, touch native, tanpa smoothing/spring kedua pada foto/cerita.
- [x] Perjalanan foto/cerita memakai `motion.div` dan MotionValue; controller
  dihitung pada fase update serta tidak memakai listener/RAF perjalanan kedua.
- [x] Anchor/hash/fokus, keyboard native, reduced motion, tab hidden, restore,
  resize, serta cleanup StrictMode dipertahankan.
- [x] Guard fokus/reduced motion mengalahkan inline transform/opacity Motion;
  mask lembut, dua fase, dan foto dekoratif/fallback tetap sesuai rancangan.
- [x] `npm run check` lulus 41 tes dan build produksi. Tes mencakup driver Lenis,
  sumber scroll bersama, scheduler Motion, anchor/fokus, keyboard, Back/Forward,
  reduced motion, restore/resize, dan cleanup. HTTP memverifikasi App, About,
  controller, driver (termasuk history terbaru), serta CSS pada preview lokal.
  Pemeriksaan guard fokus/inline style berdasarkan source; QA browser langsung
  dan FPS tetap belum dilakukan karena host browser tidak tersedia.

Pengujian logika, lifecycle, dan build tidak menjamin nol getaran pada semua
perangkat. QA visual desktop/375px/keyboard/reduced motion langsung serta FPS
masih memerlukan browser; host browser pada sesi ini belum tersedia.

## Penghapusan tombol awan dan teks penutup

- [x] Tombol jeda awan beserta state/prop dan gaya yang tidak dipakai dihapus;
  guard offscreen, tab hidden, dan reduced motion tetap dipertahankan.
- [x] Teks penutup dekoratif About “Rasa ingin tahu / Menjadi kemungkinan” dihapus.
- [x] `npm run check` lulus 41 tes dan build produksi. Pencarian source/tes tidak
  menemukan sisa kontrol jeda atau closing; HTTP Hero/About terbaru tidak memuat
  elemen yang dihapus. QA visual browser belum dijalankan karena host tidak tersedia.

## Verifikasi

- [x] Pada tahap reveal tipografi, HTTP memverifikasi controller, markup About,
  dan CSS saat itu tersaji pada preview lokal; ini bukan pemeriksaan visual halaman.

- [x] Pada tahap dua fase, HTTP memverifikasi controller, About, bio ringkas, dan
  CSS saat itu tersaji pada preview lokal. Pemeriksaan akses browser melaporkan
  host tidak tersedia; QA visual belum dijalankan.

- [x] Tahap redesign sebelumnya: `npm run check` lulus 20 tes dan build.
- [x] Tahap perjalanan foto sebelumnya lulus 27 tes dan build:
  mencakup posisi awal/akhir, uniform scale, pembalikan scroll, mobile tanpa
  rotasi, pergantian orientasi di tengah scroll, reduced motion,
  resize/font/pageshow, hidden tab, dan callback lama.
  Tes sebelumnya tetap mencakup migrasi/data,
  navigasi/akhir halaman/hysteresis, render link/ikon, lifecycle parallax/awan,
  lifecycle reveal/fokus/fallback, pergantian mode, respons simulasi 60/120Hz,
  dan ukuran/transparansi aset.
- [x] Pada tahap redesign sebelumnya, HTTP memverifikasi About, lab, data konsep,
  dan CSS saat itu tersaji. Ini bukan pemeriksaan visual browser.
- [x] Pada tahap perjalanan foto sebelumnya, HTTP memverifikasi Portrait, About,
  controller perjalanan, dan CSS saat itu tersaji. Ini juga bukan QA visual.
- [x] Pada tahap hero, HTTP preview memverifikasi WebP awan serta Hero/Header/CSS
  saat itu tersaji.
- [x] Portrait WebP diperiksa sebagai aset mandiri pada tahap sebelumnya.
- [x] Aset awan diperiksa secara visual pada komposit latar `#9dcbea`.
- [ ] QA halaman di browser desktop, 320px/375px, landscape, dan teks diperbesar.
- [ ] Keyboard, hover/pressed, pause/resume, disclosure konsep, reveal,
  perjalanan foto, dan reduced motion di browser.
- [ ] Profiling FPS/kenyamanan gerak pada mouse, trackpad, dan perangkat nyata.

Browser terintegrasi diperiksa ulang dan host tetap tidak tersedia. Pemeriksaan
native Chrome pada tahap perjalanan foto dihentikan alat karena URL aktif tidak
dapat diverifikasi; akses tersebut tidak dilanjutkan atau diganti dengan jalur
otomatis lain. Halaman belum diverifikasi lewat screenshot. Pengujian source dan
simulasi tidak diklaim sebagai bukti visual halaman atau FPS perangkat nyata.

## Menunggu data pengguna

Tambahkan Projects/Contact setelah proyek dan tautan/kontak asli tersedia.
Ganti konsep dummy dengan proyek terverifikasi bila tersedia; pertahankan
pemberitahuan dummy selama kontennya masih contoh. Tidak ada kontak atau klaim
tingkat penguasaan yang dikarang.
