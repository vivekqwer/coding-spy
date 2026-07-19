import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { SidebarNav } from "@/components/sidebar-nav";
import { LessonMarkdown } from "@/components/lesson-markdown";
import { Playground } from "@/components/playground/playground";
import { MarkComplete } from "@/components/mark-complete";
import { Quiz } from "@/components/quiz";
import { Progress } from "@/components/ui/progress";
import { NotesPanel } from "@/components/notes-panel";
import { recordActivity } from "@/lib/streak";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LessonPageParams = { topicSlug: string; lessonSlug: string };

export async function generateMetadata({ params }: { params: LessonPageParams }): Promise<Metadata> {
  const topic = await prisma.topic.findUnique({
    where: { slug: params.topicSlug },
    select: { title: true, description: true, metaTitle: true, metaDescription: true, metaKeywords: true, ogImage: true },
  });
  if (!topic) return {};

  const lesson = await prisma.lesson.findFirst({
    where: { slug: params.lessonSlug, chapter: { topic: { slug: params.topicSlug } } },
    select: { title: true },
  });

  const title = lesson ? `${lesson.title} — ${topic.title} Tutorial | Coding Spy` : (topic.metaTitle ?? topic.title);
  const description = topic.metaDescription ?? topic.description;
  const ogImage = topic.ogImage ?? `/api/og/${params.topicSlug}`;

  return {
    title,
    description,
    keywords: topic.metaKeywords ?? undefined,
    openGraph: { title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function LessonPage({ params }: { params: LessonPageParams }) {
  const session = await getServerSession(authOptions);
  const topic = await prisma.topic.findUnique({
    where: { slug: params.topicSlug },
    include: {
      chapters: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      quizzes: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });
  if (!topic) notFound();

  const flatLessons = topic.chapters.flatMap((c) => c.lessons.map((l) => ({ ...l, chapterId: c.id })));
  const currentIndex = flatLessons.findIndex((l) => l.slug === params.lessonSlug);
  const lesson = flatLessons[currentIndex];
  if (!lesson) notFound();

  const prevLesson = flatLessons[currentIndex - 1];
  const nextLesson = flatLessons[currentIndex + 1];
  const isLastLesson = currentIndex === flatLessons.length - 1;

  if (topic.isPaid) {
    const staffRoles = new Set(["ADMIN", "DEVELOPER", "SEO_MANAGER", "SOCIAL_MEDIA_MANAGER"]);
    if (!session?.user) {
      redirect(`/login?callbackUrl=/case-files/${topic.slug}/${lesson.slug}`);
    }
    if (!staffRoles.has(session.user.role)) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_topicId: { userId: session.user.id, topicId: topic.id } },
      });
      if (enrollment?.status !== "PAID") {
        redirect(`/checkout/${topic.slug}`);
      }
    }
  }

  let progress: { completed: boolean; savedCode: string | null } | null = null;
  let clearance = 0;
  let noteContent = "";
  if (session?.user) {
    progress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      select: { completed: true, savedCode: true },
    });

    // Touch (or create) the progress row so "continue where you left off" reflects this visit.
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      update: {},
      create: { userId: session.user.id, lessonId: lesson.id },
    });
    await recordActivity(session.user.id);

    const completedCount = await prisma.progress.count({
      where: { userId: session.user.id, lessonId: { in: flatLessons.map((l) => l.id) }, completed: true },
    });
    clearance = Math.round((completedCount / flatLessons.length) * 100);

    const note = await prisma.note.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
      select: { content: true },
    });
    noteContent = note?.content ?? "";
  }

  const topicQuiz = topic.quizzes[0];
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const faqItems = (topic.faqItems as { question: string; answer: string }[] | null) ?? [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: `${topic.title} Tutorial`,
      description: topic.metaDescription ?? topic.description,
      provider: { "@type": "Organization", name: "Coding Spy", sameAs: baseUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: topic.title, item: `${baseUrl}/case-files/${topic.slug}` },
        {
          "@type": "ListItem",
          position: 3,
          name: lesson.title,
          item: `${baseUrl}/case-files/${topic.slug}/${lesson.slug}`,
        },
      ],
    },
    ...(faqItems.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="flex min-h-[calc(100vh-6.5rem)]">
        <SidebarNav topicSlug={topic.slug} chapters={topic.chapters} />
        <main className="flex-1 px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Case File · {topic.title}
                </p>
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
              </div>
              {session?.user && <MarkComplete lessonId={lesson.id} initiallyCompleted={progress?.completed ?? false} />}
            </div>

            {session?.user && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Clearance Level</span>
                <Progress value={clearance} className="max-w-xs" />
                <span className="text-xs font-semibold text-spy-cyan">{clearance}%</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="min-w-0">
                {session?.user && <NotesPanel lessonId={lesson.id} initialContent={noteContent} />}
                <LessonMarkdown content={lesson.contentMarkdown} />
              </div>
              <div className="h-[600px] lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)]">
                <Playground
                  lessonId={lesson.id}
                  language={lesson.language}
                  starterCode={lesson.starterCode}
                  savedCode={progress?.savedCode}
                  runnable={lesson.runnable}
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
              {prevLesson ? (
                <Link
                  href={`/case-files/${topic.slug}/${prevLesson.slug}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> {prevLesson.title}
                </Link>
              ) : (
                <span />
              )}
              {nextLesson && (
                <Link
                  href={`/case-files/${topic.slug}/${nextLesson.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-spy-cyan hover:underline"
                >
                  {nextLesson.title} <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {isLastLesson && topicQuiz && topicQuiz.questions.length > 0 && (
              <div className="mt-10">
                <Quiz
                  quizId={topicQuiz.id}
                  title={topicQuiz.title}
                  questions={topicQuiz.questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options as string[],
                    explanation: q.explanation,
                  }))}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
