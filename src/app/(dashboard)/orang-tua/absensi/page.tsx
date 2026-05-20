// ══════════════════════════════════════════════
// Orang Tua: Absensi Anak
// Read-only absensi anak yang terhubung
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import AbsensiRecapTable from "@/components/absensi/absensi-recap-table";
import SemesterFilter from "@/components/absensi/semester-filter";
import { getAbsensiOptions, getChildrenAbsensi, getStudentAttendanceHistory } from "@/services/absensi.service";

export default async function OrangTuaAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ semesterId?: string; childId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "PARENT") {
    redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);
  }

  const params = await searchParams;
  const semesterId = params.semesterId || "";
  const childId = params.childId || "";

  const parent = await prisma.parent.findFirst({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!parent) {
    return (
      <div>
        <PageHeader title="Absensi Anak" description="Profil orang tua belum terhubung." />
        <Card className="p-8 text-center text-slate-400">
          Hubungi administrator untuk menghubungkan akun Anda.
        </Card>
      </div>
    );
  }

  const { semesters, activeSemester } = await getAbsensiOptions();
  const children = await getChildrenAbsensi(parent.id, semesterId || undefined);

  const activeChild = childId ? children.find((c) => c.id === childId) : children[0];
  const childAttendance = activeChild
    ? await getStudentAttendanceHistory(activeChild.id, semesterId || undefined)
    : [];

  return (
    <div>
      <PageHeader
        title="Absensi Anak"
        description={`Orang Tua: ${parent.name} — ${children.length} anak`}
      />

      {children.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {children.map((child) => (
            <Card key={child.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-slate-800">{child.name}</p>
                  <p className="text-xs text-slate-400">{child.className}</p>
                  <p className="text-xs text-slate-400">NIS: {child.nis}</p>
                </div>
                <a href={`/orang-tua/absensi?childId=${child.id}&semesterId=${semesterId || ""}`}>
                  <Badge variant={child.id === activeChild?.id ? "info" : "outline"}>
                    {child.id === activeChild?.id ? "Dipilih" : "Pilih"}
                  </Badge>
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center p-2 bg-lime-50 rounded">
                  <p className="text-lg font-bold text-lime-700">{child.attendanceSummary.hadir}</p>
                  <p className="text-xs text-lime-600">Hadir</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="text-lg font-bold text-red-700">{child.attendanceSummary.alfa}</p>
                  <p className="text-xs text-red-600">Alfa</p>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded">
                  <p className="text-lg font-bold text-amber-700">{child.attendanceSummary.hadirPersen}%</p>
                  <p className="text-xs text-amber-600">Kehadiran</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-6 p-8 text-center text-slate-400">
          Belum ada anak yang terhubung dengan akun Anda.
        </Card>
      )}

      {activeChild && (
        <>
          <Card className="mb-4 p-4">
            <SemesterFilter semesters={semesters} activeSemesterId={semesterId || activeSemester?.id} />
          </Card>

          <Card padding="none">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">
                Riwayat Absensi — {activeChild.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{childAttendance.length} record</p>
            </div>
            {childAttendance.length > 0 ? (
              <AbsensiRecapTable items={childAttendance} showStudent={false} />
            ) : (
              <div className="p-8 text-center text-slate-400">
                {semesterId ? "Belum ada data absensi di semester ini." : "Pilih semester untuk melihat absensi."}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}