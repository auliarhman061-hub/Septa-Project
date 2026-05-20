// ══════════════════════════════════════════════
// Kepala Sekolah Layout
// Sub-sidebar navigation
// ══════════════════════════════════════════════

import { requirePrincipal } from "@/lib/permissions";
import Link from "next/link";

const kepalaMenu = [
  {
    label: "Dashboard",
    href: "/dashboard/kepala-sekolah",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Jadwal Pelajaran",
    href: "/kepala-sekolah/jadwal",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Laporan Akademik",
    href: "/kepala-sekolah/laporan",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default async function KepalaSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _user = await requirePrincipal();

  return (
    <div className="flex gap-6">
      <aside className="w-56 shrink-0">
        <div className="sticky top-24">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Kepala Sekolah
          </p>
          <nav className="space-y-1">
            {kepalaMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                <span className="shrink-0 text-slate-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}