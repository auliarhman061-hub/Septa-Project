// ══════════════════════════════════════════════
// Schema: Akun Pengguna
// Validasi input CRUD akun pengguna
// ══════════════════════════════════════════════

import { z } from "zod";

export const createAkunSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PRINCIPAL", "PARENT"], {
    errorMap: () => ({ message: "Pilih role" }),
  }),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export const updateAkunSchema = z.object({
  id: z.string().min(1, "ID akun wajib ada"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PRINCIPAL", "PARENT"], {
    errorMap: () => ({ message: "Pilih role" }),
  }),
  isActive: z.boolean().optional().default(true),
});

export const resetPasswordSchema = z.object({
  id: z.string().min(1, "ID akun wajib ada"),
  newPassword: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password maksimal 50 karakter"),
});

export const deleteAkunSchema = z.object({
  id: z.string().min(1, "ID akun wajib ada"),
});

export const searchAkunSchema = z.object({
  q: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateAkunInput = z.infer<typeof createAkunSchema>;
export type UpdateAkunInput = z.infer<typeof updateAkunSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type DeleteAkunInput = z.infer<typeof deleteAkunSchema>;
export type SearchAkunInput = z.infer<typeof searchAkunSchema>;