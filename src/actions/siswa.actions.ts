// ══════════════════════════════════════════════
// Server Action: Siswa
// CRUD siswa — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createSiswaSchema, updateSiswaSchema, deleteSiswaSchema } from "@/schemas/siswa.schema";
import {
  searchSiswa,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getKelasOptions,
} from "@/services/master/siswa.service";
import type { SearchSiswaInput } from "@/schemas/siswa.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── List (called from Server Component) ───

export async function listSiswaAction(input: SearchSiswaInput) {
  await requireAdmin();
  return searchSiswa(input);
}

// ─── Get One (for edit form) ────────────────

export async function getSiswaAction(id: string) {
  await requireAdmin();
  return getSiswaById(id);
}

// ─── Create ────────────────────────────────

export async function createSiswaAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat data siswa" };
  }

  const raw = {
    nis: formData.get("nis") as string,
    name: formData.get("name") as string,
    gender: formData.get("gender") as string,
    birthDate: formData.get("birthDate") as string,
    address: formData.get("address") as string || undefined,
    classId: formData.get("classId") as string,
    createAccount: formData.get("createAccount") === "on",
    email: formData.get("email") as string || "",
    password: formData.get("password") as string || "",
  };

  const parsed = createSiswaSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validasi gagal",
      errors,
    };
  }

  try {
    await createSiswa(parsed.data);
    revalidatePath("/admin/siswa");
    return { success: true, message: "Siswa berhasil ditambahkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Update ────────────────────────────────

export async function updateSiswaAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah data siswa" };
  }

  const raw = {
    id: formData.get("id") as string,
    nis: formData.get("nis") as string,
    name: formData.get("name") as string,
    gender: formData.get("gender") as string,
    birthDate: formData.get("birthDate") as string,
    address: formData.get("address") as string || undefined,
    classId: formData.get("classId") as string,
  };

  const parsed = updateSiswaSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, message: "Validasi gagal", errors };
  }

  try {
    await updateSiswa(parsed.data);
    revalidatePath("/admin/siswa");
    return { success: true, message: "Siswa berhasil diperbarui" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Delete ────────────────────────────────

export async function deleteSiswaAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menghapus siswa" };
  }

  const raw = { id: formData.get("id") as string };
  const parsed = deleteSiswaSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "ID tidak valid" };
  }

  try {
    await deleteSiswa(parsed.data.id);
    revalidatePath("/admin/siswa");
    return { success: true, message: "Siswa berhasil dihapus" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Options ────────────────────────────────

export async function getKelasOptionsAction(activeOnly = true) {
  await requireAdmin();
  return getKelasOptions(activeOnly);
}