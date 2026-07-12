"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, DollarSign, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
];

export function Navbar({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border bg-card/80 shadow-sm backdrop-blur-lg">
      <div className="flex items-center gap-2 px-4">
        <button
          onClick={onToggleSidebar}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          {sidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
        </button>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand via-brand-light to-accent text-base font-bold text-white shadow-md shadow-brand/25">
          AF
        </div>
        <span className="text-lg font-extrabold tracking-tight text-card-foreground">
          ArchitectFlow
        </span>
      </div>

      <nav className="flex flex-1 items-center gap-1 px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
              {active && (
                <span className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
