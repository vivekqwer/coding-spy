import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sections = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, subtitle, imageUrl, buttonText, buttonLink } = body as {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const maxOrder = await prisma.homepageSection.aggregate({ _max: { order: true } });
  const section = await prisma.homepageSection.create({
    data: {
      title,
      subtitle: subtitle ?? null,
      imageUrl: imageUrl ?? null,
      buttonText: buttonText ?? null,
      buttonLink: buttonLink ?? null,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(section, { status: 201 });
}
