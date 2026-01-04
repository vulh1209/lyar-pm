"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { KanbanBoard } from "@/components/features";
import { ChatInterface } from "@/components/chat";
import type { Project, Feature } from "@/lib/db";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (json.data) {
          setProject(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!selectedFeature) {
      setMessages([]);
      setSessionId(null);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/features/${selectedFeature.id}/sessions`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const session = json.data[0];
          setSessionId(session.id);

          const msgRes = await fetch(`/api/sessions/${session.id}/messages`);
          const msgJson = await msgRes.json();
          if (msgJson.data) {
            setMessages(msgJson.data);
          }
        } else {
          const createRes = await fetch(
            `/api/features/${selectedFeature.id}/sessions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            }
          );
          const createJson = await createRes.json();
          if (createJson.data) {
            setSessionId(createJson.data.id);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };

    fetchSession();
  }, [selectedFeature]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content }),
      });

      // TODO: Call agent execution and get response
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        id: `temp-${Date.now() + 1}`,
        role: "assistant",
        content: `I understand you want to work on "${content}". Let me help you with that.\n\nI'm analyzing your request and will break it down into actionable tasks. This is a simulated response - the actual agent integration is coming next!`,
        timestamp: new Date().toISOString(),
      };

      await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "assistant",
          content: assistantMessage.content,
        }),
      });

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">L</span>
                </div>
                <span className="font-semibold text-lg">Lyar PM</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{project.name}</h1>
                <Badge variant="success">{project.status}</Badge>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Kanban */}
        <div className="flex-1 p-6 overflow-auto">
          <KanbanBoard
            projectId={id}
            onFeatureSelect={setSelectedFeature}
          />
        </div>

        {/* Right Panel - Chat */}
        <div className="w-[400px] border-l border-border flex flex-col">
          {selectedFeature ? (
            <>
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{selectedFeature.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedFeature.status.replace("_", " ")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFeature(null)}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <ChatInterface
                  sessionId={sessionId}
                  featureId={selectedFeature.id}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                  isLoading={chatLoading}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Select a Feature</h3>
              <p className="text-sm">
                Click on a feature card to start chatting with Lyar PM
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
