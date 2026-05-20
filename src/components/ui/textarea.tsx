// ══════════════════════════════════════════════
// Textarea Component
// Sistem Informasi Akademik SMP
//
// Fitur:
// - Label
// - Error message
// - Row count
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        className={cn(
          "w-full px-3 py-2 border rounded-lg text-sm text-slate-800",
          "placeholder-slate-400 bg-white resize-y min-h-[80px]",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "transition-colors duration-200",
          "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
          error
            ? "border-red-400 focus:ring-red-300 focus:border-red-400"
            : "border-slate-300 focus:ring-amber-300 focus:border-amber-400",
          className
        )}
        {...props}
      />

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
