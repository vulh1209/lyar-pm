export interface Feature {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: FeatureStatus;
  priority: FeaturePriority;
  worktreePath: string | null;
  branchName: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type FeatureStatus =
  | "backlog"
  | "ready"
  | "in_progress"
  | "review"
  | "done"
  | "archived";

export type FeaturePriority = "low" | "medium" | "high" | "critical";

export interface CreateFeatureInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: FeaturePriority;
}

export interface UpdateFeatureInput {
  title?: string;
  description?: string;
  status?: FeatureStatus;
  priority?: FeaturePriority;
  order?: number;
}
