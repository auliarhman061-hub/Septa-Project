// ══════════════════════════════════════════════
// Server Action: Jadwal
// CRUD jadwal — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createJadwalSchema, updateJadwalSchema, deleteJadwalSchema } from "@/schemas/jadwal.schema";
import {
  searchJadwal,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  getJadwalOptions,
} from "@/services/jadwal.service";
import type { SearchJadwalInput } from "@/schemas/jadwal.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

function isConflictError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("sudah memiliki jadwal") ||
      error.message.includes("sudah ditambahkan"))
  );
}

// ─── List ──────────────────────────────────

export async function listJadwalAction(input: SearchJadwalInput) {
  await requireAdmin();
  return searchJadwal(input);
}

// ─── Get One ────────────────────────────────

export async function getJadwalAction(id: string) {
  await requireAdmin();
  return getJadwalById(id);
}

// ─── Create ────────────────────────────────

export async function createJadwalAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat jadwal" };
  }

  const raw = {
    classId: formData.get("classId") as string,
    teacherId: formData.get("teacherId") as string,
    subjectId: formData.get("subjectId") as string,
    academicYearId: formData.get("academicYearId") as string,
    semesterId: formData.get("semesterId") as string,
    dayOfWeek: formData.get("dayOfWeek") as string,
    startTime: formData.get("startTime") as string,
    endTime: formData.get("endTime") as string,
  };

  const parsed = createJadwalSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await createJadwal(parsed.data);
  if (result.error) {
    return {
      success: false,
      message: toErrorMessage(result.error),
      isConflict: isConflictError(result.error),
    };
  }

  revalidatePath("/admin/jadwal");
  return { success: true, message: "Jadwal berhasil ditambahkan" };
}

// ─── Update ────────────────────────────────

export async function updateJadwalAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah jadwal" };
  }

  const raw = {
    id: formData.get("id") as string,
    classId: formData.get("classId") as string,
    teacherId: formData.get("teacherId") as string,
    subjectId: formData.get("subjectId") as string,
    academicYearId: formData.get("academicYearId") as string,
    semesterId: formData.get("semesterId") as string,
    dayOfWeek: formData.get("dayOfWeek") as string,
    startTime: formData.get("startTime") as string,
    endTime: formData.get("endTime") as string,
  };

  const parsed = updateJadwalSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await updateJadwal(parsed.data);
  if (result.error) {
    return {
      success: false,
      message: toErrorMessage(result.error),
      isConflict: isConflictError(result.error),
    };
  }

  revalidatePath("/admin/jadwal");
  return { success: true, message: "Jadwal berhasil diperbarui" };
}

// ─── Delete ────────────────────────────────

export async function deleteJadwalAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menghapus jadwal" };
  }

  const raw = { id: formData.get("id") as string };
  const parsed = deleteJadwalSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "ID tidak valid" };
  }

  try {
    await deleteJadwal(parsed.data.id);
    revalidatePath("/admin/jadwal");
    return { success: true, message: "Jadwal berhasil dihapus" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Options ────────────────────────────────

export async function getJadwalOptionsAction() {
  await requireAdmin();
  return getJadwalOptions();
}