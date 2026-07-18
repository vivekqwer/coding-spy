import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const items = (body as { items?: { id: string; order: number }[] }).items ?? [];

  await prisma.$transaction(items.map((it) => prisma.topic.update({ where: { id: it.id }, data: { order: it.order } })));

  return NextResponse.json({ ok: true });
}
