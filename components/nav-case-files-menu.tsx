"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { categorize } from "@/lib/topic-categories";
import type { NavTopic } from "@/lib/types";

export function NavCaseFilesMenu({ topics }: { topics: NavTopic[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groups = categorize(topics);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Case Files <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="fixed left-1/2 top-[7rem] z-50 max-h-[75vh] w-[min(94vw,64rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {groups.map((group) => (
                <div key={group.name}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-spy-amber">{group.name}</p>
                  <ul className="space-y-1.5">
                    {group.topics.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/case-files/${t.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm text-foreground/90 hover:text-spy-cyan"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-border/60 pt-4 text-right">
              <Link
                href="/#case-files"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-spy-cyan hover:underline"
              >
                View all 47 case files →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
