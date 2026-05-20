// ══════════════════════════════════════════════
// Server Action: Guru
// CRUD guru — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createGuruSchema, updateGuruSchema, deleteGuruSchema } from "@/schemas/guru.schema";
import {
  searchGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru,
  getMapelOptions,
  getGuruOptions,
} from "@/services/master/guru.service";
import type { SearchGuruInput } from "@/schemas/guru.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── List ──────────────────────────────────

export async function listGuruAction(input: SearchGuruInput) {
  await requireAdmin();
  return searchGuru(input);
}

// ─── Get One ────────────────────────────────

export async function getGuruAction(id: string) {
  await requireAdmin();
  return getGuruById(id);
}

// ─── Create ────────────────────────────────

export async function createGuruAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat data guru" };
  }

  const subjectIds = formData.getAll("subjectIds") as string[];

  const raw = {
    nip: formData.get("nip") as string || "",
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || "",
    address: formData.get("address") as string || "",
    subjectIds,
    createAccount: formData.get("createAccount") === "on",
    email: formData.get("email") as string || "",
    password: formData.get("password") as string || "",
  };

  const parsed = createGuruSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createGuru(parsed.data);
    revalidatePath("/admin/guru");
    return { success: true, message: "Guru berhasil ditambahkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Update ────────────────────────────────

export async function updateGuruAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah data guru" };
  }

  const subjectIds = formData.getAll("subjectIds") as string[];

  const raw = {
    id: formData.get("id") as string,
    nip: formData.get("nip") as string || "",
    name: formData.get("name") as string,
    phone: formData.get("phone") as string || "",
    address: formData.get("address") as string || "",
    subjectIds,
  };

  const parsed = updateGuruSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateGuru(parsed.data);
    revalidatePath("/admin/guru");
    return { success: true, message: "Guru berhasil diperbarui" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Delete ────────────────────────────────

export async function deleteGuruAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menghapus guru" };
  }

  const raw = { id: formData.get("id") as string };
  const parsed = deleteGuruSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "ID tidak valid" };
  }

  try {
    await deleteGuru(parsed.data.id);
    revalidatePath("/admin/guru");
    return { success: true, message: "Guru berhasil dihapus" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Options ────────────────────────────────

export async function getMapelOptionsAction() {
  await requireAdmin();
  return getMapelOptions();
}

export async function getGuruOptionsAction() {
  await requireAdmin();
  return getGuruOptions();
}