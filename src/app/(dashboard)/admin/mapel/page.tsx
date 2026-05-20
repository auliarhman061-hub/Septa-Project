// ══════════════════════════════════════════════
// Mata Pelajaran List Page (Server Component)
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import { searchMapel } from "@/services/master/mapel.service";
import MapelTable from "@/components/admin/mapel/mapel-table";

export default async function MapelListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; gradeLevel?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const gradeLevel = params.gradeLevel ? parseInt(params.gradeLevel, 10) : undefined;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const { items, total, totalPages } = await searchMapel({ q, gradeLevel, page, limit: 10 });

  return (
    <div>
      <PageHeader
        title="Mata Pelajaran"
        description="Kelola mata pelajaran yang diajarkan di sekolah."
        actions={
          <Button leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Mapel
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
              placeholder="Cari nama atau kode..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tingkat</label>
            <select
              name="gradeLevel"
              defaultValue={params.gradeLevel || ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || params.gradeLevel ? (
              <a href="/admin/mapel">
                <Button type="button" variant="ghost" size="sm">Reset</Button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {items.length > 0 ? (
        <Card padding="none">
          <MapelTable items={items} />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination page={page} totalPages={totalPages} baseUrl="/admin/mapel" params={{ q, gradeLevel: params.gradeLevel ?? "" }} totalItems={total} limit={10} />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q ? "Tidak ada hasil" : "Belum ada mata pelajaran"}
            description={q ? "Tidak ada mapel yang cocok dengan pencarian." : "Tambahkan mata pelajaran baru untuk memulai."}
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} mata pelajaran</p>
    </div>
  );
}