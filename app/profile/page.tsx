import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Award, BookOpen, ArrowRight, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [user, certificates, lastProgress, topics] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, currentStreak: true, longestStreak: true, createdAt: true },
    }),
    prisma.certificate.findMany({
      where: { userId: session.user.id },
      orderBy: { issuedAt: "desc" },
      include: { topic: { select: { title: true, slug: true } } },
    }),
    prisma.progress.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        lesson: { include: { chapter: { include: { topic: true } } } },
      },
    }),
    prisma.topic.findMany({
      orderBy: { order: "asc" },
      include: { chapters: { include: { lessons: { include: { progress: { where: { userId: session.user.id } } } } } } },
    }),
  ]);

  const topicProgress = topics
    .map((t) => {
      const lessons = t.chapters.flatMap((c) => c.lessons);
      const completed = lessons.filter((l) => l.progress.some((p) => p.completed)).length;
      return { slug: t.slug, title: t.title, color: t.color, total: lessons.length, completed };
    })
    .filter((t) => t.completed > 0);

  return (
    <>
      <Navbar />
      <main className="container py-10">
        <h1 className="mb-1 text-2xl font-bold">Agent Dossier</h1>
        <p className="mb-6 text-muted-foreground">{user?.name} · {user?.email}</p>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <Flame className="h-8 w-8 text-spy-amber" />
              <div>
                <p className="text-2xl font-bold">{user?.currentStreak ?? 0}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <BookOpen className="h-8 w-8 text-spy-cyan" />
              <div>
                <p className="text-2xl font-bold">{user?.longestStreak ?? 0}</p>
                <p className="text-xs text-muted-foreground">Longest streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <Award className="h-8 w-8 text-spy-violet" />
              <div>
                <p className="text-2xl font-bold">{certificates.length}</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {lastProgress?.lesson && (
          <Card className="mb-6">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Continue where you left off
                </p>
                <p className="font-semibold">
                  {lastProgress.lesson.chapter.topic.title} · {lastProgress.lesson.title}
                </p>
              </div>
              <Link href={`/case-files/${lastProgress.lesson.chapter.topic.slug}/${lastProgress.lesson.slug}`}>
                <Button>
                  Resume Mission <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Clearance Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topicProgress.length === 0 ? (
                <p className="text-sm text-muted-foreground">No intel yet, Agent.</p>
              ) : (
                topicProgress.map((t) => (
                  <div key={t.slug}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <Link href={`/case-files/${t.slug}`} className="font-medium hover:text-spy-cyan">
                        {t.title}
                      </Link>
                      <span className="text-muted-foreground">
                        {t.completed}/{t.total}
                      </span>
                    </div>
                    <Progress value={(t.completed / t.total) * 100} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No intel yet, Agent.</p>
              ) : (
                certificates.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
                    <div>
                      <p className="font-medium">{c.topic.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Issued {formatDate(c.issuedAt)} · {c.code}
                      </p>
                    </div>
                    <Link href={`/api/certificate/pdf/${c.code}`} target="_blank">
                      <Button size="sm" variant="outline">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
