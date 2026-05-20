// Dashboard Kepala Sekolah
// Read-only: statistik dan rekap akademik
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { getKepalaSekolahDashboardData } from "@/services/dashboard.service";
import { Role } from "@prisma/client";

export default async function KepalaSekolahDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;
  if (role !== "PRINCIPAL") redirect(`/dashboard/${role.toLowerCase()}`);

  const { stats, kelasStats, weekScheduleCount, academicYear, semester } =
    await getKepalaSekolahDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard Kepala Sekolah"
        description="Lihat laporan dan statistik akademik sekolah."
      />

      {/* Info Tahun Ajaran */}
      {academicYear && semester ? (
        <div className="mb-6">
          <Badge variant="success" size="md">
            {academicYear.name} — {semester.type === "GANJIL" ? "Ganjil" : "Genap"}
          </Badge>
          <span className="ml-3 text-sm text-slate-500">
            Semester aktif
          </span>
        </div>
      ) : (
        <Badge variant="warning" className="mb-6">
          Tahun ajaran belum diatur
        </Badge>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Siswa"
          value={stats.totalSiswa}
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Guru"
          value={stats.totalGuru}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <StatCard
          label="Total Kelas"
          value={stats.totalKelas}
          color="lime"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          label="Jadwal Minggu Ini"
          value={weekScheduleCount}
          color="sky"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Shortcut */}
      <div className="mb-8">
        <Link href="/kepala-sekolah/laporan">
          <button className="btn-primary">
            Lihat Laporan Akademik
          </button>
        </Link>
      </div>

      {/* Rekap Per Kelas */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Rekap Akademik Per Kelas</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Ringkasan nilai dan kehadiran per kelas
          </p>
        </div>

        {kelasStats.length > 0 ? (
          <div className="overflow-x-auto">
            <Table noPadding>
              <TableHead>
                <TableHeadCell>No</TableHeadCell>
                <TableHeadCell>Kelas</TableHeadCell>
                <TableHeadCell>Wali Kelas</TableHeadCell>
                <TableHeadCell>Siswa</TableHeadCell>
                <TableHeadCell>Rata-rata Nilai</TableHeadCell>
                <TableHeadCell>Kehadiran</TableHeadCell>
              </TableHead>
              <TableBody>
                {kelasStats.map((kelas, idx) => (
                  <TableRow key={kelas.id}>
                    <TableCell muted>{idx + 1}</TableCell>
                    <TableCell bold>{kelas.name}</TableCell>
                    <TableCell>{kelas.waliKelas}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-700">
                        {kelas.jumlahSiswa}
                      </span>
                    </TableCell>
                    <TableCell>
                      {kelas.avgNilai != null ? (
                        <span className="font-bold text-amber-600">
                          {kelas.avgNilai}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-lime-400 rounded-full"
                            style={{ width: `${kelas.hadirPersen}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-lime-700">
                          {kelas.hadirPersen}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-400">
            <EmptyState
              title="Belum ada data kelas."
              description="Hubungi administrator untuk mengatur data kelas."
            />
          </div>
        )}
      </Card>
    </div>
  );
}
