// ══════════════════════════════════════════════
// Siswa: Jadwal Pelajaran
// Read-only jadwal untuk siswa yang login
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import ReadOnlyJadwalTable from "@/components/jadwal/jadwal-readonly-table";
import { getSiswaSchedule } from "@/services/jadwal.service";
import { SEMESTER_LABELS } from "@/lib/constants";

export default async function SiswaJadwalPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "STUDENT") redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);

  // Ambil student profile
  const student = await prisma.student.findFirst({
    where: { userId: session.user.id, isDeleted: false },
    include: {
      class: { select: { id: true, name: true, academicYearId: true } },
    },
  });

  if (!student) {
    return (
      <div>
        <PageHeader title="Jadwal Pelajaran" description="Profil siswa belum terhubung." />
        <Card className="p-8 text-center text-slate-400">
          Hubungi administrator untuk menghubungkan akun Anda dengan profil siswa.
        </Card>
      </div>
    );
  }

  // Ambil semester aktif
  const activeSem = await prisma.semester.findFirst({
    where: {
      isActive: true,
      academicYearId: student.class.academicYearId,
    },
    include: { academicYear: { select: { name: true } } },
  });

  const schedules = activeSem
    ? await getSiswaSchedule(student.classId, activeSem.id)
    : [];

  return (
    <div>
      <PageHeader
        title="Jadwal Pelajaran"
        description={`Kelas ${student.class.name} — ${student.class.name}`}
      />

      {activeSem && (
        <div className="mb-4">
          <Badge variant="success">
            {activeSem.academicYear.name} — {SEMESTER_LABELS[activeSem.type]}
          </Badge>
          <span className="ml-2 text-sm text-slate-500">Semester aktif</span>
        </div>
      )}

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Jadwal Pelajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {schedules.length} jadwal pada semester ini
          </p>
        </div>
        <div className="p-5">
          <ReadOnlyJadwalTable
            items={schedules}
            showTeacher
            emptyTitle="Belum ada jadwal"
            emptyDescription={
              activeSem
                ? "Belum ada jadwal pelajaran pada semester aktif."
                : "Semester aktif belum diatur. Hubungi administrator."
            }
          />
        </div>
      </Card>
    </div>
  );
}