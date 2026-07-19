"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { AiTutorWidget } from "@/components/ai-tutor-widget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AiTutorWidget />
      <Toaster theme="dark" position="bottom-right" richColors />
    </SessionProvider>
  );
}
