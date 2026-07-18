import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { answers } = body as { answers?: Record<string, number> };
  if (!answers) return NextResponse.json({ error: "answers required" }, { status: 400 });

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const results = quiz.questions.map((q) => {
    const chosen = answers[q.id];
    const correct = chosen === q.correctIndex;
    return { questionId: q.id, chosen, correct, correctIndex: q.correctIndex, explanation: q.explanation };
  });

  const score = Math.round((results.filter((r) => r.correct).length / quiz.questions.length) * 100);
  const passed = score >= 70;

  await prisma.quizResult.create({
    data: { userId: user.id, quizId: quiz.id, score, passed },
  });

  return NextResponse.json({ score, passed, results });
}
