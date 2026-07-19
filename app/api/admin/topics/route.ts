import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: { chapters: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, description, icon, color } = body as {
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const maxOrder = await prisma.topic.aggregate({ _max: { order: true } });
  const topic = await prisma.topic.create({
    data: {
      title,
      slug: slugify(title),
      description: description ?? "",
      icon: icon ?? "Code2",
      color: color ?? "#22D3EE",
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(topic, { status: 201 });
}
