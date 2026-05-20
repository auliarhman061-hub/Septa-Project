// ══════════════════════════════════════════════
// Service: Jadwal
// Logika bisnis jadwal pelajaran
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma, DayOfWeek } from "@prisma/client";
import type {
  CreateJadwalInput,
  UpdateJadwalInput,
  SearchJadwalInput,
} from "@/schemas/jadwal.schema";

// ─── Helper: parse time string to minutes ────

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// ─── Helper: check time overlap ─────────────

function hasOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  const ns = timeToMinutes(newStart);
  const ne = timeToMinutes(newEnd);
  const es = timeToMinutes(existingStart);
  const ee = timeToMinutes(existingEnd);
  return ns < ee && ne > es;
}

// ─── List & Search ──────��─────────────────────

function buildJadwalWhere(input: SearchJadwalInput): Prisma.ScheduleWhereInput {
  const where: Prisma.ScheduleWhereInput = {};
  if (input.q) {
    where.OR = [
      { class: { name: { contains: input.q, mode: "insensitive" } } },
      { subject: { name: { contains: input.q, mode: "insensitive" } } },
      { teacher: { name: { contains: input.q, mode: "insensitive" } } },
    ];
  }
  if (input.classId) where.classId = input.classId;
  if (input.teacherId) where.teacherId = input.teacherId;
  if (input.subjectId) where.subjectId = input.subjectId;
  if (input.dayOfWeek) where.dayOfWeek = input.dayOfWeek as Prisma.EnumDayOfWeekFilter;
  if (input.semesterId) where.semesterId = input.semesterId;
  if (input.academicYearId) where.academicYearId = input.academicYearId;
  return where;
}

export async function searchJadwal(input: SearchJadwalInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;
  const where = buildJadwalWhere(input);

  const [total, items] = await Promise.all([
    prisma.schedule.count({ where }),
    prisma.schedule.findMany({
      where,
      include: {
        class: {
          select: { id: true, name: true, gradeLevel: true },
        },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, name: true } },
        semester: { select: { id: true, type: true } },
        academicYear: { select: { id: true, name: true } },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
      skip,
      take: limit,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getJadwalById(id: string) {
  return prisma.schedule.findUnique({
    where: { id },
    include: {
      class: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true, code: true } },
      teacher: { select: { id: true, name: true } },
      semester: { select: { id: true, type: true } },
      academicYear: { select: { id: true, name: true } },
    },
  });
}

// ─── Conflict Detection ───────────────────────

type ConflictError = {
  type: "TEACHER_CONFLICT" | "CLASS_CONFLICT";
  message: string;
  existingScheduleId?: string;
};

function checkConflicts(
  existingSchedules: Array<{
    id: string;
    startTime: string;
    endTime: string;
    subject: { name: string };
  }>,
  newStart: string,
  newEnd: string,
  entityName: string,
  conflictType: "TEACHER_CONFLICT" | "CLASS_CONFLICT"
): ConflictError | null {
  for (const existing of existingSchedules) {
    if (hasOverlap(newStart, newEnd, existing.startTime, existing.endTime)) {
      return {
        type: conflictType,
        message: `${entityName} sudah memiliki jadwal "${existing.subject.name}" pada jam yang sama (${existing.startTime}–${existing.endTime}).`,
        existingScheduleId: existing.id,
      };
    }
  }
  return null;
}

// ─── Create ──────────────────────────────────

export async function createJadwal(input: CreateJadwalInput): Promise<{ data?: Awaited<ReturnType<typeof prisma.schedule.create>>; error?: ConflictError | Error }> {
  // Cek guru valid & tidak deleted
  const teacher = await prisma.teacher.findUnique({
    where: { id: input.teacherId, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!teacher) return { error: new Error("Guru tidak ditemukan atau sudah dihapus") };

  // Cek kelas valid & tidak deleted
  const classData = await prisma.class.findUnique({
    where: { id: input.classId, isDeleted: false },
    select: { id: true, name: true, gradeLevel: true },
  });
  if (!classData) return { error: new Error("Kelas tidak ditemukan atau sudah dihapus") };

  // Cek mapel valid & tidak deleted
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!subject) return { error: new Error("Mata pelajaran tidak ditemukan atau sudah dihapus") };

  // Cek guru bentrok
  const teacherSchedules = await prisma.schedule.findMany({
    where: {
      teacherId: input.teacherId,
      dayOfWeek: input.dayOfWeek as DayOfWeek,
      semesterId: input.semesterId,
    },
    select: { id: true, startTime: true, endTime: true, subject: { select: { name: true } } },
  });
  const teacherConflict = checkConflicts(
    teacherSchedules,
    input.startTime,
    input.endTime,
    `Guru ${teacher.name}`,
    "TEACHER_CONFLICT"
  );
  if (teacherConflict) return { error: teacherConflict };

  // Cek kelas bentrok
  const classSchedules = await prisma.schedule.findMany({
    where: {
      classId: input.classId,
      dayOfWeek: input.dayOfWeek as DayOfWeek,
      semesterId: input.semesterId,
    },
    select: { id: true, startTime: true, endTime: true, subject: { select: { name: true } } },
  });
  const classConflict = checkConflicts(
    classSchedules,
    input.startTime,
    input.endTime,
    `Kelas ${classData.name}`,
    "CLASS_CONFLICT"
  );
  if (classConflict) return { error: classConflict };

  const data = await prisma.schedule.create({
    data: {
      classId: input.classId,
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      academicYearId: input.academicYearId,
      semesterId: input.semesterId,
      dayOfWeek: input.dayOfWeek as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY",
      startTime: input.startTime,
      endTime: input.endTime,
    },
    include: {
      class: { select: { name: true } },
      subject: { select: { name: true } },
      teacher: { select: { name: true } },
    },
  });

  return { data };
}

// ─── Update ──────────────────────────────────

export async function updateJadwal(input: UpdateJadwalInput): Promise<{ data?: Awaited<ReturnType<typeof prisma.schedule.update>>; error?: ConflictError | Error }> {
  // Cek jadwal ada
  const existing = await prisma.schedule.findUnique({
    where: { id: input.id },
    select: { id: true, teacherId: true, classId: true },
  });
  if (!existing) return { error: new Error("Jadwal tidak ditemukan") };

  // Cek guru valid & tidak deleted
  const teacher = await prisma.teacher.findUnique({
    where: { id: input.teacherId, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!teacher) return { error: new Error("Guru tidak ditemukan atau sudah dihapus") };

  // Cek kelas valid & tidak deleted
  const classData = await prisma.class.findUnique({
    where: { id: input.classId, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!classData) return { error: new Error("Kelas tidak ditemukan atau sudah dihapus") };

  // Cek mapel valid & tidak deleted
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!subject) return { error: new Error("Mata pelajaran tidak ditemukan atau sudah dihapus") };

  // Cek guru bentrok (exclude self)
  const teacherSchedules = await prisma.schedule.findMany({
    where: {
      teacherId: input.teacherId,
      dayOfWeek: input.dayOfWeek as DayOfWeek,
      semesterId: input.semesterId,
      id: { not: input.id },
    },
    select: { id: true, startTime: true, endTime: true, subject: { select: { name: true } } },
  });
  const teacherConflict = checkConflicts(
    teacherSchedules,
    input.startTime,
    input.endTime,
    `Guru ${teacher.name}`,
    "TEACHER_CONFLICT"
  );
  if (teacherConflict) return { error: teacherConflict };

  // Cek kelas bentrok (exclude self)
  const classSchedules = await prisma.schedule.findMany({
    where: {
      classId: input.classId,
      dayOfWeek: input.dayOfWeek as DayOfWeek,
      semesterId: input.semesterId,
      id: { not: input.id },
    },
    select: { id: true, startTime: true, endTime: true, subject: { select: { name: true } } },
  });
  const classConflict = checkConflicts(
    classSchedules,
    input.startTime,
    input.endTime,
    `Kelas ${classData.name}`,
    "CLASS_CONFLICT"
  );
  if (classConflict) return { error: classConflict };

  const data = await prisma.schedule.update({
    where: { id: input.id },
    data: {
      classId: input.classId,
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      academicYearId: input.academicYearId,
      semesterId: input.semesterId,
      dayOfWeek: input.dayOfWeek as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY",
      startTime: input.startTime,
      endTime: input.endTime,
    },
    include: {
      class: { select: { name: true } },
      subject: { select: { name: true } },
      teacher: { select: { name: true } },
    },
  });

  return { data };
}

// ─── Delete ──────────────────────────────────

export async function deleteJadwal(id: string) {
  const existing = await prisma.schedule.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new Error("Jadwal tidak ditemukan");
  return prisma.schedule.delete({
    where: { id },
    select: { id: true },
  });
}

// ─── Options (for selects) ───────────────────

export async function getJadwalOptions() {
  const [activeAcademicYear, activeSemester] = await Promise.all([
    prisma.academicYear.findFirst({
      where: { isActive: true },
      select: { id: true, name: true },
    }),
    prisma.semester.findFirst({
      where: { isActive: true },
      select: { id: true, type: true },
    }),
  ]);

  const [classes, teachers, subjects, semesters, academicYears] = await Promise.all([
    prisma.class.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, gradeLevel: true },
      orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
    }),
    prisma.teacher.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.semester.findMany({
      select: { id: true, type: true, academicYearId: true },
      orderBy: { academicYear: { name: "desc" } },
    }),
    prisma.academicYear.findMany({
      select: { id: true, name: true, isActive: true },
      orderBy: { name: "desc" },
    }),
  ]);

  return { classes, teachers, subjects, semesters, academicYears, activeAcademicYear, activeSemester };
}

// ─── Read-only jadwal for guru ───────────────

export async function getGuruSchedule(teacherId: string, semesterId?: string, academicYearId?: string) {
  const where: Prisma.ScheduleWhereInput = { teacherId };
  if (semesterId) where.semesterId = semesterId;
  if (academicYearId) where.academicYearId = academicYearId;

  return prisma.schedule.findMany({
    where,
    include: {
      class: { select: { id: true, name: true, gradeLevel: true } },
      subject: { select: { id: true, name: true, code: true } },
      semester: { select: { type: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

// ─── Read-only jadwal untuk siswa ────────────

export async function getSiswaSchedule(classId: string, semesterId?: string, academicYearId?: string) {
  const where: Prisma.ScheduleWhereInput = { classId };
  if (semesterId) where.semesterId = semesterId;
  if (academicYearId) where.academicYearId = academicYearId;

  return prisma.schedule.findMany({
    where,
    include: {
      subject: { select: { id: true, name: true, code: true } },
      teacher: { select: { id: true, name: true } },
      semester: { select: { type: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}