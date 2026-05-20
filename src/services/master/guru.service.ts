// ══════════════════════════════════════════════
// Service: Guru
// Logika bisnis untuk master data guru
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import type {
  CreateGuruInput,
  UpdateGuruInput,
  SearchGuruInput,
} from "@/schemas/guru.schema";

function buildGuruWhere(input: SearchGuruInput) {
  const where: Prisma.TeacherWhereInput = { isDeleted: false };
  if (input.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
      { nip: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (input.subjectId) {
    where.subjects = {
      some: { subjectId: input.subjectId },
    };
  }
  return where;
}

// ─── List & Search ────────────────────────────

export async function searchGuru(input: SearchGuruInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = buildGuruWhere(input);

  const [total, items] = await Promise.all([
    prisma.teacher.count({ where }),
    prisma.teacher.findMany({
      where,
      include: {
        user: { select: { email: true, isActive: true } },
        subjects: {
          include: { subject: { select: { id: true, name: true } } },
        },
        _count: {
          select: { schedules: true, homeroomClasses: true },
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

export async function getGuruById(id: string) {
  return prisma.teacher.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, email: true, isActive: true } },
      subjects: {
        include: { subject: { select: { id: true, name: true, code: true } } },
      },
    },
  });
}

// ─── Create ──────────────────────────────────

export async function createGuru(input: CreateGuruInput) {
  // Cek NIP unik jika diberikan
  if (input.nip) {
    const existingNip = await prisma.teacher.findUnique({
      where: { nip: input.nip },
      select: { id: true },
    });
    if (existingNip) {
      throw new Error("NIP sudah digunakan oleh guru lain");
    }
  }

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
        role: "TEACHER",
      },
    });
    userId = user.id;
  }

  return prisma.teacher.create({
    data: {
      nip: input.nip || null,
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
      userId,
      subjects: input.subjectIds?.length
        ? {
            create: input.subjectIds.map((sid) => ({
              subjectId: sid,
            })),
          }
        : undefined,
    },
    include: {
      user: { select: { email: true } },
      subjects: {
        include: { subject: { select: { id: true, name: true } } },
      },
    },
  });
}

// ─── Update ──────────────────────────────────

export async function updateGuru(input: UpdateGuruInput) {
  // Cek NIP unik
  if (input.nip) {
    const existingNip = await prisma.teacher.findFirst({
      where: {
        nip: input.nip,
        id: { not: input.id },
        isDeleted: false,
      },
      select: { id: true },
    });
    if (existingNip) {
      throw new Error("NIP sudah digunakan oleh guru lain");
    }
  }

  // Update subjects: hapus semua dulu, lalu buat ulang
  await prisma.teacherSubject.deleteMany({
    where: { teacherId: input.id },
  });

  return prisma.teacher.update({
    where: { id: input.id },
    data: {
      nip: input.nip || null,
      name: input.name,
      phone: input.phone || null,
      address: input.address || null,
      subjects: input.subjectIds?.length
        ? {
            create: input.subjectIds.map((sid) => ({
              subjectId: sid,
            })),
          }
        : undefined,
    },
    include: {
      user: { select: { email: true } },
      subjects: {
        include: { subject: { select: { id: true, name: true } } },
      },
    },
  });
}

// ─── Soft Delete ─────────────────────────────
// Cek apakah guru masih jadi wali kelas atau punya jadwal aktif

export async function deleteGuru(id: string) {
  const [homeroomCount, scheduleCount] = await Promise.all([
    prisma.class.count({
      where: { homeroomTeacherId: id, isDeleted: false },
    }),
    prisma.schedule.count({ where: { teacherId: id } }),
  ]);

  if (homeroomCount > 0) {
    throw new Error(
      `Guru masih menjadi wali kelas di ${homeroomCount} kelas. Lepaskan role wali kelas terlebih dahulu.`
    );
  }
  if (scheduleCount > 0) {
    throw new Error(
      `Guru masih memiliki ${scheduleCount} jadwal aktif. Hapus jadwal terlebih dahulu.`
    );
  }

  return prisma.teacher.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true },
  });
}

// ─── Options ─────────────────────────────────

export async function getMapelOptions() {
  return prisma.subject.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, code: true },
    orderBy: { name: "asc" },
  });
}

export async function getGuruOptions() {
  return prisma.teacher.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}