// ══════════════════════════════════════════════
// Pagination Component
// Sistem Informasi Akademik SMP
//
// Simple pagination dengan:
// - Page numbers (dengan ellipsis)
// - Prev/Next buttons
// - Page size selector
// - Info "Menampilkan X-Y dari Z"
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className,
}: PaginationProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1 && !onPageSizeChange) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      {/* Info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          Menampilkan {start}–{end} dari {totalItems} data
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">per halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "p-2 rounded-lg border text-slate-600 transition-colors",
              "hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
                  page === currentPage
                    ? "bg-amber-500 text-white border-amber-500"
                    : "text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "p-2 rounded-lg border text-slate-600 transition-colors",
              "hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
