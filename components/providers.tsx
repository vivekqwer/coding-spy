"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { AiTutorWidget } from "@/components/ai-tutor-widget";
import { ContentProvider } from "@/components/content-provider";
import type { ContentMap } from "@/lib/content";

export function Providers({ content, children }: { content: ContentMap; children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ContentProvider value={content}>
        {children}
        <AiTutorWidget />
        <Toaster theme="dark" position="bottom-right" richColors />
      </ContentProvider>
    </SessionProvider>
  );
}
