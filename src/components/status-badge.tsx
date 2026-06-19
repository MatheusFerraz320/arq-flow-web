import { Badge } from "@/components/ui/badge";

const STATUS: Record<string, { label: string; dot: string; variant: "default" | "secondary" | "success" | "warning" | "outline" }> = {
  BRIEFING:  { label: "Briefing",  dot: "bg-warning", variant: "warning" },
  PROJETO:   { label: "Projeto",   dot: "bg-primary", variant: "default" },
  REVISAO:   { label: "Revisão",   dot: "bg-muted-foreground", variant: "outline" },
  CONCLUIDO: { label: "Concluído", dot: "bg-success", variant: "success" },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS[status];
  const label = config?.label ?? status;
  const dot = config?.dot ?? "bg-muted-foreground";
  const variant = config?.variant ?? "outline";

  return (
    <Badge variant={variant} className="gap-1.5">
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}
