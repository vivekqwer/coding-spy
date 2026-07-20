"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ImagePlus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Section = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isVisible: boolean;
};

export function HomepageSectionsManager({ initialSections }: { initialSections: Section[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  function refresh() {
    router.refresh();
  }

  async function addSection() {
    if (!newTitle.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/homepage-sections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setAdding(false);
    if (!res.ok) {
      toast.error("Could not add section.");
      return;
    }
    const section = await res.json();
    setSections((s) => [...s, section]);
    setNewTitle("");
    toast.success("Section added.");
    refresh();
  }

  async function patchSection(id: string, patch: Partial<Section>) {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)));
    const res = await fetch(`/api/admin/homepage-sections/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      toast.error("Could not save changes.");
      return;
    }
    refresh();
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this homepage section?")) return;
    const res = await fetch(`/api/admin/homepage-sections/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete section.");
      return;
    }
    setSections((s) => s.filter((sec) => sec.id !== id));
    toast.success("Section deleted.");
    refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSections(reordered);
    await Promise.all(
      reordered.map((sec, i) =>
        fetch(`/api/admin/homepage-sections/${sec.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
    refresh();
  }

  async function handleImageUpload(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingId(null);
    if (!res.ok) {
      toast.error(data.error ?? "Upload failed.");
      return;
    }
    await patchSection(id, { imageUrl: data.url });
    toast.success("Image uploaded.");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label>New Section Title</Label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Why Learn With Coding Spy"
            />
          </div>
          <Button onClick={addSection} disabled={adding}>
            <Plus className="h-4 w-4" /> Add Section
          </Button>
        </CardContent>
      </Card>

      {sections.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No intel yet, Agent.</div>
      )}

      {sections.map((section, index) => (
        <Card key={section.id}>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                  <ArrowUp className="h-4 w-4 disabled:opacity-30" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === sections.length - 1} aria-label="Move down">
                  <ArrowDown className="h-4 w-4 disabled:opacity-30" />
                </button>
                <span className="text-sm font-semibold">{section.title || "Untitled section"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => patchSection(section.id, { isVisible: !section.isVisible })}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  title={section.isVisible ? "Visible on homepage" : "Hidden from homepage"}
                >
                  {section.isVisible ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => deleteSection(section.id)} aria-label="Delete section">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => setSections((s) => s.map((sec) => (sec.id === section.id ? { ...sec, title: e.target.value } : sec)))}
                    onBlur={(e) => patchSection(section.id, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <textarea
                    value={section.subtitle ?? ""}
                    onChange={(e) => setSections((s) => s.map((sec) => (sec.id === section.id ? { ...sec, subtitle: e.target.value } : sec)))}
                    onBlur={(e) => patchSection(section.id, { subtitle: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label>Button Text</Label>
                    <Input
                      value={section.buttonText ?? ""}
                      onChange={(e) => setSections((s) => s.map((sec) => (sec.id === section.id ? { ...sec, buttonText: e.target.value } : sec)))}
                      onBlur={(e) => patchSection(section.id, { buttonText: e.target.value })}
                      placeholder="Learn More"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Button Link</Label>
                    <Input
                      value={section.buttonLink ?? ""}
                      onChange={(e) => setSections((s) => s.map((sec) => (sec.id === section.id ? { ...sec, buttonLink: e.target.value } : sec)))}
                      onBlur={(e) => patchSection(section.id, { buttonLink: e.target.value })}
                      placeholder="/signup"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Image</Label>
                <div className="flex items-center gap-3">
                  {section.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={section.imageUrl} alt="" className="h-20 w-32 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                  )}
                  <input
                    ref={(el) => {
                      fileInputs.current[section.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(section.id, file);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputs.current[section.id]?.click()}
                    disabled={uploadingId === section.id}
                  >
                    {uploadingId === section.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
