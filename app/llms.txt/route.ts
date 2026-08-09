import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type LlmTopic = { title: string; slug: string; description: string; isPaid: boolean };

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  let topics: LlmTopic[] = [];
  try {
    topics = await prisma.topic.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: { title: true, slug: true, description: true, isPaid: true },
    });
  } catch {
    // DB unavailable at build time — emit the header only.
  }

  const lines = [
    "# Coding Spy",
    "",
    "> Coding Spy is an interactive coding tutorial platform — hands-on case files, a live code",
    "> playground (\"The Lab\"), quizzes, and Agent Certifications, covering 47 programming",
    "> topics from HTML to Machine Learning.",
    "",
    "## Case Files",
    "",
    ...topics.map(
      (t) => `- [${t.title}](${baseUrl}/case-files/${t.slug})${t.isPaid ? " (paid)" : ""}: ${t.description}`
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
