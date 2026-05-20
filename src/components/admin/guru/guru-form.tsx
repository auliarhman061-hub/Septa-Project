// ══════════════════════════════════════════════
// Guru Form (Client Component)
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/admin/form-modal";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import { createGuruAction, updateGuruAction } from "@/actions/guru.actions";

type Props = {
  mode: "create" | "edit";
  mapelOptions: Array<{ id: string; name: string; code: string }>;
  initialData?: {
    id: string;
    nip: string | null;
    name: string;
    phone: string | null;
    address?: string | null;
    subjects: Array<{ subject: { id: string; name: string } }>;
  };
  trigger?: React.ReactNode;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
};

export default function GuruForm({
  mode,
  mapelOptions,
  initialData,
  trigger,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData?.subjects.map((s) => s.subject.id) ?? []
  );
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
    setError(null);
    setFieldErrors(null);
    setSelectedSubjects(initialData?.subjects.map((s) => s.subject.id) ?? []);
  }
  function close() {
    setIsOpen(false);
    setError(null);
    setFieldErrors(null);
    onClose?.();
  }

  function handleSubmit(formData: FormData) {
    // Set selected subjects
    selectedSubjects.forEach((id) => formData.append("subjectIds", id));
    setError(null);
    setFieldErrors(null);
    startTransition(async () => {
      const action = mode === "create" ? createGuruAction : updateGuruAction;
      const result = await action(formData);
      if (result.success) {
        close();
        router.refresh();
        onSuccess?.(result.message);
      } else {
        setError(result.message);
        if (result.errors) setFieldErrors(result.errors as Record<string, string[]>);
      }
    });
  }

  return (
    <>
      {trigger && <div onClick={open}>{trigger}</div>}

      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Tambah Guru" : "Edit Guru"}
          description={mode === "edit" ? `Edit data ${initialData?.name}` : undefined}
          onClose={close}
          submitLabel={mode === "create" ? "Simpan" : "Perbarui"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}

            <div className="grid grid-cols-2 gap-4">
              <FormField label="NIP" error={fieldErrors?.nip?.[0]}>
                <Input name="nip" defaultValue={initialData?.nip ?? ""} placeholder="Opsional" />
              </FormField>
              <FormField label="Nama Lengkap" required error={fieldErrors?.name?.[0]}>
                <Input name="name" defaultValue={initialData?.name} placeholder="Nama guru" required />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="No HP" error={fieldErrors?.phone?.[0]}>
                <Input name="phone" defaultValue={initialData?.phone ?? ""} placeholder="08xxxxxxxxxx" />
              </FormField>
              <div />
            </div>

            <FormField label="Alamat" error={fieldErrors?.address?.[0]}>
              <Input name="address" defaultValue={initialData?.address ?? ""} placeholder="Alamat lengkap" />
            </FormField>

            {/* Mata Pelajaran */}
            <FormField label="Mata Pelajaran yang Diampu">
              <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {mapelOptions.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada mata pelajaran. Tambahkan di menu Mapel.</p>
                ) : (
                  mapelOptions.map((m) => (
                    <Checkbox
                      key={m.id}
                      label={`${m.name} (${m.code})`}
                      checked={selectedSubjects.includes(m.id)}
                      onChange={(e) => {
                        setSelectedSubjects((prev) =>
                          e.target.checked
                            ? [...prev, m.id]
                            : prev.filter((id) => id !== m.id)
                        );
                      }}
                    />
                  ))
                )}
              </div>
            </FormField>

            {/* Create Account Toggle */}
            {mode === "create" && (
              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Buat akun guru</p>
                    <p className="text-xs text-slate-400">Aktifkan untuk membuatkan akun login.</p>
                  </div>
                </label>
                {createAccount && (
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <FormField label="Email" required error={fieldErrors?.email?.[0]}>
                      <Input name="email" type="email" placeholder="email@guru.sch.id" required={createAccount} />
                    </FormField>
                    <FormField label="Password Awal" required error={fieldErrors?.password?.[0]}>
                      <Input name="password" type="password" placeholder="Minimal 6 karakter" required={createAccount} />
                    </FormField>
                  </div>
                )}
              </div>
            )}
          </form>
        </FormModal>
      )}
    </>
  );
}