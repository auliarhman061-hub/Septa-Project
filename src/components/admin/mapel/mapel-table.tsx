// ══════════════════════════════════════════════
// Mapel Table & Form (Client Components)
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
import { deleteMapelAction, createMapelAction, updateMapelAction } from "@/actions/mapel.actions";

type Item = {
  id: string;
  code: string;
  name: string;
  gradeLevel: number | null;
  _count: { schedules: number; teachers: number };
};

function MapelForm({
  mode,
  initialData,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  initialData?: Item;
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
      const action = mode === "create" ? createMapelAction : updateMapelAction;
      const result = await action(formData);
      if (result.success) { close(); router.refresh(); onSuccess?.(result.message); }
      else { setError(result.message); if (result.errors) setFieldErrors(result.errors as Record<string, string[]>); }
    });
  }

  const gradeOptions = [
    { value: "", label: "Semua Tingkat" },
    { value: "7", label: "Kelas 7" },
    { value: "8", label: "Kelas 8" },
    { value: "9", label: "Kelas 9" },
  ];

  return (
    <>
      <div onClick={open}>{initialData ? undefined : "trigger"}</div>
      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"}
          description={mode === "edit" ? `Edit ${initialData?.name}` : undefined}
          onClose={close}
          submitLabel={mode === "create" ? "Simpan" : "Perbarui"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kode Mapel" required error={fieldErrors?.code?.[0]}>
                <Input name="code" defaultValue={initialData?.code} placeholder="Contoh: MTK" required />
              </FormField>
              <FormField label="Nama Mapel" required error={fieldErrors?.name?.[0]}>
                <Input name="name" defaultValue={initialData?.name} placeholder="Contoh: Matematika" required />
              </FormField>
            </div>
            <FormField label="Tingkat" error={fieldErrors?.gradeLevel?.[0]}>
              <Select name="gradeLevel" options={gradeOptions} defaultValue={initialData?.gradeLevel ? String(initialData.gradeLevel) : ""} />
            </FormField>
          </form>
        </FormModal>
      )}
    </>
  );
}

export default function MapelTable({ items }: { items: Item[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [editItem, setEditItem] = useState<Item | null>(null);

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const result = await deleteMapelAction(formData);
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
            <TableHeadCell>Kode</TableHeadCell>
            <TableHeadCell>Nama Mata Pelajaran</TableHeadCell>
            <TableHeadCell>Tingkat</TableHeadCell>
            <TableHeadCell>Guru</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell bold>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.gradeLevel ? `Kelas ${item.gradeLevel}` : <span className="text-xs text-slate-400">Semua</span>}</TableCell>
                <TableCell>
                  <Badge variant={item._count.teachers > 0 ? "info" : "outline"}>
                    {item._count.teachers} guru
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => { setDeleteId(item.id); setDeleteName(item.name); }}>
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editItem && (
        <MapelForm mode="edit" initialData={editItem} onClose={() => setEditItem(null)} />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          message="Hapus mata pelajaran"
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

export { MapelForm };