"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import type { NavTopic } from "@/lib/types";

export function NavSearch({ topics }: { topics: NavTopic[] }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const fuse = useMemo(() => new Fuse(topics, { keys: ["title"], threshold: 0.35 }), [topics]);
  const results = query.trim() ? fuse.search(query).slice(0, 8).map((r) => r.item) : [];

  return (
    <div className="relative hidden md:block">
      <div className="flex h-9 w-56 items-center gap-2 rounded-lg border border-border bg-background/60 px-3">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search case files…"
          aria-label="Search case files"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      {focused && results.length > 0 && (
        <ul className="glass absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl">
          {results.map((t) => (
            <li key={t.slug}>
              <Link href={`/case-files/${t.slug}`} className="block px-4 py-2.5 text-sm hover:bg-spy-cyan/10">
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
