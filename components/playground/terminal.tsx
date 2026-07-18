"use client";

import { useEffect, useRef } from "react";
import type { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export type TerminalHandle = { write: (msg: string, level?: "log" | "info" | "warn" | "error") => void; clear: () => void };

export function LabTerminal({ onReady }: { onReady: (handle: TerminalHandle) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      if (disposed || !containerRef.current) return;

      const term = new Terminal({
        convertEol: true,
        fontSize: 13,
        fontFamily: "var(--font-mono), monospace",
        theme: { background: "#0B0F17", foreground: "#E5E7EB" },
        disableStdin: true,
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      fit.fit();
      termRef.current = term;
      term.writeln("\x1b[36mCoding Spy Terminal — awaiting mission output…\x1b[0m");

      const resize = () => fit.fit();
      window.addEventListener("resize", resize);

      onReady({
        write: (msg, level = "log") => {
          const color = level === "error" ? "\x1b[31m" : level === "warn" ? "\x1b[33m" : "\x1b[37m";
          term.writeln(`${color}${msg}\x1b[0m`);
        },
        clear: () => term.clear(),
      });

      return () => window.removeEventListener("resize", resize);
    })();

    return () => {
      disposed = true;
      termRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
