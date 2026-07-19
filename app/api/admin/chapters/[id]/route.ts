import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { title, order } = body as { title?: string; order?: number };

  const chapter = await prisma.chapter.update({
    where: { id },
    data: {
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof order === "number" ? { order } : {}),
    },
  });
  return NextResponse.json(chapter);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  await prisma.chapter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
