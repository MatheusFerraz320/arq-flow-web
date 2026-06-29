import { type HTMLAttributes } from "react";
import { ClipboardList, PencilRuler, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/10 text-accent",
  outline: "border border-border text-foreground",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; variant: keyof typeof variantStyles; icon: typeof ClipboardList }> = {
  BRIEFING:  { label: "Briefing",  dot: "bg-warning", variant: "warning", icon: ClipboardList },
  PROJETO:   { label: "Projeto",   dot: "bg-primary", variant: "default", icon: PencilRuler },
  REVISAO:   { label: "Revisão",   dot: "bg-muted-foreground", variant: "outline", icon: Search },
  CONCLUIDO: { label: "Concluído", dot: "bg-success", variant: "success", icon: CheckCircle2 },
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
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
      {Icon && <Icon className="size-3" />}
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}

export { Badge, StatusBadge };
