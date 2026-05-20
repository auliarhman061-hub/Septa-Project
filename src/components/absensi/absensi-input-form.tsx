// ══════════════════════════════════════════════
// Attendance Input Form
// Input absensi massal per kelas dan tanggal
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
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

type Student = {
  id: string;
  name: string;
  nis: string;
};

type ExistingAtt = {
  studentId: string;
  status: string;
};

type Props = {
  students: Student[];
  existingAttendance: ExistingAtt[];
  classOptions: Array<{ id: string; name: string; gradeLevel: number }>;
  semesterOptions: Array<{ id: string; type: string }>;
  activeSemesterId?: string;
  activeAcademicYearName?: string;
  isAdmin: boolean;
};

export default function AttendanceInputForm({
  students,
  existingAttendance,
  classOptions,
  semesterOptions,
  activeSemesterId,
  activeAcademicYearName,
  isAdmin,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSemesterId] = useState(activeSemesterId ?? "");
  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const att of existingAttendance) {
      map[att.studentId] = att.status;
    }
    return map;
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Build existing map
  const existingMap: Record<string, string> = {};
  for (const att of existingAttendance) {
    existingMap[att.studentId] = att.status;
  }

  function handleStatusChange(studentId: string, status: string) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSelectAll(status: string) {
    const newStatuses: Record<string, string> = {};
    for (const s of students) {
      newStatuses[s.id] = status;
    }
    setStatuses(newStatuses);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      // Override with current state
      for (const [id, status] of Object.entries(statuses)) {
        formData.set(`status_${id}`, status);
      }

      const result = await saveAbsensiAction(formData);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => router.refresh(), 500);
      } else {
        setError(result.message);
      }
    });
  }

  const hasStudents = students.length > 0;

  return (
    <div>
      <PageHeader
        title="Input Absensi"
        description={
          activeAcademicYearName
            ? `${activeAcademicYearName} — Isikan status kehadiran setiap siswa`
            : "Isikan status kehadiran setiap siswa"
        }
      />

      {/* Class + Date Selection */}
      <Card className="mb-6 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            for (const [id, status] of Object.entries(statuses)) {
              fd.set(`status_${id}`, status);
            }
            // Redirect to same page with params for Server Component reload
            const classId = fd.get("classId") as string;
            const date = fd.get("date") as string;
            const semId = fd.get("semesterId") as string;
            window.location.href = `?classId=${classId}&date=${date}&semesterId=${semId}`;
          }}
          className="flex flex-wrap gap-3 items-end"
        >
          {isAdmin && (
            <div className="w-48">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kelas</label>
              <select
                name="classId"
                defaultValue={selectedClassId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Pilih Kelas</option>
                {classOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal</label>
            <input
              name="date"
              type="date"
              defaultValue={selectedDate}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Semester</label>
            <select
              name="semesterId"
              defaultValue={selectedSemesterId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {semesterOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.type === "GANJIL" ? "Ganjil" : "Genap"}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline" size="sm">
            Tampilkan Siswa
          </Button>
        </form>
      </Card>

      {/* Success/Error */}
      {success && <Alert variant="success" title="Berhasil" className="mb-4">{success}</Alert>}
      {error && <Alert variant="error" title="Gagal" className="mb-4">{error}</Alert>}

      {/* Student List */}
      {!hasStudents && (
        <Card className="p-8">
          <EmptyState
            title="Pilih kelas dan tanggal"
            description="Pilih kelas dan tanggal untuk menampilkan daftar siswa."
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
          />
        </Card>
      )}

      {hasStudents && (
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">Daftar Siswa</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {students.length} siswa —{" "}
                {existingAttendance.length > 0 ? "edit absensi" : "input baru"}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-slate-500">Tandai semua:</span>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectAll(opt.value)}
                  className="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 text-slate-600"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              for (const [id, status] of Object.entries(statuses)) {
                fd.set(`status_${id}`, status);
              }
              handleSubmit(fd);
            }}
          >
            <input type="hidden" name="classId" value={selectedClassId} />
            <input type="hidden" name="date" value={selectedDate} />
            <input type="hidden" name="semesterId" value={selectedSemesterId} />

            {students.map((student) => {
              const currentStatus = statuses[student.id] ?? existingMap[student.id] ?? "";
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                >
                  <input type="hidden" name="studentId" value={student.id} />

                  <div className="w-8 shrink-0">
                    <span className="text-xs text-slate-400 font-mono">{student.nis}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {student.name}
                    </p>
                  </div>

                  {currentStatus && (
                    <Badge variant={STATUS_BADGE[currentStatus]}>
                      {STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label ?? currentStatus}
                    </Badge>
                  )}

                  <select
                    name={`status_${student.id}`}
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                    required
                  >
                    <option value="">Pilih</option>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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
        </Card>
      )}
    </div>
  );
}