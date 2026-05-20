// ══════════════════════════════════════════════
// Button Component
// Sistem Informasi Akademik SMP
//
// Variants: primary (amber), secondary (orange),
// outline, danger (red), ghost
// Sizes: sm, md, lg
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 hover:bg-amber-600 text-white shadow-sm border border-amber-500",
  secondary:
    "bg-orange-500 hover:bg-orange-600 text-white shadow-sm border border-orange-500",
  outline:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400",
  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-sm border border-red-500",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        `focus:ring-amber-400`,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
