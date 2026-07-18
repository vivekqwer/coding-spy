import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, topicId, chapterId } = body as { title?: string; topicId?: string; chapterId?: string };
  if (!title || (!topicId && !chapterId)) {
    return NextResponse.json({ error: "title and (topicId or chapterId) required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: { title, topicId: topicId ?? null, chapterId: chapterId ?? null },
  });
  return NextResponse.json(quiz, { status: 201 });
}
