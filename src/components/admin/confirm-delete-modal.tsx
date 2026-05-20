// ══════════════════════════════════════════════
// Confirm Delete Modal
// Sistem Informasi Akademik SMP
//
// Simple confirmation dialog untuk delete
// ══════════════════════════════════════════════

"use client";

import Button from "@/components/ui/button";
import { useFormStatus } from "react-dom";

function DeleteButton({ label = "Hapus", isSubmitting }: { label?: string; isSubmitting?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" isLoading={isSubmitting ?? pending}>
      {label}
    </Button>
  );
}

export default function ConfirmDeleteModal({
  title = "Konfirmasi Hapus",
  message,
  itemName,
  onClose,
  onConfirm: _onConfirm,
  isSubmitting,
}: {
  title?: string;
  message: string;
  itemName?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600">
            {message}
            {itemName && (
              <span className="font-semibold text-slate-800"> &quot;{itemName}&quot;</span>
            )}
            ?
          </p>
          <p className="text-xs text-slate-400 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <DeleteButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}