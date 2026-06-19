import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

function MetricCard({ icon, value, label, className }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      data-slot="metric-card"
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand ring-1 ring-brand/10">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

export { MetricCard };
