// Dashboard Admin
// Menampilkan statistik real dari database
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { getAdminDashboardData } from "@/services/dashboard.service";
import { Role } from "@prisma/client";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;
  if (role !== "ADMIN") redirect(`/dashboard/${role.toLowerCase()}`);

  const { stats, kelasStats } = await getAdminDashboardData();

  const shortcutLinks = [
    { href: "/admin/siswa", label: "Data Siswa", color: "text-amber-600" },
    { href: "/admin/guru", label: "Data Guru", color: "text-orange-600" },
    { href: "/admin/kelas", label: "Data Kelas", color: "text-lime-600" },
    { href: "/admin/mapel", label: "Mata Pelajaran", color: "text-sky-600" },
    { href: "/admin/jadwal", label: "Jadwal", color: "text-purple-600" },
    { href: "/admin/akun", label: "Akun", color: "text-pink-600" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Admin"
        description="Kelola seluruh data akademik sekolah."
      />

      {/* Tahun Ajaran Aktif */}
      {stats.academicYear && stats.semester ? (
        <div className="mb-6 flex items-center gap-3 text-sm">
          <Badge variant="success">Aktif</Badge>
          <span className="text-slate-600 font-medium">
            Tahun Ajaran {stats.academicYear.name} — Semester{" "}
            {stats.semester.type === "GANJIL" ? "Ganjil" : "Genap"}
          </span>
        </div>
      ) : (
        <div className="mb-6">
          <Badge variant="warning">Tahun ajaran belum diatur</Badge>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Siswa"
          value={stats.totalSiswa}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="amber"
        />
        <StatCard
          label="Total Guru"
          value={stats.totalGuru}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="orange"
        />
        <StatCard
          label="Total Kelas"
          value={stats.totalKelas}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="lime"
        />
        <StatCard
          label="Mata Pelajaran"
          value={stats.totalMapel}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="sky"
        />
        <StatCard
          label="Jadwal Aktif"
          value={stats.totalJadwal}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Shortcut Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {shortcutLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="p-4 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer text-center">
              <p className={`font-semibold text-sm ${link.color}`}>{link.label}</p>
              <p className="text-xs text-slate-400 mt-1">Kelola →</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Ringkasan Per Kelas */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Ringkasan Per Kelas</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Jumlah siswa per kelas tahun ajaran aktif
          </p>
        </div>

        {kelasStats.length > 0 ? (
          <div className="overflow-x-auto">
            <Table noPadding>
              <TableHead>
                <TableHeadCell>No</TableHeadCell>
                <TableHeadCell>Kelas</TableHeadCell>
                <TableHeadCell>Tingkat</TableHeadCell>
                <TableHeadCell>Wali Kelas</TableHeadCell>
                <TableHeadCell>Jumlah Siswa</TableHeadCell>
              </TableHead>
              <TableBody>
                {kelasStats.map((kelas, idx) => (
                  <TableRow key={kelas.id}>
                    <TableCell muted>{idx + 1}</TableCell>
                    <TableCell bold>{kelas.name}</TableCell>
                    <TableCell>
                      <Badge variant="info">Kelas {kelas.gradeLevel}</Badge>
                    </TableCell>
                    <TableCell>{kelas.waliKelas}</TableCell>
                    <TableCell>
                      <span className="font-bold text-amber-600">
                        {kelas.jumlahSiswa}
                      </span>{" "}
                      <span className="text-slate-400 text-xs">siswa</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            Belum ada kelas pada tahun ajaran aktif.
          </div>
        )}
      </Card>
    </div>
  );
}
