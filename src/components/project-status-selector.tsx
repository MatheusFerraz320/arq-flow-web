"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "BRIEFING", label: "Briefing" },
  { value: "PROJETO", label: "Em Projeto" },
  { value: "REVISAO", label: "Em Revisão" },
  { value: "CONCLUIDO", label: "Concluído" },
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
    if (newStatus === status) return;
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
    <div className="relative">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as ProjectStatus)}
        disabled={updating}
        className={cn(
          "w-full appearance-none rounded-lg border bg-transparent py-2 pl-3 pr-9 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30",
          status === "BRIEFING" && "border-warning/30 text-warning",
          status === "PROJETO" && "border-primary/30 text-primary",
          status === "REVISAO" && "border-muted-foreground/30 text-muted-foreground",
          status === "CONCLUIDO" && "border-success/30 text-success",
          updating && "cursor-not-allowed opacity-60",
        )}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
        {updating ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
