// ══════════════════════════════════════════════
// Siswa Form (Client Component)
// Create/Edit siswa via Server Action
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/admin/form-modal";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { createSiswaAction, updateSiswaAction } from "@/actions/siswa.actions";

type Props = {
  mode: "create" | "edit";
  kelasOptions: Array<{ id: string; name: string; gradeLevel: number }>;
  initialData?: {
    id: string;
    nis: string;
    name: string;
    gender: "MALE" | "FEMALE";
    birthDate: Date | null;
    address?: string | null;
    class: { id: string; name: string; gradeLevel: number };
  };
  trigger?: React.ReactNode;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
};

export default function SiswaForm({
  mode,
  kelasOptions,
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
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
    setError(null);
    setFieldErrors(null);
  }
  function close() {
    setIsOpen(false);
    setError(null);
    setFieldErrors(null);
    onClose?.();
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors(null);
    startTransition(async () => {
      const action = mode === "create" ? createSiswaAction : updateSiswaAction;
      const result = await action(formData);
      if (result.success) {
        close();
        router.refresh();
        onSuccess?.(result.message);
      } else {
        setError(result.message);
        if (result.errors) {
          setFieldErrors(result.errors as Record<string, string[]>);
        }
      }
    });
  }

  const genderOptions = [
    { value: "MALE", label: "Laki-laki" },
    { value: "FEMALE", label: "Perempuan" },
  ];

  const kelasSelectOptions = kelasOptions.map((k) => ({
    value: k.id,
    label: `${k.name}`,
  }));

  return (
    <>
      {trigger && (
        <div onClick={open}>{trigger}</div>
      )}

      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Tambah Siswa" : "Edit Siswa"}
          description={mode === "edit" ? `Edit data ${initialData?.name}` : undefined}
          onClose={close}
          submitLabel={mode === "create" ? "Simpan" : "Perbarui"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && (
              <input type="hidden" name="id" value={initialData?.id} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField label="NIS" required error={fieldErrors?.nis?.[0]}>
                <Input
                  name="nis"
                  defaultValue={initialData?.nis}
                  placeholder="Contoh: 12345"
                  required
                />
              </FormField>

              <FormField label="Nama Lengkap" required error={fieldErrors?.name?.[0]}>
                <Input
                  name="name"
                  defaultValue={initialData?.name}
                  placeholder="Nama lengkap siswa"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Jenis Kelamin" required error={fieldErrors?.gender?.[0]}>
                <Select
                  name="gender"
                  options={genderOptions}
                  defaultValue={initialData?.gender}
                  placeholder="Pilih"
                  required
                />
              </FormField>

              <FormField label="Tanggal Lahir" required error={fieldErrors?.birthDate?.[0]}>
                <Input
                  name="birthDate"
                  type="date"
                  defaultValue={
                    initialData?.birthDate
                      ? new Date(initialData.birthDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                />
              </FormField>
            </div>

            <FormField label="Kelas" required error={fieldErrors?.classId?.[0]}>
              <Select
                name="classId"
                options={kelasSelectOptions}
                defaultValue={initialData?.class?.id}
                placeholder="Pilih kelas"
                required
              />
            </FormField>

            <FormField label="Alamat" error={fieldErrors?.address?.[0]}>
              <Input
                name="address"
                defaultValue={initialData?.address ?? ""}
                placeholder="Alamat lengkap (opsional)"
              />
            </FormField>

            {/* Create Account Toggle — only for create mode */}
            {mode === "create" && (
              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="createAccount"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Buat akun siswa</p>
                    <p className="text-xs text-slate-400">
                      Aktifkan untuk membuatkan akun login bagi siswa ini.
                    </p>
                  </div>
                </label>

                {createAccount && (
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <FormField label="Email" required error={fieldErrors?.email?.[0]}>
                      <Input
                        name="email"
                        type="email"
                        placeholder="email@siswa.sch.id"
                        required={createAccount}
                      />
                    </FormField>
                    <FormField label="Password Awal" required error={fieldErrors?.password?.[0]}>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        required={createAccount}
                      />
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