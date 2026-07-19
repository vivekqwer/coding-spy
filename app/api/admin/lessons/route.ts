import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { chapterId, title, contentMarkdown, language, starterCode, runnable } = body as {
    chapterId?: string;
    title?: string;
    contentMarkdown?: string;
    language?: string;
    starterCode?: string;
    runnable?: boolean;
  };
  if (!chapterId || !title) return NextResponse.json({ error: "chapterId and title required" }, { status: 400 });

  const maxOrder = await prisma.lesson.aggregate({ _max: { order: true }, where: { chapterId } });
  const lesson = await prisma.lesson.create({
    data: {
      chapterId,
      title,
      slug: slugify(title),
      order: (maxOrder._max.order ?? 0) + 1,
      contentMarkdown: contentMarkdown ?? "",
      language: language ?? "html",
      starterCode: starterCode ?? "",
      runnable: runnable ?? true,
    },
  });
  return NextResponse.json(lesson, { status: 201 });
}
