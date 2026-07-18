import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { code: params.code },
    include: { user: { select: { name: true } }, topic: { select: { title: true } } },
  });
  if (!certificate) return NextResponse.json({ valid: false }, { status: 404 });

  return NextResponse.json({
    valid: true,
    agentName: certificate.user.name,
    topicTitle: certificate.topic.title,
    issuedAt: certificate.issuedAt,
    code: certificate.code,
  });
}
