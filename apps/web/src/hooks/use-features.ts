"use client";

import { useState, useEffect, useCallback } from "react";
import type { Feature } from "@/lib/db";

interface UseFeaturesResult {
  features: Feature[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createFeature: (data: { title: string; description?: string; priority?: string }) => Promise<Feature | null>;
  updateFeature: (id: string, data: Partial<Feature>) => Promise<Feature | null>;
  deleteFeature: (id: string) => Promise<boolean>;
}

export function useFeatures(projectId: string | null): UseFeaturesResult {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = useCallback(async () => {
    if (!projectId) {
      setFeatures([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/projects/${projectId}/features`);
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      setFeatures(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch features");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const createFeature = async (data: { title: string; description?: string; priority?: string }) => {
    if (!projectId) return null;

    try {
      const res = await fetch(`/api/projects/${projectId}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      setFeatures((prev) => [...prev, json.data]);
      return json.data as Feature;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create feature");
      return null;
    }
  };

  const updateFeature = async (id: string, data: Partial<Feature>) => {
    try {
      const res = await fetch(`/api/features/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? json.data : f))
      );
      return json.data as Feature;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature");
      return null;
    }
  };

  const deleteFeature = async (id: string) => {
    try {
      const res = await fetch(`/api/features/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete feature");
      return false;
    }
  };

  return {
    features,
    loading,
    error,
    refresh: fetchFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
  };
}
