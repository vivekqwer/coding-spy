"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  blockquote: ({ children }) => (
    <blockquote className="my-4 rounded-lg border-l-4 border-spy-amber bg-spy-amber/10 px-4 py-2 text-sm">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? "");
    if (!isBlock) {
      return (
        <code className="rounded bg-card px-1.5 py-0.5 text-[0.85em] text-spy-cyan" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-border/60 bg-[#0d1117] p-4 text-sm">{children}</pre>
  ),
  h2: ({ children }) => <h2 className="mb-3 mt-8 text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-6 text-lg font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} className="text-spy-cyan underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export function LessonMarkdown({ content }: { content: string }) {
  return (
    <div className="prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
