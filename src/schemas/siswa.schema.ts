// ══════════════════════════════════════════════
// Schema: Siswa
// Validasi input CRUD siswa
// ══════════════════════════════════════════════

import { z } from "zod";

export const createSiswaSchema = z.object({
  nis: z
    .string()
    .min(4, "NIS minimal 4 karakter")
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]+$/, "NIS hanya boleh huruf dan angka"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Pilih jenis kelamin" }),
  }),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  address: z.string().max(255, "Alamat maksimal 255 karakter").optional(),
  classId: z.string().min(1, "Pilih kelas"),
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

export const updateSiswaSchema = z.object({
  id: z.string().min(1, "ID siswa wajib ada"),
  nis: z
    .string()
    .min(4, "NIS minimal 4 karakter")
    .max(20, "NIS maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]+$/, "NIS hanya boleh huruf dan angka"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Pilih jenis kelamin" }),
  }),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  address: z.string().max(255, "Alamat maksimal 255 karakter").optional(),
  classId: z.string().min(1, "Pilih kelas"),
});

export const deleteSiswaSchema = z.object({
  id: z.string().min(1, "ID siswa wajib ada"),
});

export const searchSiswaSchema = z.object({
  q: z.string().optional(),
  classId: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateSiswaInput = z.infer<typeof createSiswaSchema>;
export type UpdateSiswaInput = z.infer<typeof updateSiswaSchema>;
export type DeleteSiswaInput = z.infer<typeof deleteSiswaSchema>;
export type SearchSiswaInput = z.infer<typeof searchSiswaSchema>;