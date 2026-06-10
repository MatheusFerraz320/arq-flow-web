export type ProjectStatus = "BRIEFING" | "PROJETO" | "REVISAO" | "CONCLUIDO";

export interface ProjectUpdate {
  id: string;
  message: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  client: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  updates: ProjectUpdate[];
}
