// ══════════════════════════════════════════════
// Guru Attendance Form (Server Component)
// Wraps GuruAbsensiForm client with server-fetched data
// ══════════════════════════════════════════════

import GuruAbsensiForm from "@/components/absensi/guru-absensi-form";

type Props = {
  students: Array<{ id: string; name: string; nis: string }>;
  existingAttendance: Array<{ studentId: string; status: string }>;
  classId: string;
  date: string;
  semesterId: string;
  activeAyName?: string;
};

export default function GuruAttendanceForm(props: Props) {
  return <GuruAbsensiForm {...props} />;
}
