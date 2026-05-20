// ==========================================
// Konstanta Aplikasi
// Sistem Informasi Akademik SMP
// ==========================================

// ─── Role ─────────────────────────────────
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin / Staf TU",
  TEACHER: "Guru",
  STUDENT: "Siswa",
  PRINCIPAL: "Kepala Sekolah",
  PARENT: "Orang Tua",
};

export const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-amber-100 text-amber-700 border-amber-200",
  TEACHER: "bg-orange-100 text-orange-700 border-orange-200",
  STUDENT: "bg-lime-100 text-lime-700 border-lime-200",
  PRINCIPAL: "bg-sky-100 text-sky-700 border-sky-200",
  PARENT: "bg-purple-100 text-purple-700 border-purple-200",
};

// ─── Attendance Status ──────────────────────
export const ATTENDANCE_STATUS = {
  HADIR: "HADIR",
  SAKIT: "SAKIT",
  IZIN: "IZIN",
  ALFA: "ALFA",
} as const;

export type AttendanceStatusType =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_LABELS: Record<AttendanceStatusType, string> = {
  HADIR: "Hadir",
  SAKIT: "Sakit",
  IZIN: "Izin",
  ALFA: "Alfa",
};

export const ATTENDANCE_BADGE_CLASSES: Record<
  AttendanceStatusType,
  string
> = {
  HADIR: "badge-hadir",
  SAKIT: "badge-sakit",
  IZIN: "badge-izin",
  ALFA: "badge-alfa",
};

// ─── Gender ────────────────────────────────
export const GENDER_LABELS: Record<string, string> = {
  MALE: "Laki-laki",
  FEMALE: "Perempuan",
};

// ─── Day of Week ───────────────────────────
export const DAY_LABELS: Record<string, string> = {
  MONDAY: "Senin",
  TUESDAY: "Selasa",
  WEDNESDAY: "Rabu",
  THURSDAY: "Kamis",
  FRIDAY: "Jumat",
  SATURDAY: "Sabtu",
};

export const DAY_SHORT_LABELS: Record<string, string> = {
  MONDAY: "Sen",
  TUESDAY: "Sel",
  WEDNESDAY: "Rab",
  THURSDAY: "Kam",
  FRIDAY: "Jum",
  SATURDAY: "Sab",
};

// ─── Semester ──────────────────────────────
export const SEMESTER_LABELS: Record<string, string> = {
  GANJIL: "Ganjil",
  GENAP: "Genap",
};

// ─── Grade Weights ──────────────────────────
export const DEFAULT_GRADE_WEIGHTS = {
  assignment: 30,
  midterm: 30,
  finalExam: 40,
};

// ─── Pagination ─────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// ─── Theme Colors ───────────────────────────
export const THEME = {
  primary: "amber",
  secondary: "orange",
  accent: "lime",
  neutral: "slate",
} as const;

// ─── Route Redirect Map ────────────────────
export const ROLE_REDIRECT_MAP: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/guru",
  STUDENT: "/dashboard/siswa",
  PRINCIPAL: "/dashboard/kepala-sekolah",
  PARENT: "/dashboard/orang-tua",
};

// ─── Navigation Labels ─────────────────────
export const NAV_LABELS: Record<string, string> = {
  "/dashboard/admin": "Dashboard Admin",
  "/dashboard/guru": "Dashboard Guru",
  "/dashboard/siswa": "Dashboard Siswa",
  "/dashboard/kepala-sekolah": "Dashboard Kepala Sekolah",
  "/dashboard/orang-tua": "Dashboard Orang Tua",
};
