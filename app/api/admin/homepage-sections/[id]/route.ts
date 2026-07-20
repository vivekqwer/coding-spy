import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { title, subtitle, imageUrl, buttonText, buttonLink, order, isVisible } = body as {
    title?: string;
    subtitle?: string | null;
    imageUrl?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    order?: number;
    isVisible?: boolean;
  };

  const section = await prisma.homepageSection.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(subtitle !== undefined ? { subtitle } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(buttonText !== undefined ? { buttonText } : {}),
      ...(buttonLink !== undefined ? { buttonLink } : {}),
      ...(order !== undefined ? { order } : {}),
      ...(isVisible !== undefined ? { isVisible } : {}),
    },
  });
  return NextResponse.json(section);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.homepageSection.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
