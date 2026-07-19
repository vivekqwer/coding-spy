import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { title } = body as { title?: string };

  const quiz = await prisma.quiz.update({ where: { id }, data: { ...(title ? { title } : {}) } });
  return NextResponse.json(quiz);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
