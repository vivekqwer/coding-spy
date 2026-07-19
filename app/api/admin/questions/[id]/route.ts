import { NextResponse } from "next/server";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { question, options, correctIndex, explanation } = body as {
    question?: string;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
  };

  const data: Prisma.QuizQuestionUpdateInput = {};
  if (typeof question === "string") data.question = question;
  if (options) data.options = options;
  if (typeof correctIndex === "number") data.correctIndex = correctIndex;
  if (typeof explanation === "string") data.explanation = explanation;

  const q = await prisma.quizQuestion.update({ where: { id }, data });
  return NextResponse.json(q);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireSection("topics");
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = params;
  await prisma.quizQuestion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
