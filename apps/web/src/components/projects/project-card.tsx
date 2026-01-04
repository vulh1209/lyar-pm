"use client";

import { Card, Badge } from "@/components/ui";
import type { Project } from "@/lib/db";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const statusColors = {
  active: "success",
  completed: "primary",
  archived: "default",
} as const;

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{project.name}</h3>
          {project.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <Badge variant={statusColors[project.status]}>{project.status}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          {project.path}
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </Card>
  );
}
