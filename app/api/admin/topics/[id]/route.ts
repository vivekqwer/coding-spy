import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const {
    title,
    description,
    icon,
    color,
    isPublished,
    isPaid,
    priceInCents,
    currency,
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImage,
    faqItems,
  } = body as {
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
    isPublished?: boolean;
    isPaid?: boolean;
    priceInCents?: number;
    currency?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
    faqItems?: { question: string; answer: string }[];
  };

  const topic = await prisma.topic.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(icon !== undefined ? { icon } : {}),
      ...(color !== undefined ? { color } : {}),
      ...(isPublished !== undefined ? { isPublished } : {}),
      ...(isPaid !== undefined ? { isPaid } : {}),
      ...(priceInCents !== undefined ? { priceInCents } : {}),
      ...(currency !== undefined ? { currency } : {}),
      ...(metaTitle !== undefined ? { metaTitle } : {}),
      ...(metaDescription !== undefined ? { metaDescription } : {}),
      ...(metaKeywords !== undefined ? { metaKeywords } : {}),
      ...(ogImage !== undefined ? { ogImage } : {}),
      ...(faqItems !== undefined ? { faqItems } : {}),
    },
  });
  return NextResponse.json(topic);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.topic.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
