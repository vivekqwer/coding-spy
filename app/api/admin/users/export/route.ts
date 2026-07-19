import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { buildXlsxResponse } from "@/lib/export-xlsx";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const staff = await requireSection("users");
  if (!staff) return new Response("Forbidden", { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      currentStreak: true,
      _count: { select: { progress: true, certificates: true, quizResults: true } },
    },
  });

  const rows = users.map((u) => ({
    Name: u.name ?? "",
    Email: u.email,
    "Permission Level": ROLE_LABELS[u.role],
    "Joined": formatDate(u.createdAt),
    "Current Streak": u.currentStreak,
    "Lessons Completed": u._count.progress,
    "Quizzes Taken": u._count.quizResults,
    "Certificates Earned": u._count.certificates,
  }));

  return buildXlsxResponse(rows, "Agents", "coding-spy-agents.xlsx");
}
