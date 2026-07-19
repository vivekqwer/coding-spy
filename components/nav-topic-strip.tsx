"use client";

import Link from "next/link";
import type { NavTopic } from "@/lib/types";

export function NavTopicStrip({ topics }: { topics: NavTopic[] }) {
  return (
    <div className="border-b border-border/60 bg-card/30">
      <div className="no-scrollbar container flex gap-5 overflow-x-auto py-2 text-sm">
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
    </div>
  );
}
