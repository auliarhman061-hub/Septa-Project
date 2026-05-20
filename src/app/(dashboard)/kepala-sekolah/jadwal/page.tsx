// ══════════════════════════════════════════════
// Kepala Sekolah: Jadwal Pelajaran
// Read-only semua jadwal
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import ReadOnlyJadwalTable from "@/components/jadwal/jadwal-readonly-table";
import { SEMESTER_LABELS } from "@/lib/constants";
import { searchJadwal } from "@/services/jadwal.service";

export default async function KepalaSekolahJadwalPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "PRINCIPAL") {
    redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);
  }

  // Ambil semester aktif
  const activeSem = await prisma.semester.findFirst({
    where: { isActive: true },
    include: { academicYear: { select: { name: true } } },
  });

  const schedules = activeSem
    ? await searchJadwal({ semesterId: activeSem.id, page: 1, limit: 200 }).then((r) => r.items)
    : [];

  return (
    <div>
      <PageHeader
        title="Jadwal Pelajaran"
        description="Lihat semua jadwal pelajaran sekolah (read-only)."
      />

      {activeSem ? (
        <div className="mb-4">
          <Badge variant="success">
            {activeSem.academicYear.name} — {SEMESTER_LABELS[activeSem.type]}
          </Badge>
          <span className="ml-2 text-sm text-slate-500">Semester aktif</span>
          <span className="ml-3 text-xs text-slate-400">
            ({schedules.length} jadwal)
          </span>
        </div>
      ) : (
        <div className="mb-4">
          <Badge variant="warning">Tahun ajaran belum diatur</Badge>
        </div>
      )}

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Semua Jadwal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeSem
              ? `Jadwal semester ${SEMESTER_LABELS[activeSem.type]}`
              : "Tidak ada semester aktif"}
          </p>
        </div>
        <div className="p-5">
          <ReadOnlyJadwalTable
            items={schedules}
            showClass
            showTeacher
            emptyTitle="Belum ada jadwal"
            emptyDescription={
              activeSem
                ? "Belum ada jadwal pada semester aktif."
                : "Semester aktif belum diatur. Hubungi administrator."
            }
          />
        </div>
      </Card>
    </div>
  );
}