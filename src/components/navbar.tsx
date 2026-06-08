"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/auth";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h-1 animate-gradient bg-[linear-gradient(90deg,var(--brand),var(--brand-light),var(--brand))]" />
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/80 shadow-xs backdrop-blur-xl"
            : "border-b border-transparent bg-background/50 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light text-xs font-bold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-brand/30 active:scale-95">
              AF
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight">
                ArqFlow
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 sm:inline">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="mr-1 hidden items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors duration-200 hover:bg-muted/50 sm:flex">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand/20 to-brand/5 text-[11px] font-bold text-brand ring-1 ring-brand/10">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium leading-none">
                  {user.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
