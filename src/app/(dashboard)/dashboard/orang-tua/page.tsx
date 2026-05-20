// Dashboard Orang Tua
// Menampilkan data anak yang terhubung
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import EmptyState from "@/components/ui/empty-state";
import Badge from "@/components/ui/badge";
import { getOrangTuaDashboardData } from "@/services/dashboard.service";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function OrangTuaDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role as Role;
  if (role !== "PARENT") redirect(`/dashboard/${role.toLowerCase()}`);

  // Ambil parent profile dari userId
  const parentProfile = await prisma.parent.findFirst({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!parentProfile) {
    return (
      <div>
        <PageHeader
          title="Dashboard Orang Tua"
          description="Pantau perkembangan akademik anak Anda."
        />
        <Card className="p-8">
          <EmptyState
            title="Profil orang tua belum terhubung."
            description="Silakan hubungi administrator untuk menghubungkan akun Anda."
            icon={
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </Card>
      </div>
    );
  }

  const { children } = await getOrangTuaDashboardData(parentProfile.id);

  const shortcuts = [
    { href: "/orang-tua/anak", label: "Data Anak" },
    { href: "/orang-tua/nilai", label: "Nilai" },
    { href: "/orang-tua/absensi", label: "Absensi" },
    { href: "/orang-tua/rapor", label: "Rapor" },
  ];

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${parentProfile.name}`}
        description="Pantau perkembangan akademik anak Anda."
      />

      {/* Stat */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Jumlah Anak"
          value={children.length}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Mapel"
          value={
            children.reduce((sum, c) => sum + c.gradesSummary.totalMapel, 0)
          }
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Total Kehadiran"
          value={
            children.reduce((sum, c) => sum + c.attendanceSummary.hadir, 0)
          }
          color="lime"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Rapor Tersedia"
          value={children.filter((c) => c.hasReportCard).length}
          color="sky"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-3 mb-8">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <button className="btn-primary text-sm">{s.label}</button>
          </Link>
        ))}
      </div>

      {/* Daftar Anak */}
      <h2 className="font-bold text-slate-800 text-lg mb-4">Daftar Anak</h2>

      {children.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{child.name}</h3>
                  <p className="text-sm text-slate-500">
                    {child.className}
                  </p>
                  <p className="text-xs text-slate-400">
                    NIS: {child.nis}
                  </p>
                </div>
                {child.hasReportCard && (
                  <Badge variant="success">Rapor Tersedia</Badge>
                )}
              </div>

              {/* Stats mini */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-lime-50 rounded-lg">
                  <p className="text-lg font-bold text-lime-700">
                    {child.attendanceSummary.hadir}
                  </p>
                  <p className="text-xs text-lime-600">Hadir</p>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-700">
                    {child.attendanceSummary.alfa}
                  </p>
                  <p className="text-xs text-amber-600">Alfa</p>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-700">
                    {child.gradesSummary.rataRata ?? "—"}
                  </p>
                  <p className="text-xs text-amber-600">Rata-rata</p>
                </div>
              </div>

              {/* Progress kehadiran */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Kehadiran</span>
                  <span className="font-semibold text-lime-600">
                    {child.attendanceSummary.hadirPersen}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full"
                    style={{ width: `${child.attendanceSummary.hadirPersen}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState
            title="Belum ada anak yang terhubung."
            description="Silakan hubungi administrator untuk menghubungkan akun Anda dengan data anak."
          />
        </Card>
      )}
    </div>
  );
}
