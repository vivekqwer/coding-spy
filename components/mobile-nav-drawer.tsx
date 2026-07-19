"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { categorize } from "@/lib/topic-categories";
import type { NavTopic } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function MobileNavDrawer({
  topics,
  isLoggedIn,
  isAdmin,
}: {
  topics: NavTopic[];
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const groups = categorize(topics);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto bg-background">
            <div className="flex items-center justify-between border-b border-border/60 p-4">
              <span className="text-sm font-semibold">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1 border-b border-border/60 p-4">
              <Link href="/" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">
                Home
              </Link>
              {isLoggedIn && (
                <Link href="/profile" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">
                  Agent Profile
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">
                  Mission Control
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block py-1.5 text-left text-sm font-medium text-destructive"
                >
                  Sign out
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="block py-1.5">
                  <Button size="sm" className="mt-1">
                    Agent Sign-In
                  </Button>
                </Link>
              )}
            </div>

            <div className="p-4">
              {groups.map((group) => (
                <div key={group.name} className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-spy-amber">{group.name}</p>
                  <ul className="space-y-1.5">
                    {group.topics.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/case-files/${t.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm text-foreground/90"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
