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

export interface ProjectPhoto {
  id: string;
  projectId: string;
  url: string;
  caption: string | null;
  order: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  projects: {
    id: string;
    title: string;
    status: string;
  }[];
}
