// ══════════════════════════════════════════════
// Server Action: Absensi
// CRUD absensi — Admin & Teacher
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { inputAbsensiSchema } from "@/schemas/absensi.schema";
import {
  saveAttendanceBatch,
  getTeacherAuthorizedClasses,
} from "@/services/absensi.service";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── Save attendance ────────────────────────

export async function saveAbsensiAction(formData: FormData) {
  // Parse form data
  const raw = {
    classId: formData.get("classId") as string,
    date: formData.get("date") as string,
    semesterId: formData.get("semesterId") as string,
  };

  // Collect attendance entries
  const entries = formData.getAll("studentId") as string[];
  const attendances: Record<string, string> = {};
  for (const id of entries) {
    const status = formData.get(`status_${id}`) as string;
    if (status) attendances[id] = status;
  }

  const parsed = inputAbsensiSchema.safeParse({ ...raw, attendances });
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check role
  const user = await requireRole("ADMIN", "TEACHER");

  // Teacher: validate class is authorized
  if (user.role === "TEACHER") {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!teacher) {
      return { success: false, message: "Profil guru belum terhubung" };
    }

    const authorized = await getTeacherAuthorizedClasses(teacher.id);
    if (!authorized.includes(parsed.data.classId)) {
      return {
        success: false,
        message: "Anda tidak berhak menginput absensi untuk kelas ini",
      };
    }

    try {
      await saveAttendanceBatch(parsed.data, teacher.id);
      revalidatePath("/guru/absensi");
      return { success: true, message: "Absensi berhasil disimpan" };
    } catch (error) {
      return { success: false, message: toErrorMessage(error) };
    }
  }

  // Admin: full access
  try {
    await saveAttendanceBatch(parsed.data);
    revalidatePath("/admin/absensi");
    return { success: true, message: "Absensi berhasil disimpan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}
