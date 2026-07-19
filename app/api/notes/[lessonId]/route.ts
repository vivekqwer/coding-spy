import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { lessonId: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { content } = body as { content?: string };
  if (typeof content !== "string") {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  if (!content.trim()) {
    await prisma.note.deleteMany({ where: { userId: user.id, lessonId: params.lessonId } });
    return NextResponse.json({ deleted: true });
  }

  const note = await prisma.note.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: params.lessonId } },
    update: { content },
    create: { userId: user.id, lessonId: params.lessonId, content },
  });

  return NextResponse.json(note);
}
