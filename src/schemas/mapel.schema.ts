// ══════════════════════════════════════════════
// Schema: Mata Pelajaran
// Validasi input CRUD mata pelajaran
// ══════════════════════════════════════════════

import { z } from "zod";

export const createMapelSchema = z.object({
  code: z
    .string()
    .min(2, "Kode minimal 2 karakter")
    .max(10, "Kode maksimal 10 karakter")
    .regex(/^[A-Za-z0-9]+$/, "Kode hanya boleh huruf dan angka"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  gradeLevel: z.coerce
    .number()
    .min(7, "Tingkat minimal 7")
    .max(9, "Tingkat maksimal 9")
    .optional(),
});

export const updateMapelSchema = z.object({
  id: z.string().min(1, "ID mata pelajaran wajib ada"),
  code: z
    .string()
    .min(2, "Kode minimal 2 karakter")
    .max(10, "Kode maksimal 10 karakter")
    .regex(/^[A-Za-z0-9]+$/, "Kode hanya boleh huruf dan angka"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  gradeLevel: z.coerce
    .number()
    .min(7, "Tingkat minimal 7")
    .max(9, "Tingkat maksimal 9")
    .optional(),
});

export const deleteMapelSchema = z.object({
  id: z.string().min(1, "ID mata pelajaran wajib ada"),
});

export const searchMapelSchema = z.object({
  q: z.string().optional(),
  gradeLevel: z.coerce.number().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateMapelInput = z.infer<typeof createMapelSchema>;
export type UpdateMapelInput = z.infer<typeof updateMapelSchema>;
export type DeleteMapelInput = z.infer<typeof deleteMapelSchema>;
export type SearchMapelInput = z.infer<typeof searchMapelSchema>;