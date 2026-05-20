// ══════════════════════════════════════════════
// Service: Absensi
// Logika bisnis absensi siswa
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma, AttendanceStatus } from "@prisma/client";
import type { InputAbsensiInput, SearchAbsensiInput } from "@/schemas/absensi.schema";

// ─── Normalize date ─────────────────────────
// Simpan sebagai UTC midnight agar konsisten timezone

function toUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

// ─── Check teacher's authorized classes ──────

export async function getTeacherAuthorizedClasses(teacherId: string) {
  const schedules = await prisma.schedule.findMany({
    where: { teacherId },
    select: { classId: true },
    distinct: ["classId"],
  });
  return schedules.map((s) => s.classId);
}

// ─── Get students in class ───────────────────

export async function getStudentsInClass(classId: string) {
  return prisma.student.findMany({
    where: { classId, isDeleted: false },
    select: {
      id: true,
      name: true,
      nis: true,
      gender: true,
    },
    orderBy: { name: "asc" },
  });
}

// ─── Get existing attendance for class+date ─

export async function getExistingAttendance(classId: string, dateStr: string) {
  const date = toUTCDate(dateStr);
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return prisma.attendance.findMany({
    where: {
      classId,
      date: { gte: start, lte: end },
    },
    select: {
      id: true,
      studentId: true,
      status: true,
      date: true,
      student: { select: { name: true, nis: true } },
    },
    orderBy: { student: { name: "asc" } },
  });
}

// ─── Save attendance (delete + create batch) ───

export async function saveAttendanceBatch(input: InputAbsensiInput, teacherId?: string) {
  const date = toUTCDate(input.date);
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  // Get semester
  const semester = await prisma.semester.findUnique({
    where: { id: input.semesterId },
    select: { academicYearId: true },
  });
  if (!semester) throw new Error("Semester tidak ditemukan");

  // Delete existing
  await prisma.attendance.deleteMany({
    where: {
      classId: input.classId,
      date: { gte: start, lte: end },
    },
  });

  // Build records
  const records = Object.entries(input.attendances)
    .filter(([, s]) => !!s)
    .map(([studentId, status]) => ({
      studentId,
      classId: input.classId,
      semesterId: input.semesterId,
      academicYearId: semester.academicYearId,
      date,
      status: status as AttendanceStatus,
      createdById: teacherId ?? null,
    }));

  if (records.length === 0) return { saved: 0 };

  await prisma.attendance.createMany({ data: records });
  return { saved: records.length };
}

// ─── Search / Recap attendance ───────────────

function buildWhere(input: SearchAbsensiInput): Prisma.AttendanceWhereInput {
  const where: Prisma.AttendanceWhereInput = {};
  if (input.q) {
    where.student = {
      OR: [
        { name: { contains: input.q, mode: "insensitive" } },
        { nis: { contains: input.q, mode: "insensitive" } },
      ],
    };
  }
  if (input.classId) where.classId = input.classId;
  if (input.studentId) where.studentId = input.studentId;
  if (input.semesterId) where.semesterId = input.semesterId;
  if (input.status) where.status = input.status as AttendanceStatus;

  if (input.startDate) {
    const d = toUTCDate(input.startDate);
    d.setUTCHours(0, 0, 0, 0);
    where.date = { ...(where.date as object), gte: d };
  }
  if (input.endDate) {
    const d = toUTCDate(input.endDate);
    d.setUTCHours(23, 59, 59, 999);
    where.date = { ...(where.date as object), lte: d };
  }

  return where;
}

export async function searchAbsensi(input: SearchAbsensiInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 20;
  const skip = (page - 1) * limit;
  const where = buildWhere(input);

  const [total, items] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, nis: true } },
        class: { select: { id: true, name: true } },
        semester: { select: { type: true, academicYear: { select: { name: true } } } },
        createdBy: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
return { items: items as any, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Options for select ──────────────────────

export async function getAbsensiOptions() {
  const activeAy = await prisma.academicYear.findFirst({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  const semesters = activeAy
    ? await prisma.semester.findMany({
        where: { academicYearId: activeAy.id },
        select: { id: true, type: true },
        orderBy: { type: "asc" },
      })
    : [];

  const activeSem = semesters.find((s) => s.type === "GANJIL") ?? semesters[0];

  const classes = await prisma.class.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, gradeLevel: true },
    orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
  });

  return { activeAcademicYear: activeAy, activeSemester: activeSem, semesters, classes };
}

// ─── Student attendance history ──────────────

export async function getStudentAttendanceHistory(studentId: string, semesterId?: string) {
  const where: Prisma.AttendanceWhereInput = { studentId };
  if (semesterId) where.semesterId = semesterId;
  return prisma.attendance.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, nis: true } },
      class: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });
}

// ─── All classes recap for principal ────────

export async function getAllClassesAbsensiRecap(semesterId?: string) {
  const activeAy = await prisma.academicYear.findFirst({
    where: { isActive: true },
    select: { id: true },
  });

  const semesters = activeAy
    ? await prisma.semester.findMany({
        where: { academicYearId: activeAy.id },
        select: { id: true, type: true },
        orderBy: { type: "asc" },
      })
    : [];

  const classes = await prisma.class.findMany({
    where: { isDeleted: false, ...(activeAy ? { academicYearId: activeAy.id } : {}) },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      homeroomTeacher: { select: { name: true } },
      _count: { select: { students: { where: { isDeleted: false } } } },
    },
    orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
  });

  const classRecaps = await Promise.all(
    classes.map(async (cls) => {
      const where: Prisma.AttendanceWhereInput = { classId: cls.id };
      if (semesterId) where.semesterId = semesterId;

      const raw = await prisma.attendance.groupBy({
        by: ["status"],
        where,
        _count: { status: true },
      });

      const attMap: Record<string, number> = {};
      let total = 0;
      for (const r of raw) { attMap[r.status] = r._count.status; total += r._count.status; }

      return {
        ...cls,
        summary: {
          hadir: attMap["HADIR"] ?? 0,
          sakit: attMap["SAKIT"] ?? 0,
          izin: attMap["IZIN"] ?? 0,
          alfa: attMap["ALFA"] ?? 0,
          total,
          presentasi: total > 0 ? Math.round((attMap["HADIR"] ?? 0)/total*100) : 0,
        },
      };
    })
  );

  return { classes: classRecaps, semesters };
}

// ─── Children absensi for parent ────────────

export async function getChildrenAbsensi(parentId: string, semesterId?: string) {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: {
      students: {
        include: {
          student: {
            include: {
              class: { include: { academicYear: { select: { name: true } } } },
              attendances: semesterId
                ? { where: { semesterId } }
                : undefined,
            },
          },
        },
      },
    },
  });

  if (!parent) return [];

  return parent.students.map((ps) => {
    const student = ps.student;
    const attMap: Record<string, number> = {};
    let total = 0;
    for (const a of student.attendances ?? []) {
      attMap[a.status] = (attMap[a.status] ?? 0) + 1;
      total++;
    }
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
        total,
        hadirPersen: total > 0 ? Math.round((attMap["HADIR"] ?? 0) / total * 100) : 0,
      },
    };
  });
}
