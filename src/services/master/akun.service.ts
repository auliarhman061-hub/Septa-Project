// ══════════════════════════════════════════════
// Service: Akun
// Logika bisnis untuk akun pengguna
// ══════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import type {
  CreateAkunInput,
  UpdateAkunInput,
  ResetPasswordInput,
  SearchAkunInput,
} from "@/schemas/akun.schema";

function buildAkunWhere(input: SearchAkunInput) {
  const where: Prisma.UserWhereInput = {};
  if (input.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
      { email: { contains: input.q, mode: "insensitive" } },
    ];
  }
  if (input.role) {
    where.role = input.role as Prisma.EnumRoleFilter;
  }
  if (typeof input.isActive === "boolean") {
    where.isActive = input.isActive;
  }
  return where;
}

// ─── List & Search ────────────────────────────

export async function searchAkun(input: SearchAkunInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = buildAkunWhere(input);

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        // Relasi profile
        student: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
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

export async function getAkunById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      student: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true } },
    },
  });
}

// ─── Create ──────────────────────────────────

export async function createAkun(input: CreateAkunInput) {
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existingEmail) {
    throw new Error("Email sudah digunakan oleh akun lain");
  }

  const passwordHash = await hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role as "ADMIN" | "TEACHER" | "STUDENT" | "PRINCIPAL" | "PARENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

// ─── Update ──────────────────────────────────

export async function updateAkun(input: UpdateAkunInput) {
  const existingEmail = await prisma.user.findFirst({
    where: {
      email: input.email,
      id: { not: input.id },
    },
    select: { id: true },
  });
  if (existingEmail) {
    throw new Error("Email sudah digunakan oleh akun lain");
  }

  return prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name,
      email: input.email,
      role: input.role as "ADMIN" | "TEACHER" | "STUDENT" | "PRINCIPAL" | "PARENT",
      isActive: input.isActive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}

// ─── Reset Password ─────────────────────────

export async function resetPassword(input: ResetPasswordInput) {
  const passwordHash = await hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: input.id },
    data: { passwordHash },
  });

  return { id: input.id };
}

// ─── Deactivate / Soft Delete ────────────────
// Untuk User, deactivate = isActive = false (bukan hard delete)

export async function deactivateAkun(id: string) {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, name: true, isActive: true },
  });
}

export async function activateAkun(id: string) {
  return prisma.user.update({
    where: { id },
    data: { isActive: true },
    select: { id: true, name: true, isActive: true },
  });
}