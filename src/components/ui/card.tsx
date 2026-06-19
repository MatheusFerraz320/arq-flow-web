import { type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-5 text-sm text-card-foreground ring-1 ring-border",
        className,
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
    >
      {props.children}
    </motion.div>
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base leading-snug font-medium", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-2", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
