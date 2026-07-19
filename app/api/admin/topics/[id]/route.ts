import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, description, icon, color, isPublished } = body as {
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
    isPublished?: boolean;
  };

  const topic = await prisma.topic.update({
    where: { id: params.id },
    data: { title, description, icon, color, isPublished },
  });
  return NextResponse.json(topic);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.topic.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
