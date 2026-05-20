# CONVENTIONS.md

# Coding Conventions
## Sistem Informasi Akademik SMP

## 1. Bahasa

Gunakan:
- Bahasa Indonesia untuk UI
- Bahasa Inggris untuk nama variabel, function, file, dan database field
- Bahasa Indonesia untuk label, pesan validasi, menu, dan konten tampilan

Contoh:
```ts
const studentName = "Ahmad";
```

Label UI:
```text
Nama Siswa
Tanggal Lahir
Simpan Data
```

## 2. Naming Convention

### 2.1 File dan Folder

Gunakan kebab-case untuk file dan folder:

```text
student-form.tsx
dashboard-layout.tsx
jadwal-service.ts
nilai-actions.ts
```

### 2.2 Component

Gunakan PascalCase:

```tsx
StudentForm
DashboardLayout
ScheduleTable
GradeInputForm
```

### 2.3 Function

Gunakan camelCase:

```ts
getCurrentUser()
requireRole()
calculateFinalScore()
validateScheduleConflict()
```

### 2.4 Variable

Gunakan camelCase:

```ts
studentId
classId
academicYearId
finalScore
```

### 2.5 Enum

Gunakan UPPER_CASE untuk value enum:

```ts
ADMIN
TEACHER
STUDENT
PRINCIPAL
PARENT
```

## 3. Route Naming

Route UI menggunakan bahasa Indonesia atau istilah role yang sudah disepakati.

Direkomendasikan:

```text
/dashboard/admin
/dashboard/guru
/dashboard/siswa
/dashboard/kepala-sekolah
/dashboard/orang-tua

/admin/siswa
/admin/guru
/admin/kelas
/admin/mapel
/admin/jadwal
/admin/akun

/guru/jadwal
/guru/absensi
/guru/nilai

/siswa/jadwal
/siswa/absensi
/siswa/nilai
/siswa/rapor

/kepala-sekolah/laporan

/orang-tua/anak
/orang-tua/nilai
/orang-tua/absensi
/orang-tua/rapor
```

## 4. TypeScript Rules

1. Hindari `any`.
2. Gunakan type/interface eksplisit untuk payload penting.
3. Gunakan return type pada service function.
4. Gunakan enum/type untuk role dan status.
5. Validasi data eksternal dengan schema validation.
6. Jangan percaya data dari client.

Contoh:

```ts
type CreateStudentInput = {
  nis: string;
  name: string;
  gender: "MALE" | "FEMALE";
  classId: string;
};
```

## 5. Component Rules

1. Component UI kecil dan reusable.
2. Component page tidak boleh terlalu besar.
3. Business logic jangan ditaruh di component UI.
4. Query database jangan langsung dari client component.
5. Form component boleh client component.
6. Data fetching utama gunakan server component/server action.

## 6. Server Action Rules

Setiap server action wajib:

1. Memanggil `requireAuth()`
2. Memvalidasi role dengan `requireRole()`
3. Memvalidasi input
4. Memanggil service layer
5. Menangani error
6. Mengembalikan response yang jelas

Format response:

```ts
type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
```

## 7. Service Layer Rules

Service digunakan untuk business logic.

Contoh service:
```text
jadwal.service.ts
absensi.service.ts
nilai.service.ts
laporan.service.ts
```

Service bertugas:
- Validasi jadwal bentrok
- Hitung nilai akhir
- Validasi bobot
- Simpan absensi massal
- Generate laporan
- Cek data ownership

UI dan server action tidak boleh menduplikasi business rule besar.

## 8. Prisma Query Rules

1. Gunakan `select` jika hanya butuh sebagian field.
2. Gunakan `include` hanya jika relasi dibutuhkan.
3. Gunakan pagination pada list data.
4. Gunakan transaction untuk operasi massal.
5. Jangan melakukan query berulang dalam loop jika bisa dioptimalkan.
6. Gunakan index sesuai kebutuhan filter.

Contoh pagination:

```ts
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;
```

## 9. Validation Rules

Gunakan validasi server-side.

Validasi umum:
- Required field
- Email format
- Range nilai 0-100
- Total bobot 100
- Jam selesai > jam mulai
- Unique data
- Role access
- Data ownership

Pesan error gunakan bahasa Indonesia.

Contoh:
```text
Nama siswa wajib diisi.
NIS sudah digunakan.
Jam selesai harus lebih besar dari jam mulai.
Guru sudah memiliki jadwal pada waktu tersebut.
```

## 10. Error Handling

Jangan tampilkan error internal database kepada user.

Buruk:
```text
Unique constraint failed on the fields: (`email`)
```

Baik:
```text
Email sudah digunakan.
```

Setiap error harus:
- Aman
- Mudah dimengerti
- Spesifik jika memungkinkan

## 11. UI Conventions

### 11.1 Layout

Gunakan struktur:
- Sidebar
- Topbar
- Page header
- Content card
- Table/form

### 11.2 Page Header

Setiap halaman utama punya:
- Judul
- Deskripsi singkat
- Tombol aksi utama jika relevan

Contoh:
```text
Data Siswa
Kelola data siswa yang terdaftar di sekolah.
[Tambah Siswa]
```

### 11.3 Table

Setiap table data harus punya:
- Header jelas
- Search jika relevan
- Empty state
- Pagination jika data list
- Action button sesuai role

### 11.4 Form

Setiap form harus punya:
- Label
- Placeholder
- Pesan error
- Tombol batal jika relevan
- Tombol submit dengan loading state

### 11.5 Badge

Gunakan badge untuk:
- Role
- Status akun
- Status absensi
- Semester aktif

Status absensi:
- HADIR -> Hadir
- SAKIT -> Sakit
- IZIN -> Izin
- ALFA -> Alfa

## 12. Color System

Warna utama aplikasi mengutamakan:
- Kuning
- Oranye
- Hijau muda

Tujuan visual:
- Terlihat cerah, ramah, dan cocok untuk sistem sekolah.
- Tetap profesional untuk dashboard akademik.
- Tidak terlalu mencolok atau seperti aplikasi anak-anak.
- Prioritaskan keterbacaan dan kontras.

### 12.1 Primary Color

Gunakan kuning/amber sebagai warna utama untuk:
- Tombol utama
- Active menu sidebar
- Highlight statistik
- Icon aktif
- Badge informasi umum

Rekomendasi Tailwind:
```text
amber-400
amber-500
amber-600
yellow-400
yellow-500
```

### 12.2 Secondary Color

Gunakan oranye sebagai warna pendukung untuk:
- CTA penting
- Warning ringan
- Hover state tombol utama
- Aksen pada card tertentu

Rekomendasi Tailwind:
```text
orange-400
orange-500
orange-600
```

### 12.3 Accent Color

Gunakan hijau muda sebagai warna aksen positif untuk:
- Status berhasil
- Badge Hadir
- Indikator aktif
- Ringkasan positif
- Grafik atau angka yang menunjukkan kondisi baik

Rekomendasi Tailwind:
```text
lime-400
lime-500
green-400
green-500
emerald-400
```

### 12.4 Neutral Color

Gunakan warna netral untuk:
- Background utama
- Teks
- Border
- Table
- Form
- Card

Rekomendasi Tailwind:
```text
slate-50
slate-100
slate-200
slate-700
slate-800
slate-900
stone-50
stone-100
zinc-50
```

### 12.5 Rekomendasi Palet

Gunakan palet berikut sebagai acuan:

```text
Primary:
- amber-500
- amber-600

Secondary:
- orange-500
- orange-600

Accent:
- lime-400
- lime-500
- green-500

Background:
- slate-50
- stone-50

Surface:
- white
- amber-50
- orange-50
- lime-50

Text:
- slate-700
- slate-800
- slate-900

Border:
- slate-200
- amber-100
- orange-100
```

### 12.6 Contoh Penggunaan UI

Button utama:
```text
bg-amber-500 hover:bg-amber-600 text-white
```

Button secondary:
```text
bg-orange-500 hover:bg-orange-600 text-white
```

Badge Hadir:
```text
bg-lime-100 text-lime-700 border-lime-200
```

Badge Sakit:
```text
bg-orange-100 text-orange-700 border-orange-200
```

Badge Izin:
```text
bg-amber-100 text-amber-700 border-amber-200
```

Badge Alfa:
```text
bg-red-100 text-red-700 border-red-200
```

Active sidebar:
```text
bg-amber-100 text-amber-700 border-r-2 border-amber-500
```

Card highlight:
```text
bg-white border border-amber-100 shadow-sm
```

Page background:
```text
bg-slate-50
```

### 12.7 Aturan Kontras

1. Jangan gunakan teks kuning di atas background putih.
2. Untuk tombol amber/orange, gunakan teks putih atau slate-900 sesuai kontras.
3. Untuk badge warna muda, gunakan teks warna gelap.
4. Background utama tetap netral.
5. Warna terang hanya digunakan sebagai aksen, bukan untuk seluruh halaman.
6. Jangan memakai lebih dari 3 warna aksen dalam satu area.

### 12.8 Larangan Warna

Jangan:
- Menggunakan warna neon berlebihan.
- Menggunakan kuning terang untuk paragraf atau teks utama.
- Menggunakan background kuning/oranye penuh pada seluruh dashboard.
- Menggunakan terlalu banyak gradasi.
- Mengorbankan keterbacaan demi warna.
- Membuat tampilan seperti aplikasi anak-anak.

## 13. Auth Conventions

Role enum:

```ts
type Role = "ADMIN" | "TEACHER" | "STUDENT" | "PRINCIPAL" | "PARENT";
```

Redirect setelah login:

```ts
const roleRedirectMap = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/guru",
  STUDENT: "/dashboard/siswa",
  PRINCIPAL: "/dashboard/kepala-sekolah",
  PARENT: "/dashboard/orang-tua",
};
```

## 14. Permission Rules

### 14.1 Admin
Admin dapat:
- Create
- Read
- Update
- Delete
- Export

Pada master data.

### 14.2 Guru
Guru dapat:
- Read jadwal sendiri
- Input absensi sesuai akses
- Input nilai sesuai kelas/mapel
- Read rekap sendiri

### 14.3 Siswa
Siswa hanya read:
- Jadwal kelas
- Nilai sendiri
- Absensi sendiri
- Rapor sendiri

### 14.4 Kepala Sekolah
Kepala sekolah hanya read:
- Laporan
- Rekap
- Statistik
- Jadwal

### 14.5 Orang Tua
Orang tua hanya read:
- Data anak
- Nilai anak
- Absensi anak
- Rapor anak

## 15. Schedule Rules

Validasi jadwal:

```ts
newStart < existingEnd && newEnd > existingStart
```

Jadwal bentrok jika:
- Hari sama
- Guru sama atau kelas sama
- Time range overlap

Pesan error:
```text
Guru sudah memiliki jadwal pada waktu tersebut.
Kelas sudah memiliki jadwal pada waktu tersebut.
Jam selesai harus lebih besar dari jam mulai.
```

## 16. Grade Rules

Nilai:
- Minimal 0
- Maksimal 100

Bobot:
- Tugas default 30
- UTS default 30
- UAS default 40
- Total harus 100

Formula:
```ts
finalScore =
  assignmentScore * assignmentWeight / 100 +
  midtermScore * midtermWeight / 100 +
  finalExamScore * finalExamWeight / 100;
```

Pembulatan:
- Gunakan 2 digit desimal jika perlu.
- Tampilkan maksimal 2 digit desimal di UI.

## 17. Attendance Rules

Status:
```text
HADIR
SAKIT
IZIN
ALFA
```

Aturan:
- Satu siswa hanya boleh punya satu absensi per tanggal dan kelas.
- Absensi massal harus menggunakan transaction.
- Rekap menghitung jumlah status.

## 18. Export Rules

PDF:
- Digunakan untuk rapor.
- Format harus rapi.
- Memuat identitas siswa, nilai, absensi, semester, tahun ajaran.
- Gunakan aksen amber/orange/lime secara halus.

Excel:
- Digunakan untuk rekap nilai dan absensi.
- Header harus jelas.
- Nama file harus deskriptif.

Contoh nama file:
```text
rapor-ahmad-ganjil-2025-2026.pdf
rekap-nilai-kelas-7a-ganjil.xlsx
rekap-absensi-kelas-7a-ganjil.xlsx
```

## 19. Commit Convention

Gunakan format:

```text
type(scope): description
```

Contoh:
```text
feat(auth): add login page
feat(jadwal): add schedule conflict validation
fix(nilai): correct final score calculation
docs(readme): add deployment guide
```

Type:
- feat
- fix
- docs
- refactor
- chore
- test
- style

## 20. Documentation Rules

Setiap modul penting harus memiliki:
- Tujuan modul
- Role yang bisa mengakses
- Validasi utama
- File utama
- Cara test manual

## 21. Definition of Done

Satu task dianggap selesai jika:

1. Kode berjalan tanpa error.
2. TypeScript tidak error.
3. Validasi server-side tersedia.
4. Role access benar.
5. UI memiliki loading/empty/error state jika relevan.
6. Data tersimpan di database.
7. Tidak ada hardcoded data selain seed/demo.
8. Tested secara manual.
9. Ringkasan perubahan ditulis.
10. Warna UI mengikuti prioritas kuning, oranye, dan hijau muda.
