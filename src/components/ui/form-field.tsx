// ══════════════════════════════════════════════
// FormField Component
// Sistem Informasi Akademik SMP
//
// Wrapper untuk field form dengan label + error message.
// Menggabungkan Input/Select/Textarea dengan FormField.
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  helperText,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Label */}
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Field */}
      {children}

      {/* Error */}
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

      {/* Helper */}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
