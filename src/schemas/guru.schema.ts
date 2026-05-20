// ══════════════════════════════════════════════
// Schema: Guru
// Validasi input CRUD guru
// ══════════════════════════════════════════════

import { z } from "zod";

export const createGuruSchema = z.object({
  nip: z
    .string()
    .max(20, "NIP maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]*$/, "NIP hanya boleh huruf dan angka")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  phone: z
    .string()
    .max(20, "No HP maksimal 20 karakter")
    .regex(/^[0-9+]*$/, "No HP hanya boleh angka dan +")
    .optional()
    .or(z.literal("")),
  address: z.string().max(255, "Alamat maksimal 255 karakter").optional(),
  subjectIds: z.array(z.string()).optional().default([]),
  createAccount: z.boolean().optional().default(false),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    if (data.createAccount) {
      return !!data.email && data.email.length > 0;
    }
    return true;
  },
  { message: "Email wajib diisi jika membuat akun", path: ["email"] }
).refine(
  (data) => {
    if (data.createAccount && data.email) {
      return data.password && data.password.length >= 6;
    }
    return true;
  },
  { message: "Password minimal 6 karakter", path: ["password"] }
);

export const updateGuruSchema = z.object({
  id: z.string().min(1, "ID guru wajib ada"),
  nip: z
    .string()
    .max(20, "NIP maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]*$/, "NIP hanya boleh huruf dan angka")
    .optional()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  phone: z
    .string()
    .max(20, "No HP maksimal 20 karakter")
    .regex(/^[0-9+]*$/, "No HP hanya boleh angka dan +")
    .optional()
    .or(z.literal("")),
  address: z.string().max(255, "Alamat maksimal 255 karakter").optional(),
  subjectIds: z.array(z.string()).optional().default([]),
});

export const deleteGuruSchema = z.object({
  id: z.string().min(1, "ID guru wajib ada"),
});

export const searchGuruSchema = z.object({
  q: z.string().optional(),
  subjectId: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateGuruInput = z.infer<typeof createGuruSchema>;
export type UpdateGuruInput = z.infer<typeof updateGuruSchema>;
export type DeleteGuruInput = z.infer<typeof deleteGuruSchema>;
export type SearchGuruInput = z.infer<typeof searchGuruSchema>;