"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Settings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  ctaTitle: string;
  ctaSubtitle: string;
};

export function HomepageEditor({ initialSettings }: { initialSettings: Settings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  function update(patch: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...patch }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not save homepage settings.");
      return;
    }
    toast.success("Homepage updated.");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Badge Text</Label>
            <Input value={settings.heroBadge} onChange={(e) => update({ heroBadge: e.target.value })} />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={settings.heroTitle} onChange={(e) => update({ heroTitle: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={settings.heroSubtitle} onChange={(e) => update({ heroSubtitle: e.target.value })} />
          </div>
          <div>
            <Label>Tagline (highlighted)</Label>
            <Input value={settings.heroTagline} onChange={(e) => update({ heroTagline: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={settings.ctaTitle} onChange={(e) => update({ ctaTitle: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={settings.ctaSubtitle} onChange={(e) => update({ ctaSubtitle: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Homepage"}
        </Button>
      </div>
    </div>
  );
}
