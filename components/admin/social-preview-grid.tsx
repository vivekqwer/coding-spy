"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type SocialTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ogImage: string | null;
};

export function SocialPreviewGrid({ topics }: { topics: SocialTopic[] }) {
  const [siteUrl] = useState(() => (typeof window !== "undefined" ? window.location.origin : ""));

  async function copyLink(slug: string) {
    const url = `${siteUrl}/case-files/${slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied.");
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => {
        const ogUrl = topic.ogImage || `/api/og/${topic.slug}`;
        return (
          <Card key={topic.id}>
            <div className="aspect-[1200/630] w-full overflow-hidden rounded-t-2xl bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogUrl} alt={`${topic.title} social preview`} className="h-full w-full object-cover" />
            </div>
            <CardContent className="pt-4">
              <p className="mb-1 font-semibold">{topic.title}</p>
              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{topic.description}</p>
              <button
                onClick={() => copyLink(topic.slug)}
                className="flex items-center gap-1.5 text-xs text-spy-cyan hover:underline"
              >
                <Copy className="h-3.5 w-3.5" /> Copy share link
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
