// ══════════════════════════════════════════════
// Guru Absensi Form — Client Component
// Receives pre-fetched students from server
// ══════════════════════════════════════════════

"use client";

import { useState } from "react";
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

type Student = { id: string; name: string; nis: string };
type ExistingAtt = { studentId: string; status: string };

type Props = {
  students: Student[];
  existingAttendance: ExistingAtt[];
  classId: string;
  date: string;
  semesterId: string;
  activeAyName?: string;
};

export default function GuruAbsensiForm({
  students,
  existingAttendance,
  classId,
  date,
  semesterId,
  activeAyName,
}: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ success: boolean; message: string } | null>(null);

  const existingMap: Record<string, string> = {};
  for (const a of existingAttendance) existingMap[a.studentId] = a.status;

  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const a of existingAttendance) init[a.studentId] = a.status;
    return init;
  });

  function handleStatusChange(id: string, status: string) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }

  function handleSelectAll(status: string) {
    const next: Record<string, string> = {};
    for (const s of students) next[s.id] = status;
    setStatuses(next);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitMsg(null);
    setIsPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("classId", classId);
    fd.set("date", date);
    fd.set("semesterId", semesterId);
    for (const [id, status] of Object.entries(statuses)) {
      fd.set(`status_${id}`, status);
    }
    const result = await saveAbsensiAction(fd);
    setSubmitMsg(result);
    setIsPending(false);
    if (result.success) setTimeout(() => router.refresh(), 800);
  }

  return (
    <div>
      {submitMsg && (
        <Alert
          variant={submitMsg.success ? "success" : "error"}
          title={submitMsg.success ? "Berhasil" : "Gagal"}
          className="mb-4"
        >
          {submitMsg.message}
        </Alert>
      )}

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-slate-700 font-medium">
              {activeAyName && <span>{activeAyName} — </span>}
              {date}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {students.length} siswa — {existingAttendance.length > 0 ? "edit absensi" : "input baru"}
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

        {students.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Kelas tidak memiliki siswa"
              description="Tambahkan siswa ke kelas ini terlebih dahulu."
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="classId" value={classId} />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="semesterId" value={semesterId} />

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
                      {STATUS_OPTIONS.find((o) => o.value === current)?.label}
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
