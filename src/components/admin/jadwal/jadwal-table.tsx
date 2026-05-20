// ══════════════════════════════════════════════
// Jadwal Table (Client Component)
// Tabel jadwal dengan action buttons
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import JadwalForm from "@/components/admin/jadwal/jadwal-form";
import ConfirmDeleteModal from "@/components/admin/confirm-delete-modal";
import { deleteJadwalAction } from "@/actions/jadwal.actions";
import { DAY_LABELS } from "@/lib/constants";

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

type Schedule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  class: { id: string; name: string; gradeLevel: number };
  subject: { id: string; name: string; code: string };
  teacher: { id: string; name: string };
  semester: { id: string; type: string };
  academicYear: { id: string; name: string };
};

type Options = {
  classes: Array<{ id: string; name: string; gradeLevel: number }>;
  teachers: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string; code: string }>;
  semesters: Array<{ id: string; type: string; academicYearId: string }>;
  academicYears: Array<{ id: string; name: string; isActive: boolean }>;
  activeAcademicYear?: { id: string; name: string } | null;
  activeSemester?: { id: string; type: string } | null;
};

export default function JadwalTable({ items, options }: { items: Schedule[]; options: Options }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Schedule | null>(null);

  function handleDeleteConfirm(formData: FormData) {
    startTransition(async () => {
      const result = await deleteJadwalAction(formData);
      setDeleteId(null);
      if (result.success) router.refresh();
    });
  }

  // Sort by day order + start time
  const sorted = [...items].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <>
      <div className="overflow-x-auto">
        <Table noPadding>
          <TableHead>
            <TableHeadCell>No</TableHeadCell>
            <TableHeadCell>Hari</TableHeadCell>
            <TableHeadCell>Jam</TableHeadCell>
            <TableHeadCell>Kelas</TableHeadCell>
            <TableHeadCell>Mata Pelajaran</TableHeadCell>
            <TableHeadCell>Guru</TableHeadCell>
            <TableHeadCell>Aksi</TableHeadCell>
          </TableHead>
          <TableBody>
            {sorted.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                <TableCell>
                  <Badge variant="info">
                    {DAY_LABELS[item.dayOfWeek as keyof typeof DAY_LABELS] ?? item.dayOfWeek}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-slate-700">
                    {item.startTime}–{item.endTime}
                  </span>
                </TableCell>
                <TableCell bold>{item.class.name}</TableCell>
                <TableCell>
                  <span className="text-sm">{item.subject.name}</span>
                  <span className="text-xs text-slate-400 ml-1">({item.subject.code})</span>
                </TableCell>
                <TableCell>{item.teacher.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>Edit</Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
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
        <JadwalForm
          mode="edit"
          initialData={editItem}
          options={options}
          onClose={() => setEditItem(null)}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          message="Hapus jadwal"
          itemName="jadwal ini"
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