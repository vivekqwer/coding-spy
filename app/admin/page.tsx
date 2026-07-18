import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsChart } from "@/components/admin/stats-chart";
import { Users, BookOpen, GraduationCap, Award } from "lucide-react";

export default async function AdminOverviewPage() {
  const [userCount, topicCount, completions, certificateCount, quizResults] = await Promise.all([
    prisma.user.count(),
    prisma.topic.count(),
    prisma.progress.count({ where: { completed: true } }),
    prisma.certificate.count(),
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

  const stats = [
    { label: "Agents", value: userCount, icon: Users },
    { label: "Case Files (Topics)", value: topicCount, icon: BookOpen },
    { label: "Lessons Completed", value: completions, icon: GraduationCap },
    { label: "Certifications Issued", value: certificateCount, icon: Award },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mission Control</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between pt-5">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className="h-8 w-8 text-spy-cyan" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quiz Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {quizActivity.length > 0 ? (
            <StatsChart data={quizActivity} />
          ) : (
            <p className="text-sm text-muted-foreground">No intel yet, Agent.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
