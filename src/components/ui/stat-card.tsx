// ══════════════════════════════════════════════
// StatCard Component
// Sistem Informasi Akademik SMP
//
// Card statistik untuk dashboard.
// Menampilkan: icon, value, label, optional trend.
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

type StatColor = "amber" | "orange" | "lime" | "sky" | "purple";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatColor;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const colorClasses: Record<StatColor, { bg: string; text: string; icon: string }> = {
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: "text-amber-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: "text-orange-500",
  },
  lime: {
    bg: "bg-lime-50",
    text: "text-lime-700",
    icon: "text-lime-600",
  },
  sky: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    icon: "text-sky-500",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-500",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  color = "amber",
  description,
  trend,
  className,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-5",
        "flex items-start gap-4 hover:shadow-sm transition-shadow duration-200",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          colors.bg
        )}
      >
        <div className={colors.icon}>{icon}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-xs font-semibold",
              trend.positive ? "text-lime-600" : "text-red-600"
            )}
          >
            <svg
              className={cn("w-3.5 h-3.5", trend.positive ? "" : "rotate-180")}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
