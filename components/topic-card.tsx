"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type TopicCardData = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonCount: number;
};

export function TopicCard({ topic, index }: { topic: TopicCardData; index: number }) {
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[
    topic.icon
  ] ?? Icons.Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
    >
      <Link
        href={`/case-files/${topic.slug}`}
        className="group glass glow-border block h-full rounded-2xl p-5 transition hover:-translate-y-1"
      >
        <div
          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${topic.color}20` }}
        >
          <IconComp className="h-5 w-5" style={{ color: topic.color }} />
        </div>
        <h3 className="mb-1 font-semibold group-hover:text-spy-cyan">{topic.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
        <Badge>{topic.lessonCount} case files</Badge>
      </Link>
    </motion.div>
  );
}
