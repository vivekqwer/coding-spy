"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Lesson = { slug: string; title: string };
type Chapter = { id: string; title: string; lessons: Lesson[] };

export function SidebarNav({ topicSlug, chapters }: { topicSlug: string; chapters: Chapter[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const content = (
    <nav className="space-y-1 p-4">
      {chapters.map((chapter) => {
        const isCollapsed = collapsed[chapter.id];
        return (
          <div key={chapter.id}>
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [chapter.id]: !c[chapter.id] }))}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm font-semibold text-foreground/90 hover:bg-card/60"
            >
              {chapter.title}
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {!isCollapsed && (
              <ul className="ml-2 space-y-0.5 border-l border-border/60 pl-2">
                {chapter.lessons.map((lesson) => {
                  const href = `/case-files/${topicSlug}/${lesson.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground",
                          active && "bg-spy-cyan/10 text-spy-cyan"
                        )}
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-spy-gradient text-white shadow-lg md:hidden"
        aria-label="Open case file navigation"
      >
        <Menu className="h-5 w-5" />
      </button>
      <aside className="hidden w-64 shrink-0 border-r border-border/60 md:block">{content}</aside>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-background">
            <div className="flex items-center justify-between border-b border-border/60 p-3">
              <span className="text-sm font-semibold">Case Files</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
