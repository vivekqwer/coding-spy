import { prisma } from "@/lib/prisma";
import { AiPromptHeader } from "@/components/ai-prompt-header";
import { PromptCard } from "@/components/prompt-card";

export const dynamic = "force-dynamic";

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPrompts = await prisma.prompt.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const categories = Array.from(new Set(allPrompts.map((p) => p.category)));
  const activeCategory = searchParams.category ?? null;
  const prompts = activeCategory ? allPrompts.filter((p) => p.category === activeCategory) : allPrompts;

  return (
    <>
      <AiPromptHeader categories={categories} activeCategory={activeCategory} />
      <main className="bg-background">
        <section className="border-b border-border/60 bg-gradient-to-b from-spy-violet/10 to-transparent py-10 sm:py-14">
          <div className="container">
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">AI Prompt Library</h1>
            <p className="max-w-xl text-muted-foreground">
              Ready-to-use prompts for HTML, React, 3D scroll animations, and more. Copy any prompt into your
              favorite AI to get real, working code instantly — or press Animate to preview it first.
            </p>
          </div>
        </section>

        <section className="container py-8 sm:py-10">
          {prompts.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No intel yet, Agent.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prompts.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={{
                    id: p.id,
                    category: p.category,
                    title: p.title,
                    promptText: p.promptText,
                    previewHtml: p.previewHtml,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
