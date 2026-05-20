// ══════════════════════════════════════════════
// Kepala Sekolah: Rekap Absensi
// Read-only rekap absensi per kelas
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import SemesterFilter from "@/components/absensi/semester-filter";
import { getAbsensiOptions, getAllClassesAbsensiRecap } from "@/services/absensi.service";

export default async function KepalaSekolahAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ semesterId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "PRINCIPAL") {
    redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);
  }

  const params = await searchParams;
  const semesterId = params.semesterId || "";

  const [{ semesters, activeSemester }, recapData] = await Promise.all([
    getAbsensiOptions(),
    getAllClassesAbsensiRecap(semesterId || undefined),
  ]);

  const { classes } = recapData;

  return (
    <div>
      <PageHeader
        title="Rekap Absensi"
        description="Lihat rekap absensi per kelas (read-only)."
      />

      {activeSemester ? (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="success">{activeSemester.type === "GANJIL" ? "Ganjil" : "Genap"}</Badge>
          <span className="text-sm text-slate-500">Semester aktif</span>
        </div>
      ) : (
        <div className="mb-4">
          <Badge variant="warning">Tahun ajaran belum diatur</Badge>
        </div>
      )}

      <Card className="mb-6 p-4">
        <SemesterFilter semesters={semesters} activeSemesterId={semesterId || activeSemester?.id} />
      </Card>

      {classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map((cls) => (
            <Card key={cls.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">{cls.name}</p>
                  <p className="text-xs text-slate-400">
                    Wali kelas: {cls.homeroomTeacher?.name ?? "—"} · {cls._count.students} siswa
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${cls.summary.presentasi >= 90 ? "text-lime-600" : cls.summary.presentasi >= 75 ? "text-amber-600" : "text-red-600"}`}>
                    {cls.summary.presentasi}%
                  </p>
                  <p className="text-xs text-slate-400">Kehadiran</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Hadir", value: cls.summary.hadir, color: "lime" },
                  { label: "Sakit", value: cls.summary.sakit, color: "orange" },
                  { label: "Izin", value: cls.summary.izin, color: "amber" },
                  { label: "Alfa", value: cls.summary.alfa, color: "red" },
                ].map((item) => (
                  <div key={item.label} className={`text-center p-2 bg-${item.color}-50 rounded-lg`}>
                    <p className={`text-lg font-bold text-${item.color}-700`}>{item.value}</p>
                    <p className={`text-xs text-${item.color}-600`}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Kehadiran bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Kehadiran</span>
                  <span className="font-semibold text-lime-600">{cls.summary.presentasi}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full"
                    style={{ width: `${cls.summary.presentasi}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-slate-400">
          {semesterId ? "Tidak ada data absensi di semester ini." : "Tidak ada kelas dengan data absensi."}
        </Card>
      )}
    </div>
  );
}