// ══════════════════════════════════════════════
// Table Component
// Sistem Informasi Akademik SMP
//
// Komponen:
// - Table (wrapper)
// - TableHeader
// - TableBody
// - TableRow
// - TableHead
// - TableCell
// - TableEmpty
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

// ─── Table Wrapper ────────────────────────────

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  noPadding?: boolean;
};

export function Table({ className, noPadding, ...props }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-slate-200", className)}>
      <table
        className={cn(
          "w-full text-sm text-left",
          noPadding ? "" : "[&_td]:px-4 [&_td]:py-3"
        )}
        {...props}
      />
    </div>
  );
}

// ─── Table Head ─────────────────────────────

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <thead className={cn("bg-slate-50 border-b border-slate-200", className)} {...props} />
  );
}

// ─── Table Body ─────────────────────────────

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn("divide-y divide-slate-100", className)} {...props} />;
}

// ─── Table Row ───────────────────────────────

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  hover?: boolean;
  onClick?: () => void;
};

export function TableRow({
  hover = true,
  onClick,
  className,
  ...props
}: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "bg-white transition-colors duration-150",
        hover && "hover:bg-amber-50/40 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

// ─── Table Cell (TH/TD) ────────────────────

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  as?: "th" | "td";
  bold?: boolean;
  muted?: boolean;
};

export function TableCell({
  as: Tag = "td",
  bold,
  muted,
  className,
  ...props
}: TableCellProps) {
  return (
    <Tag
      className={cn(
        "text-slate-700",
        Tag === "th" && "font-semibold text-slate-700",
        bold && "font-semibold text-slate-800",
        muted && "text-slate-400",
        className
      )}
      {...props}
    />
  );
}

// ─── Table Head Cell ─────────────────────────

type TableHeadCellProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export function TableHeadCell({ className, children, ...props }: TableHeadCellProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// ─── Table Empty ─────────────────────────────

type TableEmptyProps = {
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
};

export function TableEmpty({
  colSpan,
  message = "Tidak ada data yang ditemukan.",
  icon,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12 px-4">
        <div className="flex flex-col items-center gap-2">
          {icon && <div className="text-slate-300">{icon}</div>}
          <p className="text-slate-500 text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}