"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Search({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: SearchProps) {
  return (
    <div className={cn("group relative", className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full pl-10 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
      />
    </div>
  );
}
