import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { topicId, title } = body as { topicId?: string; title?: string };
  if (!topicId || !title) return NextResponse.json({ error: "topicId and title required" }, { status: 400 });

  const maxOrder = await prisma.chapter.aggregate({ _max: { order: true }, where: { topicId } });
  const chapter = await prisma.chapter.create({
    data: { topicId, title, order: (maxOrder._max.order ?? 0) + 1 },
  });
  return NextResponse.json(chapter, { status: 201 });
}
