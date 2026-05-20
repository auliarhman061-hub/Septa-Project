// ══════════════════════════════════════════════
// Read-only Jadwal Table
// Untuk guru, siswa, kepala sekolah
// ══════════════════════════════════════════════

import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { DAY_LABELS } from "@/lib/constants";

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

type Schedule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  class?: { id: string; name: string; gradeLevel: number };
  subject: { id: string; name: string; code: string };
  teacher?: { id: string; name: string };
  semester?: { type: string };
};

type Props = {
  items: Schedule[];
  showClass?: boolean;
  showTeacher?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function ReadOnlyJadwalTable({
  items,
  showClass = false,
  showTeacher = false,
  emptyTitle = "Belum ada jadwal",
  emptyDescription = "Tidak ada jadwal pada semester aktif.",
}: Props) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={
            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>
    );
  }

  // Group by day
  const grouped: Record<string, Schedule[]> = {};
  for (const item of items) {
    if (!grouped[item.dayOfWeek]) grouped[item.dayOfWeek] = [];
    grouped[item.dayOfWeek].push(item);
  }

  // Sort by time within each day
  for (const day of Object.keys(grouped)) {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  // Sort days
  const sortedDays = Object.keys(grouped).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => (
        <div key={day}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">{DAY_LABELS[day] ?? day}</Badge>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-2">
            {grouped[day].map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="shrink-0 w-20">
                  <span className="font-mono text-sm font-semibold text-slate-700">
                    {item.startTime}–{item.endTime}
                  </span>
                </div>
                {showClass && (
                  <div className="shrink-0 w-20">
                    <span className="text-sm font-medium text-slate-600">
                      {item.class?.name}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {item.subject.name}
                  </p>
                  {showTeacher && item.teacher && (
                    <p className="text-xs text-slate-500 truncate">
                      {item.teacher.name}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-slate-400 font-mono">
                  {item.subject.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}