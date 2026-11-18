# Skill lokal untuk proyek

Inventaris diperbarui 18 November 2026. Sumber personal berada di
`C:/Users/rafi/.config/opencode/skills/`, `C:/Users/rafi/.opencode/skills/`, dan
`C:/Users/rafi/.codex/skills/`.
Ponytail juga ditemukan dalam cache plugin Codex versi 5.3.2. Keberadaan berkas
tidak selalu berarti host sedang menampilkannya sebagai slash command.

## Routing wajib

| Tugas | Skill yang dibaca/digunakan |
| --- | --- |
| Setiap perubahan kode, config, dependency, tes | `ponytail` |
| HTML, CSS, JSX/komponen UI, JavaScript sisi klien | `ponytail` + `modern-web-guidance`; search/retrieve sebelum implementasi |
| UI, komponen, CSS, copy, motion, responsivitas, aksesibilitas | Otomatis tambahkan `ui-ux-pro-max` + `anti-slop-design` |
| Arah visual/desain baru | Tambahkan `frontend-design` |
| Animasi, transisi, feedback interaksi | Tambahkan `micro-interactions` |
| Review perubahan saja | `ponytail-review`; jangan edit tanpa permintaan |
| Audit repo saja | `ponytail-audit`; jangan edit tanpa permintaan |
| Perancangan batas modul | `codebase-design` |
| Evaluasi gaya visual generik | `anti-slop-design`; `design-taste-frontend` sebagai tambahan sesuai kebutuhan |
| Fondasi design system/brand | `design-system` atau `brand` sesuai kebutuhan |

Skill tambahan yang ditemukan mencakup `caveman`, `banner-design`, `design`,
`slides`, dan `ui-styling`. Baca metadata dan instruksi aslinya jika tugas
membutuhkannya. Keberadaan skill bukan alasan menambah pekerjaan di luar scope.

## Discovery lokal

Enam junction proyek menghubungkan instalasi yang sudah ada, tanpa menyalin atau
mengubah isi skill:

| Entry `.agents/skills/` | Sumber |
| --- | --- |
| `ponytail` | `C:/Users/rafi/.config/opencode/skills/ponytail` |
| `ui-ux-pro-max` | `C:/Users/rafi/.opencode/skills/ui-ux-pro-max` |
| `frontend-design` | `C:/Users/rafi/.config/opencode/skills/frontend-design` |
| `micro-interactions` | `C:/Users/rafi/.config/opencode/skills/micro-interactions` |
| `modern-web-guidance` | `C:/Users/rafi/.codex/skills/modern-web-guidance` |
| `anti-slop-design` | `C:/Users/rafi/.config/opencode/skills/anti-slop-design` |

Skill review/audit dan skill personal lain dapat dibaca dari direktori sumber
di atas. Skill plugin seperti Figma, Sites, atau imagegen dipilih hanya ketika
permintaan memerlukan kemampuannya; ikuti prerequisite masing-masing.

Pada redesign koleksi 16 November 2026, anti-slop-design ditemukan dan dibaca
di `C:/Users/rafi/.config/opencode/skills/anti-slop-design/SKILL.md` beserta
referensi arah produk, komponen dan pre-emit checklist. Tidak perlu instalasi
ulang atau perubahan konfigurasi global untuk menggunakannya.

Untuk memulihkan junction pada laptop ini, jalankan di root proyek (PowerShell):

```powershell
$links = @{
  'ponytail' = "$env:USERPROFILE/.config/opencode/skills/ponytail"
  'ui-ux-pro-max' = "$env:USERPROFILE/.opencode/skills/ui-ux-pro-max"
  'frontend-design' = "$env:USERPROFILE/.config/opencode/skills/frontend-design"
  'micro-interactions' = "$env:USERPROFILE/.config/opencode/skills/micro-interactions"
  'modern-web-guidance' = "$env:USERPROFILE/.codex/skills/modern-web-guidance"
  'anti-slop-design' = "$env:USERPROFILE/.config/opencode/skills/anti-slop-design"
}
New-Item -ItemType Directory -Path .agents/skills -Force | Out-Null
foreach ($name in $links.Keys) {
  $entry = Join-Path .agents/skills $name
  if ((Test-Path "$($links[$name])/SKILL.md") -and !(Test-Path $entry)) {
    New-Item -ItemType Junction -Path $entry -Target $links[$name]
  }
}
```

Di komputer lain, sesuaikan lokasi dengan instalasi sebenarnya. Junction masuk
`.gitignore` karena menunjuk lokasi di luar repo. Jika host menampilkan skill
bernama sama dua kali, gunakan satu sumber yang terverifikasi; jangan membuat
salinan tambahan. Jika skill baru belum muncul, mulai ulang sesi Codex.

## Menggunakan Modern Web Guidance

Sumber resmi: [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance).
`AGENTS.md` mewajibkan skill ini untuk pekerjaan web sisi klien tanpa perlu
diminta lagi. Baca `.agents/skills/modern-web-guidance/SKILL.md`, jalankan
`search` dengan query Inggris yang spesifik, lalu `retrieve` ID panduan relevan
sebelum menulis kode. Jika hasil pencarian tidak relevan, ikuti alur pencarian
ulang/fallback di skill; jangan mengambil panduan yang tidak sesuai.

Di PowerShell gunakan `npx.cmd`; ikuti nilai `--skill-version` dalam `SKILL.md`.
CLI mengambil panduan melalui jaringan, tanpa menambah dependency aplikasi.
Backend, skrip, konfigurasi tooling, tes murni, dan edit teks sederhana tidak
memerlukan pencarian ini. `legacy-scan` hanya untuk permintaan modernisasi luas.
Skill ini melengkapi skill UI/UX dan motion serta aturan implementasi proyek.

## Menggunakan Anti-Slop Design

`AGENTS.md` mewajibkan `.agents/skills/anti-slop-design/SKILL.md` saat coding
atau menilai antarmuka, tanpa perlu diminta ulang. Baca referensi yang sesuai
dengan keputusan warna, tipografi, layout, spacing, motion, atau copy; gunakan
checklist `references/13-pre-emit-checklist.md` sebelum menyerahkan hasil.

Untuk proyek yang sudah memiliki desain, ikuti mode existing product dan
constrained scope di `references/14-workflow.md`: jadikan desain yang ada
sebagai acuan, cocokkan komponen baru, dan batasi perubahan pada permintaan.
Gunakan checklist singkat untuk perubahan kecil. Skill ini tidak mengizinkan
redesign tanpa permintaan dan tidak wajib untuk pekerjaan backend, skrip,
konfigurasi tooling, atau tes murni yang tidak menyentuh UI.

## Menggunakan UI UX Pro Max

Untuk migrasi ini, pencarian lokal yang relevan sudah dijalankan:

```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py "effect cleanup animation" --stack react
python .agents/skills/ui-ux-pro-max/scripts/search.py "prefers reduced motion parallax" --domain ux
```

Hasilnya mendukung cleanup effect dan penghormatan reduced motion. Untuk tugas
berikutnya, pilih query sesuai perubahan. Jangan menjalankan generator design
system untuk konversi yang harus mempertahankan tampilan.

`AGENTS.md` mengarahkan perilaku agent. Ini tidak menjamin bahwa semua editor
atau perubahan manual akan menjalankan skill. Sintaks pemanggilan juga bergantung
host; Codex CLI/IDE menyediakan `/skills` atau mention `$nama-skill`.

Acuan mekanisme discovery dan invocation:
[OpenAI Docs — Build skills](https://learn.chatgpt.com/docs/build-skills).
