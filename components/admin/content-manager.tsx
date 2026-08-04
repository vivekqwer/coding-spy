"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ContentField, ContentMap } from "@/lib/content";

export function ContentManager({
  fields,
  initialValues,
}: {
  fields: ContentField[];
  initialValues: ContentMap;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ContentMap>(initialValues);
  const [saving, setSaving] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, ContentField[]>();
    for (const f of fields) {
      if (!map.has(f.group)) map.set(f.group, []);
      map.get(f.group)!.push(f);
    }
    return Array.from(map.entries());
  }, [fields]);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not save content.");
      return;
    }
    toast.success("Content updated.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
        <p className="text-sm text-muted-foreground">Har page/section ka text yahin se edit karo.</p>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save All Content"}
        </Button>
      </div>

      {groups.map(([group, items]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{group}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((f) => (
              <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                <Label>{f.label}</Label>
                {f.multiline ? (
                  <textarea
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
                  />
                ) : (
                  <Input
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save All Content"}
        </Button>
      </div>
    </div>
  );
}
