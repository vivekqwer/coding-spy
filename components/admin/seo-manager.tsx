"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, ChevronDown, ChevronRight, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FaqItem = { question: string; answer: string };

type SeoTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImage: string | null;
  faqItems: FaqItem[] | null;
};

export function SeoManager({ initialTopics }: { initialTopics: SeoTopic[] }) {
  const [topics, setTopics] = useState(initialTopics);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => t.title.toLowerCase().includes(q));
  }, [topics, query]);

  function updateLocal(id: string, patch: Partial<SeoTopic>) {
    setTopics((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function save(topic: SeoTopic) {
    setSaving(topic.id);
    const res = await fetch(`/api/admin/topics/${topic.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        metaTitle: topic.metaTitle,
        metaDescription: topic.metaDescription,
        metaKeywords: topic.metaKeywords,
        ogImage: topic.ogImage,
        faqItems: topic.faqItems ?? [],
      }),
    });
    setSaving(null);
    if (!res.ok) {
      toast.error("Could not save SEO fields.");
      return;
    }
    toast.success("SEO metadata saved.");
  }

  function addFaq(topic: SeoTopic) {
    updateLocal(topic.id, { faqItems: [...(topic.faqItems ?? []), { question: "", answer: "" }] });
  }

  function updateFaq(topic: SeoTopic, index: number, patch: Partial<FaqItem>) {
    const items = [...(topic.faqItems ?? [])];
    items[index] = { ...items[index], ...patch };
    updateLocal(topic.id, { faqItems: items });
  }

  function removeFaq(topic: SeoTopic, index: number) {
    const items = (topic.faqItems ?? []).filter((_, i) => i !== index);
    updateLocal(topic.id, { faqItems: items });
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a case file…" className="pl-9" />
      </div>

      {filtered.map((topic) => {
        const titleLen = (topic.metaTitle ?? topic.title).length;
        const descLen = (topic.metaDescription ?? topic.description).length;
        const titleOk = titleLen > 0 && titleLen <= 60;
        const descOk = descLen > 0 && descLen <= 160;

        return (
          <Card key={topic.id}>
            <CardContent className="pt-5">
              <button
                className="flex w-full items-center justify-between text-left font-semibold"
                onClick={() => setExpanded((e) => ({ ...e, [topic.id]: !e[topic.id] }))}
              >
                <span className="flex items-center gap-2">
                  {expanded[topic.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {topic.title}
                </span>
                <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
                  {titleOk && descOk ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Optimized
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-spy-amber">
                      <AlertCircle className="h-3.5 w-3.5" /> Needs attention
                    </span>
                  )}
                </span>
              </button>

              {expanded[topic.id] && (
                <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                  <div>
                    <Label>
                      Meta Title{" "}
                      <span className={titleOk ? "text-green-500" : "text-spy-amber"}>({titleLen}/60)</span>
                    </Label>
                    <Input
                      value={topic.metaTitle ?? ""}
                      placeholder={`${topic.title} Tutorial — Coding Spy`}
                      onChange={(e) => updateLocal(topic.id, { metaTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>
                      Meta Description{" "}
                      <span className={descOk ? "text-green-500" : "text-spy-amber"}>({descLen}/160)</span>
                    </Label>
                    <textarea
                      value={topic.metaDescription ?? ""}
                      placeholder={topic.description}
                      onChange={(e) => updateLocal(topic.id, { metaDescription: e.target.value })}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
                    />
                  </div>
                  <div>
                    <Label>Meta Keywords (comma-separated)</Label>
                    <Input
                      value={topic.metaKeywords ?? ""}
                      placeholder={`${topic.title.toLowerCase()}, ${topic.title.toLowerCase()} tutorial, learn ${topic.title.toLowerCase()}`}
                      onChange={(e) => updateLocal(topic.id, { metaKeywords: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>OG / Social Image URL</Label>
                    <Input
                      value={topic.ogImage ?? ""}
                      placeholder={`/api/og/${topic.slug}`}
                      onChange={(e) => updateLocal(topic.id, { ogImage: e.target.value })}
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="mb-0">FAQ (AEO — powers FAQPage schema)</Label>
                      <Button size="sm" variant="secondary" onClick={() => addFaq(topic)}>
                        <Plus className="h-3.5 w-3.5" /> Add Q&amp;A
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(topic.faqItems ?? []).map((faq, i) => (
                        <div key={i} className="flex gap-2 rounded-lg border border-border/60 p-2">
                          <div className="flex-1 space-y-1">
                            <Input
                              value={faq.question}
                              placeholder="Question"
                              onChange={(e) => updateFaq(topic, i, { question: e.target.value })}
                            />
                            <Input
                              value={faq.answer}
                              placeholder="Answer"
                              onChange={(e) => updateFaq(topic, i, { answer: e.target.value })}
                            />
                          </div>
                          <button onClick={() => removeFaq(topic, i)} aria-label="Remove FAQ">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => save(topic)} disabled={saving === topic.id}>
                    {saving === topic.id ? "Saving…" : "Save SEO Settings"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
