import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { FeaturedBand } from "@/components/featured-band";
import { TopicTile } from "@/components/topic-tile";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import type { TopicCardData } from "@/lib/types";
import { ShieldCheck, Terminal, Award, Flame, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const FEATURED_COUNT = 11;

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const [topics, streakUser, lastProgress] = await Promise.all([
    prisma.topic.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { slug: true, language: true, starterCode: true },
            },
          },
        },
      },
    }),
    session?.user
      ? prisma.user.findUnique({ where: { id: session.user.id }, select: { currentStreak: true } })
      : Promise.resolve(null),
    session?.user
      ? prisma.progress.findFirst({
          where: { userId: session.user.id },
          orderBy: { updatedAt: "desc" },
          include: { lesson: { include: { chapter: { include: { topic: true } } } } },
        })
      : Promise.resolve(null),
  ]);

  const topicCards: TopicCardData[] = topics.map((t) => {
    const allLessons = t.chapters.flatMap((c) => c.lessons);
    return {
      slug: t.slug,
      title: t.title,
      description: t.description,
      icon: t.icon,
      color: t.color,
      lessonCount: allLessons.length,
      firstLesson: allLessons[0] ?? null,
      isPaid: t.isPaid,
      priceInCents: t.priceInCents,
      currency: t.currency,
    };
  });

  const featured = topicCards.slice(0, FEATURED_COUNT);
  const rest = topicCards.slice(FEATURED_COUNT);

  return (
    <>
      <Navbar />
      <main className="bg-background">
        {/* Hero */}
        <section className="border-b border-border/60 bg-gradient-to-b from-spy-violet/10 to-transparent">
          <div className="container grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="mb-4 inline-block rounded-full border border-spy-amber/30 bg-spy-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-spy-amber">
                Classified curriculum · 47 case files
              </span>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Decode. Learn. <span className="text-gradient">Master.</span>
              </h1>
              <p className="mb-6 max-w-md text-lg text-muted-foreground">
                Free tutorials, live code, and hands-on missions.
                <br />
                <span className="font-semibold text-spy-cyan">No sign-up needed, just start learning.</span>
              </p>
              <ul className="mb-6 grid max-w-md grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {[
                  ["Clearance Level tracking", ShieldCheck],
                  ["Live code playground", Terminal],
                  ["Agent Certification", Award],
                  ["AI-powered hints", ShieldCheck],
                ].map(([label, Icon]) => {
                  const IconComp = Icon as React.ComponentType<{ className?: string }>;
                  return (
                    <li key={label as string} className="flex items-center gap-2">
                      <IconComp className="h-4 w-4 text-spy-cyan" /> {label as string}
                    </li>
                  );
                })}
              </ul>
              <div className="mb-6 flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button size="lg">Request Clearance</Button>
                </Link>
                <Link href="#case-files">
                  <Button size="lg" variant="outline">
                    Browse Case Files
                  </Button>
                </Link>
              </div>
              <SearchBar topics={topicCards} />
            </div>

            {session?.user && lastProgress?.lesson ? (
              <div className="glass glow-border rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-spy-amber">
                    Continue where you left off
                  </p>
                  {!!streakUser?.currentStreak && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-spy-amber">
                      <Flame className="h-4 w-4" /> {streakUser.currentStreak}-day streak
                    </span>
                  )}
                </div>
                <p className="mb-1 text-sm text-muted-foreground">
                  {lastProgress.lesson.chapter.topic.title}
                </p>
                <p className="mb-5 text-xl font-semibold">{lastProgress.lesson.title}</p>
                <Link
                  href={`/case-files/${lastProgress.lesson.chapter.topic.slug}/${lastProgress.lesson.slug}`}
                >
                  <Button className="w-full">
                    Resume Mission <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="glass glow-border rounded-2xl p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-spy-amber">The Lab</p>
                <p className="mb-4 text-lg font-semibold">Run real code, right in the browser.</p>
                <pre className="overflow-x-auto rounded-xl border border-border/60 bg-[#0d1117] p-4 text-xs text-foreground/90">
                  <code>{`function demo() {
  console.log("Welcome, Agent.");
}

demo();`}</code>
                </pre>
                <p className="mt-4 text-sm text-muted-foreground">
                  Every case file ships with a live Monaco editor, sandboxed preview, real terminal, and an
                  AI hint on request.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured topic bands */}
        <div id="case-files">
          {featured.length === 0 ? (
            <div className="container py-16 text-center text-muted-foreground">No intel yet, Agent.</div>
          ) : (
            featured.map((topic, i) => <FeaturedBand key={topic.slug} topic={topic} reverse={i % 2 === 1} />)
          )}
        </div>

        {/* Remaining topics grid */}
        {rest.length > 0 && (
          <section className="container py-16">
            <h2 className="mb-6 text-2xl font-bold">More Case Files</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {rest.map((topic, i) => (
                <TopicTile key={topic.slug} topic={topic} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section className="border-y border-border/60 bg-spy-gradient/10 py-14 text-center">
          <div className="container">
            <h2 className="mb-3 text-2xl font-bold">Ready to earn your Agent Certification?</h2>
            <p className="mb-6 text-muted-foreground">
              Finish a case file, pass the quiz at 70% or higher, and download your certificate.
            </p>
            <Link href="/signup">
              <Button size="lg">Start Your First Mission</Button>
            </Link>
          </div>
        </section>

        <SiteFooter topics={topicCards} />
      </main>
    </>
  );
}
