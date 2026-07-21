"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Award,
  Search,
  Share2,
  Code2,
  Home,
  CreditCard,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { LogoWithWordmark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import type { AdminSection } from "@/lib/permissions";

const ICONS: Record<AdminSection, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  homepage: Home,
  topics: BookOpen,
  prompts: Sparkles,
  seo: Search,
  social: Share2,
  developer: Code2,
  users: Users,
  payments: CreditCard,
  certificates: Award,
};

export function AdminMobileNav({
  items,
  roleLabel,
}: {
  items: { href: string; label: string; section: AdminSection }[];
  roleLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/60 p-3 md:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <LogoWithWordmark />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Mission Control menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <LogoWithWordmark />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Badge className="mb-4 border-spy-violet/40 bg-spy-violet/10 text-spy-violet">{roleLabel}</Badge>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">Mission Control</p>
            <nav className="space-y-1 text-sm">
              {items.map((item) => {
                const Icon = ICONS[item.section];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-card/60"
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
