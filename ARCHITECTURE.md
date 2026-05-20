# ARCHITECTURE.md

# Arsitektur Sistem Informasi Akademik SMP

## 1. Ringkasan Arsitektur

Aplikasi menggunakan arsitektur full-stack berbasis Next.js App Router.

Komponen utama:
- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js Server Actions / Route Handlers
- ORM: Prisma
- Database: Neon PostgreSQL serverless
- Auth: Session-based authentication
- Deployment: Vercel

## 2. Prinsip Arsitektur

1. Modular
2. Role-based
3. Server-side validation
4. Type-safe
5. Production-like prototype
6. Compatible dengan Vercel serverless
7. Database-driven
8. Mudah dipresentasikan untuk skripsi
9. UI konsisten dengan warna prioritas kuning, oranye, dan hijau muda

## 3. High-Level Architecture

```text
User Browser
    |
    v
Next.js App Router
    |
    +-- Server Components
    +-- Client Components
    +-- Server Actions
    +-- Route Handlers
    |
    v
Auth & Authorization Layer
    |
    v
Service Layer
    |
    v
Prisma ORM
    |
    v
Neon PostgreSQL
```

## 4. Layer Aplikasi

### 4.1 Presentation Layer
Berisi:
- Page
- Layout
- UI components
- Form components
- Table components
- Dashboard cards

Tanggung jawab:
- Menampilkan data
- Menangani interaksi user
- Menampilkan loading/error/empty state
- Tidak boleh menyimpan business logic berat

### 4.2 Application Layer
Berisi:
- Server actions
- Route handlers
- Use case functions

Tanggung jawab:
- Memproses request
- Memanggil service
- Memvalidasi role
- Mengembalikan response

### 4.3 Domain / Service Layer
Berisi:
- Logic absensi
- Logic nilai
- Logic jadwal
- Logic laporan
- Validasi bentrok jadwal
- Validasi hak akses data

Tanggung jawab:
- Menjaga business rule
- Menghindari duplikasi logic
- Menjadi pusat aturan sistem

### 4.4 Data Access Layer
Berisi:
- Prisma client
- Query database
- Transaction jika diperlukan

Tanggung jawab:
- Membaca dan menulis data
- Menjaga query tetap efisien
- Menggunakan include/select secara tepat

## 5. Struktur Folder

Gunakan struktur berikut:

```text
src/
  app/
    (auth)/
      login/
        page.tsx

    (dashboard)/
      dashboard/
        admin/
          page.tsx
        guru/
          page.tsx
        siswa/
          page.tsx
        kepala-sekolah/
          page.tsx
        orang-tua/
          page.tsx

      admin/
        siswa/
          page.tsx
          new/
            page.tsx
          [id]/
            edit/
              page.tsx
        guru/
        kelas/
        mapel/
        jadwal/
        akun/

      guru/
        jadwal/
        absensi/
        nilai/

      siswa/
        jadwal/
        absensi/
        nilai/
        rapor/

      kepala-sekolah/
        laporan/
        nilai/
        absensi/
        jadwal/

      orang-tua/
        anak/
        nilai/
        absensi/
        rapor/

    api/
      export/
        rapor/
          route.ts
        nilai/
          route.ts
        absensi/
          route.ts

  components/
    ui/
      button.tsx
      input.tsx
      select.tsx
      table.tsx
      card.tsx
      badge.tsx
      alert.tsx

    layout/
      dashboard-layout.tsx
      sidebar.tsx
      topbar.tsx

    dashboard/
      stat-card.tsx

    forms/
      siswa-form.tsx
      guru-form.tsx
      jadwal-form.tsx
      absensi-form.tsx
      nilai-form.tsx

    tables/
      siswa-table.tsx
      guru-table.tsx
      jadwal-table.tsx
      nilai-table.tsx
      absensi-table.tsx

  lib/
    auth.ts
    prisma.ts
    session.ts
    permissions.ts
    validations.ts
    constants.ts
    utils.ts

  actions/
    siswa.actions.ts
    guru.actions.ts
    kelas.actions.ts
    mapel.actions.ts
    jadwal.actions.ts
    absensi.actions.ts
    nilai.actions.ts
    laporan.actions.ts
    akun.actions.ts

  services/
    jadwal.service.ts
    absensi.service.ts
    nilai.service.ts
    laporan.service.ts
    auth.service.ts

  schemas/
    siswa.schema.ts
    guru.schema.ts
    kelas.schema.ts
    mapel.schema.ts
    jadwal.schema.ts
    absensi.schema.ts
    nilai.schema.ts
    auth.schema.ts

  types/
    auth.ts
    dashboard.ts
    akademik.ts

  middleware.ts

prisma/
  schema.prisma
  seed.ts

public/
```

## 6. Routing

### 6.1 Public Routes

```text
/
 /login
```

### 6.2 Protected Routes

```text
/dashboard/admin
/dashboard/guru
/dashboard/siswa
/dashboard/kepala-sekolah
/dashboard/orang-tua
```

### 6.3 Admin Routes

```text
/admin/siswa
/admin/guru
/admin/kelas
/admin/mapel
/admin/jadwal
/admin/akun
```

### 6.4 Guru Routes

```text
/guru/jadwal
/guru/absensi
/guru/nilai
```

### 6.5 Siswa Routes

```text
/siswa/jadwal
/siswa/absensi
/siswa/nilai
/siswa/rapor
```

### 6.6 Kepala Sekolah Routes

```text
/kepala-sekolah/laporan
/kepala-sekolah/nilai
/kepala-sekolah/absensi
/kepala-sekolah/jadwal
```

### 6.7 Orang Tua Routes

```text
/orang-tua/anak
/orang-tua/nilai
/orang-tua/absensi
/orang-tua/rapor
```

## 7. Auth Architecture

### 7.1 Login Flow

```text
User submit email/password
    |
Validate input
    |
Find user by email
    |
Compare hashed password
    |
Create session
    |
Redirect by role
```

### 7.2 Role Redirect

```text
ADMIN      -> /dashboard/admin
TEACHER    -> /dashboard/guru
STUDENT    -> /dashboard/siswa
PRINCIPAL  -> /dashboard/kepala-sekolah
PARENT     -> /dashboard/orang-tua
```

### 7.3 Authorization Rules

Authorization dilakukan pada:
1. Middleware
2. Server action
3. Service layer untuk data ownership

Contoh:
- Middleware mencegah siswa membuka route admin.
- Server action mencegah role selain ADMIN membuat siswa.
- Service layer mencegah orang tua membaca data anak yang bukan miliknya.

## 8. Data Ownership Rules

### 8.1 Siswa
Siswa hanya dapat melihat:
- Data dirinya
- Jadwal kelasnya
- Nilainya sendiri
- Absensinya sendiri
- Rapornya sendiri

### 8.2 Orang Tua
Orang tua hanya dapat melihat:
- Siswa yang terhubung dengan parent account
- Nilai anaknya
- Absensi anaknya
- Rapor anaknya

### 8.3 Guru
Guru hanya dapat:
- Melihat jadwal mengajarnya
- Input nilai pada kelas/mapel yang diajar
- Input absensi jika menjadi wali kelas atau diberikan akses

### 8.4 Kepala Sekolah
Kepala sekolah:
- Read-only laporan
- Tidak melakukan create/update/delete data operasional

### 8.5 Admin
Admin:
- Full access untuk master data
- Full access untuk jadwal
- Bisa koreksi absensi/nilai jika diperlukan

## 9. Jadwal Conflict Detection

Jadwal bentrok jika:

```text
Hari sama
DAN
Guru sama ATAU kelas sama
DAN
newStart < existingEnd
DAN
newEnd > existingStart
```

Conflict yang harus dicegah:
1. Guru mengajar di dua kelas pada waktu yang sama.
2. Kelas memiliki dua mata pelajaran pada waktu yang sama.

Service:
```text
services/jadwal.service.ts
```

Function:
```text
validateScheduleConflict(input, excludeScheduleId?)
```

## 10. Grade Calculation

Bobot default:
- Tugas: 30
- UTS: 30
- UAS: 40

Formula:

```text
finalScore =
  assignmentScore * assignmentWeight / 100 +
  midtermScore * midtermWeight / 100 +
  finalExamScore * finalExamWeight / 100
```

Service:
```text
services/nilai.service.ts
```

Function:
```text
calculateFinalScore(scores, weights)
validateGradeWeight(weights)
```

## 11. Attendance Rules

Absensi dibuat per:
- Siswa
- Kelas
- Tanggal
- Tahun ajaran
- Semester

Constraint:
- Satu siswa tidak boleh memiliki dua absensi untuk tanggal dan kelas yang sama.

Service:
```text
services/absensi.service.ts
```

Function:
```text
saveBulkAttendance(input)
getStudentAttendanceSummary(studentId, semesterId)
getClassAttendanceSummary(classId, semesterId)
```

## 12. Export Architecture

### 12.1 PDF
Digunakan untuk:
- Rapor siswa

Route:
```text
/api/export/rapor
```

### 12.2 Excel
Digunakan untuk:
- Rekap nilai
- Rekap absensi

Route:
```text
/api/export/nilai
/api/export/absensi
```

## 13. UI Theme Architecture

Gunakan theme token agar warna konsisten.

Direkomendasikan membuat constant:

```ts
export const theme = {
  primary: "amber",
  secondary: "orange",
  accent: "lime",
  neutral: "slate",
};
```

Penggunaan:
- Primary button: amber/orange
- Active sidebar: amber tint
- Success badge: lime/green
- Page background: slate/stone/zinc light
- Main text: slate dark

Jangan menyebar warna secara acak di setiap komponen. Gunakan class konsisten atau wrapper component.

## 14. Environment Variables

Minimal:

```env
DATABASE_URL=
AUTH_SECRET=
APP_URL=
```

Jika menggunakan NextAuth/Auth.js:

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 15. Deployment Architecture

```text
GitHub Repository
    |
    v
Vercel
    |
    +-- Build Next.js
    +-- Run Prisma Generate
    |
    v
Neon PostgreSQL
```

## 16. Build Commands

```bash
npm install
npx prisma generate
npm run build
```

## 17. Runtime Notes

1. Jangan menggunakan fitur Node.js yang tidak kompatibel dengan Vercel tanpa konfigurasi.
2. Prisma harus menggunakan connection string Neon.
3. Gunakan pooling connection Neon jika tersedia.
4. Jangan menjalankan migration otomatis saat runtime.
5. Jalankan migration dari local atau CI.

## 18. Risiko Teknis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Prisma connection issue di serverless | Aplikasi gagal query | Gunakan Neon connection pooling |
| Role access bocor | Data tidak aman | Validasi role di middleware dan server |
| Jadwal bentrok lolos | Data akademik salah | Validasi server-side |
| Nilai duplikat | Laporan salah | Unique constraint |
| Export gagal di Vercel | Demo terganggu | Pilih library kompatibel serverless |
| UI terlalu sederhana | Demo kurang meyakinkan | Gunakan dashboard production-like |
| Warna terlalu mencolok | Keterbacaan buruk | Pakai palet amber/orange/lime dengan neutral slate |
