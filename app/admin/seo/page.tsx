import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/requireAdmin";
import { SeoManager } from "@/components/admin/seo-manager";

export default async function AdminSeoPage() {
  const staff = await requireSection("seo");
  if (!staff) redirect("/admin");

  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      ogImage: true,
      faqItems: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SEO &amp; AEO Control Room</h1>
        <p className="text-sm text-muted-foreground">
          Edit meta titles, descriptions, keywords, OG images, and FAQ blocks per case file. Also see{" "}
          <a href="/sitemap.xml" target="_blank" className="text-spy-cyan hover:underline">
            sitemap.xml
          </a>
          ,{" "}
          <a href="/robots.txt" target="_blank" className="text-spy-cyan hover:underline">
            robots.txt
          </a>
          , and{" "}
          <a href="/llms.txt" target="_blank" className="text-spy-cyan hover:underline">
            llms.txt
          </a>{" "}
          (for AI answer engines).
        </p>
      </div>
      <SeoManager initialTopics={JSON.parse(JSON.stringify(topics))} />
    </div>
  );
}
