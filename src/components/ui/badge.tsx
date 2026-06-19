import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive/10 text-destructive",
  outline: "border-border text-foreground",
  ghost: "hover:bg-muted hover:text-muted-foreground",
  link: "text-primary underline-offset-4 hover:underline",
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
