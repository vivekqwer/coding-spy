import { redirect } from "next/navigation";
import { requireSection } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { PromptsManager } from "@/components/admin/prompts-manager";

export default async function AdminPromptsPage() {
  const staff = await requireSection("prompts");
  if (!staff) redirect("/admin");

  const prompts = await prisma.prompt.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Prompt Library</h1>
        <p className="text-sm text-muted-foreground">
          Manage the prompt cards shown on the public "AI Prompt" page — organized by category (HTML, React, 3D
          Scroll Animation, etc.), each with an optional live preview.
        </p>
      </div>
      <PromptsManager initialPrompts={JSON.parse(JSON.stringify(prompts))} />
    </div>
  );
}
