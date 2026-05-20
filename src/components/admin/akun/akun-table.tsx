// ══════════════════════════════════════════════
// Akun Table & Forms (Client Components)
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FormModal from "@/components/admin/form-modal";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import ConfirmDeleteModal from "@/components/admin/confirm-delete-modal";
import {
  createAkunAction,
  updateAkunAction,
  resetPasswordAction,
  deactivateAkunAction,
  activateAkunAction,
} from "@/actions/akun.actions";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin / TU",
  TEACHER: "Guru",
  STUDENT: "Siswa",
  PRINCIPAL: "Kepala Sekolah",
  PARENT: "Orang Tua",
};

const ROLE_BADGE_VARIANT: Record<string, "info" | "warning" | "success" | "danger"> = {
  ADMIN: "info",
  TEACHER: "warning",
  STUDENT: "success",
  PRINCIPAL: "danger",
  PARENT: "info",
};

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  student: { id: string; name: string } | null;
  teacher: { id: string; name: string } | null;
  parent: { id: string; name: string } | null;
};

function AkunForm({
  mode,
  initialData,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  initialData?: User;
  onClose?: () => void;
  onSuccess?: (msg: string) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function open() { setIsOpen(true); setError(null); setFieldErrors(null); }
  function close() { setIsOpen(false); setError(null); setFieldErrors(null); onClose?.(); }

  function handleSubmit(formData: FormData) {
    setError(null); setFieldErrors(null);
    startTransition(async () => {
      const action = mode === "create" ? createAkunAction : updateAkunAction;
      const result = await action(formData);
      if (result.success) { close(); router.refresh(); onSuccess?.(result.message); }
      else { setError(result.message); if (result.errors) setFieldErrors(result.errors as Record<string, string[]>); }
    });
  }

  return (
    <>
      <div onClick={open}>{initialData ? undefined : "trigger"}</div>
      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Buat Akun" : "Edit Akun"}
          description={mode === "edit" ? `Edit ${initialData?.name}` : undefined}
          onClose={close}
          submitLabel={mode === "create" ? "Buat Akun" : "Simpan"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}
            <FormField label="Nama Lengkap" required error={fieldErrors?.name?.[0]}>
              <Input name="name" defaultValue={initialData?.name} placeholder="Nama lengkap" required />
            </FormField>
            <FormField label="Email" required error={fieldErrors?.email?.[0]}>
              <Input name="email" type="email" defaultValue={initialData?.email} placeholder="email@example.com" required />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role" required error={fieldErrors?.role?.[0]}>
                <Select name="role" options={roleOptions} defaultValue={initialData?.role} required />
              </FormField>
              {mode === "edit" && (
                <FormField label="Status" error={undefined}>
                  <label className="flex items-center gap-2 h-[42px]">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={initialData?.isActive ?? true}
                      className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                    />
                    <span className="text-sm text-slate-600">Akun aktif</span>
                  </label>
                </FormField>
              )}
            </div>
            {mode === "create" && (
              <FormField label="Password" required error={fieldErrors?.password?.[0]}>
                <Input name="password" type="password" placeholder="Minimal 6 karakter" required />
              </FormField>
            )}
          </form>
        </FormModal>
      )}
    </>
  );
}

function ResetPasswordModal({
  userId,
  userName,
  onClose,
}: {
  userId: string;
  userName: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null); setFieldErrors(null);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result.success) { onClose?.(); router.refresh(); }
      else { setError(result.message); if (result.errors) setFieldErrors(result.errors as Record<string, string[]>); }
    });
  }

  return (
    <FormModal
      title="Reset Password"
      description={`Reset password untuk ${userName}`}
      onClose={onClose}
      submitLabel="Reset Password"
      isSubmitting={isPending}
      error={error}
    >
      <form action={handleSubmit}>
        <input type="hidden" name="id" value={userId} />
        <p className="text-sm text-slate-600 mb-4">
          Masukkan password baru untuk akun <strong>{userName}</strong>.
        </p>
        <FormField label="Password Baru" required error={fieldErrors?.newPassword?.[0]}>
          <Input name="newPassword" type="password" placeholder="Minimal 6 karakter" required />
        </FormField>
      </form>
    </FormModal>
  );
}

export default function AkunTable({ items }: { items: User[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName] = useState("");
  const [editItem, setEditItem] = useState<User | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);
  const [resetName, setResetName] = useState("");

  function handleToggle(formData: FormData, activate: boolean) {
    startTransition(async () => {
      const action = activate ? activateAkunAction : deactivateAkunAction;
      const result = await action(formData);
      if (result.success) router.refresh();
    });
  }

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const action = deactivateAkunAction;
      const result = await action(formData);
      setDeleteId(null);
      if (result.success) router.refresh();
    });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table noPadding>
          <TableHead>
            <TableHeadCell>No</TableHeadCell>
            <TableHeadCell>Nama</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Role</TableHeadCell>
            <TableHeadCell>Profile</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell bold>{item.name}</TableCell>
                <TableCell muted className="text-xs">{item.email}</TableCell>
                <TableCell>
                  <Badge variant={ROLE_BADGE_VARIANT[item.role] ?? "info"}>
                    {ROLE_LABELS[item.role] ?? item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.teacher ? (
                    <span className="text-xs text-slate-600">{item.teacher.name}</span>
                  ) : item.student ? (
                    <span className="text-xs text-slate-600">{item.student.name}</span>
                  ) : item.parent ? (
                    <span className="text-xs text-slate-600">{item.parent.name}</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "success" : "danger"}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>Edit</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-amber-600 hover:text-amber-700"
                      onClick={() => { setResetId(item.id); setResetName(item.name); }}
                    >
                      Reset
                    </Button>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(); fd.set("id", item.id);
                        handleToggle(fd, !item.isActive);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editItem && (
        <AkunForm mode="edit" initialData={editItem} onClose={() => setEditItem(null)} />
      )}

      {resetId && (
        <ResetPasswordModal userId={resetId} userName={resetName} onClose={() => setResetId(null)} />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          title="Nonaktifkan Akun"
          message="Nonaktifkan akun"
          itemName={deleteName}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            const fd = new FormData(); fd.set("id", deleteId);
            handleDeleteConfirm(fd);
          }}
          isSubmitting={isPending}
        />
      )}
    </>
  );
}

export { AkunForm };