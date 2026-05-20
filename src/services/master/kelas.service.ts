// ══════════════════════════════════════════════
// Service: Kelas
// Logika bisnis untuk master data kelas
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  CreateKelasInput,
  UpdateKelasInput,
  SearchKelasInput,
} from "@/schemas/kelas.schema";

function buildKelasWhere(input: SearchKelasInput) {
  const where: Prisma.ClassWhereInput = { isDeleted: false };
  if (input.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (input.academicYearId) {
    where.academicYearId = input.academicYearId;
  }
  return where;
}

// ─── List & Search ────────────────────────────

export async function searchKelas(input: SearchKelasInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = buildKelasWhere(input);

  const [total, items] = await Promise.all([
    prisma.class.count({ where }),
    prisma.class.findMany({
      where,
      include: {
        academicYear: { select: { id: true, name: true } },
        homeroomTeacher: { select: { id: true, name: true } },
        _count: {
          select: {
            students: { where: { isDeleted: false } },
            schedules: true,
          },
        },
      },
      orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
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

export async function getKelasById(id: string) {
  return prisma.class.findUnique({
    where: { id, isDeleted: false },
    include: {
      academicYear: { select: { id: true, name: true } },
      homeroomTeacher: { select: { id: true, name: true } },
      students: {
        where: { isDeleted: false },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

// ─── Create ──────────────────────────────────

export async function createKelas(input: CreateKelasInput) {
  // Cek nama+ta unik
  const existing = await prisma.class.findFirst({
    where: { name: input.name, academicYearId: input.academicYearId },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Kelas dengan nama ini sudah ada pada tahun ajaran tersebut");
  }

  return prisma.class.create({
    data: {
      name: input.name,
      gradeLevel: input.gradeLevel,
      academicYearId: input.academicYearId,
      homeroomTeacherId: input.homeroomTeacherId || null,
    },
    include: {
      academicYear: { select: { name: true } },
      homeroomTeacher: { select: { name: true } },
    },
  });
}

// ─── Update ──────────────────────────────────

export async function updateKelas(input: UpdateKelasInput) {
  // Cek nama+ta unik (exclude diri sendiri)
  const existing = await prisma.class.findFirst({
    where: {
      name: input.name,
      academicYearId: input.academicYearId,
      id: { not: input.id },
      isDeleted: false,
    },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Kelas dengan nama ini sudah ada pada tahun ajaran tersebut");
  }

  return prisma.class.update({
    where: { id: input.id },
    data: {
      name: input.name,
      gradeLevel: input.gradeLevel,
      academicYearId: input.academicYearId,
      homeroomTeacherId: input.homeroomTeacherId || null,
    },
    include: {
      academicYear: { select: { name: true } },
      homeroomTeacher: { select: { name: true } },
    },
  });
}

// ─── Soft Delete ─────────────────────────────
// Cek apakah kelas masih memiliki siswa aktif

export async function deleteKelas(id: string) {
  const studentCount = await prisma.student.count({
    where: { classId: id, isDeleted: false },
  });
  if (studentCount > 0) {
    throw new Error(
      `Kelas masih memiliki ${studentCount} siswa aktif. Pindahkan atau hapus siswa terlebih dahulu.`
    );
  }

  return prisma.class.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true },
  });
}

// ─── Options ─────────────────────────────────

export async function getAcademicYearOptions(activeOnly = false) {
  const where: Prisma.AcademicYearWhereInput = {};
  if (activeOnly) where.isActive = true;
  return prisma.academicYear.findMany({
    where,
    select: { id: true, name: true, isActive: true },
    orderBy: { name: "desc" },
  });
}