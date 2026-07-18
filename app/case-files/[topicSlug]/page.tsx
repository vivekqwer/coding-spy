import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TopicPage({ params }: { params: { topicSlug: string } }) {
  const topic = await prisma.topic.findUnique({
    where: { slug: params.topicSlug },
    include: { chapters: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!topic) notFound();

  const firstLesson = topic.chapters.flatMap((c) => c.lessons)[0];
  if (!firstLesson) notFound();

  redirect(`/case-files/${topic.slug}/${firstLesson.slug}`);
}
