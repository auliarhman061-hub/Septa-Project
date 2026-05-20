// ══════════════════════════════════════════════
// Attendance Recap Table
// Read-only recap with summary
// ══════════════════════════════════════════════

import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";

const STATUS_LABEL: Record<string, string> = {
  HADIR: "Hadir",
  SAKIT: "Sakit",
  IZIN: "Izin",
  ALFA: "Alfa",
};

const STATUS_BADGE: Record<string, "success" | "warning" | "info" | "danger"> = {
  HADIR: "success",
  SAKIT: "warning",
  IZIN: "info",
  ALFA: "danger",
};

type Summary = {
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
  presentasi: number;
};

type Attendance = {
  id: string;
  date: Date;
  status: string;
  student: { id: string; name: string; nis: string };
  class?: { name: string };
};

type Props = {
  items: Attendance[];
  summary?: Summary;
  showStudent?: boolean;
  showClass?: boolean;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const STATUS_SUMMARY_MAP: Record<string, { cardClass: string; valueClass: string; labelClass: string }> = {
  hadir:     { cardClass: "bg-lime-50 border-lime-100",    valueClass: "text-lime-700",   labelClass: "text-lime-600"   },
  sakit:    { cardClass: "bg-orange-50 border-orange-100", valueClass: "text-orange-700",  labelClass: "text-orange-600" },
  izin:     { cardClass: "bg-amber-50 border-amber-100",  valueClass: "text-amber-700",  labelClass: "text-amber-600"  },
  alfa:     { cardClass: "bg-red-50 border-red-100",      valueClass: "text-red-700",     labelClass: "text-red-600"    },
  presentasi:{ cardClass: "bg-lime-50 border-lime-100",  valueClass: "text-lime-700",   labelClass: "text-lime-600"   },
};

function SummaryCards({ summary }: { summary?: Summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {[
        { label: "Hadir",     value: summary.hadir,       key: "hadir"     },
        { label: "Sakit",    value: summary.sakit,       key: "sakit"    },
        { label: "Izin",     value: summary.izin,       key: "izin"     },
        { label: "Alfa",     value: summary.alfa,        key: "alfa"     },
        { label: "Kehadiran",value: `${summary.presentasi}%`, key: "presentasi" },
      ].map((item) => {
        const m = STATUS_SUMMARY_MAP[item.key];
        return (
          <div key={item.key} className={`text-center p-3 rounded-lg border ${m.cardClass}`}>
            <p className={`text-2xl font-bold ${m.valueClass}`}>{item.value}</p>
            <p className={`text-xs ${m.labelClass} mt-1`}>{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function AbsensiRecapTable({
  items,
  summary,
  showStudent = true,
  showClass = false,
  title,
  emptyTitle = "Belum ada data absensi",
  emptyDescription = "Tidak ada data absensi untuk filter ini.",
}: Props) {
  if (items.length === 0) {
    return (
      <div>
        {title && <h2 className="font-bold text-slate-800 mb-4">{title}</h2>}
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="font-bold text-slate-800 mb-4">{title}</h2>}

      <SummaryCards summary={summary} />

      <div className="overflow-x-auto">
        <Table noPadding>
          <TableHead>
            <TableHeadCell>No</TableHeadCell>
            {showStudent && <TableHeadCell>Siswa</TableHeadCell>}
            {showClass && <TableHeadCell>Kelas</TableHeadCell>}
            <TableHeadCell>Tanggal</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell muted>{idx + 1}</TableCell>
                {showStudent && (
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.student.name}</p>
                      <p className="text-xs text-slate-400">NIS: {item.student.nis}</p>
                    </div>
                  </TableCell>
                )}
                {showClass && <TableCell muted>{item.class?.name ?? "—"}</TableCell>}
                <TableCell muted>
                  {item.date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[item.status] ?? "outline"}>
                    {STATUS_LABEL[item.status] ?? item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}