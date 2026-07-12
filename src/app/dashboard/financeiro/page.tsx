"use client";

import { DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MOCK_RECEITAS = [
  { projeto: "Residencial Carvalho", cliente: "Ana Silva", valor: 28500, data: "10/07/2026", status: "Pago" as const },
  { projeto: "Comercial Centro", cliente: "Carlos Mendes", valor: 42000, data: "05/07/2026", status: "Pago" as const },
  { projeto: "Apto 101", cliente: "Juliana Costa", valor: 15800, data: "01/07/2026", status: "Pendente" as const },
  { projeto: "Edifício Aurora", cliente: "Ricardo Pires", valor: 41150, data: "28/06/2026", status: "Pago" as const },
];

const MOCK_CONTAS = [
  { projeto: "Apto 101", cliente: "Juliana Costa", valor: 15800, vencimento: "15/07/2026", diasRestantes: 3, status: "Urgente" as const },
  { projeto: "Residencial Lapida", cliente: "Fernanda Torres", valor: 8400, vencimento: "20/07/2026", diasRestantes: 8, status: "Proximo" as const },
  { projeto: "Studio Marceneiro", cliente: "Paulo Shopf", valor: 10000, vencimento: "01/08/2026", diasRestantes: 20, status: "Em dia" as const },
];

const MOCK_DESPESAS = [
  { descricao: "Aluguel escritório", categoria: "Fixa", valor: 4200, data: "05/07/2026", icon: Wallet },
  { descricao: "Software Revit + AutoCAD", categoria: "Fixa", valor: 1850, data: "10/07/2026", icon: CreditCard },
  { descricao: "Impressões projeto_executivo", categoria: "Variável", valor: 380, data: "08/07/2026", icon: Receipt },
  { descricao: "Material de escritório", categoria: "Variável", valor: 270, data: "03/07/2026", icon: Receipt },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FinanceiroPage() {
  const totalReceitas = MOCK_RECEITAS.reduce((s, r) => s + r.valor, 0);
  const receitasPagas = MOCK_RECEITAS.filter((r) => r.status === "Pago").reduce((s, r) => s + r.valor, 0);
  const totalPendente = MOCK_CONTAS.reduce((s, c) => s + c.valor, 0);
  const totalDespesas = MOCK_DESPESAS.reduce((s, d) => s + d.valor, 0);
  const lucro = receitasPagas - totalDespesas;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-success via-success/90 to-emerald-700 p-8 ring-1 ring-white/10 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.1),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm animate-fade-in-up mb-4" style={{ animationDelay: "100ms" }}>
            <DollarSign className="size-4" />
            FINANCEIRO
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Financeiro</h1>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <DollarSign className="size-7" />
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-white/70 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            Acompanhe receitas, pagamentos pendentes e despesas do escritório.
          </p>
        </div>
      </div>

      {/* Resumo cards */}
      <div className="animate-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-success/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-success/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-success to-emerald-400" />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success ring-1 ring-success/10">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Receita total</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-success">{formatCurrency(totalReceitas)}</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-success/80">
            <ArrowUpRight className="size-4" />
            <span>+12% este mês</span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-warning/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-warning/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-warning to-amber-400" />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-warning/10 text-warning ring-1 ring-warning/10">
              <Clock className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">A receber</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-warning">{formatCurrency(totalPendente)}</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-warning/80">
            <AlertTriangle className="size-4" />
            <span>{MOCK_CONTAS.length} pendentes</span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-destructive/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-destructive/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-destructive to-red-400" />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/10">
              <ArrowDownRight className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Despesas</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-destructive">{formatCurrency(totalDespesas)}</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-destructive/80">
            <ArrowDownRight className="size-4" />
            <span>{MOCK_DESPESAS.length} registradas</span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-accent/5 to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-accent/20">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent to-indigo-400" />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/10">
              <Wallet className="size-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Lucro líquido</span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-accent">{formatCurrency(lucro)}</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-success">
            <ArrowUpRight className="size-4" />
            <span>Margem {Math.round((lucro / receitasPagas) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* 3 colunas */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Receitas */}
        <div className="animate-fade-in-up rounded-xl border bg-gradient-to-br from-success/[0.03] to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-success/10" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
                <TrendingUp className="size-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Receitas</h3>
            </div>
            <Badge variant="success" className="text-[10px]">Em breve</Badge>
          </div>
          <div className="space-y-3">
            {MOCK_RECEITAS.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-success/10 bg-background/50 p-3 transition-all duration-200 hover:bg-success/5 hover:border-success/20">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.projeto}</p>
                  <p className="text-xs text-muted-foreground">{item.cliente} · {item.data}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-success">{formatCurrency(item.valor)}</span>
                  <Badge variant={item.status === "Pago" ? "success" : "warning"} className="text-[10px]">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contas a receber */}
        <div className="animate-fade-in-up rounded-xl border bg-gradient-to-br from-warning/[0.03] to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-warning/10" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Clock className="size-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">A receber</h3>
            </div>
            <Badge variant="warning" className="text-[10px]">Em breve</Badge>
          </div>
          <div className="space-y-3">
            {MOCK_CONTAS.map((item, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-all duration-200",
                item.status === "Urgente"
                  ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/30"
                  : item.status === "Proximo"
                    ? "border-warning/20 bg-warning/5 hover:bg-warning/10 hover:border-warning/30"
                    : "border-border bg-background/50 hover:bg-muted/50 hover:border-border",
              )}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.projeto}</p>
                  <p className="text-xs text-muted-foreground">{item.cliente}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vence {item.vencimento}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={cn(
                    "text-sm font-semibold",
                    item.status === "Urgente" ? "text-destructive" : item.status === "Proximo" ? "text-warning" : "text-foreground",
                  )}>
                    {formatCurrency(item.valor)}
                  </span>
                  <Badge variant={item.status === "Urgente" ? "destructive" : item.status === "Proximo" ? "warning" : "secondary"} className="text-[10px]">
                    {item.diasRestantes}d restantes
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Despesas */}
        <div className="animate-fade-in-up rounded-xl border bg-gradient-to-br from-destructive/[0.03] to-card p-6 shadow-lg shadow-foreground/[0.04] transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-destructive/10" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <ArrowDownRight className="size-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Despesas</h3>
            </div>
            <Badge variant="destructive" className="text-[10px]">Em breve</Badge>
          </div>
          <div className="space-y-3">
            {MOCK_DESPESAS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between rounded-lg border border-destructive/10 bg-background/50 p-3 transition-all duration-200 hover:bg-destructive/5 hover:border-destructive/20">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.descricao}</p>
                      <p className="text-xs text-muted-foreground">{item.categoria} · {item.data}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-destructive shrink-0">-{formatCurrency(item.valor)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
