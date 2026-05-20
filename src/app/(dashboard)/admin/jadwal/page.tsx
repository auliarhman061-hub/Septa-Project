// ══════════════════════════════════════════════
// Admin: List Jadwal
// CRUD jadwal pelajaran
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import JadwalTable from "@/components/admin/jadwal/jadwal-table";
import JadwalForm from "@/components/admin/jadwal/jadwal-form";
import { searchJadwal, getJadwalOptions } from "@/services/jadwal.service";

export default async function JadwalListPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string; classId?: string; teacherId?: string; subjectId?: string;
    dayOfWeek?: string; semesterId?: string; academicYearId?: string; page?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const classId = params.classId || "";
  const teacherId = params.teacherId || "";
  const subjectId = params.subjectId || "";
  const dayOfWeek = params.dayOfWeek || "";
  const semesterId = params.semesterId || "";
  const academicYearId = params.academicYearId || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const [{ items, total, totalPages }, options] = await Promise.all([
    searchJadwal({ q, classId, teacherId, subjectId, dayOfWeek, semesterId, academicYearId, page, limit: 10 }),
    getJadwalOptions(),
  ]);

  const filterParams = { q, classId, teacherId, subjectId, dayOfWeek, semesterId, academicYearId };

  return (
    <div>
      <PageHeader
        title="Jadwal Pelajaran"
        description="Kelola jadwal pelajaran per kelas, guru, dan mata pelajaran."
        actions={
          <JadwalForm
            mode="create"
            options={options}
            trigger={
              <Button leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }>
                Tambah Jadwal
              </Button>
            }
          />
        }
      />

      {/* Filter */}
      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cari</label>
            <input
              name="q" defaultValue={q}
              placeholder="Kelas, mapel, atau guru..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kelas</label>
            <select name="classId" defaultValue={classId} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua Kelas</option>
              {options.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Guru</label>
            <select name="teacherId" defaultValue={teacherId} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua Guru</option>
              {options.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Mapel</label>
            <select name="subjectId" defaultValue={subjectId} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua Mapel</option>
              {options.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Hari</label>
            <select name="dayOfWeek" defaultValue={dayOfWeek} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="">Semua Hari</option>
              <option value="MONDAY">Senin</option>
              <option value="TUESDAY">Selasa</option>
              <option value="WEDNESDAY">Rabu</option>
              <option value="THURSDAY">Kamis</option>
              <option value="FRIDAY">Jumat</option>
              <option value="SATURDAY">Sabtu</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || classId || teacherId || subjectId || dayOfWeek ? (
              <a href="/admin/jadwal"><Button type="button" variant="ghost" size="sm">Reset</Button></a>
            ) : null}
          </div>
        </form>
      </Card>

      {items.length > 0 ? (
        <Card padding="none">
          <JadwalTable items={items} options={options} />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination
                page={page}
                totalPages={totalPages}
                baseUrl="/admin/jadwal"
                params={filterParams}
                totalItems={total}
                limit={10}
              />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q || classId || teacherId || subjectId ? "Tidak ada hasil" : "Belum ada jadwal"}
            description={
              q || classId || teacherId || subjectId
                ? "Tidak ada jadwal yang cocok dengan filter."
                : "Tambahkan jadwal pelajaran baru."
            }
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} jadwal</p>
    </div>
  );
}