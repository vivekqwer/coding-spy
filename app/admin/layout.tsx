import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoWithWordmark } from "@/components/logo";
import { canAccessSection, isStaffRole, ROLE_LABELS } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, BookOpen, Users, Award, Search, Share2, Code2, Home, CreditCard, Sparkles } from "lucide-react";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, section: "overview" as const },
  { href: "/admin/homepage", label: "Homepage", icon: Home, section: "homepage" as const },
  { href: "/admin/topics", label: "Case Files", icon: BookOpen, section: "topics" as const },
  { href: "/admin/prompts", label: "AI Prompt", icon: Sparkles, section: "prompts" as const },
  { href: "/admin/seo", label: "SEO & AEO", icon: Search, section: "seo" as const },
  { href: "/admin/social", label: "Social Media", icon: Share2, section: "social" as const },
  { href: "/admin/developer", label: "Developer", icon: Code2, section: "developer" as const },
  { href: "/admin/users", label: "Agent Roster", icon: Users, section: "users" as const },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, section: "payments" as const },
  { href: "/admin/certificates", label: "Certifications", icon: Award, section: "certificates" as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isStaffRole(session.user.role)) redirect("/");

  const visibleItems = NAV_ITEMS.filter((item) => canAccessSection(session.user.role, item.section));

  return (
    <div className="min-h-screen bg-background md:flex">
      <AdminMobileNav
        items={visibleItems.map((item) => ({ href: item.href, label: item.label, section: item.section }))}
        roleLabel={ROLE_LABELS[session.user.role]}
      />
      <aside className="hidden w-56 shrink-0 border-r border-border/60 p-4 md:block">
        <Link href="/" className="mb-4 block">
          <LogoWithWordmark />
        </Link>
        <Badge className="mb-4 border-spy-violet/40 bg-spy-violet/10 text-spy-violet">
          {ROLE_LABELS[session.user.role]}
        </Badge>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">Mission Control</p>
        <nav className="space-y-1 text-sm">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-card/60"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
