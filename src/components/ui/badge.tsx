// ══════════════════════════════════════════════
// Badge Component
// Sistem Informasi Akademik SMP
//
// Variants:
// - default (slate)
// - success/hadir (lime)
// - warning (orange)
// - danger/alfa (red)
// - info (amber)
// - sakit (orange-light)
// - izin (amber-light)
// - role variants
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600 border-slate-200",
  success: "bg-lime-100 text-lime-700 border-lime-200",
  warning: "bg-orange-100 text-orange-700 border-orange-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  info: "bg-amber-100 text-amber-700 border-amber-200",
  outline: "bg-white text-slate-600 border-slate-300",
};

export default function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─── Pre-defined Status Badges ───────────────

export function BadgeHadir({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="success" className={className} {...props}>
      Hadir
    </Badge>
  );
}

export function BadgeSakit({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="warning" className={className} {...props}>
      Sakit
    </Badge>
  );
}

export function BadgeIzin({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="info" className={className} {...props}>
      Izin
    </Badge>
  );
}

export function BadgeAlfa({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="danger" className={className} {...props}>
      Alfa
    </Badge>
  );
}

// ─── Role Badges ─────────────────────────────

const ROLE_BADGE_CONFIG: Record<string, { variant: BadgeVariant; label: string }> = {
  ADMIN: { variant: "info", label: "Admin" },
  TEACHER: { variant: "warning", label: "Guru" },
  STUDENT: { variant: "success", label: "Siswa" },
  PRINCIPAL: { variant: "default", label: "Kepala Sekolah" },
  PARENT: { variant: "default", label: "Orang Tua" },
};

export function RoleBadge({
  role,
  className,
}: {
  role: string;
  className?: string;
}) {
  const config = ROLE_BADGE_CONFIG[role] ?? { variant: "default", label: role };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

// ─── Active/Inactive Badge ───────────────────

export function BadgeActive({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="success" className={className} {...props}>
      Aktif
    </Badge>
  );
}

export function BadgeInactive({ className, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="default" className={className} {...props}>
      Tidak Aktif
    </Badge>
  );
}
