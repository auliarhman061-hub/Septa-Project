// ══════════════════════════════════════════════
// Service: Siswa
// Logika bisnis untuk master data siswa
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import type {
  CreateSiswaInput,
  UpdateSiswaInput,
  SearchSiswaInput,
} from "@/schemas/siswa.schema";

export type SiswaWithRelations = Awaited<ReturnType<typeof getSiswaById>>;

// ─── Shared Pagination ────────────────────────

function buildSiswaWhere(input: SearchSiswaInput) {
  const where: Prisma.StudentWhereInput = {
    isDeleted: false,
  };
  if (input.q) {
    where.OR = [
      { nis: { contains: input.q, mode: "insensitive" } },
      { name: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (input.classId) {
    where.classId = input.classId;
  }
  return where;
}

// ─── List & Search ────────────────────────────

export async function searchSiswa(input: SearchSiswaInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = buildSiswaWhere(input);

  const [total, items] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      include: {
        class: { select: { id: true, name: true, gradeLevel: true } },
        user: { select: { email: true, isActive: true } },
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

export async function getSiswaById(id: string) {
  return prisma.student.findUnique({
    where: { id, isDeleted: false },
    include: {
      class: {
        include: { academicYear: { select: { id: true, name: true } } },
      },
      user: { select: { id: true, email: true, isActive: true } },
    },
  });
}

// ─── Create ──────────────────────────────────

export async function createSiswa(input: CreateSiswaInput) {
  // Cek NIS unik
  const existingNis = await prisma.student.findUnique({
    where: { nis: input.nis },
    select: { id: true },
  });
  if (existingNis) {
    throw new Error("NIS sudah digunakan oleh siswa lain");
  }

  // Jika create account
  let userId: string | undefined;
  if (input.createAccount && input.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (existingEmail) {
      throw new Error("Email sudah digunakan oleh akun lain");
    }

    const passwordHash = await hash(input.password ?? "password123", 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: "STUDENT",
      },
    });
    userId = user.id;
  }

  return prisma.student.create({
    data: {
      nis: input.nis,
      name: input.name,
      gender: input.gender as "MALE" | "FEMALE",
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      address: input.address ?? null,
      classId: input.classId,
      userId,
    },
    include: {
      class: { select: { id: true, name: true } },
      user: { select: { email: true } },
    },
  });
}

// ─── Update ──────────────────────────────────

export async function updateSiswa(input: UpdateSiswaInput) {
  // Cek NIS unik (exclude diri sendiri)
  const existingNis = await prisma.student.findFirst({
    where: { nis: input.nis, id: { not: input.id }, isDeleted: false },
    select: { id: true },
  });
  if (existingNis) {
    throw new Error("NIS sudah digunakan oleh siswa lain");
  }

  return prisma.student.update({
    where: { id: input.id },
    data: {
      nis: input.nis,
      name: input.name,
      gender: input.gender as "MALE" | "FEMALE",
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      address: input.address ?? null,
      classId: input.classId,
    },
    include: {
      class: { select: { id: true, name: true } },
      user: { select: { email: true } },
    },
  });
}

// ─── Soft Delete ─────────────────────────────

export async function deleteSiswa(id: string) {
  return prisma.student.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true },
  });
}

// ─── Options (for selects) ───────────────────

export async function getKelasOptions(activeOnly = true) {
  const where: Prisma.ClassWhereInput = { isDeleted: false };
  if (activeOnly) {
    const ay = await prisma.academicYear.findFirst({
      where: { isActive: true },
      select: { id: true },
    });
    if (ay) where.academicYearId = ay.id;
  }
  return prisma.class.findMany({
    where,
    select: { id: true, name: true, gradeLevel: true },
    orderBy: [{ gradeLevel: "asc" }, { name: "asc" }],
  });
}