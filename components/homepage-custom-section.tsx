import Link from "next/link";
import { Button } from "@/components/ui/button";

type Section = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

export function HomepageCustomSection({ section, reverse }: { section: Section; reverse: boolean }) {
  return (
    <section className="border-b border-border/60 py-14">
      <div className="container">
        <div className={`grid grid-cols-1 items-center gap-10 ${section.imageUrl ? "lg:grid-cols-2" : ""} ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div style={{ direction: "ltr" }}>
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight">{section.title}</h2>
            {section.subtitle && <p className="mb-6 max-w-md text-muted-foreground">{section.subtitle}</p>}
            {section.buttonText && section.buttonLink && (
              <Link href={section.buttonLink}>
                <Button size="lg">{section.buttonText}</Button>
              </Link>
            )}
          </div>
          {section.imageUrl && (
            <div style={{ direction: "ltr" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.imageUrl}
                alt={section.title}
                className="w-full rounded-2xl border border-border/60 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
