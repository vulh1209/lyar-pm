export interface Project {
  id: string;
  name: string;
  description: string | null;
  path: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "active" | "archived" | "completed";

export interface CreateProjectInput {
  name: string;
  description?: string;
  path: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}
