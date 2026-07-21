"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Maximize2, X, Check, Sparkles, Eye, Code2, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ModalTab = "preview" | "code" | "prompt";

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
  // Only mount the (heavy) iframe once the card scrolls near the viewport.
  // Rendering all cards' iframes at once would freeze the page.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / VIRTUAL_WIDTH);
    update();
    const resize = new ResizeObserver(update);
    resize.observe(el);

    // Mount immediately if the card is already near/in the viewport — this is
    // synchronous and does not rely on IntersectionObserver (which some
    // environments throttle), so above-the-fold cards always render.
    const near = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + 400 && r.bottom > -400;
    };
    if (near()) setVisible(true);

    // For cards further down, mount them as they scroll close to the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);

    // Fallback for environments where IntersectionObserver never fires:
    // reveal on scroll using a cheap bounding-box check.
    const onScroll = () => {
      if (near()) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      resize.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-white">
      <div
        style={{
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {visible ? (
          <iframe
            title={`${title} thumbnail`}
            width={VIRTUAL_WIDTH}
            height={VIRTUAL_HEIGHT}
            className="pointer-events-none border-0"
            sandbox="allow-scripts"
            srcDoc={html}
            loading="lazy"
            tabIndex={-1}
          />
        ) : (
          <div
            style={{ width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT }}
            className="bg-gradient-to-br from-slate-100 to-slate-200"
          />
        )}
      </div>
    </div>
  );
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tab, setTab] = useState<ModalTab>("preview");
  const [codeCopied, setCodeCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    toast.success("Prompt copied — paste it into any AI to get the real code.");
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyCode() {
    if (!prompt.previewHtml) return;
    await navigator.clipboard.writeText(prompt.previewHtml);
    setCodeCopied(true);
    toast.success("Preview code copied.");
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function openModal() {
    setTab("preview");
    setShowPreview(true);
  }

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-spy-cyan/50 hover:shadow-[0_20px_50px_-15px_rgba(34,211,238,0.35)]">
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: `${VIRTUAL_WIDTH} / ${VIRTUAL_HEIGHT}` }}
        >
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.06]">
            {prompt.previewHtml ? (
              <LiveThumbnail html={prompt.previewHtml} title={prompt.title} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-spy-cyan/20 via-spy-violet/15 to-spy-amber/10">
                <Sparkles className="h-8 w-8 text-spy-violet/60" />
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {prompt.previewHtml && (
            <button
              onClick={openModal}
              className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
              aria-label="Expand preview"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-lg">
                <Maximize2 className="h-3.5 w-3.5" /> View preview & code
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Badge className="mb-2 w-fit border-spy-cyan/40 bg-spy-cyan/10 text-spy-cyan">{prompt.category}</Badge>
          <h3 className="mb-2 font-semibold transition-colors group-hover:text-spy-cyan">{prompt.title}</h3>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 p-3">
              <span className="truncate text-sm font-semibold">{prompt.title}</span>
              <button onClick={() => setShowPreview(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs: what the UI looks like, the code behind it, and the prompt that produces it */}
            <div className="flex gap-1 border-b border-border/60 p-2">
              <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye className="h-3.5 w-3.5" />}>
                Preview
              </TabButton>
              <TabButton active={tab === "code"} onClick={() => setTab("code")} icon={<Code2 className="h-3.5 w-3.5" />}>
                Code
              </TabButton>
              <TabButton active={tab === "prompt"} onClick={() => setTab("prompt")} icon={<MessageSquareText className="h-3.5 w-3.5" />}>
                Prompt
              </TabButton>
            </div>

            {tab === "preview" && (
              <iframe
                title={`${prompt.title} preview`}
                className="flex-1 bg-white"
                sandbox="allow-scripts"
                srcDoc={prompt.previewHtml}
              />
            )}

            {tab === "code" && (
              <div className="relative flex-1 overflow-auto bg-[#0d1117]">
                <Button
                  size="sm"
                  onClick={copyCode}
                  className="absolute right-3 top-3 z-10"
                >
                  {codeCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {codeCopied ? "Copied" : "Copy Code"}
                </Button>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-200">
                  <code>{prompt.previewHtml}</code>
                </pre>
              </div>
            )}

            {tab === "prompt" && (
              <div className="relative flex-1 overflow-auto p-4">
                <Button size="sm" onClick={copyPrompt} className="absolute right-3 top-3 z-10">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Prompt"}
                </Button>
                <p className="max-w-none whitespace-pre-wrap pr-28 text-sm leading-relaxed text-muted-foreground">
                  {prompt.promptText}
                </p>
                <p className="mt-4 rounded-lg border border-spy-cyan/30 bg-spy-cyan/5 p-3 text-xs text-muted-foreground">
                  Paste this prompt into any AI (ChatGPT, Claude, etc.) to generate the code — the preview above is exactly what it produces.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-spy-cyan/15 text-spy-cyan" : "text-muted-foreground hover:bg-muted/50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
