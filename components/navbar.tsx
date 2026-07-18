import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoWithWordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavAuthLinks } from "@/components/nav-auth-links";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <LogoWithWordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#case-files" className="hover:text-foreground">
            Case Files
          </Link>
          {session?.user && (
            <Link href="/profile" className="hover:text-foreground">
              Agent Profile
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-foreground">
              Mission Control
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NavAuthLinks
            userName={session?.user?.name ?? null}
          />
        </div>
      </div>
    </header>
  );
}
