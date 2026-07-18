"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("coding-spy-theme") as "dark" | "light" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("coding-spy-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground transition hover:border-spy-cyan/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spy-cyan"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
