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
  const b = body as Record<string, string | undefined>;

  // Whitelist of editable homepage text fields
  const FIELDS = [
    "heroBadge",
    "heroTitle",
    "heroSubtitle",
    "heroTagline",
    "heroPrimaryCtaLabel",
    "heroPrimaryCtaHref",
    "heroSecondaryCtaLabel",
    "heroSecondaryCtaHref",
    "heroFeatures",
    "labCardLabel",
    "labCardTitle",
    "labCardCode",
    "labCardDescription",
    "moreCaseFilesTitle",
    "ctaTitle",
    "ctaSubtitle",
    "ctaButtonLabel",
  ] as const;

  const update: Record<string, string> = {};
  for (const f of FIELDS) {
    if (b[f] !== undefined) update[f] = b[f] as string;
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update,
    create: { id: "singleton" },
  });

  return NextResponse.json(settings);
}
