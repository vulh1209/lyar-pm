"use client";

import { useState, useEffect } from "react";
import { ProjectList } from "@/components/projects";
import { OnboardingWizard } from "@/components/onboarding";
import { useProjects } from "@/hooks";
import type { Project } from "@/lib/db";

export default function Home() {
  const { projects, loading, createProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for first-time users
  useEffect(() => {
    if (!loading && projects.length === 0) {
      // Check if user has seen onboarding before
      const hasSeenOnboarding = localStorage.getItem("lyar_onboarding_complete");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [loading, projects.length]);

  const handleOnboardingComplete = async (data: {
    name: string;
    description: string;
    path: string;
  }) => {
    localStorage.setItem("lyar_onboarding_complete", "true");
    setShowOnboarding(false);

    // Create the project
    const project = await createProject({
      name: data.name,
      description: data.description,
      path: data.path,
    });

    if (project) {
      // Navigate to project
      window.location.href = `/projects/${project.id}`;
    }
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem("lyar_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  if (selectedProject) {
    window.location.href = `/projects/${selectedProject.id}`;
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      )}

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-lg">Lyar PM</span>
            </div>
            <nav className="flex items-center gap-4">
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowOnboarding(true)}
              >
                Help
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 py-8">
          <h1 className="text-4xl font-bold mb-4">
            Virtual Project Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build software from ideas without coding. Describe what you want,
            and Lyar PM will handle the rest.
          </p>
        </div>

        {/* Projects Section */}
        <ProjectList onSelectProject={setSelectedProject} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Lyar PM - Open Source Virtual Project Manager</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
