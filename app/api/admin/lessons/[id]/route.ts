import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { title, contentMarkdown, language, starterCode, order, runnable } = body as Record<string, unknown>;

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof contentMarkdown === "string" ? { contentMarkdown } : {}),
      ...(typeof language === "string" ? { language } : {}),
      ...(typeof starterCode === "string" ? { starterCode } : {}),
      ...(typeof order === "number" ? { order } : {}),
      ...(typeof runnable === "boolean" ? { runnable } : {}),
    },
  });
  return NextResponse.json(lesson);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
