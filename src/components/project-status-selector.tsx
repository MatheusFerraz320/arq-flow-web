"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, PencilRuler, Search, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

const STATUS_ITEMS: { value: ProjectStatus; label: string; icon: typeof ClipboardList; color: string; bg: string; ring: string }[] = [
  { value: "BRIEFING", label: "Briefing", icon: ClipboardList, color: "text-warning", bg: "bg-warning/15", ring: "ring-warning/30" },
  { value: "PROJETO", label: "Em Projeto", icon: PencilRuler, color: "text-accent", bg: "bg-accent/15", ring: "ring-accent/30" },
  { value: "REVISAO", label: "Em Revisão", icon: Search, color: "text-muted-foreground", bg: "bg-muted", ring: "ring-border" },
  { value: "CONCLUIDO", label: "Concluído", icon: CheckCircle2, color: "text-success", bg: "bg-success/15", ring: "ring-success/30" },
];

interface ProjectStatusSelectorProps {
  projectId: string;
  currentStatus: ProjectStatus;
}

export function ProjectStatusSelector({
  projectId,
  currentStatus,
}: ProjectStatusSelectorProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: ProjectStatus) {
    if (newStatus === status || updating) return;
    const previous = status;
    setStatus(newStatus);
    setUpdating(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      toast.success("Status atualizado");
      router.refresh();
    } catch (err: unknown) {
      setStatus(previous);
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar status";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = status === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => handleChange(item.value)}
            disabled={updating}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              active
                ? `${item.bg} ${item.color} border-transparent ring-1 ${item.ring} shadow-sm`
                : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
              updating && "pointer-events-none opacity-60",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
