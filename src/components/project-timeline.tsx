"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { ProjectUpdate } from "@/lib/types";

interface ProjectTimelineProps {
  projectId: string;
  updates: ProjectUpdate[];
}

export function ProjectTimeline({ projectId, updates }: ProjectTimelineProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const sorted = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!res.ok) throw new Error("Erro ao registrar atualização");
      setMessage("");
      toast.success("Atualização registrada");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao registrar atualização";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight">Atualizações</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 rounded-xl border bg-card p-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand/30"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex: Realizei o briefing com o cliente..."
          rows={2}
          className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-relaxed transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving || !message.trim()}
          className="flex shrink-0 items-center gap-1.5 self-end rounded-lg bg-gradient-to-br from-brand to-brand-light px-3 py-2 text-sm font-medium text-white shadow-md shadow-brand/20 transition-all duration-200 hover:shadow-lg hover:shadow-brand/30 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Adicionar
        </button>
      </form>

      {/* Timeline */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center transition-colors hover:border-muted-foreground/25">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
            <Clock className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma atualização registrada ainda.
          </p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="relative">
          {sorted.map((update, i) => (
            <div
              key={update.id}
              className="animate-fade-in-up relative flex gap-4 pb-8 last:pb-0"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Connector with gradient dot */}
              <div className="flex flex-col items-center">
                <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-white shadow-sm shadow-brand/20 ring-[2px] ring-background">
                  <MessageSquare className="size-3" />
                </div>
                {i < sorted.length - 1 && (
                  <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-brand/30 to-transparent" />
                )}
              </div>

              {/* Content Card */}
              <div className="min-w-0 flex-1 rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-brand/10">
                <p className="text-xs font-medium text-brand">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(update.createdAt))}
                </p>
                <p className="mt-1 text-sm text-card-foreground leading-relaxed">
                  {update.message}
                </p>
              </div>
            </div>
          ))}

          {/* End dot */}
          <div className="flex items-center gap-3">
            <div className="size-2.5 rounded-full border-2 border-brand/30 bg-background" />
            <span className="text-xs text-muted-foreground">
              {sorted.length} atualização{ sorted.length !== 1 ? "ões" : "" }
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
