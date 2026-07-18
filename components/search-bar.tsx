"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import type { TopicCardData } from "@/components/topic-card";

export function SearchBar({ topics }: { topics: TopicCardData[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () => new Fuse(topics, { keys: ["title", "description"], threshold: 0.35 }),
    [topics]
  );

  const results = query.trim() ? fuse.search(query).slice(0, 8).map((r) => r.item) : [];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the case files, Agent…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search tutorials"
        />
      </div>
      {results.length > 0 && (
        <ul className="glass absolute z-30 mt-2 w-full overflow-hidden rounded-xl">
          {results.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/case-files/${topic.slug}`}
                className="block px-4 py-2.5 text-sm hover:bg-spy-cyan/10"
                onClick={() => setQuery("")}
              >
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
