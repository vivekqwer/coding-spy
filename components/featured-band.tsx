"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { TopicCardData } from "@/lib/types";

function IconFor(name: string) {
  return (
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[
      name
    ] ?? Icons.Code2
  );
}

export function FeaturedBand({ topic, reverse = false }: { topic: TopicCardData; reverse?: boolean }) {
  const IconComp = IconFor(topic.icon);
  const lessonHref = topic.firstLesson
    ? `/case-files/${topic.slug}/${topic.firstLesson.slug}`
    : `/case-files/${topic.slug}`;

  return (
    <section
      className="border-b border-border/60 py-14"
      style={{ background: `linear-gradient(180deg, ${topic.color}14, transparent 70%)` }}
    >
      <div className="container">
        <div className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <motion.div
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            style={{ direction: "ltr" }}
          >
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${topic.color}22` }}
            >
              <IconComp className="h-6 w-6" style={{ color: topic.color }} />
            </div>
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight">{topic.title}</h2>
            <p className="mb-6 max-w-md text-muted-foreground">{topic.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={lessonHref}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                style={{ backgroundColor: topic.color }}
              >
                Learn {topic.title}
              </Link>
              <Link
                href={`/case-files/${topic.slug}`}
                className="rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold transition hover:border-spy-cyan/50"
              >
                Case File · {topic.lessonCount} lessons
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ direction: "ltr" }}
          >
            <div className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {topic.title} Example
                </span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: topic.color }} />
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground/90">
                <code>{topic.firstLesson?.starterCode ?? "// Example coming soon"}</code>
              </pre>
              <div className="border-t border-border/60 p-3">
                <Link
                  href={lessonHref}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-spy-gradient px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                >
                  Try it in The Lab <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
