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
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroFeatures: string;
  labCardLabel: string;
  labCardTitle: string;
  labCardCode: string;
  labCardDescription: string;
  moreCaseFilesTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>Primary Button Label</Label>
              <Input value={settings.heroPrimaryCtaLabel} onChange={(e) => update({ heroPrimaryCtaLabel: e.target.value })} />
            </div>
            <div>
              <Label>Primary Button Link</Label>
              <Input value={settings.heroPrimaryCtaHref} onChange={(e) => update({ heroPrimaryCtaHref: e.target.value })} placeholder="/signup" />
            </div>
            <div>
              <Label>Secondary Button Label</Label>
              <Input value={settings.heroSecondaryCtaLabel} onChange={(e) => update({ heroSecondaryCtaLabel: e.target.value })} />
            </div>
            <div>
              <Label>Secondary Button Link</Label>
              <Input value={settings.heroSecondaryCtaHref} onChange={(e) => update({ heroSecondaryCtaHref: e.target.value })} placeholder="#case-files" />
            </div>
          </div>
          <div>
            <Label>Feature Bullets (one per line)</Label>
            <textarea
              value={settings.heroFeatures}
              onChange={(e) => update({ heroFeatures: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>&quot;The Lab&quot; Preview Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Label</Label>
            <Input value={settings.labCardLabel} onChange={(e) => update({ labCardLabel: e.target.value })} />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={settings.labCardTitle} onChange={(e) => update({ labCardTitle: e.target.value })} />
          </div>
          <div>
            <Label>Code Snippet</Label>
            <textarea
              value={settings.labCardCode}
              onChange={(e) => update({ labCardCode: e.target.value })}
              rows={5}
              className="w-full rounded-lg border border-border bg-[#0d1117] p-2 font-mono text-xs text-foreground/90"
            />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              value={settings.labCardDescription}
              onChange={(e) => update({ labCardDescription: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-background/60 p-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grid Heading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>&quot;More Case Files&quot; Heading</Label>
            <Input value={settings.moreCaseFilesTitle} onChange={(e) => update({ moreCaseFilesTitle: e.target.value })} />
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
          <div>
            <Label>Button Label</Label>
            <Input value={settings.ctaButtonLabel} onChange={(e) => update({ ctaButtonLabel: e.target.value })} />
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
