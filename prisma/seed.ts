// ==========================================
// Seed Data — Sistem Informasi Akademik SMP
// Demo Skripsi Prototype
// ==========================================

import { PrismaClient, Gender, DayOfWeek, AttendanceStatus, SemesterType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Cleanup ───────────────────────────────
  await prisma.reportCard.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.gradeWeight.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Cleaned existing data");

  // ─── Password Hash ────────────────────────
  const passwordHash = await bcrypt.hash("password123", 12);

  // ─── Admin ────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@smpdemo.test",
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log("✓ Created admin account");

  // ─── Guru (3 guru + 1 kepala sekolah) ─────
  const guruUser1 = await prisma.user.create({
    data: {
      name: "Dra. Siti Aminah",
      email: "guru@smpdemo.test",
      passwordHash,
      role: Role.TEACHER,
      isActive: true,
    },
  });

  const guruUser2 = await prisma.user.create({
    data: {
      name: "Budi Santoso, S.Pd.",
      email: "guru2@smpdemo.test",
      passwordHash,
      role: Role.TEACHER,
      isActive: true,
    },
  });

  const guruUser3 = await prisma.user.create({
    data: {
      name: "Hj. Ratna Dewati, M.Pd.",
      email: "guru3@smpdemo.test",
      passwordHash,
      role: Role.TEACHER,
      isActive: true,
    },
  });

  const kepalaUser = await prisma.user.create({
    data: {
      name: "Dr. H. Ahmad Supardi, M.Pd.",
      email: "kepala@smpdemo.test",
      passwordHash,
      role: Role.PRINCIPAL,
      isActive: true,
    },
  });

  const guru1 = await prisma.teacher.create({
    data: {
      nip: "197001012000001001",
      name: "Dra. Siti Aminah",
      phone: "081234567890",
      address: "Jl. Merpati No. 5, Bandung",
      userId: guruUser1.id,
    },
  });

  const guru2 = await prisma.teacher.create({
    data: {
      nip: "198005152000002002",
      name: "Budi Santoso, S.Pd.",
      phone: "081234567891",
      address: "Jl. Kenanga No. 12, Bandung",
      userId: guruUser2.id,
    },
  });

  const guru3 = await prisma.teacher.create({
    data: {
      nip: "198510202000003003",
      name: "Hj. Ratna Dewati, M.Pd.",
      phone: "081234567892",
      address: "Jl. Melati No. 8, Bandung",
      userId: guruUser3.id,
    },
  });

  const kepala = await prisma.teacher.create({
    data: {
      nip: "197505101998001001",
      name: "Dr. H. Ahmad Supardi, M.Pd.",
      phone: "081234567899",
      address: "Jl. Utama No. 1, Bandung",
      userId: kepalaUser.id,
    },
  });
  console.log("✓ Created 3 guru + 1 kepala sekolah");

  // ─── Siswa (6 siswa dalam 2 kelas) ─────────
  const siswaUser1 = await prisma.user.create({
    data: {
      name: "Ahmad Rizki Pratama",
      email: "siswa@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const siswaUser2 = await prisma.user.create({
    data: {
      name: "Putri Nurhaliza",
      email: "siswa2@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const siswaUser3 = await prisma.user.create({
    data: {
      name: "Dimas Permana",
      email: "siswa3@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const siswaUser4 = await prisma.user.create({
    data: {
      name: "Siti Nurfadilah",
      email: "siswa4@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const siswaUser5 = await prisma.user.create({
    data: {
      name: "Rizky Ramadhan",
      email: "siswa5@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  const siswaUser6 = await prisma.user.create({
    data: {
      name: "Nadya Aurelia",
      email: "siswa6@smpdemo.test",
      passwordHash,
      role: Role.STUDENT,
      isActive: true,
    },
  });

  console.log("✓ Created 6 siswa user accounts");

  // ─── Orang Tua (3 orang tua) ───────────────
  const ortuUser1 = await prisma.user.create({
    data: {
      name: "H. Rahman Hakim",
      email: "orangtua@smpdemo.test",
      passwordHash,
      role: Role.PARENT,
      isActive: true,
    },
  });

  const ortuUser2 = await prisma.user.create({
    data: {
      name: "Hj. Nurhayati",
      email: "orangtua2@smpdemo.test",
      passwordHash,
      role: Role.PARENT,
      isActive: true,
    },
  });

  const ortuUser3 = await prisma.user.create({
    data: {
      name: "Jaya Saputra",
      email: "orangtua3@smpdemo.test",
      passwordHash,
      role: Role.PARENT,
      isActive: true,
    },
  });

  const ortu1 = await prisma.parent.create({
    data: {
      name: "H. Rahman Hakim",
      phone: "081234567800",
      address: "Jl. Mawar No. 15, Bandung",
      userId: ortuUser1.id,
    },
  });

  const ortu2 = await prisma.parent.create({
    data: {
      name: "Hj. Nurhayati",
      phone: "081234567801",
      address: "Jl. Anggrek No. 20, Bandung",
      userId: ortuUser2.id,
    },
  });

  const ortu3 = await prisma.parent.create({
    data: {
      name: "Jaya Saputra",
      phone: "081234567802",
      address: "Jl. Dahlia No. 7, Bandung",
      userId: ortuUser3.id,
    },
  });
  console.log("✓ Created 3 orang tua accounts");

  // ─── Tahun Ajaran ──────────────────────────
  const tahunAjaran = await prisma.academicYear.create({
    data: {
      name: "2025/2026",
      startDate: new Date("2025-07-15"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // ─── Semester ───────────────────────────────
  const semesterGanjil = await prisma.semester.create({
    data: {
      type: SemesterType.GANJIL,
      isActive: true,
      academicYearId: tahunAjaran.id,
    },
  });

  const semesterGenap = await prisma.semester.create({
    data: {
      type: SemesterType.GENAP,
      isActive: false,
      academicYearId: tahunAjaran.id,
    },
  });
  console.log("✓ Created tahun ajaran & semester");

  // ─── Mata Pelajaran (5 mapel) ─────────────
  const mapel1 = await prisma.subject.create({
    data: {
      code: "MTK",
      name: "Matematika",
      gradeLevel: 7,
    },
  });

  const mapel2 = await prisma.subject.create({
    data: {
      code: "INA",
      name: "Bahasa Indonesia",
      gradeLevel: 7,
    },
  });

  const mapel3 = await prisma.subject.create({
    data: {
      code: "ING",
      name: "Bahasa Inggris",
      gradeLevel: 7,
    },
  });

  const mapel4 = await prisma.subject.create({
    data: {
      code: "IPA",
      name: "Ilmu Pengetahuan Alam",
      gradeLevel: 7,
    },
  });

  const mapel5 = await prisma.subject.create({
    data: {
      code: "IPS",
      name: "Ilmu Pengetahuan Sosial",
      gradeLevel: 7,
    },
  });
  console.log("✓ Created 5 mata pelajaran");

  // ─── Relasi Guru-Mata Pelajaran ───────────
  await prisma.teacherSubject.createMany({
    data: [
      { teacherId: guru1.id, subjectId: mapel1.id }, // Siti -> Matematika
      { teacherId: guru1.id, subjectId: mapel4.id }, // Siti -> IPA
      { teacherId: guru2.id, subjectId: mapel2.id }, // Budi -> Bahasa Indonesia
      { teacherId: guru2.id, subjectId: mapel3.id }, // Budi -> Bahasa Inggris
      { teacherId: guru3.id, subjectId: mapel5.id }, // Ratna -> IPS
      { teacherId: guru3.id, subjectId: mapel2.id }, // Ratna -> Bahasa Indonesia
    ],
  });
  console.log("✓ Created teacher-subject relations");

  // ─── Kelas (2 kelas) ───────────────────────
  const kelas7A = await prisma.class.create({
    data: {
      name: "VII-A",
      gradeLevel: 7,
      academicYearId: tahunAjaran.id,
      homeroomTeacherId: guru1.id,
    },
  });

  const kelas7B = await prisma.class.create({
    data: {
      name: "VII-B",
      gradeLevel: 7,
      academicYearId: tahunAjaran.id,
      homeroomTeacherId: guru2.id,
    },
  });
  console.log("✓ Created 2 kelas");

  // ─── Siswa (6 siswa) ───────────────────────
  const siswa1 = await prisma.student.create({
    data: {
      nis: "2025001",
      name: "Ahmad Rizki Pratama",
      gender: Gender.MALE,
      birthDate: new Date("2011-03-15"),
      address: "Jl. Merpati No. 5, Bandung",
      classId: kelas7A.id,
      userId: siswaUser1.id,
    },
  });

  const siswa2 = await prisma.student.create({
    data: {
      nis: "2025002",
      name: "Putri Nurhaliza",
      gender: Gender.FEMALE,
      birthDate: new Date("2011-07-22"),
      address: "Jl. Kenanga No. 12, Bandung",
      classId: kelas7A.id,
      userId: siswaUser2.id,
    },
  });

  const siswa3 = await prisma.student.create({
    data: {
      nis: "2025003",
      name: "Dimas Permana",
      gender: Gender.MALE,
      birthDate: new Date("2011-05-10"),
      address: "Jl. Dahlia No. 8, Bandung",
      classId: kelas7A.id,
      userId: siswaUser3.id,
    },
  });

  const siswa4 = await prisma.student.create({
    data: {
      nis: "2025004",
      name: "Siti Nurfadilah",
      gender: Gender.FEMALE,
      birthDate: new Date("2011-01-30"),
      address: "Jl. Mawar No. 15, Bandung",
      classId: kelas7B.id,
      userId: siswaUser4.id,
    },
  });

  const siswa5 = await prisma.student.create({
    data: {
      nis: "2025005",
      name: "Rizky Ramadhan",
      gender: Gender.MALE,
      birthDate: new Date("2011-09-18"),
      address: "Jl. Anggrek No. 20, Bandung",
      classId: kelas7B.id,
      userId: siswaUser5.id,
    },
  });

  const siswa6 = await prisma.student.create({
    data: {
      nis: "2025006",
      name: "Nadya Aurelia",
      gender: Gender.FEMALE,
      birthDate: new Date("2011-11-25"),
      address: "Jl. Melati No. 7, Bandung",
      classId: kelas7B.id,
      userId: siswaUser6.id,
    },
  });
  console.log("✓ Created 6 siswa");

  // ─── Relasi Orang Tua-Siswa ────────────────
  // Ortu 1 -> Siswa 1, 2, 3 (Kelas 7A)
  await prisma.parentStudent.createMany({
    data: [
      { parentId: ortu1.id, studentId: siswa1.id },
      { parentId: ortu1.id, studentId: siswa2.id },
      { parentId: ortu1.id, studentId: siswa3.id },
    ],
  });

  // Ortu 2 -> Siswa 4, 5 (Kelas 7B)
  await prisma.parentStudent.createMany({
    data: [
      { parentId: ortu2.id, studentId: siswa4.id },
      { parentId: ortu2.id, studentId: siswa5.id },
    ],
  });

  // Ortu 3 -> Siswa 6 (Kelas 7B)
  await prisma.parentStudent.create({
    data: {
      parentId: ortu3.id,
      studentId: siswa6.id,
    },
  });
  console.log("✓ Created parent-student relations");

  // ─── Jadwal Pelajaran ─────────────────────
  // Jadwal untuk kelas 7A
  const jadwalData = [
    // Senin
    { classId: kelas7A.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7A.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7A.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "10:15", endTime: "11:45" },
    // Selasa
    { classId: kelas7A.id, teacherId: guru2.id, subjectId: mapel3.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7A.id, teacherId: guru1.id, subjectId: mapel4.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7A.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "10:15", endTime: "11:45" },
    // Rabu
    { classId: kelas7A.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7A.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7A.id, teacherId: guru3.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "10:15", endTime: "11:45" },
    // Kamis
    { classId: kelas7A.id, teacherId: guru2.id, subjectId: mapel3.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7A.id, teacherId: guru1.id, subjectId: mapel4.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7A.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "10:15", endTime: "11:45" },
    // Jumat
    { classId: kelas7A.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.FRIDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7A.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.FRIDAY, startTime: "08:30", endTime: "10:00" },

    // Jadwal untuk kelas 7B
    // Senin
    { classId: kelas7B.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7B.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7B.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.MONDAY, startTime: "10:15", endTime: "11:45" },
    // Selasa
    { classId: kelas7B.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7B.id, teacherId: guru1.id, subjectId: mapel4.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7B.id, teacherId: guru2.id, subjectId: mapel3.id, dayOfWeek: DayOfWeek.TUESDAY, startTime: "10:15", endTime: "11:45" },
    // Rabu
    { classId: kelas7B.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7B.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7B.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "10:15", endTime: "11:45" },
    // Kamis
    { classId: kelas7B.id, teacherId: guru2.id, subjectId: mapel3.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7B.id, teacherId: guru1.id, subjectId: mapel4.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "08:30", endTime: "10:00" },
    { classId: kelas7B.id, teacherId: guru2.id, subjectId: mapel2.id, dayOfWeek: DayOfWeek.THURSDAY, startTime: "10:15", endTime: "11:45" },
    // Jumat
    { classId: kelas7B.id, teacherId: guru3.id, subjectId: mapel5.id, dayOfWeek: DayOfWeek.FRIDAY, startTime: "07:00", endTime: "08:30" },
    { classId: kelas7B.id, teacherId: guru1.id, subjectId: mapel1.id, dayOfWeek: DayOfWeek.FRIDAY, startTime: "08:30", endTime: "10:00" },
  ];

  await prisma.schedule.createMany({
    data: jadwalData.map((j) => ({
      ...j,
      semesterId: semesterGanjil.id,
      academicYearId: tahunAjaran.id,
    })),
  });
  console.log("✓ Created jadwal pelajaran");

  // ─── Bobot Nilai ────────────────────────────
  const bobotData = [
    { subjectId: mapel1.id, semesterId: semesterGanjil.id, assignmentWeight: 30, midtermWeight: 30, finalExamWeight: 40 },
    { subjectId: mapel2.id, semesterId: semesterGanjil.id, assignmentWeight: 30, midtermWeight: 30, finalExamWeight: 40 },
    { subjectId: mapel3.id, semesterId: semesterGanjil.id, assignmentWeight: 30, midtermWeight: 30, finalExamWeight: 40 },
    { subjectId: mapel4.id, semesterId: semesterGanjil.id, assignmentWeight: 30, midtermWeight: 30, finalExamWeight: 40 },
    { subjectId: mapel5.id, semesterId: semesterGanjil.id, assignmentWeight: 30, midtermWeight: 30, finalExamWeight: 40 },
  ];

  await prisma.gradeWeight.createMany({ data: bobotData });
  console.log("✓ Created grade weights");

  // ─── Absensi Contoh (2 minggu) ─────────────
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  const allStudents = [siswa1, siswa2, siswa3, siswa4, siswa5, siswa6];
  const attendanceStatuses = [
    AttendanceStatus.HADIR,
    AttendanceStatus.HADIR,
    AttendanceStatus.HADIR,
    AttendanceStatus.SAKIT,
    AttendanceStatus.IZIN,
  ];

  const attendanceData = [];
  for (let d = new Date(twoWeeksAgo); d <= today; d.setDate(d.getDate() + 1)) {
    // Skip Sunday
    if (d.getDay() === 0) continue;

    for (const student of allStudents) {
      const randomStatus =
        attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
      attendanceData.push({
        studentId: student.id,
        classId: student.classId,
        semesterId: semesterGanjil.id,
        academicYearId: tahunAjaran.id,
        date: new Date(d),
        status: randomStatus,
        createdById: guru1.id,
      });
    }
  }

  await prisma.attendance.createMany({ data: attendanceData });
  console.log("✓ Created sample attendance data");

  // ─── Nilai Contoh ───────────────────────────
  const nilaiData = [];
  const mapels = [mapel1, mapel2, mapel3, mapel4, mapel5];
  const kelasAStudents = [siswa1, siswa2, siswa3];
  const kelasBStudents = [siswa4, siswa5, siswa6];

  // Nilai untuk kelas 7A (guru sesuai jadwal)
  for (const student of kelasAStudents) {
    for (const mapel of mapels) {
      const assignment = Math.floor(Math.random() * 30) + 65; // 65-95
      const midterm = Math.floor(Math.random() * 30) + 65; // 65-95
      const finalExam = Math.floor(Math.random() * 30) + 65; // 65-95
      const finalScore = assignment * 0.3 + midterm * 0.3 + finalExam * 0.4;

      // Tentukan guru pengampu berdasarkan mapel
      let teacherId = guru1.id;
      if (mapel.id === mapel2.id) teacherId = guru2.id; // Bahasa Indonesia Budi
      if (mapel.id === mapel3.id) teacherId = guru2.id; // Bahasa Inggris Budi
      if (mapel.id === mapel5.id) teacherId = guru3.id; // IPS Ratna

      nilaiData.push({
        studentId: student.id,
        classId: kelas7A.id,
        subjectId: mapel.id,
        teacherId,
        semesterId: semesterGanjil.id,
        academicYearId: tahunAjaran.id,
        assignmentScore: assignment,
        midtermScore: midterm,
        finalExamScore: finalExam,
        finalScore: Math.round(finalScore * 100) / 100,
      });
    }
  }

  // Nilai untuk kelas 7B
  for (const student of kelasBStudents) {
    for (const mapel of mapels) {
      const assignment = Math.floor(Math.random() * 30) + 60; // 60-90
      const midterm = Math.floor(Math.random() * 30) + 60; // 60-90
      const finalExam = Math.floor(Math.random() * 30) + 60; // 60-90
      const finalScore = assignment * 0.3 + midterm * 0.3 + finalExam * 0.4;

      let teacherId = guru2.id; // Budiwali kelas 7B
      if (mapel.id === mapel1.id) teacherId = guru1.id; // Matematika Siti
      if (mapel.id === mapel4.id) teacherId = guru1.id; // IPA Siti
      if (mapel.id === mapel5.id) teacherId = guru3.id; // IPS Ratna

      nilaiData.push({
        studentId: student.id,
        classId: kelas7B.id,
        subjectId: mapel.id,
        teacherId,
        semesterId: semesterGanjil.id,
        academicYearId: tahunAjaran.id,
        assignmentScore: assignment,
        midtermScore: midterm,
        finalExamScore: finalExam,
        finalScore: Math.round(finalScore * 100) / 100,
      });
    }
  }

  await prisma.grade.createMany({ data: nilaiData });
  console.log("✓ Created sample grade data");

  // ─── Rapor Contoh ──────────────────────────
  for (const student of allStudents) {
    await prisma.reportCard.create({
      data: {
        studentId: student.id,
        classId: student.classId,
        semesterId: semesterGanjil.id,
        academicYearId: tahunAjaran.id,
        note: "Rapor semester ganjil 2025/2026. Siswa menunjukkan perkembangan yang baik.",
      },
    });
  }
  console.log("✓ Created report cards");

  console.log("\n✅ Seed completed!");
  console.log("\n📋 Akun Demo:");
  console.log("  Admin:          admin@smpdemo.test / password123");
  console.log("  Guru:           guru@smpdemo.test / password123");
  console.log("  Siswa:          siswa@smpdemo.test / password123");
  console.log("  Kepala Sekolah: kepala@smpdemo.test / password123");
  console.log("  Orang Tua:     orangtua@smpdemo.test / password123");
  console.log("\n📊 Data:");
  console.log(`  - 6 siswa di kelas VII-A dan VII-B`);
  console.log(`  - 3 guru pengampu`);
  console.log(`  - 5 mata pelajaran`);
  console.log(`  - 14 jadwal per minggu`);
  console.log(`  - ${attendanceData.length} data absensi`);
  console.log(`  - ${nilaiData.length} data nilai`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });