import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: "size-7 text-[11px] rounded-lg",
  md: "size-9 text-sm rounded-xl",
  lg: "size-12 text-base rounded-xl",
};

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: keyof typeof sizeStyles;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-brand/80",
    "bg-success/70",
    "bg-accent/70",
    "bg-[oklch(0.65_0.15_300)]",
    "bg-[oklch(0.55_0.15_10)]",
    "bg-[oklch(0.5_0.18_170)]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "flex shrink-0 items-center justify-center font-bold text-white",
        sizeStyles[size],
        getAvatarColor(name),
        className,
      )}
      title={name}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
