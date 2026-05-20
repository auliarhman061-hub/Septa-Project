// ══════════════════════════════════════════════
// Admin Attendance Form
// Client component for mass attendance input
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Alert from "@/components/ui/alert";
import EmptyState from "@/components/ui/empty-state";
import { saveAbsensiAction } from "@/actions/absensi.actions";

const STATUS_OPTIONS = [
  { value: "HADIR", label: "Hadir" },
  { value: "SAKIT", label: "Sakit" },
  { value: "IZIN", label: "Izin" },
  { value: "ALFA", label: "Alfa" },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "info" | "danger"> = {
  HADIR: "success",
  SAKIT: "warning",
  IZIN: "info",
  ALFA: "danger",
};

type Props = {
  students: Array<{ id: string; name: string; nis: string }>;
  existingAttendance: Array<{ studentId: string; status: string }>;
  semesters: Array<{ id: string; type: string }>;
  activeSemesterId?: string;
  activeAyName?: string;
  selectedClassId: string;
  selectedDate: string;
  selectedSemesterId: string;
};

export default function AdminAttendanceForm({
  students,
  existingAttendance,
  semesters: _semesters,
  activeSemesterId,
  activeAyName,
  selectedClassId,
  selectedDate,
  selectedSemesterId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const a of existingAttendance) map[a.studentId] = a.status;
    return map;
  });
  const [serverMsg, setServerMsg] = useState<{ success: boolean; message: string } | null>(null);

  function handleStatusChange(studentId: string, status: string) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSelectAll(status: string) {
    const next: Record<string, string> = {};
    for (const s of students) next[s.id] = status;
    setStatuses(next);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Inject current statuses
    for (const [id, status] of Object.entries(statuses)) {
      fd.set(`status_${id}`, status);
    }
    startTransition(async () => {
      const result = await saveAbsensiAction(fd);
      setServerMsg(result);
      if (result.success) {
        setTimeout(() => router.refresh(), 800);
      }
    });
  }

  const existingMap: Record<string, string> = {};
  for (const a of existingAttendance) existingMap[a.studentId] = a.status;

  return (
    <div>
      {serverMsg && (
        <Alert
          variant={serverMsg.success ? "success" : "error"}
          title={serverMsg.success ? "Berhasil" : "Gagal"}
          className="mb-4"
        >
          {serverMsg.message}
        </Alert>
      )}

      <Card padding="none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-slate-500">
              {activeAyName && <span className="font-medium text-slate-700">{activeAyName} — </span>}
              Tanggal: <span className="font-medium text-slate-700">{selectedDate}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {students.length} siswa —{" "}
              {existingAttendance.length > 0 ? "edit absensi" : "input baru"}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-slate-500 mr-1">Tandai semua:</span>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectAll(opt.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student rows */}
        {students.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Kelas tidak memiliki siswa"
              description="Tambahkan siswa ke kelas ini terlebih dahulu."
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Hidden fields */}
            <input type="hidden" name="classId" value={selectedClassId} />
            <input type="hidden" name="date" value={selectedDate} />
            <input type="hidden" name="semesterId" value={selectedSemesterId || activeSemesterId || ""} />

            {students.map((student) => {
              const current = statuses[student.id] || existingMap[student.id] || "";
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="w-20 shrink-0">
                    <span className="text-xs font-mono text-slate-400">{student.nis}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{student.name}</p>
                  </div>
                  {current && (
                    <Badge variant={STATUS_BADGE[current]} size="sm">
                      {STATUS_OPTIONS.find((o) => o.value === current)?.label ?? current}
                    </Badge>
                  )}
                  <select
                    name={`status_${student.id}`}
                    value={current}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className="w-32 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required
                  >
                    <option value="">Pilih status</option>
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end">
              <Button
                type="submit"
                isLoading={isPending}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Simpan Absensi
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
