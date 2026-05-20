// ══════════════════════════════════════════════
// Authorization Helpers
// Sistem Informasi Akademik SMP
// ══════════════════════════════════════════════

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

// ─── Types ──────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

// ─── getCurrentUser() ────────────────────────
// Mengambil data user saat ini dari session.
// Return null jika belum login.

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();

  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role,
  };
}

// ─── requireAuth() ────────────────────────────
// Memaksa user untuk login.
// Jika belum login, redirect ke halaman login.
// Return AuthUser jika sudah login.

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// ─── requireRole(roles) ───────────────────────
// Memaksa user memiliki salah satu role yang diperbolehkan.
// Redirect ke dashboard sesuai role jika role tidak cocok.
// Return AuthUser jika role valid.

export async function requireRole(
  ...roles: Role[]
): Promise<AuthUser> {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    // Redirect ke dashboard sesuai role user
    const redirectMap: Record<Role, string> = {
      ADMIN: "/dashboard/admin",
      TEACHER: "/dashboard/guru",
      STUDENT: "/dashboard/siswa",
      PRINCIPAL: "/dashboard/kepala-sekolah",
      PARENT: "/dashboard/orang-tua",
    };
    redirect(redirectMap[user.role]);
  }

  return user;
}

// ─── requireAdmin() ──────────────────────────
// shortcut untuk requireRole("ADMIN")

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole("ADMIN");
}

// ─── requireTeacher() ────────────────────────
// shortcut untuk requireRole("TEACHER")

export async function requireTeacher(): Promise<AuthUser> {
  return requireRole("TEACHER");
}

// ─── requireStudent() ────────────────────────
// shortcut untuk requireRole("STUDENT")

export async function requireStudent(): Promise<AuthUser> {
  return requireRole("STUDENT");
}

// ─── requirePrincipal() ─────────────────────
// shortcut untuk requireRole("PRINCIPAL")

export async function requirePrincipal(): Promise<AuthUser> {
  return requireRole("PRINCIPAL");
}

// ─── requireParent() ─────────────────────────
// shortcut untuk requireRole("PARENT")

export async function requireParent(): Promise<AuthUser> {
  return requireRole("PARENT");
}

// ─── canAccessStudentData() ─────────────────
// Mengecek apakah user boleh mengakses data siswa tertentu.
// Aturan:
// - ADMIN: boleh akses semua
// - TEACHER: boleh akses jika mengajar kelas tersebut
// - STUDENT: hanya boleh akses datanya sendiri
// - PRINCIPAL: read-only semua
// - PARENT: hanya boleh akses data anak yang terhubung

export async function canAccessStudentData(
  studentId: string,
  userRole: Role,
  userId?: string
): Promise<boolean> {
  // ADMIN boleh akses semua
  if (userRole === "ADMIN") return true;

  // PRINCIPAL read-only semua (tapi tidak boleh write)
  // Untuk read, boleh akses semua
  if (userRole === "PRINCIPAL") return true;

  // STUDENT hanya boleh akses datanya sendiri
  if (userRole === "STUDENT") {
    if (!userId) return false;
    const student = await prisma.student.findUnique({
      where: { id: studentId, isDeleted: false },
      select: { userId: true },
    });
    return student?.userId === userId;
  }

  // PARENT hanya boleh akses data anak yang terhubung
  if (userRole === "PARENT") {
    if (!userId) return false;
    const parent = await prisma.parent.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!parent) return false;

    const parentStudent = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId,
        },
      },
    });
    return !!parentStudent;
  }

  // TEACHER boleh akses semua data siswa (untuk input nilai/absensi)
  // ownership dicek lebih detail di canTeacherManageClassSubject
  if (userRole === "TEACHER") return true;

  return false;
}

// ─── canTeacherManageClassSubject() ─────────
// Mengecek apakah guru boleh mengelola nilai/absensi
// untuk kelas dan mapel tertentu.
// Aturan: Guru hanya boleh input nilai/absensi untuk
// kelas dan mapel yang diajar (berdasarkan jadwal).

export async function canTeacherManageClassSubject(
  teacherId: string,
  classId: string,
  subjectId: string
): Promise<boolean> {
  // Cek apakah guru mengajar mapel tersebut di kelas tersebut
  // berdasarkan jadwal yang ada
  const schedule = await prisma.schedule.findFirst({
    where: {
      teacherId,
      classId,
      subjectId,
    },
    select: { id: true },
  });

  return !!schedule;
}

// ─── createUnauthorizedResponse() ────────────
// Helper untuk membuat response 401/403 yang aman.

export function createUnauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

export function createForbiddenResponse(message = "Forbidden") {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
}

// ─── getRedirectPathByRole() ─────────────────
// Helper untuk mendapatkan path redirect berdasarkan role.

export function getRedirectPathByRole(role: Role): string {
  const redirectMap: Record<Role, string> = {
    ADMIN: "/dashboard/admin",
    TEACHER: "/dashboard/guru",
    STUDENT: "/dashboard/siswa",
    PRINCIPAL: "/dashboard/kepala-sekolah",
    PARENT: "/dashboard/orang-tua",
  };
  return redirectMap[role];
}

// ─── validateOwnership() ─────────────────────
// Validasi bahwa user hanya bisa mengakses datanya sendiri
// untuk role STUDENT dan PARENT.

export async function validateOwnership(
  user: AuthUser,
  studentId: string
): Promise<boolean> {
  if (user.role === "ADMIN" || user.role === "TEACHER" || user.role === "PRINCIPAL") {
    return true;
  }

  if (user.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { id: studentId, isDeleted: false },
      select: { userId: true },
    });
    return student?.userId === user.id;
  }

  if (user.role === "PARENT") {
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!parent) return false;

    const parentStudent = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId,
        },
      },
    });
    return !!parentStudent;
  }

  return false;
}