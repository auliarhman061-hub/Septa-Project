// ══════════════════════════════════════════════
// EmptyState Component
// Sistem Informasi Akademik SMP
//
// Menampilkan empty state:
// - Tabel kosong
// - Tidak ada data
// - Fitur belum tersedia
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-4 text-slate-300">{icon}</div>
      ) : (
        <div className="mb-4 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}

      <h3 className="font-semibold text-slate-700 text-base mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ─── Pre-built Empty States ───────────────────

type EmptyTableStateProps = { message?: string };

export function EmptyTableState({
  message = "Tidak ada data yang ditemukan.",
}: EmptyTableStateProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
      title={message}
      description="Coba ubah filter atau tambah data baru."
    />
  );
}

type ComingSoonProps = { phase?: string };

export function ComingSoon({ phase = "fase berikutnya" }: ComingSoonProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      }
      title={`Modul ini akan tersedia pada ${phase}.`}
      description="Tim pengembangan sedang bekerja untuk menghadirkan fitur ini."
    />
  );
}
