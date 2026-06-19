import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/10 text-accent",
  outline: "border border-border text-foreground",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
