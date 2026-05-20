// ══════════════════════════════════════════════
// Siswa List Page (Server Component)
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import SiswaTable from "@/components/admin/siswa/siswa-table";
import SiswaForm from "@/components/admin/siswa/siswa-form";
import { searchSiswa, getKelasOptions } from "@/services/master/siswa.service";

export default async function SiswaListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; classId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const classId = params.classId || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const [{ items, total, totalPages }, kelasOptions] = await Promise.all([
    searchSiswa({ q, classId, page, limit: 10 }),
    getKelasOptions(true),
  ]);

  return (
    <div>
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa di sekolah."
        actions={
          <SiswaForm
            mode="create"
            kelasOptions={kelasOptions}
            trigger={
              <Button leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }>
                Tambah Siswa
              </Button>
            }
          />
        }
      />

      {/* Filter & Search */}
      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cari</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama atau NIS..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kelas</label>
            <select
              name="classId"
              defaultValue={classId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || classId ? (
              <a href="/admin/siswa">
                <Button type="button" variant="ghost" size="sm">Reset</Button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {/* Table */}
      {items.length > 0 ? (
        <Card padding="none">
          <SiswaTable items={items} kelasOptions={kelasOptions} />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination page={page} totalPages={totalPages} baseUrl="/admin/siswa" params={{ q, classId }} totalItems={total} limit={10} />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q ? "Tidak ada hasil" : "Belum ada data siswa"}
            description={q ? "Tidak ada siswa yang cocok dengan pencarian." : "Tambahkan siswa baru untuk memulai."}
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">
        Total: {total} siswa
      </p>
    </div>
  );
}