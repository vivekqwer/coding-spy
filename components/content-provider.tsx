"use client";

import { createContext, useContext } from "react";
import type { ContentMap } from "@/lib/content";

const ContentContext = createContext<ContentMap>({});

export function ContentProvider({ value, children }: { value: ContentMap; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Client-side: read a content string by key, with an optional fallback. */
export function useContent() {
  const map = useContext(ContentContext);
  return (key: string, fallback = "") => map[key] ?? fallback;
}
