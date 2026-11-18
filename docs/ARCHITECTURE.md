# Arsitektur dan konteks

## Galeri setelah Projects (2026-11-18)

`Gallery.jsx` menampilkan sembilan lapisan dari tujuh foto pengguna, dua diulang
sesuai persetujuan. Acuan adalah `audit-animasi-interaksi-galeri.md` dan kode
galeri publik di https://ekawahyu-portofolio.vercel.app/ yang diperiksa untuk
melengkapi parameter yang belum terukur pada audit.

Trigger: scroll aktual App dan pointer mouse. Rules: offset scroll start 30%
sampai end end; spring progres stiffness 80/damping 30/restDelta .0001, lalu
pemetaan .14–1.02. Setiap foto mendapat jendela .55 dengan awal index/9*.45.
Feedback: Z desktop -1700–500, opacity pada fase 0/.18/.82/.98 menjadi
0/1/1/0, input aktif hanya fase >.06 dan <.86. Loop/mode: scrub dua arah,
tanpa aksi klik, modal, timer reveal atau status terpilih.

Ukuran root 220vh, stage sticky top 0/100svh, perspektif 1200px. Lebar kartu
clamp 195–285px pada 19vw, rasio 4:5, radius 16px. Posisi mengikuti sudut
index*137.5 derajat dengan radius X .28+(index%3)*.08 dan Y .26+(index%2)*.09
dari viewport. Rotasi tetap +3/-5/+7/-9/+11/-3/+5/-7/+9 derajat. Pointer
normalisasi -1..1 mengurangi posisi XY sebanyak 45px, spring 60/25/massa .5.
Hover gambar 1.05/700ms cubic-bezier(0,0,.2,1), shadow 300ms
cubic-bezier(.4,0,.2,1) dan garis bawah 1x20px/bottom32 mengikuti acuan.

Parameter mobile asli (<768px): perspektif 900px, Z -1200–350, lebar
clamp135–185px pada 38vw. Touch tetap memakai scroll native; hover dan pointer
parallax hanya mouse presisi. Reduced motion/geometri gagal memakai grid
statis penuh dan melepas sticky serta ruang tambahan. Heading hanya sr-only;
tidak ada CTA atau penambahan navbar/Contact.

`gallery.js` mengukur geometri lewat fase read Motion/ResizeObserver (galeri
dan parent page agar perubahan runway sebelumnya memperbarui origin), menerima
MotionValue scroll yang sama dengan Hero/Journey, dan menjadwalkan update pada
Motion. useSpring khusus galeri mereproduksi gerak susulan yang memang tercatat
di referensi; driver foto/Journey tidak berubah. CSS scroll-timeline langsung
tidak dipakai karena akan menghilangkan respons spring tersebut. Tidak ada
listener scroll, RAF, library atau smoothing halaman tambahan.
IntersectionObserver margin250px membatasi pointer dan promosi layer.
Tab hidden/cleanup menghentikan spring; active=false melepas subscription,
listener, observer dan callback scheduler. Aktivasi ulang mengukur posisi lagi.
Reduced motion mengalahkan inline opacity/transform. Tujuh alt mendeskripsikan
foto, dua salinan ulang dekoratif. Gambar pasif tidak masuk urutan Tab.

## Tujuan dan batas lingkup

Portofolio Rafi, AI Engineer, memakai React/JavaScript/Vite dan CSS biasa.
Identitas langit, portrait, dan enam teknologi dipertahankan. Biografi diringkas
menjadi dua paragraf sesuai arahan pengguna.
Hero menargetkan satu layar; awan fotografis menjadi atmosfer dan navbar berikon
memberi akses Home/About/Journey/Projects. Contact tetap disembunyikan sampai
data asli tersedia. Section lab navy dan menu Skills tetap dihapus. Pengguna
mengizinkan konten Projects sementara dari assets/projects, empat per kategori.
Enam kartu teknologi Hero tetap ada. Tidak ada backend, dependency router,
database atau panggilan layanan AI.

## Alur render

`index.html` memuat `src/main.jsx`, yang memasang `PortfolioRouter` dalam StrictMode.
Router memilih Home (`App`), koleksi, detail, atau tampilan tidak ditemukan.
Home tetap terpasang setelah dikunjungi, tetapi hidden/inert dan drivernya
dinonaktifkan selama halaman proyek tampil. Tidak ada dependency router baru.
Header fixed berada di luar main. `App` membungkus Hero/About dalam
`.intro-journey`, menyimpan ref anchor/traveler/identity/details/runway/stage, dan memasang
controller foto serta driver smooth scroll. App memiliki satu MotionValue scroll
aktual dan MotionValue posisi/opacity yang dirender lewat `motion.div`.
Traveler dekoratif menjadi sibling Hero pada overlay fixed,
di luar scene dan transform anchor, agar memakai containing block viewport.
CareerTimeline berada setelah wrapper tersebut dan menerima MotionValue scroll
yang sama. Projects berada setelah Journey dan menjadi section terakhir.

- `Header.jsx`: ikon outline dan label Home/About/Journey/Projects, logo ke Home, indikator
  aktif. Render React hanya dipicu perubahan section atau state header.
  Lebar desktop memakai ukuran intrinsik label terpanjang pada empat kolom
  setara; label tidak membungkus, indikator tetap 25%. Pada <=680px, ikon
  berada di atas label dan grid kembali mengikuti lebar viewport.
- `Hero.jsx`: heading profesi, pengantar samping desktop, kartu teknologi, portrait, serta
  latar awan otomatis. Memasang parallax melalui ref. Anchor foto
  dan foto utama statis mempertahankan geometrinya. Saat enhancement aktif,
  foto statis transparan; alt Rafi tetap tersedia untuk pembaca layar.
- `CloudBackground.jsx`: dua lapisan jauh/dekat dengan masing-masing
  dua tile hero-cloud-bank identik, berupa awan rendah yang lebih renggang.
  Memakai lifecycle awan lama; semua aset dekoratif
  disembunyikan dari ARIA. Bank sisi besar tidak dirender lagi.
- `About.jsx`: identitas/CV di kiri, anchor foto tengah, biografi
  di kanan. `.about-runway` menjadi acuan flow; `.about-stage` membungkus
  `.about-content`. Wrapper `.about-identity` dan `.about-story` tetap diam;
  masing-masing anak `.about-panel-inner` menerima transform serta opacity.
  Tidak memakai mask/clip teks, stagger per bagian, lipatan judul, atau reveal
  sekali. Foto statis dekoratif menjadi fallback.
- `BirdBackground.jsx`: empat burung vektor independen, dua pada <=960px.
  Masing-masing scene juga mendapat satu bird-flight-near desktop: About 64px
  dengan blur 1.75px, Journey 72px dengan blur 2.25px. CSS lintasan dekat
  menyertakan masa tunggu di luar canvas (76/84s per loop), berbeda fase.
  Blur diterapkan tetap pada sprite, tidak pada lapisan besar. Tambahan ini
  disembunyikan pada mobile/reduced motion, tanpa mengubah jumlah burung kecil
  dan tanpa scheduler baru. Guard scene tetap dipakai bersama.
  Sprite CSS 12 frame memberi kepakan, terpisah dari lintasan penerbangan.
  Lifecycle menggunakan `attachCloudMotion` pada stage About.
- `Portrait.jsx`: WebP responsif dan bidang kedalaman CSS yang dipakai foto utama,
  overlay perjalanan, serta fallback About. Hanya foto utama Hero memiliki alt;
  overlay serta fallback dekoratif. Mode perjalanan menampilkan overlay saja.
- `CareerTimeline.jsx`: section `#journey`, dua bab Education dan Experience
  dengan ordered list. Dua pendidikan dan empat pengalaman di `career.js`
  berasal dari pengguna; tahun mengikuti data asli. Setiap bab terbaru dahulu,
    urutan tiga pengalaman 2025 dipertahankan. Enam logo pengguna memakai WebP
    transparan. Identitas/tahun sejajar logo; peran menjadi hierarki utama.
    BirdBackground scene career berada pada stage di luar track: lima burung
    independen pada desktop, tiga pada <=960px (dua atas/satu bawah). Data
    lintasan terpisah dari About; CSS career-bird-flight memakai rise/drift
    individual, sprite kanan yang sama. Layer absolut tidak mengubah ukuran
    stage. Lifecycle attachCloudMotion tetap menangani pause/cleanup.
    Tiga komunitas memiliki affiliation UIN dari pengguna; category memberi
    konteks jenis pendidikan/komunitas, note Simtel tetap PKL. Afiliasi serta
    label kategori berupa teks statis di bawah peran, selalu tersedia dalam
    flow/mobile/reduced motion dan mengikuti opacity copy dalam scrub desktop.
- `portfolio.js`: biografi, aset, dan parameter kartu. Hero hanya menampilkan
  logo Next.js, React, Flutter, TypeScript, VS Code, Node.js, dengan alt nama
  teknologi. Framer Motion tetap dipakai untuk perjalanan foto/cerita.
  Hero mengubah posisi vertikal kartu
  dari acuan piksel ke persentase tinggi scene agar komposisi dapat menyesuaikan.

## Projects dan halaman kategori

`Projects.jsx` menampilkan judul My Projects dan tiga folder: Web Apps, Mobile
Apps, AI Integration. Pada >=1100px tiga folder terpusat dengan lebar maksimal
360px; tablet 761–1099px dua di atas dan satu terpusat di bawah melalui grid
empat track dengan span dua. <=760px kembali satu kolom. Padding atas folder
72–96px menggantikan 100–148px agar lebih dekat dengan deskripsi; mobile 80px.
Gradient sampul depan biru memakai fill-opacity .9 untuk transparansi tipis;
panel belakang tetap opak dan depth tetap berasal dari bayangan. SVG
lokal inline membentuk panel belakang bertab kanan serta sampul depan bertab
kiri, tanpa tekstur awan. Empat lembar memakai WebP 16:9; mobile juga memakai
kanvas landscape. CSS menangani hinge, lift, spread, fan, stagger, bayangan,
hover/fokus; pointer hanya memperbarui dua variabel CSS, dengan kotak yang
di-cache saat pointer masuk. Tidak ada listener scroll, timer atau RAF baru.

Satu IntersectionObserver memainkan entrance sekali. Button sampul memiliki
aria-expanded/controls; lembar inert ketika tertutup. Klik sampul membuka,
folder lain menutup folder sebelumnya, klik luar/Escape menutup. Escape dari
isi mengembalikan fokus ke sampul. Nama aksesibel tiap lembar menjelaskan
tujuan kategori. Sampul menampilkan nama kategori di kiri bawah dan ikon timbul
dekoratif browser/ponsel/simpul AI pada posisi 47% tinggi panel. Aksen ikon biru,
sage dan lavender; panel folder tetap biru. ProjectCategoryIcon dan PaperPlane memakai
SVG inline lokal, aria-hidden/focusable=false dan pointer-events:none. Ikon
sampul memakai opacity .84, sementara nama kategori dan stroke fokus tetap
pekat. Kilap CSS muncul saat hover mouse presisi, mengikuti --pointer-x/y
yang sudah ada: pantulan radial dan pita diagonal putih lembut pada sampul,
ikon serta gambar pratinjau. Opacity masuk/keluar 180ms, tanpa loop atau JS
tambahan. Pusat pantulan mengikuti kotak folder yang di-cache saat pointer
masuk; tidak dipetakan ulang ke setiap lembar miring. Pseudo-element tidak
menangkap pointer, terpotong oleh clip sampul/radius gambar dan tidak
mengubah ukuran atau tumpukan. Fokus keyboard/navigasi menyembunyikan kilap;
touch dan reduced motion memakai permukaan tanpa kilap bergerak. Pesawat
kertas berada pada band 88px di antara deskripsi
dan folder, bukan melewati judul/isi. Container selebar 100vw dipusatkan terhadap
heading agar pesawat masuk dari luar kanan dan keluar penuh di kiri viewport.
paperPlaneRoute.js membuat jalur kubik acak berupa gelombang naik-turun atau
satu loop elips, dengan tangent sambungan yang searah. Offset-distance CSS
berjalan 0–100% dalam 22s; offset-rotate:auto mengikuti arah kurva. SVG pesawat
memakai hidung +X horizontal sebagai acuan sehingga tidak ada kemiringan tetap
atau animasi rotasi terpisah yang bertentangan dengan gerak.
Ukuran 48x38,4px dan margin kontrol Y 35px menyisakan ruang bagi seluruh pesawat
yang berputar beserta bayangan dalam band 88px. Jalur baru dibuat hanya pada
animationiteration di luar layar; ukuran dicache melalui ResizeObserver dengan
fallback resize listener. Tidak ada layout read per iterasi atau per frame.
Cleanup melepas observer/listener/variabel jalur, termasuk saat Home inactive.
Tanpa dukungan motion-path/reduced motion, fallback pesawat diam. Rujukan:
[CSS offset-rotate](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/offset-rotate).
Opacity tetap .72; garis putus dihapus dan <=760px pesawat disembunyikan.
Reduced motion menampilkan pesawat diam. attachCloudMotion yang sama dengan
burung/awan mengatur offscreen, tab hidden, perubahan reduced motion dan cleanup;
effect active melepas lifecycle ketika Home disembunyikan. CSS :has folder
terbuka hanya meredupkan band ke opacity .42 tanpa menjeda atau mengulang
animasi. Atribut navigasi root tetap menjeda dan menyembunyikan pesawat selama
perpindahan halaman. Tidak ada timer, scroll listener, RAF atau scheduler baru.
Sampul tanpa
tautan Lihat koleksi; navigasi kategori melalui lembar preview setelah dibuka.
Fokus dan reduced motion melewati entrance tersembunyi;
cleanup melepas observer/listener dan menolak callback lama. Keadaan folder
disimpan pada history.state entri Home untuk navigasi kembali.

`PortfolioRouter.jsx` memilih Home, koleksi, detail, atau tampilan tidak ditemukan
lewat resolveProjectRoute di data/projects.js. projectNavigation.js menangkap
hanya klik primer internal pada route yang dikenali, mengganti tampilan React
dan History API tanpa refresh. Modified click, target tab baru, download,
tautan eksternal dan fragment di halaman yang sama tetap native. Anchor memiliki
href nyata untuk kunjungan langsung dan reload. `/web-app`, `/mobile-app`,
`/ai-integration` menampilkan masing-masing empat kartu; `/kategori/slug`
menampilkan detail. `/mobile-app-ai` dan `/web-app-ai`, termasuk URL detail,
tetap dikenali sebagai alias koleksi AI Integration agar tautan lama terbuka.
Slug tidak dikenal, path berlebih dan encoding salah mendapat tampilan tidak
ditemukan. Server statis produksi harus mengarahkan URL aplikasi ke index.html.

`ProjectPage.jsx` memakai heading, ikon panah kembali dan galeri screenshot
16:9. Tombol perpindahan kategori dihapus atas permintaan pengguna. Anchor
kembali 48px menampilkan ikon saja dengan aria-label/title: koleksi menuju
/#projects, detail lama menuju koleksinya. Kartu koleksi kini membuka popup
tanpa pindah route. href navigasi lainnya tetap menjaga History API/keyboard.
Untuk kompatibilitas URL lama, projectNavigation menyimpan scroll entri detail dan memulihkannya
saat panah kembali detail membuka koleksi lagi; kunjungan langsung tanpa
konteks tetap mulai dari atas.

Arah visual koleksi adalah Studio, sesuai opsi A yang dipilih pengguna dari
gambar usulan. Geist dan navy/sky tetap dari Home, dengan screenshot sebagai
penekanan. Semua panel kartu memakai biru muda #e1f2fc; teks #10263b,
sekunder #506477, serta aksi #24618b.
Gradient #edf5fb memudar ke #f8fbfd pada 340px. Satu awan samar dibatasi di
header dan disembunyikan pada <=760px. PaperPlane hanya dipakai Projects Home.
Header kategori memakai modifier `.collection-heading-category`: judul Geist
kapital 64–112px/650 di kiri, deskripsi 17px di kanan bersama panah diagonal
dekoratif. Satu divider memisahkan header dari grid. Pada <=960px komposisi
menjadi satu kolom, judul 52–88px dan deskripsi 16px. Tinggi tetap alami dan
judul boleh membungkus per kata; text-wrap:balance memiliki fallback normal.
Detail/not-found tidak memakai modifier ini. H1 dan fokus tetap tersedia,
panah aria-hidden/focusable=false tidak menjadi kontrol atau animasi baru.
Semua kartu sama besar, dua kolom berurutan ke bawah; <=760px satu kolom.
`grid-auto-rows: 1fr` menyamakan tinggi kartu tanpa tinggi piksel tetap. Screenshot
16:9 berada dalam kartu radius 22px dan padding 20px desktop/16px mobile.
Cover radius 14px memakai border tipis serta bayangan kecil. Jarak kartu 32px
desktop/24px mobile. Caption memakai judul 20–24px di baris penuh, diikuti
teknologi di kiri dan pill Lihat proyek navy dengan panah biru pucat di kanan.
`technologies` di projects.js berisi objek name/icon. ProjectTechnologies dipakai
bersama untuk kartu compact dan daftar lengkap di popup/detail. Kartu menampilkan
maksimal empat logo 24px dalam lingkaran putih 40px, overlap 6px. Kelebihan
ditampilkan sebagai +N terpisah: lima menjadi +1, enam menjadi +2. Counter
bukan tombol atau kontrol fokus baru. Nama logo dan nama yang tersisa tetap
tersedia dalam sr-only; tooltip title native memberi nama saat hover, tanpa
popup tooltip custom/timer. Popup proyek/detail menampilkan semua teknologi dengan nama terlihat,
termasuk untuk touch dan pengguna keyboard. Tidak ada loop/animasi baru.
Footer tetap ber-divider; grup dan aksi sebaris selama muat lalu membungkus.
Array kosong/tidak tersedia tidak menghasilkan baris atau stack fallback.
Kombinasi dasar pilihan pengguna tetap di awal: Web Next.js/Firebase, React/
Firebase, Laravel/React, Laravel/Firebase; Mobile Flutter/Supabase atau Java/
Supabase; AI Next.js/Gemini atau Flutter/Gemini. Atas permintaan pengguna,
setiap preview kini memiliki 5–6 teknologi sehingga +1/+2 tampil dari data asli.
Pendamping Web mencakup React/TypeScript atau JavaScript, PHP untuk Laravel,
Tailwind CSS, Vite dan Motion sesuai stack. Mobile memakai Dart untuk Flutter
atau Android untuk Java, PostgreSQL dari Supabase dan SQLite lokal. AI memakai
React/TypeScript untuk Next.js atau Dart/Firebase untuk Flutter, dengan
pendamping UI/storage/runtime yang sesuai. Ini metadata preview, bukan klaim
implementasi proyek asli atau dependency baru pada portofolio.
Rujukan kompatibilitas: [Laravel starter kits](https://laravel.com/docs/12.x/starter-kits),
[Supabase database](https://supabase.com/docs/guides/database/overview),
[Supabase REST](https://supabase.com/docs/guides/api),
[Firebase AI Logic](https://firebase.google.com/docs/ai-logic) dan
[Flutter SQLite](https://docs.flutter.dev/cookbook/persistence/sqlite).
Java dapat mengakses Supabase melalui REST; tidak diasumsikan ada SDK Java
resmi. Label Contoh teknologi tetap dihapus; temporary dan nama Pratinjau tetap.
Penempatan memakai pola area teknologi/footer dari
[Project Overview Card](https://www.quackit.com/html/templates/cards/project_overview_card.cfm),
dengan konteks metadata stack dari
[Vercel Templates](https://vercel.com/templates/template/nextjs-boilerplate).
Kode dan layout disesuaikan dengan kartu Studio yang sudah ada. ProjectCategoryIcon
tetap dipakai pada sampul folder Home. Dot grid CSS 96x96 memakai opacity .05 dan
mask memudar; pseudo-element berada di belakang gambar/teks dalam stacking
lokal kartu. Tidak ada clip outline fokus, target pointer atau animasi baru.
Tag teknologi tidak menjadi filter/tombol. Gambar pertama
eager/high priority; tiga berikutnya lazy. Kartu adalah article tanpa handler
klik. Gambar tetap direct child dengan data-project-index agar animasi kembali
tetap mengenali koleksi. Button `.project-card-preview` bernama aksesibel
menutupi hanya screenshot 16:9; inset mengikuti variabel padding kartu 20px
desktop/16px mobile. CTA merupakan button kedua yang membuka popup yang sama.
Keduanya type=button, aria-haspopup=dialog, tanpa href. Judul, latar kartu,
teknologi dan +N berada di luar kedua pemicu. Router yang mendelegasikan hanya
a[href] tidak memindahkan halaman dari pemicu popup.
Kedua tombol memakai outline fokus. Efek garis hover gambar dihapus atas
permintaan pengguna; border statis screenshot tetap ada. Feedback CTA hanya
dipicu hover/fokus/press tombolnya. Label CTA putih,
pill navy dan disc panah biru pucat memakai tinggi
minimal 44px. Hover presisi/fokus mengubah warna serta menggeser path panah
2px dalam disc tetap, 180ms. Press memberi skala .97 pada pill, 120ms;
touch memakai press tanpa bergantung hover. Efek hanya merespons input,
tanpa loop. Reduced motion menghapus semua transform/transisi CTA.
Kedua tombol berdiri sendiri tanpa kontrol bersarang; ikon dekoratif tidak
menerima fokus. Tidak ada geser/zoom kartu, entrance, timer atau listener baru.
Anchor navigasi lain tetap native. Route detail lama tetap tersedia untuk
kunjungan langsung; kartu baru tidak menuju route tersebut.

ProjectModal.jsx memakai dialog native dengan judul aksesibel, panel putih
radius 24px, screenshot 16:9 dan ringkasan/seluruh teknologi di bawahnya.
Desktop maksimal 1040px/88dvh; mobile ber-margin 12px dan satu kolom. Satu
panel scroll memakai header/tombol tutup sticky, safe area dan overscroll
containment. Scrollbar dibatasi pada panel popup: gutter stabil, fallback
standar thin dengan thumb #6b91ad di track #f1f7fb. WebKit memakai jalur 10px,
thumb terlihat 6px dengan border transparan 2px, radius penuh dan margin ujung
14px; tombol panah disembunyikan, hover/active menjadi navy. Blok WebKit
mengembalikan scrollbar-width/color ke auto agar tidak mengalahkan pseudo
styling; forced colors memakai scrollbar sistem. Rujukan perilaku override:
[MDN scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::-webkit-scrollbar).
Tidak ada library atau handler scroll tambahan untuk tampilan scrollbar.
Native showModal menyediakan top layer dan inert background;
scroll halaman dikunci melalui overflow yang dipulihkan persis saat selesai.
Tidak ada URL/history atau scroll koleksi baru saat membuka/menutup popup.

Klik gambar/CTA memicu satu rangkaian WAAPI melalui projectModal.js. Snapshot
gambar terangkat 14px, miring -3deg lalu membesar menuju gambar popup selama
660ms dengan overshoot 1.018. Backdrop navy/blur 4px memudar 180ms, panel
materialisasi 560ms, riak biru sekali 520ms, lalu isi muncul mulai 460ms.
Tutup membalik gambar ke sumber dalam 420ms. Snapshot dekoratif berada di
top layer dan pointer-events:none; screenshot kartu/index tidak dipindahkan.
Tidak ada dependency, timer, RAF atau driver scroll baru. Listener scroll
hanya pada panel popup untuk menyelesaikan pose bila isi digulir.

Tutup/Escape/backdrop tetap bekerja saat entrance. Pose terlihat dibaca sebelum
cancel; generation menolak completion lama. Resize, scroll panel dan perubahan
reduced motion menyelesaikan ke tampilan statis; tab hidden menutup. Reduced
motion memakai fade 100/90ms tanpa flight/tilt/riak. Sumber/geometri tidak valid
memakai fallback panel; gambar popup keluar viewport saat tutup memakai fade.
Cleanup saat route/active/StrictMode berubah membatalkan animasi/listener,
menutup dialog dan melepas lock tanpa callback/fokus lama. Tutup normal kembali
ke pemicu yang masih terhubung dengan preventScroll.

Judul dokumen sesuai halaman. Nama Pratinjau serta metadata temporary tetap
menandai isi contoh. Label sementara di Home dan paragraf disclaimer setelah
grid/detail dihapus atas permintaan pengguna. Kalimat placeholder tidak diulang
pada setiap kartu. Konten yang sebelumnya diizinkan tetap dipakai tanpa menambah
nama/fitur/hasil proyek fiktif. Skill anti-slop-design sudah tersedia secara
lokal dan dibaca, tidak diinstal ulang atau mengubah konfigurasi global.
Tidak ada klaim fitur, hasil, klien atau tautan eksternal rekaan. Gambar sumber
PNG tetap disimpan di assets/projects; optimizer mencrop scrollbar dan bagian
section berikutnya, lalu menghasilkan tiga WebP 960x540 dengan contain pada
kanvas putih. Karya asli tidak digambar ulang dan proporsi tetap dipertahankan.
Gambar dipakai ulang sesuai permintaan pengguna.
Urutan screenshot sementara dibedakan per kategori agar preview depan berbeda;
ini bukan klasifikasi proyek asli. Deskripsi koleksi menjelaskan fokus web,
pengalaman mobile, atau penerapan AI ke produk/alur kerja.

## Transisi lembar dan navigasi kembali

Trigger-nya klik salah satu lembar dari folder terbuka. Aturannya: empat
lembar berangkat berurutan dari tumpukan paling depan, indeks 3/2/1/0;
lembar yang diklik tidak dipromosikan. Feedback-nya angkatan ringan lalu
penerbangan melayang ke atas, baru halaman kategori tampil. Gerakan berlangsung
sekali per navigasi; reduced motion langsung menampilkan tujuan dan input baru
dapat membatalkan/menyelesaikannya. Hover/fokus menaikkan inner 14px dalam 260ms
tanpa mengubah z-index atau urutan tumpukan.

projectTransition.js memakai Web Animations API. Kategori sudah di-render fixed,
invisible dan inert tanpa mengubah judul/scroll Home, dan gambarnya di-decode
terlebih dahulu. Transform asli sheet/inner dibekukan selama transisi agar
hover atau pembukaan kipas tidak menggeser lembar yang sedang menunggu.

Empat lembar asli dijadwalkan pada satu startTime. Masing-masing bergerak 550ms
pada offset 0/80/160/240ms, sehingga lembar berikutnya sudah bergerak sebelum
yang di depan keluar. Ukuran dan z-index asli tetap; tidak ada perspective,
kedalaman atau pembesaran. Jalur naik disampel menjadi 17 pose, dengan lengkung
horizontal maksimal sekitar 24px desktop/15px pada 375px dan sudut menuju
+/-3deg. Sudut awal tetap sesuai kipas asli agar tidak meloncat.
Opacity berkurang hanya ketika mendekati tepi atas. Titik akhir memakai diagonal
kartu agar seluruh bidang tetap keluar layar walaupun berotasi. Satu easing
menangani seluruh penerbangan, tanpa osilasi, blur atau paint properti baru.

Geometri netral diukur sekaligus sebelum paint. Tilt aktual kemudian melurus
70ms bersamaan dengan keberangkatan, tanpa menunda lembar. localSheetFrames
menerapkan inverse rotasi kipas dan mempertahankan translasi hover sehingga
lembar asli mengikuti jalur viewport, termasuk pada ukuran pecahan piksel.
Satu efek native berjalan dari posisi dalam folder sampai keluar layar;
sampul folder asli menyediakan occlusion dan z-index tanpa clone dekoratif.
Tidak ada fase angkat terpisah, pergantian elemen, atau callback pendaratan
yang memulai ulang gerak. Hanya backdrop halaman berada pada overlay fixed.
Will-change diberikan sementara lewat class source dan dilepas pada cleanup.
Backdrop muncul di akhir lembar terakhir; URL/kategori baru diaktifkan setelah
semua lembar keluar dari atas, lalu backdrop memudar 110ms tanpa hold tambahan.
Rangkaian maju total 900ms (550 + 3*80 + 110). Transform/opacity memakai
Web Animations API, tanpa loop JS per frame.

Konteks kategori, indeks lembar, posisi scroll, ukuran viewport dan posisi
folder disimpan dalam history.state. Saat kembali, halaman koleksi ditahan
sebagai lapisan fixed sementara Home dipulihkan di bawahnya. Dua postRender
Motion memberi kesempatan controller Home mengukur layout dan restore melalui
driver scroll yang sama, sebelum slot lembar diukur. Jika viewport berubah,
tujuan folder diukur ulang. Halaman koleksi memudar 110ms agar Home terungkap,
lalu empat lembar asli turun dari atas memakai kebalikan jalur melayang,
masing-masing 590ms dengan stagger 80ms. Gerakan langsung berakhir pada posisi
dalam folder. Satu easing berlaku dari awal sampai akhir, tanpa berhenti di
atas folder lalu memulai insertion baru. Folder tetap terbuka, fokus kembali
ke lembar yang dipilih dengan preventScroll. Fokus route proyek menuju h1 dan
judul berubah. Detail yang tidak memiliki empat thumbnail grid memakai fallback
kembali langsung, begitu pula kunjungan langsung tanpa origin yang valid.

App, Hero, Header, CareerTimeline dan Projects menerima status active. Lenis,
controller foto/Journey, listener navbar/parallax dan observer folder dilepas
ketika Home tersembunyi; state dan DOM tetap tersedia. smoothScroll.js membuka
pause/resume/restore pada ref navigasi yang sama, melepas metode pada cleanup.
Tidak ada driver scroll kedua. Event wheel/touch/pointer pada router hanya
membatalkan/menyelesaikan transisi navigasi, tidak menghaluskan scroll.

Permintaan baru menolak promise animasi lama; Escape/pointer dapat membatalkan
keberangkatan ke koleksi/detail yang belum commit. Saat tujuan Home, kedua
input menyelesaikan pendaratan lewat immediate, termasuk sebelum restore dan
saat lembar turun. Return tidak boleh menjalankan rollback ke current yang
masih menunjuk koleksi lama sampai commit. Commit normal tetap setelah animasi
agar lapisan koleksi tersedia untuk fade; navigasi/history baru tetap dapat
menggantikan job. Guard live/fast mencegah promise lama mengubah render/fokus
atau menggandakan history. Resize, input scroll, hidden dan perubahan reduced
motion menyelesaikan tujuan tanpa overlay tertinggal. Back/Forward membaca
entri history, bukan menambah entri pengganti. Cleanup membatalkan animasi,
postRender dan listener serta memulihkan source/scrollRestoration. Reduced
motion, geometri gagal dan API animasi tidak tersedia tetap dapat bernavigasi.
Kunjungan kategori langsung kembali dengan fallback, tanpa origin rekaan.

Rujukan API: [React flushSync](https://react.dev/reference/react-dom/flushSync)
dipakai hanya pada commit DOM dari event/callback navigasi; penyelesaian dan
pembatalan mengikuti [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API).
Durasi adalah deklarasi, bukan hasil pengukuran frame atau bukti FPS.

## Layout dan navigasi

Hero memakai min-height berurutan `100vh`, `100svh`, `100dvh`. Heading/pengantar
mengikuti konten dan scene mengambil sisa ruang. Section boleh lebih tinggi
bila layar pendek atau teks membesar. Pada >=1100px, heading mengambil baris
grid pertama dan scene baris kedua. Judul Geist 600 memakai ukuran berdasarkan
lebar/tinggi viewport, maksimal 320px; scene melebar hingga 1100px dan bertumpuk
48–64px ke bawah judul. Scene/traveler berada di depan heading; tidak mengubah
containing block root/foto. Pengantar terpisah dalam flow di kiri baris kedua,
lebar maksimal min(26ch,21vw), di luar jalur portrait. Di bawah 1100px urutannya
heading, copy terpusat hingga 48ch, lalu scene; tidak ada overlap judul/foto.
Sapaan Saya Rafi dan CTA Tentang saya tetap dihapus. Posisi/ukuran logo desktop
baru membentuk lengkung longgar; parameter motion dan geometri mobile lama
dipertahankan. Pelat gradient putih/kabut dan shadow memberi kedalaman kecil.
Scene memiliki basis/min-height eksplisit dan size containment untuk ukuran
portrait/halo berbasis container. Label navbar dapat membungkus saat membesar.

About memakai tiga kolom pada >960px: identitas “Halo, saya Rahmat Rafi Indrayani.” serta Unduh CV,
foto di tengah, lalu heading fokus AI dan dua paragraf biografi. Dua kolom samping memakai `minmax(0, 1fr)` dengan lebar setara agar
anchor foto tetap terpusat. Lebar komposisi maksimal 1320px; foto desktop
berasio 2:3 dengan lebar maksimal 340px. Pada <=960px foto menjadi baris pertama,
di atas identitas lalu biografi, tanpa offset kanan. Urutan DOM tetap
identitas/CV, foto dekoratif, lalu biografi.

Kedua wrapper panel desktop memakai width min(352px, 100%): identitas
justify-self end dan biografi justify-self start. Pembatas yang sama merapatkan
isi ke tepi dalam tanpa memindahkan pusat foto; kedua blok tetap align center
secara vertikal. Heading kiri 36–58px/500/1.08 dengan tracking -.045em, heading
kanan 24–32px/550 dibatasi 18ch dengan balanced wrapping. Jarak label/nama/CV
22/18/24px; antarparagraf 20px. Pada <=960px panel kembali lebar penuh sampai
680px dan batas heading kanan dilepas. Sapaan diperkecil menjadi 18px dan nama
dikelompokkan Rahmat Rafi / Indrayani., dengan pembungkusan alami saat perlu.
<=680px sapaan 16px, nama 36–44px/550/1.06, label 12px dan jarak label 18px.
Profesi 14px dan CV 48px berbagi baris flex yang boleh membungkus; anchor foto
maksimal 220px. Tinggi tetap mengikuti konten; controller mengukur wrapper yang sama
sehingga celah aman reveal mengikuti ukuran baru tanpa offset Motion tambahan.

Hero dan About tidak mengecat latar masing-masing. Satu gradient pada
`.intro-journey` memakai stop berbasis `svh`, sehingga penambahan runway tidak
mengubah warna awal langit. `.background` di dalam Hero transparan dan memakai
mask vertikal yang tidak bergerak. Awan dan sky-light memudar sampai transparan
di batas Hero; offset parallax `.clouds` tidak memindahkan tepi fade.
Tidak ada overlay solid yang mengecat ulang warna pada batas section.

Awan Hero memakai sumber hero-cloud-bank.png 2172 x 724 dan WebP 1000/2000,
berupa formasi rendah alami hasil imagegen. Cloud-bank lama tetap khusus header
koleksi. .cloud-layer tetap tinggi 44%, far top 30%/opacity .64 dan near
top 54%/opacity .9. Track max(200%,1800px) berisi dua tile 50% dengan object-fit
contain dan mask horizontal 8%/92%; translasi -50% menyambung dua tile identik.
Kedua lapisan tetap tampil pada mobile. attachCloudMotion tetap mengendalikan
animation-play-state offscreen/hidden/reduced motion; controller tidak berubah.

Lapisan `.about-sky` absolut di stage menempatkan burung di belakang konten,
tanpa mengubah geometri foto/teks. Setiap burung menghadap serta terbang ke kanan,
memiliki ukuran, opacity, periode, fase kepakan, dan drift sendiri. Sprite vektor
12 frame di `public/images/bird-flight.svg` menggabungkan fase melayang dengan
kepakan singkat; lintasan memakai CSS transform infinite 38–52 detik. Reset
terjadi setelah burung keluar area. `attachCloudMotion` memakai stage sebagai
target observer dan langit sebagai penerima `data-playing`; offscreen/tab hidden
menjeda penerbangan serta kepakan tanpa scheduler JS tambahan. Reduced motion
menonaktifkan keduanya dan menempatkan burung statis di posisi yang ditentukan.
Kawanan PNG/WebP lama disimpan sebagai aset historis, tidak dipakai runtime ini.

Unduh CV adalah anchor download native ke PDF asli pengguna di public/documents,
dengan URL/nama file dari `resume` pada portfolio.js. Lenis mengabaikan download.
Fokus, reduced motion dan ruang aman foto tetap berlaku pada aksi Unduh CV.

Overlay foto berada di luar scene Hero, pada lapisan depan komposisi About.
Jangan menambahkan transform, filter, perspective, atau size containment pada
ancestor overlay yang mengubah containing block fixed dari viewport.
`navigation.js` menyimpan posisi section, mengukur ulang lewat resize/observer,
dan menjadwalkan satu frame. Callback hanya berjalan saat status berubah. Akhir
halaman mengaktifkan section terakhir walaupun section pendek. Scroll padding
mencegah target tersembunyi di belakang header. Lenis menghaluskan wheel/trackpad
dengan `lerp: .18` dan `syncTouch: false`; touch serta keyboard tetap native.
`html.lenis` memakai `scroll-behavior: auto` selama driver aktif agar CSS smooth
scroll tidak bersaing dengan Lenis. Tautan satu halaman ditangani secara eksplisit:
modifier/target/download tetap dihormati, default fragment dicegah, Lenis memakai
scroll-padding/margin CSS tanpa offset ganda dan hash diperbarui. Navigasi anchor
memakai 900ms easeInOutCubic tanpa lock, terpisah dari lerp wheel .18. Fokus link
dipertahankan selama perjalanan; onComplete menjadwalkan fokus section dengan
preventScroll pada Motion postRender, setelah pose terakhir update/render.
App membagikan objek metrik navigasi kepada controller foto dan driver Lenis.
Home menuju 0; About menuju geometry.end pada pinned, atau maksimum
geometry.turn/anchor CSS pada flow, tanpa menerapkan offset CSS dua kali.
Input pointer/wheel/touch, fokus baru, tombol navigasi keyboard, resize, history,
hidden/mode/pageshow dan cleanup membatalkan request/callback lama. Listener
pointer/wheel/touch memakai capture agar inertia lama dilepas sebelum Lenis
memproses input baru. Fokus section milik navigasi dilepas saat input pointer
atau history; fokus keyboard/anak konten tetap mengaktifkan guard aksesibilitas.
Hero, About, dan Journey dapat menerima fokus
programatis melalui `tabIndex={-1}`.

## Siklus animasi

`careerTimeline.js` berlangganan MotionValue scroll yang sama dengan portrait.
Desktop >=961px dengan hover/pointer presisi memakai mode horizontal jika stage
muat viewport. Root mengaktifkan layout horizontal sebelum membaca lebar window
timeline, sebab versi flow memakai max-width dan versi horizontal full viewport.
Track memakai inset dari cqw window, dengan gap yang sama di dalam/antarbab.
Jarak travel adalah selisih pusat node terakhir dan pertama; startX menyelaraskan
node pertama ke pusat viewport. Pengukuran pusat node relatif terhadap track
menghapus pengaruh transform X serta skala node saat resize. Origin
diambil dari runway, bukan stage sticky, sehingga resize/restore tidak menambah
offset pin. CSS sticky dan spacer ::after dalam flow menahan komposisi selama
  jarak itu. Padding akhir root --career-end-space dihitung dari tinggi viewport,
  stage dan pinTop (minimal 104px, sisa 24px), agar node terakhir dapat mencapai
  pusat saat Journey menjadi section terakhir. Cleanup melepas properti tersebut.
  Translasi X, fokus tiap node dan progres label bab ditulis melalui MotionValue
  pada frame update; scroll tidak membaca layout. Intensitas mengikuti
  smoothstep jarak terhadap pusat. Node opacity .24–1, scale .9–1.08, halo mengikuti
  fokus; copy navy opacity .74–1. Copy/node memakai transform/opacity.
Label bab berganti melalui fade keluar/masuk tanpa dua kata bertumpuk.
  Rail sekarang satu SVG absolut selebar track, overflow visible hingga tepi
  window, dengan viewBox dari lebar track yang di-cache. careerRoute.js
  membentuk kurva kubik antara pusat node: baseline 14/34px dan envelope sin²
  dengan amplitudo 8px, nol displacement/turunan di node. Fase berasal dari
  readingPoint scroll, bukan waktu. Path perlu pembaruan d (paint), dibatasi
  56 potongan kubik termasuk ekstensi tepi untuk enam entri saat ini.
  Satu kepala cahaya memakai x readingPoint dan y dari fungsi kurva yang sama;
  ekor 90px ber-gradient mengikuti arah scroll. Path cahaya/kepala serta
  gradient menerima MotionValue route, tanpa React render tiap frame.
  Kepala tetap pada sumbu baca di viewport, kontinu relatif pada node yang
  bergeser. Tidak membaca panjang/geometri SVG selama scroll. Update route
  dilewati jika scrub tidak berubah; null pada fallback dan cleanup. Hover
  CSS hanya mengubah transform inner konten/logo dan opacity halo/connector,
  tanpa memindahkan kotak node yang diukur.
data-current tetap menjadi state audit; tidak ada pengumuman ARIA pada scroll.

Pada <=960px controller yang sama memakai mode `vertical`, tanpa sticky,
runway tambahan atau handler touch. Track tetap diam; pusat Y keenam node
diukur relatif track dan origin dokumen di-cache. Reading point adalah posisi
scroll aktual + setengah tinggi viewport - origin. Fokus memakai smoothstep
jarak ke pusat, dengan radius maksimal 30% viewport atau 85% jarak tetangga.
`createCareerVerticalRoute` membuat satu jalur lurus dari node pertama sampai
terakhir; kepala dan ekor 80px mengikutinya, termasuk jeda antar bab, dan ekor
berbalik bersama arah scroll. Cahaya memudar di luar ujung jalur, tanpa
memudarkan garis dasarnya. Path dasar tetap; tidak ada morph gelombang mobile.

SVG 48px berada pada gutter kiri dan melalui pusat bulatan yang diam. Heading
bab menjorok sejajar copy. Fokus menguatkan halo/opacity yang sama, translasi
konten maksimal 6px dan skala logo 1.025 melalui --career-focus; kotak node
tetap terukur tanpa gerak posisi. Padding akhir --career-end-space minimal
72px ponsel/104px tablet memastikan titik terakhir dapat mencapai tengah
viewport, termasuk saat Journey mengakhiri halaman. Resize/restore dan hidden
memakai lifecycle lama; scroll tidak menambah layout read/scheduler. Fallback
CSS menyambungkan garis di sela Education/Experience saat SVG tidak aktif.

Default, touch >960px, reduced motion, dan stage desktop terlalu tinggi memakai dua
daftar vertikal statis dalam mode `flow`. Flow mengalahkan transform track serta opacity/scale node dan
copy inline Motion, dan menghilangkan halo. Heading h2 tetap untuk pembaca layar;
h3 bab terlihat dalam flow. Versi horizontal hanya memiliki satu label bab,
tanpa header/footer/progres tambahan. Tautan kembali ke beranda muncul pada fokus keyboard.
Focus-visible pada
section atau keturunannya melatch flow selama masa hidup komponen agar fokus
berikutnya tidak bergeser akibat pin aktif lagi. Bila kontrol anak keluar layar
setelah pelepasan pin, scrollIntoView nearest memulihkannya; fokus root tidak
melakukan scroll manual agar navigasi Lenis dapat menyelesaikan anchor.

ResizeObserver memantau root/runway/stage/viewport/track dan main untuk perubahan
layout dari About. Resize, visual viewport, pageshow, serta fonts ready menandai
geometri kotor. Fallback stage tinggi dikunci menurut window.innerWidth untuk menghindari observer loop
akibat pergantian layout sendiri. Tab hidden membatalkan callback terjadwal;
cleanup melepas observer, subscription, listener, state visual, dan frame lama.

`smoothScroll.js` menerima MotionValue scroll bersama dari App. Lenis berjalan
pada fase `frame.read`; setelah `lenis.raf(timestamp)`, nilai diambil dari posisi
scroll aktual browser, bukan target wheel. Scroll native untuk keyboard/touch
juga memperbarui sumber yang sama. `portraitJourney.js` berlangganan perubahan
MotionValue, menghitung perjalanan pada `frame.update`, dan menulis MotionValue
foto/cerita. Komponen Motion merendernya dalam batch yang sama. Tidak ada loop
window RAF tambahan atau pengamat `useScroll` kedua untuk perjalanan ini.

Lenis adalah satu smoothing dengan perlambatan singkat yang disetujui pengguna;
foto/cerita tidak memakai `useSpring` kedua. Posisi animasi berhenti ketika scroll
aktual diam, bukan segera setelah input roda mouse berhenti. Reduced motion
melepas Lenis dan memakai native tanpa smoothing. Tab hidden menghentikan driver;
pemulihan halaman menyinkronkan posisi aktual. Cleanup melepas scheduler Motion,
instance Lenis, listener, dan subscription agar callback pemasangan lama tidak
mengganggu StrictMode. Detail keterlaksanaan diperiksa melalui tes lifecycle;
kelancaran visual tetap membutuhkan browser/perangkat nyata.

`parallax.js` hanya aktif pada viewport >=900px dengan hover, pointer presisi,
dan tanpa reduced motion. Peredaman eksponensial memakai selisih timestamp
frame. Geometri diukur saat pemasangan/resize; frame berhenti setelah stabil.
Wrapper `.skill-entrance` kini motion.div dengan x/y/scale/opacity yang dibuat
App dan dikendalikan portraitJourney. Offset scroll kartu lama dinolkan;
parallax hanya mempertahankan pointer luar dan atmosfer cloud/halo. Timer
kelas entering serta keyframe skill-arrive dihapus.

Awan kembali memakai transform CSS linear infinite dengan dua tile per lapisan.
Desktop far 110s delay -27s, near 78s delay -49s arah reverse. Mobile <=680px
memakai durasi far 150s dan near 110s; arah/delay tetap. Reduced motion
menonaktifkan animasi .cloud-track tanpa menyembunyikan awannya.
`cloudMotion.js` memperbarui `data-playing` berdasarkan IntersectionObserver,
visibility tab, dan preferensi reduced motion. Tombol jeda serta `data-paused`
telah dihapus; CSS menjalankan drift hanya ketika `data-playing="true"`. Jika
observer tidak tersedia, visibilitas tab dan reduced motion tetap diperiksa.
Cleanup melepas listener/observer dan menonaktifkan animasi. Pada reduced motion,
drift dimatikan; awan tetap tampil sebagai gambar.

`portraitJourney.js` mengukur anchor sumber/tujuan, kedua wrapper teks, runway,
dan stage. Anchor Hero menyediakan ukuran overlay serta posisi awal. Posisi flow
target dan kedua panel direkonstruksi dari runway serta selisih terhadap stage,
sehingga resize/restore ketika sticky tidak menyimpan posisi dokumen yang salah.

Controller juga mengukur pusat keenam wrapper skill-position (bukan inner yang
bergerak). Fold menuju 56% tinggi anchor foto. heroSkills.js menyimpan fase load,
handoff scroll dan pause time: pasangan 0/3,1/4,2/5 terbuka 560ms+delay 0/80/160,
touch 460ms+0/60/120. Selama intro saja, callback Motion update yang sama
menjadwalkan frame selanjutnya. Setelah scroll mengambil alih, tidak ada frame
pengejar. Handoff memakai pose terakhir; reverse dini diinterpolasi dari pose
sekarang ke pose terbuka di scroll 0. Setelah batas tercapai, kemajuan murni
fungsi posisi. Restore di tengah tidak memutar intro; hidden time dikecualikan.
Fold menempati maksimal 160px desktop/96px touch atau 22% turn; descent
smoothstep dimulai sesudahnya dan berakhir pada turn yang sama. Y kartu
mengompensasi scroll dokumen agar titik penutup mengikuti badan traveler fixed.
Skala tertutup .45 dan opacity memudar pada sisa bukaan .4. Reduced motion
memaksa transform none/opacity 1 lewat CSS !important serta reset MotionValue.
Invalid geometry juga memulihkan semua logo. Tidak menambah listener scroll,
timer, RAF atau spring. Waktu fase load berbeda dari scrub perjalanan.

Foto turun menuju anchor tengah dengan skala seragam; tidak ada fase foto
bergerak ke kanan. Setelah tiba, dua panel desktop terungkap ke luar secara bersamaan.
`storyX` memindahkan panel identitas dari offset positif ke nol; `detailsX`
memindahkan panel biografi dari offset negatif ke nol. Keduanya memakai opacity
setara. Jarak maksimal 48px pada desktop presisi atau 20px pada touch/nonpresisi >960px.
Jika panel bersinggungan secara vertikal dengan foto, offset dibatasi jarak
horizontal yang tersedia dikurangi ruang aman 12px. Tidak ada mask/clip huruf,
feather, atau pembatas yang memudar di posisi akhir.

Pada <=960px, `storyY`/`detailsY` bergerak dari 18px/16px ke nol dan tidak
memakai offset X. Identitas/CV dan biografi mendapat opacity terpisah, dihitung
oleh controller/scheduler yang sama dari posisi aktual. Masing-masing mulai
saat wrapper mencapai 88% tinggi viewport, selama clamp(120px, 20vh, 180px).
Identitas menunggu kedatangan foto dan biografi menunggu identitas selesai.
Posisi wrapper di-cache saat pengukuran; scroll tidak membaca layout atau
menjalankan timer/spring tambahan. Restore/resize menghitung pose saat ini,
scroll naik membalik kedua kelompok; focus-visible/reduced motion tetap
langsung menampilkan konten penuh dan fallback foto.

Stage desktop >=961px dengan hover/pointer presisi yang muat di viewport memakai
`data-about-layout="pinned"`: CSS sticky
menahan stage pada `--about-pin-top`. Spacer `.about-runway::after` ber-height
`--about-runway` menambah ruang dalam flow, bukan padding yang mengubah containing
block sticky. Ruang ini dipakai fase membuka panel, sementara foto tetap tengah.
Mode desktop presisi memakai rentang 480–720px; mode lain 220–320px.
Touch/mobile selalu memakai flow. Stage terlalu tinggi atau teks membesar memakai mode
`flow` tanpa sticky/runway tambahan. Foto tetap menuju anchor tengah di flow,
lalu panel terbuka selama rentang yang lebih pendek sambil dokumen bergerak.

Traveler memakai koordinat viewport. Setelah fase selesai, nilainya tetap
mengikuti posisi scroll aktual agar foto keluar bersama About. Kemajuan boleh
mencapai satu; pembaruan koordinat viewport tidak boleh dihentikan setelah itu.
Skala serta posisi dihitung melalui smoothstep dari scroll aktual dan ditulis
melalui MotionValue. Tidak ada timer reveal, state sekali tampil, atau spring
pengejar kedua. Scroll naik menutup kedua panel dan mengembalikan foto ke Hero.
`--about-interaction` mengaktifkan pointer CV sejak opening > 0, agar tombol
yang sudah muncul tidak menunggu reveal 90%. Pada opening 0 pointer tetap
none; fokus keyboard langsung mengaktifkannya tanpa menunggu scroll.
Pointerdown primer pada .about-download membatalkan request/fokus anchor lama
dan melepas inertia Lenis sebelum browser melakukan fokus/click native.
Posisi tombol ditahan pada posisi aktual; tidak ada handler click download,
preventDefault, blur CV, timer atau scheduler tambahan.

Pengukuran layout tidak dijalankan pada setiap scroll. ResizeObserver memantau
wrapper/hero/anchor/kedua panel/runway/stage; resize/visual viewport, fonts ready,
serta pageshow menandai geometri kotor. Ukuran/offset overlay dan pin/runway hanya
ditulis saat pengukuran ulang. Tab hidden membatalkan frame; tab aktif
menyinkronkan ulang. Cleanup menolak callback lama dan melepas listener,
observer, subscription, properti root/overlay, serta atribut pinned/flow.

Foto memakai glow transparan serta bayangan; pelat arch solid dihilangkan dan
rim disembunyikan. Wajah tidak memakai rotasi dinamis atau translateZ. Reduced
motion atau kegagalan geometri menyembunyikan overlay dan mempertahankan foto
statis Hero serta About. Fallback perjalanan tetap memerlukan runtime React dan
JavaScript. Hanya foto utama Hero memiliki alt Rafi; salinan overlay dan About
dekoratif. Saat enhancement aktif, foto utama transparan tetapi tetap berada
dalam accessibility tree.
Fallback About memakai --about-photo-width/height dari sourceWidth/Height
dikalikan skala seragam, bottom center pada anchor. Dengan rasio anchor yang
berbeda, crop dan ukuran foto tetap cocok ketika fokus menukar traveler dengan
fallback. Variabel serta metrik navigasi dihapus saat reset/cleanup.

Default dan reduced motion menampilkan kedua panel penuh. CSS
`.about:is(:focus-visible, :has(:focus-visible))` memulihkan opacity/transform
semua .about-panel-inner dengan prioritas !important di atas inline Motion
serta mengaktifkan CV. Root :has(.about:focus-visible, .about :focus-visible)
menyembunyikan traveler dan menampilkan fallback About. Fokus mouse/touch pada
CV tidak mengganti foto atau memindahkan panel saat ditekan, sehingga target
klik dan perjalanan balik tidak dikunci oleh focus-within. Fokus tombol tetap
dipertahankan; browser menentukan focus-visible sesuai modalitas. Reduced motion
juga menonaktifkan sticky/runway tambahan. Guard ini tercatat dari source;
pemeriksaan hit testing, keyboard/komposisi browser tetap diperlukan.

## Aset dan build

Vite menyalin `public/` ke root `dist/`. Deployment subpath perlu menyesuaikan
`base` dan referensi aset bersama-sama, lalu diuji di path sebenarnya.

Portrait WebP 500px/800px berukuran 51.938/92.280 byte. Awan Hero memakai
hero-cloud-bank 1000px/2000px berukuran 97.468/344.022 byte, sumber RGBA
1.457.016 byte di assets/source.
Header koleksi tetap memakai cloud-bank lama: WebP 1000px/2000px berukuran
71.904/252.516 byte, sumber sekitar 1,3 MB di assets/source/cloud-bank.png.
Kedua PNG berada di luar direktori publik. Cloud-left/right
besar tetap arsip, tidak dirender atau diregenerasi oleh pipeline runtime.
`npm run images:optimize` meregenerasi WebP portrait, awan, dan kawanan burung
historis dengan sharp tanpa menimpa original. Sprite burung runtime adalah SVG
lokal, tidak melalui konversi raster tersebut. Prompt dan provenance ada di [ASSETS.md](ASSETS.md).

PNG portrait asli dan font tetap identik dengan aset tertanam di HTML.
`portfolio-parallax.html` menjadi baseline historis, bukan entry produksi.
Pertahankan `public/fonts/OFL.txt` dan notice SVG. Desain sekarang tidak wajib
identik dengan HTML historis.

## Dependency dan verifikasi

Runtime memakai React/React DOM, `framer-motion` (`^14.14.0`), dan Lenis
(`^1.3.27`). Dua dependency animasi/scroll ini ditambahkan atas persetujuan
pengguna untuk menghaluskan gerak. Vite/plugin React untuk build dan sharp untuk
optimasi aset development. npm/lockfile menjadi acuan instalasi; versi resolusi
sebenarnya mengikuti lockfile.

Tes Node mencakup migrasi, navigasi, lifecycle parallax/awan/intro logo/perjalanan
foto, driver Lenis/MotionValue, fallback observer, fokus/reduced motion,
respons simulasi 60/120Hz, render link/ikon,
dan aset responsif.
Tes render memakai Vite middleware tanpa membuka port. Pengujian source/simulasi
bukan bukti komposisi browser, kelancaran FPS, atau kenyamanan perangkat nyata.
