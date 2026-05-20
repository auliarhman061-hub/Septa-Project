// ══════════════════════════════════════════════
// Jadwal Form (Client Component)
// Create/Edit jadwal via Server Action
// ══════════════════════════════════════════════

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/admin/form-modal";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Alert from "@/components/ui/alert";
import { createJadwalAction, updateJadwalAction } from "@/actions/jadwal.actions";

const DAY_OPTIONS = [
  { value: "MONDAY", label: "Senin" },
  { value: "TUESDAY", label: "Selasa" },
  { value: "WEDNESDAY", label: "Rabu" },
  { value: "THURSDAY", label: "Kamis" },
  { value: "FRIDAY", label: "Jumat" },
  { value: "SATURDAY", label: "Sabtu" },
];

type InitialData = {
  id: string;
  class: { id: string; name: string };
  teacher: { id: string; name: string };
  subject: { id: string; name: string; code: string };
  academicYear: { id: string; name: string };
  semester: { id: string; type: string };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

type Options = {
  classes: Array<{ id: string; name: string; gradeLevel: number }>;
  teachers: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string; code: string }>;
  semesters: Array<{ id: string; type: string; academicYearId: string }>;
  academicYears: Array<{ id: string; name: string; isActive: boolean }>;
  activeAcademicYear?: { id: string; name: string } | null;
  activeSemester?: { id: string; type: string } | null;
};

type Props = {
  mode: "create" | "edit";
  initialData?: InitialData;
  options: Options;
  trigger?: React.ReactNode;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
};

export default function JadwalForm({ mode, initialData, options, trigger, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
    setError(null);
    setFieldErrors(null);
  }
  function close() {
    setIsOpen(false);
    setError(null);
    setFieldErrors(null);
    onClose?.();
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors(null);
    startTransition(async () => {
      const action = mode === "create" ? createJadwalAction : updateJadwalAction;
      const result = await action(formData);
      if (result.success) {
        close();
        router.refresh();
        onSuccess?.(result.message);
      } else {
        setError(result.message);
        if (result.errors) setFieldErrors(result.errors as Record<string, string[]>);
      }
    });
  }

  const {
    classes, teachers, subjects, semesters, academicYears,
    activeAcademicYear, activeSemester,
  } = options;

  const classOptions = classes.map((c) => ({ value: c.id, label: `${c.name}` }));
  const teacherOptions = teachers.map((t) => ({ value: t.id, label: t.name }));
  const subjectOptions = subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }));

  // Build semester options with year label
  const semesterOptions = semesters.map((s) => {
    const ay = academicYears.find((a) => a.id === s.academicYearId);
    const label = `${ay?.name ?? ""} — ${s.type === "GANJIL" ? "Ganjil" : "Genap"}`;
    return { value: s.id, label };
  });

  const ayOptions = academicYears.map((a) => ({ value: a.id, label: a.name }));

  // Default values
  const defaultAyId = activeAcademicYear?.id ?? initialData?.academicYear.id ?? academicYears[0]?.id ?? "";
  const defaultSemId = activeSemester?.id ?? initialData?.semester.id ?? semesters[0]?.id ?? "";

  return (
    <>
      {trigger && <div onClick={open}>{trigger}</div>}

      {(isOpen || mode === "edit") && (
        <FormModal
          title={mode === "create" ? "Tambah Jadwal" : "Edit Jadwal"}
          onClose={close}
          submitLabel={mode === "create" ? "Simpan" : "Perbarui"}
          isSubmitting={isPending}
          error={error}
        >
          <form action={handleSubmit}>
            {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tahun Ajaran" required error={fieldErrors?.academicYearId?.[0]}>
                <Select
                  name="academicYearId"
                  options={ayOptions}
                  defaultValue={defaultAyId}
                  placeholder="Pilih"
                  required
                />
              </FormField>
              <FormField label="Semester" required error={fieldErrors?.semesterId?.[0]}>
                <Select
                  name="semesterId"
                  options={semesterOptions}
                  defaultValue={defaultSemId}
                  placeholder="Pilih"
                  required
                />
              </FormField>
            </div>

            <FormField label="Hari" required error={fieldErrors?.dayOfWeek?.[0]}>
              <Select
                name="dayOfWeek"
                options={DAY_OPTIONS}
                defaultValue={initialData?.dayOfWeek}
                placeholder="Pilih hari"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Jam Mulai" required error={fieldErrors?.startTime?.[0]}>
                <Input
                  name="startTime"
                  type="time"
                  defaultValue={initialData?.startTime}
                  placeholder="07:00"
                  required
                />
              </FormField>
              <FormField label="Jam Selesai" required error={fieldErrors?.endTime?.[0]}>
                <Input
                  name="endTime"
                  type="time"
                  defaultValue={initialData?.endTime}
                  placeholder="08:30"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kelas" required error={fieldErrors?.classId?.[0]}>
                <Select
                  name="classId"
                  options={classOptions}
                  defaultValue={initialData?.class?.id}
                  placeholder="Pilih kelas"
                  required
                />
              </FormField>
              <FormField label="Mata Pelajaran" required error={fieldErrors?.subjectId?.[0]}>
                <Select
                  name="subjectId"
                  options={subjectOptions}
                  defaultValue={initialData?.subject?.id}
                  placeholder="Pilih mapel"
                  required
                />
              </FormField>
            </div>

            <FormField label="Guru" required error={fieldErrors?.teacherId?.[0]}>
              <Select
                name="teacherId"
                options={teacherOptions}
                defaultValue={initialData?.teacher?.id}
                placeholder="Pilih guru"
                required
              />
            </FormField>

            {teachers.length === 0 && (
              <Alert variant="warning" title="Belum ada guru tersedia">
                Tambahkan data guru terlebih dahulu di menu Data Guru.
              </Alert>
            )}
            {classes.length === 0 && (
              <Alert variant="warning" title="Belum ada kelas tersedia">
                Tambahkan data kelas terlebih dahulu di menu Data Kelas.
              </Alert>
            )}
            {subjects.length === 0 && (
              <Alert variant="warning" title="Belum ada mata pelajaran">
                Tambahkan mata pelajaran di menu Mata Pelajaran.
              </Alert>
            )}
          </form>
        </FormModal>
      )}
    </>
  );
}