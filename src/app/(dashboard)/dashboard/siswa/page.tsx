// Dashboard Siswa
// Menampilkan data real sesuai siswa yang login
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { getSiswaDashboardData } from "@/services/dashboard.service";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function SiswaDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;
  if (role !== "STUDENT") redirect(`/dashboard/${role.toLowerCase()}`);

  // Ambil student profile dari userId
  const studentProfile = await prisma.student.findFirst({
    where: { userId: session.user.id, isDeleted: false },
    select: { id: true, name: true, nis: true },
  });

  if (!studentProfile) {
    return (
      <div>
        <PageHeader title="Dashboard Siswa" description="Lihat jadwal, nilai, dan rapor Anda." />
        <Card className="p-8">
          <EmptyState
            title="Profil siswa belum terhubung."
            description="Silakan hubungi administrator untuk menghubungkan akun Anda dengan profil siswa."
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </Card>
      </div>
    );
  }

  const { student, data } = await getSiswaDashboardData(studentProfile.id);

  if (!student || !data) {
    return (
      <div>
        <PageHeader
          title="Dashboard Siswa"
          description={`Selamat datang, ${studentProfile.name}`}
        />
        <Card className="p-8 text-center">
          <EmptyState
            title="Tahun ajaran belum diatur."
            description="Hubungi administrator."
          />
        </Card>
      </div>
    );
  }

  const shortcuts = [
    { href: "/siswa/jadwal", label: "Jadwal" },
    { href: "/siswa/absensi", label: "Absensi" },
    { href: "/siswa/nilai", label: "Nilai" },
    { href: "/siswa/rapor", label: "Rapor" },
  ];

  const { attendanceSummary, gradesSummary } = data;

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${student.name}`}
        description={`NIS: ${student.nis} · Kelas ${student.className}`}
      />

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs text-slate-500 mb-1">Kelas</p>
          <p className="font-bold text-slate-800">{student.className}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 mb-1">Wali Kelas</p>
          <p className="font-bold text-slate-800">
            {student.waliKelas}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 mb-1">Tahun Ajaran</p>
          <p className="font-bold text-slate-800">
            {student.academicYearName}
          </p>
        </Card>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-3 mb-8">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <button className="btn-secondary text-sm">{s.label}</button>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ringkasan Absensi */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Ringkasan Absensi</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Semester aktif
            </p>
          </div>
          {attendanceSummary && attendanceSummary.total > 0 ? (
            <div className="p-5">
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-lime-50 rounded-lg">
                  <p className="text-2xl font-bold text-lime-700">
                    {attendanceSummary.hadir}
                  </p>
                  <p className="text-xs text-lime-600 mt-1">Hadir</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">
                    {attendanceSummary.sakit}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Sakit</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700">
                    {attendanceSummary.izin}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Izin</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">
                    {attendanceSummary.alfa}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Alfa</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Persentase Kehadiran</span>
                  <span className="font-semibold text-lime-700">
                    {attendanceSummary.presentasi}%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full transition-all"
                    style={{ width: `${attendanceSummary.presentasi}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {attendanceSummary.total} hari masuk total
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              Belum ada data absensi.
            </div>
          )}
        </Card>

        {/* Ringkasan Nilai */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Ringkasan Nilai</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Semester aktif
            </p>
          </div>
          {gradesSummary ? (
            <div className="p-5">
              {/* Rata-rata */}
              <div className="text-center mb-4">
                <p className="text-4xl font-extrabold text-amber-500">
                  {gradesSummary.rataRata}
                </p>
                <p className="text-xs text-slate-500">Rata-rata Nilai Akhir</p>
              </div>

              {/* Nilai per Mapel */}
              {gradesSummary.subjects.length > 0 ? (
                <div className="space-y-2">
                  {gradesSummary.subjects.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 truncate flex-1">
                        {g.subjectName}
                      </span>
                      <span className="font-bold text-slate-800 text-sm ml-3">
                        {g.finalScore}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center">
                  Belum ada data nilai.
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              Belum ada data nilai.
            </div>
          )}
        </Card>
      </div>

      {/* Jadwal Hari Ini */}
      {data.todaySchedule.length > 0 && (
        <Card padding="none" className="mt-6">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Jadwal Hari Ini</h2>
          </div>
          <Table noPadding>
            <TableHead>
              <TableHeadCell>Jam</TableHeadCell>
              <TableHeadCell>Mata Pelajaran</TableHeadCell>
              <TableHeadCell>Guru</TableHeadCell>
            </TableHead>
            <TableBody>
              {data.todaySchedule.map((s) => (
                <TableRow key={s.startTime}>
                  <TableCell>
                    <Badge variant="outline">
                      {s.startTime} – {s.endTime}
                    </Badge>
                  </TableCell>
                  <TableCell bold>{s.subjectName}</TableCell>
                  <TableCell>{s.teacherName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
