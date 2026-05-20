// ══════════════════════════════════════════════
// Kelas Table & Form (Client Components)
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
import { deleteKelasAction, createKelasAction, updateKelasAction } from "@/actions/kelas.actions";

type Item = {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: { id: string; name: string };
  homeroomTeacher: { id: string; name: string } | null;
  _count: { students: number; schedules: number };
};

type Props = {
  items: Item[];
  academicYearOptions: Array<{ id: string; name: string }>;
  guruOptions: Array<{ id: string; name: string }>;
};

function KelasForm({
  mode,
  initialData,
  academicYearOptions,
  guruOptions,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  initialData?: Item;
  academicYearOptions: Array<{ id: string; name: string }>;
  guruOptions: Array<{ id: string; name: string }>;
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
      const action = mode === "create" ? createKelasAction : updateKelasAction;
      const result = await action(formData);
      if (result.success) { close(); router.refresh(); onSuccess?.(result.message); }
      else { setError(result.message); if (result.errors) setFieldErrors(result.errors as Record<string, string[]>); }
    });
  }

  const ayOptions = academicYearOptions.map((a) => ({ value: a.id, label: a.name }));
  const guruOptions2 = [{ value: "", label: "Belum ada" }, ...guruOptions.map((g) => ({ value: g.id, label: g.name }))];
  const gradeOptions = [7, 8, 9].map((g) => ({ value: String(g), label: `Kelas ${g}` }));

  return (
    <>
      <div onClick={open}>{initialData ? undefined : "trigger"}</div>
      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Tambah Kelas" : "Edit Kelas"}
          description={mode === "edit" ? `Edit ${initialData?.name}` : undefined}
          onClose={close}
          submitLabel={mode === "create" ? "Simpan" : "Perbarui"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama Kelas" required error={fieldErrors?.name?.[0]}>
                <Input name="name" defaultValue={initialData?.name} placeholder="Contoh: VII-A" required />
              </FormField>
              <FormField label="Tingkat" required error={fieldErrors?.gradeLevel?.[0]}>
                <Select name="gradeLevel" options={gradeOptions} defaultValue={String(initialData?.gradeLevel)} required />
              </FormField>
            </div>
            <FormField label="Tahun Ajaran" required error={fieldErrors?.academicYearId?.[0]}>
              <Select name="academicYearId" options={ayOptions} defaultValue={initialData?.academicYear.id} placeholder="Pilih tahun ajaran" required />
            </FormField>
            <FormField label="Wali Kelas" error={fieldErrors?.homeroomTeacherId?.[0]}>
              <Select name="homeroomTeacherId" options={guruOptions2} defaultValue={initialData?.homeroomTeacher?.id ?? ""} />
            </FormField>
          </form>
        </FormModal>
      )}
    </>
  );
}

export default function KelasTable({ items, academicYearOptions, guruOptions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [editItem, setEditItem] = useState<Item | null>(null);

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const result = await deleteKelasAction(formData);
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
            <TableHeadCell>Kelas</TableHeadCell>
            <TableHeadCell>Tingkat</TableHeadCell>
            <TableHeadCell>Tahun Ajaran</TableHeadCell>
            <TableHeadCell>Wali Kelas</TableHeadCell>
            <TableHeadCell>Siswa</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell bold>{item.name}</TableCell>
                <TableCell>Kelas {item.gradeLevel}</TableCell>
                <TableCell muted>{item.academicYear.name}</TableCell>
                <TableCell>{item.homeroomTeacher?.name ?? <span className="text-xs text-slate-400">—</span>}</TableCell>
                <TableCell>
                  <Badge variant={item._count.students > 0 ? "info" : "outline"}>
                    {item._count.students} siswa
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
        <KelasForm
          mode="edit"
          initialData={editItem}
          academicYearOptions={academicYearOptions}
          guruOptions={guruOptions}
          onClose={() => setEditItem(null)}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          message="Hapus kelas"
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

export { KelasForm };