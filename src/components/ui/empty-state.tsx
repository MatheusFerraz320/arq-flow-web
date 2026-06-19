import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center transition-colors duration-200 hover:border-primary/30",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/25">
          {icon}
        </div>
      )}
      <h3 className="mb-1 font-semibold">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}

export { EmptyState };
