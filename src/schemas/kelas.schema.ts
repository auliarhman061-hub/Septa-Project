// ══════════════════════════════════════════════
// Schema: Kelas
// Validasi input CRUD kelas
// ══════════════════════════════════════════════

import { z } from "zod";

export const createKelasSchema = z.object({
  name: z
    .string()
    .min(2, "Nama kelas minimal 2 karakter")
    .max(20, "Nama kelas maksimal 20 karakter"),
  gradeLevel: z.coerce
    .number()
    .min(7, "Tingkat minimal 7 (kelas 7)")
    .max(9, "Tingkat maksimal 9 (kelas 9)"),
  academicYearId: z.string().min(1, "Pilih tahun ajaran"),
  homeroomTeacherId: z.string().optional().or(z.literal("")),
});

export const updateKelasSchema = z.object({
  id: z.string().min(1, "ID kelas wajib ada"),
  name: z
    .string()
    .min(2, "Nama kelas minimal 2 karakter")
    .max(20, "Nama kelas maksimal 20 karakter"),
  gradeLevel: z.coerce
    .number()
    .min(7, "Tingkat minimal 7")
    .max(9, "Tingkat maksimal 9"),
  academicYearId: z.string().min(1, "Pilih tahun ajaran"),
  homeroomTeacherId: z.string().optional().or(z.literal("")),
});

export const deleteKelasSchema = z.object({
  id: z.string().min(1, "ID kelas wajib ada"),
});

export const searchKelasSchema = z.object({
  q: z.string().optional(),
  academicYearId: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateKelasInput = z.infer<typeof createKelasSchema>;
export type UpdateKelasInput = z.infer<typeof updateKelasSchema>;
export type DeleteKelasInput = z.infer<typeof deleteKelasSchema>;
export type SearchKelasInput = z.infer<typeof searchKelasSchema>;