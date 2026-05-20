// ══════════════════════════════════════════════
// Server Pagination Component
// Sistem Informasi Akademik SMP
//
// Pagination yang kompatibel dengan Server Components.
// Menggunakan URL-based navigation via <a> links.
// Props:
//   - page: current page (1-based)
//   - totalPages: total number of pages
//   - baseUrl: base URL for pagination links
//   - params: existing search params to preserve
//   - totalItems: optional total count (for display)
//   - limit: optional page size (for display range)
// ══════════════════════════════════════════════

import Link from "next/link";

function getPageRange(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

type Props = {
  page: number;
  totalPages: number;
  baseUrl: string;
  params?: Record<string, string>;
  totalItems?: number;
  limit?: number;
};

export default function ServerPagination({
  page,
  totalPages,
  baseUrl,
  params = {},
  totalItems,
  limit = 10,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems ?? totalPages * limit);

  function makeHref(p: number) {
    const allParams = { ...params, page: String(p) };
    const query = new URLSearchParams(allParams).toString();
    return `${baseUrl}${query ? `?${query}` : ""}`;
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Info */}
      {totalItems !== undefined && (
        <span className="text-sm text-slate-500">
          Menampilkan {start}–{end} dari {totalItems} data
        </span>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        {page > 1 ? (
          <Link
            href={makeHref(page - 1)}
            className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-300 opacity-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        )}

        {/* Pages */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={makeHref(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                p === page
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link
            href={makeHref(page + 1)}
            className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-300 opacity-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}