// ══════════════════════════════════════════════
// Form Modal Component
// Sistem Informasi Akademik SMP
//
// Reusable modal untuk create/edit.
// Props:
//   - title: judul modal
//   - description: subtitle
//   - children: form fields
//   - onSubmit: Server Action
//   - onClose: callback tutup
//   - submitLabel: label tombol submit
//   - isSubmitting: loading state
//   - error: pesan error dari server
// ══════════════════════════════════════════════

"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";

function SubmitButton({
  label = "Simpan",
  isSubmitting,
  variant = "primary",
}: {
  label?: string;
  isSubmitting?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  const loading = isSubmitting ?? pending;

  return (
    <Button type="submit" variant={variant} isLoading={loading}>
      {label}
    </Button>
  );
}

export default function FormModal({
  title,
  description,
  children,
  onClose,
  submitLabel = "Simpan",
  isSubmitting,
  error,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  error?: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <div className="space-y-4">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <SubmitButton label={submitLabel} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}