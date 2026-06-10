import { ImageIcon } from "lucide-react";

export function ProjectPhotos() {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight">Fotos</h2>
      <div className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10 transition-transform duration-200 group-hover:scale-110">
          <ImageIcon className="size-6" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Nenhuma foto adicionada
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          As fotos do projeto aparecerão aqui.
        </p>
      </div>
    </section>
  );
}
