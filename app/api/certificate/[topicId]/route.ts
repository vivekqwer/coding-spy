import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { generateCertCode } from "@/lib/utils";

export async function POST(_req: Request, { params }: { params: { topicId: string } }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: { chapters: { include: { lessons: true } }, quizzes: true },
  });
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  const lessonIds = topic.chapters.flatMap((c) => c.lessons.map((l) => l.id));
  const completedCount = await prisma.progress.count({
    where: { userId: user.id, lessonId: { in: lessonIds }, completed: true },
  });
  if (lessonIds.length === 0 || completedCount < lessonIds.length) {
    return NextResponse.json({ error: "Complete every case file in this topic first." }, { status: 400 });
  }

  const quizIds = topic.quizzes.map((q) => q.id);
  const bestResult = await prisma.quizResult.findFirst({
    where: { userId: user.id, quizId: { in: quizIds }, passed: true },
    orderBy: { takenAt: "desc" },
  });
  if (quizIds.length > 0 && !bestResult) {
    return NextResponse.json({ error: "Pass the topic quiz (70%+) first." }, { status: 400 });
  }

  const existing = await prisma.certificate.findUnique({
    where: { userId_topicId: { userId: user.id, topicId: topic.id } },
  });
  if (existing) return NextResponse.json(existing);

  const certificate = await prisma.certificate.create({
    data: { userId: user.id, topicId: topic.id, code: generateCertCode() },
  });

  return NextResponse.json(certificate, { status: 201 });
}
