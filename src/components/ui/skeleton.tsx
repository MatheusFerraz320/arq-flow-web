import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle";
}

function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer rounded bg-gradient-to-r from-muted via-muted/70 to-muted",
        variant === "text" && "h-4 w-full rounded",
        variant === "card" && "h-32 w-full rounded-xl",
        variant === "circle" && "size-8 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
