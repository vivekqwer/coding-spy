"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Linkedin, Twitter, Facebook, Link2 } from "lucide-react";

export function ShareButtons({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const links = [
    {
      label: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied.");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-spy-cyan/50 hover:text-spy-cyan"
        >
          <l.icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-spy-cyan/50 hover:text-spy-cyan"
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>
      {copied && <span className="text-xs text-green-500">Copied!</span>}
    </div>
  );
}
