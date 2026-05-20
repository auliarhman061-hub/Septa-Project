# PRD.md

# Product Requirements Document
## Sistem Informasi Akademik SMP Berbasis Web

## 1. Ringkasan Produk

Sistem Informasi Akademik SMP adalah aplikasi berbasis web untuk membantu pengelolaan administrasi akademik sekolah menengah pertama.

Sistem ini dirancang untuk mengelola:
- Data siswa
- Data guru
- Data kelas
- Mata pelajaran
- Jadwal pelajaran
- Absensi siswa
- Nilai siswa
- Rapor semester
- Laporan akademik

Sistem ini digunakan sebagai demo skripsi/prototype, tetapi harus memiliki tampilan dan struktur yang rapi, stabil, serta layak dipresentasikan.

## 2. Tujuan Produk

Tujuan utama sistem:

1. Meningkatkan efisiensi administrasi akademik sekolah.
2. Mengurangi pencatatan manual.
3. Mempermudah pencarian data akademik.
4. Mempermudah guru dalam input absensi dan nilai.
5. Mempermudah siswa dan orang tua melihat informasi akademik.
6. Mempermudah kepala sekolah melihat laporan akademik.

## 3. Bukan Tujuan Produk

Sistem ini bukan LMS.

Fitur berikut tidak termasuk:
- Materi pembelajaran online
- Tugas online
- Quiz online
- Forum diskusi
- Video pembelajaran
- Tracking progress pembelajaran
- Chat kelas
- Sistem pembayaran
- PPDB
- Perpustakaan
- Inventaris
- Multi sekolah

## 4. Target Pengguna

### 4.1 Admin / Staf TU

Pengguna yang bertanggung jawab mengelola data utama sekolah.

Kebutuhan:
- Mengelola data siswa
- Mengelola data guru
- Mengelola data kelas
- Mengelola mata pelajaran
- Mengelola akun
- Mengelola jadwal
- Melihat laporan

### 4.2 Guru

Pengguna yang bertanggung jawab terhadap kegiatan akademik kelas/mapel.

Kebutuhan:
- Melihat jadwal mengajar
- Input absensi
- Input nilai
- Melihat rekap nilai
- Melihat rekap absensi

### 4.3 Siswa

Pengguna yang melihat informasi akademiknya sendiri.

Kebutuhan:
- Melihat jadwal
- Melihat nilai
- Melihat absensi
- Melihat rapor

### 4.4 Kepala Sekolah

Pengguna yang membutuhkan laporan akademik untuk pengambilan keputusan.

Kebutuhan:
- Melihat statistik siswa/guru/kelas
- Melihat rekap nilai
- Melihat rekap absensi
- Melihat laporan per kelas

### 4.5 Orang Tua

Pengguna yang memantau perkembangan akademik anak.

Kebutuhan:
- Melihat daftar anak
- Melihat nilai anak
- Melihat absensi anak
- Melihat rapor anak

## 5. Visual Product Direction

Aplikasi harus terlihat seperti dashboard akademik modern.

Arah visual:
- Cerah tetapi tetap profesional
- Ramah untuk lingkungan sekolah
- Cocok untuk demo skripsi
- Tidak terlalu ramai
- Tidak terlihat seperti LMS

Warna prioritas:
- Kuning
- Oranye
- Hijau muda

Penggunaan:
- Kuning/amber sebagai warna utama
- Oranye sebagai aksen CTA dan warning ringan
- Hijau muda sebagai status positif
- Warna netral sebagai background, teks, border, dan table

## 6. Fitur Produk

## 6.1 Autentikasi

Fitur:
- Login email dan password
- Logout
- Redirect dashboard berdasarkan role
- Middleware route protection
- Server-side role validation

Acceptance criteria:
- User tidak login tidak bisa membuka dashboard.
- User hanya bisa membuka halaman sesuai role.
- Password tersimpan dalam bentuk hash.
- Setelah login, user diarahkan ke dashboard sesuai role.

## 6.2 Dashboard

### Dashboard Admin
Menampilkan:
- Total siswa
- Total guru
- Total kelas
- Total mata pelajaran
- Jadwal aktif
- Shortcut master data

### Dashboard Guru
Menampilkan:
- Jadwal mengajar hari ini
- Kelas yang diajar
- Shortcut input absensi
- Shortcut input nilai

### Dashboard Siswa
Menampilkan:
- Jadwal hari ini
- Ringkasan absensi
- Ringkasan nilai

### Dashboard Kepala Sekolah
Menampilkan:
- Statistik sekolah
- Rekap absensi per kelas
- Rekap nilai per kelas
- Laporan akademik

### Dashboard Orang Tua
Menampilkan:
- Daftar anak
- Ringkasan absensi anak
- Ringkasan nilai anak

## 6.3 Master Data Siswa

Data:
- NIS
- Nama
- Jenis kelamin
- Tanggal lahir
- Alamat
- Kelas
- Akun pengguna

Fitur:
- List siswa
- Search siswa
- Tambah siswa
- Edit siswa
- Hapus/soft delete siswa
- Pagination

Acceptance criteria:
- NIS harus unik.
- Nama wajib diisi.
- Kelas wajib dipilih.
- Admin dapat membuat, mengubah, dan menghapus data.
- Role selain Admin tidak bisa mengubah data siswa.

## 6.4 Master Data Guru

Data:
- NIP
- Nama
- Email
- No HP
- Mata pelajaran yang diajar
- Akun pengguna

Acceptance criteria:
- Email harus unik.
- NIP unik jika diisi.
- Admin dapat mengelola data guru.
- Guru hanya dapat melihat data dirinya jika fitur profil tersedia.

## 6.5 Master Data Kelas

Data:
- Nama kelas
- Tingkat
- Wali kelas
- Tahun ajaran

Acceptance criteria:
- Nama kelas wajib diisi.
- Wali kelas dapat dipilih dari data guru.
- Satu kelas terhubung ke banyak siswa.

## 6.6 Master Data Mata Pelajaran

Data:
- Kode mata pelajaran
- Nama mata pelajaran
- Tingkat

Acceptance criteria:
- Kode mapel harus unik.
- Nama mapel wajib diisi.
- Admin dapat mengelola mapel.

## 6.7 Jadwal Pelajaran

Data:
- Kelas
- Guru
- Mata pelajaran
- Hari
- Jam mulai
- Jam selesai
- Semester
- Tahun ajaran

Validasi:
- Jam selesai harus lebih besar dari jam mulai.
- Guru tidak boleh memiliki jadwal overlap pada hari yang sama.
- Kelas tidak boleh memiliki jadwal overlap pada hari yang sama.
- Jadwal harus terkait semester dan tahun ajaran aktif.

Rumus overlap:

```text
newStart < existingEnd AND newEnd > existingStart
```

Acceptance criteria:
- Admin dapat membuat jadwal.
- Guru dapat melihat jadwal mengajar sendiri.
- Siswa dapat melihat jadwal kelasnya.
- Kepala sekolah dapat melihat semua jadwal.
- Sistem menolak jadwal bentrok.

## 6.8 Absensi

Status:
- HADIR
- SAKIT
- IZIN
- ALFA

Scope:
- Absensi dilakukan per tanggal dan per kelas.
- Input dapat dilakukan oleh wali kelas atau Admin/TU.
- Jika dibutuhkan, scheduleId dapat dibuat opsional.

Fitur:
- Pilih kelas
- Pilih tanggal
- Tampilkan daftar siswa
- Input status absensi massal
- Simpan absensi
- Rekap absensi siswa
- Rekap absensi kelas
- Filter tanggal/kelas/semester

Acceptance criteria:
- Tidak boleh ada duplikasi absensi siswa pada tanggal dan kelas yang sama.
- Siswa hanya melihat absensinya sendiri.
- Orang tua hanya melihat absensi anaknya.
- Kepala sekolah dapat melihat rekap.
- Admin dapat melakukan koreksi.

## 6.9 Nilai

Komponen:
- Nilai tugas
- Nilai UTS
- Nilai UAS
- Nilai akhir

Bobot default:
- Tugas: 30%
- UTS: 30%
- UAS: 40%

Rumus:

```text
nilaiAkhir = (tugas * bobotTugas / 100) + (uts * bobotUTS / 100) + (uas * bobotUAS / 100)
```

Acceptance criteria:
- Nilai harus berada dalam rentang 0 sampai 100.
- Total bobot harus 100%.
- Guru hanya dapat input nilai untuk kelas/mapel yang diajar.
- Tidak boleh ada duplikasi nilai untuk kombinasi siswa, kelas, mapel, semester, dan tahun ajaran.
- Siswa dapat melihat nilai sendiri.
- Orang tua dapat melihat nilai anak.
- Kepala sekolah dapat melihat rekap nilai.

## 6.10 Rapor

Isi rapor:
- Identitas siswa
- Kelas
- Semester
- Tahun ajaran
- Daftar mata pelajaran
- Nilai tugas
- Nilai UTS
- Nilai UAS
- Nilai akhir
- Ringkasan absensi

Acceptance criteria:
- Rapor dapat dilihat siswa.
- Rapor dapat dilihat orang tua.
- Admin dapat export PDF.
- Kepala sekolah dapat melihat laporan rapor.

## 6.11 Laporan

Laporan minimal:
- Rekap nilai per kelas
- Rekap absensi per kelas
- Rekap absensi per siswa
- Rapor siswa per semester
- Jadwal pelajaran
- Jumlah siswa per kelas

Export:
- PDF untuk rapor
- Excel untuk rekap nilai dan absensi

Acceptance criteria:
- Kepala sekolah dapat melihat laporan read-only.
- Admin dapat export laporan.
- File export rapi dan layak demo.

## 7. Kebutuhan Non-Fungsional

### 7.1 Performance
- Halaman dashboard harus memuat cepat untuk data demo.
- Query harus menggunakan index yang sesuai.
- Pagination digunakan pada tabel besar.

### 7.2 Security
- Password di-hash.
- Role dicek di middleware dan server.
- Tidak ada secret di client.
- Validasi input server-side.
- Error tidak membocorkan detail database.

### 7.3 Usability
- UI bahasa Indonesia.
- Navigasi mudah dipahami.
- Dashboard berbeda per role.
- Form memiliki pesan error yang jelas.
- Ada loading, empty, dan error state.

### 7.4 Maintainability
- Kode modular.
- Naming konsisten.
- TypeScript ketat.
- Service/action terpisah dari UI.
- Prisma schema jelas.

### 7.5 Deployment
- Aplikasi deploy ke Vercel.
- Database menggunakan Neon PostgreSQL.
- Environment variable terdokumentasi.
- Seed data tersedia.

## 8. MVP Scope

Fitur wajib MVP:
1. Login dan role access
2. Dashboard per role
3. CRUD siswa
4. CRUD guru
5. CRUD kelas
6. CRUD mapel
7. CRUD jadwal dengan validasi bentrok
8. Input absensi
9. Input nilai
10. Lihat nilai/absensi siswa
11. Lihat nilai/absensi anak oleh orang tua
12. Laporan kepala sekolah
13. Export PDF rapor
14. Export Excel rekap
15. Seed data demo

## 9. Fitur Ditunda

Fitur berikut tidak dikerjakan pada MVP:
- Import Excel
- Audit log detail
- Notifikasi email/WhatsApp
- Multi sekolah
- Mobile app
- Pembayaran
- PPDB
- LMS
- Chat
- Kalender akademik kompleks

## 10. Alur Demo

1. Admin login.
2. Admin melihat dashboard.
3. Admin mengelola siswa/guru/kelas/mapel.
4. Admin membuat jadwal.
5. Sistem menolak jadwal bentrok.
6. Guru login.
7. Guru melihat jadwal.
8. Guru input absensi.
9. Guru input nilai.
10. Siswa login.
11. Siswa melihat jadwal, absensi, nilai, rapor.
12. Orang tua login.
13. Orang tua melihat nilai dan absensi anak.
14. Kepala sekolah login.
15. Kepala sekolah melihat laporan.
16. Admin export PDF/Excel.
