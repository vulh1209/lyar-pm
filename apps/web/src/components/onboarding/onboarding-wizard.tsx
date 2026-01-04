"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card } from "@/components/ui";

interface OnboardingWizardProps {
  onComplete: (data: {
    name: string;
    description: string;
    path: string;
  }) => void;
  onSkip?: () => void;
}

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "idea", title: "Your Idea" },
  { id: "setup", title: "Setup" },
  { id: "ready", title: "Ready!" },
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectPath, setProjectPath] = useState("");

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      name: projectName,
      description: idea,
      path: projectPath || `./${projectName.toLowerCase().replace(/\s+/g, "-")}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {step === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-3xl">L</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome to Lyar PM!</h1>
              <p className="text-lg text-muted-foreground mb-2">
                Your Virtual Project Manager
              </p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Build software from ideas without coding. Describe what you want,
                and Lyar PM will handle the rest.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="font-medium mb-1">What Lyar Can Do</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Full-stack web apps</li>
                    <li>Landing pages</li>
                    <li>Admin dashboards</li>
                    <li>CRUD applications</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="font-medium mb-1">Coming Soon</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Mobile apps</li>
                    <li>AI/ML features</li>
                    <li>Blockchain/Web3</li>
                    <li>Complex systems</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What do you want to build?</h2>
              <p className="text-muted-foreground mb-6">
                Describe your idea in a few sentences. Don't worry about technical
                details - just explain what you want the app to do.
              </p>
              <Textarea
                placeholder="Example: I want to build a booking app for my nail salon. Customers should be able to see available services, choose a technician, and book an appointment online..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={6}
                className="text-lg"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Tip: The more details you provide, the better I can understand your needs.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Setup</h2>
              <p className="text-muted-foreground mb-6">
                Let's give your project a name and location.
              </p>
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="My Awesome App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  label="Project Path (optional)"
                  placeholder={
                    projectName
                      ? `./${projectName.toLowerCase().replace(/\s+/g, "-")}`
                      : "./my-app"
                  }
                  value={projectPath}
                  onChange={(e) => setProjectPath(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
              <p className="text-muted-foreground mb-6">
                Your project <strong>{projectName}</strong> is ready to go.
              </p>
              <div className="bg-muted rounded-lg p-4 text-left max-w-md mx-auto">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>1. I'll ask clarifying questions to understand your needs</li>
                  <li>2. We'll create a PRD together</li>
                  <li>3. I'll coordinate the development team</li>
                  <li>4. You'll review and approve each step</li>
                  <li>5. Your app gets deployed!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div>
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onSkip && step === 0 && (
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !idea.trim()}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!projectName.trim()}
              >
                Create Project
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
