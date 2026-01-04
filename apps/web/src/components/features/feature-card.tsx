"use client";

import { Badge } from "@/components/ui";
import type { Feature } from "@/lib/db";

interface FeatureCardProps {
  feature: Feature;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

const priorityColors = {
  low: "default",
  medium: "primary",
  high: "warning",
  critical: "destructive",
} as const;

export function FeatureCard({
  feature,
  onClick,
  onDragStart,
  draggable = false,
}: FeatureCardProps) {
  return (
    <div
      className={`bg-background border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm line-clamp-2">{feature.title}</h4>
        <Badge variant={priorityColors[feature.priority]} className="shrink-0">
          {feature.priority}
        </Badge>
      </div>
      {feature.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {feature.description}
        </p>
      )}
      {feature.branch_name && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="truncate">{feature.branch_name}</span>
        </div>
      )}
    </div>
  );
}
