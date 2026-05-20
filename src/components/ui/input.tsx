// ══════════════════════════════════════════════
// Input Component
// Sistem Informasi Akademik SMP
//
// Fitur:
// - Label
// - Placeholder
// - Error message
// - Disabled state
// - Optional helper text
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={cn(
            "w-full px-3 py-2 border rounded-lg text-sm text-slate-800",
            "placeholder-slate-400 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "transition-colors duration-200",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-red-400 focus:ring-red-300 focus:border-red-400"
              : "border-slate-300 focus:ring-amber-300 focus:border-amber-400",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
