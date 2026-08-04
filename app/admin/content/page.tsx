import { redirect } from "next/navigation";
import { requireSection } from "@/lib/requireAdmin";
import { getContent, CONTENT_REGISTRY } from "@/lib/content";
import { ContentManager } from "@/components/admin/content-manager";

export default async function AdminContentPage() {
  const staff = await requireSection("content");
  if (!staff) redirect("/admin");

  const values = await getContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Content</h1>
        <p className="text-sm text-muted-foreground">
          Branding, navbar, footer, aur auth pages ka saara text ek jagah se edit karo. Save karte hi poori
          site par live ho jayega.
        </p>
      </div>
      <ContentManager fields={CONTENT_REGISTRY} initialValues={values} />
    </div>
  );
}
