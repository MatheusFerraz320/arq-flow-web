import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

interface Project {
  id: string;
  title: string;
  status: string;
  description?: string | null;
}

interface ClientCardProps {
  name: string;
  email: string;
  projects: Project[];
}

export function ClientCard({ name, email, projects }: ClientCardProps) {
  return (
    <Card className="animate-fade-in-up transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
          </span>
        </div>
      </CardHeader>
      {projects.length > 0 && (
        <CardContent className="space-y-2 pt-0">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <span className="text-sm font-medium">{project.title}</span>
              <StatusBadge status={project.status} />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
