import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoWithWordmark } from "@/components/logo";
import { LayoutDashboard, BookOpen } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border/60 p-4 md:block">
        <Link href="/" className="mb-6 block">
          <LogoWithWordmark />
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">Mission Control</p>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-card/60">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link href="/admin/topics" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-card/60">
            <BookOpen className="h-4 w-4" /> Case Files
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
