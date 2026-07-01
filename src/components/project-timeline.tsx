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
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <MessageSquare className="size-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Atualizações</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 rounded-xl border bg-card p-4 shadow-lg shadow-black/[0.04] transition-all duration-200 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent/30"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ex: Realizei o briefing com o cliente..."
          rows={2}
          className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-base leading-relaxed transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving || !message.trim()}
          className="flex shrink-0 items-center gap-2 self-end rounded-lg bg-gradient-to-br from-accent to-indigo-500 px-4 py-2.5 text-base font-medium text-white shadow-md shadow-accent/20 transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className="size-5" />
          )}
          Adicionar
        </button>
      </form>

      {/* Timeline */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition-colors hover:border-accent/30">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50">
            <Clock className="size-6 text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-muted-foreground">
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
                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-indigo-500 text-white shadow-sm shadow-accent/20 ring-[3px] ring-background">
                  <MessageSquare className="size-4" />
                </div>
                {i < sorted.length - 1 && (
                  <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-accent/30 to-transparent" />
                )}
              </div>

              {/* Content Card */}
              <div className="min-w-0 flex-1 rounded-lg border bg-card p-5 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:bg-glass hover:backdrop-blur-xs hover:ring-1 hover:ring-accent/20">
                <p className="text-sm font-medium text-accent">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(update.createdAt))}
                </p>
                <p className="mt-1.5 text-xl text-card-foreground leading-relaxed">
                  {update.message}
                </p>
              </div>
            </div>
          ))}

          {/* End dot */}
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full border-2 border-accent/30 bg-background" />
            <span className="text-sm text-muted-foreground">
              {sorted.length} atualização{ sorted.length !== 1 ? "ões" : "" }
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
