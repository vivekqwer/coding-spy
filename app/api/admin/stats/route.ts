import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [userCount, topicCount, lessonCount, certificateCount, completions, quizResults] = await Promise.all([
    prisma.user.count(),
    prisma.topic.count(),
    prisma.lesson.count(),
    prisma.certificate.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.quizResult.findMany({ select: { score: true, takenAt: true } }),
  ]);

  const byMonth = new Map<string, number>();
  for (const r of quizResults) {
    const key = `${r.takenAt.getFullYear()}-${String(r.takenAt.getMonth() + 1).padStart(2, "0")}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  const quizActivity = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return NextResponse.json({
    userCount,
    topicCount,
    lessonCount,
    certificateCount,
    completions,
    avgQuizScore: quizResults.length
      ? Math.round(quizResults.reduce((s, r) => s + r.score, 0) / quizResults.length)
      : 0,
    quizActivity,
  });
}
