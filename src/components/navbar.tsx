"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { getInitials, bgForName } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/projetos", label: "Projetos", icon: FolderKanban },
];

const AVATAR_BG = ["bg-brand/10 text-brand", "bg-accent/10 text-accent", "bg-muted text-muted-foreground"];

export function Navbar() {
  const pathname = usePathname();
  const { user, onLogout } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand via-brand-light to-accent text-xl font-bold text-white shadow-lg shadow-brand/25">
          AF
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold tracking-tight text-card-foreground">
            ArchitectFlow
          </h1>
          <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground/60 uppercase">
            Dashboard
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                active
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground hover:translate-x-0.5",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-accent to-accent/60" />
              )}
              <Icon className={cn("size-5 shrink-0 transition-all duration-200", active && "drop-shadow-sm")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-5">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className={cn("flex size-9 items-center justify-center rounded-full text-sm font-semibold", AVATAR_BG[bgForName(user.name)])}>
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-card-foreground">
              {user.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Online
            </p>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
