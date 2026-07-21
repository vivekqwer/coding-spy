import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const staff = await requireSection("prompts");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const prompts = await prisma.prompt.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  const staff = await requireSection("prompts");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { category, title, promptText, previewHtml } = body as {
    category?: string;
    title?: string;
    promptText?: string;
    previewHtml?: string;
  };
  if (!category || !title || !promptText) {
    return NextResponse.json({ error: "category, title, and promptText are required." }, { status: 400 });
  }

  const maxOrder = await prisma.prompt.aggregate({ _max: { order: true }, where: { category } });
  const prompt = await prisma.prompt.create({
    data: {
      category,
      title,
      promptText,
      previewHtml: previewHtml ?? null,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(prompt, { status: 201 });
}
