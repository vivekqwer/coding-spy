import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const staff = await requireSection("prompts");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { category, title, promptText, previewHtml, order, isPublished } = body as {
    category?: string;
    title?: string;
    promptText?: string;
    previewHtml?: string | null;
    order?: number;
    isPublished?: boolean;
  };

  const prompt = await prisma.prompt.update({
    where: { id: params.id },
    data: {
      ...(category !== undefined ? { category } : {}),
      ...(title !== undefined ? { title } : {}),
      ...(promptText !== undefined ? { promptText } : {}),
      ...(previewHtml !== undefined ? { previewHtml } : {}),
      ...(order !== undefined ? { order } : {}),
      ...(isPublished !== undefined ? { isPublished } : {}),
    },
  });
  return NextResponse.json(prompt);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const staff = await requireSection("prompts");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.prompt.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
