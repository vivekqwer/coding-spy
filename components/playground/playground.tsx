"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Play, RotateCcw, Copy, Save, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildHtmlDocument } from "@/components/playground/iframe-runner";
import { LabTerminal, type TerminalHandle } from "@/components/playground/terminal";
import { runPython } from "@/components/playground/pyodide-runner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const RUNNABLE_LANGUAGES = new Set(["html", "css", "javascript", "js", "python"]);

function monacoLanguage(language: string): string {
  if (language === "js") return "javascript";
  if (language === "ts") return "typescript";
  return language;
}

export function Playground({
  lessonId,
  language,
  starterCode,
  savedCode,
  runnable,
}: {
  lessonId: string;
  language: string;
  starterCode: string;
  savedCode?: string | null;
  runnable: boolean;
}) {
  const [code, setCode] = useState(savedCode ?? starterCode);
  const [running, setRunning] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState("");
  const terminalRef = useRef<TerminalHandle | null>(null);
  const canRun = runnable && RUNNABLE_LANGUAGES.has(language);

  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.source !== "coding-spy-lab") return;
      terminalRef.current?.write(e.data.message, e.data.level);
      if (e.data.level === "error") setLastError(e.data.message);
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const runWeb = useCallback(() => {
    const mode = language === "html" || language === "css" ? "html" : "js";
    const doc =
      mode === "html"
        ? buildHtmlDocument({ html: code, css: "", js: "", mode: "html" })
        : buildHtmlDocument({ html: "", css: "", js: code, mode: "js" });
    setIframeSrc(doc);
  }, [code, language]);

  const runPy = useCallback(async () => {
    setRunning(true);
    terminalRef.current?.clear();
    terminalRef.current?.write("Running Python via Pyodide…");
    try {
      await runPython(code, (msg, level) => {
        terminalRef.current?.write(msg, level);
        if (level === "error") setLastError(msg);
      });
    } catch {
      // already reported via onOutput
    } finally {
      setRunning(false);
    }
  }, [code]);

  function handleRun() {
    setLastError(null);
    if (language === "python") {
      void runPy();
    } else {
      terminalRef.current?.clear();
      terminalRef.current?.write("Executing in sandboxed frame…");
      runWeb();
    }
  }

  function handleReset() {
    setCode(starterCode);
    setIframeSrc("");
    setLastError(null);
    toast.info("Starter code restored.");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied.");
  }

  async function handleSave() {
    const res = await fetch(`/api/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ savedCode: code }),
    });
    if (res.ok) toast.success("Progress saved to your dossier.");
    else toast.error("Sign in to save your progress.");
  }

  async function requestIntel(explainError: boolean) {
    setHintLoading(true);
    setHint(null);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          errorText: explainError ? lastError : undefined,
        }),
      });
      const data = await res.json();
      setHint(data.hint ?? "No intel available right now.");
    } catch {
      setHint("Intel channel unreachable. Try again shortly.");
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-3 py-2">
        <span className="mr-auto text-xs font-semibold uppercase tracking-wide text-muted-foreground">The Lab</span>
        {canRun && (
          <Button size="sm" onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button size="sm" variant="outline" onClick={handleCopy}>
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button size="sm" variant="outline" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button size="sm" variant="secondary" onClick={() => requestIntel(!!lastError)} disabled={hintLoading}>
          <Sparkles className="h-4 w-4" /> {hintLoading ? "Contacting HQ…" : "Request Intel"}
        </Button>
      </div>

      {hint && (
        <div className="border-b border-border/60 bg-spy-violet/10 px-4 py-2 text-sm">
          <strong className="text-spy-cyan">Intel:</strong> {hint}
        </div>
      )}

      <PanelGroup direction="vertical" className="flex-1">
        <Panel defaultSize={60} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={20}>
              <MonacoEditor
                language={monacoLanguage(language)}
                value={code}
                theme="vs-dark"
                onChange={(val) => setCode(val ?? "")}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
              />
            </Panel>
            {canRun && language !== "python" && (
              <>
                <PanelResizeHandle className="w-1 bg-border/60 hover:bg-spy-cyan/60" />
                <Panel defaultSize={50} minSize={20}>
                  <iframe
                    title="Lab preview"
                    className="h-full w-full bg-white"
                    sandbox="allow-scripts"
                    srcDoc={iframeSrc}
                  />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="h-1 bg-border/60 hover:bg-spy-cyan/60" />
        <Panel defaultSize={40} minSize={15}>
          <LabTerminal onReady={(handle) => (terminalRef.current = handle)} />
        </Panel>
      </PanelGroup>

      {!canRun && (
        <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
          This language is display-only in The Lab — read the code and follow along in your own environment.
        </div>
      )}
    </div>
  );
}
