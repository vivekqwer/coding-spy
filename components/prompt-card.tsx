"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Maximize2, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Prompt = {
  id: string;
  category: string;
  title: string;
  promptText: string;
  previewHtml: string | null;
};

const VIRTUAL_WIDTH = 960;
const VIRTUAL_HEIGHT = 640;

function LiveThumbnail({ html, title }: { html: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / VIRTUAL_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${VIRTUAL_WIDTH} / ${VIRTUAL_HEIGHT}` }}
    >
      <div
        style={{
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <iframe
          title={`${title} thumbnail`}
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          className="pointer-events-none border-0"
          sandbox="allow-scripts"
          srcDoc={html}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

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
      <div className="glass group flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="relative">
          {prompt.previewHtml ? (
            <LiveThumbnail html={prompt.previewHtml} title={prompt.title} />
          ) : (
            <div
              className="flex items-center justify-center bg-gradient-to-br from-spy-cyan/20 to-spy-violet/20"
              style={{ aspectRatio: `${VIRTUAL_WIDTH} / ${VIRTUAL_HEIGHT}` }}
            >
              <Sparkles className="h-8 w-8 text-spy-violet/60" />
            </div>
          )}
          {prompt.previewHtml && (
            <button
              onClick={() => setShowPreview(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100"
              aria-label="Expand preview"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold">
                <Maximize2 className="h-3.5 w-3.5" /> Expand
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Badge className="mb-2 w-fit border-spy-cyan/40 bg-spy-cyan/10 text-spy-cyan">{prompt.category}</Badge>
          <h3 className="mb-2 font-semibold">{prompt.title}</h3>
          <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
            {prompt.promptText}
          </p>
          <Button size="sm" onClick={copyPrompt} className="w-full">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Prompt"}
          </Button>
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
