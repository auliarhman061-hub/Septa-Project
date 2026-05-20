// ══════════════════════════════════════════════
// Service: Mata Pelajaran
// Logika bisnis untuk master data mata pelajaran
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  CreateMapelInput,
  UpdateMapelInput,
  SearchMapelInput,
} from "@/schemas/mapel.schema";

function buildMapelWhere(input: SearchMapelInput) {
  const where: Prisma.SubjectWhereInput = { isDeleted: false };
  if (input.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
      { code: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (input.gradeLevel) {
    where.gradeLevel = input.gradeLevel;
  }
  return where;
}

// ─── List & Search ────────────────────────────

export async function searchMapel(input: SearchMapelInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = buildMapelWhere(input);

  const [total, items] = await Promise.all([
    prisma.subject.count({ where }),
    prisma.subject.findMany({
      where,
      include: {
        _count: {
          select: { schedules: true, teachers: true },
        },
      },
      orderBy: { name: "asc" },
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

export async function getMapelById(id: string) {
  return prisma.subject.findUnique({
    where: { id, isDeleted: false },
    include: {
      teachers: {
        include: { teacher: { select: { id: true, name: true } } },
      },
    },
  });
}

// ─── Create ──────────────────────────────────

export async function createMapel(input: CreateMapelInput) {
  // Cek kode unik
  const existing = await prisma.subject.findUnique({
    where: { code: input.code },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Kode mata pelajaran sudah digunakan");
  }

  return prisma.subject.create({
    data: {
      code: input.code,
      name: input.name,
      gradeLevel: input.gradeLevel ?? null,
    },
  });
}

// ─── Update ──────────────────────────────────

export async function updateMapel(input: UpdateMapelInput) {
  // Cek kode unik
  const existing = await prisma.subject.findFirst({
    where: {
      code: input.code,
      id: { not: input.id },
      isDeleted: false,
    },
    select: { id: true },
  });
  if (existing) {
    throw new Error("Kode mata pelajaran sudah digunakan");
  }

  return prisma.subject.update({
    where: { id: input.id },
    data: {
      code: input.code,
      name: input.name,
      gradeLevel: input.gradeLevel ?? null,
    },
  });
}

// ─── Soft Delete ─────────────────────────────
// Cek apakah mapel masih dipakai jadwal aktif

export async function deleteMapel(id: string) {
  const scheduleCount = await prisma.schedule.count({
    where: { subjectId: id },
  });
  if (scheduleCount > 0) {
    throw new Error(
      `Mata pelajaran masih digunakan di ${scheduleCount} jadwal aktif. Hapus jadwal terlebih dahulu.`
    );
  }

  return prisma.subject.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true },
  });
}