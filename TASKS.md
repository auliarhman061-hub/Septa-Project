# TASKS.md

# Task Breakdown
## Sistem Informasi Akademik SMP

## Status

Gunakan status berikut:

```text
TODO
IN_PROGRESS
DONE
BLOCKED
```

## Phase 0 — Project Setup

### T0.1 Init Project
Status: TODO

Tasks:
- Setup Next.js App Router
- Setup TypeScript
- Setup Tailwind CSS
- Setup ESLint
- Setup folder structure
- Setup Prisma
- Setup Neon PostgreSQL connection
- Setup environment variables

Acceptance criteria:
- `npm run dev` berjalan.
- Tailwind berfungsi.
- Prisma client bisa generate.
- Database connection berhasil.

### T0.2 Environment Configuration
Status: TODO

Tasks:
- Buat `.env.example`
- Tambahkan `DATABASE_URL`
- Tambahkan `AUTH_SECRET`
- Tambahkan `APP_URL`
- Dokumentasikan cara konfigurasi Neon

Acceptance criteria:
- Developer bisa setup local dari dokumentasi.
- Secret tidak masuk repository.

## Phase 1 — Database

### T1.1 Prisma Schema
Status: TODO

Tasks:
- Buat Prisma schema
- Tambahkan enum
- Tambahkan semua model utama
- Tambahkan relasi
- Tambahkan unique constraint
- Tambahkan index

Acceptance criteria:
- `npx prisma validate` sukses.
- `npx prisma generate` sukses.
- Migration berhasil.

### T1.2 Seed Data
Status: TODO

Tasks:
- Buat seed akun demo
- Buat tahun ajaran aktif
- Buat semester
- Buat kelas
- Buat guru
- Buat siswa
- Buat orang tua
- Buat mapel
- Buat jadwal
- Buat absensi
- Buat nilai

Acceptance criteria:
- Semua role punya akun demo.
- Login demo bisa digunakan.
- Dashboard punya data contoh.

## Phase 2 — Auth & Authorization

### T2.1 Login
Status: TODO

Tasks:
- Buat halaman login
- Validasi email dan password
- Hash password
- Compare password
- Buat session
- Redirect berdasarkan role

Acceptance criteria:
- User valid bisa login.
- User invalid ditolak.
- Password tidak tersimpan plain text.

### T2.2 Middleware Protection
Status: TODO

Tasks:
- Proteksi route dashboard
- Proteksi route admin
- Proteksi route guru
- Proteksi route siswa
- Proteksi route kepala sekolah
- Proteksi route orang tua

Acceptance criteria:
- User tidak login diarahkan ke login.
- Role salah tidak bisa akses halaman role lain.

### T2.3 Server Authorization Helpers
Status: TODO

Tasks:
- Buat `getCurrentUser()`
- Buat `requireAuth()`
- Buat `requireRole()`
- Buat `canAccessStudentData()`
- Buat `canTeacherManageClassSubject()`

Acceptance criteria:
- Semua server action dapat memakai helper.
- Role dicek di server.

## Phase 3 — Layout & UI Foundation

### T3.1 Dashboard Layout
Status: TODO

Tasks:
- Buat sidebar
- Buat topbar
- Buat dashboard layout
- Buat menu berdasarkan role
- Buat responsive behavior

Acceptance criteria:
- Sidebar tampil sesuai role.
- Layout rapi di desktop.
- UI menggunakan bahasa Indonesia.

### T3.2 UI Components
Status: TODO

Tasks:
- Button
- Input
- Select
- Textarea
- Card
- Table
- Badge
- Alert
- Empty state
- Loading state

Acceptance criteria:
- Komponen reusable.
- Style konsisten.
- Mendukung disabled/loading/error state.

### T3.3 Color System Implementation
Status: TODO

Tasks:
- Terapkan warna utama kuning/amber
- Terapkan aksen oranye
- Terapkan hijau muda untuk status positif
- Terapkan neutral slate/stone/zinc untuk background dan teks
- Buat token warna di Tailwind config atau constant UI
- Pastikan kontras teks aman

Acceptance criteria:
- UI konsisten memakai kuning, oranye, dan hijau muda.
- Tombol utama memakai amber/orange.
- Active sidebar memakai amber/orange tint.
- Badge Hadir/success memakai hijau muda.
- Background tetap netral dan profesional.

## Phase 4 — Dashboard per Role

### T4.1 Admin Dashboard
Status: TODO

Tasks:
- Total siswa
- Total guru
- Total kelas
- Total mapel
- Jadwal aktif
- Shortcut master data

Acceptance criteria:
- Data diambil dari database.
- Dashboard tidak hardcoded kecuali fallback.
- Card statistik menggunakan aksen amber/orange/lime secara proporsional.

### T4.2 Guru Dashboard
Status: TODO

Tasks:
- Jadwal mengajar hari ini
- Kelas yang diajar
- Shortcut input absensi
- Shortcut input nilai

Acceptance criteria:
- Guru hanya melihat datanya sendiri.

### T4.3 Siswa Dashboard
Status: TODO

Tasks:
- Jadwal hari ini
- Ringkasan nilai
- Ringkasan absensi

Acceptance criteria:
- Siswa hanya melihat data sendiri.

### T4.4 Kepala Sekolah Dashboard
Status: TODO

Tasks:
- Statistik sekolah
- Rekap absensi
- Rekap nilai
- Shortcut laporan

Acceptance criteria:
- Read-only.

### T4.5 Orang Tua Dashboard
Status: TODO

Tasks:
- Daftar anak
- Ringkasan nilai anak
- Ringkasan absensi anak

Acceptance criteria:
- Orang tua hanya melihat anak yang terhubung.

## Phase 5 — Master Data Admin

### T5.1 Modul Siswa
Status: TODO

Tasks:
- List siswa
- Search
- Pagination
- Create siswa
- Edit siswa
- Delete/soft delete siswa
- Validasi NIS unik

Acceptance criteria:
- Hanya Admin yang dapat CRUD.
- Form tervalidasi.
- Empty state tersedia.

### T5.2 Modul Guru
Status: TODO

Tasks:
- List guru
- Search
- Create guru
- Edit guru
- Delete/soft delete guru
- Assign mata pelajaran

Acceptance criteria:
- Email unik.
- NIP unik jika diisi.
- Relasi guru-mapel tersimpan.

### T5.3 Modul Kelas
Status: TODO

Tasks:
- List kelas
- Create kelas
- Edit kelas
- Assign wali kelas
- Assign tahun ajaran

Acceptance criteria:
- Nama kelas unik per tahun ajaran.
- Wali kelas opsional.

### T5.4 Modul Mata Pelajaran
Status: TODO

Tasks:
- List mapel
- Create mapel
- Edit mapel
- Delete/soft delete mapel

Acceptance criteria:
- Kode mapel unik.
- Nama mapel wajib.

### T5.5 Modul Akun
Status: TODO

Tasks:
- List akun
- Create akun
- Assign role
- Reset password demo
- Activate/deactivate akun

Acceptance criteria:
- Email unik.
- Password baru di-hash.
- Role valid.

## Phase 6 — Jadwal

### T6.1 Admin Jadwal CRUD
Status: TODO

Tasks:
- List jadwal
- Filter kelas/guru/hari
- Create jadwal
- Edit jadwal
- Delete jadwal

Acceptance criteria:
- Hanya Admin yang dapat CRUD.
- Jadwal menyimpan kelas, guru, mapel, hari, jam, semester, tahun ajaran.

### T6.2 Validasi Bentrok Jadwal
Status: TODO

Tasks:
- Validasi jam selesai > jam mulai
- Validasi guru bentrok
- Validasi kelas bentrok
- Abaikan jadwal sendiri saat edit

Acceptance criteria:
- Sistem menolak jadwal guru overlap.
- Sistem menolak jadwal kelas overlap.
- Error message spesifik.

### T6.3 View Jadwal per Role
Status: TODO

Tasks:
- Guru melihat jadwal sendiri
- Siswa melihat jadwal kelas
- Kepala sekolah melihat semua jadwal

Acceptance criteria:
- Data sesuai role.
- Tidak ada kebocoran akses.

## Phase 7 — Absensi

### T7.1 Input Absensi
Status: TODO

Tasks:
- Pilih kelas
- Pilih tanggal
- Tampilkan daftar siswa
- Input status HADIR/SAKIT/IZIN/ALFA
- Simpan massal

Acceptance criteria:
- Tidak ada duplikasi absensi siswa pada tanggal yang sama.
- Status wajib dipilih.
- Guru/Admin dapat menyimpan.

### T7.2 Rekap Absensi
Status: TODO

Tasks:
- Rekap per siswa
- Rekap per kelas
- Filter tanggal
- Filter semester

Acceptance criteria:
- Rekap menghitung total Hadir/Sakit/Izin/Alfa.

### T7.3 View Absensi Siswa dan Orang Tua
Status: TODO

Tasks:
- Siswa melihat absensi sendiri
- Orang tua melihat absensi anak

Acceptance criteria:
- Ownership data tervalidasi.

## Phase 8 — Nilai

### T8.1 Bobot Nilai
Status: TODO

Tasks:
- Simpan bobot nilai per mapel/semester
- Default 30/30/40
- Validasi total 100

Acceptance criteria:
- Bobot tidak bisa disimpan jika total bukan 100.

### T8.2 Input Nilai
Status: TODO

Tasks:
- Pilih kelas
- Pilih mapel
- Pilih semester
- Tampilkan daftar siswa
- Input tugas/UTS/UAS
- Hitung nilai akhir
- Simpan massal

Acceptance criteria:
- Nilai 0-100.
- Nilai akhir dihitung benar.
- Tidak ada duplikasi nilai.

### T8.3 View Nilai
Status: TODO

Tasks:
- Guru melihat nilai kelas/mapel yang diajar
- Siswa melihat nilai sendiri
- Orang tua melihat nilai anak
- Kepala sekolah melihat rekap nilai

Acceptance criteria:
- Access control benar.

## Phase 9 — Rapor dan Laporan

### T9.1 Rapor Siswa
Status: TODO

Tasks:
- Tampilkan identitas siswa
- Tampilkan daftar mapel dan nilai
- Tampilkan ringkasan absensi
- Tampilkan semester/tahun ajaran

Acceptance criteria:
- Rapor sesuai data siswa.
- Bisa dilihat siswa/orang tua/admin/kepala sekolah sesuai akses.

### T9.2 Laporan Kepala Sekolah
Status: TODO

Tasks:
- Rekap nilai per kelas
- Rekap absensi per kelas
- Jadwal pelajaran
- Jumlah siswa per kelas

Acceptance criteria:
- Kepala sekolah read-only.
- Data agregasi benar.

### T9.3 Export PDF
Status: TODO

Tasks:
- Export rapor ke PDF
- Format rapi
- Nama file jelas
- Gunakan aksen warna amber/orange/lime secara halus di header atau section

Acceptance criteria:
- PDF dapat diunduh.
- PDF layak ditampilkan saat demo.

### T9.4 Export Excel
Status: TODO

Tasks:
- Export rekap nilai
- Export rekap absensi
- Header kolom jelas

Acceptance criteria:
- Excel dapat diunduh.
- Data sesuai filter.

## Phase 10 — Testing

### T10.1 Black Box Testing
Status: TODO

Tasks:
- Buat skenario login
- Buat skenario master data
- Buat skenario jadwal
- Buat skenario absensi
- Buat skenario nilai
- Buat skenario laporan/export

Acceptance criteria:
- Tabel testing tersedia.
- Minimal 25 skenario.

### T10.2 User Testing
Status: TODO

Tasks:
- Buat kuesioner guru
- Buat kuesioner admin/TU
- Gunakan skala Likert
- Hitung rata-rata/persentase

Acceptance criteria:
- Format siap masuk dokumen skripsi.

## Phase 11 — Deployment

### T11.1 Vercel Deployment
Status: TODO

Tasks:
- Setup GitHub repo
- Connect ke Vercel
- Set environment variable
- Build aplikasi
- Deploy

Acceptance criteria:
- URL production berjalan.
- Login demo berhasil.

### T11.2 Neon Deployment
Status: TODO

Tasks:
- Buat database Neon
- Set DATABASE_URL
- Jalankan migration
- Jalankan seed

Acceptance criteria:
- Data demo tersedia di production.

## Phase 12 — Final Polish

### T12.1 UI Polish
Status: TODO

Tasks:
- Rapikan spacing
- Rapikan table
- Rapikan dashboard cards
- Rapikan form
- Tambah empty state
- Tambah loading state
- Pastikan warna kuning/oranye/hijau muda konsisten
- Pastikan kontras teks aman
- Pastikan tampilan tidak terlalu mencolok

Acceptance criteria:
- Tampilan siap presentasi.
- UI terlihat production-ready.
- Warna sesuai arahan visual.

### T12.2 README
Status: TODO

Tasks:
- Cara setup lokal
- Cara konfigurasi env
- Cara migrate
- Cara seed
- Cara deploy
- Akun demo
- Alur demo

Acceptance criteria:
- Developer baru dapat menjalankan project dari README.

### T12.3 Demo Checklist
Status: TODO

Tasks:
- Cek semua akun demo
- Cek semua role
- Cek CRUD utama
- Cek jadwal bentrok
- Cek absensi
- Cek nilai
- Cek laporan
- Cek export
- Cek tampilan desktop
- Cek tampilan tablet
- Cek konsistensi warna

Acceptance criteria:
- Demo end-to-end berjalan tanpa error.
