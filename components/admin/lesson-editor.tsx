"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { LessonMarkdown } from "@/components/lesson-markdown";
import type { AdminLesson } from "@/components/admin/types";

const LANGUAGES = ["html", "css", "javascript", "python", "sql", "java", "c", "cpp", "typescript", "bash", "json", "plaintext"];

export function LessonEditor({ lesson, onClose, onSaved }: { lesson: AdminLesson; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(lesson.title);
  const [language, setLanguage] = useState(lesson.language);
  const [starterCode, setStarterCode] = useState(lesson.starterCode);
  const [contentMarkdown, setContentMarkdown] = useState(lesson.contentMarkdown);
  const [runnable, setRunnable] = useState(lesson.runnable);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, language, starterCode, contentMarkdown, runnable }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not save lesson.");
      return;
    }
    toast.success("Lesson updated.");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background">
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <h2 className="text-lg font-semibold">Edit Lesson</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label>Playground Language</Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background/60 px-2 text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2 pb-2">
                <input
                  id="runnable"
                  type="checkbox"
                  checked={runnable}
                  onChange={(e) => setRunnable(e.target.checked)}
                />
                <Label htmlFor="runnable" className="mb-0">
                  Runnable
                </Label>
              </div>
            </div>
            <div>
              <Label>Starter Code</Label>
              <textarea
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-border bg-background/60 p-3 font-mono text-xs"
              />
            </div>
            <div>
              <Label>Content (Markdown)</Label>
              <textarea
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                rows={14}
                className="w-full rounded-lg border border-border bg-background/60 p-3 font-mono text-xs"
              />
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Live Preview</p>
            <LessonMarkdown content={contentMarkdown} />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border/60 p-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
}
