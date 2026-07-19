import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/streak";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { savedCode, completed } = body as { savedCode?: string; completed?: boolean };

  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: params.id } },
    update: {
      ...(savedCode !== undefined ? { savedCode } : {}),
      ...(completed !== undefined ? { completed } : {}),
    },
    create: {
      userId: user.id,
      lessonId: params.id,
      savedCode: savedCode ?? null,
      completed: completed ?? false,
    },
  });

  await recordActivity(user.id);

  return NextResponse.json(progress);
}
