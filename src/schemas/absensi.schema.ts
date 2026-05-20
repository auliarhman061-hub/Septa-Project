// ══════════════════════════════════════════════
// Schema: Absensi
// Validasi input absensi siswa
// ══════════════════════════════════════════════

import { z } from "zod";

// Date format: YYYY-MM-DD (normalize timezone)
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const inputAbsensiSchema = z.object({
  classId: z.string().min(1, "Pilih kelas"),
  date: z
    .string()
    .regex(DATE_REGEX, "Format tanggal: YYYY-MM-DD")
    .min(1, "Tanggal wajib diisi"),
  semesterId: z.string().min(1, "Pilih semester"),
  // Map of studentId -> status
  attendances: z.record(z.string(), z.enum(["HADIR", "SAKIT", "IZIN", "ALFA"])),
}).refine(
  (data) => Object.keys(data.attendances).length > 0,
  { message: "Setidaknya satu siswa harus memiliki status absensi", path: ["attendances"] }
);

export const updateAbsensiItemSchema = z.object({
  id: z.string().min(1, "ID absensi wajib ada"),
  status: z.enum(["HADIR", "SAKIT", "IZIN", "ALFA"], {
    errorMap: () => ({ message: "Pilih status absensi" }),
  }),
});

export const searchAbsensiSchema = z.object({
  q: z.string().optional(),
  classId: z.string().optional(),
  studentId: z.string().optional(),
  semesterId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type InputAbsensiInput = z.infer<typeof inputAbsensiSchema>;
export type UpdateAbsensiItemInput = z.infer<typeof updateAbsensiItemSchema>;
export type SearchAbsensiInput = z.infer<typeof searchAbsensiSchema>;
