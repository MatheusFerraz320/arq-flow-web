import { type HTMLAttributes } from "react";
import { ClipboardList, PencilRuler, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-accent/15 text-accent",
  secondary: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/15 text-destructive",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  accent: "bg-accent/15 text-accent",
  outline: "border border-border bg-card text-foreground",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; variant: keyof typeof variantStyles; icon: typeof ClipboardList }> = {
  BRIEFING:  { label: "Briefing",  dot: "bg-warning", variant: "warning", icon: ClipboardList },
  PROJETO:   { label: "Projeto",   dot: "bg-accent", variant: "default", icon: PencilRuler },
  REVISAO:   { label: "Revisão",   dot: "bg-muted-foreground", variant: "secondary", icon: Search },
  CONCLUIDO: { label: "Concluído", dot: "bg-success", variant: "success", icon: CheckCircle2 },
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-1 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status];
  const label = config?.label ?? status;
  const dot = config?.dot ?? "bg-muted-foreground";
  const variant = config?.variant ?? "outline";
  const Icon = config?.icon;

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      {Icon && <Icon className="size-3.5" />}
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}

export { Badge, StatusBadge };
