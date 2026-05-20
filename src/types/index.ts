// ==========================================
// TypeScript Types & Enums
// Sistem Informasi Akademik SMP
// ==========================================

// ─── Enums ────────────────────────────────

export type Role =
  | "ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "PRINCIPAL"
  | "PARENT";

export type Gender = "MALE" | "FEMALE";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type AttendanceStatus = "HADIR" | "SAKIT" | "IZIN" | "ALFA";

export type SemesterType = "GANJIL" | "GENAP";

// ─── Action Response ──────────────────────

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

// ─── Pagination ────────────────────────────

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ─── Dashboard ────────────────────────────

export type DashboardStats = {
  totalSiswa: number;
  totalGuru: number;
  totalKelas: number;
  totalMapel: number;
  jadwalAktif: number;
};

// ─── Auth ────────────────────────────────

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  // Relasi opsional (diisi berdasarkan role)
  studentId?: string;
  teacherId?: string;
  parentId?: string;
};
