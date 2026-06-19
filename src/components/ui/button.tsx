import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 hover:shadow-md",
  outline:
    "border-border bg-background hover:bg-muted hover:text-foreground hover:shadow-xs",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-foreground",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/20",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeStyles = {
  default: "h-8 gap-1.5 px-2.5",
  xs: "h-6 gap-1 rounded-lg px-2 text-xs",
  sm: "h-7 gap-1 rounded-lg px-2.5 text-[0.8rem]",
  lg: "h-9 gap-1.5 px-2.5",
  icon: "size-8",
  "icon-xs": "size-6 rounded-lg",
  "icon-sm": "size-7 rounded-lg",
  "icon-lg": "size-9",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-200 select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
