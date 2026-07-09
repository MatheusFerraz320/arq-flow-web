"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban } from "lucide-react";
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
  const { user } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border bg-card/80 shadow-sm backdrop-blur-lg">
      <div className="flex w-64 items-center gap-3 px-6">
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

      <div className="flex items-center gap-3 px-6">
        <div className="flex items-center gap-3 rounded-lg px-3 py-1.5">
          <div className={cn("flex size-8 items-center justify-center rounded-full text-xs font-semibold", AVATAR_BG[bgForName(user.name)])}>
            {getInitials(user.name)}
          </div>
          <span className="hidden text-sm font-medium text-card-foreground sm:block">
            {user.name.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
