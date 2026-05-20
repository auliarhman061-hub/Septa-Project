// ══════════════════════════════════════════════
// Dashboard Service
// Sistem Informasi Akademik SMP
//
// Query data dashboard untuk setiap role.
// Dipanggil dari Server Components / Server Actions.
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { DAY_LABELS } from "@/lib/constants";
import { DayOfWeek } from "@prisma/client";

// ─── Shared Types ────────────────────────────

export type ActiveAcademicYear = {
  id: string;
  name: string;
};

export type ActiveSemester = {
  id: string;
  type: string;
};

// ══════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════

export async function getAdminDashboardData() {
  // Tahun ajaran & semester aktif
  const [academicYear, semester] = await Promise.all([
    prisma.academicYear.findFirst({ where: { isActive: true } }),
    prisma.semester.findFirst({ where: { isActive: true } }),
  ]);

  if (!academicYear || !semester) {
    return {
      stats: {
        totalSiswa: 0,
        totalGuru: 0,
        totalKelas: 0,
        totalMapel: 0,
        totalJadwal: 0,
        academicYear: null,
        semester: null,
      },
      kelasStats: [],
    };
  }

  // Counts paralel
  const [totalSiswa, totalGuru, totalKelas, totalMapel, totalJadwal, kelasStats] =
    await Promise.all([
      // Total siswa aktif
      prisma.student.count({
        where: { isDeleted: false, class: { academicYearId: academicYear.id } },
      }),

      // Total guru aktif
      prisma.teacher.count({ where: { isDeleted: false } }),

      // Total kelas aktif
      prisma.class.count({
        where: { isDeleted: false, academicYearId: academicYear.id },
      }),

      // Total mapel aktif
      prisma.subject.count({ where: { isDeleted: false } }),

      // Total jadwal aktif
      prisma.schedule.count({
        where: { academicYearId: academicYear.id, semesterId: semester.id },
      }),

      // Ringkasan per kelas
      prisma.class.findMany({
        where: { isDeleted: false, academicYearId: academicYear.id },
        select: {
          id: true,
          name: true,
          gradeLevel: true,
          homeroomTeacher: {
            select: { name: true },
          },
          _count: {
            select: { students: true },
          },
        },
        orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
      }),
    ]);

  return {
    stats: {
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalJadwal,
      academicYear,
      semester,
    },
    kelasStats: kelasStats.map((k) => ({
      id: k.id,
      name: k.name,
      gradeLevel: k.gradeLevel,
      waliKelas: k.homeroomTeacher?.name ?? "—",
      jumlahSiswa: k._count.students,
    })),
  };
}

// ══════════════════════════════════════════════
// GURU DASHBOARD
// ══════════════════════════════════════════════

export async function getGuruDashboardData(teacherId: string) {
  // Cek apakah teacher profile ada
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      name: true,
      nip: true,
      user: { select: { email: true } },
    },
  });

  if (!teacher) {
    return { hasProfile: false, teacher: null, data: null };
  }

  // Tahun ajaran & semester aktif
  const [academicYear, semester] = await Promise.all([
    prisma.academicYear.findFirst({ where: { isActive: true } }),
    prisma.semester.findFirst({ where: { isActive: true } }),
  ]);

  if (!academicYear || !semester) {
    return {
      hasProfile: true,
      teacher,
      data: {
        todaySchedule: [],
        weekSchedule: [],
        kelasCount: 0,
        mapelCount: 0,
        siswaCount: 0,
        kelasList: [],
      },
    };
  }

  // Hari ini
  const today = new Date();
  const dayNames: Record<number, string> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };
  const dayOfWeek = dayNames[today.getDay()] as
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";

  const isWeekday = dayOfWeek !== "SUNDAY" && dayOfWeek !== "SATURDAY";

  // Semua jadwal guru
  const allSchedule = await prisma.schedule.findMany({
    where: {
      teacherId,
      academicYearId: academicYear.id,
      semesterId: semester.id,
    },
    include: {
      class: { select: { id: true, name: true, gradeLevel: true } },
      subject: { select: { id: true, name: true, code: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Jadwal hari ini
  const todaySchedule = isWeekday
    ? allSchedule.filter((s) => s.dayOfWeek === dayOfWeek)
    : [];

  // Statistik
  const kelasIds = Array.from(new Set(allSchedule.map((s) => s.classId)));
  const mapelIds = Array.from(new Set(allSchedule.map((s) => s.subjectId)));

  // Hitung siswa dari kelas yang diajar
  const siswaCount = await prisma.student.count({
    where: {
      classId: { in: kelasIds },
      isDeleted: false,
    },
  });

  // Ringkasan jadwal minggu ini (Senin–Jumat)
  const weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
  ] as const;

  const weekSchedule = weekDays
    .map((day) => {
      const daySchedule = allSchedule.filter((s) => s.dayOfWeek === day);
      return {
        day,
        dayLabel: DAY_LABELS[day] ?? day,
        count: daySchedule.length,
      };
    })
    .filter((d) => d.count > 0);

  // Daftar kelas unik
  const kelasList = kelasIds
    .map((kelasId) => {
      const jadwal = allSchedule.find((s) => s.classId === kelasId);
      return jadwal?.class ?? null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.name.localeCompare(b!.name));

  return {
    hasProfile: true,
    teacher,
    data: {
      todaySchedule: todaySchedule.map((s) => ({
        id: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
        className: s.class.name,
        subjectName: s.subject.name,
        dayLabel: DAY_LABELS[s.dayOfWeek] ?? s.dayOfWeek,
      })),
      weekSchedule,
      kelasCount: kelasIds.length,
      mapelCount: mapelIds.length,
      siswaCount,
      kelasList: kelasList as {
        id: string;
        name: string;
        gradeLevel: number;
      }[],
    },
  };
}

// ══════════════════════════════════════════════
// SISWA DASHBOARD
// ══════════════════════════════════════════════

export async function getSiswaDashboardData(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId, isDeleted: false },
    include: {
      class: {
        include: {
          academicYear: { select: { name: true } },
          homeroomTeacher: { select: { name: true } },
        },
      },
      user: { select: { email: true } },
    },
  });

  if (!student) {
    return { hasProfile: false, student: null, data: null };
  }

  const academicYear = student.class.academicYear;
  const semester = await prisma.semester.findFirst({
    where: { isActive: true, academicYearId: student.class.academicYearId },
  });

  if (!semester) {
    return {
      hasProfile: true,
      student: {
        id: student.id,
        nis: student.nis,
        name: student.name,
        gender: student.gender,
        birthDate: student.birthDate,
        address: student.address,
        className: student.class.name,
        academicYearName: academicYear.name,
        waliKelas: student.class.homeroomTeacher?.name ?? "—",
      },
      data: {
        todaySchedule: [],
        attendanceSummary: null,
        gradesSummary: null,
      },
    };
  }

  // Jadwal hari ini
  const today = new Date();
  const dayNames: Record<number, string> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };
  const dayOfWeek = dayNames[today.getDay()];

  const todaySchedule = await prisma.schedule.findMany({
    where: {
      classId: student.classId,
      academicYearId: student.class.academicYearId,
      semesterId: semester.id,
      dayOfWeek: dayOfWeek as DayOfWeek,
    },
    include: {
      subject: { select: { name: true } },
      teacher: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Ringkasan absensi semester ini
  const attendanceRaw = await prisma.attendance.groupBy({
    by: ["status"],
    where: {
      studentId,
      semesterId: semester.id,
    },
    _count: { status: true },
  });

  const attendanceMap: Record<string, number> = {};
  for (const row of attendanceRaw) {
    attendanceMap[row.status] = row._count.status;
  }

  const totalHari = Object.values(attendanceMap).reduce((a, b) => a + b, 0);
  const attendanceSummary = {
    hadir: attendanceMap["HADIR"] ?? 0,
    sakit: attendanceMap["SAKIT"] ?? 0,
    izin: attendanceMap["IZIN"] ?? 0,
    alfa: attendanceMap["ALFA"] ?? 0,
    total: totalHari,
    presentasi: totalHari > 0
      ? Math.round(((attendanceMap["HADIR"] ?? 0) / totalHari) * 100)
      : 0,
  };

  // Ringkasan nilai terbaru
  const grades = await prisma.grade.findMany({
    where: {
      studentId,
      semesterId: semester.id,
    },
    include: {
      subject: { select: { name: true } },
    },
    orderBy: { subject: { name: "asc" } },
  });

  const gradesSummary = grades.length > 0
    ? {
        subjects: grades.map((g) => ({
          subjectName: g.subject.name,
          assignmentScore: g.assignmentScore,
          midtermScore: g.midtermScore,
          finalExamScore: g.finalExamScore,
          finalScore: g.finalScore,
        })),
        rataRata:
          Math.round(
            (grades.reduce((sum, g) => sum + g.finalScore, 0)) / grades.length * 10
          ) / 10,
      }
    : null;

  return {
    hasProfile: true,
    student: {
      id: student.id,
      nis: student.nis,
      name: student.name,
      gender: student.gender,
      birthDate: student.birthDate,
      address: student.address,
      className: student.class.name,
      academicYearName: academicYear.name,
      waliKelas: student.class.homeroomTeacher?.name ?? "—",
    },
    data: {
      todaySchedule: todaySchedule.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        subjectName: s.subject.name,
        teacherName: s.teacher.name,
      })),
      attendanceSummary,
      gradesSummary,
    },
  };
}

// ══════════════════════════════════════════════
// KEPALA SEKOLAH DASHBOARD
// ══════════════════════════════════════════════

export async function getKepalaSekolahDashboardData() {
  const [academicYear, semester] = await Promise.all([
    prisma.academicYear.findFirst({ where: { isActive: true } }),
    prisma.semester.findFirst({ where: { isActive: true } }),
  ]);

  if (!academicYear || !semester) {
    return {
      stats: { totalSiswa: 0, totalGuru: 0, totalKelas: 0, totalMapel: 0 },
      kelasStats: [],
      weekScheduleCount: 0,
    };
  }

  const [totalSiswa, totalGuru, totalKelas, totalMapel, kelasStats] =
    await Promise.all([
      prisma.student.count({
        where: { isDeleted: false, class: { academicYearId: academicYear.id } },
      }),
      prisma.teacher.count({ where: { isDeleted: false } }),
      prisma.class.count({
        where: { isDeleted: false, academicYearId: academicYear.id },
      }),
      prisma.subject.count({ where: { isDeleted: false } }),

      // Stats per kelas
      prisma.class.findMany({
        where: { isDeleted: false, academicYearId: academicYear.id },
        include: {
          homeroomTeacher: { select: { name: true } },
          students: { where: { isDeleted: false } },
          _count: { select: { schedules: true } },
        },
        orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
      }),
    ]);

  // Hitung rata-rata nilai & absensi per kelas
  const kelasStatsWithAggregates = await Promise.all(
    kelasStats.map(async (kelas) => {
      // Rata-rata nilai kelas
      const avgGrade = await prisma.grade.aggregate({
        where: { classId: kelas.id, semesterId: semester.id },
        _avg: { finalScore: true },
      });

      // Ringkasan absensi kelas
      const attendanceRaw = await prisma.attendance.groupBy({
        by: ["status"],
        where: { classId: kelas.id, semesterId: semester.id },
        _count: { status: true },
      });

      const attMap: Record<string, number> = {};
      let totalAtt = 0;
      for (const r of attendanceRaw) {
        attMap[r.status] = r._count.status;
        totalAtt += r._count.status;
      }

      return {
        id: kelas.id,
        name: kelas.name,
        gradeLevel: kelas.gradeLevel,
        waliKelas: kelas.homeroomTeacher?.name ?? "—",
        jumlahSiswa: kelas.students.length,
        avgNilai: avgGrade._avg.finalScore
          ? Math.round(avgGrade._avg.finalScore * 10) / 10
          : null,
        hadir: attMap["HADIR"] ?? 0,
        alfa: attMap["ALFA"] ?? 0,
        totalAttendance: totalAtt,
        hadirPersen:
          totalAtt > 0
            ? Math.round((attMap["HADIR"] / totalAtt) * 100)
            : 0,
      };
    })
  );

  // Jumlah jadwal minggu ini (Senin–Jumat)
  const weekScheduleCount = await prisma.schedule.count({
    where: {
      academicYearId: academicYear.id,
      semesterId: semester.id,
      dayOfWeek: { in: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] },
    },
  });

  return {
    stats: { totalSiswa, totalGuru, totalKelas, totalMapel },
    kelasStats: kelasStatsWithAggregates,
    weekScheduleCount,
    academicYear,
    semester,
  };
}

// ══════════════════════════════════════════════
// ORANG TUA DASHBOARD
// ══════════════════════════════════════════════

export async function getOrangTuaDashboardData(parentId: string) {
  // Cek apakah parent profile ada
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: {
      students: {
        include: {
          student: {
            include: {
              class: {
                include: {
                  academicYear: { select: { name: true } },
                },
              },
              grades: {
                where: { semester: { isActive: true } },
                include: { subject: { select: { name: true } } },
                orderBy: { subject: { name: "asc" } },
              },
              attendances: {
                where: { semester: { isActive: true } },
              },
              reportCards: {
                where: { semester: { isActive: true } },
                include: {
                  semester: { select: { type: true } },
                  academicYear: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!parent) {
    return { hasProfile: false, parent: null, children: [] };
  }

  // Tahun ajaran aktif
  const academicYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
  });

  const _academicYear = academicYear;
  const children = parent.students.map((ps) => {
    const student = ps.student;
    const grades = student.grades ?? [];
    const attendances = student.attendances ?? [];
    const reportCards = student.reportCards ?? [];

    // Ringkasan absensi
    const attMap: Record<string, number> = {};
    for (const att of attendances) {
      attMap[att.status] = (attMap[att.status] ?? 0) + 1;
    }
    const totalAtt = attendances.length;

    // Ringkasan nilai
    const totalScore = grades.reduce((s, g) => s + g.finalScore, 0);
    const rataRata =
      grades.length > 0
        ? Math.round((totalScore / grades.length) * 10) / 10
        : null;

    return {
      id: student.id,
      name: student.name,
      nis: student.nis,
      className: student.class.name,
      academicYearName: student.class.academicYear.name,
      attendanceSummary: {
        hadir: attMap["HADIR"] ?? 0,
        sakit: attMap["SAKIT"] ?? 0,
        izin: attMap["IZIN"] ?? 0,
        alfa: attMap["ALFA"] ?? 0,
        total: totalAtt,
        hadirPersen:
          totalAtt > 0 ? Math.round((attMap["HADIR"] / totalAtt) * 100) : 0,
      },
      gradesSummary: {
        rataRata,
        totalMapel: grades.length,
        subjects: grades.slice(0, 3).map((g) => ({
          subjectName: g.subject.name,
          finalScore: g.finalScore,
        })),
      },
      hasReportCard: reportCards.length > 0,
      latestReportCard: reportCards[0] ?? null,
    };
  });

  return {
    hasProfile: true,
    parent: {
      id: parent.id,
      name: parent.name,
      phone: parent.phone,
    },
    children,
  };
}
