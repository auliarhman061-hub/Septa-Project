// ══════════════════════════════════════════════
// Admin: Absensi
// Input & rekap absensi
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Badge from "@/components/ui/badge";
import AbsensiRecapTable from "@/components/absensi/absensi-recap-table";
import AdminAttendanceForm from "@/components/absensi/admin-attendance-form";
import {
  getAbsensiOptions,
  getStudentsInClass,
  getExistingAttendance,
  searchAbsensi,
} from "@/services/absensi.service";
import { SEMESTER_LABELS } from "@/lib/constants";

export default async function AdminAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{
    classId?: string; date?: string; semesterId?: string;
    q?: string; status?: string;
    startDate?: string; endDate?: string; page?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const { classId, date, semesterId, q, status, startDate, endDate } = params;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const { activeAcademicYear, activeSemester, classes, semesters } = await getAbsensiOptions();

  // If we have classId + date → show student attendance form
  if (classId && date && semesterId) {
    const [students, existingAttendance] = await Promise.all([
      getStudentsInClass(classId),
      getExistingAttendance(classId, date),
    ]);

    return (
      <div>
        <PageHeader
          title="Input Absensi"
          description={
            activeAcademicYear
              ? `${activeAcademicYear.name} — ${date}`
              : date
          }
          breadcrumb={[
            { label: "Absensi", href: "/admin/absensi" },
          ]}
        />

        {/* Back link */}
        <div className="mb-4">
          <a href="/admin/absensi" className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke daftar absensi
          </a>
        </div>

        <AdminAttendanceForm
          students={students}
          existingAttendance={existingAttendance}
          semesters={semesters}
          activeSemesterId={activeSemester?.id}
          activeAyName={activeAcademicYear?.name}
          selectedClassId={classId}
          selectedDate={date}
          selectedSemesterId={semesterId}
        />
      </div>
    );
  }

  // Default: recap view
  const { items, total, totalPages } = await searchAbsensi({
    q, status, startDate, endDate, classId,
    page, limit: 20,
  });

  return (
    <div>
      <PageHeader
        title="Absensi Siswa"
        description="Input dan rekap absensi siswa."
      />

      {/* Filter */}
      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kelas</label>
            <select name="classId" defaultValue={classId ?? ""} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua Kelas</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Dari Tanggal</label>
            <input name="startDate" type="date" defaultValue={startDate ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
            <input name="endDate" type="date" defaultValue={endDate ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select name="status" defaultValue={status ?? ""} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua</option>
              <option value="HADIR">Hadir</option>
              <option value="SAKIT">Sakit</option>
              <option value="IZIN">Izin</option>
              <option value="ALFA">Alfa</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50">
              Cari
            </button>
            {classId || startDate || status ? (
              <a href="/admin/absensi">
                <button type="button" className="px-4 py-2 text-sm border border-transparent rounded-lg text-slate-500 hover:text-slate-700">
                  Reset
                </button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {/* Stats summary */}
      {activeAcademicYear && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="success">{activeAcademicYear.name}</Badge>
          {activeSemester && (
            <Badge variant="info">{SEMESTER_LABELS[activeSemester.type]}</Badge>
          )}
          <span className="text-sm text-slate-500">Semester aktif</span>
        </div>
      )}

      {/* Table */}
      {items.length > 0 ? (
        <Card padding="none">
          <AbsensiRecapTable items={items} showStudent showClass />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination
                page={page}
                totalPages={totalPages}
                baseUrl="/admin/absensi"
                params={{ classId: classId ?? "", startDate: startDate ?? "", endDate: endDate ?? "", status: status ?? "" }}
                totalItems={total}
                limit={20}
              />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={classId || startDate ? "Tidak ada hasil" : "Belum ada data absensi"}
            description={
              classId || startDate
                ? "Tidak ada absensi yang cocok dengan filter."
                : "Input absensi melalui menu Input Absensi."
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} records</p>
    </div>
  );
}