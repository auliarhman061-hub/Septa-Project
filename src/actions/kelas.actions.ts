// ══════════════════════════════════════════════
// Server Action: Kelas
// CRUD kelas — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createKelasSchema, updateKelasSchema, deleteKelasSchema } from "@/schemas/kelas.schema";
import {
  searchKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas,
  getAcademicYearOptions,
} from "@/services/master/kelas.service";
import { getGuruOptions } from "@/services/master/guru.service";
import type { SearchKelasInput } from "@/schemas/kelas.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── List ──────────────────────────────────

export async function listKelasAction(input: SearchKelasInput) {
  await requireAdmin();
  return searchKelas(input);
}

// ─── Get One ────────────────────────────────

export async function getKelasAction(id: string) {
  await requireAdmin();
  return getKelasById(id);
}

// ─── Create ────────────────────────────────

export async function createKelasAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat kelas" };
  }

  const raw = {
    name: formData.get("name") as string,
    gradeLevel: Number(formData.get("gradeLevel")),
    academicYearId: formData.get("academicYearId") as string,
    homeroomTeacherId: formData.get("homeroomTeacherId") as string || "",
  };

  const parsed = createKelasSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createKelas(parsed.data);
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil ditambahkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Update ────────────────────────────────

export async function updateKelasAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah kelas" };
  }

  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    gradeLevel: Number(formData.get("gradeLevel")),
    academicYearId: formData.get("academicYearId") as string,
    homeroomTeacherId: formData.get("homeroomTeacherId") as string || "",
  };

  const parsed = updateKelasSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateKelas(parsed.data);
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil diperbarui" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Delete ────────────────────────────────

export async function deleteKelasAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menghapus kelas" };
  }

  const raw = { id: formData.get("id") as string };
  const parsed = deleteKelasSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "ID tidak valid" };
  }

  try {
    await deleteKelas(parsed.data.id);
    revalidatePath("/admin/kelas");
    return { success: true, message: "Kelas berhasil dihapus" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Options ────────────────────────────────

export async function getAcademicYearOptionsAction(activeOnly = false) {
  await requireAdmin();
  return getAcademicYearOptions(activeOnly);
}

export async function getGuruOptionsForKelasAction() {
  await requireAdmin();
  return getGuruOptions();
}