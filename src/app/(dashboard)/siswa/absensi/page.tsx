// ══════════════════════════════════════════════
// Siswa: Absensi
// Read-only riwayat absensi siswa login
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import AbsensiRecapTable from "@/components/absensi/absensi-recap-table";
import {
  getAbsensiOptions,
  searchAbsensi,
} from "@/services/absensi.service";
import { SEMESTER_LABELS } from "@/lib/constants";

export default async function SiswaAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ semesterId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "STUDENT") {
    redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);
  }

  const params = await searchParams;
  const semesterId = params.semesterId || "";

  // Ambil student profile
  const student = await prisma.student.findFirst({
    where: { userId: session.user.id, isDeleted: false },
    include: { class: { select: { id: true, name: true } } },
  });

  if (!student) {
    return (
      <div>
        <PageHeader title="Absensi" description="Profil belum terhubung." />
        <Card className="p-8 text-center text-slate-400">
          Hubungi administrator untuk menghubungkan akun Anda.
        </Card>
      </div>
    );
  }

  const { semesters, activeSemester } = await getAbsensiOptions();

  const semId = semesterId || activeSemester?.id || "";

  const { items, total } = semId
    ? await searchAbsensi({
        studentId: student.id,
        semesterId: semId,
        page: 1,
        limit: 30,
      })
    : { items: [], total: 0 };

  const semesterLabel = semesters.find((s) => s.id === semId);

  return (
    <div>
      <PageHeader
        title="Absensi Saya"
        description={`Kelas ${student.class.name} — NIS: ${student.nis}`}
      />

      {activeSemester && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <Badge variant="success">{activeSemester.type === "GANJIL" ? "Ganjil" : "Genap"}</Badge>
          <span className="text-sm text-slate-500">
            {semesters.find((s) => s.id === semId)
              ? semesterLabel
                ? `Semester ${SEMESTER_LABELS[semesterLabel.type]}`
                : ""
              : "Semua semester"}
          </span>
        </div>
      )}

      {/* Semester filter */}
      <Card className="mb-6 p-4">
        <form method="get" className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Semester:</label>
          <select
            name="semesterId"
            defaultValue={semId}
            onChange={(e) => e.currentTarget.form?.submit()}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          >
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.type === "GANJIL" ? "Ganjil" : "Genap"}
              </option>
            ))}
          </select>
        </form>
      </Card>

      {items.length > 0 ? (
        <Card padding="none">
          <AbsensiRecapTable items={items} showStudent={false} />
        </Card>
      ) : (
        <Card className="p-8">
          <p className="text-center text-slate-400">
            {semId ? "Belum ada data absensi di semester ini." : "Pilih semester untuk melihat absensi."}
          </p>
        </Card>
      )}

      <p className="text-sm text-slate-400 mt-3">Total: {total} record</p>
    </div>
  );
}