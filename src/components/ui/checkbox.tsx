// ══════════════════════════════════════════════
// Checkbox Component
// Sistem Informasi Akademik SMP
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className={cn(
          "w-4 h-4 rounded border-slate-300",
          "text-amber-500",
          "focus:ring-2 focus:ring-amber-400 focus:ring-offset-0",
          "cursor-pointer"
        )}
        {...props}
      />
      {label && (
        <span className="text-sm text-slate-700">{label}</span>
      )}
    </label>
  );
}