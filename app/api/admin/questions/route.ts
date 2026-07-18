import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { quizId, question, options, correctIndex, explanation } = body as {
    quizId?: string;
    question?: string;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
  };
  if (!quizId || !question || !options || typeof correctIndex !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const maxOrder = await prisma.quizQuestion.aggregate({ _max: { order: true }, where: { quizId } });
  const q = await prisma.quizQuestion.create({
    data: {
      quizId,
      question,
      options,
      correctIndex,
      explanation: explanation ?? "",
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });
  return NextResponse.json(q, { status: 201 });
}
