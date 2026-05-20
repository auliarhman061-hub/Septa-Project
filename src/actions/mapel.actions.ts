// ══════════════════════════════════════════════
// Server Action: Mata Pelajaran
// CRUD mata pelajaran — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createMapelSchema, updateMapelSchema, deleteMapelSchema } from "@/schemas/mapel.schema";
import {
  searchMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel,
} from "@/services/master/mapel.service";
import type { SearchMapelInput } from "@/schemas/mapel.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── List ──────────────────────────────────

export async function listMapelAction(input: SearchMapelInput) {
  await requireAdmin();
  return searchMapel(input);
}

// ─── Get One ────────────────────────────────

export async function getMapelAction(id: string) {
  await requireAdmin();
  return getMapelById(id);
}

// ─── Create ────────────────────────────────

export async function createMapelAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat mata pelajaran" };
  }

  const gradeLevelRaw = formData.get("gradeLevel");
  const gradeLevel = gradeLevelRaw ? Number(gradeLevelRaw) : undefined;

  const raw = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    gradeLevel,
  };

  const parsed = createMapelSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createMapel(parsed.data);
    revalidatePath("/admin/mapel");
    return { success: true, message: "Mata pelajaran berhasil ditambahkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Update ────────────────────────────────

export async function updateMapelAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah mata pelajaran" };
  }

  const gradeLevelRaw = formData.get("gradeLevel");
  const gradeLevel = gradeLevelRaw ? Number(gradeLevelRaw) : undefined;

  const raw = {
    id: formData.get("id") as string,
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    gradeLevel,
  };

  const parsed = updateMapelSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateMapel(parsed.data);
    revalidatePath("/admin/mapel");
    return { success: true, message: "Mata pelajaran berhasil diperbarui" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Delete ────────────────────────────────

export async function deleteMapelAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menghapus mata pelajaran" };
  }

  const raw = { id: formData.get("id") as string };
  const parsed = deleteMapelSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "ID tidak valid" };
  }

  try {
    await deleteMapel(parsed.data.id);
    revalidatePath("/admin/mapel");
    return { success: true, message: "Mata pelajaran berhasil dihapus" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}