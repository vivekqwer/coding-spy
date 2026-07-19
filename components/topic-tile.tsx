"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { TopicCardData } from "@/lib/types";

export function TopicTile({ topic, index }: { topic: TopicCardData; index: number }) {
  const lessonHref = topic.firstLesson
    ? `/case-files/${topic.slug}/${topic.firstLesson.slug}`
    : `/case-files/${topic.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
    >
      <Link
        href={lessonHref}
        className="relative flex h-full items-center justify-center rounded-xl px-4 py-6 text-center font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
        style={{ backgroundColor: `${topic.color}1F`, border: `1px solid ${topic.color}40`, color: topic.color }}
      >
        {topic.isPaid && <Lock className="absolute right-2 top-2 h-3.5 w-3.5" />}
        {topic.title}
      </Link>
    </motion.div>
  );
}
