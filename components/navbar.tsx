import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoWithWordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavAuthLinks } from "@/components/nav-auth-links";
import { NavCaseFilesMenu } from "@/components/nav-case-files-menu";
import { NavTopicStrip } from "@/components/nav-topic-strip";
import { NavSearch } from "@/components/nav-search";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { Award, Sparkles } from "lucide-react";

export async function Navbar() {
  const [session, topics] = await Promise.all([
    getServerSession(authOptions),
    prisma.topic.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true, color: true },
    }),
  ]);

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="border-b border-border/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <LogoWithWordmark />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavCaseFilesMenu topics={topics} />
            <Link
              href="/#case-files"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Award className="h-3.5 w-3.5" /> Certifications
            </Link>
            <Link
              href="/prompts"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Prompt
            </Link>
            {isLoggedIn && (
              <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Agent Profile
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Mission Control
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <NavSearch topics={topics} />
            <ThemeToggle />
            <div className="hidden md:block">
              <NavAuthLinks userName={session?.user?.name ?? null} />
            </div>
            <MobileNavDrawer topics={topics} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          </div>
        </div>
      </div>

      <NavTopicStrip topics={topics} />
    </header>
  );
}
