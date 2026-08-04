import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { CONTENT_REGISTRY, getContent } from "@/lib/content";

const VALID_KEYS = new Set(CONTENT_REGISTRY.map((f) => f.key));

export async function GET() {
  const staff = await requireSection("content");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await getContent());
}

export async function PATCH(req: Request) {
  const staff = await requireSection("content");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const entries = Object.entries(body).filter(
    ([k, v]) => VALID_KEYS.has(k) && typeof v === "string"
  ) as [string, string][];

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.contentBlock.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json(await getContent());
}
