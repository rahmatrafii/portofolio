# Alur vibe coding

## Mulai tugas

1. Baca `AGENTS.md`, konteks tugas, dan file terkait. Untuk orientasi awal, baca
   `docs/ARCHITECTURE.md` dan `docs/TASKS.md`.
2. Tentukan hasil yang diminta, batas scope, dan skill sesuai `docs/SKILLS.md`.
   Baca `SKILL.md` yang dipilih sebelum mengubah kode.
3. Kerjakan perubahan lengkap yang paling sederhana. Pertahankan desain bila
   pengguna tidak meminta redesign. Tanyakan hanya informasi yang menghalangi
   hasil benar, misalnya email tujuan untuk Contact.

## Selesaikan tugas

1. Jalankan `npm run check`. Untuk perubahan konten/desain baru, evaluasi apakah
   assertion migrasi yang terkait masih berlaku; jangan mengubah baseline HTML.
2. Untuk UI, jalankan `npm run dev` dan cek desktop, 375px, landscape, keyboard,
   serta reduced motion jika fasilitas browser tersedia. Perhatikan overflow,
   visibilitas teks, loading aset, dan error console.
3. Perbarui dokumen yang terdampak dan catatan perubahan penting. Sebutkan hasil
   tes yang nyata dan pemeriksaan yang masih tertunda.

## Contoh prompt

### Fitur

> Baca AGENTS.md dan gunakan skill yang sesuai. Buat [fitur] untuk [tujuan].
> Pertahankan [bagian desain/perilaku]. Gunakan data [sumber]. Selesai jika
> [kriteria penerimaan]. Jalankan pemeriksaan dan laporkan hasilnya.

### Perbaikan bug

> Saat [langkah reproduksi] di [ukuran layar/browser], yang terjadi [aktual].
> Seharusnya [harapan]. Cari akar masalah, perbaiki dengan perubahan kecil,
> pertahankan perilaku lain, dan verifikasi sesuai AGENTS.md.

### Review tanpa edit

> Review [bagian/file] sebagai senior UI/UX designer. Sebutkan yang bekerja,
> masalah beserta dampaknya, dan urutan perbaikan konkret. Bedakan observasi
> dari dugaan. Jangan ubah kode.

### Melanjutkan sesi

> Baca AGENTS.md, docs/ARCHITECTURE.md, dan docs/TASKS.md. Lanjutkan tugas
> [nama], gunakan skill relevan, lalu perbarui status dan hasil verifikasinya.

Tidak perlu mengulang seluruh konteks proyek pada setiap prompt; tulis hasil yang
diinginkan dan batas yang penting. Dokumentasi menjadi peta, kode menjadi acuan
perilaku sebenarnya.
