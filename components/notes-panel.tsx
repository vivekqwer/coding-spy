"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StickyNote, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotesPanel({ lessonId, initialContent }: { lessonId: string; initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(initialContent.trim().length > 0);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/notes/${lessonId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Sign in to save notes.");
      return;
    }
    toast.success("Note saved to your dossier.");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-spy-cyan"
      >
        <StickyNote className="h-4 w-4" /> Add a personal note
      </button>
    );
  }

  return (
    <div className="glass mb-6 rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <StickyNote className="h-3.5 w-3.5" /> Your Notes
        </p>
        <Button size="sm" variant="secondary" onClick={save} disabled={saving}>
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Jot down anything you want to remember about this case file…"
        rows={4}
        className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spy-cyan"
      />
    </div>
  );
}
