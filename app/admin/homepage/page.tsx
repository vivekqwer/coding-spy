import { redirect } from "next/navigation";
import { requireSection } from "@/lib/requireAdmin";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { HomepageSectionsManager } from "@/components/admin/homepage-sections-manager";

export default async function AdminHomepagePage() {
  const staff = await requireSection("homepage");
  if (!staff) redirect("/admin");

  const [settings, sections] = await Promise.all([
    getSiteSettings(),
    prisma.homepageSection.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Homepage Editor</h1>
        <p className="text-sm text-muted-foreground">
          Edit the hero and call-to-action copy shown on the public homepage.
        </p>
      </div>
      <HomepageEditor initialSettings={JSON.parse(JSON.stringify(settings))} />

      <div>
        <h2 className="mb-1 text-xl font-bold">Custom Sections</h2>
        <p className="text-sm text-muted-foreground">
          Add, edit, reorder, hide, or delete extra homepage sections — each can have its own image, text, and
          button. They render between the case-file grid and the certification banner.
        </p>
      </div>
      <HomepageSectionsManager initialSections={JSON.parse(JSON.stringify(sections))} />
    </div>
  );
}
