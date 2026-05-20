# SCHEMA.md

# Database Schema
## Sistem Informasi Akademik SMP

Database menggunakan PostgreSQL dengan Prisma ORM.

## 1. Prinsip Schema

1. Relasional
2. Konsisten
3. Menggunakan enum untuk data tetap
4. Menggunakan unique constraint untuk data penting
5. Menggunakan index pada foreign key
6. Mendukung role-based access
7. Mendukung seed data demo
8. Mendukung soft delete jika relevan

## 2. Entity Utama

Entity:
1. User
2. Student
3. Parent
4. Teacher
5. Class
6. Subject
7. TeacherSubject
8. AcademicYear
9. Semester
10. Schedule
11. Attendance
12. Grade
13. GradeWeight
14. ReportCard

## 3. Enum

```prisma
enum Role {
  ADMIN
  TEACHER
  STUDENT
  PRINCIPAL
  PARENT
}

enum Gender {
  MALE
  FEMALE
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
}

enum AttendanceStatus {
  HADIR
  SAKIT
  IZIN
  ALFA
}

enum SemesterType {
  GANJIL
  GENAP
}
```

## 4. Prisma Schema Draft

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
  PRINCIPAL
  PARENT
}

enum Gender {
  MALE
  FEMALE
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
}

enum AttendanceStatus {
  HADIR
  SAKIT
  IZIN
  ALFA
}

enum SemesterType {
  GANJIL
  GENAP
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role
  isActive     Boolean  @default(true)

  student      Student?
  teacher      Teacher?
  parent       Parent?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Student {
  id           String   @id @default(cuid())
  nis          String   @unique
  name         String
  gender       Gender
  birthDate    DateTime?
  address      String?

  userId       String?  @unique
  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  classId      String
  class        Class    @relation(fields: [classId], references: [id])

  parents      ParentStudent[]
  attendances  Attendance[]
  grades       Grade[]
  reportCards  ReportCard[]

  isDeleted    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([classId])
}

model Parent {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  address   String?

  userId    String?  @unique
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  students  ParentStudent[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ParentStudent {
  id        String  @id @default(cuid())

  parentId  String
  parent    Parent  @relation(fields: [parentId], references: [id], onDelete: Cascade)

  studentId String
  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([parentId, studentId])
  @@index([studentId])
}

model Teacher {
  id           String   @id @default(cuid())
  nip          String?  @unique
  name         String
  phone        String?
  address      String?

  userId       String?  @unique
  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  homeroomClasses Class[] @relation("HomeroomTeacher")

  subjects     TeacherSubject[]
  schedules    Schedule[]
  attendancesCreated Attendance[] @relation("AttendanceCreatedBy")
  grades       Grade[]

  isDeleted    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Class {
  id             String   @id @default(cuid())
  name           String
  gradeLevel     Int

  academicYearId String
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])

  homeroomTeacherId String?
  homeroomTeacher   Teacher? @relation("HomeroomTeacher", fields: [homeroomTeacherId], references: [id], onDelete: SetNull)

  students       Student[]
  schedules      Schedule[]
  attendances    Attendance[]
  grades         Grade[]
  reportCards    ReportCard[]

  isDeleted      Boolean @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([name, academicYearId])
  @@index([academicYearId])
  @@index([homeroomTeacherId])
}

model Subject {
  id          String   @id @default(cuid())
  code        String   @unique
  name        String
  gradeLevel  Int?

  teachers    TeacherSubject[]
  schedules   Schedule[]
  grades      Grade[]
  gradeWeights GradeWeight[]

  isDeleted   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TeacherSubject {
  id        String  @id @default(cuid())

  teacherId String
  teacher   Teacher @relation(fields: [teacherId], references: [id], onDelete: Cascade)

  subjectId String
  subject   Subject @relation(fields: [subjectId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([teacherId, subjectId])
  @@index([subjectId])
}

model AcademicYear {
  id          String   @id @default(cuid())
  name        String   @unique
  startDate   DateTime?
  endDate     DateTime?
  isActive    Boolean  @default(false)

  semesters   Semester[]
  classes     Class[]
  schedules   Schedule[]
  attendances Attendance[]
  grades      Grade[]
  reportCards ReportCard[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Semester {
  id             String       @id @default(cuid())
  type           SemesterType
  isActive       Boolean      @default(false)

  academicYearId String
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id], onDelete: Cascade)

  schedules      Schedule[]
  attendances    Attendance[]
  grades         Grade[]
  gradeWeights   GradeWeight[]
  reportCards    ReportCard[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([type, academicYearId])
  @@index([academicYearId])
}

model Schedule {
  id             String    @id @default(cuid())

  classId        String
  class          Class     @relation(fields: [classId], references: [id])

  teacherId      String
  teacher        Teacher   @relation(fields: [teacherId], references: [id])

  subjectId      String
  subject        Subject   @relation(fields: [subjectId], references: [id])

  semesterId     String
  semester       Semester  @relation(fields: [semesterId], references: [id])

  academicYearId String
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])

  dayOfWeek      DayOfWeek
  startTime      String
  endTime        String

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([classId])
  @@index([teacherId])
  @@index([subjectId])
  @@index([semesterId])
  @@index([academicYearId])
  @@index([dayOfWeek])
}

model Attendance {
  id             String           @id @default(cuid())

  studentId      String
  student        Student          @relation(fields: [studentId], references: [id])

  classId        String
  class          Class            @relation(fields: [classId], references: [id])

  semesterId     String
  semester       Semester         @relation(fields: [semesterId], references: [id])

  academicYearId String
  academicYear   AcademicYear     @relation(fields: [academicYearId], references: [id])

  date           DateTime
  status         AttendanceStatus

  createdById    String?
  createdBy      Teacher?         @relation("AttendanceCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)

  note           String?

  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  @@unique([studentId, classId, date])
  @@index([classId])
  @@index([semesterId])
  @@index([academicYearId])
  @@index([date])
}

model GradeWeight {
  id             String   @id @default(cuid())

  subjectId      String
  subject        Subject  @relation(fields: [subjectId], references: [id])

  semesterId     String
  semester       Semester @relation(fields: [semesterId], references: [id])

  assignmentWeight Int    @default(30)
  midtermWeight    Int    @default(30)
  finalExamWeight  Int    @default(40)

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([subjectId, semesterId])
  @@index([semesterId])
}

model Grade {
  id             String   @id @default(cuid())

  studentId      String
  student        Student  @relation(fields: [studentId], references: [id])

  classId        String
  class          Class    @relation(fields: [classId], references: [id])

  subjectId      String
  subject        Subject  @relation(fields: [subjectId], references: [id])

  teacherId      String
  teacher        Teacher  @relation(fields: [teacherId], references: [id])

  semesterId     String
  semester       Semester @relation(fields: [semesterId], references: [id])

  academicYearId String
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])

  assignmentScore Float
  midtermScore    Float
  finalExamScore  Float
  finalScore      Float

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([studentId, classId, subjectId, semesterId, academicYearId])
  @@index([classId])
  @@index([subjectId])
  @@index([teacherId])
  @@index([semesterId])
  @@index([academicYearId])
}

model ReportCard {
  id             String   @id @default(cuid())

  studentId      String
  student        Student  @relation(fields: [studentId], references: [id])

  classId        String
  class          Class    @relation(fields: [classId], references: [id])

  semesterId     String
  semester       Semester @relation(fields: [semesterId], references: [id])

  academicYearId String
  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])

  generatedAt    DateTime @default(now())
  note           String?

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([studentId, classId, semesterId, academicYearId])
  @@index([classId])
  @@index([semesterId])
  @@index([academicYearId])
}
```

## 5. Catatan Desain Schema

### 5.1 User dan Role
Role disimpan langsung di model User dengan enum Role.

Alasan:
- Lebih sederhana untuk prototype.
- Cukup kuat untuk role-based access control.
- Tidak perlu tabel roles terpisah.

### 5.2 Parent dan Student
Orang tua dan siswa menggunakan relasi many-to-many melalui `ParentStudent`.

Alasan:
- Satu orang tua dapat memiliki lebih dari satu anak.
- Satu siswa dapat dihubungkan ke lebih dari satu orang tua jika diperlukan.

### 5.3 Teacher dan Subject
Guru dan mata pelajaran menggunakan relasi many-to-many melalui `TeacherSubject`.

Alasan:
- Satu guru dapat mengajar beberapa mapel.
- Satu mapel dapat diajar oleh beberapa guru.

### 5.4 Schedule
`startTime` dan `endTime` disimpan sebagai string format `HH:mm`.

Contoh:
- `07:00`
- `08:30`

Alasan:
- Lebih sederhana untuk jadwal sekolah.
- Validasi overlap dilakukan di service layer.
- Tidak membutuhkan timezone.

### 5.5 Attendance
Absensi dibuat unik berdasarkan:

```text
studentId + classId + date
```

Artinya satu siswa hanya memiliki satu status absensi pada satu tanggal untuk kelas tersebut.

### 5.6 Grade
Nilai dibuat unik berdasarkan:

```text
studentId + classId + subjectId + semesterId + academicYearId
```

Artinya siswa hanya memiliki satu data nilai untuk mapel tertentu dalam semester dan tahun ajaran tertentu.

## 6. Validasi yang Tidak Cukup di Database

Validasi berikut wajib dilakukan di service layer:

1. Jadwal bentrok.
2. Jam selesai lebih besar dari jam mulai.
3. Total bobot nilai harus 100.
4. Nilai harus 0-100.
5. Guru hanya input nilai pada kelas/mapel yang diajar.
6. Orang tua hanya akses data anak.
7. Siswa hanya akses data sendiri.
8. Kepala sekolah read-only.

## 7. Seed Data Minimal

Seed data wajib mencakup:
- 1 admin
- 3 guru
- 6 siswa
- 1 kepala sekolah
- 3 orang tua
- 1 tahun ajaran aktif
- 2 semester
- 2 kelas
- 5 mata pelajaran
- Jadwal pelajaran
- Absensi contoh
- Nilai contoh

## 8. Akun Demo

```text
Admin:
email: admin@smpdemo.test
password: password123

Guru:
email: guru@smpdemo.test
password: password123

Siswa:
email: siswa@smpdemo.test
password: password123

Kepala Sekolah:
email: kepala@smpdemo.test
password: password123

Orang Tua:
email: orangtua@smpdemo.test
password: password123
```

## 9. Index yang Disarankan

Index wajib:
- User.email
- Student.nis
- Student.classId
- Teacher.nip
- Class.academicYearId
- Schedule.classId
- Schedule.teacherId
- Schedule.dayOfWeek
- Attendance.studentId
- Attendance.classId
- Attendance.date
- Grade.studentId
- Grade.classId
- Grade.subjectId
- Grade.semesterId

## 10. Migration Notes

Perintah dasar:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Untuk production/Neon:

```bash
npx prisma migrate deploy
```

## 11. Catatan Warna dan Schema

Schema database tidak menyimpan konfigurasi warna.

Alasan:
- Tema visual bersifat aplikasi, bukan domain akademik.
- Untuk prototype, theme cukup disimpan di Tailwind config atau constant UI.
- Jika nanti ingin multi-theme, baru pertimbangkan tabel konfigurasi aplikasi.
