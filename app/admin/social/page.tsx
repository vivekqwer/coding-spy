import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/requireAdmin";
import { SocialPreviewGrid } from "@/components/admin/social-preview-grid";

export default async function AdminSocialPage() {
  const staff = await requireSection("social");
  if (!staff) redirect("/admin");

  const topics = await prisma.topic.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true, description: true, ogImage: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Social Media Control Room</h1>
        <p className="text-sm text-muted-foreground">
          Preview how each case file looks when shared, and grab ready-to-post share links.
        </p>
      </div>
      <SocialPreviewGrid topics={topics} />
    </div>
  );
}
