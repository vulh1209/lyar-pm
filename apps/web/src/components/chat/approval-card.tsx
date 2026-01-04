"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

interface ApprovalOption {
  id: string;
  label: string;
  action: "approve" | "modify" | "reject";
}

interface ApprovalCardProps {
  id: string;
  type: "prd" | "design" | "code" | "deploy";
  title: string;
  description: string;
  details: string;
  options: ApprovalOption[];
  onApprove: (id: string, action: string, feedback?: string) => void;
}

const typeIcons = {
  prd: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  design: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  deploy: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
};

const typeColors = {
  prd: "bg-blue-500/10 text-blue-500",
  design: "bg-purple-500/10 text-purple-500",
  code: "bg-green-500/10 text-green-500",
  deploy: "bg-orange-500/10 text-orange-500",
};

export function ApprovalCard({
  id,
  type,
  title,
  description,
  details,
  options,
  onApprove,
}: ApprovalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleAction = (option: ApprovalOption) => {
    if (option.action === "modify") {
      setShowFeedback(true);
      setSelectedAction(option.id);
    } else {
      onApprove(id, option.id);
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedAction) {
      onApprove(id, selectedAction, feedback);
      setShowFeedback(false);
      setFeedback("");
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${typeColors[type]}`}>
          {typeIcons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Approval Required
            </span>
          </div>
          <h4 className="font-medium mt-1">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          <button
            className="text-sm text-primary mt-2 hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : "Show details"}
          </button>

          {expanded && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                {details}
              </pre>
            </div>
          )}

          {showFeedback ? (
            <div className="mt-4 space-y-3">
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What changes would you like?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitFeedback}>
                  Submit Feedback
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              {options.map((option) => (
                <Button
                  key={option.id}
                  size="sm"
                  variant={
                    option.action === "approve"
                      ? "primary"
                      : option.action === "reject"
                        ? "destructive"
                        : "secondary"
                  }
                  onClick={() => handleAction(option)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
