"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { logoutAction } from "@/actions/auth.actions";

function BookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function DashboardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function StudentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function TeacherIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ClassIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function SubjectIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ScheduleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AccountIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function AttendanceIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function GradeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ReportIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ReportCardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function ChildIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogoutIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin / Staf TU",
  TEACHER: "Guru",
  STUDENT: "Siswa",
  PRINCIPAL: "Kepala Sekolah",
  PARENT: "Orang Tua",
};

type NavItem = { label: string; href: string; icon: React.ReactNode };
type NavSection = { title: string; items: NavItem[] };

function getNavigation(role: Role): NavSection[] {
  switch (role) {
    case "ADMIN":
      return [
        { title: "Dashboard", items: [
          { label: "Dashboard Admin", href: "/dashboard/admin", icon: <DashboardIcon /> },
        ]},
        { title: "Master Data", items: [
          { label: "Data Siswa", href: "/admin/siswa", icon: <StudentIcon /> },
          { label: "Data Guru", href: "/admin/guru", icon: <TeacherIcon /> },
          { label: "Data Kelas", href: "/admin/kelas", icon: <ClassIcon /> },
          { label: "Mata Pelajaran", href: "/admin/mapel", icon: <SubjectIcon /> },
          { label: "Jadwal Pelajaran", href: "/admin/jadwal", icon: <ScheduleIcon /> },
          { label: "Akun Pengguna", href: "/admin/akun", icon: <AccountIcon /> },
          { label: "Absensi", href: "/admin/absensi", icon: <AttendanceIcon /> },
        ]},
      ];
    case "TEACHER":
      return [
        { title: "Dashboard", items: [
          { label: "Dashboard Guru", href: "/dashboard/guru", icon: <DashboardIcon /> },
        ]},
        { title: "Pengelolaan", items: [
          { label: "Jadwal Mengajar", href: "/guru/jadwal", icon: <ScheduleIcon /> },
          { label: "Input Absensi", href: "/guru/absensi", icon: <AttendanceIcon /> },
          { label: "Input Nilai", href: "/guru/nilai", icon: <GradeIcon /> },
        ]},
      ];
    case "STUDENT":
      return [
        { title: "Dashboard", items: [
          { label: "Dashboard Siswa", href: "/dashboard/siswa", icon: <DashboardIcon /> },
        ]},
        { title: "Akademik", items: [
          { label: "Jadwal Pelajaran", href: "/siswa/jadwal", icon: <ScheduleIcon /> },
          { label: "Absensi", href: "/siswa/absensi", icon: <AttendanceIcon /> },
          { label: "Nilai", href: "/siswa/nilai", icon: <GradeIcon /> },
          { label: "Rapor", href: "/siswa/rapor", icon: <ReportCardIcon /> },
        ]},
      ];
    case "PRINCIPAL":
      return [
        { title: "Dashboard", items: [
          { label: "Dashboard Kepala Sekolah", href: "/dashboard/kepala-sekolah", icon: <DashboardIcon /> },
        ]},
        { title: "Laporan", items: [
          { label: "Laporan Akademik", href: "/kepala-sekolah/laporan", icon: <ReportIcon /> },
          { label: "Rekap Absensi", href: "/kepala-sekolah/absensi", icon: <AttendanceIcon /> },
        ]},
      ];
    case "PARENT":
      return [
        { title: "Dashboard", items: [
          { label: "Dashboard Orang Tua", href: "/dashboard/orang-tua", icon: <DashboardIcon /> },
        ]},
        { title: "Anak", items: [
          { label: "Data Anak", href: "/orang-tua/anak", icon: <ChildIcon /> },
          { label: "Nilai Anak", href: "/orang-tua/nilai", icon: <GradeIcon /> },
          { label: "Absensi Anak", href: "/orang-tua/absensi", icon: <AttendanceIcon /> },
          { label: "Rapor Anak", href: "/orang-tua/rapor", icon: <ReportCardIcon /> },
        ]},
      ];
    default:
      return [];
  }
}

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const navigation = getNavigation(role);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <BookIcon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-800 text-sm leading-tight block">
              Sistem Akademik SMP
            </span>
            <span className="text-xs text-slate-400">Demo Skripsi</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-50 text-amber-700 font-semibold text-sm border-l-4 border-amber-500 transition-colors"
                        : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-amber-50 hover:text-amber-700 text-sm transition-colors"
                    }
                  >
                    <span className={isActive ? "text-amber-600" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: role label + logout */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-2">
        <div className="px-3 py-2">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-semibold text-slate-700">{ROLE_LABELS[role]}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 text-sm transition-colors font-medium"
          >
            <LogoutIcon />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}