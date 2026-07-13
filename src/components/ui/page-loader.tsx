import { Loader2 } from "lucide-react";

export function PageLoader({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light dark:from-slate-800 dark:to-slate-700 text-2xl font-bold text-white shadow-lg shadow-brand/25 dark:shadow-black/25">
            AF
          </div>
          <Loader2 className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-background p-1 text-muted-foreground animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
