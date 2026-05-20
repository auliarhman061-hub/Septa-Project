// ══════════════════════════════════════════════
// LoadingState Component
// Sistem Informasi Akademik SMP
//
// Menampilkan loading state untuk:
// - Full page
// - Inline / table row
// - Spinner saja
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

// ─── Full Page Loader ─────────────────────────

export function PageLoader({ message = "Memuat..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

// ─── Inline Spinner ───────────────────────────

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[3px]",
    lg: "w-10 h-10 border-4",
  };
  return (
    <div
      className={cn(
        "border-amber-200 border-t-amber-500 rounded-full animate-spin",
        sizes[size]
      )}
    />
  );
}

// ─── Table Loading Skeleton ──────────────────

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 5 }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-4" />
          <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
        </div>
      ))}
    </div>
  );
}

// ─── Card Skeleton ────────────────────────────

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-6", className)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
          <div className="h-6 bg-slate-100 rounded animate-pulse w-16" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-32" />
        </div>
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────

export function TableRowSkeleton({
  cols = 5,
  className,
}: {
  cols?: number;
  className?: string;
}) {
  return (
    <tr className={cn("border-b border-slate-100", className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
