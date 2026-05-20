// ══════════════════════════════════════════════
// Server Action: Akun
// CRUD akun — Admin only
// ══════════════════════════════════════════════

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { createAkunSchema, updateAkunSchema, resetPasswordSchema } from "@/schemas/akun.schema";
import {
  searchAkun,
  getAkunById,
  createAkun,
  updateAkun,
  resetPassword,
  deactivateAkun,
  activateAkun,
} from "@/services/master/akun.service";
import type { SearchAkunInput } from "@/schemas/akun.schema";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan server";
}

// ─── List ──────────────────────────────────

export async function listAkunAction(input: SearchAkunInput) {
  await requireAdmin();
  return searchAkun(input);
}

// ─── Get One ────────────────────────────────

export async function getAkunAction(id: string) {
  await requireAdmin();
  return getAkunById(id);
}

// ─── Create ────────────────────────────────

export async function createAkunAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh membuat akun" };
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    password: formData.get("password") as string,
  };

  const parsed = createAkunSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createAkun(parsed.data);
    revalidatePath("/admin/akun");
    return { success: true, message: "Akun berhasil dibuat" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Update ────────────────────────────────

export async function updateAkunAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengubah akun" };
  }

  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    isActive: formData.get("isActive") === "on",
  };

  const parsed = updateAkunSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAkun(parsed.data);
    revalidatePath("/admin/akun");
    return { success: true, message: "Akun berhasil diperbarui" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Reset Password ────────────────────────

export async function resetPasswordAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mereset password" };
  }

  const raw = {
    id: formData.get("id") as string,
    newPassword: formData.get("newPassword") as string,
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await resetPassword(parsed.data);
    revalidatePath("/admin/akun");
    return { success: true, message: "Password berhasil direset" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Deactivate ────────────────────────────

export async function deactivateAkunAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh menonaktifkan akun" };
  }

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID tidak valid" };

  try {
    await deactivateAkun(id);
    revalidatePath("/admin/akun");
    return { success: true, message: "Akun berhasil dinonaktifkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}

// ─── Activate ──────────────────────────────

export async function activateAkunAction(formData: FormData) {
  const user = await requireAdmin();
  if (user.role !== "ADMIN") {
    return { success: false, message: "Hanya admin yang boleh mengaktifkan akun" };
  }

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID tidak valid" };

  try {
    await activateAkun(id);
    revalidatePath("/admin/akun");
    return { success: true, message: "Akun berhasil diaktifkan" };
  } catch (error) {
    return { success: false, message: toErrorMessage(error) };
  }
}