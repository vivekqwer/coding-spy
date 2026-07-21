"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Home, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

export function AiPromptHeader({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);

  function updateFades() {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateFades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">
            AI <span className="text-gradient">Prompt</span>
          </span>
          <span className="hidden items-center gap-1 rounded-full border border-spy-violet/40 bg-spy-violet/10 px-2 py-0.5 text-xs font-semibold text-spy-violet sm:flex">
            <Sparkles className="h-3 w-3" /> Beta
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Home className="h-4 w-4" /> Home
        </Link>
      </div>

      <div className="relative">
        {showLeftFade && (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        )}
        <div
          ref={scrollRef}
          onScroll={updateFades}
          className="no-scrollbar container flex gap-2 overflow-x-auto border-t border-border/60 py-2"
        >
          <Link
            href="/prompts"
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !activeCategory ? "bg-spy-gradient text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/prompts?category=${encodeURIComponent(c)}`}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeCategory === c ? "bg-spy-gradient text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
        {showRightFade && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background via-background/80 to-transparent" />
        )}
      </div>
    </header>
  );
}
