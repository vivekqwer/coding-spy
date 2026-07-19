import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSection } from "@/lib/requireAdmin";
import { TopicManager } from "@/components/admin/topic-manager";

export default async function AdminTopicsPage() {
  const staff = await requireSection("topics");
  if (!staff) redirect("/admin");

  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      chapters: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
      quizzes: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Case File Manager</h1>
      <TopicManager initialTopics={JSON.parse(JSON.stringify(topics))} />
    </div>
  );
}
