"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarkComplete({ lessonId, initiallyCompleted }: { lessonId: string; initiallyCompleted: boolean }) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Sign in to track your clearance progress.");
      return;
    }
    setCompleted((c) => !c);
    toast.success(!completed ? "Case file marked complete." : "Marked incomplete.");
  }

  return (
    <Button variant={completed ? "secondary" : "primary"} size="sm" onClick={toggle} disabled={loading}>
      <CheckCircle2 className="h-4 w-4" /> {completed ? "Completed" : "Mark complete"}
    </Button>
  );
}
