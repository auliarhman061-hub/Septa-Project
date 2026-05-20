// ══════════════════════════════════════════════
// Card Component
// Sistem Informasi Akademik SMP
//
// Variants: default, bordered, elevated
// ══════════════════════════════════════════════

import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered" | "elevated";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        variant === "default" && "bg-white border border-slate-200",
        variant === "bordered" && "bg-white border-2 border-slate-200",
        variant === "elevated" && "bg-white shadow-md border border-slate-100",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      {children}
    </div>
  );
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
};

export function CardTitle({ as: Tag = "h3", className, children, ...props }: CardTitleProps) {
  return (
    <Tag className={cn("font-bold text-slate-800 text-lg", className)} {...props}>
      {children}
    </Tag>
  );
}

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-slate-500 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, children, ...props }: CardContentProps) {
  return <div className={cn("", className)} {...props}>{children}</div>;
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}