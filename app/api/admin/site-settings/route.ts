import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const staff = await requireSection("homepage");
  if (!staff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { heroBadge, heroTitle, heroSubtitle, heroTagline, ctaTitle, ctaSubtitle } = body as Record<
    string,
    string | undefined
  >;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...(heroBadge !== undefined ? { heroBadge } : {}),
      ...(heroTitle !== undefined ? { heroTitle } : {}),
      ...(heroSubtitle !== undefined ? { heroSubtitle } : {}),
      ...(heroTagline !== undefined ? { heroTagline } : {}),
      ...(ctaTitle !== undefined ? { ctaTitle } : {}),
      ...(ctaSubtitle !== undefined ? { ctaSubtitle } : {}),
    },
    create: { id: "singleton" },
  });

  return NextResponse.json(settings);
}
