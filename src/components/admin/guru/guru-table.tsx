// ══════════════════════════════════════════════
// Guru Table (Client Component)
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import GuruForm from "@/components/admin/guru/guru-form";
import ConfirmDeleteModal from "@/components/admin/confirm-delete-modal";
import { deleteGuruAction } from "@/actions/guru.actions";

type Props = {
  items: Array<{
    id: string;
    nip: string | null;
    name: string;
    phone: string | null;
    address?: string | null;
    user: { email: string; isActive: boolean } | null;
    subjects: Array<{ subject: { id: string; name: string } }>;
    _count: { schedules: number; homeroomClasses: number };
  }>;
  mapelOptions: Array<{ id: string; name: string; code: string }>;
};

export default function GuruTable({ items, mapelOptions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Props["items"][0] | null>(null);

  function handleDelete(id: string, _name: string) {
    setDeleteId(id);
  }

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const result = await deleteGuruAction(formData);
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
            <TableHeadCell>NIP</TableHeadCell>
            <TableHeadCell>Nama</TableHeadCell>
            <TableHeadCell>No HP</TableHeadCell>
            <TableHeadCell>Mapel</TableHeadCell>
            <TableHeadCell>Akun</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell muted>{item.nip ?? "—"}</TableCell>
                <TableCell bold>{item.name}</TableCell>
                <TableCell muted>{item.phone ?? "—"}</TableCell>
                <TableCell>
                  {item.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.subjects.slice(0, 2).map((s) => (
                        <Badge key={s.subject.id} variant="info" size="sm">
                          {s.subject.name}
                        </Badge>
                      ))}
                      {item.subjects.length > 2 && (
                        <Badge variant="outline" size="sm">
                          +{item.subjects.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.user ? (
                    <Badge variant={item.user.isActive ? "success" : "danger"}>
                      {item.user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
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
        <GuruForm
          mode="edit"
          initialData={editItem}
          mapelOptions={mapelOptions}
          onClose={() => setEditItem(null)}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          message="Hapus guru"
          itemName="guru ini"
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            const fd = new FormData();
            fd.set("id", deleteId);
            handleDeleteConfirm(fd);
          }}
          isSubmitting={isPending}
        />
      )}
    </>
  );
}