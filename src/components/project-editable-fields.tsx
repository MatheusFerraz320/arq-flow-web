"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, CalendarDays, Loader2, Pencil, Plus, Building2, Home, Layout, Wrench, Map, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function calcDaysRemaining(dueDate: string): number | null {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function BudgetCard({
  projectId,
  budget,
}: {
  projectId: string;
  budget: number | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editBudget, setEditBudget] = useState(budget?.toString() ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function reset() {
    setEditBudget(budget?.toString() ?? "");
    setEditing(false);
  }

  async function save() {
    const val = editBudget ? Number(editBudget) : undefined;
    if (val !== undefined && (isNaN(val) || val < 0)) return;
    if (val === budget) { reset(); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget: val }),
      });
      if (!res.ok) throw new Error();
      toast.success("Orçamento atualizado");
      setEditing(false);
      router.refresh();
    } catch {
      reset();
      toast.error("Erro ao atualizar orçamento");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") save();
    if (e.key === "Escape") reset();
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-muted/20 p-6 shadow-lg shadow-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent to-indigo-400 rounded-r-sm" />
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
            <DollarSign className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Orçamento</span>
        </div>
        {!editing && budget && (
          <button
            onClick={() => { setEditBudget(budget?.toString() ?? ""); setEditing(true); }}
            className="rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        {editing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">R$</span>
              <Input
                ref={inputRef}
                type="number"
                step="0.01"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={save}
                className="h-9 w-full max-w-[180px] text-base"
                disabled={saving}
              />
              {saving && <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />}
            </div>
            <div className="flex gap-1.5">
              <Button size="xs" onClick={save} disabled={saving}>Salvar</Button>
              <Button size="xs" variant="ghost" onClick={reset} disabled={saving}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <>
            {budget ? (
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(budget)}
              </p>
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setEditBudget(""); setEditing(true); }}
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-border group-hover:border-accent/50">
                  <Plus className="size-4" />
                </div>
                <span className="text-sm font-medium">Definir</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function DeadlineCard({
  projectId,
  startDate,
  dueDate,
}: {
  projectId: string;
  startDate: string | null;
  dueDate: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editStartDate, setEditStartDate] = useState(startDate ?? "");
  const [editDueDate, setEditDueDate] = useState(dueDate ?? "");
  const startRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) startRef.current?.focus();
  }, [editing]);

  function reset() {
    setEditStartDate(startDate ?? "");
    setEditDueDate(dueDate ?? "");
    setEditing(false);
  }

  async function save() {
    const s = editStartDate || undefined;
    const d = editDueDate || undefined;
    if (s === startDate && d === dueDate) { reset(); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: s, dueDate: d }),
      });
      if (!res.ok) throw new Error();
      toast.success("Prazo atualizado");
      setEditing(false);
      router.refresh();
    } catch {
      reset();
      toast.error("Erro ao atualizar prazo");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") reset();
  }

  const daysRemaining = dueDate ? calcDaysRemaining(dueDate) : null;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-muted/20 p-6 shadow-lg shadow-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-success/20">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-success to-success/60 rounded-r-sm" />
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-success/5 text-success ring-1 ring-success/10">
            <CalendarDays className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Prazo</span>
        </div>
        {!editing && startDate && dueDate && (
          <button
            onClick={() => { setEditStartDate(startDate ?? ""); setEditDueDate(dueDate ?? ""); setEditing(true); }}
            className="rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        {editing ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Input
                ref={startRef}
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-9 w-[150px] text-sm"
                disabled={saving}
              />
              <span className="text-sm text-muted-foreground">→</span>
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                onBlur={save}
                onKeyDown={handleKeyDown}
                className="h-9 w-[150px] text-sm"
                disabled={saving}
              />
              {saving && <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />}
            </div>
            <div className="flex gap-1.5">
              <Button size="xs" onClick={save} disabled={saving}>Salvar</Button>
              <Button size="xs" variant="ghost" onClick={reset} disabled={saving}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <>
            {startDate && dueDate ? (
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(startDate)} <span className="text-muted-foreground/40">→</span> {formatDate(dueDate)}
                </p>
                {daysRemaining !== null && (
                  <span className={cn(
                    "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                    daysRemaining > 30 ? "bg-success/10 text-success" :
                    daysRemaining > 7 ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  )}>
                    <span className={cn(
                      "size-1.5 rounded-full",
                      daysRemaining > 30 ? "bg-success" :
                      daysRemaining > 7 ? "bg-warning" :
                      "bg-destructive"
                    )} />
                    {daysRemaining > 0
                      ? `${daysRemaining} dias`
                      : Math.abs(daysRemaining) === 0
                        ? "Vence hoje"
                        : `Vencido há ${Math.abs(daysRemaining)} dias`}
                  </span>
                )}
              </div>
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setEditStartDate(""); setEditDueDate(""); setEditing(true); }}
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-border group-hover:border-accent/50">
                  <Plus className="size-4" />
                </div>
                <span className="text-sm font-medium">Definir</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Building2 }> = {
  RESIDENCIAL: { label: "Residencial", icon: Home },
  COMERCIAL: { label: "Comercial", icon: Building2 },
  INTERIORES: { label: "Interiores", icon: Layout },
  REFORMA: { label: "Reforma", icon: Wrench },
  URBANISMO: { label: "Urbanismo", icon: Map },
  OUTRO: { label: "Outro", icon: FolderKanban },
};

export function TypeCard({
  projectId,
  type,
}: {
  projectId: string;
  type: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editType, setEditType] = useState(type ?? "");
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  function reset() {
    setEditType(type ?? "");
    setEditing(false);
  }

  async function save() {
    const val = editType || undefined;
    if (val === type) { reset(); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: val }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tipo atualizado");
      setEditing(false);
      router.refresh();
    } catch {
      reset();
      toast.error("Erro ao atualizar tipo");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") reset();
  }

  const config = type ? TYPE_CONFIG[type] : null;
  const TypeIcon = config?.icon ?? Building2;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-muted/20 p-6 shadow-lg shadow-black/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent to-indigo-400 rounded-r-sm" />
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
            <Building2 className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tipo</span>
        </div>
        {!editing && type && (
          <button
            onClick={() => { setEditType(type); setEditing(true); }}
            className="rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        {editing ? (
          <div className="space-y-2">
            <select
              ref={selectRef}
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              onBlur={save}
              onKeyDown={handleKeyDown}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving}
            >
              <option value="">Não definido</option>
              {Object.entries(TYPE_CONFIG).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="flex gap-1.5">
              <Button size="xs" onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Salvando
                  </>
                ) : "Salvar"}
              </Button>
              <Button size="xs" variant="ghost" onClick={reset} disabled={saving}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <>
            {type && config ? (
              <div className="flex items-center gap-2">
                <TypeIcon className="size-6 text-accent" />
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {config.label}
                </span>
              </div>
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setEditType(""); setEditing(true); }}
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-border group-hover:border-accent/50">
                  <Plus className="size-4" />
                </div>
                <span className="text-sm font-medium">Definir</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
