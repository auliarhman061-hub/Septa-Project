// ══════════════════════════════════════════════
// Schema: Jadwal
// Validasi input CRUD jadwal pelajaran
// ══════════════════════════════════════════════

import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createJadwalSchema = z.object({
  classId: z.string().min(1, "Pilih kelas"),
  teacherId: z.string().min(1, "Pilih guru"),
  subjectId: z.string().min(1, "Pilih mata pelajaran"),
  academicYearId: z.string().min(1, "Pilih tahun ajaran"),
  semesterId: z.string().min(1, "Pilih semester"),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"], {
    errorMap: () => ({ message: "Pilih hari" }),
  }),
  startTime: z
    .string()
    .regex(TIME_REGEX, "Format jam: HH:mm (contoh: 07:00)")
    .min(1, "Jam mulai wajib diisi"),
  endTime: z
    .string()
    .regex(TIME_REGEX, "Format jam: HH:mm (contoh: 08:30)")
    .min(1, "Jam selesai wajib diisi"),
}).refine(
  (data) => {
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    return endMinutes > startMinutes;
  },
  { message: "Jam selesai harus lebih besar dari jam mulai", path: ["endTime"] }
);

export const updateJadwalSchema = z.object({
  id: z.string().min(1, "ID jadwal wajib ada"),
  classId: z.string().min(1, "Pilih kelas"),
  teacherId: z.string().min(1, "Pilih guru"),
  subjectId: z.string().min(1, "Pilih mata pelajaran"),
  academicYearId: z.string().min(1, "Pilih tahun ajaran"),
  semesterId: z.string().min(1, "Pilih semester"),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"], {
    errorMap: () => ({ message: "Pilih hari" }),
  }),
  startTime: z
    .string()
    .regex(TIME_REGEX, "Format jam: HH:mm (contoh: 07:00)")
    .min(1, "Jam mulai wajib diisi"),
  endTime: z
    .string()
    .regex(TIME_REGEX, "Format jam: HH:mm (contoh: 08:30)")
    .min(1, "Jam selesai wajib diisi"),
}).refine(
  (data) => {
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    return endMinutes > startMinutes;
  },
  { message: "Jam selesai harus lebih besar dari jam mulai", path: ["endTime"] }
);

export const deleteJadwalSchema = z.object({
  id: z.string().min(1, "ID jadwal wajib ada"),
});

export const searchJadwalSchema = z.object({
  q: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  subjectId: z.string().optional(),
  dayOfWeek: z.string().optional(),
  semesterId: z.string().optional(),
  academicYearId: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export type CreateJadwalInput = z.infer<typeof createJadwalSchema>;
export type UpdateJadwalInput = z.infer<typeof updateJadwalSchema>;
export type DeleteJadwalInput = z.infer<typeof deleteJadwalSchema>;
export type SearchJadwalInput = z.infer<typeof searchJadwalSchema>;
