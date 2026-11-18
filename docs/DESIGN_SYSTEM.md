# Acuan desain

## Kontur dan tekstur galeri (2026-11-18)

Atas persetujuan pengguna, gradasi langit galeri dilapisi kontur topografi
biru abu #6289a3 dengan opacity .055 desktop/.04 mobile. Dua kelompok kurva
organik di sisi kiri/kanan memiliki pusat yang sengaja berbeda; mask SVG
mengosongkan area tengah agar kolase tetap dominan. Grain monokrom tile128px
memakai opacity .015. Kedua lapisan statis dan memudar pada 160px pertama/
terakhir galeri agar tidak membentuk garis di batas section.

Dekorasi berada pada wrapper absolute aria-hidden/pointer-events:none,
terpisah dari stage/preserve-3d foto. Mask hanya mengenai backdrop, sehingga
tidak meratakan konteks 3D atau mengubah depth, hover dan input foto.
Ukuran, tata letak, warna dan tipografi konten tetap dari sistem yang ada.

## Transisi Projects ke galeri (2026-11-18)

Warna akhir Projects dan awal galeri memakai token yang sama,
`--projects-gallery-sky: #e6f1fc`, agar batas section tidak menjadi garis warna.
Latar galeri memudar ke surface #f8fbfd dalam min(80svh, 720px), lalu tetap
surface. Interpolasi Oklab memiliki deklarasi gradient biasa sebagai fallback.
Ini hanya menyambungkan latar; geometri sticky dan koreografi foto memakai
pengaturan yang ada. Kontur/grain ditambahkan sesudahnya sesuai persetujuan
pengguna dan mengikuti fade batas yang sama.

## Revisi aktif: awan Hero alami (2026-11-18)

Brief: awan section pertama lebih realistis dan tidak terasa seperti gumpalan
buatan. Palet langit #9dcbea/#bddef1/#eff6fb, surface #f8fbfd, ink #10263b
serta keluarga Geist tetap. Komposisi Hero, ukuran/posisi dua lapisan dan drift
dipertahankan; perubahan hanya tekstur awan pada ruang belakang foto/teks.

Pilih cumulus rendah dengan ukuran/jarak tidak seragam, fragmen terpisah,
bayangan abu biru ringan dan tepian uap semitransparan. Detail lebih renggang
agar langit tetap terbaca sebagai ruang, bukan pita kapas padat. Aset adalah
hasil imagegen bergaya fotografis, bukan foto asli. Header koleksi memakai
aset lama. Perbandingan aset di atas warna langit sudah diperiksa; komposisi
halaman desktop/mobile belum terverifikasi langsung di browser.

## Revisi aktif: jalur Journey mobile tersambung (2026-11-15)

Brief: teruskan bahasa visual desktop pada daftar vertikal mobile, tanpa
mengubah layout horizontal desktop. Palet tetap surface #f8fbfd, ink #10263b,
copy #243a4f, rail #bfd2de, teal #3f8b86 dan kepala cahaya #78cbb6. Geist
18px untuk institusi, 24px untuk peran, 13px untuk tahun pada ponsel tetap.

Komposisi: [Education] / [o | pendidikan 1] / [o | pendidikan 2] /
[| Experience] / [o | pengalaman 1 ... 4]. Judul bab dan copy menjorok ke
kanan agar garis tidak memotong judul. Satu rail SVG melalui pusat enam
bulatan; fallback CSS juga menyambungkan jeda antar bab. Garis mobile tetap
stabil, tanpa deformasi SVG berkelanjutan atau sticky/tangkapan gesture.

Trigger: posisi scroll aktual. Rules: jarak dari tengah tinggi viewport
menentukan fokus kontinu, kepala cahaya mengikuti sumbu baca pada rail dan
ekor berada di belakang sesuai arah scroll. Feedback: halo bulatan naik
bertahap, copy .74–1, konten bergeser pendek 6px ke posisi baca dan logo
menguat maksimal 1.025. Loop/modes: diam bersama scroll, dapat dibalik;
reduced motion, fokus keyboard dan geometri gagal kembali statis penuh.
Gunakan scheduler/MotionValue yang sama, ukuran/node/teks di-cache dan tidak
dibaca saat scroll. Ruang akhir secukupnya memungkinkan node terakhir
mencapai tengah layar. Tidak menambah pulse, timer, RAF atau library.

Review: satu perjalanan cahaya menjadi penanda arah baca, bukan kumpulan
animasi masuk tiap kartu. Copy/logo asli dan urutan dua bab dipertahankan.
Desktop harus lolos tes geometri, gelombang, cahaya dan lifecycle yang sama.

## Revisi aktif: About mobile editorial, dua tahap baca (2026-11-15)

Arahan: foto tengah yang sama mengantar identitas, lalu cerita. Palet tetap
langit #bddef1/#eff6fb, surface #f8fbfd, ink #10263b, muted #506477 dan aksen
#3f8b86. Geist tetap satu keluarga. Tidak menambah kartu, badge atau copy baru.

Komposisi <=960px: [foto tengah] -> [label, sapaan kecil, nama] ->
[profesi dan CV] -> [judul fokus AI dan dua paragraf]. Semua copy rata kiri.
Sapaan 18px (16px <=680px); nama dikelompokkan Rahmat Rafi / Indrayani.,
tetap dapat membungkus saat layar sempit/teks membesar. <=680px nama
36–44px/550/1.06, label 12px, profesi 14px; tombol CV 48px berbagi baris
flex yang boleh membungkus. Anchor foto 220px, jarak grid 32px, lalu 12px
tambahan sebelum cerita. Heading biografi 24–28px, isi 16px/1.75.

Trigger: scroll aktual membawa kelompok teks menuju area baca. Aturan:
identitas menunggu foto tiba, biografi menunggu identitas selesai dan area
bacanya sendiri; tiap rentang 120–180px dari garis 88% tinggi viewport.
Feedback: identitas naik 18px dan cerita 16px dengan opacity smoothstep,
tanpa memotong huruf atau menggerakkan wrapper yang diukur. Loop/mode:
berhenti bersama scroll, berbalik saat naik, pose restore langsung tepat;
touch native tanpa pin, focus-visible/reduced motion statis penuh. Tombol CV
tetap download native dengan respons tekan scale .98 yang sudah ada.

Review terhadap brief: penekanan ada pada hierarki nama dan urutan dua
kelompok yang mengikuti perjalanan foto; tidak memakai stagger tiap baris,
blur, mask teks atau dekorasi tambahan. Desktop tetap tiga kolom dengan
reveal serempak; runtime awan/burung serta koreografi foto/logo dipertahankan.
QA visual 375px/desktop belum tersedia karena browser access host unavailable;
tes controller bukan pengganti penilaian optis atau uji perangkat sentuh.

## Revisi aktif: pulihkan seluruh tampilan/gerak awan lama (2026-11-15)

Permintaan pengguna mengembalikan awan kecil lama beserta animasi/transisinya.
Runtime kembali cloud-bank-1000/2000.webp yang sama, dua lapisan far/near,
masing-masing dua tile identik. Geometri kembali: tinggi 44%, top 30%/.64 far,
54%/.9 near; track max(200%,1800px), img contain, mask horizontal 8%/92%.
Desktop far 110s/-27s, near 78s/-49s/reverse, linear infinite ke translateX(-50%).
Mobile <=680px far 150s, near 110s. Mask vertikal background 65%–100%, shared
gradient langit dan offset parallax lama tetap. Trigger in-view -> lifecycle
lama menjalankan track -> feedback drift kontinu -> pause offscreen/hidden,
reduced motion statis; tidak ada scheduler tambahan atau crossfade baru.

Hapus cloud-breathe, cloud-drift, var travel, bank sisi dan override mobile baru
dari runtime. Sumber dan hasil bank sisi hanya arsip. Layout editorial judul,
foto/logo, koreografi perjalanan, navbar, perbaikan CV dan burung tetap.
Verifikasi parameter source terhadap acuan lama dan regresi build/lifecycle;
kesamaan visual browser tidak boleh diklaim sebelum preview tersedia.

## Revisi aktif: Hero editorial dan awan sisi (2026-11-15)

Arahan disetujui dari mockup imagegen: identitas langit yang sama, portrait asli
di tengah, judul navy besar pada lapisan belakang, deskripsi kiri dan enam logo
dalam lengkung longgar. Palet #9dcbea/#bddef1/#eff6fb/#f8fbfd/#10263b/#365269;
Geist 600 pada display, regular 17px pada copy. Tidak menambah badge/CTA/klaim.

Desktop >=1100px: [navbar] / [AI Engineer melebar] / [copy kiri | FOTO | logo].
Scene menumpuk 48–64px ke area bawah judul, sehingga hanya bagian bawah huruf
bersinggungan dengan siluet; portrait berada di depan dan wajah tetap bersih.
Kolom tengah 1100px, heading responsif mengikuti lebar dan tinggi viewport,
copy maksimal 26ch berada di luar jalur foto/logo. Mobile/tablet memakai urutan
heading -> copy -> scene, tanpa overlap judul/wajah dan tetap dapat lebih tinggi
dari viewport saat layar pendek/zoom. Foto/anchor memakai geometri controller
yang sama; jangan menambah driver scroll, animasi foto atau transform root.

Dua cloud bank fotografis transparan kiri/kanan dibuat melalui built-in imagegen
dari referensi mockup. Sumber assets/source/cloud-left.png dan cloud-right.png;
runtime WebP responsif 600/1024. Aset lama tetap disimpan. Empat lapisan memakai
dua aset cache yang sama: far tipis dan near lebih jelas, dengan bagian tengah
lapang. Gerak direvisi agar terlihat: near clamp(48px,6vw,112px)/-16px selama
24/30s, far clamp(28px,3vw,48px)/-8px selama 42/50s, ease-in-out alternate
infinite. Mobile near clamp(24px,8vw,40px)/-8px. Fase berbeda menghindari semua
lapisan melambat bersamaan; batas X tetap di dalam overscan sisi (-8% desktop,
-26% mobile) agar tepi luar tidak terbuka. Trigger halaman terlihat -> aturan lifecycle
attachCloudMotion yang sama -> feedback kedalaman halus -> loop reversibel tanpa
reset kasar; offscreen/hidden pause, reduced motion statis. Mobile hanya near.
Mask vertikal tetap pada background yang tidak ikut parallax untuk kontinuitas
Hero/About. Tidak ada animasi width/height, blur besar atau scheduler tambahan.

Review: gunakan komposisi berani pada judul/foto, dengan awan sebagai bingkai.
Logo tetap asli dan hanya berlogo. Hindari menyalin bitmap mockup sebagai layar
website, headline yang terpotong, atau copy melintasi wajah. Verifikasi alpha,
transfer aset, render/tautan serta regresi navigasi/CV/foto; browser bila tersedia.

## Revisi aktif: CV sekali klik dan scroll balik (2026-11-15)

Trigger pointer pada CV yang terlihat -> hentikan inertia Lenis pada posisi
aktual, batalkan request fokus anchor lama -> download PDF native sekali klik.
Jangan mengubah fokus atau transform panel pada klik mouse/touch; fokus tombol
boleh tetap ada tanpa menyembunyikan traveler. Aksesibilitas memakai guard
focus-visible pada About/keturunannya, bukan focus-within untuk semua jenis
fokus. Tab/fokus keyboard tetap memulihkan semua teks, tautan dan foto statis;
reduced motion tetap statis penuh. Navigasi anchor 900ms tetap.

Tombol memakai pointer auto sejak opening > 0, bukan menunggu 90% saat hampir
seluruh teks sudah terlihat. Pada opening 0 tetap noninteraktif untuk pointer;
Tab tetap dapat membuka guard. Posisi/skala, copy, CV asli dan desain tetap.
Tidak ada blur paksa pada CV, click handler download, timer atau RAF baru.
Tes regresi: early reveal/reverse, pointer menghentikan inertia tanpa mencegah
klik, download native satu event, pembatalan fokus anchor lama, reduced motion
dan lifecycle. Preview browser tetap dibutuhkan untuk hit testing/focus-visible.

## Revisi aktif: keseimbangan optis About (2026-11-15)

Pertahankan langit/foto sebagai identitas utama: kabut #eff6fb, permukaan
#f8fbfd, navy #10263b, teks sekunder #506477 dan aksen #3f8b86. Geist medium
untuk nama, 550 untuk judul biografi, regular untuk paragraf.

Susunan desktop: [identitas ->] [foto tetap di tengah] [<- biografi]. Kolom
samping tetap sama lebar dengan align-items center; isi kedua panel maksimal
352px, identitas menempel tepi dalam kanan dan biografi tepi dalam kiri.
Ini mengurangi ruang kosong pada blok identitas yang sebelumnya selebar kolom.
Nama memakai 36–58px (sekitar 10% lebih kecil), line-height 1.08 dan tracking
-.045em. Label/nama/peran/CV memakai jarak 22/18/24px; judul kanan 24–32px/550,
paragraf tetap 16px/1.75 dengan jarak 20px. Seluruh copy tetap rata kiri.

Mobile <=960px kembali ke panel lebar penuh, foto di atas. <=680px judul nama
36–45px dan jarak label 18px, tanpa offset desktop tambahan. Nama tetap utuh
dengan pembungkusan alami. Controller mengukur wrapper yang sama; jangan beri
translasi baru pada wrapper, mengubah jalur foto atau guard fokus/reduced motion.

Review: kebutuhan utamanya keseimbangan bobot dan ruang, bukan dua blok dengan
tinggi/font identik. Hindari spacer, posisi absolut, teks tambahan atau meratakan
semua judul. Rencana menguatkan biografi sedikit sambil mengurangi dominasi nama;
hasil optis tetap perlu diperiksa lewat preview, bukan hanya build/tes.

## Revisi aktif: Hero lebih tenang (2026-11-15)

Tujuan: profesi dan portrait tetap menjadi pusat perhatian, dengan satu kalimat
manfaat. Hapus sapaan Saya Rafi dan CTA Tentang saya; nama lengkap berada di
header/About dan navigasi About tetap tersedia. Deskripsi: Membangun aplikasi
AI dan otomasi untuk memudahkan pekerjaan.

Palet tetap langit #9dcbea, kabut #eff6fb, permukaan #f8fbfd, teks #10263b dan
sekunder #365269. Geist medium untuk judul, regular 17px/16px untuk pengantar.
Susunan center: [navbar] / [AI Engineer + deskripsi max 48ch] / [foto + logo].
Deskripsi masuk kelompok heading dalam flow pada semua breakpoint, tanpa blok
kiri atau CTA tambahan. Nama/header, foto, awan dan jalur scroll tetap.
Logo/pelat 90% ukuran acuan desktop, 92% mobile <=680px; pusat, rotasi dan
parameter koreografi tetap. Ukuran logo merek diskalakan dengan faktor sama.

Review rencana: jangan mengganti elemen yang dihapus dengan badge, slogan atau
dekorasi baru. Identitas langit/foto yang sudah dipilih pengguna tetap menonjol.
CSS lama khusus sapaan/CTA dibuang; evaluasi breakpoint/kontras lewat source,
tes existing/build, dan browser bila tersedia. Tes bukan bukti visual langsung.

## Revisi aktif: navigasi Hero/About tanpa pergantian foto dini (2026-11-15)

Masalah: anchor About memindahkan fokus sebelum scroll selesai. Guard fokus
langsung menyembunyikan traveler dan menampilkan fallback, sehingga perjalanan
tidak terlihat. Selain itu, anchor awal section tidak sama dengan endpoint
koreografi, dan rasio anchor Hero/About dapat membuat fallback berbeda ukuran.

Trigger klik anchor -> aturan navigasi Lenis 900ms ease-in-out, tanpa lock,
ke About endpoint penuh pada pinned atau posisi arrival/anchor aman pada flow
-> feedback foto yang sama bergerak melalui fase logo/descent/reveal -> fokus
target baru dipindah pada fase Motion postRender setelah endpoint dirender.
Guard About tetap aktif saat fokus keyboard masuk konten, tanpa membiarkan
traveler menutupi konten. Fallback diberi ukuran hasil fit traveler (bottom
center) supaya handoff fokus tidak mengubah crop/ukuran wajah.

Wheel, touchstart, pointerdown, fokus baru, tombol navigasi keyboard, resize,
popstate, pergantian tab/mode, cleanup atau klik anchor baru membatalkan request
serta callback fokus lama. Input native tidak dicegah. Hash tetap #home/#about;
tujuan numerik memakai metrik controller yang sama, bukan listener/RAF baru.
Anchor biasa tetap memakai padding/margin CSS, reduced motion tetap native.
Tidak ada perubahan palet, font, layout atau kecepatan wheel .18.

Kritik: sekadar memperlambat scroll atau menghapus guard fokus tidak cukup.
Endpoint, waktu fokus dan ukuran fallback harus cocok. Uji callback lama dan
interupsi, lalu verifikasi visual jika browser tersedia; tes bukan bukti FPS.

## Revisi aktif: logo keluar/masuk sebelum perjalanan foto (2026-11-15)

Enam logo Hero tetap pada posisi, ukuran, rotasi serta palet merek saat terbuka.
Geist dan palet langit #9dcbea/#eff6fb/#f8fbfd/#10263b/#243a4f/#3f8b86 tetap.
Foto/identitas langsung terlihat. Logo bergerak dari titik di belakang badan
foto (56% tinggi anchor, bukan wajah), lalu kembali ke posisi masing-masing.
Tiga pasangan simetris (indeks 0/3, 1/4, 2/5) muncul selama 560ms dengan
delay pasangan 80ms; touch 460ms+60ms. Opacity melunakkan akhir occlusion,
scale tertutup .45. Traveler/foto berada di depan logo, tanpa mask baru.

Trigger load di posisi atas -> aturan satu pembukaan pada scheduler Motion
perjalanan foto -> feedback translate/scale/opacity -> berakhir <=720ms desktop,
<=580ms touch. Trigger scroll -> logo menutup dalam maksimal 160px desktop/
96px touch (dibatasi rentang descent) -> baru foto turun pada sisa rentang
yang sama -> reversible; tidak menambah runway/scroll kosong.

Jika scroll memotong pembukaan, simpan pose aktual sebagai awal penutupan;
jangan memaksa selesai atau melompat. Reverse awal menginterpolasi dari pose
saat berbalik ke komposisi terbuka di scroll 0. Setelah tertutup penuh, seluruh
fase mengikuti posisi saja. Timer/animasi CSS entrance lama dihapus. Tidak
menambah RAF/listener scroll/spring; waktu load saja boleh menjadwalkan frame
Motion yang sama. Tab hidden menjeda load; cleanup/reset melepas semuanya.
Reduced motion langsung menampilkan enam logo dan foto statis lengkap.

Kritik: logo harus berada di belakang foto, bukan bergerak di atas wajah.
Hapus offset scroll parallax lama pada kartu agar tidak ada dua pengendali
vertikal yang bertarung; pointer parallax ringan tetap pada wrapper luar.
Jarak mobile otomatis lebih pendek dari geometri layar, bukan menyalin
translasi desktop. Periksa restoral/resize dan interruption dalam tes; browser
tetap diperlukan untuk menilai occlusion dan kelancaran aktual.

## Identitas nama lengkap (2026-11-15)

Label header sebelumnya Portfolio kini Rahmat Rafi Indrayani; judul About
berbunyi Halo, saya Rahmat Rafi Indrayani. Palet/ukuran huruf tetap. Nama
pada heading membungkus alami dengan text-wrap balance, tanpa ellipsis atau
hard break di dalam nama. Marker dibatasi kolom dan boleh wrap agar tidak
menekan navbar. Preview desktop/mobile belum terverifikasi; 62 tes/build lulus.

## Revisi aktif: tiga section tanpa lab (2026-11-15)

Section navy Dari teknologi ke ide, toolkit dan konsep dummy dihapus atas
permintaan pengguna. Website kini Hero, About dan Journey. Navbar Home/About/
Journey memakai tiga kolom/indikator sepertiga; CTA eksplorasi di About dihapus,
CV tetap asli. Tautan fokus Journey kembali ke beranda. Enam kartu teknologi
Hero tetap ada. Padding akhir horizontal Journey diukur agar node terakhir
tetap mencapai pusat tanpa memerlukan section lanjutan. Tidak menambah section
pengganti. Catatan lab/Skills di bagian historis berikut bukan spesifikasi aktif.

## Revisi aktif: burung dekat dengan blur (2026-11-15)

Satu burung tambahan per scene sebagai kedalaman dekat kamera. Palet
#f8fbfd/#eff6fb/#10263b/#243a4f/#bfd2de/#3f8b86, Geist dan layout tetap.
About memakai 64px/blur 1.75px/opacity .24 pada band kiri atas: masuk kiri,
melengkung naik dan keluar canvas sebelum mencapai tengah/navbar/foto.
Journey memakai 72px/blur 2.25px/opacity .22 pada band bawah konten, terbang
ke kanan. Sprite asli dan arah kepala dipertahankan. Blur tetap, bukan animasi.

```text
 About:   burung dekat -> naik keluar (kiri atas)    [area navbar/foto bersih]
 Journey: [timeline + informasi bersih]
                       burung dekat ------------------------->
```

Trigger: scene terlihat/tab aktif/motion diizinkan. Aturan: putaran 76s About
dan 84s Journey, sebagian besar waktu menunggu di luar canvas, fase awal
berbeda. Feedback: satu lintasan burung lebih besar, lebih cepat dan samar.
Loops/modes: reset hanya saat di luar canvas, lifecycle attachCloudMotion
yang sama, tanpa timer/scheduler baru. Mobile <=960px dan reduced motion
menyembunyikan tambahan ini; jumlah burung kecil tetap 2 About/3 Journey.

Kritik: jangan membuat blur menjadi noda, membesar berlebihan atau memakai
full-screen filter. Blur dibatasi pada sprite kecil. Hindari kesan kedua
scene disalin dengan lintasan/durasi yang berbeda. Fase berbeda mengurangi
kemunculan bersama, bukan jaminan keduanya tak pernah terlihat bersamaan.

## Revisi aktif: lima burung di Journey (2026-11-15)

Tambahkan kontinuitas langit dari About: sprite burung kanan yang sama, tanpa
aset baru. Warna tetap #f8fbfd/#eff6fb/#10263b/#243a4f/#bfd2de/#3f8b86;
tipografi Geist dan layout timeline tidak berubah. Desktop: tiga lintasan
di 8/30/50px atas stage, dua lintasan di ruang bawah stage. Ukuran 26–44px,
opacity .2–.34; kecepatan/fase berbeda. Komposisi sengaja membiarkan jalur,
cahaya, logo dan teks di tengah bersih. Burung tidak berada pada track yang
bergeser, sehingga tidak terseret horizontal oleh scrub.

```text
        burung kecil ->      burung jauh ->      burung ->
                 Education / Experience
     ~~~~~~ ◆ ~~~~~~ cahaya ~~~~~~ ◆ ~~~~~~
        identitas / peran / afiliasi
          burung ->                  burung jauh ->
```

Trigger: stage terlihat, tab aktif, reduced motion mati -> aturan CSS infinite
lintasan kanan dengan beda rise/drift serta fase kepakan -> feedback kedalaman
dan jalur yang berbeda dari About -> loop reset hanya setelah keluar layar.
Pause/cleanup memakai attachCloudMotion yang sudah ada; tidak menambah RAF
atau listener scroll. Mobile <=960px menampilkan burung 1,2,5 (dua atas, satu
bawah), fallback flow menggeser band atas ke ruang sebelum heading. Reduced
motion memakai posisi diam dan tidak mengubah keterbacaan/fokus.

Kritik: lima burung berukuran besar akan menyaingi cahaya. Pertahankan skala
kecil, dua band yang terpisah dari konten, kecepatan 41–61s, tanpa terbang
mundur, tanpa berputar pada wajah/teks, tanpa hover/klik dekorasi. Stage
tetap pada flow/sticky yang ada dan layer burung tidak menambah tinggi ukur.

## Revisi aktif: gelombang nyata dan cahaya perjalanan (2026-11-15)

Pengguna menyetujui deformasi jalur dan satu cahaya yang bergerak menyusurinya.
Geist, hierarki terbaru dan palet #f8fbfd/#eff6fb/#10263b/#243a4f/#bfd2de/
#3f8b86 tetap. Tidak ada dekorasi atau kontrol tambahan. Berlian, logo, teks
dan connector tetap di koordinat semula; hanya lengkungan antar-node berubah.

Trigger: posisi scroll aktual App. Aturan: scrub maju/mundur mengubah fase
gelombang (maksimal 8px) dan posisi kepala cahaya sepanjang satu jalur kontinu.
Envelope deformasi nol dan turunan nol di node sehingga sambungan tidak lepas.
Feedback: kepala kecil hijau dengan ekor memudar sekitar 90px, halo node
menguat saat cahaya mendekat. Loops/modes: tanpa waktu/timer/driver baru;
scroll berhenti berarti geometri dan cahaya berhenti, reverse mengembalikan
bentuk jalur yang sama. Mobile/touch, fokus keyboard, stage tinggi serta
reduced motion tetap daftar vertikal statis dan seluruh informasi terlihat.

Satu SVG absolut pada track menggantikan segmen/sorotan per-item. Jalur dan
posisi cahaya dihitung dari cache pusat node saat ukur layout. Tidak memakai
getPointAtLength/getTotalLength/layout read per scroll. Kepala cahaya melewati
sumbu baca yang sama di viewport, bergerak kontinu relatif terhadap node yang
bergeser horizontal. Gradient ekor berbalik sesuai arah scroll.

Kritik: real deformasi SVG perlu pembaruan d (paint kecil), tidak bisa hanya
transform/opacity. Batasi satu rail tipis, kurva kubik, tanpa filter blur besar,
tanpa React render per frame, dan gunakan scheduler Motion yang ada. Jangan
mengklaim 60fps tanpa pengukuran browser. Hindari gelombang pada copy atau
spring pengejar yang bergerak setelah posisi scroll benar-benar diam.

## Revisi aktif: hierarki editorial dan konteks kampus (2026-11-15)

Pengguna menyukai jalur namun teks terlalu flat. Perbaikan terbatas pada enam
entri Journey: identitas 18–20px/550, peran 24–28px/600, tanggal 13px/450
tabular, afiliasi 14px/400 line-height 1.6, kategori 12px/500. Geist tetap
dipakai; tidak menambah font/dependency. Palet: #f8fbfd permukaan, #10263b
fokus, #243a4f identitas/pendukung, #eff6fb kabut, #bfd2de garis dan
#3f8b86 aksen jalur. Teks sekunder diperiksa sesudah opacity .74: sekitar
4.64:1 pada sampel latar #d4e9e8 yang mencakup tint hover. Ini kalkulasi warna,
bukan pengukuran piksel browser.

```text
 [logo] Nama organisasi       18–20 medium
        Tahun                13 tabular

 Jurusan / peran              24–28 semibold
 UIN Maulana Malik Ibrahim    14 regular, bila ada afiliasi
 Malang
 [Komunitas]                  label informatif, bukan tombol
```

Tiga komunitas mendapat afiliasi UIN Maulana Malik Ibrahim Malang dari
pernyataan pengguna. Kategori pendidikan mengikuti jenis institusi yang
tersedia: Perguruan tinggi/Sekolah kejuruan. Simtel tetap PKL. Tidak menambah
deskripsi capaian, tugas, jenjang gelar, atau masa keanggotaan yang tidak diberikan.
Kategori kecil berbingkai tipis memberi konteks, bukan wadah kartu baru.
Rata kiri, jarak kelompok 20px/12px/16px; identitas desktop cukup tinggi untuk
dua baris tanpa memaksa tinggi pada mobile. Afiliasi memakai text-wrap pretty;
tidak dipotong, di-ellipsis, atau ditampilkan hanya pada hover.

Kritik rencana: nama kampus yang panjang tidak dijadikan slogan tambahan.
Kategori dan afiliasi menjawab apa/di mana, bukan ornamen. Skala peran tetap
ringkas agar tidak kembali menjadi judul besar. Kurva, node, dan driver scroll
tidak berubah. Trigger scroll/hover -> aturan/fokus yang sudah ada -> feedback
opacity bersama seluruh isi -> reversible, tanpa loop/timer reveal baru.
Mode mobile, keyboard dan reduced motion tetap menampilkan seluruh informasi.

Referensi yang dibaca: [Adobe Spectrum, Applying the type system](https://spectrum.adobe.com/foundations/typography/applying-the-type-system)
tentang peran heading/body, angka tabular, copy ringkas dan rata kiri;
[Carbon, Type sets](https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets)
tentang skala, bobot dan utility text. Ukuran di atas merupakan adaptasi untuk
Geist/portfolio ini, bukan salinan token kedua sistem.

## Revisi aktif: jalur penerbangan ringkas (2026-11-15)

Implementasi mockup yang dipilih pengguna: satu lintasan melengkung landai,
berlian kecil, sorotan teal lokal dan identitas rata kiri. Tetap gunakan Geist
dengan permukaan #f8fbfd, kabut #eff6fb, tinta #10263b, sekunder #506477,
jalur #bfd2de dan aksen #3f8b86. Logo asli berwarna, tanpa pelat/kartu.
Nama organisasi 20–22px, tahun 13px, peran 24–28px; ikon organisasi maksimal
44px tinggi, wordmark lebar boleh 96px supaya tetap terbaca.

```text
     lengkung tipis —— ◆ —— lengkung tipis
                      |
                 [logo] Organisasi
                        Tahun
                 Jurusan / peran
```

Segmen SVG bersambung dari satu node ke node berikutnya termasuk gap antarbab;
ketinggian bergantian hanya 20px, bukan gelombang besar. Leading/trailing
segment menjangkau tepi layar. Node diukur seperti sebelumnya dan selalu
melewati sumbu fokus X yang sama. Logo Simtel asli ditambahkan sebagai WebP.

Interaksi: trigger scroll -> aturan satu MotionValue aktual yang sudah ada,
tanpa driver/spring tambahan -> feedback fokus node, isi berlian dan sorotan
dua ujung segmen melalui opacity -> reversible, berhenti saat posisi diam.
Trigger hover pointer presisi -> inner konten naik 3px dan logo scale 1.04,
halo/connector menguat -> feedback 220ms ease-out, tanpa mengubah posisi node
atau label bab -> kembali saat leave, tidak infinite. Cursor tetap normal,
karena item informatif. Touch/reduced motion tidak bergantung pada hover;
flow menampilkan konten utuh, jalur vertikal dan berlian statis.

Kritik sebelum implementasi: mockup bukan ukuran 1:1; jangan menyalin teks
besarnya. Logo yang punya wordmark tidak boleh dipaksa persegi atau dicrop.
Alih-alih menambahkan hiasan, karakter berasal dari lintasan dan hierarki
peran. Validasi visual tetap diperlukan setelah build.

## Logo organisasi (2026-11-15)

Tambahkan lima aset pengguna pada Journey, tanpa kartu atau bingkai baru.
Palet tetap #f8fbfd, #eff6fb, #dcecf6, #10263b, #506477, #3f8b86; Geist
dan hierarki teks tetap. Warna identitas logo tidak diberi filter warna.
Desktop: `node -> logo (144 x 64 contain) -> tahun -> nama -> peran`, rata
tengah. Flow/mobile memakai urutan sama rata kiri. Slot desktop kosong pada
entri tanpa logo menjaga baseline tahun sejajar, bukan logo rekaan.
Logo mengikuti opacity copy yang sudah ada; geometri node tidak diubah.
Kritik rencana: bingkai logo tambahan akan membuat timeline kembali ramai;
gunakan transparansi dan clear space saja. Logo dekoratif karena nama
organisasi tersedia tepat di bawahnya. Folder sumber belum berisi logo
teknologi Skills, sehingga ikon teknologi yang ada tetap dipakai.


## Revisi aktif: satu rail penuh dan fokus cahaya

Pengguna menolak tampilan timeline sebelumnya karena terlalu banyak teks dan
efek fokus lemah. Rencana: hapus judul besar, deskripsi, tab duplikat, instruksi,
progres bawah dan footer dari komposisi visual. Heading semantik tetap tersedia
untuk pembaca layar dan tautan lewati hanya muncul saat fokus keyboard.

Palet tetap: permukaan `#f8fbfd`, horizon `#eff6fb`, langit `#dcecf6`, tinta
`#10263b`, sekunder `#506477`, teal `#3f8b86`. Geist lokal, nama 28–40px,
tahun/peran lebih kecil. Desktop memakai satu fokus di tengah: node terpusat
di atas blok teks rata tengah, dengan dua tetangga sebagai konteks. Mobile
memakai daftar vertikal rata kiri yang utuh.

```text
                         Education -> Experience
  redup                  fokus                    redup
----o----------------------●-------------------------o-----
                         tahun
                    nama institusi
                      jurusan/peran
```

Rail memenuhi lebar viewport; pemotongan internal 1200px dihapus. Fade maksimal
40px hanya di ujung layar. Inset awal/akhir menempatkan node pertama dan terakhir
tepat pada fokus. Semua node melewati titik yang sama. Halo teal dibuat lembut
tanpa pulse, kedip atau gerak otomatis. Teks pasif memakai warna sekunder yang
tetap terbaca. Redup teks dibatasi opacity 0.74–1 pada tinta navy; animasi
hanya memakai transform/opacity, tanpa mengubah warna teks pada tiap frame.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Rail dan sorotan | Scroll aktual saat section pinned | X dan intensitas tiap node dihitung pada scheduler yang sama; intensitas menurut jarak node terhadap pusat | Halo/ukuran/opacity berubah kontinu, label bab crossfade bersama scroll | Reversibel; diam saat posisi scroll diam; tidak menambah spring/timer |
| Versi baca | Mobile/touch, reduced motion, stage tinggi atau fokus keyboard | Daftar vertikal lengkap; reset halo dan warna; link lewati terlihat hanya saat fokus | Seluruh data tetap terbaca | Lifecycle, restore/resize dan cleanup tetap dijaga |

Review sebelum build: kemewahan diletakkan pada gerak pusat dan sorotan yang
presisi. Tidak menambah kartu, aset, tekstur, angka, atau konten baru. Struktur
dua bab dan enam data asli tetap; spesifikasi ini menggantikan progres/footer
serta aturan semua node berkontras penuh pada versi horizontal sebelumnya.

Verifikasi: npm run check lulus 59 tes dan build, termasuk 13 tes timeline.
Pengujian mencakup semua node tepat pusat, intensitas simetris/kontinu, reverse,
label bab, frame pertama fullwidth, resize/restore, fallback dan cleanup.
SSR memverifikasi penghapusan chrome visual serta heading/data tetap utuh.
Perhitungan warna teks pasif menghasilkan kontras sekitar 6.53:1 terhadap
#f8fbfd; ini perhitungan warna, bukan pengujian browser. Preview lokal melayani
komponen dan CSS terbaru (HTTP 200). QA visual desktop/375px, keyboard/reduced
motion langsung dan FPS belum tersedia karena browser access host tidak aktif.

## Education & Experience: jalur horizontal dua bab

Brief disetujui: section setelah About dan sebelum Skills, memakai dua entri
pendidikan serta empat pengalaman asli yang diberikan pengguna. Logo menyusul;
gunakan titik jalur dan nama lengkap tanpa logo rekaan. Setiap bab memakai
urutan terbaru dahulu; tiga pengalaman 2025 mengikuti urutan yang diberikan.
Jalur menjelaskan urutan baca dua kategori, bukan skala tahun lintas kategori.

Token: permukaan `#f8fbfd`, horizon `#eff6fb`, langit `#dcecf6`, tinta
`#10263b`, sekunder `#506477`, aksen teal `#3f8b86`. Geist lokal 500 untuk
judul/nama, 400 untuk peran/tahun. Teks rata kiri, nama boleh membungkus penuh.

```text
Education & Experience          Education / Experience

Education                       Experience
o----------------o--------------o-----------o-----------o-----------o
UIN              SMKN 2         GDGoC       Mocap       Weboender   PT Solusi...
program + tahun                 peran + tahun                       magang

scroll turun -> jalur ke kiri -> entri terakhir -> lanjut ke Skills
mobile / reduced motion: dua daftar vertikal dengan garis sambung
```

Review sebelum build: gunakan satu garis sebagai pengikat informasi, tanpa
kartu seragam, efek logo kosong, atau latar kontur gelap dari referensi.
Desktop memperlihatkan sekitar dua hingga tiga entri sekaligus. Sticky hanya
di layar desktop pointer presisi yang cukup tinggi; jarak scroll mengikuti
lebar konten agar fase ini ringkas. Semua isi tetap memiliki kontras penuh.
Navigasi Journey menuju section asli; menu mobile menyesuaikan empat tujuan.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Jalur horizontal | Posisi scroll aktual saat section mencapai area baca | Satu MotionValue scroll dari App, frame update Motion; transform X dari 0 ke ujung rail, tanpa wheel handler/smoothing baru | Garis progres dan titik aktif menandai posisi baca; heading bab jelas | Reversible dan berhenti saat scroll aktual diam; setelah selesai sticky lepas |
| Fallback baca | Touch/mobile, reduced motion, stage terlalu tinggi, fokus keyboard | Tampilkan dua daftar vertikal lengkap; lepaskan pin dan transform | Semua entri dapat dibaca tanpa gestur horizontal atau teks terpotong | Cleanup, resize/restore dan StrictMode dijaga; keyboard tidak terjebak |

Implementasi: satu rail menghubungkan enam titik, dengan label bab dan progres
dekoratif. Navbar memiliki empat tujuan; mobile memakai ikon di atas label dan
area sentuh minimal 44px. Marker Portfolio disembunyikan pada <=960px agar pill
tetap terpusat. Fokus keyboard melatch versi vertikal untuk masa hidup komponen.

Verifikasi: npm run check lulus 55 tes dan build. Sembilan tes controller baru
mencakup midpoint/reverse/end, restore/resize saat pinned, tanpa pembacaan layout
pada scroll, fallback, visibilitas, fokus dan cleanup. SSR memeriksa enam entri,
urutan section, target Journey dan data asli. HTTP preview menyajikan komponen,
controller serta data terbaru. QA visual desktop/375px, keyboard/reduced motion
langsung dan FPS belum tersedia karena browser access host tidak dapat diakses.

## Penyesuaian aktif: keseimbangan optik teks About

Screenshot pengguna memperlihatkan ruang kosong kiri foto jauh lebih lebar
daripada kanan, meskipun grid/foto terpusat dan kedua CTA hampir sejajar.
Rencana: identitas desktop mengikuti lebar intrinsik isi dan merapat ke sisi
foto; grid luar tetap sama. Judul maksimum 64px menggantikan 72px, seluruhnya
satu warna. Heading kanan memakai measure 18ch dengan balanced wrapping,
paragraf line-height 1.75 dan sela 16px. Tinggi panel mengikuti konten.

Token tetap: langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`, tinta
`#10263b`, sekunder `#506477`, teal `#3f8b86`. Geist lokal tetap; seluruh teks
rata kiri. Mobile kembali ke lebar penuh dengan urutan foto/identitas/biografi.

```text
       identitas -> [celah] FOTO [celah] <- biografi
       judul lebih ringan             ritme baca teratur
       CV tetap utama                 eksplorasi sekunder
```

Review sebelum build: keseimbangan berasal dari jarak terhadap foto dan bobot
huruf, tanpa menambah dekorasi, konten rekaan, panel berketinggian tetap, atau
translasi layout. Wrapper yang diukur mengikuti ukuran isi agar ruang aman
reveal tetap benar. Foto tetap menjadi pusat dan jalur scroll tetap sama.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Reveal dua panel (dipertahankan) | Scroll aktual setelah foto tiba | Satu progres, arah keluar, jarak dibatasi celah wrapper baru | Kedua panel tiba bersama pada komposisi yang lebih seimbang | Reversibel; fokus/reduced motion penuh, mobile flow dan jarak pendek |

Implementasi memakai width fit-content pada wrapper identitas desktop serta
justify-self end; <=960px kembali width 100%. Judul mobile maksimum 50px.
Verifikasi: npm run check lulus 46 tes dan build; HTTP preview menyajikan CSS
terbaru. Pemeriksaan visual akhir desktop/375px, keyboard dan reduced motion
belum dapat dilakukan karena browser access host tidak tersedia. Penilaian
ketimpangan awal bersumber dari screenshot pengguna; hasil akhir belum diamati.

## Revisi aktif: satu langit, foto terpusat, burung mengepak

Arahan: gunakan komposisi referensi tiga kolom dengan identitas/CV di kiri,
foto di tengah, dan biografi/tautan eksplorasi di kanan. Pertahankan tema langit
Rafi, bukan latar gelap dari referensi. Bagian historis di bawah merekam tahap
lama; rencana ini menggantikan foto akhir di kanan dan reveal bermask.

Token: langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`, tinta
`#10263b`, sekunder `#506477`, aksen `#3f8b86`. Geist lokal untuk seluruh teks;
nama besar satu warna, paragraf ringkas rata kiri, panjang baris sekitar 32–40ch.

```text
       satu langit berkelanjutan dari Hero hingga About
Halo, saya      foto turun lurus      Membuat AI lebih
Rafi.           lalu menetap          mudah digunakan.
AI Engineer     di tengah            dua paragraf ringkas
[Unduh CV PDF]                       [Lihat eksplorasi]
    <- identitas membuka       biografi membuka ->

mobile: foto -> identitas/CV -> biografi/eksplorasi
```

Review sebelum build: fokus utama adalah foto pribadi yang menghubungkan Hero
dan About. Dua kolom luar sama lebar menjaga pusat foto. Awan memudar pada
wrapper diam, seluruh warna dasar berasal dari parent sehingga tidak ada dua
bidang warna yang beradu. Hapus bingkai arch dominan dan mask teks; kedalaman
tetap lembut melalui cahaya/bayangan. Hindari menyalin pola kontur gelap,
dekorasi tambahan, atau klaim proyek yang tidak tersedia.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Perjalanan foto | Posisi scroll aktual bersama berubah | Turun ke anchor tengah, kemudian tetap di tengah saat kedua kolom membuka; tanpa spring tambahan | Foto mengikat kedua section dengan gerak yang dapat dibalik | Scroll balik membalik seluruh fase; flow untuk konten tinggi/mobile, reduced motion statis |
| Identitas dan bio | Fase setelah foto tiba | Gerak keluar pendek maksimal 48px desktop/20px touch, dibatasi celah foto, opacity bersama; tanpa mask atau stagger per huruf | Dua sisi muncul utuh tanpa tepi potong | Diam saat scroll aktual diam; fokus keyboard menampilkan seluruh konten dan fallback foto |
| Burung | About terlihat dan tab aktif | Empat burung independen menghadap kanan, melaju ke kanan, berganti bentuk sayap antara melayang/kepakan | Atmosfer lebih hidup tanpa mengalahkan foto/teks | Infinite dengan reset di luar area; dua mobile, offscreen/hidden pause, reduced motion statis |

Verifikasi implementasi: npm run check lulus 46 tes dan build; source render
dan aset baru tersaji melalui preview lokal. Sprite telah dirender dan diperiksa.
Verifikasi visual halaman desktop, mobile 375px, keyboard, reduced motion serta
FPS belum tersedia karena browser access host tidak dapat diakses. Hasil tes
sumber dan simulasi controller bukan bukti kelancaran visual perangkat nyata.

## Tombol CV dan penerbangan burung berulang

Revisi pengguna: ganti tautan ke Skills dengan tombol Unduh CV dan biarkan
burung bergerak berulang saat halaman diam. Palet tetap: tinta `#10263b`, putih
`#f8fbfd`, sekunder `#506477`, langit `#dcecf6`, horizon `#eff6fb`, teal
`#3f8b86`. Geist tetap. Tombol navy, ikon unduh outline 20px, tinggi minimal
48px, radius 14px, label jelas; biografi/foto tetap fokus.

Pengguna memberikan PDF CV asli dari Downloads. Salinan identik disimpan pada
public/documents/Rahmat-Rafi-Indrayani-CV.pdf. Konfigurasi resume berada pada
src/data/portfolio.js; anchor download native aktif dengan nama file yang sesuai.
Tidak membuat CV baru, unduhan kosong, link #, atau profil profesional rekaan.

Burung memakai satu animasi transform CSS 44 detik desktop/48 detik mobile.
Seluruh kawanan keluar area sebelum kembali ke awal sehingga reset tersembunyi.
Tidak ada kepakan cepat, pantulan, atau scroll progress untuk posisi burung lagi.
Lifecycle memakai helper visibilitas awan yang sudah ada: section visible,
tab visible, no reduced motion. Cleanup menghentikan loop; reduced motion
menampilkan komposisi burung statis. Tidak menambah scheduler JS atau dependency.

```text
judul + biografi       langit: kawanan melintas perlahan -> keluar -> ulang
[ikon Unduh CV]        foto tetap menjalani dua fase scroll
PDF asli pengguna     (unduhan native, tanpa halaman perantara)
```

Review: satu kawanan kecil menjadi atmosfer pendukung. Tombol memberi tujuan
nyata untuk pengunjung dan memakai PDF asli yang telah diberikan pengguna.
Gerak background dipisah dari scrub foto agar burung tetap hidup saat membaca,
sementara foto/teks tetap sinkron dengan posisi scroll yang sama.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Unduh CV | Klik/keyboard | Anchor native download ke PDF asli | Fokus jelas, hover/press singkat | Reduced motion meniadakan transisi; tidak ada unduhan palsu |
| Penerbangan | About terlihat dan tab aktif | Satu flock bergerak konstan melintasi area, reset saat keluar | Langit hidup tanpa menutup teks/wajah | Infinite; paused offscreen/hidden, statis reduced motion; tiga burung mobile |

Verifikasi: 43 tes dan build lulus. Salinan CV identik dengan sumber menurut
SHA-256; endpoint HTTP melayani application/pdf 131.722 byte. Source/tes
memverifikasi native download serta lifecycle yang dipakai burung. Kelancaran
loop dan komposisi desktop/mobile belum diperiksa langsung karena host browser
tidak tersedia. Rencana scroll burung pada tahap sebelumnya di bawah digantikan.

## Langit terbuka dan tipografi About

Arahan yang disetujui: sambungkan awan Hero ke langit terbuka About dengan satu
kawanan kecil burung natural. Desktop enam burung, mobile tiga burung, dari aset
fotografis transparan hasil built-in imagegen. Foto pribadi tetap fokus utama.

Token: horizon `#eff6fb`, langit pucat `#dcecf6`, permukaan `#f8fbfd`, tinta
`#10263b`, sekunder `#506477`, aksen `#3f8b86`. Geist 500 untuk judul tiga baris
?Membuat AI / lebih mudah / digunakan.?, 400 untuk dua paragraf ringkas. Judul
64?80px desktop, adaptif mobile; seluruh judul satu warna dan satu bidang gerak.
Teks rata kiri, jarak baris rapat, body maksimal sekitar 40 karakter per baris.

```text
                langit + kawanan kecil bergerak mengikuti scroll
Membuat AI                              foto
lebih mudah                             Rafi
digunakan.                              berakhir di kanan
bio singkat + tautan                     (di atas bio pada mobile)
```

Review: karakter berasal dari kelanjutan suasana langit dan tujuan kerja AI
Rafi. Kawanan di atas komposisi, menjauhi wajah dan paragraf; tidak ada kartu,
angka, kata dekoratif besar, kepakan berulang, font tambahan, atau loop baru.
Burung menambah kedalaman tanpa mengambil alih gerak utama foto dan cerita.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Kawanan | Scroll perjalanan About | Satu MotionValue progres bersama foto/cerita menggeser flock perlahan ke kanan/atas | Langit terasa berlapis | Reversible, berhenti saat scroll aktual diam; touch jarak lebih pendek, reduced motion statis |
| Cerita | Fase mendatar foto | Reveal satu blok tetap; mask dilepas sepenuhnya di endpoint | Judul dan seluruh paragraf terbaca jelas setelah tiba | Scroll naik mengembalikan mask; fokus/reduced motion langsung terbaca |

Aset disimpan di assets/source dan WebP runtime di public/images; satu picture
memilih varian mobile sehingga tidak merender dua kawanan bersamaan. Wrapper
burung absolut tidak mengubah slot ukur portrait atau tinggi stage.
Verifikasi implementasi: 43 tes dan build produksi lulus, termasuk reverse,
mask endpoint, alpha/budget gambar, judul semantik, dan pilihan mobile. Aset
diperiksa langsung; HTTP menyajikan kode/gambar terbaru. QA visual halaman,
keyboard/reduced motion langsung, serta FPS belum tersedia karena host browser
tidak dapat diakses.

## Scroll halus dengan Framer Motion dan Lenis

Pengguna menyetujui Lenis untuk menghaluskan scroll halaman dan Framer Motion
untuk perjalanan foto serta cerita. Persetujuan ini mencakup perlambatan singkat
setelah input roda mouse berhenti; animasi tetap berhenti ketika posisi scroll
aktual telah diam. Tidak ada spring tambahan atau smoothing terpisah pada foto.

Palet tetap: langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`, tinta
`#10263b`, sekunder `#506477`, teal `#3f8b86`. Geist lokal, hierarki heading,
biografi, mask lembut, dan susunan akhir desktop/mobile tetap. Fokus perubahan
adalah kesinambungan gerak, bukan dekorasi atau perombakan halaman.

```text
wheel -> Lenis -> scroll aktual -> MotionValue bersama
                                  | foto: turun -> kanan
                                  | cerita: keluar ke kiri
```

Lenis diperbarui pada fase read scheduler Motion. Posisi scroll aktual memberi
satu MotionValue; geometri perjalanan dihitung pada fase update dan Motion
menulis transform/opacity pada fase render yang sama. Mask memakai MotionValue
pada custom property. Tidak memakai listener scroll dan loop animasi tambahan
untuk perjalanan yang sama. CSS smooth scroll anchor dinonaktifkan selama Lenis
aktif agar tidak ada dua pengendali pergerakan halaman.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Scroll halaman | Wheel/trackpad | Lenis satu smoothing pendek tanpa pantulan; mengikuti posisi aktual | Seluruh halaman mengalir dan melambat saat tiba | Touch tetap native, keyboard/anchor tetap berfungsi; reduced motion memakai native tanpa smoothing |
| Foto dan cerita | MotionValue scroll berubah | Satu progres mengendalikan foto dan teks; Motion menulis transform/opacity | Gerak dua fase dan reveal gradasi tetap sinkron | Scroll balik membalik urutan; tidak ada spring pengejar kedua |
| Aksesibilitas dan lifecycle | Fokus, tab hidden, reduced motion, resize | Fokus menampilkan cerita penuh; hidden melepas scheduler aktif; cleanup listener/Lenis/Motion | Konten dapat diakses dan animasi tidak berjalan di latar | Mode berubah saat runtime, restore serta StrictMode tetap ditangani |

Review sebelum implementasi: sumber kelancaran berasal dari satu aliran scroll
serta satu scheduler. Menambah spring pada setiap elemen justru dapat membuat
foto tertinggal dari halaman, sehingga tidak dipakai. Jarak serta layout yang
sudah disetujui dipertahankan. Keberhasilan visual dan FPS perlu diuji langsung;
tes logika dan build tidak cukup untuk menjamin nol getaran di semua perangkat.
Implementasi lulus 41 tes dan build produksi; preview lokal menyajikan perubahan.
Back/Forward melepas momentum lama dan menyinkronkan target Lenis setelah native
restoration. Pemeriksaan visual desktop/mobile dan FPS masih belum tersedia.

## Stabilisasi foto dan reveal yang lembut

Keluhan pengguna: foto terasa bergetar dan garis potong teks terlalu jelas.
Pemeriksaan source menemukan kompensasi native scroll pada traveler di dalam
Hero, bersamaan dengan stage CSS sticky, serta clip-path biner pada cerita.
Perbedaan pembaruan scroll dan JavaScript merupakan kemungkinan sumber getaran;
profiling visual belum tersedia. Garis potong keras memang ada pada kode.

Rencana: pertahankan langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`,
tinta `#10263b`, sekunder `#506477`, teal `#3f8b86`, dan Geist. Layout akhir serta
dua fase tetap. Traveler dekoratif berpindah ke overlay fixed di luar scene
Hero; anchor tetap diam dan foto utama Hero tetap memberi alt serta fallback.
Koordinat foto dihitung langsung dalam ruang viewport. Bidang wajah tidak lagi
memakai rotasi dinamis atau translateZ; arch, rim, dan bayangan memberi kedalaman.

```text
anchor Hero (diam)       overlay foto (koordinat viewport)
          turun lurus -> geser kanan
About: cerita lembut ke kiri | slot foto akhir
```

Tepi cerita memakai mask gradasi tanpa blur huruf. Feather lebih pendek di touch
dan menyusut ke nol setelah cerita tiba, agar teks akhir tetap sepenuhnya jelas.
Review rencana: keanggunan berasal dari posisi yang stabil, kedalaman tenang,
dan transisi optik yang halus. Tidak menambah efek, dependency, atau animasi
pengejar yang terus berjalan setelah posisi scroll berhenti.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Foto stabil | Posisi scroll berubah | Satu koordinat viewport untuk traveler di luar containing block Hero; posisi tetap diperbarui setelah fase selesai | Foto tetap setinggi stage pada fase mendatar, lalu keluar bersama About | Reversible, tanpa spring/lerp lanjutan; offscreen/hidden/reduced motion ditangani |
| Reveal optik | Foto dan cerita bergerak berlawanan | Alpha teks melandai sebelum tepi foto dan wrapper; feather hilang di posisi akhir | Huruf berangsur jelas tanpa garis potong keras | Progress bersama scroll, feather touch lebih pendek, fokus/reduced motion menghapus mask |

Aturan di bawah tentang traveler dalam Hero, rotasi wajah, serta hard clip
digantikan oleh revisi ini; urutan gerak, konten, dan susunan akhir tetap berlaku.

## Portrait yang membuka cerita About

Revisi terbaru: foto turun lurus sampai posisi akhir vertikal di area komposisi
About. Scroll berikutnya menggeser foto ke kanan sambil cerita keluar dari
belakang foto menuju kiri. Semua posisi berasal dari scroll native: berhenti
ketika posisi scroll diam, lalu kembali melalui jalur yang sama saat scroll naik.

Rencana token tetap: langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`,
tinta `#10263b`, teks sekunder `#506477`, dan aksen teal `#3f8b86`. Geist lokal
memakai bobot 500 untuk heading dan 400 untuk biografi. Heading besar dan teks
rata kiri dipertahankan; tidak menambah font, warna, ornamen, atau isi.

Komposisi desktop memakai runway scroll dengan stage yang ditahan selama fase
mendatar. Foto mencapai bagian bawah area fotonya dahulu; X tetap nol selama
fase vertikal. Cerita menjadi satu bidang yang bergerak ke kiri, dengan mask
pada wrapper diam yang menjaga lapisan depan foto. Stagger enam bagian dan
lipatan judul dihapus agar hubungan foto-cerita menjadi satu gerak yang jelas.
Pada layar pendek, zoom, atau susunan mobile yang terlalu tinggi, aliran vertikal
konten dipertahankan dan rentang geraknya dipendekkan. Foto akhir berada di atas
biografi pada <=960px; teks tidak dipaksa menjadi kolom sempit di samping foto.

```text
Desktop                         Mobile / konten tinggi
          foto Hero                    foto Hero
              turun lurus                 turun lurus
      cerita di belakang foto      foto tiba di area About
cerita keluar ke kiri | foto kanan    geser pendek + cerita muncul
      stage dilepas ke lab             biografi mengalir ke bawah
```

Review sebelum implementasi: karakter utamanya perjalanan foto pribadi Rafi,
bukan kumpulan efek reveal terpisah. Tambahan ruang scroll membuat fase mendatar
terlihat tanpa membuat foto keluar viewport dahulu. Kurva posisi yang lembut
dan rentang yang cukup dipilih untuk mengurangi kekakuan; tidak memakai animasi
pengejar yang masih berjalan setelah posisi scroll berhenti. Hasil rasa gerak
harus dinilai lewat preview, bukan disimpulkan dari build atau tes simulasi.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Turun lurus | Scroll Hero menuju About | X nol; skala seragam mencapai tujuan vertikal sebelum membuka cerita | Foto tiba di bawah area komposisi | Reversible; tidak autoplay |
| Membuka cerita | Scroll setelah foto tiba | Foto ke kanan, cerita satu blok ke kiri, mask mengikuti ruang foto; stage ditahan bila muat | Cerita terasa keluar dari belakang foto | Progres berhenti bersama posisi scroll; scroll naik menutup kembali |
| Tampilan adaptif | Ukuran layar/font/input berubah | Ukur ulang slot, runway, dan stage; mobile/konten tinggi memakai fase lebih pendek dan flow native | Foto dan teks tidak terpotong atau dipaksa dua kolom | Tidak membaca layout pada setiap scroll; tab hidden membatalkan frame |
| Akses konten | Fokus keyboard / reduced motion | Hilangkan mask, opacity, dan translasi cerita; reduced motion juga melepas pin dan runway | Konten serta tautan langsung terbaca | Dua foto statis sebagai fallback; salinan About dekoratif |

Sentuhan 3D dibatasi pada arch/rim/bayangan; bidang wajah tetap datar tanpa
rotasi dinamis. Tidak menambah WebGL atau dependency. Pengantar
Hero mendahului scene di bawah 1280px agar lintasan bebas dari teks dan tombol.
Saat fokus keyboard berada pada cerita/section About, traveler disembunyikan
sementara dan foto dekoratif About ditampilkan agar teks serta fokus tidak
tertutup lapisan Hero. Runway memakai spacer `::after` dalam normal flow untuk
memberi stage ruang sticky. Pemeriksaan akhir lulus 34 tes dan build; perilaku
visual, keyboard langsung, dan FPS belum diperiksa karena host browser tidak tersedia.

## Cerita dan lab eksplorasi

Brief 15 November 2026: About lebih ekspresif dan interaktif, dilanjutkan lab
eksplorasi dengan data dummy yang diizinkan pengguna. Sasaran: pengunjung
portofolio memahami cara berpikir Rafi, teknologi, dan contoh kemungkinan
penerapannya. Kartu proses dari rancangan pertama diganti dengan perjalanan
foto yang dijelaskan di atas; navbar serta konten lab tetap.

About memakai heading besar rata kiri, biografi asli, dan portrait yang
menghubungkannya dengan Hero. Lab memakai navy dari tinta yang sama, tiga
konsep demo, dan toolkit asli. Kontras terang/gelap menandai peralihan
dari cerita pribadi ke eksplorasi, tanpa menambah palet yang terlepas dari hero.

```text
Desktop                                Mobile
About: heading + biografi | foto        foto
         tautan ke lab                 heading + biografi + tautan
Lab: judul + pemberitahuan dummy        judul + pemberitahuan dummy
     toolkit 6 teknologi               toolkit membungkus
     Atlas: teks | preview             Atlas: teks + preview
     Flowdesk    | Sinyal              Flowdesk, lalu Sinyal
```

Review rencana: grid kartu seragam dan angka pencapaian tidak menjelaskan
kepribadian atau kemampuan. About mengutamakan cerita dan foto pribadi; lab
memakai hierarki satu contoh utama dan dua pendamping.
Tidak memakai persentase penguasaan atau hasil proyek rekaan. Label dummy tampil
pada pengantar dan tiap konsep; detail menjelaskan contoh, bukan studi kasus asli.

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Reveal lab | Kelompok konten masuk viewport | Observer per kelompok, tampil sekali | Opacity dan translasi pendek | Tidak berulang; langsung terbaca pada reduced motion/tanpa observer; fokus menampilkan konten |
| Konsep lab | Buka summary native | Konten detail berada dalam kartu | Ikon buka/tutup serta detail contoh | Tidak berulang; tidak bergantung pada animasi |
| Aksi ke lab | Hover/fokus/tekan atau aktivasi link | Target #skills nyata, scroll native | Fokus jelas dan respons tekan | Reduced motion memakai perpindahan langsung |

Pencarian UI UX Pro Max yang relevan: domain UX `scroll animation reduced
motion` menekankan final state terbaca dan larangan scroll-jacking. Panduan
React untuk HTML semantik dipakai untuk kontrol native. Tidak ada dependency
animasi atau layanan AI yang ditambahkan.

## Arah yang disetujui

Portofolio AI Engineer dengan hero satu layar, portrait sebagai fokus utama,
awan fotografis transparan yang bergerak lambat, dan navbar floating berikon.
Penambahan tekstur menguatkan identitas langit; gerak navbar hanya merespons
interaksi. Projects/Contact tetap tersembunyi sampai data asli tersedia.

Token inti: langit `#9dcbea`, horizon `#eff6fb`, permukaan `#f8fbfd`, tinta
`#10263b`, teks sekunder `#506477`, aksen `#3f8b86`. Geist lokal digunakan untuk
heading, isi, dan navigasi. Tidak ada font, warna aksen, atau klaim baru.

## Komposisi dan responsivitas

Hero menargetkan tinggi viewport melalui fallback `100vh`, `100svh`, `100dvh`.
Konten dapat membuatnya lebih tinggi pada layar pendek/teks besar. Heading dan
pengantar dalam flow, scene mengisi ruang tersisa. Di >=1280px, scene dan
pengantar berbagi baris grid; pengantar rata kiri dan tetap ikut menentukan
tinggi baris. Pada ukuran lebih kecil, heading/pengantar/scene tersusun vertikal
serta rata tengah. Ini memberi koridor bebas teks untuk perjalanan foto.

```text
Desktop lebar                       Mobile
Portfolio [R Home About Skills]     [R Home About Skills]
          Saya Rafi.                      Saya Rafi.
          AI Engineer                    AI Engineer
   awan logo portrait logo             pengantar + aksi
pengantar    portrait                   logo portrait logo
[Tentang saya]                            portrait
```

Scene memakai ukuran minimum eksplisit dan size containment; portrait/halo
menyesuaikan tinggi serta lebar container. Posisi vertikal kartu dikonversi ke
persentase scene dari parameter historis. Portrait maksimal 397px desktop lebar,
340px tablet, 250px mobile; ukuran aktual dapat mengecil mengikuti ruang.
Heading hero maksimal 124px desktop/58px mobile. About memakai dua kolom cerita
dan foto di desktop, lalu foto di atas cerita pada <=960px. Slot tujuan maksimal
360px desktop/300px tablet/260px mobile; uniform fit dapat mengecilkan foto
di dalamnya. Caption dan preview lab mengikuti flow agar teks dapat memperbesar
tinggi. Lab memiliki toolkit yang
membungkus, satu feature lebar, dan dua konsep pendamping; kartu menjadi satu
kolom pada mobile. Detail native dapat menambah tinggi tanpa batas tetap.

Review arah: mempertahankan foto asli, biru langit, dan hierarki yang ada. Ikon
rumah/orang/lapisan membantu mengenali menu, sementara label tetap tampil dan
boleh membungkus ketika teks diperbesar. Tidak menambah badge, angka rekaan,
warna aksen, atau gerak navbar tanpa pemicu.

## Motion dan interaksi

| Interaksi | Trigger | Rules | Feedback | Loops & modes |
| --- | --- | --- | --- | --- |
| Awan | Hero terlihat, tab aktif | Dua lapisan bertile dengan periode berbeda | Drift horizontal sangat lambat | Infinite; otomatis berhenti saat offscreen/hidden/reduced motion |
| Navbar | Hover, fokus, tekan | Label+ikon tetap dalam target minimal 44px | Lapisan hover 150ms, pressed 90ms, ikon bergeser/berotasi kecil | Sementara; reduced motion langsung |
| Indikator aktif | Section baca berubah | Mengikuti posisi baca/akhir halaman | Pergeseran indikator 240ms | Hanya saat status berubah; reduced motion langsung |
| Parallax | Scroll/pointer desktop | Peredaman berdasarkan waktu, amplitudo dibatasi | Kedalaman ringan pada kartu/halo/latar | Berhenti saat stabil; nonaktif mobile/reduced motion |
| Entrance | Kunjungan awal di atas | Wrapper terpisah, transform/opacity | Kartu muncul 560ms | Sekali; nonaktif mobile/reduced motion |

Periode awan jauh/dekat: desktop 110/78 detik, mobile 150/110 detik. Dua tile
identik per lapisan dan mask tepi menyamarkan sambungan siklus. Pengguna secara
eksplisit mengizinkan drift awan di mobile; pembatasan parallax mobile tetap ada.
Jangan mengartikan mobile sebagai semua animasi berhenti. Pada reduced motion,
awan tetap terlihat statis dan seluruh gerak/transisi terkait dinonaktifkan.

## Aset dan aksesibilitas

Awan memakai WebP transparan 1000px/2000px dari PNG hasil built-in imagegen;
lihat [ASSETS.md](ASSETS.md) untuk prompt dan provenance. PNG sumber di luar
public; runtime tidak memuat sumber besar. Portrait tetap memakai varian WebP.

Pertahankan label navigasi, fokus keyboard, skip link, teks alternatif portrait,
heading semantik, dan scroll padding untuk header fixed. Ikon di samping label
serta awan bersifat dekoratif dan tidak diumumkan pembaca layar. Scroll halaman
tetap native. Gunakan cleanup untuk listener/observer/frame dan hormati
perubahan preferensi reduced motion saat halaman sedang terbuka.

Source dan lifecycle diuji otomatis. Komposisi visual, text zoom, serta kenyamanan
gerak/FPS masih memerlukan pemeriksaan browser dan perangkat sebenarnya.
