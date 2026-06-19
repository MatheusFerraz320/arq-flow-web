"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { User } from "@/lib/auth";

interface NavbarProps {
  user: User;
  onLogout: () => void;
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
      <div className="h-0.5 animate-gradient bg-[linear-gradient(90deg,var(--brand),var(--brand-light),var(--brand))]" />
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/80 shadow-xs backdrop-blur-xl"
            : "border-b border-transparent bg-background/50 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Avatar name="ArqFlow" size="sm" className="bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/25" />
            </motion.div>
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
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mr-1 hidden items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors duration-200 hover:bg-muted/80 sm:flex"
            >
              <Avatar name={user.name} size="sm" />
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium leading-none">
                  {user.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-success" />
                  Online
                </span>
              </div>
            </motion.div>
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
