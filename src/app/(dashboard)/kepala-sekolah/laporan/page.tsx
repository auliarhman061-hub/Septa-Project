// Laporan Akademik — Placeholder
import PageHeader from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";

const ICON = (
  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export default function KepalaSekolahLaporanPage() {
  return (
    <div>
      <PageHeader title="Laporan Akademik" description="Lihat laporan akademik sekolah." />
      <Card className="p-6">
        <EmptyState icon={ICON} title="Modul ini akan tersedia pada Phase 9." description="Tim pengembangan sedang bekerja untuk menghadirkan fitur ini." />
      </Card>
    </div>
  );
}