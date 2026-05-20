// ══════════════════════════════════════════════
// Guru List Page (Server Component)
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import GuruTable from "@/components/admin/guru/guru-table";
import GuruForm from "@/components/admin/guru/guru-form";
import { searchGuru, getMapelOptions } from "@/services/master/guru.service";

export default async function GuruListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subjectId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const subjectId = params.subjectId || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const [{ items, total, totalPages }, mapelOptions] = await Promise.all([
    searchGuru({ q, subjectId, page, limit: 10 }),
    getMapelOptions(),
  ]);

  return (
    <div>
      <PageHeader
        title="Data Guru"
        description="Kelola data guru yang mengajar di sekolah."
        actions={
          <GuruForm
            mode="create"
            mapelOptions={mapelOptions}
            trigger={
              <Button leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }>
                Tambah Guru
              </Button>
            }
          />
        }
      />

      {/* Filter */}
      <Card className="mb-6 p-4">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cari</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama atau NIP..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Mapel</label>
            <select
              name="subjectId"
              defaultValue={subjectId}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua Mapel</option>
              {mapelOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || subjectId ? (
              <a href="/admin/guru">
                <Button type="button" variant="ghost" size="sm">Reset</Button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {/* Table */}
      {items.length > 0 ? (
        <Card padding="none">
          <GuruTable items={items} mapelOptions={mapelOptions} />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination page={page} totalPages={totalPages} baseUrl="/admin/guru" params={{ q, subjectId }} totalItems={total} limit={10} />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q ? "Tidak ada hasil" : "Belum ada data guru"}
            description={q ? "Tidak ada guru yang cocok dengan pencarian." : "Tambahkan guru baru untuk memulai."}
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} guru</p>
    </div>
  );
}