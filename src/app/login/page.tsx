"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left Panel — Branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden lg:flex ">
        {/* Gradient layer animado via transform (GPU, sem tremor) */}
        <div className="animate-gradient absolute inset-y-0 left-0 w-[200%] bg-gradient-to-r from-brand to-brand-light" />

        {/* Decorative geometric elements */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute right-1/3 top-1/4 size-48 rounded-full border border-white/[0.04]" />

        <div
          className="animate-float pointer-events-none absolute right-[15%] top-1/3 size-4 rounded-full bg-white/20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="animate-float pointer-events-none absolute bottom-1/3 left-[20%] size-3 rounded-full bg-white/15"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-float pointer-events-none absolute right-1/4 top-[15%] size-2 rounded-full bg-white/10"
          style={{ animationDelay: "4s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-8 py-8 xl:px-12 xl:py-12">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
              AF
            </div>
            <span className="text-lg font-medium tracking-tight text-white/90">
              ArchitectFlow
            </span>
          </div>

          <div className="space-y-6">
            <blockquote className="space-y-3">
              <p className="text-balance text-xl leading-relaxed text-white/90 xl:text-2xl xl:leading-relaxed">
                &ldquo;Fluxo de trabalho inteligente para arquitetos que
                transformam ideias em projetos reais.&rdquo;
              </p>
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
                AF
              </div>
              <div>
                <p className="text-sm font-medium text-white">Equipe ArchitectFlow</p>
                <p className="text-xs text-white/50">
                  Plataforma de aprovação de projetos
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30">
            &copy; 2026 ArchitectFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
