"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, CalendarDays, Loader2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProjectEditableFieldsProps {
  projectId: string;
  budget: number | null;
  startDate: string | null;
  dueDate: string | null;
}

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

export function ProjectEditableFields({ projectId, budget, startDate, dueDate }: ProjectEditableFieldsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<"budget" | "deadline" | null>(null);
  const [saving, setSaving] = useState(false);

  const [editBudget, setEditBudget] = useState(budget?.toString() ?? "");
  const [editStartDate, setEditStartDate] = useState(startDate ?? "");
  const [editDueDate, setEditDueDate] = useState(dueDate ?? "");

  const budgetRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const dueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing === "budget") budgetRef.current?.focus();
    if (editing === "deadline") startRef.current?.focus();
  }, [editing]);

  function resetBudget() {
    setEditBudget(budget?.toString() ?? "");
    setEditing(null);
  }

  function resetDeadline() {
    setEditStartDate(startDate ?? "");
    setEditDueDate(dueDate ?? "");
    setEditing(null);
  }

  async function saveBudget() {
    const val = editBudget ? Number(editBudget) : undefined;
    if (val !== undefined && (isNaN(val) || val < 0)) return;
    if (val === budget) { resetBudget(); return; }

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
      setEditing(null);
      router.refresh();
    } catch {
      resetBudget();
      toast.error("Erro ao atualizar orçamento");
    } finally {
      setSaving(false);
    }
  }

  async function saveDeadline() {
    const s = editStartDate || undefined;
    const d = editDueDate || undefined;
    if (s === startDate && d === dueDate) { resetDeadline(); return; }

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
      setEditing(null);
      router.refresh();
    } catch {
      resetDeadline();
      toast.error("Erro ao atualizar prazo");
    } finally {
      setSaving(false);
    }
  }

  function handleBudgetKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") saveBudget();
    if (e.key === "Escape") resetBudget();
  }

  function handleDeadlineKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") resetDeadline();
  }

  const daysRemaining = dueDate ? calcDaysRemaining(dueDate) : null;

  return (
    <>
      {/* Budget Card */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-accent to-indigo-400" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/10">
              <DollarSign className="size-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Orçamento</span>
          </div>
          {editing !== "budget" && (
            <button
              onClick={() => { setEditBudget(budget?.toString() ?? ""); setEditing("budget"); }}
              className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
            >
              <Pencil className="size-4" />
            </button>
          )}
        </div>

        {editing === "budget" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted-foreground font-medium">R$</span>
              <Input
                ref={budgetRef}
                type="number"
                step="0.01"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                onKeyDown={handleBudgetKeyDown}
                onBlur={saveBudget}
                className="h-10 w-full max-w-xs text-lg"
                disabled={saving}
                autoFocus
              />
              {saving && <Loader2 className="size-5 animate-spin shrink-0 text-muted-foreground" />}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveBudget} disabled={saving}>
                Salvar
              </Button>
              <Button size="sm" variant="ghost" onClick={resetBudget} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {budget ? (
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(budget)}
              </p>
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setEditBudget(""); setEditing("budget"); }}
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-dashed border-border transition-colors group-hover:border-accent/50">
                  <Plus className="size-5" />
                </div>
                <span className="text-base font-medium">Definir orçamento</span>
              </div>
            )}
            {budget && (
              <p className="mt-1 text-sm text-muted-foreground">orçamento registrado</p>
            )}
          </div>
        )}
      </div>

      {/* Deadline Card */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-lg shadow-black/[0.04] transition-all duration-200 hover:shadow-xl hover:ring-1 hover:ring-success/20">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-success to-success/60" />
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-success/5 text-success ring-1 ring-success/10">
              <CalendarDays className="size-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Prazo</span>
          </div>
          {editing !== "deadline" && (
            <button
              onClick={() => { setEditStartDate(startDate ?? ""); setEditDueDate(dueDate ?? ""); setEditing("deadline"); }}
              className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
            >
              <Pencil className="size-4" />
            </button>
          )}
        </div>

        {editing === "deadline" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                ref={startRef}
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                onKeyDown={handleDeadlineKeyDown}
                className="h-10 w-40 text-base"
                disabled={saving}
              />
              <span className="text-base text-muted-foreground">→</span>
              <Input
                ref={dueRef}
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                onBlur={saveDeadline}
                onKeyDown={handleDeadlineKeyDown}
                className="h-10 w-40 text-base"
                disabled={saving}
              />
              {saving && <Loader2 className="size-5 animate-spin shrink-0 text-muted-foreground" />}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveDeadline} disabled={saving}>
                Salvar
              </Button>
              <Button size="sm" variant="ghost" onClick={resetDeadline} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {startDate && dueDate ? (
              <>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(startDate)}
                </p>
                <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="text-muted-foreground/50">→</span>
                  {formatDate(dueDate)}
                </p>
                {daysRemaining !== null && (
                  <p className={cn(
                    "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
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
                      ? `${daysRemaining} dias restantes`
                      : Math.abs(daysRemaining) === 0
                        ? "Vence hoje"
                        : `Vencido há ${Math.abs(daysRemaining)} dias`}
                  </p>
                )}
              </>
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setEditStartDate(""); setEditDueDate(""); setEditing("deadline"); }}
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-dashed border-border transition-colors group-hover:border-accent/50">
                  <Plus className="size-5" />
                </div>
                <span className="text-base font-medium">Definir prazo</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
