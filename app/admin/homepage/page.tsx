import { redirect } from "next/navigation";
import { requireSection } from "@/lib/requireAdmin";
import { getSiteSettings } from "@/lib/site-settings";
import { HomepageEditor } from "@/components/admin/homepage-editor";

export default async function AdminHomepagePage() {
  const staff = await requireSection("homepage");
  if (!staff) redirect("/admin");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Homepage Editor</h1>
        <p className="text-sm text-muted-foreground">
          Edit the hero and call-to-action copy shown on the public homepage.
        </p>
      </div>
      <HomepageEditor initialSettings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
