import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

interface Project {
  id: string;
  title: string;
  status: string;
}

interface ClientCardProps {
  name: string;
  email: string;
  projects: Project[];
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
    "bg-[oklch(0.52_0.18_264)]",
    "bg-[oklch(0.6_0.18_150)]",
    "bg-[oklch(0.75_0.15_50)]",
    "bg-[oklch(0.65_0.15_300)]",
    "bg-[oklch(0.55_0.15_10)]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ClientCard({ name, email, projects }: ClientCardProps) {
  return (
    <Card className="animate-fade-in-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="space-y-4 pt-(--card-spacing)">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${getAvatarColor(name)}`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{name}</h3>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {projects.length > 0 && (
          <div className="space-y-1.5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="truncate text-sm font-medium">
                  {project.title}
                </span>
                <StatusBadge status={project.status} />
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Nenhum projeto ainda
          </p>
        )}
      </CardContent>
    </Card>
  );
}
