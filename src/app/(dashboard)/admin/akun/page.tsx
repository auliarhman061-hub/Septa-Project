// ══════════════════════════════════════════════
// Akun List Page (Server Component)
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ServerPagination from "@/components/ui/server-pagination";
import Button from "@/components/ui/button";
import { searchAkun } from "@/services/master/akun.service";
import AkunTable from "@/components/admin/akun/akun-table";

export default async function AkunListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; isActive?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "ADMIN") redirect("/dashboard/admin");

  const params = await searchParams;
  const q = params.q || "";
  const role = params.role || "";
  const isActive = params.isActive === "false" ? false : params.isActive === "true" ? true : undefined;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const { items, total, totalPages } = await searchAkun({ q, role, isActive, page, limit: 10 });

  return (
    <div>
      <PageHeader
        title="Kelola Akun"
        description="Kelola akun pengguna, role, dan status aktif."
        actions={
          <Button leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Akun
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
              placeholder="Cari nama atau email..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
            <select
              name="role"
              defaultValue={role}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua Role</option>
              <option value="ADMIN">Admin / TU</option>
              <option value="TEACHER">Guru</option>
              <option value="STUDENT">Siswa</option>
              <option value="PRINCIPAL">Kepala Sekolah</option>
              <option value="PARENT">Orang Tua</option>
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select
              name="isActive"
              defaultValue={params.isActive ?? ""}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Semua</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {q || role || params.isActive ? (
              <a href="/admin/akun">
                <Button type="button" variant="ghost" size="sm">Reset</Button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>

      {items.length > 0 ? (
        <Card padding="none">
          <AkunTable items={items} />
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <ServerPagination page={page} totalPages={totalPages} baseUrl="/admin/akun" params={{ q, role, isActive: params.isActive ?? "" }} totalItems={total} limit={10} />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8">
          <EmptyState
            title={q ? "Tidak ada hasil" : "Belum ada akun"}
            description={q ? "Tidak ada akun yang cocok dengan pencarian." : "Tambahkan akun baru untuk memulai."}
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} akun</p>
    </div>
  );
}