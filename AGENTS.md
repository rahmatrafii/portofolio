# Panduan agent proyek

## Konteks

Portofolio Rafi, AI Engineer. Stack: React, JavaScript, Vite, CSS biasa. Aset ada di
`public/`. `portfolio-parallax.html` adalah referensi sebelum migrasi: pertahankan
file tersebut, jangan jadikan runtime atau tempat mengedit fitur baru.

## Skill wajib sebelum mengubah kode

1. Baca dan terapkan `ponytail` untuk setiap tugas yang mengubah kode, konfigurasi,
   dependency, atau tes. Entry lokal: `.agents/skills/ponytail/SKILL.md`.
2. Untuk HTML, CSS, JSX/komponen UI, atau JavaScript sisi klien, baca dan terapkan
   `.agents/skills/modern-web-guidance/SKILL.md` sebelum implementasi: jalankan
   `search`, lalu `retrieve` untuk panduan yang relevan. Ikuti fallback browser
   yang diminta panduan. Tidak perlu untuk backend, skrip, konfigurasi tooling,
   tes murni, atau edit teks sederhana.
3. Jika menyentuh antarmuka, CSS, layout, komponen, copy, motion, responsivitas,
   atau aksesibilitas, otomatis baca dan terapkan
   `.agents/skills/ui-ux-pro-max/SKILL.md` serta
   `.agents/skills/anti-slop-design/SKILL.md` tanpa menunggu diminta lagi.
   Untuk anti-slop-design, ikuti mode existing product/constrained scope di
   `references/14-workflow.md`, referensi relevan, dan checklist
   `references/13-pre-emit-checklist.md` dalam skill sesuai cakupan perubahan.
   Pertahankan desain yang ada kecuali pengguna meminta perubahan visual;
   rekomendasi skill bukan alasan melakukan redesign di luar permintaan.
4. Jika membuat desain baru atau mengubah arah visual, tambahkan `frontend-design`.
   Untuk perubahan animasi/interaksi, tambahkan `micro-interactions`.
5. Pilih skill lain sesuai ruang lingkup dari [docs/SKILLS.md](docs/SKILLS.md).
   Baca `SKILL.md` aslinya sebelum mengaku menggunakan skill. Jalankan panduan atau
   pencarian yang relevan; jangan memuat seluruh katalog untuk setiap perubahan.
6. Sampaikan singkat skill yang digunakan pada awal tugas. Instruksi eksplisit
   pengguna tetap menjadi acuan jika rekomendasi skill berbeda dengan permintaan.
7. Jika entry lokal hilang, cari sumber terpasang yang tercatat di `docs/SKILLS.md`.
   Jika skill wajib tetap tidak ditemukan, laporkan dengan jujur dan minta arahan;
   jangan mengaku telah menerapkannya. Jangan menginstal atau memperbarui skill
   global hanya untuk melewati masalah tersebut.

Folder `.agents/skills/` berisi junction ke instalasi laptop ini dan diabaikan Git.
Aturan ini adalah instruksi kerja agent, bukan hook yang dapat memaksa editor
atau perubahan manual menjalankan skill. Jangan mengubah konfigurasi global agent.

## Preferensi review UI/UX

Gunakan sudut pandang senior UI/UX designer. Beri penilaian jujur, langsung, dan
profesional. Sebutkan yang sudah bekerja, masalah yang terlihat beserta dampaknya
pada pengguna, lalu prioritaskan perbaikan konkret. Bedakan hasil yang sudah
terlihat atau teruji dari perkiraan. Jika diminta menilai saja, berikan review
tanpa mengubah desain.

## Aturan implementasi

- Baca file yang terdampak sebelum mengedit. Kerjakan permintaan sampai selesai
  dengan perubahan sekecil yang memadai; gunakan pola yang sudah ada.
- Gunakan komponen fungsi, JSX, dan hooks. Konten/kartu skill ada di
  `src/data/portfolio.js`; gaya ada di `src/styles.css`.
  Enam kartu Hero menampilkan logo saja: Next.js, React, Flutter, TypeScript,
  VS Code, Node.js. Alt nama teknologi tetap tersedia; jangan tambah label
  terlihat. Sumber SVG lokal tercatat di docs/ASSETS.md.
- Gunakan aset dari `public/` melalui `/images/`, `/icons/`, `/fonts/`.
  Jangan memasukkan base64 besar atau mengganti aset tanpa alasan dari tugas.
- Bersihkan listener, timer, observer, dan animation frame di cleanup effect.
  Pertahankan React StrictMode dan `prefers-reduced-motion`.
- Gunakan elemen semantik, teks alternatif, dan fokus keyboard yang terlihat.
  Jangan membuat link palsu, email rekaan, testimoni, atau klaim proyek asli
  yang direkayasa. Section Skills/lab navy dan proyek dummy sudah dihapus atas
  permintaan pengguna; jangan mengembalikannya tanpa permintaan baru.
- Jangan menambah backend, router, state library, CSS framework, atau dependency
  lain kecuali kebutuhan tugas membenarkannya. Framer Motion dan Lenis telah
  diizinkan pengguna untuk animasi dan smooth scroll. Pakai npm dan pertahankan
  lockfile; jangan menambah pengendali scroll atau library animasi lain tanpa alasan.
- Header berisi Home, About, Journey, dan Projects dengan target nyata. Contact
  tetap disembunyikan sampai kontak asli tersedia. Projects diaktifkan atas
  permintaan pengguna dengan tiga kategori dan konten sementara dari assets/projects.
- Portrait runtime memakai WebP responsif; simpan PNG asli untuk regenerasi.
  Jalankan `npm run images:optimize` jika sumber portrait berubah.
- `smoothScroll.js` menjadi satu sumber MotionValue posisi scroll aktual. Lenis
  berjalan pada fase `frame.read` Framer Motion; `portraitJourney.js` menghitung
  pada `frame.update`, lalu Motion merender transform/opacity dalam batch yang
  sama. Jangan menambah listener scroll/RAF kedua untuk perjalanan yang sama,
  `useScroll` terpisah, atau `useSpring` pengejar pada foto/teks. Lenis menjadi
  satu smoothing dengan perlambatan singkat yang telah disetujui pengguna.
  Wheel/trackpad dihaluskan, touch tetap native. Reduced motion tidak memakai
  Lenis; tab hidden menghentikan driver. Cleanup harus melepas instance Lenis,
  callback scheduler, subscription MotionValue, serta listener agar StrictMode aman.
  Saat Lenis aktif, nonaktifkan CSS smooth scroll melalui `html.lenis`. Anchor
  dalam halaman tetap memakai scroll-padding/margin CSS, hash, serta fokus
  `preventScroll`; jangan memblokir perilaku keyboard native.
  Navigasi anchor memakai durasi 900ms ease-in-out tanpa lock. Home menuju 0;
  About memakai geometri controller foto yang dibagikan melalui ref App:
  endpoint reveal pada pinned, maksimum arrival/anchor CSS pada flow. Anchor
  lain tetap memakai elemen dan offset CSS native Lenis. Fokus tetap pada link
  selama perjalanan lalu pindah ke section pada Motion postRender sesudah
  onComplete. Jangan mengembalikan fokus About langsung saat klik. Input baru,
  resize/history/mode/hidden/cleanup harus membatalkan request serta callback
  fokus lama. Wheel/touch/pointer dan history hanya melepas fokus section yang
  dipasang navigasi; fokus keyboard atau anak konten tetap dilindungi.
  Fallback About memakai lebar/tinggi fit traveler yang sama, bottom center,
  melalui --about-photo-width/height; hapus variabel saat reset/cleanup.
- Perjalanan foto dari Hero ke anchor About dikendalikan `portraitJourney.js`.
  Enam logo Hero memakai MotionValue x/y/scale/opacity dari controller yang
  sama. heroSkills.js mengatur pembukaan tiga pasangan (0/3,1/4,2/5), 720ms
  desktop/580ms touch, hanya saat load di posisi atas. Scroll memotong intro
  dari pose terakhir, tidak memaksanya selesai. Reverse awal mengarah ke pose
  terbuka; setelah handoff, scrub kembali sepenuhnya berbasis posisi.
  Logo kembali ke titik belakang badan foto (56% anchor), lalu descent foto
  dimulai: fold maksimal 160px desktop/96px touch dan <=22% turn, tanpa runway
  tambahan. Endpoint About tetap sama. Reduced motion/reset menampilkan enam
  logo statis; initial opacity 0 hanya sampai enhancement diukur. Kegagalan
  geometri harus memulihkan visibilitas. Tab hidden menjeda waktu intro.
  Jangan kembalikan timer/animasi CSS skill-arrive atau scroll parallax vertikal
  kartu; parallax.js hanya mempertahankan cloud/halo dan pointer ringan.
  Pertahankan skala seragam, anchor di luar reveal, dan jalur bebas teks/tombol.
  Traveler dekoratif berada pada overlay fixed di luar scene/transform anchor
  Hero. Foto statis utama pada anchor Hero tetap memiliki alt Rafi dan hanya
  dibuat transparan ketika enhancement aktif; jangan menggandakan pengumuman foto.
  Koordinat traveler memakai ruang viewport. Tetap perbarui posisi setelah fase
  selesai agar overlay keluar layar bersama About, bukan tertinggal di viewport.
  Foto turun lurus menuju anchor tengah komposisi About dan berhenti di tengah;
  jangan mengembalikan fase foto bergeser kanan. Setelah foto tiba, identitas
  serta CV di kiri dan biografi di kanan desktop terungkap bersamaan ke arah luar.
  Pada <=960px, identitas/CV dan biografi memakai rentang baca terpisah setelah
  foto tiba. Gerak vertikal 18px/16px, tanpa geser horizontal; opacity masing-masing
  tetap berbasis scroll yang sama. Rentang 120–180px dimulai saat wrapper mendekati
  88% tinggi viewport; biografi tidak mendahului akhir reveal identitas.
  Seluruh fase mengikuti MotionValue scroll aktual, berhenti ketika
  posisi aktual diam, dan harus dapat dibalik tanpa timer reveal atau spring
  pengejar tambahan. Jangan menghentikan perjalanan hanya karena input wheel
  berhenti sementara posisi Lenis masih melambat.
  `.about-runway` menjadi acuan flow dan `.about-stage` menahan komposisi dengan
  CSS sticky hanya pada desktop >=961px dengan hover/pointer presisi dan mode
  `data-about-layout="pinned"` yang muat di viewport. Touch selalu mode flow.
  Ruang scroll tambahan berasal dari spacer `::after` runway dalam flow; jangan
  menggantinya dengan padding yang mengubah batas containing block sticky.
  Konten tinggi/mobile/zoom memakai mode flow dengan rentang lebih pendek,
  tanpa pin atau runway tambahan. Ukur target relatif terhadap stage agar
  resize/restore saat pinned tidak menggeser tujuan.
  `.about-identity` dan `.about-story` tetap terukur; hanya anak masing-masing
  `.about-panel-inner` menerima translasi serta opacity. Gerak ke luar maksimal
  48px desktop presisi/20px nonpresisi >960px, dikurangi bila jarak terhadap foto tidak
  menyisakan ruang aman 12px. Jangan mengembalikan mask/clip teks, feather,
  `data-story-open`, atau translasi panjang dari balik wajah.
  Desktop memakai tiga kolom: identitas/Unduh CV, foto tengah, lalu biografi
  tanpa tautan ke section yang dihapus. Kawanan burung About dekoratif
  memakai animasi CSS infinite yang diizinkan pengguna, terpisah dari scrub foto.
  BirdBackground memakai lifecycle attachCloudMotion yang sudah ada untuk
  pause offscreen/tab-hidden dan reduced motion, tanpa scheduler JS tambahan.
  Desktop empat burung independen, <=960px dua. Sprite vektor 12 frame ada di
  `public/images/bird-flight.svg`; kepala dan lintasan sama-sama menuju kanan.
  Variasi ukuran, durasi, fase kepakan, serta lintasan memberi kedalaman tanpa
  scheduler JS tambahan. Reset penerbangan setelah masing-masing burung keluar
  area. Reduced motion menampilkan burung statis. PNG/WebP kawanan lama tetap
  tersimpan sebagai aset historis dan bukan runtime BirdBackground.
  Ada satu burung dekat tambahan pada masing-masing About/Journey memakai
  class bird-flight-near: 64px/blur 1.75px About, 72px/blur 2.25px Journey.
  About melintas kiri atas lalu keluar ke atas sebelum tengah; Journey di
  bawah informasi. Putaran 76/84s termasuk jeda di luar canvas, tanpa timer
  baru. Blur tetap dibatasi sprite kecil. Sembunyikan tambahan pada <=960px
  dan reduced motion; empat/lima burung kecil desktop tetap terpisah.
  Kedua panel teks desktop memakai width min(352px, 100%) dengan identitas
  justify-self end dan biografi start, align-items center pada grid. Nama
  36–58px dan judul biografi 24–32px/550; jarak label/nama/CV 22/18/24px.
  <=960px panel kembali lebar penuh, sapaan 18px dan nama dikelompokkan
  Rahmat Rafi / Indrayani. Pada <=680px sapaan 16px, nama 36–44px/550,
  label 12px dengan margin bawah 18px, profesi 14px dan tombol CV dalam baris
  flex yang boleh membungkus. Foto memakai anchor maksimal 220px, tanpa pin.
  Jangan memakai spacer/offset transform untuk menyamakan tinggi kedua panel;
  wrapper harus tetap terukur oleh controller foto dan foto tetap di tengah.
  CTA About adalah Unduh CV, memakai PDF asli pengguna di public/documents
  melalui anchor download native. Konfigurasi resume ada di portfolio.js;
  jangan mengganti aksi Unduh CV dengan tautan Skills atau berkas rekaan.
  Pointer tombol aktif sejak opening > 0; jangan menunggu reveal 90% saat
  tombol sudah terlihat. Pointerdown primer pada CV membatalkan request fokus
  anchor lama dan menghentikan inertia Lenis pada posisi aktual tanpa mencegah
  klik/download atau blur tombol. Tetap gunakan scheduler/sumber scroll yang sama.
  Tautan Lihat eksplorasi sudah dihapus bersama section Skills.
  Jangan mengembalikan stagger enam bagian, lipatan judul, atau reveal sekali.
  Pertahankan urutan identitas/CV, foto dekoratif, lalu biografi/eksplorasi dalam
  DOM, dengan gerak touch lebih pendek. Fokus terlihat (:focus-visible) pada
  About atau keturunannya dan reduced motion harus menghapus opacity serta
  transform kedua panel dan langsung menampilkan konten serta tautan penuh.
  Guard aksesibilitas harus mengalahkan transform/opacity inline dari Motion
  (misalnya aturan CSS `!important` yang dibatasi pada fokus/reduced motion).
  Saat :focus-visible ada di About atau keturunannya, sembunyikan traveler dan
  tampilkan fallback About agar lapisan Hero tidak menutupi teks atau fokus.
  Jangan mengembalikan guard :focus-within umum: fokus mouse/touch pada CV
  tidak boleh mereset transform panel atau mengganti traveler menjadi foto statis.
  Reduced motion
  juga melepas sticky dan ruang scroll tambahan.
  Pada <=960px foto About berada di atas identitas dan biografi, tetap di tengah
  tanpa geser kanan 24px.
  Mode animasi menampilkan satu foto; reduced motion/tanpa enhancement memakai
  dua foto statis, dengan salinan About dekoratif. Overlay juga dekoratif dan
  hanya terlihat pada mode enhancement. Kedalaman berasal dari glow transparan
  serta bayangan; rim disembunyikan dan pelat arch solid dihapus. Wajah tidak
  memakai rotasi dinamis atau translateZ. Runtime React tetap
  memerlukan JavaScript.
- Awan Hero memakai bentuk alami yang renggang atas permintaan pengguna.
  Sumber assets/source/hero-cloud-bank.png, runtime hero-cloud-bank WebP
  1000/2000 di public/images. Cloud-bank lama hanya untuk header koleksi.
  Dua lapisan far/near masing-masing dua tile identik: tinggi 44%, top
  30%/54%, opacity .64/.9, track max(200%,1800px), img contain dengan mask
  horizontal 8%/92%. Drift linear infinite ke translateX(-50%): desktop
  far 110s/-27s dan near 78s/-49s/reverse; <=680px 150s/110s. Kedua lapisan
  tetap tampil di mobile dan statis pada reduced motion. Jangan mengembalikan
  cloud-breathe atau bank sisi besar tanpa permintaan baru. Sumber/hasil bank
  sisi tetap arsip; npm run images:optimize mengolah kedua sumber cloud-bank.
  Hero/About memakai satu gradient langit pada `.intro-journey`, dengan stop
  berbasis `svh`; kedua section tidak mengecat background terpisah. Mask vertikal
  pada `.background` yang tidak bergerak memudarkan awan sebelum batas Hero,
  sehingga offset parallax `.clouds` tidak memindahkan tepi fade. Jangan menambah
  overlay warna solid di bawah Hero atau transform pada `.intro-journey` yang
  mengubah containing block overlay fixed.
  Tombol jeda dihapus atas arahan pengguna; awan berjalan otomatis dengan guard
  offscreen/tab-hidden dan reduced motion tetap dipertahankan.
- Hero menargetkan satu viewport dengan min-height dinamis. Konten harus tetap
  dapat menambah tinggi saat layar pendek atau teks diperbesar.
  Hero-heading berisi AI Engineer. >=1100px memakai judul besar di belakang
  portrait, scene maksimal 1100px menumpuk 48–64px ke area bawah judul, deskripsi
  terpisah dalam flow di kiri, di luar jalur foto. Di bawah 1100px urutan
  heading/copy/scene tetap terbaca tanpa overlap. Jangan transform root intro
  atau anchor untuk membuat efek judul. Sapaan Saya Rafi dan CTA Tentang saya
  tetap dihapus; akses About melalui navbar. Posisi/ukuran logo desktop baru
  membentuk lengkung; geometri mobile, rotasi dan koreografi tetap dipertahankan.
- Education & Experience (`#journey`) berada setelah About, sebelum Projects.
  Data asli pengguna ada di `src/data/career.js`: dua pendidikan, empat pengalaman.
  Jangan menambah bulan, gelar, capaian, durasi, atau logo rekaan. Enam logo
  pengguna tersimpan sebagai WebP di public/images/logos; sumber di assets/logo.
  Education dan Experience adalah dua bab, masing-masing terbaru dahulu.
  Desktop pointer presisi yang muat viewport memakai jalur horizontal melalui
  `careerTimeline.js`, MotionValue scroll App yang sama, dan scheduler Motion.
  Jangan menambah wheel handler, listener scroll/RAF, atau spring terpisah.
  `.career-runway::after` menambah ruang flow; stage sticky lepas setelah ujung.
  `--career-end-space` mengatur padding bawah minimal agar node terakhir dapat
  mencapai pusat walaupun Journey berada di akhir halaman; cleanup melepasnya.
  Mobile <=960px memakai daftar vertikal dengan satu rail SVG tersambung dari
  Education sampai Experience. Mode data-timeline-mode="vertical" memakai
  pusat Y node yang di-cache, sumbu baca 50% tinggi viewport, fokus kontinu,
  kepala/ekor cahaya vertikal dan scroll touch native tanpa pin. Bulatan tetap
  diam; konten bergeser maksimal 6px dan logo skala maksimal 1.025 menurut fokus.
  Rail tidak dimorf di mobile. --career-end-space juga dihitung untuk node
  terakhir mobile. Judul bab menjorok agar garis tidak memotong teks; fallback
  CSS tetap menyambungkan antar bab. Touch >960px, reduced motion, stage desktop
  tinggi, geometri gagal dan fokus keyboard memakai mode flow statis utuh.
  Fokus terlihat melatch mode flow sampai komponen dilepas agar
  runway tidak muncul ulang di bawah fokus; kontrol yang keluar layar dipulihkan.
  Rail horizontal selebar viewport tanpa clip internal 1200px; fade maksimal
  40px hanya di ujung layar. Node pertama hingga terakhir melewati pusat yang
  sama, diukur dari pusat node aktual. Baca lebar setelah mode horizontal aktif;
  guard fallback memakai lebar window agar pergantian layout tidak memicu loop.
  Fokus tiap node dan label bab dihitung kontinu dari jarak pusat melalui
  MotionValue, bukan hanya state indeks. Node pasif opacity .24, teks .74;
  halo tanpa pulse, teks navy tetap terbaca. Tidak ada judul besar, tab duplikat,
  deskripsi, instruksi, progres bawah atau footer visual. Heading semantik tetap
  ada dan tautan kembali ke beranda muncul hanya pada fokus keyboard.
  Flow harus mengalahkan transform track, opacity/scale node dan teks inline
  Motion, serta meniadakan halo. Bersihkan scheduler, observer,
  subscription, listener dan atribut mode pada cleanup/StrictMode.
  Arah visual desktop memakai satu SVG jalur bergelombang pada track, berlian
  12px dan connector pendek. careerRoute.js menghitung kurva kubik dengan
  deformasi maksimal 8px yang nol beserta turunannya pada node. Posisi node,
  teks dan logo tidak ikut gelombang. Satu kepala/ekor cahaya mengikuti kurva
  kontinu; ekor berbalik sesuai arah scroll. Geometri dihitung dari pusat node
  yang di-cache, tanpa getPointAtLength/getTotalLength/layout read saat scroll.
  MotionValue route diisi oleh scheduler careerTimeline yang sama; tanpa timer,
  spring atau RAF tambahan. Hentikan update saat posisi scrub sama atau tab
  hidden; reset null saat flow/cleanup. SVG d berubah untuk deformasi nyata
  (paint kecil); jangan mengklaim 60fps tanpa verifikasi. Mode flow statis,
  fokus keyboard serta reduced motion menyembunyikan SVG dan memulihkan
  opacity/transform penuh. Jangan menerapkan guard flow statis ke mode vertical.
  BirdBackground scene career menampilkan lima burung dekoratif (tiga atas,
  dua bawah), <=960px hanya burung 1/2/5. Tetap di luar track pada stage;
  CSS career-bird-flight berbeda rise/drift/fase dari About, semua ke kanan.
  Band atas desktop 8/30/50px, band bawah berada setelah isi stage; flow
  memindahkan band atas ke ruang sebelum heading (-80px, mobile -52px).
  Jangan ubah tinggi stage atau menaruh burung di area jalur/teks. Lifecycle
  attachCloudMotion yang sama menangani offscreen/tab-hidden/reduced motion,
  tanpa listener scroll/RAF tambahan. Reduced motion menampilkan posisi diam.
  Nama/logo/tahun berdampingan, peran lebih besar; copy rata kiri dan ringkas.
  GDGoC, Mocap, Weboender memiliki afiliasi UIN Maulana Malik Ibrahim Malang
  sesuai pengguna. Afiliasi dan kategori berupa teks terlihat, bukan tooltip
  hover. Peran semibold, identitas medium, tahun tabular; kategori informatif
  tidak menjadi tombol. Simtel tetap PKL. Jaga kontras sekunder saat .74.
  Hover hanya inner konten (-3px), logo (1.04), halo dan connector, 220ms;
  node/track tidak digerakkan oleh hover. Touch/reduced motion tidak memakai
  hover atau kurva horizontal. Pertahankan proporsi dan wordmark logo asli.
- Projects berjudul My Projects dengan tiga folder biru: Web Apps, Mobile
  Apps, AI Integration. Susunan tiga terpusat >=1100px, lebar maksimal 360px;
  tablet 761–1099px dua atas dan satu terpusat di bawah, <=760px satu kolom. Semua
  kartu landscape 16:9.
  Sampul memiliki ikon timbul browser/ponsel/simpul AI dengan aksen biru/sage/
  lavender. Atas permintaan pengguna sampul depan memakai fill-opacity .9,
  ikon .84; nama kategori dan fokus tetap pekat. Kilap radial/pita diagonal CSS
  mengikuti --pointer-x/y yang sudah ada pada sampul, ikon dan lembar preview,
  hanya hover mouse presisi/no-preference; fade opacity 180ms tanpa loop.
  Pseudo-element pointer-events:none memakai clip/radius permukaan yang ada,
  disembunyikan pada fokus keyboard dan navigasi. Touch/reduced motion tidak
  memakai kilap bergerak. Jangan menambah listener/RAF/timer atau mengubah
  animasi buka/navigasi untuk efek ini. Satu pesawat kertas terus melintas pada
  siklus 22s di band 88px antara
  deskripsi dan folder, tanpa jeda diam atau lintasan putus statis. SVG dekoratif
  berukuran 48px, disembunyikan <=760px, reduced motion diam. Gunakan lifecycle
  attachCloudMotion yang sama untuk offscreen/hidden/inactive, tanpa timer/RAF.
  Folder terbuka hanya meredupkan band ke opacity .42; penerbangan tetap berjalan.
  Navigasi tetap menjeda dan menyembunyikan pesawat. Band selebar viewport;
  mulai di luar kanan dan keluar di kiri. Hidung SVG menghadap +X sebagai acuan
  offset-rotate:auto; arah pesawat mengikuti tangent kurva, bukan sudut miring
  tetap. paperPlaneRoute membuat gelombang acak atau satu loop kecil per lintasan;
  randomisasi hanya pada animationiteration di luar layar, ukuran lewat
  ResizeObserver, tanpa layout read tiap frame. Lepas observer/listener/CSS var
  saat inactive/cleanup. Reset
  sepenuhnya di luar layar, jangan clip pada lebar konten 1280px atau fade muncul
  di tengah area. Aria-hidden/focusable=false dan tidak menangkap pointer;
  panel folder tetap biru. Animasi mengacu pada
  docs/audit-animasi-interaksi-folder.md: hover ringan, klik membuka kipas,
  satu folder terbuka, Escape/klik luar menutup; keyboard dan reduced motion aman.
  Klik lembar menuju /web-app, /mobile-app, atau /ai-integration. Dua route AI
  lama /mobile-app-ai dan /web-app-ai beserta detail menjadi alias koleksi AI;
  kartu koleksi membuka popup proyek tanpa mengganti URL. Route /kategori/slug
  lama tetap dikenali sebagai fallback kunjungan langsung.
  Halaman koleksi memakai grid kartu seragam dengan screenshot 16:9, dua kolom
  berurutan ke bawah; mobile <=760px satu kolom. Semua kartu berukuran sama,
  tanpa kartu utama atau penutup yang membentang penuh. Arah Studio yang
  dipilih pengguna: semua panel biru muda #e1f2fc, radius 22px,
  padding 20px desktop/16px mobile; screenshot radius 14px dengan border tipis.
  Judul di atas baris teknologi dan pill Lihat proyek navy/label putih dengan
  disc panah biru pucat. Hover presisi/fokus menggeser path 2px, press scale
  .97; reduced motion menghapus transform/transisi CTA. Kartu tetap diam dan
  memakai article tanpa handler klik. Hanya tombol gambar dan Lihat proyek
  membuka ProjectModal; judul, latar kartu, teknologi dan +N bukan pemicu.
  Screenshot tetap direct child, dengan button transparan terbatas area 16:9
  mengikuti padding kartu. Kedua tombol native type=button memakai nama/fokus
  aksesibel dan aria-haspopup=dialog, tanpa href atau kontrol bersarang.
  Feedback CTA hanya dipicu tombolnya. Popup memakai dialog native, satu panel
  scroll dan header/tutup sticky; desktop maksimal 1040px/88dvh, mobile satu
  kolom dengan safe area. Seluruh nama/logo teknologi tersedia di popup.
  Scrollbar panel memakai track biru muda/thumb biru abu membulat, gutter
  stabil; WebKit 10px tanpa panah dan fallback standar thin. Forced colors
  kembali ke scrollbar sistem. Jangan mengubah scrollbar global atau menambah
  driver/library scroll hanya untuk dekorasi scrollbar popup.
  projectModal.js mengatur snapshot gambar menuju popup 660ms, lift 14px,
  tilt -3deg dan overshoot 1.018, riak sekali, serta reverse 420ms. Efek tidak
  mengganti URL/history. Tombol tutup/Escape/backdrop tetap bekerja saat masuk;
  simpan pose sebelum cancel dan tolak promise lama. Reduced motion memakai
  fade singkat; geometri gagal memakai fallback tanpa snapshot. Scroll panel,
  resize/perubahan preferensi menyelesaikan pose; hidden menutup. Cleanup
  membatalkan WAAPI/listener, menutup dialog dan melepas lock overflow tanpa
  fokus lama. Tutup normal memulihkan fokus pemicu dan posisi koleksi.
  Footer teknologi dipisahkan divider; maksimal empat logo 24px berada dalam
  lingkaran putih 40px, overlap 6px agar logo tetap terbaca. Lebih dari empat
  memakai indikator +N terpisah, bukan tombol. Nama tersedia melalui title
  native dan teks sr-only; popup/detail menampilkan seluruh logo/nama tanpa batas.
  Label Contoh teknologi dihapus atas permintaan pengguna. Kombinasi preview
  sesuai pilihan pengguna: Web Next.js/React/Laravel/Firebase, Mobile Flutter/
  Java/Supabase, AI Next.js+Gemini atau Flutter+Gemini. Pengguna meminta setiap
  preview memiliki banyak teknologi: 5–6 per kartu dengan pendamping relevan
  (PHP/Laravel, Dart/Flutter, Android/Java, PostgreSQL/Supabase, SQLite lokal,
  serta tooling Web/AI sesuai stack). Pertahankan pasangan dasar di awal,
  nama unik dan status Pratinjau; jangan mengklaim ini proyek asli terverifikasi.
  Proyek tanpa data tidak mendapat fallback teknologi. Grup dan aksi sebaris
  bila muat, membungkus saat sempit; jangan menambah tooling tidak relevan.
  ProjectCategoryIcon tetap dipakai folder Home. Dot grid statis 96px memakai opacity
  .05, berada di belakang gambar/teks dan tidak menangkap pointer atau fokus.
  Header kategori memakai tipografi poster kapital 64–112px/650, deskripsi
  di kanan dengan panah diagonal dekoratif dan satu divider. <=960px menjadi
  satu kolom dengan judul 52–88px. Judul boleh membungkus per kata, tanpa
  tinggi tetap atau clip; detail/not-found tetap memakai heading biasa.
  Satu awan samar tetap di header; pesawat hanya di Projects Home.
  Gambar tidak memiliki efek border saat hover; fokus keyboard kedua tombol
  tetap jelas. Border tipis statis screenshot tetap dipertahankan.
  Screenshot runtime dicrop oleh optimizer untuk membuang scrollbar dan bagian
  section berikutnya; PNG asli tetap disimpan. Panah
  kembali tanpa teks terlihat memakai aria-label/title dan href nyata; koleksi
  ke /#projects, detail ke koleksinya. Tombol perpindahan kategori sudah dihapus
  atas permintaan pengguna. Jangan mengembalikannya. Gambar tetap direct child
  .project-card dengan data-project-index untuk validasi animasi kembali.
  Anchor internal memakai History API tanpa refresh melalui
  PortfolioRouter/projectNavigation, tanpa dependency
  router. Modified click, tab baru, download, tautan eksternal dan anchor Home
  tetap native. Hover/fokus hanya menaikkan inner 14px; jangan mengubah z-index
  atau tumpukan. Klik satu lembar mengangkat lalu melayangkan empat lembar ke
  atas secara berurutan dari paling depan. Ukuran tetap, lengkung horizontal
  kecil, rotasi menuju +/-3deg dan fade hanya di tepi atas; jangan mengembalikan
  gerak menuju kamera, perspective/translateZ atau zoom pada transisi proyek.
  Lembar asli memakai satu animasi utuh 550ms dengan stagger 80ms pada satu
  startTime. Jalur viewport dikonversi ke koordinat lokal dengan inverse rotasi
  kipas, termasuk posisi hover. Sampul asli menutupi lembar secara alami.
  Jangan mengembalikan clone visual, handoff, atau fase angkat terpisah yang
  berhenti lalu memulai easing lagi. Will-change sementara dilepas saat cleanup.
  Jangan mengembalikan antrean yang menunggu setiap lembar selesai dahulu.
  Kategori disiapkan fixed/invisible/
  inert sebelum animasi; URL berganti setelah semua lembar keluar dari atas dan
  kategori langsung terungkap tanpa jeda tambahan. Indeks data-project-index
  tetap memastikan koleksi yang valid saat kembali, termasuk src berulang.
  Kembali dari koleksi memulihkan Home/scroll/folder terlebih dahulu, lalu
  memudarkan koleksi, lalu menurunkan empat lembar asli dari atas langsung ke
  posisi dalam folder. Satu animasi 590ms per lembar, tanpa fase insertion
  lanjutan atau callback yang mengganti elemen saat mendekati folder.
  Konteks kategori/index/scroll disimpan di history.state; origin tidak valid atau
  kunjungan langsung memakai fallback sederhana. Home tetap terpasang tetapi
  hidden/inert saat koleksi aktif; driver foto/Lenis, Hero parallax, navbar dan
  Journey dilepas saat inactive, lalu diukur kembali sebelum restore. Transisi
  memakai Web Animations API dan callback postRender Motion, tanpa timer/RAF atau
  pengendali scroll tambahan. Input baru/history/resize/hidden/reduced motion dan
  cleanup harus menolak callback lama serta membersihkan overlay/animasi/fokus.
  Pointerdown/Escape saat kembali ke Home harus menyelesaikan pendaratan,
  bukan abort ke koleksi yang masih menjadi current sebelum commit. Pembatalan
  input hanya berlaku untuk keberangkatan non-pop yang belum commit menuju
  koleksi/detail; navigasi/history baru tetap boleh menggantikan job lama.
  Jangan mengklaim FPS atau gerak sempurna tanpa pemeriksaan browser/perangkat.
  Data ada di src/data/projects.js. Pengguna mengizinkan
  tiga gambar assets/projects dipakai ulang menjadi empat kartu per kategori
  sementara; label sementara di Home dan paragraf disclaimer setelah grid/detail
  dihapus atas permintaan pengguna. Nama Pratinjau dan metadata temporary tetap
  tersedia; jangan mengarang informasi proyek atau mengembalikan disclaimer itu.
  Screenshot WebP runtime dibuat npm run images:optimize, fit contain 960x540.
- Jangan menerbitkan website atau mengubah layanan eksternal tanpa permintaan.

## Verifikasi dan pelaporan

- Jalankan `npm run check` untuk perubahan kode. Tambahkan tes kecil untuk logika
  baru yang bermakna; perubahan kosmetik cukup dengan build dan pemeriksaan UI.
- Untuk UI, cek desktop, mobile 375px, keyboard, dan reduced motion jika browser
  tersedia. Sebutkan keterbatasannya jika tidak; build lulus bukan bukti visual.
- Catat perubahan penting di `CHANGELOG.md`; perbarui dokumentasi yang terdampak
  dan status pekerjaan di `docs/TASKS.md` bila perlu.
- Laporkan apa yang berubah, hasil verifikasi, dan keterbatasan. Gunakan bahasa
  Indonesia, ringkas, dan jangan menyebut pemeriksaan yang belum dijalankan.
