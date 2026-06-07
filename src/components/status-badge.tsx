import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  BRIEFING: "Briefing",
  PROJETO: "Projeto",
  REVISAO: "Revisão",
  CONCLUIDO: "Concluído",
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
  const label = STATUS_LABELS[status] ?? status;
  const variant = STATUS_VARIANTS[status] ?? "outline";

  return <Badge variant={variant}>{label}</Badge>;
}
