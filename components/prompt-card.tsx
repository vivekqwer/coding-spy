"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Wand2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Prompt = {
  id: string;
  category: string;
  title: string;
  promptText: string;
  previewHtml: string | null;
};

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    toast.success("Prompt copied — paste it into any AI to get the real code.");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="glass flex h-full flex-col rounded-2xl p-4">
        <Badge className="mb-2 w-fit border-spy-cyan/40 bg-spy-cyan/10 text-spy-cyan">{prompt.category}</Badge>
        <h3 className="mb-2 font-semibold">{prompt.title}</h3>
        <p className="mb-4 flex-1 rounded-lg border border-border/60 bg-background/60 p-3 text-xs leading-relaxed text-foreground/80">
          {prompt.promptText}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={copyPrompt}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Prompt"}
          </Button>
          {prompt.previewHtml && (
            <Button size="sm" variant="secondary" onClick={() => setShowPreview(true)}>
              <Wand2 className="h-3.5 w-3.5" /> Animate
            </Button>
          )}
        </div>
      </div>

      {showPreview && prompt.previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background">
            <div className="flex items-center justify-between border-b border-border/60 p-3">
              <span className="text-sm font-semibold">{prompt.title} — Live Preview</span>
              <button onClick={() => setShowPreview(false)} aria-label="Close preview">
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              title={`${prompt.title} preview`}
              className="flex-1 bg-white"
              sandbox="allow-scripts"
              srcDoc={prompt.previewHtml}
            />
          </div>
        </div>
      )}
    </>
  );
}
