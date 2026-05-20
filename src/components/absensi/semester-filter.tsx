// ══════════════════════════════════════════════
// Semester Filter Client Wrapper
// For use in Server Components
// ══════════════════════════════════════════════

"use client";

type Props = {
  semesters: Array<{ id: string; type: string }>;
  activeSemesterId?: string;
};

export default function SemesterFilter({ semesters, activeSemesterId }: Props) {
  return (
    <form method="get" className="flex items-center gap-3">
      <label className="text-sm text-slate-600">Semester:</label>
      <select
        name="semesterId"
        defaultValue={activeSemesterId || ""}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
      >
        <option value="">Semua Semester</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.type === "GANJIL" ? "Ganjil" : "Genap"}
          </option>
        ))}
      </select>
    </form>
  );
}