# Catatan perubahan

## 2026-11-18 - Kontur dan grain statis pada galeri

- Tambahkan dua kelompok kontur SVG biru abu di tepi galeri, opacity5.5%
  desktop/4% mobile, dengan bagian tengah lebih kosong.
- Tambahkan grain monokrom tile128px/opacity1.5%. Seluruh dekorasi statis,
  tidak menerima pointer dan memudar pada batas atas/bawah galeri.
- Tempatkan mask pada backdrop terpisah agar stage/transform3D foto tetap
  memakai konteks dan koreografi yang ada; tidak menambah scheduler/dependency.
- npm run check lulus 152 tes dan build; kedua SVG runtime HTTP200. Render
  aset desktop/375px diperiksa, dengan assert alpha tengah nol dan variasi
  grain nyata. Ini bukan screenshot halaman; QA browser/keyboard/reduced motion
  belum diulang karena browser host tidak tersedia.

## 2026-11-18 - Sambungan latar Projects dan galeri

- Samakan warna ujung Projects dan awal galeri melalui satu token #e6f1fc;
  galeri memudar ke #f8fbfd selama min(80svh, 720px) agar tidak ada pergantian
  warna mendadak di batas section. Gunakan Oklab dengan fallback gradient biasa.
- npm run check lulus 152 tes dan build. Verifikasi visual desktop/375px,
  keyboard dan reduced motion belum diulang karena browser host tidak tersedia.

## 2026-11-18 - Fokus foto tim galeri ke kiri

- Atur crop IMG_3417.JPG ke object-position 15% center agar posisi pengguna
  paling kiri masuk bingkai 4:5, berlaku pada seluruh ukuran layar.
  Foto sumber dan animasi galeri tetap memakai implementasi sebelumnya.
- npm run check lulus 152 tes dan build produksi. Foto runtime diperiksa;
  komposisi halaman di browser belum diperiksa ulang.

## 2026-11-18 - Galeri foto dengan perjalanan kedalaman

- Tambahkan Gallery setelah Projects sesuai audit: sembilan lapisan, sticky
  220vh/100svh, perspektif 1200px, rotasi tetap, fade depan/belakang, pointer
  parallax dan hover gambar 105%/700ms serta shadow 300ms tanpa aksi klik.
- Lengkapi angka perkiraan audit dari kode website acuan: offset start30%/end end,
  spring scroll80/30, pointer60/25/massa .5, jendela fase .55 dan ambang input.
  Parameter mobile asli dipertahankan, dengan scroll touch native.
- Gunakan tujuh foto asli dan ulang dua foto pertama sesuai pilihan pengguna;
  buat 14 WebP responsif, orientasi EXIF benar dan sumber tetap utuh.
- Pakai MotionValue scroll App/scheduler Motion yang sudah ada, tanpa driver
  scroll atau dependency tambahan. Reduced motion/geometri gagal memakai grid
  statis; hidden/inactive/cleanup menghentikan spring dan melepas lifecycle.
- Verifikasi parameter audit, reverse, pointer, fallback dan cleanup lewat tes
  Node/SSR; npm run check lulus 152 tes dan build produksi. Modul Gallery dan
  WebP runtime pada preview lokal mengembalikan HTTP 200.
  QA visual desktop/375px, keyboard dan reduced motion belum dapat
  dijalankan: browser host tidak tersedia dan Computer Use berhenti karena URL
  Chrome tidak dapat dipastikan. Kesamaan visual mutlak belum terverifikasi.

## 2026-11-18 - Anti-Slop Design otomatis untuk coding UI

- Hubungkan anti-slop-design yang sudah tersedia secara lokal ke entry proyek
  melalui junction; tambahkan routing wajib untuk coding dan review UI.
- Terapkan mode existing product/constrained scope agar panduan mengikuti
  desain yang ada serta cakupan permintaan. Perbarui inventaris, pemulihan
  junction, README, dan status pekerjaan.

## 2026-11-18 - Modern Web Guidance untuk coding proyek

- Hubungkan skill resmi yang sudah terpasang ke `.agents/skills/modern-web-guidance`
  melalui junction, mengikuti pola discovery lokal proyek.
- Wajibkan search/retrieve panduan relevan sebelum implementasi HTML, CSS,
  komponen UI, dan JavaScript sisi klien di AGENTS.md; dokumentasikan sumber,
  cakupan, dan pemulihan junction di docs/SKILLS.md serta README.

## 2026-11-18 - Awan Hero lebih alami

- Ganti aset section pertama dengan formasi cumulus rendah yang lebih renggang,
  ukuran/jarak bervariasi, bayangan ringan dan tepian uap transparan. Dibuat
  memakai built-in imagegen bergaya fotografis; provenance dan prompt dicatat.
- Pisahkan hero-cloud-bank dari cloud-bank header koleksi. PNG RGBA asli
  disimpan di assets/source; WebP responsif 1000/2000 berukuran 97.468/344.022
  byte memakai quality 80 dan alphaQuality 100. Pipeline regenerasi diperbarui.
- Geometri dua lapisan, drift, pause offscreen/tab hidden dan reduced motion
  tetap memakai implementasi yang ada. Tidak ada dependency atau driver baru.
- npm run check lulus 146 tes dan build, termasuk transparansi, proporsi,
  budget aset serta lifecycle awan. Perbandingan aset lama/baru dan komposit
  WebP final pada warna langit diperiksa di output/qa.
- Pemeriksaan halaman desktop/375px, keyboard dan reduced motion di browser
  belum selesai: browser host tidak tersedia dan computer-use dihentikan
  karena URL jendela Chrome tidak dapat dipastikan oleh alat.

## 2026-11-18 - Scrollbar popup mengikuti tema

- Ganti tampilan scrollbar panel menjadi track biru sangat muda dan thumb
  biru abu membulat; hover/active navy. Jalur WebKit 10px dengan pegangan
  terlihat 6px, margin ujung 14px, tanpa tombol panah bawaan.
- Gunakan gutter stabil, fallback standar thin dan scrollbar sistem pada
  forced colors. Perubahan hanya CSS panel, tanpa library/handler baru.
- npm run check lulus 146 tes dan build. Visual desktop/375px belum diperiksa
  langsung karena koneksi browser pada sesi ini masih tidak tersedia.

## 2026-11-18 - Popup proyek diterapkan langsung pada website

- Ganti kedua anchor kartu menjadi button native yang membuka ProjectModal.
  Klik gambar/CTA tidak lagi mengganti route atau history; judul/teknologi/
  latar tetap pasif. URL detail lama masih tersedia untuk kunjungan langsung.
- Tambahkan dialog responsif navy/sky dengan screenshot besar, semua logo/nama
  teknologi, satu panel scroll dan header/tutup sticky. Scroll koleksi terkunci
  sementara dan fokus kembali ke pemicu ketika popup ditutup.
- Terapkan flight gambar 660ms dengan lift/tilt/pantulan, riak sekali serta
  reverse 420ms. Escape/tutup/backdrop dapat memotong entrance dari pose saat
  itu. Reduced motion, resize/scroll panel/hidden, cleanup dan promise lama
  memiliki jalur penyelesaian tanpa meninggalkan lock atau snapshot.
- npm run check lulus 146 tes dan build. Regresi SSR gagal pada anchor lama
  lalu lulus setelah konversi; tes tambahan mencakup 12 isi popup, lifecycle,
  fokus, lock, interupsi dan fallback. Modul/CSS runtime HTTP 200.
- Pemeriksaan visual desktop/375px serta keyboard/reduced motion di browser
  belum dapat dilakukan: browser access host masih tidak tersedia.

## 2026-11-17 - Klik saat lembar kembali tetap menuju Home

- Perbaiki pointerdown/Escape yang membatalkan animasi kembali sebelum commit
  dan menampilkan ulang koleksi lama. Input saat tujuan Home kini menyelesaikan
  pendaratan melalui jalur immediate yang ada; keberangkatan belum commit ke
  koleksi tetap dapat dibatalkan. Navigasi/history baru tetap mengambil alih.
- Empat tes regresi mereproduksi kegagalan sebelum perbaikan, lalu lulus:
  klik kosong/Escape sebelum restore dan saat lembar turun, URL/scroll Home,
  history satu kali, serta promise lama tidak mengubah render atau fokus.
- npm run check lulus 136 tes dan build. Reproduksi melalui harness navigasi;
  pemeriksaan interaksi langsung di browser belum tersedia pada sesi ini.

## 2026-11-17 - Kilap dan transparansi folder Home

- Tambahkan pantulan radial/pita diagonal yang mengikuti variabel pointer
  folder pada sampul, ikon dan gambar preview. Kilap memudar 180ms saat
  hover masuk/keluar tanpa loop, JS, dependency atau scheduler baru.
- Sampul depan memakai fill-opacity .9 dan ikon .84; label/fokus tetap pekat.
  Lapisan kilap tidak menangkap klik, mengikuti clip/radius yang ada dan
  disembunyikan saat fokus keyboard/navigasi. Touch/reduced motion tetap statis.
- npm run check lulus 132 tes dan build. Review CSS tidak menemukan konflik
  klik/tumpukan; visual desktop/375px, keyboard dan reduced motion belum diuji
  langsung karena browser access host masih tidak tersedia.

## 2026-11-17 - Hapus garis hover gambar kartu

- Hapus inset shadow yang membentuk garis saat gambar kartu di-hover.
  Border tipis statis, outline fokus keyboard dan interaksi CTA tetap.
- npm run check lulus 132 tes dan build. Pemeriksaan visual browser belum
  diulang karena akses browser pada sesi ini belum tersedia.

## 2026-11-17 - Navigasi detail hanya gambar dan tombol

- Ganti anchor seluruh kartu menjadi article. Gambar memiliki link transparan
  yang terbatas pada area 16:9; Lihat proyek menjadi link terpisah. Keduanya
  bernama aksesibel dan memiliki fokus keyboard terlihat.
- Judul, latar kartu, teknologi dan +N tidak membuka detail. Hover/press CTA
  hanya merespons tombol; screenshot tetap direct child agar transisi kembali
  ke folder mempertahankan kontrak indeks yang sama.
- npm run check lulus 132 tes dan build, termasuk tepat dua link tiap kartu,
  data teknologi di luar link dan klik area tanpa link tidak diintersep router.
- Pemeriksaan visual desktop/375px, keyboard dan reduced motion belum diulang;
  akses browser pada sesi ini belum tersedia.

## 2026-11-17 - Stack lengkap dan aksi kartu interaktif

- Lengkapi dua belas preview dengan 5–6 teknologi relevan per kartu. Stack
  dasar pilihan pengguna tetap di awal; empat logo terlihat dengan +1/+2,
  sedangkan detail tetap menampilkan seluruh nama dan logo.
- Tambahkan tujuh SVG Devicon lokal serta sumber/lisensinya. Tidak ada
  dependency aplikasi baru atau perubahan status konten Pratinjau.
- Ubah Lihat proyek menjadi pill navy dengan label putih dan bidang panah
  biru pucat. Hover/fokus menggeser panah 2px, press memberi skala .97;
  reduced motion meniadakan gerak dan transisi. Seluruh kartu tetap satu link.
- npm run check lulus 132 tes dan build, termasuk jumlah stack, nama unik,
  pasangan framework/bahasa, +N dan daftar detail. Seluruh 19 logo diperiksa
  terpisah; route/modul/ikon preview HTTP 200. Verifikasi visual desktop,
  375px, keyboard dan reduced motion belum tersedia: browser access host gagal.

## 2026-11-17 - Logo teknologi bertumpuk ringan dan +N

- Kartu menampilkan maksimal empat logo tanpa label terlihat: logo 24px dalam
  lingkaran 40px, overlap 6px. Kelebihan memakai +N terpisah dari logo terakhir.
- Nama tetap tersedia melalui title native serta sr-only. Daftar lengkap
  logo/nama tersedia di detail, tanpa kontrol baru dalam anchor kartu.
- Footer membungkus sesuai ruang, tanpa animasi atau timer baru. Data teknologi
  yang dipilih pengguna tetap sama; counter diuji lewat fixture.
- npm run check lulus 132 tes dan build, termasuk kasus 1/4/5/6 teknologi,
  +1/+2, nama aksesibel, daftar detail lengkap dan stack kosong. Modul/CSS
  preview HTTP 200; pemeriksaan visual browser belum diulang.

## 2026-11-17 - Teknologi per kategori dan footer logo

- Hapus label Contoh teknologi. Bedakan kombinasi tiap kartu sesuai pilihan
  pengguna: Web Next.js/React/Laravel/Firebase, Mobile Flutter/Java/Supabase,
  AI Next.js+Gemini atau Flutter+Gemini. Nama Pratinjau tetap tersedia.
- Jadikan teknologi satu footer ber-divider dengan logo 24px dalam bidang
  putih 36px dan nama terlihat. Daftar membungkus; aksi turun di mobile.
- Tambahkan logo Laravel, Firebase, Java dan Gemini lokal serta pemberitahuan
  lisensi aset terkait. Delapan logo sudah diperiksa sebagai gambar terpisah.
- npm run check lulus 132 tes dan build produksi, termasuk validasi kategori,
  pasangan AI, hilangnya label serta stack kosong. Modul preview HTTP 200;
  pemeriksaan visual browser belum diulang.

## 2026-11-17 - Tag teknologi di kartu koleksi

- Ganti label kategori berulang dengan maksimal tiga tag logo/nama teknologi.
  Daftar membungkus; di mobile daftar dan aksi memakai baris terpisah.
- Data preview menampilkan Flutter/Supabase dengan label Contoh teknologi;
  proyek tanpa technologies tidak mendapat stack fallback. Logo Supabase
  resmi disimpan lokal; logo Flutter yang sudah ada dipakai ulang.
- npm run check lulus 131 tes dan build produksi. Tes baru mencakup penanda
  contoh, batas tiga tag, aset lokal dan stack kosong/tidak tersedia.
  Modul/ikon preview HTTP 200; pemeriksaan visual browser belum diulang.

## 2026-11-17 - Ornamen ikon kategori dan dot grid

- Tambahkan ikon outline 18px di samping label kategori dan dot grid samar
  96px/opacity .05 di pojok kanan atas kartu, di belakang screenshot dan teks.
- Gunakan ulang SVG folder Home lewat ProjectCategoryIcon; label teks tetap
  tersedia, ikon dekoratif dan pola tidak menerima fokus/pointer. Ornamen statis.
- npm run check lulus 130 tes dan build produksi; modul ikon dan CSS baru
  tersaji HTTP 200. Pemeriksaan visual browser belum diulang.

## 2026-11-17 - Header kategori dengan tipografi poster

- Perbesar judul kategori menjadi kapital 64–112px/650, pindahkan deskripsi
  ke kanan dengan panah diagonal dekoratif dan divider. <=960px satu kolom
  dengan judul 52–88px; tinggi alami dan wrapping per kata tetap tersedia.
- Terapkan hanya pada koleksi; heading detail/not-found, kartu Studio, warna
  biru seragam, konten, route dan perilaku navigasi dipertahankan.
- npm run check lulus 130 tes dan build; tes markup memeriksa batas koleksi/
  detail serta panah dekoratif. CSS/modul preview HTTP 200.
- Pemeriksaan visual desktop/375px, keyboard dan reduced motion belum lengkap:
  alat tidak berhasil menangkap jendela Chrome target (crop di luar monitor).

## 2026-11-17 - Samakan warna kartu Studio

- Semua kartu koleksi memakai biru muda #e1f2fc seperti kartu kiri; hapus
  pengecualian sage pada kartu genap.
- npm run check lulus 130 tes dan build produksi. CSS preview HTTP 200 sudah
  tanpa warna selang-seling; pemeriksaan browser tidak diulang.

## 2026-11-17 - Terapkan kartu Studio pilihan pengguna

- Terapkan opsi A dari gambar usulan: panel biru/sage bergantian, sudut 22px,
  screenshot 16:9 berbingkai tipis, judul serta baris kategori/aksi di dalam kartu.
- Tambahkan panah lingkaran dekoratif pada Lihat proyek. Seluruh kartu tetap
  satu anchor; img direct child/indeks, route, dan transisi tetap tersedia.
- Dua kolom seragam desktop dan satu kolom <=760px; padding lebih ringkas di
  mobile. Hover/fokus/active jelas tanpa gerakan kartu atau scheduler tambahan.
- npm run check lulus 130 tes dan build produksi. Pemeriksaan visual desktop,
  375px, keyboard dan reduced motion belum selesai: Computer Use terhenti saat
  validasi URL aktif sebelum halaman terbaru dapat dimuat ulang.

## 2026-11-17 - Hapus disclaimer koleksi dan detail

- Hapus paragraf "Pratinjau sementara. Gambar yang sama digunakan di beberapa
  kategori; informasi proyek asli belum ditambahkan." dari komponen bersama
  koleksi/detail, beserta CSS footer yang tidak lagi digunakan.
- Nama Pratinjau dan metadata temporary tetap tersedia; konten contoh tidak
  diubah menjadi klaim proyek asli. Tes markup dan panduan diperbarui.
- npm run check lulus 130 tes dan build produksi. Modul preview HTTP 200
  sudah tanpa paragraf tersebut; pemeriksaan browser tidak diulang.

## 2026-11-17 - Galeri koleksi editorial

- Jadikan cover dan caption sebagai galeri dua kolom seragam, satu kolom mobile.
  Hapus panel putih, padding, lapisan belakang serta bayangan kartu. Cover 14px,
  judul 20–24px dan aksi konsisten; hover underline tanpa geser atau zoom.
- Padatkan header, kecilkan judul, dan batasi satu awan samar di area atas.
  Hapus pesawat dari koleksi; PaperPlane di Projects Home tetap tersedia.
- Crop screenshot melalui optimizer untuk membuang scrollbar, sisi browser
  dan potongan section berikutnya. PNG asli dipertahankan, hasil tetap WebP
  960x540 contain; tidak menambah klaim proyek/peran/teknologi.
- npm run images:optimize dan npm run check berhasil: 130 tes dan build produksi.
  Ketiga WebP baru diperiksa langsung. Layout desktop terlihat di Chrome,
  sebelum reload cover baru; pemeriksaan lanjutan berhenti pada validasi URL
  Computer Use. Desktop akhir/375px, keyboard dan reduced motion belum lengkap.

## 2026-11-17 - Grid kartu koleksi seragam

- Samakan seluruh kartu Web Apps, Mobile Apps dan AI Integration menjadi dua
  kolom berurutan ke bawah, satu kolom pada <=760px. Hilangkan perlakuan kartu
  utama/penutup lebar; tinggi baris, padding, judul dan jarak kartu konsisten.
- Pertahankan screenshot 16:9, tautan detail, indeks gambar dan navigasi kembali.
- npm run check lulus 130 tes dan build produksi. Preview /mobile-app HTTP 200
  menyajikan komponen/CSS baru. Pemeriksaan visual desktop/375px, keyboard dan
  reduced motion belum selesai: Computer Use berhenti karena tidak dapat
  memastikan URL tab Chrome aktif untuk pemeriksaan kebijakannya.

## 2026-11-17 - Panah kembali detail memulihkan posisi koleksi

- Simpan posisi scroll koleksi pada entri detail saat kartu dibuka, lalu pakai
  posisi itu ketika panah kembali detail menuju koleksinya. Sebelumnya entri
  koleksi baru selalu dimulai dari atas (scroll 0).
- Kunjungan langsung ke detail atau kategori lain tetap mulai dari atas; Back
  browser tetap memakai scroll tersimpan di history.state seperti sebelumnya.
- npm run check lulus 130 tes dan build produksi. Browser desktop tidak tersedia,
  jadi hasil visual desktop/375px, keyboard dan reduced motion belum diperiksa
  langsung; build bukan bukti visual.

## 2026-11-16 - Redesign koleksi menjadi galeri kartu proyek

- Gunakan anti-slop-design yang sudah terpasang lokal, bersama panduan frontend
  proyek. Ambil hierarki kartu dari referensi pengguna: satu utama lebar, dua
  pendamping, satu penutup; satu kolom mobile. Geist/navy/sky tetap konsisten.
- Utamakan screenshot asli 16:9 tanpa glass, glow, awan tambahan atau badge
  rekaan. Gambar pertama eager/high priority; ketiga lainnya lazy.
- Ganti teks/logo kembali menjadi ikon panah dengan aria-label/title dan target
  48px. Koleksi kembali ke Home, detail ke koleksinya. Hapus seluruh tab kategori.
- Pindahkan penjelasan sementara ke bawah grid dan hapus pengulangan kalimat
  placeholder per kartu. Konten contoh asli tidak diubah menjadi klaim proyek.
- Pertahankan href, img direct child/data-project-index, judul halaman, fokus,
  History API dan animasi kembali. Hover underline tanpa pergeseran kartu.
- npm run check lulus 126 tes dan build produksi. Halaman dan modul baru tersaji
  HTTP 200. Browser access host tidak tersedia, sehingga desktop/375px, keyboard
  dan reduced motion belum diperiksa langsung; build bukan bukti visual.

## 2026-11-16 - Hidung pesawat mengikuti jalur acak dan putaran

- Ganti sudut miring tetap dan crossing/glide terpisah dengan CSS motion-path.
  Hidung SVG +X mengikuti tangent kurva memakai offset-rotate:auto pada siklus
  22s. Gerak bervariasi naik-turun atau satu loop kecil, tanpa balik mendadak.
- Jalur kubik dirandomisasi setiap animationiteration di luar layar. Ukuran
  dicache via ResizeObserver/fallback resize; cleanup melepas listener dan var.
  Tidak ada layout read per frame/iterasi, timer, RAF atau dependency tambahan.
- Pesawat 48x38,4px dan margin Y 35px menjaga seluruh badan/bayangan saat berputar
  tetap dalam band 88px. Pertahankan viewport entry kanan, redup saat folder
  aktif, navigasi pause, lifecycle offscreen/tab-hidden, mobile dan reduced motion.
- npm run check lulus 126 tes dan build produksi. Tes mencakup 320 jalur acak,
  margin badan berputar, entry/exit, tangent kontinu, loop, reroll, resize serta
  observer/listener cleanup. Kualitas visual/FPS belum diperiksa langsung.

## 2026-11-16 - Pesawat masuk dari luar tepi kanan viewport

- Perluas band pesawat ke 100vw, dipusatkan terhadap heading agar tidak terpotong
  pada batas konten 1280px. Crossing mulai di luar kanan dan berakhir di luar kiri.
- Mirror gambar pesawat dan arah sudut glide agar hidung mengikuti arah kiri.
  Hapus fade masuk/keluar: opacity tetap .72 dan reset terjadi sepenuhnya di luar
  layar. Siklus 22s, redup saat folder terbuka dan guard pause tetap dipertahankan.
- npm run check lulus 123 tes dan build produksi; CSS viewport dan arah gambar
  tersedia di preview lokal. Gerakan di tepi layar belum diverifikasi visual.

## 2026-11-16 - Pesawat terus melintas saat folder terbuka

- Ubah crossing/glide menjadi siklus 22s tanpa fase menunggu 36s di luar area.
  Pesawat keluar penuh dan reset ketika opacity nol; band dan ukuran tetap.
- Folder terbuka hanya meredupkan band ke opacity .42 dengan transisi lembut;
  tidak lagi menjeda, menyembunyikan atau mengulang penerbangan.
- Navigasi tetap pause/hidden. Guard offscreen, tab-hidden, Home inactive,
  reduced motion dan mobile tetap dipertahankan. Tanpa JavaScript tambahan.
- npm run check lulus 123 tes dan build produksi; CSS baru terverifikasi lewat
  preview HTTP. Browser connector tidak tersedia sehingga rasa gerak/FPS belum
  diverifikasi secara visual.

## 2026-11-16 - Pesawat kertas sesekali melintas pada My Projects

- Ganti ornamen pesawat statis dan garis putus dengan satu pesawat bergerak
  melengkung di band 88px antara deskripsi dan folder. CSS crossing/glide
  membuat 12s melintas dan 36s menunggu di luar area, tanpa berbalik mendadak.
- Gunakan attachCloudMotion yang sama dengan awan/burung untuk pause offscreen,
  tab hidden, reduced motion dan cleanup. Effect active melepasnya saat Home
  disembunyikan. Tanpa dependency, timer, RAF atau scheduler JS baru.
- Pesawat disembunyikan dan dijeda saat folder dibuka atau navigasi berlangsung,
  lebih kecil di tablet, hidden pada <=760px, statis untuk reduced motion.
- npm run check lulus 123 tes dan build produksi, termasuk tes lifecycle bersama
  untuk pause/resume/hidden/reduced motion/StrictMode cleanup. Durasi adalah nilai
  deklarasi; kualitas visual dan FPS belum terverifikasi melalui browser.

## 2026-11-16 - Ikon sampul dan pesawat kertas pada My Projects

- Tambahkan ikon timbul browser, ponsel dan simpul terhubung untuk membedakan
  Web Apps, Mobile Apps dan AI Integration; aksen biru, sage dan lavender.
  Ukuran ikon responsif 40–52px, panel folder tetap biru dengan nama di bawah.
- Tambahkan satu pesawat kertas dengan lintasan lengkung putus tipis pada
  kanan judul; lebih kecil di tablet dan disembunyikan mobile agar teks lega.
- SVG lokal inline, statis, aria-hidden dan focusable=false; pointer tetap
  menuju kontrol folder. Tanpa dependency, animasi atau scheduler tambahan.
- npm run check lulus 123 tes dan build produksi. Pemeriksaan visual browser
  belum dilakukan; hasil build bukan bukti kecocokan visual atau FPS.

## 2026-11-16 - Hapus label sementara pada section My Projects

- Hapus teks Pratinjau sementara di Home beserta aturan CSS yang tidak dipakai.
  Keterangan konten sementara di koleksi/detail tetap tersedia.
- Ornamen tambahan masih berupa saran; belum mengubah visual folder atau animasi.

## 2026-11-16 - My Projects dengan tiga folder koleksi

- Ganti judul menjadi My Projects dan kategori menjadi Web Apps, Mobile Apps,
  AI Integration. Koleksi AI memakai /ai-integration; dua alamat AI lama dan
  detail tetap dikenali sebagai alias ke koleksi baru.
- Pusatkan tiga folder desktop dengan batas lebar 360px; tablet dua folder
  di atas dan satu di tengah bawah, mobile satu kolom. Kurangi padding atas
  folder agar jarak terhadap deskripsi lebih rapat.
- Pertahankan empat preview sementara per folder, dengan gambar depan yang
  berbeda dan deskripsi kategori berdasarkan fokusnya. Jangan menganggap
  screenshot sementara sebagai bukti fungsi web/mobile/AI asli.
- Animasi lembar, fokus, reduced motion dan navigasi tanpa refresh dipertahankan.
- npm run check lulus 123 tes dan build produksi; tes memeriksa tiga kategori,
  12 lembar, detail, reduced motion, penanda sementara dan kompatibilitas URL AI.
- Verifikasi visual browser belum selesai; build bukan bukti layout atau FPS.

## 2026-11-16 - Hilangkan berhenti di sambungan keluar dan masuk folder

- Gabungkan angkatan/penerbangan menjadi satu animasi pada setiap lembar asli,
  durasi 550ms dan stagger 80ms. Hapus clone visual serta pergantian elemen di
  batas folder; sampul asli menyediakan occlusion sesuai urutan tumpukan.
- localSheetFrames mengubah jalur viewport ke koordinat lokal dengan inverse
  rotasi kipas dan mempertahankan translasi hover. Tilt melurus bersamaan,
  bukan menjadi fase tunggu. Total maju tetap 900ms termasuk reveal halaman.
- Saat kembali, satu animasi 590ms membawa lembar dari atas sampai posisi dalam
  folder. Hapus berhenti pada pendaratan dan callback yang memulai insertion baru.
- Navigasi memakai leaveFolder langsung, tanpa await angkatan terpisah.
  Pertahankan History API, restore scroll, fokus, reduced motion dan interupsi.
  Will-change sementara dilepas bersama class source saat cleanup.
- npm run check lulus 122 tes dan build produksi. Tes mencakup inverse rotasi,
  posisi hover, jalur monoton, satu efek per lembar pada dua arah, satu clock,
  batas durasi, navigasi setelah exit serta pembatalan dan cleanup.
- Rasa gerak/FPS belum diverifikasi secara visual; hasil tes bukan bukti FPS.

## 2026-11-16 - Transisi lembar melayang ke atas dan kembali turun

- Ganti pembesaran menuju kamera dengan lembar berukuran tetap yang melayang
  ke atas melalui lengkung kecil. Rotasi menuju +/-3deg, opacity hanya memudar
  di tepi atas, dan geometri diagonal memastikan lembar keluar sepenuhnya.
- Empat lembar mengikuti satu clock, durasi 480ms dengan stagger 80ms. Angkatan
  70ms dan reveal kategori 110ms membuat total deklarasi maju 900ms. Kategori
  siap sebelum animasi dan aktif segera setelah lembar terakhir keluar.
- Saat kembali, koleksi memudar lalu lembar turun dari atas ke folder. Setiap
  lembar langsung melakukan insertion 110ms setelah mendarat. Hapus kode kamera,
  shared zoom dan guard CSS yang sudah tidak dipakai; tanpa dependency baru.
- Pertahankan hover 14px, z-index, History API tanpa refresh, restore scroll,
  fokus, reduced motion, input interrupt dan cleanup seluruh animasi tertunda.
- npm run check lulus 124 tes dan build produksi. Tes mencakup geometri desktop/
  375px, ukuran tetap, seluruh bidang keluar layar, overlap dan handoff, batas
  durasi, navigasi sesudah exit, descent/insertion per lembar serta pembatalan.
- Kualitas gerak/FPS belum terverifikasi langsung; tes bukan bukti performa.

## 2026-11-16 - Lembar saling menyusul sebelum melewati kamera

- Ubah antrean penerbangan menjadi overlap pada satu clock: durasi 460ms per
  lembar, mulai setiap 150ms. Lembar berikutnya sudah mendekat sebelum yang
  depan hilang; urutan depan/belakang dan hover 14px dipertahankan.
- Ukur empat pose terangkat sekaligus sebelum penjadwalan. Native handoff
  mengangkat lalu menyembunyikan source tepat saat clone berangkat; clone
  tertunda tetap hidden dengan forwards fill agar tidak meloncat keluar sampul.
- Lepas masing-masing clone sesudah melewati kamera, lalu aktifkan kategori
  sesudah lembar terakhir. Pertahankan reduced motion, input interrupt, fokus,
  History API dan animasi kembali. Tanpa dependency, timer atau RAF tambahan.
- Tes mencakup overlap semua lembar desktop/375px, satu clock, kedalaman,
  handoff source/clone, navigasi setelah lembar terakhir, serta pembatalan
  follower yang sedang berjalan setelah lembar pertama melewati kamera.
- npm run check lulus 123 tes dan build produksi. Browser connector tidak
  tersedia; capture Chrome lokal gagal dengan "window crop is outside captured
  monitor", termasuk setelah satu pemulihan. Kualitas gerak/FPS Projects belum
  terverifikasi secara visual; hasil tes tidak dianggap sebagai bukti performa.

## 2026-11-16 - Hover lebih tinggi dan ritme kamera satu per satu dipadatkan

- Hover/fokus lembar naik 14px dari 10px dengan transisi 260ms, tanpa mengubah
  z-index. Klik memakai urutan depan ke belakang, satu clone kamera setiap saat.
- Angkatan berikutnya disiapkan pada akhir penerbangan sebelumnya; jeda native
  kamera berikutnya 10ms. Tidak ada lagi penantian angkatan 100ms di antaranya.
- Jalur pusat/sudut kini melengkung dengan satu easing. Bidang melewati kamera
  dari z=0 hingga 1002px pada perspective 1000px; ekor di belakang kamera lebih
  pendek. Animasi maju hanya mengubah transform/opacity, tanpa timer/RAF baru.
- Kategori ditampilkan sesudah seluruh lembar lewat, tanpa refresh; perilaku
  kembali, reduced motion, pembatalan dan cleanup dipertahankan.
- Tes memastikan hanya satu kamera, delay 10ms, persiapan selesai dengan kamera
  sebelumnya, jalur proyeksi, clipping, urutan, pembatalan dan cleanup.
- npm run check lulus 122 tes dan build produksi. Akses browser connector belum
  tersedia; visual/FPS belum diperiksa ulang setelah sesi Windows sebelumnya
  dihentikan pengguna. Durasi adalah deklarasi, bukan hasil pengukuran frame.

## 2026-11-16 - Empat lembar melalui deep zoom menuju grid kategori

- Klik satu lembar sekarang mengangkat keempat lembar dari folder yang dipilih.
  Clone mempertahankan identitas, skala kelompok dan clock yang sama, membesar
  jauh melewati fullscreen, lalu mengecil dan menyebar ke slot grid aktual.
- Kategori disiapkan invisible/inert sebelum lift; URL berubah di puncak zoom
  saat timeline tetap berjalan, tanpa fullscreen hold atau fade layar tambahan.
  Indeks slot memetakan kartu secara tepat meskipun sumber gambar berulang.
- Kembali dari koleksi memulihkan Home dan posisi scroll dahulu, lalu menggerakkan
  seluruh empat kartu melalui zoom kembali ke folder dan insertion bersama.
  Radius/bayangan berakhir sesuai elemen asli; metadata muncul di akhir landing.
- Pertahankan pembatalan, History API, fokus, reduced motion dan cleanup.
  Tes mencakup empat tujuan desktop/375px, pergantian URL saat timeline berjalan,
  gambar berulang, animasi balik, slot tidak valid serta pembatalan seluruh clone.
- npm run check lulus 121 tes dan build produksi. Browser access host tidak
  tersedia; rasa gerak, UI desktop/mobile, keyboard aktual dan FPS perangkat
  belum terverifikasi secara visual.

## 2026-11-16 - Navigasi Projects tanpa refresh dan transisi lembar dua arah

- Tambahkan navigasi internal History API untuk koleksi/detail/Home, tetap
  memakai href nyata dan perilaku native untuk modified click/download/tab baru.
- Lembar terangkat dari sampul, tilt melurus, kemudian satu overlay membesar
  ke kamera dan melebur ke koleksi. Kembali memulihkan scroll/folder terlebih
  dahulu, lalu lembar mengecil dan masuk ke slot asal. Gambar di-decode awal.
- Home tetap terpasang tetapi hidden/inert di halaman proyek. Driver foto,
  Lenis, parallax Hero, navbar dan Journey dilepas saat inactive dan dipasang
  kembali sebelum restore melalui scheduler/sumber scroll yang sama.
- Simpan origin/index/scroll di history; dukung Back/Forward, direct entry,
  resize lintas breakpoint, fokus heading/lembar, reduced motion, interupsi
  input dan cleanup tanpa overlay/callback lama. Tanpa dependency tambahan.
- Tambahkan tes navigasi, urutan animasi, ukuran seragam, interupsi, restore
  serta kontrol pause/resume driver. Browser access host tidak tersedia;
  kecocokan visual, rasa gerak dan performa perangkat belum terverifikasi.
- npm run check lulus 116 tes dan build produksi. Endpoint Home, kategori,
  detail, serta modul baru memberi HTTP 200 pada preview lokal. Ini bukan
  pemeriksaan interaksi browser atau bukti FPS.

## 2026-11-16 - Sampul folder hanya menampilkan kategori

- Hapus tautan teks Lihat koleksi beserta panah dari keempat sampul folder;
  nama kategori dirapikan ke kiri bawah tanpa ruang cadangan untuk tautan.
- Bentuk/warna folder dipertahankan. Klik sampul tetap membuka folder dan
  empat lembar preview tetap menuju halaman kategori masing-masing.
- Perbarui tes render tujuan tautan serta bersihkan CSS tautan yang dihapus.

## 2026-11-16 - Label navbar utuh setelah penambahan Projects

- Hapus batas lebar desktop 352px yang menyisakan ruang teks terlalu sempit.
  Empat kolom mengikuti lebar konten terpanjang dengan pembagian tetap setara,
  sehingga indikator seperempat lebar tetap sejajar dengan item aktif.
- Label tidak dipecah di tengah kata; padding horizontal dirapikan. Mobile
  tetap memakai ikon di atas label dan empat kolom dalam lebar viewport.
- npm run check lulus 96 tes dan build; server lokal memuat CSS navbar baru.
- Pemeriksaan visual ulang desktop/375px, keyboard dan reduced motion masih
  perlu dilakukan karena browser access host tidak tersedia.

## 2026-11-16 - Folder Projects solid dan empat sejajar

- Ubah grid menjadi empat kolom pada >=1100px, dua kolom pada 761–1099px,
  dan satu kolom pada <=760px. Jarak antarfolder disesuaikan untuk satu baris.
- Panel depan/belakang memakai gradient opak sehingga screenshot tidak tembus
  melalui sampul. Siluet, kartu 16:9, animasi dan navigasi tetap memakai pola lama.
- Sisakan jarak 8px antara nama kategori dan area tautan koleksi 44px, termasuk
  ketika folder diperkecil untuk empat kolom. npm run check: 96 tes dan build lulus.
- Pemeriksaan visual masih terbatas oleh akses browser; jangan menganggap
  build sebagai bukti keterbacaan atau kecocokan ukuran.

## 2026-11-16 - Projects dengan empat folder dan koleksi kategori

- Tambahkan Projects setelah Journey: empat folder biru tanpa tekstur awan,
  panel bertab/sampul tinggi mendekati mockup yang dipilih, semua kartu 16:9.
- Entrance berlapis sekali, hover/tilt ringan, klik kipas, satu folder terbuka,
  Escape/klik luar, fokus keyboard dan reduced motion; tanpa scroll/RAF baru.
- Lembar menuju koleksi kategori; kartu koleksi menuju detail /kategori/slug.
  Navigasi dokumen native, judul halaman, kembali/kategori, dan fallback URL
  tidak ditemukan, tanpa dependency baru. Navbar sekarang memiliki Projects.
- Sesuai arahan pengguna, tiga aset di assets/projects dipakai ulang untuk
  empat kartu sementara per kategori. Label sementara tetap terlihat, tanpa
  informasi proyek rekaan. Optimizer menghasilkan tiga WebP 960x540.
- Verifikasi: npm run check lulus 96 tes dan build. Tes baru mencakup route
  kategori/detail/path salah, tujuan tautan SSR serta aset 16:9.
- Pemeriksaan browser dihentikan alat karena URL Chrome tidak bisa diverifikasi;
  desktop, 375px, keyboard dan reduced motion belum diperiksa secara visual.

## 2026-11-15 - Journey mobile tersambung dan bercahaya mengikuti scroll

- Sambungkan Education sampai Experience melalui satu rail SVG vertikal
  pada <=960px; titik menjadi bulatan dan judul bab menjorok dari jalur.
  Fallback CSS juga menyambungkan antar bab.
- Fokus kontinu berdasarkan jarak node terhadap tengah tinggi viewport,
  cahaya berekor 80px bergerak serta berbalik bersama scroll. Konten bergerak
  pendek 6px dan logo menguat sampai 1.025, tanpa menyembunyikan teks.
- Tetap touch native tanpa pin, timer, RAF, listener scroll atau dependency
  baru. Geometri di-cache; padding akhir membuat node terakhir bisa mencapai
  pusat. Desktop mempertahankan horizontal/wave/light yang sama.
- Reduced motion, fokus keyboard dan geometri gagal kembali ke daftar statis;
  hidden/restore/resize/cleanup memakai lifecycle lama. npm run check lulus
  93 tes dan build produksi, termasuk regresi desktop dan breakpoint bolak-balik.
- Preview visual desktop/375px, keyboard langsung dan performa perangkat asli
  belum terverifikasi: browser access host tidak tersedia.

## 2026-11-15 - About mobile lebih ringkas dan kemunculan mengikuti area baca

- Perkecil sapaan, kelompokkan nama Rahmat Rafi / Indrayani., rapikan skala
  teks dan jarak mobile. Profesi/CV berbagi baris yang bisa membungkus; anchor
  foto maksimal 220px, heading biografi 24–28px.
- Pada <=960px identitas/CV naik 18px setelah foto tiba, lalu biografi naik
  16px saat mendekati area baca. Opacity terpisah memakai posisi scroll aktual,
  geometri cache dan scheduler lama; reversible tanpa pin/timer/spring baru.
- Desktop tetap tiga kolom/reveal serempak. Fokus keyboard, reduced motion,
  CV native sekali klik, perjalanan foto/logo dan awan lama dipertahankan.
- npm run check lulus 89 tes dan build, termasuk reveal terpisah, reverse,
  restore/resize dan cleanup. Preview UI desktop/375px belum tersedia karena
  browser access host unavailable; hasil visual belum diverifikasi langsung.

## 2026-11-15 - Pulihkan awan kecil dan seluruh gerak lamanya

- Runtime kembali cloud-bank asli dalam dua lapisan bertile dengan geometri,
  opacity, mask, arah/delay dan durasi lama: desktop 110/78s, mobile 150/110s.
- Hapus runtime bank sisi, cloud-breathe dan override mobile baru. Pipeline
  optimasi kembali ke sumber cloud-bank; file bank sisi tetap sebagai arsip.
- Layout editorial, foto/logo, transisi About, navbar dan perbaikan CV tetap.
- Perbandingan source memastikan CSS awan desktop sama persis dengan acuan;
  mobile/reduced motion/fade/shared sky diperiksa. npm run check lulus 88 tes
  dan build. Preview visual desktop/375px belum tersedia: browser host unavailable.

## 2026-11-15 - Gerak awan lebih terlihat

- Perbesar lintasan near menjadi 48–112px horizontal/16px vertikal dalam
  24–30s, far 28–48px/8px dalam 42–50s, dengan fase kiri/kanan berbeda.
- Mobile memakai 24–40px/8px. Loop alternate, batas overscan dan lifecycle
  pause offscreen/hidden/reduced motion tetap; tidak ada scheduler baru.
- npm run check lulus 89 tes dan build. Preview gerak desktop/375px belum
  tersedia karena browser access host unavailable.

## 2026-11-15 - Hero editorial mengikuti mockup dan awan sisi baru

- Judul Geist besar di belakang portrait pada desktop >=1100px; deskripsi di
  kiri dan enam logo membentuk lengkung longgar dengan pelat/bayangan lembut.
  Tablet/mobile tetap heading/copy/scene tanpa overlap judul dan wajah.
- Buat dua cloud bank RGBA fotografis melalui built-in imagegen dari mockup;
  runtime WebP responsif 600/1024, sumber/prompt tersimpan dan aset lama tetap.
- Awan dekat/jauh bergerak 10–22px horizontal, 3–6px vertikal dalam 58–80s,
  alternate infinite. Gunakan lifecycle pause offscreen/hidden/reduced motion
  yang sama; mobile hanya dua lapisan. Tidak ada scroll/animation driver baru.
- Aset diperiksa di atas warna langit; npm run images:optimize selesai.
  npm run check lulus 89 tes dan build, termasuk alpha/budget aset baru serta
  regresi CV, navigasi, foto/logo dan lifecycle. Browser access host unavailable;
  tampilan desktop/375px, keyboard, kelancaran loop/FPS belum diuji langsung.

## 2026-11-15 - Perbaiki klik CV dan foto tertahan saat scroll balik

- Aktifkan pointer CV sejak panel mulai muncul, alih-alih menunggu reveal 90%.
- Guard aksesibilitas memakai focus-visible pada About/keturunannya. Fokus
  mouse/touch tidak lagi mereset transform teks atau menyembunyikan traveler;
  fokus keyboard dan reduced motion tetap mendapat fallback penuh.
- Pointerdown primer CV menghentikan inertia Lenis pada posisi aktual dan
  membatalkan fokus navbar tertunda. Unduhan tetap native, tanpa blur CV,
  click handler tambahan, preventDefault atau scheduler baru.
- Tambah tiga tes regresi download/interupsi/reduced motion; perbarui tes
  early reveal/reverse. npm run check lulus 88 tes dan build produksi.
- Pengujian browser desktop/375px, Tab dan unduhan aktual belum tersedia:
  browser access host unavailable. Perilaku tombol Alt belum diverifikasi.

## 2026-11-15 - Seimbangkan panel identitas dan biografi About

- Batasi kedua panel desktop pada 352px dan sejajarkan ke tepi dalam foto;
  pertahankan pusat foto dan alignment vertikal grid.
- Kurangi judul nama sekitar 10% (maksimum 58px), longgarkan tracking,
  rapikan jarak label/nama/peran/CV. Judul biografi maksimum 32px/550 dan
  jarak paragraf 20px memberi bobot lebih seimbang.
- Mobile memakai panel lebar penuh, judul nama 36–45px dan jarak label 18px.
  Tidak ada perubahan copy, tautan, controller animasi atau guard aksesibilitas.
- npm run check lulus 85 tes dan build. Preview visual desktop/375px, keyboard
  dan reduced motion belum tersedia: browser access host unavailable.

## 2026-11-15 - Hero lebih ringkas

- Hapus sapaan Saya Rafi dan tombol Tentang saya. Deskripsi menjadi
  Membangun aplikasi AI dan otomasi untuk memudahkan pekerjaan, terpusat
  di bawah judul AI Engineer pada semua breakpoint.
- Perkecil logo dan pelat 10% desktop/8% mobile melalui CSS; posisi, rotasi,
  koreografi foto/logo serta navbar tetap. Hapus CSS khusus elemen lama.
- npm run check lulus 85 tes dan build produksi. Preview desktop/375px,
  keyboard dan reduced motion belum tersedia: browser access host unavailable.

## 2026-11-15 - Navigasi Hero/About mengikuti perjalanan foto

- Tunda fokus section hingga scroll selesai dan pose akhir Motion dirender.
  Guard fokus About tetap melindungi konten tanpa menyembunyikan traveler dini.
- Anchor memakai 900ms ease-in-out; Home menuju 0 dan About memakai endpoint
  foto/reveal desktop atau arrival/anchor CSS pada flow/mobile.
- Cocokkan ukuran serta crop fallback About dengan fit traveler bottom center.
- Input baru, resize, history, pergantian mode/tab dan cleanup membatalkan
  navigasi beserta callback fokus. Fokus section milik navigasi dilepas saat
  input pointer/history; fokus keyboard atau anak konten tetap dilindungi.
- npm run check lulus 85 tes dan build, termasuk interupsi, callback lama,
  completion sinkron, metrik endpoint dan reset. QA visual desktop/375px,
  keyboard dan reduced motion belum tersedia: browser access host unavailable.

## 2026-11-15 - Koreografi logo Hero dan foto

- Enam logo muncul dari belakang badan foto dalam tiga pasangan (720ms
  desktop/580ms touch), memakai transform/opacity MotionValue.
- Scroll menutup logo terlebih dahulu, baru foto turun di sisa rentang yang
  sama. Reverse mengembalikan foto sebelum membuka logo; endpoint About tetap.
- Intro dapat dipotong scroll dari pose aktual, tanpa lompatan hitungan atau
  animasi pengejar. Pause hidden tab, restore/resize, reduced motion, invalid
  geometry dan cleanup memakai controller/scheduler foto yang sama.
- Hapus timer/entrance CSS lama dan offset parallax scroll kartu yang bersaing.
- npm run check lulus 70 tes dan build; QA visual/FPS desktop/375px belum
  tersedia karena browser access host tidak tersedia.

## 2026-11-15 - Enam logo teknologi Hero

- Ganti teknologi Hero menjadi Next.js, React, Flutter, TypeScript, VS Code,
  Node.js. Hanya logo yang terlihat; alt tetap tersedia.
- Unduh lima SVG dari sumber resmi dan gunakan ulang TypeScript lokal.
  Posisi, ukuran, kecepatan serta responsivitas keenam kartu tetap.
- Pratinjau aset dirender dan diperiksa; sumber tercatat pada docs/ASSETS.md.
- npm run check lulus 62 tes dan build. Preview halaman belum diverifikasi
  karena browser access host tidak tersedia.

## 2026-11-15 - Nama lengkap pada header dan About

- Ganti label Portfolio pada header dan nama pada judul About menjadi Rahmat
  Rafi Indrayani. Nama panjang boleh membungkus secara alami; marker dibatasi
  lebar kolom dan judul About memakai balanced wrapping tanpa pemotongan.
- npm run check lulus 62 tes dan build. Preview visual belum tersedia karena
  browser access host tidak tersedia.

## 2026-11-15 - Hapus section Skills/lab navy

- Hapus section Dari teknologi ke ide, toolkit dan tiga kartu konsep dummy,
  termasuk komponen/data/reveal/CSS khusus yang tidak lagi digunakan.
- Navbar menjadi Home/About/Journey; indikator dan lebar menyesuaikan tiga
  tujuan. Hapus Lihat eksplorasi; tautan fokus Journey kini kembali ke beranda.
- Enam kartu teknologi Hero tetap ada. Journey menjadi section terakhir;
  padding akhir terukur memastikan node terakhir masih dapat mencapai pusat.
- npm run check lulus 62 tes dan build. Jumlah tes berubah karena empat tes
  helper reveal yang dihapus, ditambah satu regresi jangkauan akhir Journey.
- Browser access host tidak tersedia; visual desktop/mobile belum diverifikasi.

## 2026-11-15 - Kedalaman burung dekat pada About dan Journey

- Tambahkan satu burung dekat per scene: About 64px blur 1.75px opacity .24,
  Journey 72px blur 2.25px opacity .22. Gunakan sprite yang sudah ada.
- About melintas di kiri atas lalu keluar ke atas sebelum area tengah;
  Journey melintas di bawah informasi. Putaran 76/84 detik memiliki masa
  tunggu di luar canvas, fase berbeda dan reset tidak terlihat.
- Tambahan disembunyikan pada <=960px dan reduced motion. Lifecycle
  offscreen/tab-hidden serta cleanup tetap memakai attachCloudMotion.
- npm run check lulus 65 tes dan build. Browser host tidak tersedia;
  efek blur, clearance dan ritme aktual belum diverifikasi secara visual.

## 2026-11-15 - Burung pada Journey

- Tambahkan lima burung independen: tiga band atas dan dua bawah, dengan
  ukuran, opacity, rise/drift, durasi serta fase kepakan berbeda dari About.
- Mobile <=960px memakai dua burung atas dan satu bawah. Layer berada pada
  stage di luar track agar tidak terseret scrub; flow memberi clearance heading.
- Gunakan sprite yang sama dan attachCloudMotion untuk offscreen/tab-hidden,
  reduced motion serta cleanup. Tidak menambah scheduler atau aset baru.
- npm run check lulus 65 tes dan build. Browser host tidak tersedia, sehingga
  penempatan/kelancaran aktual desktop/mobile belum diverifikasi secara visual.

## 2026-11-15 - Gelombang scroll dan cahaya kontinu

- Ganti segmen sorotan terpisah dengan satu SVG kontinu, deformasi maksimal
  8px yang tetap menempel pada node. Penanda/logo/teks tidak ikut bergelombang.
- Satu cahaya hijau dan ekor 90px mengikuti kurva, termasuk batas bab; ekor
  menyesuaikan arah scroll. Fase mengikuti posisi aktual dan berhenti saat diam.
- Tetap satu MotionValue/scheduler scroll, tanpa timer/RAF/spring atau layout
  read baru saat scrub. Reset SVG ketika flow/reduced motion/cleanup.
- npm run check lulus 65 tes dan build. Tes baru memeriksa deformasi, anchor,
  continuity, reverse, stop, cleanup serta selisih cahaya/kurva <0.04px.
- Browser access host tidak tersedia: visual desktop/375px, keyboard/reduced
  motion langsung dan FPS belum diuji. Perubahan path SVG memerlukan paint.

## 2026-11-15 - Tipografi Journey dan afiliasi komunitas

- Tambahkan afiliasi UIN Maulana Malik Ibrahim Malang pada GDGoC, Mocap,
  Weboender, sesuai informasi pengguna; label Komunitas menegaskan konteks.
- Perjelas hierarki enam entri: identitas 18–20px medium, peran 24–28px semibold,
  tanggal tabular 13px, afiliasi 14px dan kategori 12px. Pendidikan diberi label
  Perguruan tinggi/Sekolah kejuruan; Simtel tetap PKL.
- Gelapkan teks pendukung untuk menjaga kontras ketika opacity turun .74;
  label informatif tidak berperilaku sebagai tombol. Jalur dan driver tetap.
- Acuan tipografi: Adobe Spectrum dan Carbon, tautan ada di DESIGN_SYSTEM.md.
- Verifikasi: npm run check lulus 60 tes dan build. Browser host tidak tersedia;
  QA visual desktop/mobile, keyboard serta reduced motion langsung belum dilakukan.

## 2026-11-15 - Label pengalaman Simtel

- Ganti label Magang menjadi PKL pada pengalaman PT Solusi Media Telekomunikasi.

## 2026-11-15 - Journey mengikuti mockup jalur penerbangan

- Ganti rail lurus/bulatan dengan kurva SVG tersambung, berlian kecil dan
  connector. Sorotan lokal memakai opacity MotionValue yang sudah ada.
- Perkecil identitas, sejajarkan logo/nama/tahun dan tonjolkan jurusan/peran;
  copy rata kiri. Hover 220ms mengangkat isi 3px, memperbesar logo 1.04 dan
  memperjelas halo/connector, tanpa menggeser node atau track.
- Pasang logo Simtel pengguna, WebP transparan dari assets/logo/simtel.png.
- Mobile/reduced motion/fokus tetap daftar vertikal utuh; driver scroll tetap
  satu. npm run check lulus 60 tes dan build.
- QA browser langsung terhenti: Computer Use tidak dapat memastikan URL Chrome
  untuk penegakan kebijakan. Tampilan/hover/FPS aktual belum terverifikasi.

## 2026-11-15 - Logo Education dan Experience

- Pasang lima logo pengguna: UIN, SMKN 2 Bojonegoro, GDGoC, Mocap, Weboender.
- Bersihkan latar luar SMKN dengan imagegen; simpan sumber asli dan turunan
  transparan. Optimalkan kelima logo sebagai WebP dalam public/images/logos.
- Proporsi contain, ruang logo konsisten, opacity mengikuti timeline; nama
  organisasi tetap menjadi teks aksesibel. Logo teknologi baru belum tersedia.
- Verifikasi: 60 tes dan build lulus. QA visual halaman belum tersedia karena
  browser access host tidak tersedia; turunan gambar diperiksa terpisah.


## 2026-11-15 - Timeline penuh dengan sorotan pusat

- Sederhanakan Journey: hapus judul besar, deskripsi, tab duplikat, instruksi,
  progres bawah dan footer visual; heading semantik serta skip link tetap ada.
- Rail memenuhi viewport dengan fade pendek di tepi layar. Inset awal/akhir
  membuat setiap node melewati pusat yang sama, termasuk node pertama/terakhir.
- Sorotan mengikuti jarak ke pusat secara kontinu melalui MotionValue; node
  pasif meredup, halo aktif lembut tanpa pulse, copy tetap terbaca. Animasi hanya
  transform/opacity; label bab fade keluar/masuk tanpa tumpang tindih kata.
- Lebar dibaca setelah mode horizontal aktif dan guard fallback memakai lebar
  window. Tambah tes frame pertama untuk perbedaan lebar flow vs full viewport.
- npm run check lulus 59 tes dan build; HTTP lokal menyajikan source/CSS baru.
  QA visual desktop/375px, keyboard/reduced motion langsung dan FPS belum tersedia
  karena browser access host tidak dapat diakses.

## 2026-11-15 - Education & Experience

- Tambah CareerTimeline setelah About sebelum Skills: dua pendidikan dan empat
  pengalaman asli pengguna, tanpa bulan, capaian, gelar atau logo rekaan.
- Dua bab dihubungkan satu rail horizontal desktop dengan progres serta titik
  aktif dekoratif. Scroll memakai MotionValue App dan scheduler Motion yang sama;
  tanpa wheel handler, smoothing, spring atau dependency baru. Gerak reversibel.
- Mobile/touch, reduced motion, stage tinggi dan keyboard memakai daftar
  vertikal lengkap. Cleanup/StrictMode, restore, resize, font, dan tab hidden
  ditangani. Keyboard melatch flow agar pin tidak muncul lagi di bawah fokus.
- Navbar menambah Journey dengan target #journey, empat kolom/indikator 25%,
  susunan ikon di atas label mobile; marker disembunyikan pada tablet sempit.
- npm run check lulus 55 tes dan build; komponen, controller dan data terbaru
  tersedia lewat HTTP 200 lokal. QA visual desktop/375px, keyboard/reduced motion
  langsung dan FPS belum tersedia karena browser access host tidak dapat diakses.

## 2026-11-15 - Keseimbangan optik teks About

- Blok identitas desktop mengikuti lebar isi dan merapat ke foto, mengurangi
  ruang kosong timpang tanpa menggeser anchor foto atau memakai transform layout.
- Judul kiri maksimum 72px menjadi 64px; heading kanan memakai measure 18ch
  serta balanced wrapping. Line-height biografi 1.75 dan sela paragraf 16px.
- Mobile memakai lebar penuh dan judul maksimum 50px. Tinggi konten tidak
  dikunci; perjalanan scroll, CTA asli, fokus dan reduced motion dipertahankan.
- npm run check lulus 46 tes dan build; HTTP preview menyajikan CSS terbaru.
  QA visual desktop/375px, keyboard serta reduced motion langsung belum tersedia
  karena browser access host tidak dapat diakses.

## 2026-11-15 - Langit berkelanjutan dan About tiga kolom

- Warna dasar Hero/About dipusatkan pada satu gradient parent. Wrapper awan
  memudar ke transparan; background serta overlay warna terpisah dihapus.
- About mengikuti komposisi referensi: identitas/CV di kiri, foto di tengah,
  biografi dan Lihat eksplorasi di kanan. Mobile memakai urutan foto, identitas,
  biografi. PDF asli dan tujuan Skills tetap nyata.
- Foto turun ke tengah, lalu kedua kolom membuka ke luar dengan satu progres
  scroll reversibel. Hapus fase geser kanan, mask/feather, dan state endpoint
  lama. Batasi travel menurut celah aman foto; fokus/reduced motion tetap penuh.
- Bingkai arch/rim dominan diganti cahaya lembut. Empat burung vektor individual
  memiliki 12 pose kepakan, jeda melayang, serta kepala/lintasan ke kanan.
  Dua burung mobile; pause offscreen/tab hidden dan reduced motion dipertahankan.
  Sumber serta aset fotografis lama disimpan; tidak menambah dependency.
- Touch/mobile tetap memakai flow, termasuk stage pendek yang muat viewport;
  sticky hanya untuk desktop pointer presisi dengan ruang yang cukup.
- npm run check lulus 46 tes dan build. Sprite telah dirender dan diperiksa;
  QA halaman desktop/375px, keyboard, reduced motion serta FPS belum dapat
  dilakukan karena browser access host tidak tersedia.

## 2026-11-15 - Unduh CV dan penerbangan burung berulang

- CTA About menjadi tombol navy Unduh CV dengan ikon unduh dan label PDF.
  Memakai PDF asli yang diberikan pengguna, disalin identik ke public/documents;
  URL/nama file diatur sebagai resume pada portfolio.js. Native download tidak
  diintersepsi Lenis sebagai navigasi halaman.
- Burung bergerak otomatis tanpa scroll melalui satu animasi CSS 44 detik
  desktop/48 detik mobile. Flock keluar area sebelum reset, tanpa kepakan cepat.
  BirdBackground memakai lifecycle awan yang sudah ada untuk pause ketika
  stage tidak terlihat/tab hidden; reduced motion menampilkan burung statis.
- skyProgress dan binding scroll burung lama dihapus. Perjalanan foto serta
  reveal cerita tetap memakai MotionValue scroll yang sama seperti sebelumnya.
- npm run check lulus 43 tes dan build. PDF sumber/salinan SHA-256 identik;
  HTTP download 200 application/pdf 131.722 byte serta source/CSS baru terverifikasi.
  Pengujian visual langsung desktop/375px, keyboard, reduced motion, dan
  kelancaran sambungan loop belum dilakukan karena host browser tidak tersedia.

## 2026-11-15 - Langit dan kawanan burung About

- About memakai langit biru pucat, judul tiga baris “Membuat AI lebih mudah
  digunakan.”, serta dua paragraf lebih ringkas. Tipografi diperbesar tanpa
  menambah font, warna teks dekoratif, atau efek per huruf.
- Built-in imagegen membuat flock transparan enam burung desktop dan tiga mobile.
  PNG sumber di assets/source; WebP runtime sekitar 9–29 KB di public/images.
  Script images:optimize meregenerasi aset; prompt lengkap ada di docs/ASSETS.md.
- Burung mengikuti skyProgress dari controller/scheduler Motion yang sama,
  reversible, tanpa loop baru. Gerak touch lebih pendek; reduced motion statis.
- Mask cerita dilepas sepenuhnya saat endpoint agar ujung teks tidak terus
  memudar; scroll naik mengembalikannya dan cleanup menghapus state endpoint.
- `npm run check` lulus 43 tes dan build produksi. Tes mencakup asset alpha/budget,
  judul semantik, varian mobile, progres burung, reverse, dan mask endpoint.
  HTTP memverifikasi About, controller, CSS, dan aset baru. Aset diperiksa
  langsung; komposisi halaman desktop/375px, keyboard, reduced motion langsung,
  serta FPS belum diuji karena host browser tidak tersedia.

## 2026-11-15 - Penghapusan kontrol awan dan penutup About

- Tombol Jeda/Lanjutkan awan dihapus sesuai arahan pengguna, beserta state,
  prop, atribut jeda manual, dan gaya yang tidak dipakai. Awan tetap berjalan
  otomatis dengan guard offscreen, tab hidden, dan reduced motion.
- Teks penutup dekoratif About “Rasa ingin tahu / Menjadi kemungkinan” beserta
  gaya terkait dihapus.
- `npm run check` lulus 41 tes dan build produksi. Pencarian source/tes dan HTTP
  Hero/About mengonfirmasi elemen yang dihapus tidak tersisa. QA visual browser
  belum dijalankan karena host tidak tersedia.

## 2026-11-15 - Framer Motion dan scroll Lenis

- Framer Motion dan Lenis ditambahkan atas persetujuan pengguna. Lenis menjadi
  satu smoothing halaman dengan perlambatan singkat; touch tetap native dan
  reduced motion memakai native tanpa smoothing. Foto/teks tidak memakai spring
  tambahan yang dapat tertinggal dari halaman.
- Satu MotionValue scroll aktual menghubungkan Lenis pada fase read, perhitungan
  perjalanan pada fase update, dan render Motion dalam batch yang sama.
  Transform/opacity foto serta cerita dipindahkan ke MotionValue dan `motion.div`;
  geometri, dua fase, fixed overlay, serta mask gradasi tetap dipertahankan.
- Anchor tetap menghormati padding/margin CSS, hash, serta fokus target. Keyboard,
  tab hidden, reduced motion, pemulihan posisi, dan cleanup ditangani; guard
  aksesibilitas mengalahkan inline style Motion. CSS smooth scroll dinonaktifkan
  selama Lenis aktif agar pengendali halaman tidak bertumpuk.
- Back/Forward membatalkan momentum lama serta menyinkronkan target internal
  Lenis setelah browser memulihkan posisi; wheel berikutnya memakai posisi itu.
- `npm run check` lulus 41 tes dan build produksi. HTTP memverifikasi App, About,
  controller, driver terbaru, serta CSS. Kelancaran visual desktop/mobile,
  keyboard langsung, dan FPS belum diklaim karena host browser belum tersedia.

## 2026-11-15 - Stabilisasi foto dan reveal lembut

- Traveler dekoratif dipindahkan ke overlay fixed di luar scene Hero. Posisi
  dihitung dalam koordinat viewport dan tetap diperbarui setelah fase selesai
  agar foto ikut keluar bersama About. Foto utama Hero menyimpan geometri serta
  alt Rafi; overlay hanya terlihat ketika enhancement aktif.
- Rotasi dinamis wajah dan translateZ dihapus. Kedalaman tetap berasal dari
  arch, rim, dan bayangan; dua fase scroll, gerak balik, dan posisi akhir tetap.
- Clip-path biner cerita diganti mask gradasi tanpa blur huruf. Feather mengikuti
  batas foto dan translasi cerita, maksimal 40px desktop presisi/24px touch, lalu
  menyusut ke nol sehingga teks akhir terbaca penuh. Fokus/reduced motion
  menghilangkan mask dan menampilkan cerita serta tautan langsung.
- Pemeriksaan source menemukan kompensasi native scroll lama bersama stage
  sticky sebagai kemungkinan penyebab getaran; diagnosis itu belum dibuktikan
  melalui profiling visual. Garis potong biner memang ada pada source sebelumnya.
- `npm run check` lulus 34 tes dan build produksi, termasuk posisi viewport,
  keluarnya foto setelah fase akhir, caching ukuran, feather akhir nol, dan
  penempatan overlay di luar Hero. HTTP memverifikasi App, controller, dan CSS
  terbaru. Kelancaran visual desktop/mobile dan FPS belum diklaim karena host
  browser tetap tidak tersedia.

## 2026-11-15 - Cerita keluar dari belakang foto

- Foto menyelesaikan fase turun lurus hingga posisi akhir vertikal area About
  sebelum bergeser ke kanan. Cerita keluar dari belakang foto menuju kiri
  sebagai satu bidang; stagger enam bagian dan lipatan judul digantikan.
- Stage yang muat di viewport memakai CSS sticky dengan ruang scroll tambahan
  agar fase mendatar terlihat. Konten tinggi/mobile/zoom memakai flow native
  dengan gerak lebih pendek dan posisi akhir foto tetap tepat pada anchor.
- Mask berada pada wrapper cerita diam, sedangkan transform/opacity berada pada
  isi cerita. Native scroll mengendalikan seluruh posisi: berhenti saat posisi
  scroll diam dan membalik urutan saat scroll naik, tanpa animasi pengejar.
- Fokus keyboard menampilkan cerita dan tautan penuh. Reduced motion juga
  melepas pin serta runway dan mempertahankan dua foto statis dekoratif/sumber.
  Kedalaman foto, data, dan aset dipertahankan tanpa dependency baru.
- `npm run check` lulus 32 tes dan build produksi, termasuk fase turun/mendatar,
  pembalikan tepat, berhenti tanpa frame lanjutan, restore/resize saat pinned,
  flow mobile/layar pendek, reduced motion, dan cleanup. HTTP memverifikasi App,
  About, controller, serta CSS terbaru. Fokus keyboard diperiksa dari source;
  QA visual dan FPS belum dijalankan karena host browser tidak tersedia.

## 2026-11-15 - Reveal tipografi About

- Label, dua baris judul, dua paragraf, dan CTA muncul berurutan mengikuti
  progress fase mendatar. Easing saat tiba menggantikan kemunculan satu blok
  dalam rentang scroll yang pendek.
- Clip horizontal pada wrapper diam membatasi teks ke ruang yang dibuka foto.
  Judul terbuka dari mask baris dengan perspektif ringan; body bergerak lebih
  pendek. Touch memakai gerak singkat tanpa kemiringan tulisan atau blur.
- Seluruh urutan tetap dapat dibalik dan berhenti bersama scroll. Fokus keyboard
  serta reduced motion menghapus mask/opacity/transform dan pembatas pointer.
  Foto serta titik akhir perjalanannya dipertahankan tanpa dependency baru.
- `npm run check` lulus 30 tes dan build produksi. HTTP memverifikasi controller,
  About, dan CSS terbaru. QA visual belum diklaim
  karena akses browser tidak tersedia untuk diverifikasi.

## 2026-11-15 - Transisi dua fase dan bio ringkas

- Foto turun lurus dahulu, lalu bergeser ke kanan sambil cerita muncul dari
  kanan ke kiri. Fase mendatar mengompensasi scroll agar foto tetap setinggi
  staging; setelah selesai, foto mengikuti dokumen About.
- Foto dan cerita memakai posisi scroll yang dapat dibalik, tanpa reveal sekali
  atau autoplay. Cerita menunggu ruang yang dibuka foto, tetap tersedia untuk
  pembaca layar, dan langsung terlihat saat fokus keyboard atau reduced motion.
- Bio diringkas menjadi dua paragraf; lebar cerita dan heading desktop dikurangi.
  Target mobile/tablet bergeser 12px ke kanan dengan ruang tepi yang memadai.
- Efek kedalaman 3D, fallback foto statis, dan cleanup tetap dipertahankan tanpa
  dependency baru. `npm run check` lulus 29 tes dan build; HTTP memverifikasi
  controller, About, bio, dan CSS terbaru. QA visual
  browser belum dilakukan karena akses browser tidak dapat diverifikasi.

## 2026-11-15 - Foto Hero–About dan kedalaman 3D

- Kartu proses About diganti dengan foto yang berpindah dari Hero mengikuti
  scroll native, dapat kembali saat scroll dibalik, dan menetap pada posisi
  dokumen About. State/data/gaya proses yang tidak dipakai dihapus.
- Skala seragam mempertahankan proporsi wajah. Desktop menempatkan foto di kanan
  biografi; mobile/tablet di atasnya. Pengantar Hero mendahului scene di bawah
  1280px agar jalur foto tidak melintasi teks atau CTA.
- Bidang arch, rim, bayangan, dan perspektif CSS memberi kedalaman. Kemiringan
  dibatasi pada desktop pointer presisi; touch memakai rotasi nol.
- Reduced motion atau enhancement perjalanan tidak aktif memakai dua foto
  statis, dengan salinan About dekoratif. Runtime React tetap memerlukan
  JavaScript. Cache geometri dan cleanup menangani resize, font, pageshow,
  visual viewport, tab hidden, dan callback lama tanpa dependency baru.
- Pemeriksaan akhir `npm run check` lulus 27 tes dan build, termasuk pergantian
  orientasi saat scroll. HTTP memverifikasi source/CSS terbaru. QA visual desktop,
  375px, keyboard langsung, reduced motion di browser, serta FPS belum dijalankan.
  Akses browser dihentikan karena alat tidak dapat memverifikasi URL Chrome.

## 2026-11-15 - Redesign About dan lab eksplorasi

- Section 2 memakai heading editorial dan biografi asli, dengan diagram proses
  Pahami/Hubungkan/Sempurnakan yang dapat dipilih serta tautan ke Skills.
- Section 3 menjadi lab navy dengan enam teknologi asli, satu feature Atlas,
  serta konsep Flowdesk dan Sinyal. Data dummy ditandai eksplisit sesuai arahan
  pengguna; detail tujuan/pendekatan/contoh dapat dibuka lewat kontrol native.
- Preview SVG/CSS, feedback tekan/fokus, dan reveal sekali per kelompok tanpa
  dependency baru. Helper reveal menangani reduced motion, fokus, fallback
  observer, cleanup, serta callback lama saat StrictMode remount.
- Layout menyesuaikan desktop/mobile dan tidak mengunci tinggi teks/detail.
  Caption diagram serta preview mengikuti flow; label navbar diperbaiki agar
  dapat membungkus. Hero dan tujuan Home/About/Skills tetap dipertahankan.
- `npm run check` setelah integrasi lulus: 20 tes dan build produksi. Browser
  host tetap tidak tersedia; komposisi halaman, input keyboard langsung,
  tampilan 375px, dan FPS perangkat nyata belum diverifikasi secara visual.
  Preview lokal berjalan dan HTTP memverifikasi source/CSS terbaru tersaji.

## 2026-11-15 - Hero viewport, awan fotografis, dan ikon navbar

- Hero menargetkan satu viewport melalui fallback 100vh/100svh/100dvh. Scene
  mengisi ruang tersisa; pengantar dalam flow dan label navbar dapat membungkus
  agar teks yang membesar tidak harus terpotong.
- Navbar memiliki ikon outline konsisten, label tetap terlihat, dan respons
  hover/fokus/pressed singkat serta indikator aktif 240ms.
- Awan transparan dihasilkan melalui built-in imagegen, dioptimalkan menjadi
  WebP 1000px/2000px (~72 KB/~253 KB). PNG sumber disimpan di luar public.
- Dua lapisan drift berulang lambat dengan tombol Jeda/Lanjutkan. Lifecycle
  menjeda ketika hero offscreen, tab hidden, atau reduced motion. Mobile tetap
  dapat menampilkan drift; parallax mobile tetap nonaktif.
- Perintah images:optimize kini meregenerasi portrait dan awan. Prompt/provenance
  tercatat di docs/ASSETS.md.
- Pemeriksaan final npm run check lulus: 16 tes dan build produksi. Aset awan
  diperiksa pada latar langit; HTTP memverifikasi aset/source terbaru tersaji.
  QA halaman di browser dan FPS perangkat nyata belum diklaim.

## 2026-11-15 - Perbaikan audit section 1

- Navbar fixed dengan target Home/About/Skills, indikator aktif dan feedback
  hover/pressed/fokus. Projects/Contact disembunyikan sesuai arahan pengguna.
- Parallax berdasarkan waktu, cache geometri, frame berhenti saat stabil,
  serta mode statis mobile/reduced motion.
- Entrance transform/opacity pada wrapper terpisah, tanpa animasi top/left.
- Identitas Rafi, pengantar, CTA About, daftar Skills, target sentuh >=44px,
  scroll padding, dan pengantar mobile yang mengikuti alur konten.
- WebP responsif sekitar 52 KB/92 KB, original dipertahankan. sharp hanya
  digunakan sebagai tooling development untuk regenerasi aset.
- 12 tes dan build produksi lulus. QA halaman/FPS di browser belum diklaim.

## 2026-11-15 - Migrasi awal

- Konversi HTML portofolio ke React + Vite, dengan komponen Header, Hero, About,
  serta data biografi/kartu teknologi terpisah.
- Memakai foto, SVG, dan font dari `public/`; HTML awal tetap dipertahankan.
- Memindahkan parallax ke lifecycle effect dengan cleanup listener, timer,
  observer, dan frame; mempertahankan dukungan reduced motion.
- Menambahkan skip link, bahasa dokumen Indonesia, favicon, dan deskripsi halaman.
- Menambahkan lima tes migrasi/lifecycle dan perintah build/check.
- Menambahkan AGENTS.md, dokumentasi vibe coding, peta skill, dan empat junction
  lokal untuk skill yang sudah terpasang.
- Build dan tes lulus; QA visual browser masih tertunda karena tool browser
  tidak tersedia pada sesi ini.
