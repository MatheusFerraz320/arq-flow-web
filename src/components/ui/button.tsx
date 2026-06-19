import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-primary/90 hover:shadow-[0_2px_8px_rgba(22,101,52,0.15)]",
  accent:
    "bg-accent text-accent-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-accent/85 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
  outline:
    "border border-border bg-background hover:bg-muted hover:border-foreground/20",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  ghost: "hover:bg-muted hover:text-foreground",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/15",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeStyles = {
  default: "h-9 gap-1.5 px-3.5",
  xs: "h-7 gap-1 rounded-lg px-2.5 text-xs",
  sm: "h-8 gap-1 rounded-lg px-3 text-sm",
  lg: "h-10 gap-2 px-4 text-sm",
  icon: "size-9",
  "icon-xs": "size-7 rounded-lg",
  "icon-sm": "size-8 rounded-lg",
  "icon-lg": "size-10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-200 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
