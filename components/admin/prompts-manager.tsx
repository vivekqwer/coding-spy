"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PromptRow = {
  id: string;
  category: string;
  title: string;
  promptText: string;
  previewHtml: string | null;
  order: number;
  isPublished: boolean;
};

export function PromptsManager({ initialPrompts }: { initialPrompts: PromptRow[] }) {
  const router = useRouter();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [newCategory, setNewCategory] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [adding, setAdding] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, PromptRow[]>();
    for (const p of prompts) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return Array.from(map.entries());
  }, [prompts]);

  function refresh() {
    router.refresh();
  }

  async function addPrompt() {
    if (!newCategory.trim() || !newTitle.trim() || !newPromptText.trim()) {
      toast.error("Category, title, and prompt text are required.");
      return;
    }
    setAdding(true);
    const res = await fetch("/api/admin/prompts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: newCategory, title: newTitle, promptText: newPromptText }),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) {
      toast.error(data.error ?? "Could not add prompt.");
      return;
    }
    setPrompts((p) => [...p, data]);
    setNewCategory("");
    setNewTitle("");
    setNewPromptText("");
    toast.success("Prompt added.");
    refresh();
  }

  async function patchPrompt(id: string, patch: Partial<PromptRow>) {
    setPrompts((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const res = await fetch(`/api/admin/prompts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) toast.error("Could not save changes.");
    else refresh();
  }

  async function deletePrompt(id: string) {
    if (!confirm("Delete this prompt?")) return;
    const res = await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete prompt.");
      return;
    }
    setPrompts((p) => p.filter((x) => x.id !== id));
    toast.success("Prompt deleted.");
    refresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div>
            <Label>Category</Label>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. 3D Scroll Animation"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Parallax Hero" />
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <Label>Prompt Text</Label>
            <Input
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder="Create a full-page 3D scrolling hero with parallax cards..."
            />
          </div>
          <div className="lg:col-span-4">
            <Button onClick={addPrompt} disabled={adding}>
              <Plus className="h-4 w-4" /> Add Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      {categories.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No intel yet, Agent.</div>
      )}

      {categories.map(([category, items]) => (
        <Card key={category}>
          <CardContent className="pt-5">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-spy-amber">
              {category} ({items.length})
            </p>
            <div className="space-y-2">
              {items.map((p) => (
                <div key={p.id} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))}
                    >
                      {expanded[p.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      {p.title}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => patchPrompt(p.id, { isPublished: !p.isPublished })}
                        title={p.isPublished ? "Published" : "Hidden"}
                      >
                        {p.isPublished ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deletePrompt(p.id)} aria-label="Delete prompt">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  {expanded[p.id] && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={p.title}
                            onChange={(e) => setPrompts((ps) => ps.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))}
                            onBlur={(e) => patchPrompt(p.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={p.category}
                            onChange={(e) => setPrompts((ps) => ps.map((x) => (x.id === p.id ? { ...x, category: e.target.value } : x)))}
                            onBlur={(e) => patchPrompt(p.id, { category: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Prompt Text</Label>
                        <textarea
                          value={p.promptText}
                          onChange={(e) => setPrompts((ps) => ps.map((x) => (x.id === p.id ? { ...x, promptText: e.target.value } : x)))}
                          onBlur={(e) => patchPrompt(p.id, { promptText: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
                        />
                      </div>
                      <div>
                        <Label>Preview HTML (optional — shown when "Animate" is clicked)</Label>
                        <textarea
                          value={p.previewHtml ?? ""}
                          onChange={(e) => setPrompts((ps) => ps.map((x) => (x.id === p.id ? { ...x, previewHtml: e.target.value } : x)))}
                          onBlur={(e) => patchPrompt(p.id, { previewHtml: e.target.value })}
                          rows={4}
                          placeholder="<style>...</style><div>...</div>"
                          className="w-full rounded-lg border border-border bg-background/60 p-2 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
