// ══════════════════════════════════════════════
// PageHeader Component
// Sistem Informasi Akademik SMP
//
// Komponen header untuk setiap halaman.
// Terdiri dari: title, description, actions.
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-slate-500 mb-3">
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-amber-600 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className={idx === breadcrumb.length - 1 ? "text-slate-700 font-medium" : ""}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Divider */}
      <div className="mt-4 h-px bg-slate-200" />
    </div>
  );
}
