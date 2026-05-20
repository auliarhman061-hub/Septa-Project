"use client";

import { Role } from "@prisma/client";

const ROLE_BG_COLORS: Record<Role, string> = {
  ADMIN: "bg-amber-500",
  TEACHER: "bg-orange-500",
  STUDENT: "bg-lime-600",
  PRINCIPAL: "bg-sky-500",
  PARENT: "bg-purple-500",
};

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin / Staf TU",
  TEACHER: "Guru",
  STUDENT: "Siswa",
  PRINCIPAL: "Kepala Sekolah",
  PARENT: "Orang Tua",
};

export default function Topbar({
  user,
  role,
}: {
  user: { name?: string | null; email?: string | null };
  role: Role;
}) {
  const roleBgColor = ROLE_BG_COLORS[role];
  const roleLabel = ROLE_LABELS[role];
  const initials = user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 font-medium">
          Sistem Informasi Akademik SMP
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${roleBgColor}`}>
          {roleLabel}
        </span>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-amber-700">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── App Footer ─────────────────────────────

export function AppFooter() {
  return (
    <footer className="px-8 py-4 border-t border-slate-200 bg-white">
      <p className="text-xs text-slate-400 text-center">
        Sistem Informasi Akademik SMP — Demo Skripsi Prototype
      </p>
    </footer>
  );
}