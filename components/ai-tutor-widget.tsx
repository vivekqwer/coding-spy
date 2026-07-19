"use client";

import { useRef, useState, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content: "Agent, I'm your AI Tutor. Ask me anything about any case file — HTML, Python, SQL, you name it.",
};

export function AiTutorWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "No intel available right now." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Intel channel unreachable. Try again shortly." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-4 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 bg-spy-gradient px-4 py-3 text-white">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> AI Tutor
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close AI Tutor">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user" ? "ml-auto bg-spy-cyan/20 text-foreground" : "bg-card/80 text-foreground/90"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Contacting HQ…
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-border/60 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about any case file…"
              className="h-9 flex-1 rounded-lg border border-border bg-background/60 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-spy-cyan"
            />
            <Button size="icon" onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle AI Tutor"
        className="fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-spy-gradient text-white shadow-lg transition hover:brightness-110"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </>
  );
}
