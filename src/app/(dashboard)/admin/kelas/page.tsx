// ══════════════════════════════════════════════
// Kelas List Page (Server Component)
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import { searchKelas, getAcademicYearOptions } from "@/services/master/kelas.service";
import { getGuruOptions } from "@/services/master/guru.service";
import KelasTable from "@/components/admin/kelas/kelas-table";

export default async function KelasListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; academicYearId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const academicYearId = params.academicYearId || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const [{ items, total, totalPages }, ayOptions, guruOptions] = await Promise.all([
    searchKelas({ q, academicYearId, page, limit: 10 }),
    getAcademicYearOptions(false),
    getGuruOptions(),
  ]);

  return (
    <div>
      <PageHeader
        title="Data Kelas"
        description="Kelola kelas, tingkat, dan wali kelas."
        actions={
          <Button leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Kelas
          </Button>
        }
      />

      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cari</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama kelas..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-52">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tahun Ajaran</label>
            <select
              name="academicYearId"
              defaultValue={academicYearId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua</option>
              {ayOptions.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || academicYearId ? (
              <a href="/admin/kelas">
                <Button type="button" variant="ghost" size="sm">Reset</Button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {items.length > 0 ? (
        <Card padding="none">
          <KelasTable
            items={items}
            academicYearOptions={ayOptions}
            guruOptions={guruOptions}
          />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination page={page} totalPages={totalPages} baseUrl="/admin/kelas" params={{ q, academicYearId }} totalItems={total} limit={10} />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q ? "Tidak ada hasil" : "Belum ada data kelas"}
            description={q ? "Tidak ada kelas yang cocok dengan pencarian." : "Tambahkan kelas baru untuk memulai."}
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} kelas</p>
    </div>
  );
}