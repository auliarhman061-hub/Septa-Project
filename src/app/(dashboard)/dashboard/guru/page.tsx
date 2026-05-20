// Dashboard Guru
// Menampilkan data real sesuai guru yang login
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { getGuruDashboardData } from "@/services/dashboard.service";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function GuruDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;
  if (role !== "TEACHER") redirect(`/dashboard/${role.toLowerCase()}`);

  // Ambil teacher profile dari userId
  const teacherProfile = await prisma.teacher.findFirst({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!teacherProfile) {
    return (
      <div>
        <PageHeader
          title="Dashboard Guru"
          description="Kelola absensi dan nilai siswa."
        />
        <Card className="p-8">
          <EmptyState
            title="Profil Guru belum terhubung."
            description="Silakan hubungi administrator untuk menghubungkan akun Anda dengan profil guru."
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </Card>
      </div>
    );
  }

  const { data } = await getGuruDashboardData(teacherProfile.id);

  const shortcuts = [
    { href: "/guru/jadwal", label: "Jadwal Mengajar" },
    { href: "/guru/absensi", label: "Input Absensi" },
    { href: "/guru/nilai", label: "Input Nilai" },
  ];

  if (!data) {
    return (
      <div>
        <PageHeader
          title={`Dashboard Guru`}
          description={`Selamat datang, ${teacherProfile.name}`}
        />
        <Card className="p-8 text-center">
          <EmptyState
            title="Tahun ajaran belum diatur."
            description="Hubungi administrator untuk mengatur tahun ajaran dan semester aktif."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${teacherProfile.name}`}
        description="Kelola absensi dan nilai siswa."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Kelas yang Diajar"
          value={data.kelasCount}
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          label="Mata Pelajaran"
          value={data.mapelCount}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Total Siswa"
          value={data.siswaCount}
          color="lime"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          label="Jadwal Hari Ini"
          value={data.todaySchedule.length}
          color="sky"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-3 mb-8">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <button className="btn-primary text-sm">
              {s.label}
            </button>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Jadwal Hari Ini */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Jadwal Hari Ini</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {data.todaySchedule.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.todaySchedule.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {s.subjectName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Kelas {s.className}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {s.startTime} – {s.endTime}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              Tidak ada jadwal hari ini.
            </div>
          )}
        </Card>

        {/* Ringkasan Mingguan */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Ringkasan Jadwal Mingguan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Jumlah jam mengajar per hari</p>
          </div>
          {data.weekSchedule.length > 0 ? (
            <div className="p-5">
              <div className="space-y-3">
                {data.weekSchedule.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium w-16">
                      {day.dayLabel}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden flex-1 max-w-[200px]">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: `${Math.min((day.count / 6) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-amber-700 w-6 text-right">
                        {day.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              Belum ada jadwal pada semester aktif.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
