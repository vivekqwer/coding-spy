"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { NavTopic } from "@/lib/types";

export function NavTopicStrip({ topics }: { topics: NavTopic[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  function updateFades() {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => updateFades();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  return (
    <div className="relative border-b border-border/60 bg-card/30">
      {showLeftFade && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
      )}
      <div
        ref={scrollRef}
        onScroll={updateFades}
        className="no-scrollbar container flex gap-5 overflow-x-auto py-2 text-sm"
      >
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/case-files/${t.slug}`}
            className="shrink-0 whitespace-nowrap text-muted-foreground transition hover:text-foreground"
            style={{ borderBottom: "2px solid transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = t.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
          >
            {t.title}
          </Link>
        ))}
      </div>
      {showRightFade && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background via-background/80 to-transparent" />
      )}
    </div>
  );
}
