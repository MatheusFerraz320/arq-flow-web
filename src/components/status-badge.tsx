import { Badge } from "@/components/ui/badge";

const STATUS: Record<string, { label: string; dot: string }> = {
  BRIEFING: { label: "Briefing", dot: "bg-[oklch(0.75_0.15_80)]" },
  PROJETO: { label: "Projeto", dot: "bg-[oklch(0.52_0.18_264)]" },
  REVISAO: { label: "Revisão", dot: "bg-[oklch(0.75_0.15_50)]" },
  CONCLUIDO: { label: "Concluído", dot: "bg-[oklch(0.6_0.18_150)]" },
};

const STATUS_VARIANTS: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
  BRIEFING: "secondary",
  PROJETO: "default",
  REVISAO: "outline",
  CONCLUIDO: "default",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS[status];
  const label = config?.label ?? status;
  const dot = config?.dot ?? "bg-muted-foreground";
  const variant = STATUS_VARIANTS[status] ?? "outline";

  return (
    <Badge variant={variant} className="gap-1.5">
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}
