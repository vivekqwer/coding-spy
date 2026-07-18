import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { TopicCard, type TopicCardData } from "@/components/topic-card";
import { SearchBar } from "@/components/search-bar";
import { LogoWithWordmark } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topics = await prisma.topic.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { chapters: true } }, chapters: { include: { _count: { select: { lessons: true } } } } },
  });

  const topicCards: TopicCardData[] = topics.map((t) => ({
    slug: t.slug,
    title: t.title,
    description: t.description,
    icon: t.icon,
    color: t.color,
    lessonCount: t.chapters.reduce((sum, c) => sum + c._count.lessons, 0),
  }));

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <section className="container flex flex-col items-center gap-6 py-20 text-center">
          <span className="rounded-full border border-spy-amber/30 bg-spy-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-spy-amber">
            Classified curriculum · 47 case files
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Decode. Learn. <span className="text-gradient">Master.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Coding Spy is your covert HQ for learning to code — hands-on case files, a live playground, and
            agent certifications for every skill you crack.
          </p>
          {topicCards.length > 0 ? (
            <SearchBar topics={topicCards} />
          ) : (
            <p className="text-sm text-muted-foreground">No intel yet, Agent. Run the seed script to load the archive.</p>
          )}
        </section>

        <section id="case-files" className="container pb-24">
          <h2 className="mb-6 text-2xl font-semibold">Open Case Files</h2>
          {topicCards.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No intel yet, Agent.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topicCards.map((topic, i) => (
                <TopicCard key={topic.slug} topic={topic} index={i} />
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-border/60 py-8">
          <div className="container flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <LogoWithWordmark className="opacity-80" />
            <span>© {new Date().getFullYear()} Coding Spy. All secrets reserved.</span>
          </div>
        </footer>
      </main>
    </>
  );
}
