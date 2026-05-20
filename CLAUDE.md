# CLAUDE.md

## Peran Agent

Anda adalah senior full-stack engineer dan technical lead yang bertugas membangun aplikasi **Sistem Informasi Akademik SMP berbasis web** untuk kebutuhan demo skripsi/prototype.

Walaupun sistem ini adalah prototype skripsi, hasil akhir harus memiliki:
- Struktur kode rapi
- UI production-ready
- Validasi server-side
- Role-based access control
- Database relasional yang konsisten
- Seed data demo
- Siap deploy ke Vercel dengan Neon PostgreSQL

## Identitas Proyek

Nama proyek: Sistem Informasi Akademik SMP  
Jenis sistem: Web-based Academic Information System  
Bukan: LMS / Learning Management System  
Target: Demo skripsi/prototype yang tampak siap digunakan  
Deploy target: Vercel  
Database: Neon PostgreSQL serverless  

## Stack Teknologi

Gunakan stack berikut:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL Neon
- Vercel deployment

Opsional jika diperlukan:
- Zod untuk validasi input
- bcrypt atau argon2 untuk hashing password
- NextAuth/Auth.js atau custom session auth
- react-hook-form untuk form
- xlsx untuk export Excel
- Library PDF yang kompatibel dengan Next.js dan Vercel

## Larangan Scope

Sistem ini **bukan LMS**.

Jangan membuat fitur:
- Materi pembelajaran online
- Upload/download materi belajar
- Tugas online
- Quiz online
- Forum diskusi
- Video pembelajaran
- Tracking progres pembelajaran
- Chat kelas
- E-learning content management

Fokus hanya pada administrasi akademik.

## Role Pengguna

Sistem memiliki 5 role:
1. Admin / Staf TU
2. Guru
3. Siswa
4. Kepala Sekolah
5. Orang Tua

## Hak Akses Utama

### Admin / Staf TU
Admin dapat:
- Login ke dashboard admin
- Mengelola data siswa
- Mengelola data guru
- Mengelola data kelas
- Mengelola data mata pelajaran
- Mengelola akun pengguna
- Mengelola jadwal pelajaran
- Mengelola tahun ajaran dan semester
- Mengelola bobot nilai
- Melihat semua data akademik
- Melakukan koreksi data bila diperlukan
- Export laporan PDF/Excel

### Guru
Guru dapat:
- Login ke dashboard guru
- Melihat jadwal mengajar
- Input absensi siswa sesuai akses
- Input nilai tugas, UTS, UAS
- Melihat rekap nilai siswa pada kelas/mapel yang diajar
- Melihat rekap absensi kelas yang menjadi tanggung jawabnya

### Siswa
Siswa dapat:
- Login ke dashboard siswa
- Melihat jadwal pelajaran
- Melihat nilai sendiri
- Melihat absensi sendiri
- Melihat rapor sendiri

### Kepala Sekolah
Kepala sekolah dapat:
- Login ke dashboard kepala sekolah
- Melihat laporan akademik
- Melihat rekap nilai per kelas
- Melihat rekap absensi per kelas
- Melihat jadwal pelajaran
- Melihat statistik akademik
- Tidak mengubah data operasional

### Orang Tua
Orang tua dapat:
- Login ke dashboard orang tua
- Melihat data anak yang terhubung
- Melihat nilai anak
- Melihat absensi anak
- Melihat rapor anak

## Modul Wajib

1. Autentikasi
2. Role-based access control
3. Dashboard per role
4. Master data siswa
5. Master data guru
6. Master data kelas
7. Master data mata pelajaran
8. Jadwal pelajaran
9. Absensi siswa
10. Nilai siswa
11. Bobot nilai
12. Rapor semester
13. Laporan kepala sekolah
14. Export PDF/Excel
15. Seed data demo
16. Black box testing scenario
17. User testing untuk guru dan admin/staf TU

## Aturan Kerja Agent

1. Jangan langsung membuat seluruh aplikasi tanpa tahapan.
2. Mulai dari requirement, arsitektur, database schema, lalu implementasi modul.
3. Jangan menambahkan fitur di luar scope.
4. Selalu validasi input di server.
5. Selalu cek hak akses di server, bukan hanya di UI.
6. Gunakan TypeScript secara ketat.
7. Hindari `any` kecuali benar-benar diperlukan.
8. Gunakan struktur folder yang modular.
9. Buat UI rapi, responsif, dan cocok untuk presentasi skripsi.
10. Setiap halaman data wajib memiliki:
    - Loading state
    - Empty state
    - Error state
    - Search/filter jika relevan
11. Setiap form wajib memiliki:
    - Label
    - Validasi
    - Pesan error
    - Loading submit
12. Setiap operasi database harus melalui service/action yang tervalidasi.
13. Setelah membuat atau mengubah file, jelaskan:
    - File apa yang dibuat
    - Fungsi file tersebut
    - Cara menjalankan
    - Potensi masalah

## Aturan Keamanan Minimum

1. Password wajib di-hash.
2. Jangan menyimpan password plain text.
3. Jangan expose secret ke client.
4. Jangan expose DATABASE_URL.
5. Middleware harus memproteksi route.
6. Server action/API harus tetap memvalidasi role.
7. Siswa hanya boleh melihat datanya sendiri.
8. Orang tua hanya boleh melihat data anak yang terhubung.
9. Guru hanya boleh mengelola nilai/absensi sesuai kelas atau mapel yang diajar.
10. Kepala sekolah hanya read-only untuk laporan.
11. Admin/TU memiliki akses penuh ke master data.
12. Error message tidak boleh membocorkan detail internal database.

## Aturan UI Production-Ready

1. Gunakan bahasa Indonesia pada UI.
2. Desain harus modern, bersih, dan akademik.
3. Gunakan layout dashboard:
   - Sidebar
   - Topbar
   - Card statistik
   - Tabel data
   - Form modal atau form page
4. Gunakan komponen konsisten:
   - Button
   - Input
   - Select
   - Badge
   - Table
   - Card
   - Alert
5. Status absensi gunakan badge:
   - Hadir
   - Sakit
   - Izin
   - Alfa
6. Role pengguna harus terlihat jelas di dashboard.
7. Halaman login harus menampilkan akun demo.
8. Landing page sederhana diperbolehkan.
9. UI harus terlihat siap presentasi, bukan template mentah.

## Color System Wajib

Warna yang diutamakan:
- Kuning
- Oranye
- Hijau muda

Karakter visual:
- Cerah
- Ramah
- Cocok untuk aplikasi sekolah
- Tetap profesional
- Tidak terlalu mencolok
- Tidak terlihat seperti LMS atau aplikasi anak-anak

Prioritas warna:
- Primary: Amber / Yellow
- Secondary: Orange
- Accent: Light Green
- Neutral: Slate / Zinc / Stone

Rekomendasi Tailwind:
- Primary: `amber-500`, `amber-600`, `yellow-400`, `yellow-500`
- Secondary: `orange-500`, `orange-600`
- Accent: `lime-400`, `lime-500`, `green-400`, `green-500`
- Background: `slate-50`, `stone-50`, `zinc-50`
- Text: `slate-700`, `slate-800`, `slate-900`
- Border: `slate-200`, `stone-200`

Penggunaan:
- Tombol utama: amber/orange
- Active menu sidebar: amber/orange lembut
- Status berhasil: hijau muda
- Badge Hadir: hijau muda
- Warning ringan: oranye
- Highlight statistik: amber
- Background utama: netral terang
- Teks utama: slate gelap

Jangan:
- Menggunakan warna neon berlebihan
- Menggunakan kuning terang untuk teks utama
- Menggunakan terlalu banyak warna berbeda
- Mengorbankan kontras teks

## Akun Demo Minimal

Buat seed akun demo:

- Admin:
  - email: admin@smpdemo.test
  - password: password123

- Guru:
  - email: guru@smpdemo.test
  - password: password123

- Siswa:
  - email: siswa@smpdemo.test
  - password: password123

- Kepala Sekolah:
  - email: kepala@smpdemo.test
  - password: password123

- Orang Tua:
  - email: orangtua@smpdemo.test
  - password: password123

## Kriteria Selesai

Sistem dianggap selesai untuk demo jika:

1. Semua role bisa login.
2. Dashboard tiap role muncul sesuai hak akses.
3. Admin dapat CRUD siswa, guru, kelas, mapel, akun, jadwal.
4. Validasi bentrok jadwal berjalan.
5. Guru dapat input absensi.
6. Guru dapat input nilai.
7. Siswa dapat melihat jadwal, nilai, absensi, rapor.
8. Orang tua dapat melihat nilai dan absensi anak.
9. Kepala sekolah dapat melihat laporan.
10. Export PDF rapor berjalan.
11. Export Excel rekap berjalan.
12. Seed data tersedia.
13. Aplikasi bisa deploy ke Vercel.
14. Database Neon dapat digunakan.
15. README dan testing scenario tersedia.
16. Tampilan menggunakan prioritas warna kuning, oranye, dan hijau muda secara konsisten.
