"use client";

import { useState } from "react";
import { useFeatures } from "@/hooks";
import { Button, Modal, Input, Textarea } from "@/components/ui";
import { FeatureCard } from "./feature-card";
import type { Feature } from "@/lib/db";

interface KanbanBoardProps {
  projectId: string;
  onFeatureSelect: (feature: Feature) => void;
}

const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "bg-gray-500" },
  { id: "ready", label: "Ready", color: "bg-blue-500" },
  { id: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "review", label: "Review", color: "bg-purple-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

export function KanbanBoard({ projectId, onFeatureSelect }: KanbanBoardProps) {
  const { features, loading, createFeature, updateFeature } = useFeatures(projectId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<Feature["priority"]>("medium");
  const [draggedFeature, setDraggedFeature] = useState<Feature | null>(null);

  const handleDragStart = (feature: Feature) => {
    setDraggedFeature(feature);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: ColumnId) => {
    if (draggedFeature && draggedFeature.status !== status) {
      await updateFeature(draggedFeature.id, { status });
    }
    setDraggedFeature(null);
  };

  const handleCreateFeature = async () => {
    if (!newTitle.trim()) return;
    await createFeature({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      priority: newPriority,
    });
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setShowCreateModal(false);
  };

  const getColumnFeatures = (status: ColumnId) => {
    return features.filter((f) => f.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Features</h3>
        <Button size="sm" onClick={() => setShowCreateModal(true)}>
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Feature
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 bg-muted/50 rounded-lg"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center gap-2 p-3 border-b border-border">
              <div className={`w-2 h-2 rounded-full ${column.color}`} />
              <span className="font-medium text-sm">{column.label}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {getColumnFeatures(column.id).length}
              </span>
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              {getColumnFeatures(column.id).map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onClick={() => onFeatureSelect(feature)}
                  draggable
                  onDragStart={() => handleDragStart(feature)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Feature"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Feature Title"
            placeholder="Describe the feature..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Additional details..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Feature["priority"])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFeature} disabled={!newTitle.trim()}>
              Add Feature
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
