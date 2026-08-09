import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const topics = await prisma.topic.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        chapters: { select: { lessons: { select: { slug: true } } } },
      },
    });

    const topicRoutes: MetadataRoute.Sitemap = topics.map((t) => ({
      url: `${baseUrl}/case-files/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const lessonRoutes: MetadataRoute.Sitemap = topics.flatMap((t) =>
      t.chapters.flatMap((c) =>
        c.lessons.map((l) => ({
          url: `${baseUrl}/case-files/${t.slug}/${l.slug}`,
          lastModified: t.updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      )
    );

    return [...staticRoutes, ...topicRoutes, ...lessonRoutes];
  } catch {
    // DB unavailable at build time — return static routes only.
    return staticRoutes;
  }
}
