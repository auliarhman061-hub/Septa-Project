// ══════════════════════════════════════════════
// Siswa Table (Client Component)
// Tabel data siswa dengan action buttons
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import SiswaForm from "@/components/admin/siswa/siswa-form";
import ConfirmDeleteModal from "@/components/admin/confirm-delete-modal";
import { deleteSiswaAction } from "@/actions/siswa.actions";

type Props = {
  items: Array<{
    id: string;
    nis: string;
    name: string;
    gender: "MALE" | "FEMALE";
    birthDate: Date | null;
    class: { id: string; name: string; gradeLevel: number };
    user: { email: string; isActive: boolean } | null;
  }>;
  kelasOptions: Array<{ id: string; name: string; gradeLevel: number }>;
};

export default function SiswaTable({ items, kelasOptions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Props["items"][0] | null>(null);

  function handleDelete(id: string, _name: string) {
    setDeleteId(id);
  }

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const result = await deleteSiswaAction(formData);
      setDeleteId(null);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table noPadding>
          <TableHead>
            <TableHeadCell>No</TableHeadCell>
            <TableHeadCell>NIS</TableHeadCell>
            <TableHeadCell>Nama</TableHeadCell>
            <TableHeadCell>Jenis Kelamin</TableHeadCell>
            <TableHeadCell>Kelas</TableHeadCell>
            <TableHeadCell>Akun</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell bold>{item.nis}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Badge variant={item.gender === "MALE" ? "info" : "warning"}>
                    {item.gender === "MALE" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                </TableCell>
                <TableCell>{item.class.name}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditItem(item)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-xs"
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

      {/* Edit Modal */}
      {editItem && (
        <SiswaForm
          mode="edit"
          initialData={editItem}
          kelasOptions={kelasOptions}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <ConfirmDeleteModal
          message="Hapus siswa"
          itemName="siswa ini"
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