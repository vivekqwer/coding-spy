import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { LogoWithWordmark } from "@/components/logo";
import type { TopicCardData } from "@/lib/types";

export function SiteFooter({ topics }: { topics: TopicCardData[] }) {
  const topCaseFiles = topics.slice(0, 6);
  const moreCaseFiles = topics.slice(6, 12);

  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <LogoWithWordmark />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Coding Spy is optimized for hands-on learning. Case files, examples, and quizzes are continually
            reviewed for accuracy.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <Github className="h-4 w-4" />
            <Linkedin className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">Top Case Files</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {topCaseFiles.map((t) => (
              <li key={t.slug}>
                <Link href={`/case-files/${t.slug}`} className="hover:text-foreground">
                  {t.title} Tutorial
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">More Case Files</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {moreCaseFiles.map((t) => (
              <li key={t.slug}>
                <Link href={`/case-files/${t.slug}`} className="hover:text-foreground">
                  {t.title} Tutorial
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-spy-amber">Agent HQ</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/signup" className="hover:text-foreground">
                Request Clearance
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Agent Sign-In
              </Link>
            </li>
            <li>
              <Link href="/#case-files" className="hover:text-foreground">
                All Case Files
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Coding Spy. All secrets reserved.
      </div>
    </footer>
  );
}
