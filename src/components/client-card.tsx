"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { fadeIn } from "@/lib/animations";

interface Project {
  id: string;
  title: string;
  status: string;
}

interface ClientCardProps {
  clientId: string;
  name: string;
  email: string;
  projects: Project[];
}

export function ClientCard({ clientId, name, email, projects }: ClientCardProps) {
  const router = useRouter();

  return (
    <motion.div variants={fadeIn}>
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-md"
        onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
      >
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar name={name} size="md" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{name}</h3>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            </div>
            <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40" />
          </div>

          {projects.length > 0 && (
            <div
              className="space-y-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projetos/${project.id}`}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 transition-all duration-200 hover:bg-muted hover:translate-x-0.5"
                >
                  <span className="truncate text-sm font-medium">
                    {project.title}
                  </span>
                  <StatusBadge status={project.status} />
                </Link>
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
    </motion.div>
  );
}
