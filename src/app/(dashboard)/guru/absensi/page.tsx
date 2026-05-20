// ══════════════════════════════════════════════
// Guru: Input Absensi
// Input absensi untuk kelas yang diajar
// ══════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import GuruAbsensiForm from "@/components/absensi/guru-absensi-form";
import { getAbsensiOptions, getTeacherAuthorizedClasses, getStudentsInClass, getExistingAttendance } from "@/services/absensi.service";

export default async function GuruAbsensiPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; date?: string; semesterId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user.role as Role) !== "TEACHER") {
    redirect(`/dashboard/${(session.user.role as Role).toLowerCase()}`);
  }

  const params = await searchParams;
  const classId = params.classId || "";
  const date = params.date || "";
  const semesterId = params.semesterId || "";

  const teacher = await prisma.teacher.findFirst({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });

  if (!teacher) {
    return (
      <div>
        <PageHeader title="Input Absensi" description="Profil guru belum terhubung." />
        <Card className="p-8 text-center text-slate-400">
          Hubungi administrator untuk menghubungkan akun Anda.
        </Card>
      </div>
    );
  }

  const [{ activeAcademicYear, activeSemester, classes }, authorizedClassIds] =
    await Promise.all([
      getAbsensiOptions(),
      getTeacherAuthorizedClasses(teacher.id),
    ]);

  const authorizedClasses = classes.filter((c) => authorizedClassIds.includes(c.id));
  const today = new Date().toISOString().split("T")[0];
  const defaultSemesterId = semesterId || activeSemester?.id || "";

  if (authorizedClasses.length === 0) {
    return (
      <div>
        <PageHeader title="Input Absensi" description={`Guru: ${teacher.name}`} />
        <Card className="p-8">
          <EmptyState
            title="Belum ada kelas yang diajar"
            description="Hubungi administrator untuk menambahkan jadwal mengajar Anda."
          />
        </Card>
      </div>
    );
  }

  // Show attendance form if classId + date + semesterId are provided
  if (classId && date && defaultSemesterId) {
    const [students, existing] = await Promise.all([
      getStudentsInClass(classId),
      getExistingAttendance(classId, date),
    ]);

    return (
      <div>
        <PageHeader
          title="Input Absensi"
          description={activeAcademicYear ? `${activeAcademicYear.name} — ${date}` : date}
          breadcrumb={[{ label: "Input Absensi", href: "/guru/absensi" }]}
        />
        <div className="mb-4">
          <a href="/guru/absensi" className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </a>
        </div>
        <GuruAbsensiForm
          students={students}
          existingAttendance={existing}
          classId={classId}
          date={date}
          semesterId={defaultSemesterId}
          activeAyName={activeAcademicYear?.name}
        />
      </div>
    );
  }

  // Default: class/date selection
  return (
    <div>
      <PageHeader
        title="Input Absensi"
        description={`Guru: ${teacher.name} — ${authorizedClasses.length} kelas`}
      />

      {activeSemester && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="success">{activeAcademicYear?.name}</Badge>
          <Badge variant="info">{activeSemester.type === "GANJIL" ? "Ganjil" : "Genap"}</Badge>
          <span className="text-sm text-slate-500">Semester aktif</span>
        </div>
      )}

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Pilih Kelas dan Tanggal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Anda hanya bisa input absensi untuk kelas yang Anda ajar.
          </p>
        </div>
        <form method="get" className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kelas</label>
              <select name="classId" defaultValue={classId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" required>
                <option value="">Pilih Kelas</option>
                {authorizedClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal</label>
              <input name="date" type="date" defaultValue={date || today} max={today}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" required />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
              Lanjutkan
            </button>
            {classId || date ? (
              <a href="/guru/absensi">
                <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-500 hover:text-slate-700">
                  Reset
                </button>
              </a>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}